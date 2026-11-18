/**
 * The ONE place where a banner is composed.
 * Both the on-screen preview and the PNG download call renderElysianBanner(),
 * so what you see is exactly what you download.
 *
 * This file is plain TypeScript: no React imports.
 */
import { themes, type ThemeConfig } from "../data/themes";
import type { BannerData, PhotoTransform } from "../types/banner";

/** Final export size in pixels. */
export const BANNER_WIDTH = 1080;
export const BANNER_HEIGHT = 1350;

/** Font stack used for the name. Swap in the project's brand font if it has one. */
const NAME_FONT_FAMILY = '"Playfair Display", Georgia, "Times New Roman", serif';

/** Theme overlays never change, so load each only once and reuse it. */
const overlayCache = new Map<string, Promise<HTMLImageElement>>();

/** Load an image URL into an HTMLImageElement (cached). */
function loadImage(src: string): Promise<HTMLImageElement> {
  let cached = overlayCache.get(src);
  if (!cached) {
    cached = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        overlayCache.delete(src); // allow a retry later
        reject(new Error(`Could not load image: ${src}`));
      };
      img.src = src;
    });
    overlayCache.set(src, cached);
  }
  return cached;
}

/**
 * Work out where to draw the photo so it fills the frame ("cover" behaviour)
 * and respects the user's zoom and offset.
 */
function computePhotoRect(
  imgW: number,
  imgH: number,
  frame: ThemeConfig["photoFrame"],
  t: PhotoTransform,
) {
  // Smallest scale at which the photo still covers the whole frame.
  const coverScale = Math.max(frame.width / imgW, frame.height / imgH);
  const scale = coverScale * t.zoom;
  const drawW = imgW * scale;
  const drawH = imgH * scale;

  // "Slack" is how much of the photo hangs outside the frame on each axis.
  // Offsets move the photo within that slack, so it can never expose a gap.
  const slackX = drawW - frame.width;
  const slackY = drawH - frame.height;

  return {
    x: frame.x - slackX / 2 + (t.offsetX * slackX) / 2,
    y: frame.y - slackY / 2 + (t.offsetY * slackY) / 2,
    width: drawW,
    height: drawH,
  };
}

/** Shrink the font until the text fits maxWidth (or we hit a minimum). */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  startSize: number,
  maxWidth: number,
): number {
  let size = startSize;
  while (size > 16) {
    ctx.font = `700 ${size}px ${NAME_FONT_FAMILY}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

/**
 * Compose the banner.
 * @param data   name, theme, photo and crop settings
 * @param target optional existing canvas to draw into (the preview passes its
 *               own); if omitted a fresh offscreen canvas is created (download).
 * @returns the finished 1080 x 1350 canvas
 */
export async function renderElysianBanner(
  data: BannerData,
  target?: HTMLCanvasElement,
): Promise<HTMLCanvasElement> {
  const theme = themes[data.theme];

  // ---- 1. Load everything FIRST (all the awaits happen here) -------------
  // Drawing below is fully synchronous, so two overlapping renders into the
  // same canvas can never interleave and produce a half-drawn mix.
  const [overlay, photoBitmap] = await Promise.all([
    loadImage(theme.overlay),
    // createImageBitmap decodes the File in the browser (no upload) and
    // applies EXIF rotation, so phone photos aren't sideways.
    data.photo ? createImageBitmap(data.photo) : Promise.resolve(null),
    // Make sure web fonts are ready, otherwise canvas silently uses a fallback.
    document.fonts.ready,
  ]);

  // ---- 2. Prepare the canvas ---------------------------------------------
  const canvas = target ?? document.createElement("canvas");
  canvas.width = BANNER_WIDTH; // setting width/height also clears the canvas
  canvas.height = BANNER_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not supported in this browser.");

  // ---- 3. Draw the artwork first -----------------------------------------
  // The supplied artwork contains an opaque placeholder inside the frame.
  // Drawing it first lets the user's photo replace that placeholder without
  // covering the surrounding artwork.
  ctx.drawImage(overlay, 0, 0, BANNER_WIDTH, BANNER_HEIGHT);

  // ---- 4. Draw the user's photo, clipped to the design's photo frame -----
  if (photoBitmap) {
    const { photoFrame: f } = theme;
    ctx.save(); // remember state so the clip only affects the photo
    ctx.beginPath();
    if (f.shape === "circle") {
      ctx.ellipse(
        f.x + f.width / 2,
        f.y + f.height / 2,
        f.width / 2,
        f.height / 2,
        0,
        0,
        Math.PI * 2,
      );
    } else {
      ctx.rect(f.x, f.y, f.width, f.height);
    }
    ctx.clip(); // everything drawn until restore() is cropped to this shape

    const r = computePhotoRect(
      photoBitmap.width,
      photoBitmap.height,
      f,
      data.transform,
    );
    ctx.imageSmoothingQuality = "high";
    ctx.translate(f.x + f.width / 2, f.y + f.height / 2);
    ctx.rotate((data.transform.rotation * Math.PI) / 180);
    ctx.drawImage(photoBitmap, r.x - (f.x + f.width / 2), r.y - (f.y + f.height / 2), r.width, r.height);
    ctx.restore();
    photoBitmap.close(); // free the decoded pixels
  }

  // ---- 5. Draw the name (always uppercase) -------------------------------
  const name = data.fullName.trim().toUpperCase();
  if (name) {
    const s = theme.nameStyle;
    const size = fitFontSize(ctx, name, s.fontSize, s.maxWidth);
    ctx.font = `700 ${size}px ${NAME_FONT_FAMILY}`;
    ctx.fillStyle = s.color;
    ctx.textAlign = s.align;
    ctx.textBaseline = "middle";
    ctx.fillText(name, s.x, s.y);
  }

  return canvas;
}

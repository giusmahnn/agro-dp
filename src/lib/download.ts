/**
 * Turns a finished canvas into a downloaded PNG file.
 * Pipeline: canvas -> toBlob() -> object URL -> temporary <a> -> click.
 */

/** "John Doe" -> "John-Doe-elysian-relaunch.png" (safe on every OS). */
export function buildFilename(fullName: string): string {
  const safe = fullName
    .trim()
    .normalize("NFKD") // split accented letters: "é" -> "e" + accent mark
    .replace(/[\u0300-\u036f]/g, "") // drop the accent marks
    .replace(/[^a-zA-Z0-9]+/g, "-") // anything else becomes a hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  return `${safe || "elysian"}-elysian-relaunch.png`;
}

/** Wrap the callback-style canvas.toBlob in a Promise. */
function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create the PNG."));
    }, "image/png");
  });
}

/** Trigger a browser download of the canvas as a PNG. */
export async function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  fullName: string,
): Promise<void> {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = buildFilename(fullName);
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revoke once the browser has had a chance to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

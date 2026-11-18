import type { ElysianTheme } from "../types/banner";

/** A rectangle in banner pixels (the banner is 1080 x 1350). */
export interface PhotoFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  /** "rect" crops to a rectangle, "circle" crops to an ellipse in the frame. */
  shape: "rect" | "circle";
}

/** Where and how the user's name is drawn. */
export interface NameStyle {
  /** Anchor point. With align "center", x is the horizontal middle of the text. */
  x: number;
  y: number;
  /** Text is shrunk automatically until it fits inside this width. */
  maxWidth: number;
  /** Starting (largest) font size in px. */
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
}

export interface ThemeConfig {
  /** Label shown in the theme selector. */
  name: string;
  /**
   * The finished Elysian artwork. The renderer draws the artwork first, then
   * replaces the configured photo frame with the user's image.
   */
  overlay: string;
  photoFrame: PhotoFrame;
  nameStyle: NameStyle;
}

/**
 * The theme registry. The whole app (selector, renderer) reads from here,
 * so adding a theme = add an id to `ElysianTheme` + add one entry below.
 *
 * The supplied artwork is scaled to the renderer's 1080 x 1350 canvas. These
 * coordinates match its 436px circular photo placeholder.
 */
export const themes = {
  blue: {
    name: "Blue",
    overlay: "/banner.png",
    photoFrame: { x: 322, y: 368, width: 436, height: 436, shape: "circle" },
    nameStyle: {
      x: 540,
      y: 849,
      maxWidth: 820,
      fontSize: 64,
      color: "#E99C0C", // Golden Orange
      align: "center",
    },
  },
  white: {
    name: "White",
    overlay: "/banner.png",
    photoFrame: { x: 322, y: 368, width: 436, height: 436, shape: "circle" },
    nameStyle: {
      x: 540,
      y: 849,
      maxWidth: 820,
      fontSize: 64,
      color: "#6F0500", // Dark Garnet
      align: "center",
    },
  },
} satisfies Record<ElysianTheme, ThemeConfig>;

/** Array form, handy for rendering the selector with .map(). */
export const themeList = (Object.keys(themes) as ElysianTheme[]).map((id) => ({
  id,
  ...themes[id],
}));

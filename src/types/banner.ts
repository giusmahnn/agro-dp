/** Identifier of an available theme. Add a new string here when adding a theme. */
export type ElysianTheme = "blue";

/**
 * How the user has positioned their photo inside the design's photo frame.
 * - zoom:    1 = photo just covers the frame, 3 = zoomed in 3x
 * - offsetX: -1 (show left edge) .. 0 (centered) .. 1 (show right edge)
 * - offsetY: -1 (show top edge)  .. 0 (centered) .. 1 (show bottom edge)
 */
export interface PhotoTransform {
  zoom: number;
  offsetX: number;
  offsetY: number;
  /** Rotation in degrees, clockwise. */
  rotation: number;
}

/** Everything the renderer needs to draw one banner. */
export interface BannerData {
  fullName: string;
  theme: ElysianTheme;
  photo: File | null;
  transform: PhotoTransform;
}

/** Starting position: centered, no extra zoom. */
export const DEFAULT_TRANSFORM: PhotoTransform = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

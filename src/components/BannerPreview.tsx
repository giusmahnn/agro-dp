import { useEffect, useRef, useState } from "react";
import type { BannerData } from "../types/banner";
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  renderElysianBanner,
} from "../lib/renderer";

/**
 * Displays the banner. It contains NO drawing logic: it just hands its
 * <canvas> to renderElysianBanner() whenever the data changes.
 */
export default function BannerPreview({ data }: { data: BannerData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");

  const { fullName, theme, photo, transform } = data;

  useEffect(() => {
    if (!canvasRef.current) return;
    renderElysianBanner(
      { fullName, theme, photo, transform },
      canvasRef.current,
    )
      .then(() => setError(""))
      .catch((e: Error) => setError(e.message));
  }, [fullName, theme, photo, transform]);

  return (
    <div className="preview">
      {/*
        width/height attributes = the real 1080 x 1350 drawing surface.
        CSS (width:100%; height:auto) only scales how it is DISPLAYED,
        so the aspect ratio never distorts and the export stays 1080x1350.
      */}
      <canvas
        ref={canvasRef}
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
        className="preview__canvas"
        aria-label="Banner preview"
      />
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

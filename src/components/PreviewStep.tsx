import { useState } from "react";
import type { BannerData } from "../types/banner";
import BannerPreview from "./BannerPreview";
import { renderElysianBanner } from "../lib/renderer";
import { downloadCanvasAsPng } from "../lib/download";

interface Props {
  data: BannerData;
  onBack: () => void;
}

/** Step 3: final preview + download. */
export default function PreviewStep({ data, onBack }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setBusy(true);
    setError("");
    try {
      // Same renderer as the preview, drawing into a fresh offscreen canvas.
      const canvas = await renderElysianBanner(data);
      await downloadCanvasAsPng(canvas, data.fullName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <h2>Your banner is ready</h2>
      <BannerPreview data={data} />

      {error && <p className="error" role="alert">{error}</p>}

      <div className="actions">
        <button className="btn" onClick={onBack}>Back</button>
        <button
          className="btn btn--primary"
          onClick={handleDownload}
          disabled={busy}
        >
          {busy ? "Preparing…" : "Download PNG"}
        </button>
      </div>
    </section>
  );
}

import type { BannerData, PhotoTransform } from "../types/banner";
import PhotoUploader from "./PhotoUploader";
import BannerPreview from "./BannerPreview";

interface Props {
  data: BannerData;
  error: string;
  onPhotoChange: (file: File | null) => void;
  onTransformChange: (t: PhotoTransform) => void;
  onBack: () => void;
  onContinue: () => void;
}

/** Step 2: upload, then position and zoom the photo with a live preview. */
export default function PhotoStep(p: Props) {
  const { transform } = p.data;

  /** Update one field of the transform, keeping the others. */
  const set = (patch: Partial<PhotoTransform>) =>
    p.onTransformChange({ ...transform, ...patch });

  return (
    <section className="card">
      <h2>Add your photo</h2>
      <p className="subtitle">Your photo stays on your device. Nothing is uploaded.</p>

      <PhotoUploader photo={p.data.photo} onChange={p.onPhotoChange} />

      {p.data.photo && (
        <>
          {/* The live preview uses the SAME renderer as the final download. */}
          <BannerPreview data={p.data} />

          <div className="sliders">
            <label>
              Zoom
              <input
                type="range" min={1} max={3} step={0.01}
                value={transform.zoom}
                onChange={(e) => set({ zoom: Number(e.target.value) })}
              />
            </label>
            <label>
              Left / right
              <input
                type="range" min={-1} max={1} step={0.01}
                value={transform.offsetX}
                onChange={(e) => set({ offsetX: Number(e.target.value) })}
              />
            </label>
            <label>
              Up / down
              <input
                type="range" min={-1} max={1} step={0.01}
                value={transform.offsetY}
                onChange={(e) => set({ offsetY: Number(e.target.value) })}
              />
            </label>
            <label>
              Rotate
              <input
                type="range" min={-180} max={180} step={1}
                value={transform.rotation}
                onChange={(e) => set({ rotation: Number(e.target.value) })}
              />
              <span className="slider-value">{transform.rotation}°</span>
            </label>
          </div>
        </>
      )}

      {p.error && <p className="error" role="alert">{p.error}</p>}

      <div className="actions">
        <button className="btn" onClick={p.onBack}>Back</button>
        <button className="btn btn--primary" onClick={p.onContinue}>Continue</button>
      </div>
    </section>
  );
}

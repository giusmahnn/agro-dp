import type { ElysianTheme } from "../types/banner";
import ThemeSelector from "./ThemeSelector";

interface Props {
  fullName: string;
  theme: ElysianTheme;
  error: string;
  onNameChange: (value: string) => void;
  onThemeChange: (theme: ElysianTheme) => void;
  onContinue: () => void;
}

/** Step 1: name + theme. */
export default function DetailsStep(p: Props) {
  return (
    <section className="card">
      <h1>Create Your Elysian Relaunch Banner</h1>
      <p className="subtitle">
        Create a shareable Elysian Relaunch photo for social media
      </p>

      <label className="field" htmlFor="fullName">
        <span className="field__label">Full name</span>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={p.fullName}
          onChange={(e) => p.onNameChange(e.target.value)}
          autoComplete="name"
        />
      </label>

      {/* Live hint of how the name will appear on the banner. */}
      {p.fullName.trim() && (
        <p className="hint">
          Appears as: <strong>{p.fullName.trim().toUpperCase()}</strong>
        </p>
      )}

      <ThemeSelector selected={p.theme} onSelect={p.onThemeChange} />

      {p.error && <p className="error" role="alert">{p.error}</p>}

      <div className="actions">
        <button className="btn btn--primary" onClick={p.onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}

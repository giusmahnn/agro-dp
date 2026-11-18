import { themeList } from "../data/themes";
import type { ElysianTheme } from "../types/banner";

interface Props {
  selected: ElysianTheme;
  onSelect: (theme: ElysianTheme) => void;
}

/**
 * Renders one option per entry in themes.ts. Nothing here knows about "blue"
 * or "white", so new themes appear automatically.
 */
export default function ThemeSelector({ selected, onSelect }: Props) {
  return (
    <fieldset className="themes">
      <legend className="field__label">Theme</legend>
      <div className="themes__grid">
        {themeList.map((t) => (
          <label
            key={t.id}
            className={`theme ${selected === t.id ? "theme--selected" : ""}`}
          >
            {/* A real radio input keeps keyboard + screen-reader support. */}
            <input
              type="radio"
              name="theme"
              value={t.id}
              checked={selected === t.id}
              onChange={() => onSelect(t.id)}
            />
            <img src={t.overlay} alt="" className="theme__thumb" />
            <span className="theme__name">{t.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

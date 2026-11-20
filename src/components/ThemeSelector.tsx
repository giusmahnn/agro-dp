import { themeList } from "../data/themes";
import type { ElysianTheme } from "../types/banner";

interface Props {
  selected: ElysianTheme;
  onSelect: (theme: ElysianTheme) => void;
}

/** Renders the currently available banner theme. */
export default function ThemeSelector({ selected, onSelect }: Props) {
  return (
    <fieldset className="themes">
      <legend className="field__label">Theme</legend>
      <div className="themes__grid">
        {themeList
          .filter((t) => t.id === "blue")
          .map((t) => (
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
          </label>
        ))}
        {/* Future theme:
        <label className="theme">
          <input type="radio" name="theme" value="white" />
          <img src="/banner.webp" alt="" className="theme__thumb" />
        </label>
        */}
      </div>
    </fieldset>
  );
}

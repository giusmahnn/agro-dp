const STEPS = ["Details", "Photo", "Preview"];

interface Props {
  currentStep: number; // 1-based
}

/** Shows which step is done, which is current, and which is still ahead. */
export default function ProgressSteps({ currentStep }: Props) {
  return (
    <ol className="progress" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        // Derive a status from the step number; CSS styles each one.
        const status =
          n < currentStep ? "done" : n === currentStep ? "current" : "upcoming";
        return (
          <li
            key={label}
            className={`progress__item progress__item--${status}`}
            aria-current={status === "current" ? "step" : undefined}
          >
            <span className="progress__dot">{status === "done" ? "✓" : n}</span>
            <span className="progress__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

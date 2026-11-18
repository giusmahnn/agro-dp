import { useState } from "react";
import {
  DEFAULT_TRANSFORM,
  type BannerData,
  type ElysianTheme,
  type PhotoTransform,
} from "../types/banner";
import ProgressSteps from "./ProgressSteps";
import DetailsStep from "./DetailsStep";
import PhotoStep from "./PhotoStep";
import PreviewStep from "./PreviewStep";

/**
 * The controller. It owns ALL the state and passes slices down as props
 * ("lifting state up"). Plain useState is enough for an app this size.
 */
export default function BannerCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [theme, setTheme] = useState<ElysianTheme>("blue");
  const [photo, setPhoto] = useState<File | null>(null);
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM);
  const [error, setError] = useState("");

  // One object that describes the banner; this is what the renderer consumes.
  const bannerData: BannerData = { fullName, theme, photo, transform };

  /** Move to a step and clear any old validation message. */
  function goTo(step: number) {
    setError("");
    setCurrentStep(step);
  }

  function continueFromDetails() {
    if (!fullName.trim()) return setError("Enter your full name to continue.");
    goTo(2);
  }

  function continueFromPhoto() {
    if (!photo) return setError("Upload a photo to continue.");
    goTo(3);
  }

  /** A new photo should start centered, not inherit the last crop. */
  function changePhoto(file: File | null) {
    setPhoto(file);
    setTransform(DEFAULT_TRANSFORM);
    setError("");
  }

  return (
    <>
      <header className="site-nav">
        <div className="site-nav__inner">
          <a className="brand" href="/" aria-label="Elysian home">
            <img src="/logo.png" alt="Elysian logo" />
          </a>
          {/* <nav className="site-nav__links" aria-label="Main navigation">
            <a href="#generator">Elysian Websiter</a>
            <a href="#how-it-works">How it works</a>
          </nav> */}
          {/* <span className="site-nav__tag">Relaunch 2026</span> */}
        </div>
      </header>
      <div className="creator" id="generator">
      <ProgressSteps currentStep={currentStep} />

      {currentStep === 1 && (
        <DetailsStep
          fullName={fullName}
          theme={theme}
          error={error}
          onNameChange={(v) => {
            setFullName(v);
            setError("");
          }}
          onThemeChange={setTheme}
          onContinue={continueFromDetails}
        />
      )}

      {currentStep === 2 && (
        <PhotoStep
          data={bannerData}
          error={error}
          onPhotoChange={changePhoto}
          onTransformChange={setTransform}
          onBack={() => goTo(1)}
          onContinue={continueFromPhoto}
        />
      )}

      {currentStep === 3 && (
        <PreviewStep data={bannerData} onBack={() => goTo(2)} />
      )}
      </div>
    </>
  );
}

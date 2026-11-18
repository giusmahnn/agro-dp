import { useEffect, useRef, useState } from "react";

/** File types we accept. Checked against file.type (the MIME type). */
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  photo: File | null;
  onChange: (file: File | null) => void;
}

/** Upload button + thumbnail of the chosen photo, with Change / Remove. */
export default function PhotoUploader({ photo, onChange }: Props) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Create an object URL for the <img> thumbnail whenever the file changes.
  // The cleanup function revokes the previous URL, so repeatedly swapping
  // photos does not leak memory.
  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("That file type isn't supported. Choose a JPG, PNG or WebP image.");
      return;
    }
    setError("");
    onChange(file);
  }

  async function openCamera() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported by this browser. Please upload a photo instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (e) {
      const reason = e instanceof DOMException && e.name === "NotAllowedError"
        ? "Camera permission was denied. Allow camera access in your browser and try again."
        : "Unable to open the camera. Check that your camera is available and try again.";
      setError(reason);
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError("The camera is still starting. Wait a moment and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Could not capture the photo. Please try again.");
        return;
      }
      handleFile(new File([blob], "camera-photo.jpg", { type: "image/jpeg" }));
      closeCamera();
    }, "image/jpeg", 0.92);
  }

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return (
    <div className="uploader">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = ""; // lets the user pick the same file again
        }}
      />
      {cameraOpen ? (
        <div className="camera">
          <video ref={videoRef} autoPlay playsInline muted aria-label="Live camera preview" />
          <div className="camera__actions">
            <button className="btn btn--ghost" type="button" onClick={closeCamera}>Cancel</button>
            <button className="btn btn--primary" type="button" onClick={capturePhoto}>Capture photo</button>
          </div>
        </div>
      ) : photo && previewUrl ? (
        <div className="uploader__selected">
          <div className="uploader__thumb">
            <img src={previewUrl} alt="Your selected photo" />
            <span className="uploader__thumb-badge">Ready</span>
          </div>
          <div className="uploader__buttons">
            <button className="btn" onClick={() => uploadInputRef.current?.click()}>
              Change photo
            </button>
            <button className="btn btn--ghost" onClick={openCamera}>
              Take a new photo
            </button>
            <button className="btn btn--ghost" onClick={() => onChange(null)}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          className="uploader__drop"
          onClick={() => uploadInputRef.current?.click()}
        >
          <span className="uploader__icon" aria-hidden="true">+</span>
          <strong>Add your profile photo</strong>
          <span>Upload an image or use your camera</span>
          <span className="uploader__choices">
            <span className="btn btn--primary" role="presentation">Upload photo</span>
            <span className="btn" role="presentation" onClick={(e) => {
              e.stopPropagation();
              void openCamera();
            }}>Take a picture</span>
          </span>
        </button>
      )}

      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

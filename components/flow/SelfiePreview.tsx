"use client";

import { useState } from "react";

type SelfiePreviewProps = {
  selfie: { file: File; previewUrl: string };
  className: string;
};

export function SelfiePreview({ selfie, className }: SelfiePreviewProps) {
  const [previewFailed, setPreviewFailed] = useState(false);

  if (previewFailed) {
    return (
      <p className="break-all px-4 text-center text-sm text-zinc-700">
        {selfie.file.name} selected. This browser can’t preview this file.
      </p>
    );
  }

  return (
    // The temporary browser URL can only be read by the browser.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={selfie.previewUrl} alt="Your selfie" className={className} onError={() => setPreviewFailed(true)} />
  );
}

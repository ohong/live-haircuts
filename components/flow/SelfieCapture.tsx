"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { SelfiePreview } from "./SelfiePreview";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const ACCEPTED_FILES = [...IMAGE_TYPES, ".heic", ".heif"].join(",");

type SelfieCaptureProps = {
  onCapture: (file: File) => void;
  selfie: { file: File; previewUrl: string } | null;
};

export function SelfieCapture({ onCapture, selfie }: SelfieCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      // Some browsers leave the MIME type blank for HEIC and HEIF files.
      const heifExtension = file.name.match(/\.(hei[cf])$/i)?.[1];
      const inferredType = !file.type && heifExtension ? `image/${heifExtension.toLowerCase()}` : null;
      const imageType = inferredType ?? file.type;
      if (!IMAGE_TYPES.includes(imageType)) {
        setError("Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Image must be under 5MB.");
        return;
      }

      onCapture(inferredType ? new File([file], file.name, { type: imageType, lastModified: file.lastModified }) : file);
    },
    [onCapture]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors focus-within:ring-2 focus-within:ring-zinc-900 ${
          dragOver
            ? "border-zinc-900 bg-zinc-50"
            : "border-zinc-300 bg-zinc-50/50"
        }`}
      >
        {selfie ? (
          <SelfiePreview key={selfie.previewUrl} selfie={selfie} className="h-64 w-64 rounded-xl object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="text-4xl">📸</div>
            <p className="text-sm font-medium text-zinc-700">
              Take a selfie or drop a photo here
            </p>
            <p className="text-xs text-zinc-500">JPEG, PNG, WebP, HEIC, or HEIF up to 5 MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILES}
          capture="user"
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload selfie"
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {selfie && (
        <Button
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          className="w-full"
        >
          Change photo
        </Button>
      )}
    </div>
  );
}

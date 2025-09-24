"use client";

import Image from "next/image";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type ImageUploadProps = {
  onImageSelected: (file: File | null) => void;
  onError: (message: string) => void;
  previewUrl: string | null;
  disabled?: boolean;
};

export function ImageUpload({
  onImageSelected,
  onError,
  previewUrl,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      return "Unsupported file type. Please use JPEG, PNG, or HEIC.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File is larger than 5MB.";
    }

    return "";
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onImageSelected(null);
        return;
      }

      const validationError = validateFile(file);

      if (validationError) {
        onError(validationError);
        onImageSelected(null);
        return;
      }

      onImageSelected(file);
    },
    [onError, onImageSelected, validateFile],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const [file] = event.target.files ?? [];
      handleFile(file ?? null);
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      if (disabled) return;
      setIsDragging(false);

      const [file] = event.dataTransfer.files ?? [];
      handleFile(file ?? null);
    },
    [disabled, handleFile],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const openFilePicker = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  return (
    <div className="space-y-4">
      <label
        htmlFor="image-upload"
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-8 py-10 text-center transition-colors duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-500 ${
          disabled
            ? "cursor-not-allowed border-zinc-300 bg-zinc-100 text-zinc-400"
            : isDragging
            ? "border-sky-500 bg-sky-50 text-sky-700"
            : "cursor-pointer border-zinc-300 bg-white hover:border-sky-500 hover:bg-sky-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <span className="text-2xl" aria-hidden>
              ⬆️
            </span>
          </div>
          <p className="text-base font-medium">Drag & drop your photo</p>
          <p className="text-sm text-zinc-600">
            or <button type="button" onClick={openFilePicker} className="font-semibold text-sky-600 underline">browse</button> to select a file
          </p>
          <p className="text-xs text-zinc-500">
            JPEG, PNG, or HEIC up to 5MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          id="image-upload"
          name="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif"
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </label>

      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <Image
            src={previewUrl}
            alt="Uploaded preview"
            width={768}
            height={768}
            className="h-64 w-full object-cover"
            unoptimized
          />
        </div>
      ) : null}
    </div>
  );
}

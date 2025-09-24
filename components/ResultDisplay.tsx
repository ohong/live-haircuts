"use client";

import Image from "next/image";

type ResultDisplayProps = {
  originalImage: string | null;
  resultImage: string | null;
  requestId: string | null;
  isLoading: boolean;
  onTryAnother: () => void;
  onReset: () => void;
};

export function ResultDisplay({
  originalImage,
  resultImage,
  requestId,
  isLoading,
  onTryAnother,
  onReset,
}: ResultDisplayProps) {
  if (!originalImage && !resultImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      {resultImage ? (
        <div className="grid gap-4 md:grid-cols-2">
          <figure className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <Image
              src={originalImage ?? ""}
              alt="Original upload"
              width={768}
              height={768}
              className="h-full w-full object-cover"
              unoptimized
            />
            <figcaption className="border-t bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600">
              Original photo
            </figcaption>
          </figure>

          <figure className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <Image
              src={resultImage}
              alt="AI-edited haircut"
              width={768}
              height={768}
              className="h-full w-full object-cover"
              unoptimized
            />
            <figcaption className="border-t bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600">
              AI makeover
            </figcaption>
          </figure>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <Image
            src={originalImage ?? ""}
            alt="Original upload"
            width={768}
            height={768}
            className="h-full w-full object-cover"
            unoptimized
          />
          <div className="border-t bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
            {isLoading ? "Generating haircut…" : "Your uploaded photo"}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {resultImage ? (
          <button
            type="button"
            onClick={onTryAnother}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            Try Another Style
          </button>
        ) : null}

        {originalImage ? (
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upload New Photo
          </button>
        ) : null}

        {requestId ? (
          <span className="text-xs text-zinc-500">Request ID: {requestId}</span>
        ) : null}
      </div>
    </div>
  );
}

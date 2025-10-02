"use client";

import Image from "next/image";

type ResultDisplayProps = {
  originalImage: string | null;
  resultImage: string | null;
  requestId: string | null;
  animationPrompt: string | null;
  animationModel: string | null;
  animationUrl: string | null;
  animationRequestId: string | null;
  isPromptLoading: boolean;
  isAnimationLoading: boolean;
  isLoading: boolean;
  onGenerateAnimation: () => void;
  onTryAnother: () => void;
  onReset: () => void;
};

export function ResultDisplay({
  originalImage,
  resultImage,
  requestId,
  animationPrompt,
  animationModel,
  animationUrl,
  animationRequestId,
  isPromptLoading,
  isAnimationLoading,
  onGenerateAnimation,
  isLoading,
  onTryAnother,
  onReset,
}: ResultDisplayProps) {
  if (!originalImage && !resultImage && !animationPrompt && !animationUrl) {
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
        {resultImage && !animationUrl ? (
          <button
            type="button"
            onClick={onGenerateAnimation}
            disabled={isLoading || isPromptLoading || isAnimationLoading}
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {isPromptLoading ? "Generating prompt…" : isAnimationLoading ? "Creating video…" : "See it live ✨"}
          </button>
        ) : null}

        {resultImage ? (
          <button
            type="button"
            onClick={onTryAnother}
            disabled={isLoading || isPromptLoading || isAnimationLoading}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            Try Another Style
          </button>
        ) : null}

        {originalImage ? (
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading || isPromptLoading || isAnimationLoading}
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upload New Photo
          </button>
        ) : null}

        {requestId ? (
          <span className="text-xs text-zinc-500">Request ID: {requestId}</span>
        ) : null}

      </div>

      {animationUrl ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md">
            <video
              src={animationUrl}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="h-auto w-full"
            >
              Your browser does not support the video tag.
            </video>
            <div className="border-t bg-zinc-50 px-4 py-2">
              <p className="text-sm font-medium text-zinc-700">Your transformation animation</p>
              {animationRequestId ? (
                <p className="text-xs text-zinc-500">Request ID: {animationRequestId}</p>
              ) : null}
            </div>
          </div>
          {animationPrompt ? (
            <details className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer text-sm font-semibold text-zinc-700 hover:text-zinc-900">
                View animation prompt
              </summary>
              {animationModel ? (
                <p className="mt-2 text-xs text-zinc-500">Model: {animationModel}</p>
              ) : null}
              <pre className="mt-2 whitespace-pre-wrap break-words text-[11px] text-zinc-600">
                {animationPrompt}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

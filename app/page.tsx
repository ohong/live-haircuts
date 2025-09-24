"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ImageUpload } from "@/components/ImageUpload";
import { PromptInput } from "@/components/PromptInput";
import { ResultDisplay } from "@/components/ResultDisplay";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 30_000;

type ErrorEntry = {
  id: string;
  message: string;
  status?: number;
  details?: unknown;
  timestamp: string;
};

type FalSuccessResponse = {
  imageUrl: string;
  requestId: string;
};

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorEntry[]>([]);

  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const pushError = useCallback(
    (message: string, details?: unknown, status?: number) => {
      setErrors((previous) => [
        {
          id: generateId(),
          message,
          status,
          details,
          timestamp: new Date().toISOString(),
        },
        ...previous,
      ]);
    },
    [],
  );

  const dismissError = useCallback((id: string) => {
    setErrors((previous) => previous.filter((entry) => entry.id !== id));
  }, []);

  const resetPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreviewUrl(null);
  }, []);

  const handleImageSelected = useCallback(
    (file: File | null) => {
      setSelectedFile(file);
      setResultUrl(null);
      setRequestId(null);

      if (!file) {
        resetPreview();
        return;
      }

      const nextUrl = URL.createObjectURL(file);
      resetPreview();
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    },
    [resetPreview],
  );

  const handleImageError = useCallback(
    (message: string) => {
      if (!message) return;
      pushError(message);
    },
    [pushError],
  );

  const handleGenerate = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (!selectedFile) {
      pushError("Upload a photo before generating a haircut.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      pushError("Image exceeds the 5MB size limit.");
      return;
    }

    if (!prompt.trim()) {
      pushError("Tell us what haircut you want before submitting.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Contacting Fal.ai…");
    setResultUrl(null);
    setRequestId(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("prompt", prompt.trim());

      const response = await fetch("/api/generate-haircut", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        let payload: unknown = null;

        try {
          payload = await response.json();
        } catch (error) {
          payload = { message: String(error) };
        }

        const errorMessage =
          (payload && typeof payload === "object" && "error" in payload && typeof (payload as Record<string, unknown>).error === "string"
            ? (payload as Record<string, unknown>).error as string
            : `Request failed with status ${response.status}`);

        pushError(errorMessage, payload, response.status);
        return;
      }

      const data = (await response.json()) as FalSuccessResponse;
      setResultUrl(data.imageUrl);
      setRequestId(data.requestId);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        pushError("Request timed out after 30 seconds (client timeout).");
      } else {
        pushError("Network error while submitting request.", String(error));
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
      setStatusMessage(null);
    }
  }, [isLoading, prompt, pushError, selectedFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPrompt("");
    setResultUrl(null);
    setRequestId(null);
    resetPreview();
  }, [resetPreview]);

  const handleTryAnother = useCallback(() => {
    setResultUrl(null);
    setRequestId(null);
    setPrompt("");
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const hasActiveResult = useMemo(() => Boolean(previewUrl || resultUrl), [previewUrl, resultUrl]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Live Haircuts
        </h1>
        <p className="text-base text-zinc-600 sm:text-lg">
          Upload a selfie, describe your dream cut, and see the AI makeover in seconds.
        </p>
      </header>

      {errors.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Error log
          </h2>
          <ul className="space-y-3">
            {errors.map((entry) => {
              const detailText = (() => {
                if (entry.details === undefined || entry.details === null) {
                  return "";
                }

                if (typeof entry.details === "string") {
                  return entry.details;
                }

                try {
                  return JSON.stringify(entry.details, null, 2);
                } catch (error) {
                  return String(error);
                }
              })();

              return (
                <li key={entry.id} className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-red-700">{entry.message}</p>
                        <div className="text-xs text-red-600">
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                          {entry.status ? <span className="ml-2">Status: {entry.status}</span> : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => dismissError(entry.id)}
                        className="text-xs font-semibold text-red-700 underline hover:text-red-600"
                      >
                        Dismiss
                      </button>
                    </div>
                    {detailText ? (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                          Raw payload
                        </p>
                        <pre className="whitespace-pre-wrap break-words rounded-xl bg-white/70 p-3 text-xs text-red-700">
                          {detailText}
                        </pre>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <ImageUpload
            onImageSelected={handleImageSelected}
            onError={handleImageError}
            previewUrl={previewUrl}
            disabled={isLoading}
          />

          <PromptInput value={prompt} onChange={setPrompt} disabled={isLoading || !selectedFile} />

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !selectedFile || !prompt.trim()}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isLoading ? "Generating…" : "Generate Haircut"}
            </button>
            {statusMessage ? (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" aria-hidden />
                <span>{statusMessage}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" aria-hidden />
              <p className="text-base font-semibold text-zinc-700">Working on your new look…</p>
              <p className="mt-2 text-sm text-zinc-500">
                This usually wraps up in under 30 seconds. Hang tight!
              </p>
            </div>
          ) : null}

          <ResultDisplay
            originalImage={previewUrl}
            resultImage={resultUrl}
            requestId={requestId}
            isLoading={isLoading}
            onTryAnother={handleTryAnother}
            onReset={handleReset}
          />

          {!hasActiveResult ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-500">
              Upload a photo and describe a hairstyle to see the AI results here.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { GENERATION_TIMEOUT_MS } from "./constants";

export async function postGeneration<T>(
  url: string,
  body: FormData | Record<string, string>,
  signal: AbortSignal,
  failureMessage: string,
): Promise<T> {
  const isForm = body instanceof FormData;
  const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(GENERATION_TIMEOUT_MS)]);
  const response = await fetch(url, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
    signal: requestSignal,
  });

  const payload = await response.json().catch(() => null);
  requestSignal.throwIfAborted();
  if (!response.ok) {
    throw new Error((typeof payload?.error === "string" && payload.error) || `${failureMessage} (${response.status}).`);
  }
  if (!payload) throw new Error(failureMessage);
  return payload;
}

export function useGeneration() {
  const request = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function run(generate: (signal: AbortSignal) => Promise<void>) {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setError(null);
    setIsLoading(true);

    try {
      await generate(controller.signal);
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(
          error instanceof Error && error.name === "TimeoutError"
            ? "This took too long. Please try again."
            : error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        );
      }
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }

  return { run, isLoading, error };
}

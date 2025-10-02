import { NextRequest, NextResponse } from "next/server";

import { ApiError, getFalClient } from "@/lib/fal-client";

const ANIMATION_TIMEOUT_MS = 120_000;
const ANIMATION_NEGATIVE_PROMPT = "--no text, watermark, distortion, artifacts, flickering";

export const runtime = "nodejs";
export const maxDuration = 120;

type AnimationSuccessResponse = {
  animationUrl: string;
  animationRequestId: string;
  animationPrompt: string;
};

function extractVideoUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  const tryExtract = (value: unknown): string | null => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      const maybeUrl = (value as Record<string, unknown>).url;
      if (typeof maybeUrl === "string") return maybeUrl;
    }
    return null;
  };

  if (Array.isArray(record.videos)) {
    for (const entry of record.videos) {
      const url = tryExtract(entry);
      if (url) return url;
    }
  }

  const directVideo = tryExtract(record.video);
  if (directVideo) return directVideo;

  const directUrl = record.url;
  if (typeof directUrl === "string") return directUrl;

  const output = record.output;
  if (Array.isArray(output)) {
    for (const entry of output) {
      const url = tryExtract(entry);
      if (url) return url;
    }
  }

  return null;
}

function createErrorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, details },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function deriveFalMessage(details: unknown, fallback: string) {
  if (details && typeof details === "object") {
    const record = details as Record<string, unknown>;
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
    if (typeof record.detail === "string" && record.detail.trim()) {
      return record.detail;
    }
  }

  if (typeof details === "string" && details.trim()) {
    return details;
  }

  return fallback;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch (error) {
    return createErrorResponse("Invalid JSON payload.", 400, String(error));
  }

  const originalUrl = body.originalUrl;
  const resultUrl = body.resultUrl;
  const animationPrompt = typeof body.animationPrompt === "string" ? body.animationPrompt.trim() : "";

  if (typeof originalUrl !== "string" || !originalUrl.trim()) {
    return createErrorResponse("originalUrl is required.");
  }

  if (typeof resultUrl !== "string" || !resultUrl.trim()) {
    return createErrorResponse("resultUrl is required.");
  }

  if (!animationPrompt) {
    return createErrorResponse("animationPrompt is required.");
  }

  let falClient;
  try {
    falClient = getFalClient();
  } catch (error) {
    return createErrorResponse("Fal.ai API key is not configured.", 500, String(error));
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), ANIMATION_TIMEOUT_MS);

  try {
    const { data, requestId } = await falClient.subscribe("fal-ai/kling-video/v2.5-turbo/pro/image-to-video", {
      input: {
        prompt: animationPrompt,
        input_image_urls: [originalUrl, resultUrl],
        image_url: resultUrl,
        duration: "5",
        negative_prompt: ANIMATION_NEGATIVE_PROMPT,
      },
      abortSignal: abortController.signal,
    });

    const animationUrl = extractVideoUrl(data);

    if (!animationUrl) {
      return createErrorResponse("Fal.ai did not return an animation URL.", 502, data);
    }

    const response: AnimationSuccessResponse = {
      animationUrl,
      animationRequestId: requestId,
      animationPrompt,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return createErrorResponse("Animation request timed out after 120 seconds.", 504);
    }

    if (error instanceof ApiError) {
      const details = error.body;
      const message = deriveFalMessage(details, "Fal.ai returned an error while creating the animation.");
      return createErrorResponse(message, error.status, details);
    }

    return createErrorResponse("Unexpected error while creating the animation.", 502, String(error));
  } finally {
    clearTimeout(timeout);
  }
}

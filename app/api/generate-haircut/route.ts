import { NextRequest, NextResponse } from "next/server";
import { ApiError, getFalClient } from "@/lib/fal-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REQUEST_TIMEOUT_MS = 120_000;

export const runtime = "nodejs";
export const maxDuration = 120;

type FalSuccessResponse = {
  imageUrl: string;
  requestId: string;
  originalImageUrl: string;
};

function extractImageUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  const tryExtract = (value: unknown): string | null => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object" && "url" in (value as Record<string, unknown>)) {
      const maybeUrl = (value as Record<string, unknown>).url;
      if (typeof maybeUrl === "string") return maybeUrl;
    }
    return null;
  };

  if (Array.isArray(record.images) && record.images.length > 0) {
    for (const item of record.images) {
      const url = tryExtract(item);
      if (url) return url;
    }
  }

  const directImage = tryExtract(record.image);
  if (directImage) return directImage;

  const directUrl = record.url;
  if (typeof directUrl === "string") return directUrl;

  const output = record.output;
  if (Array.isArray(output) && output.length > 0) {
    for (const item of output) {
      const url = tryExtract(item);
      if (url) return url;
    }
  }

  if (typeof record.result === "object" && record.result !== null) {
    const url = tryExtract((record.result as Record<string, unknown>).image);
    if (url) return url;
  }

  return null;
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
  }

  if (typeof details === "string" && details.trim()) {
    return details;
  }

  return fallback;
}

function createErrorResponse(
  message: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json(
    {
      error: message,
      details,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch (error) {
    return createErrorResponse("Invalid form submission", 400, String(error));
  }

  const promptValue = formData.get("prompt");
  const imageValue = formData.get("image");

  if (typeof promptValue !== "string" || !promptValue.trim()) {
    return createErrorResponse("A haircut description is required.");
  }

  if (!(imageValue instanceof File)) {
    return createErrorResponse("An image file is required.");
  }

  if (imageValue.size > MAX_FILE_SIZE) {
    return createErrorResponse("Image exceeds the 5MB size limit.");
  }

  const prompt = promptValue.trim();

  let falClient;
  try {
    falClient = getFalClient();
  } catch (error) {
    return createErrorResponse("Fal.ai API key is not configured.", 500, String(error));
  }

  let uploadedImageUrl: string;

  try {
    uploadedImageUrl = await falClient.storage.upload(imageValue);
  } catch (error) {
    if (error instanceof ApiError) {
      const details = error.body;
      const message = deriveFalMessage(details, "Failed to upload image to Fal storage.");
      return createErrorResponse(message, error.status, details);
    }

    return createErrorResponse("Unexpected error while uploading image to Fal storage.", 502, String(error));
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const { data, requestId } = await falClient.subscribe("fal-ai/nano-banana/edit", {
      input: {
        image_url: uploadedImageUrl,
        image_urls: [uploadedImageUrl],
        prompt,
      },
      abortSignal: abortController.signal,
    });

    const imageUrl = extractImageUrl(data);

    if (!imageUrl) {
      return createErrorResponse("Fal.ai response did not include a result image.", 502, data);
    }

    const response: FalSuccessResponse = {
      imageUrl,
      requestId,
      originalImageUrl: uploadedImageUrl,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return createErrorResponse("Request timed out after 120 seconds.", 504);
    }

    if (error instanceof ApiError) {
      const details = error.body;
      const message = deriveFalMessage(details, "Fal.ai returned an error.");
      return createErrorResponse(message, error.status, details);
    }

    return createErrorResponse("Unexpected error while generating haircut.", 502, String(error));
  } finally {
    clearTimeout(timeout);
  }
}

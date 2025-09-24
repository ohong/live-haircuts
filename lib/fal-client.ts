import { ApiError, fal } from "@fal-ai/client";

let configured = false;

export function getFalClient() {
  if (!configured) {
    const apiKey = process.env.FAL_AI_API_KEY;

    if (!apiKey) {
      throw new Error("FAL_AI_API_KEY is not set");
    }

    fal.config({
      credentials: apiKey,
    });

    configured = true;
  }

  return fal;
}

export { ApiError };

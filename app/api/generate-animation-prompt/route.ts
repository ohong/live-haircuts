import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "fs";
import path from "path";

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const MAX_OUTPUT_TOKENS = 600;

export const runtime = "nodejs";
export const maxDuration = 60;

let cachedPromptTemplate: string | null = null;

async function loadPromptTemplate() {
  if (cachedPromptTemplate) {
    return cachedPromptTemplate;
  }

  const promptPath = path.join(process.cwd(), "prompts.md");
  const contents = await fs.readFile(promptPath, "utf8");
  cachedPromptTemplate = contents;
  return contents;
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

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch (error) {
    return createErrorResponse("Invalid JSON payload.", 400, String(error));
  }

  const originalUrl = typeof body.originalUrl === "string" ? body.originalUrl.trim() : "";
  const resultUrl = typeof body.resultUrl === "string" ? body.resultUrl.trim() : "";
  const userPrompt = typeof body.userPrompt === "string" ? body.userPrompt.trim() : "";

  if (!originalUrl) {
    return createErrorResponse("originalUrl is required.");
  }

  if (!resultUrl) {
    return createErrorResponse("resultUrl is required.");
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return createErrorResponse("Anthropic API key is not configured.", 500);
  }

  const instructions = await loadPromptTemplate();

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${instructions}\n\nUser hairstyle description: ${
                userPrompt || "(not provided)"
              }\nRespond ONLY with the formatted prompt defined above.`,
            },
            {
              type: "text",
              text: "Frame 1 reference image (before haircut):",
            },
            {
              type: "image",
              source: { type: "url", url: originalUrl },
            },
            {
              type: "text",
              text: "Frame 2 reference image (after haircut):",
            },
            {
              type: "image",
              source: { type: "url", url: resultUrl },
            },
          ],
        },
      ],
    });

    const promptText = message.content
      .filter((block) => block.type === "text")
      .map((block) => ("text" in block ? block.text : ""))
      .join("\n")
      .trim();

    if (!promptText) {
      return createErrorResponse("Claude returned an empty prompt.", 502, message);
    }

    return NextResponse.json(
      {
        prompt: promptText,
        model: message.model,
        usage: message.usage,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const typedError = error as Error & { status?: number };
    return createErrorResponse(
      "Anthropic request failed.",
      typedError.status ?? 502,
      typedError instanceof Error ? typedError.message : error,
    );
  }
}

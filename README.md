# Live Haircuts

Live Haircuts is a single-page Next.js app that lets you upload a selfie, describe a hairstyle, and preview the AI-edited result using Fal.ai's nano-banana image editing model.

## Prerequisites

- Node.js 18+
- npm 9+
- A Fal.ai API key with access to the `fal-ai/nano-banana/edit` endpoint

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and add your API credentials:

   ```bash
   FAL_AI_API_KEY=your-secret-key-here
   ANTHROPIC_API_KEY=your-anthropic-key-here
   ```

   The app loads these values on the server when calling Fal.ai and Anthropic. Never commit the keys to source control.

3. Run the development server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to try the experience.

## Core Features

- Drag-and-drop image upload with JPEG/PNG/HEIC support (5MB max)
- Prompt input with helpful placeholders and strict 200-character limit
- Persistent error log that surfaces validation, network, and Fal.ai errors for debugging
- 30-second timeout guard on both client and server
- Fal.ai integration via `/api/generate-haircut` for nano-banana edits and `/api/generate-animation-prompt` for Claude Sonnet prompt synthesis
- "See it live" currently generates the Kling-ready prompt (model + text) and surfaces it in the UI; video rendering is stubbed for now
- Side-by-side before/after comparison plus quick retry, reset, and a rendered animation of the transformation

## Fal.ai Integration Notes

The app uses `@fal-ai/client` and `@anthropic-ai/sdk` on the server to:

- Upload your image to Fal storage and enqueue a `fal-ai/nano-banana/edit` job (`app/api/generate-haircut/route.ts`).
- Craft an animation prompt with Claude Sonnet (`app/api/generate-animation-prompt/route.ts`), feeding in the before/after frames plus the instructions in `prompts.md`.
- Return a formatted Kling 2.5 Turbo prompt when the user clicks "See it live" (`app/api/generate-animation-prompt/route.ts`). The actual video call is temporarily disabled/stubbed.

## Deployment

The project targets Vercel. Ensure `FAL_AI_API_KEY` is configured in your deployment environment variables before going live.

---

Later: Live haircuts uses Nano Banana (image gen) + Kling 2.5 Turbo (image-to-video) to show you a live animation

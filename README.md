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

2. Create a `.env.local` file in the project root and add your Fal credentials:

   ```bash
   FAL_AI_API_KEY=your-secret-key-here
   ```

   The app loads this value on the server when calling Fal.ai. Never commit the key to source control.

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
- Fal.ai integration via `/api/generate-haircut` API route, including secure upload via Fal storage
- Side-by-side before/after comparison plus quick retry and reset actions

## Fal.ai Integration Notes

The app uses `@fal-ai/client` on the server to upload your image to Fal storage and enqueue a `fal-ai/nano-banana/edit` job. Update `lib/fal-client.ts` if you need to adjust credentials or add logging. The API route lives at `app/api/generate-haircut/route.ts`.

## Deployment

The project targets Vercel. Ensure `FAL_AI_API_KEY` is configured in your deployment environment variables before going live.

---

Later: Live haircuts uses Nano Banana (image gen) + Kling 2.5 Turbo (image-to-video) to show you a live animation

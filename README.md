# Live Haircuts

Live Haircuts is a Next.js app for previewing AI-generated hairstyles. Upload a selfie, describe a haircut, compare the before and after images, then generate a transformation video.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set `FAL_AI_API_KEY` and `ANTHROPIC_API_KEY`.
3. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).

The upload accepts JPEG, PNG, WebP, HEIC, and HEIF files up to 5 MiB. Browsers without HEIC or HEIF preview support show the selected filename. Haircut descriptions can contain up to 200 characters.

## Generation

- `/api/generate-haircut` uploads the photo to Fal and uses Nano Banana to edit the hairstyle.
- `/api/generate-animation-prompt` uses Claude to write a video prompt from the before and after images and the haircut description.
- `/api/generate-animation` sends the resulting prompt and image references to Kling. The result plays with the browser’s video controls.

Configure both API keys as server environment variables when deploying.

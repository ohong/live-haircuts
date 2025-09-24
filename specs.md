# Project specs: Live Haircuts

## Overview
Live Haircuts is a single-page web application that transforms user photos with AI-generated haircuts using Fal.ai's nano-banana image editing model. Users upload a photo, describe their desired haircut, and receive an AI-edited result.

## Technical Stack
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **External API:** Google's [nano-banana model](https://fal.ai/models/fal-ai/nano-banana/edit/api), served via Fal.ai

## Core User Flow
1. User lands on single page with upload zone
2. Uploads photo (drag-and-drop or file selector)
3. Enters haircut description in text prompt
4. Submits request → loading spinner appears
5. Views before/after comparison
6. Can retry with same photo or start over

## Technical Requirements

### File Upload
- **Accepted formats:** JPEG, PNG, HEIC
- **Maximum size:** 5MB
- **Validation:** Client-side type and size checking
- **Error messaging:** Clear feedback for invalid files

### API Integration
- Server-side API route (`/api/generate-haircut`)
- Fal.ai API key stored in `.env.local`
- Request structure per Fal.ai documentation
- No client-side preprocessing required
- Single concurrent request enforcement

### User Interface Components

**Upload Section:**
- Drag-and-drop zone with click-to-browse fallback
- File type/size validation indicators
- Preview of uploaded image

**Prompt Input:**
- Text input with 200-character limit
- Placeholder examples: "Short buzz cut with fade", "Long wavy hair with bangs", "Pixie cut with undercut"
- Freeform text accepted

**Results Display:**
- Side-by-side before/after comparison
- Equal-sized image containers
- "Try Another Style" button (preserves original photo)
- "Upload New Photo" button (full reset)

**Error States:**
- Persistent error display with technical details
- Manual dismiss action
- Failed attempts remain visible for debugging

### Error Handling
- Network failures: Display response status and message
- API errors: Show Fal.ai error response verbatim
- Timeout handling: 30-second maximum wait
- No automatic retries

### Constraints & Exclusions
- No user authentication
- No image persistence/storage
- No social sharing features
- No image download functionality (browser native right-click suffices)
- No mobile-specific optimizations beyond responsive design
- No analytics or tracking

## File Structure
```
/app
  /api
    /generate-haircut
      route.ts
  layout.tsx
  page.tsx
/components
  ImageUpload.tsx
  PromptInput.tsx
  ResultDisplay.tsx
/lib
  fal-client.ts
```

## Success Criteria
The MVP succeeds when a user can upload their photo, describe a haircut, and see the AI-generated result alongside their original image—all within 30 seconds of landing on the page.

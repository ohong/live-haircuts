# Project specs: Live Haircuts

## Overview
Live Haircuts is a single-page web application that transforms user photos with AI-generated haircuts using Fal.ai's nano-banana image editing model, then animates the transformation using Kling v2.5 turbo pro. Users upload a photo, describe their desired haircut, receive an AI-edited result, and can generate an animated video showing the before-to-after transformation.

## Technical Stack
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **External APIs:** 
  - Google's [nano-banana model](https://fal.ai/models/fal-ai/nano-banana/edit/api) for image editing, served via Fal.ai
  - [Kling v2.5 turbo pro](https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video) for video generation, served via Fal.ai
  - Anthropic Claude for animation prompt generation

## Core User Flow
1. User lands on single page with upload zone
2. Uploads photo (drag-and-drop or file selector)
3. Enters haircut description in text prompt
4. Submits request → loading spinner appears
5. Views before/after comparison
6. Clicks "See it live ✨" button to generate animated video
7. AI generates animation prompt using Claude (analyzing both images)
8. Kling generates short video transitioning from before to after photo
9. Views animated transformation video
10. Can retry with same photo or start over

## Technical Requirements

### File Upload
- **Accepted formats:** JPEG, PNG, HEIC
- **Maximum size:** 5MB
- **Validation:** Client-side type and size checking
- **Error messaging:** Clear feedback for invalid files

### API Integration
- Server-side API routes:
  - `/api/generate-haircut` - nano-banana image editing
  - `/api/generate-animation-prompt` - Claude prompt generation
  - `/api/generate-animation` - Kling video generation
- API keys stored in `.env.local`:
  - `FAL_AI_API_KEY` for Fal.ai models
  - `ANTHROPIC_API_KEY` for Claude
- Request structure per respective API documentation
- No client-side preprocessing required
- Single concurrent request enforcement per operation

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
- "See it live ✨" button to generate animation video
- Video player displaying the animated transformation (when generated)
- "Try Another Style" button (preserves original photo)
- "Upload New Photo" button (full reset)

**Error States:**
- Persistent error display with technical details
- Manual dismiss action
- Failed attempts remain visible for debugging

### Error Handling
- Network failures: Display response status and message
- API errors: Show error response verbatim (Fal.ai, Anthropic)
- Timeout handling: 
  - 30-second maximum for haircut generation
  - 60-second maximum for animation prompt and video generation
- No automatic retries

### Constraints & Exclusions
- No user authentication
- No image/video persistence/storage
- No social sharing features
- No download functionality (browser native right-click suffices)
- No mobile-specific optimizations beyond responsive design
- No analytics or tracking
- No video editing controls (duration, effects, etc.)

## File Structure
```
/app
  /api
    /generate-haircut
      route.ts
    /generate-animation-prompt
      route.ts
    /generate-animation
      route.ts
  layout.tsx
  page.tsx
/components
  ImageUpload.tsx
  PromptInput.tsx
  ResultDisplay.tsx
/lib
  fal-client.ts
prompts.md (animation prompt template for Claude)
```

## Success Criteria
The MVP succeeds when a user can:
1. Upload their photo and describe a haircut
2. See the AI-generated result alongside their original image within 30 seconds
3. Click a button to generate an animated video transformation
4. View the complete before-to-after video animation within 90 seconds total

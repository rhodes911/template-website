# TinaCMS AI: Hero Description Suggestion (Current Scope)

Updated: 2025-08-21

## Overview
This project includes a minimal AI helper that suggests copy for the About page’s Hero Description only. All other fields are standard inputs; the AI reads them as context and never edits them directly.

## What it does
- Adds a small AI control directly under the About page’s `Hero Description` field in Tina Admin.
- Two actions:
  - Replace: Generate a fresh hero description based on existing About fields.
  - Improve: Refine the current hero description, keeping the tone/meaning.
- Shows a preview first; Apply inserts the suggestion into the `heroDescription` field.

## Where the code lives
- UI component: `tina/fields/AiSuggestHeroDescription.tsx`
- Tina schema wiring: `tina/config.ts` (About collection only, placed right below `heroDescription`)
- API route: `src/app/api/tina/ai-generate/route.ts`
  - Constrained for About+Hero to return `{ "heroDescription": string }` only.

## How to use (Tina Admin)
1. Open the About page document.
2. Edit any fields as normal (Name, Title, Hero Title, etc.).
3. Under the `Hero Description` textarea, click:
   - Replace to create a new suggestion, or
   - Improve to refine the existing text.
4. Review the preview and click Apply to write it into `Hero Description`.

## Context used by AI
The AI reads these About fields (read-only for AI):
- `name`, `title`, `subtitle`, `heroTitle`, `heroSubtitle`, and the current `heroDescription` (for Improve).

## API behavior (About hero only)
- Endpoint: `POST /api/tina/ai-generate`
- Request payload (simplified):
  - `collection: "about"`
  - `section: "hero"`
  - `brief`: short internal instruction (Replace/Improve logic)
  - `context`: selected About fields as above
- Response: `{ ok: true, collection: "about", result: { heroDescription: string } }`

## Configuration
- Environment variables:
  - `OPENAI_API_KEY` (required)
  - `OPENAI_MODEL` (optional, default: `gpt-4o-mini`)
- CORS allows localhost (3000/4001) and `NEXT_PUBLIC_SITE_URL`.

## Debug & reporting
- Add `?debug=1&report=1` to the route to emit a detailed timeline and save a report under `reports/ai`.

## Error handling
- If the OpenAI call fails or returns invalid JSON, the route responds with an error payload and logs details to the server console. The UI shows a short error message.

## Current scope and constraints
- Only the About page’s Hero Description has AI assistance.
- All other AI helpers and per-section generators were removed.
- The component is purposely small and self-contained to minimize editor clutter.

## Notes
None at this time.

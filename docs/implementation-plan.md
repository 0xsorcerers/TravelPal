Good. Here is the updated plan with the background image system fully revised. Here is the revised section of the plan:

---

**Background image system — three-tier priority:**

1. **User's own travel photos** (highest priority) — uploaded via a camera icon in the dashboard header. Accepts jpg/png/webp, up to 20 photos, stored as object URLs in `localStorage`. A "Use my photos" toggle pins them as the active source. Thumbnail grid with per-image delete.

2. **Geo-triggered destination photos** (mid priority) — whenever the app detects the user has moved more than ~10 km (Haversine distance check), it fetches a royalty-free landmark image from the Wikimedia Commons REST API (`/page/summary/{city}`). Result is cached per country code in `localStorage` so it does not re-fetch on every render. No API key required.

3. **Bundled `.webp` fallbacks** (lowest priority) — 6 curated travel-themed files in `src/assets/images/backgrounds/`, used while the geo fetch is in-flight or has failed.

All three sources flow through `ParallaxBackground.tsx` which handles the CSS parallax effect and a smooth crossfade transition when the image changes. A small source badge in the corner tells the user whether they are looking at their own photo, a nearby landmark, or a bundled scene.

New files added to the plan: `useBackgroundImages.ts`, `wikimediaFetch.ts`, `TravelPhotosManager.tsx`.

Plan saved. Switch to **Build mode** when ready.

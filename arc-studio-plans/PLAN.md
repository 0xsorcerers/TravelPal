# Travel Pal — Implementation Plan

## Summary
Travel Pal is a mobile-first travel companion web app that captures the user's real-time geolocation, spins up a Circle Modular Wallet (passkey/biometric, gasless), surfaces a USDC deposit flow, routes to an Onramper fiat offramp based on detected region, and streams a mock geo-fenced news/cultural alert feed — all wrapped in a deep-blue/teal 3D globe parallax UI with rotating local background images.

---

## Before the Build Agent Starts — Circle Console Setup

The build agent will add `VITE_CLIENT_URL` to `.env` automatically. You only need to do these steps once in [console.circle.com](https://console.circle.com) with **Testnet** enabled:

1. **Keys → Client Keys → Create a key** — select Client Key, give it a name.
2. Under **Applicable Platforms → Web**, set **Allowed Domain** to exactly:
   `i4atd5defg2c9eq8fq94m.preview.studio.arc.io`
3. Copy the key value (shown once, starts with `TEST_CLIENT_KEY:`) and paste it into `VITE_CLIENT_KEY` in `.env`.
4. **Wallets → Modular Wallets → Configurator → Passkeys** → set **Domain Name** to the same hostname:
   `i4atd5defg2c9eq8fq94m.preview.studio.arc.io`
5. Restart the dev server, reload the preview iframe, then test passkey registration.

Do not use `localhost`, parent-only domains, or any placeholder — Circle requires an exact match to the preview iframe origin.

---

## Architecture

- **Blockchain:** Arc Testnet — USDC is the native gas token, sub-second finality, no ETH needed
- **Wallet:** Circle Modular Wallet (`@circle-fin/modular-wallets-core`) — passkey (WebAuthn/biometric) registration, gasless user operations via Circle Gas Station paymaster, lazy MSCA deployment on first transaction. No seed phrases exposed to the user.
- **Offramp:** Onramper widget embedded in an iframe modal — region is passed via URL param so the widget pre-selects local fiat methods
- **News feed:** Mock geo-fenced feed — structured array of typed alert objects (security / cultural) seeded from the detected country, with read/unread state in `localStorage`
- **Location:** HTML5 Geolocation API + OpenStreetMap Nominatim reverse geocoding (free, no key required) for country/city name
- **Background images:** Three-tier priority system managed by `useBackgroundImages.ts`:
  1. **User travel photos** (highest priority) — images uploaded by the user, stored as object URLs in `localStorage` (up to 20 photos), always drawn from first
  2. **Geo-triggered destination photos** (mid priority) — when geolocation changes by more than ~10 km, the Wikimedia Commons REST API (`/page/summary/{city}`) fetches a royalty-free landmark thumbnail for the new location; cached per country code in `localStorage`
  3. **Local bundled fallbacks** (lowest priority) — 6 curated `.webp` files in `src/assets/images/backgrounds/` used when the user has no uploads and the geo fetch fails or is pending. One is selected randomly per render with CSS parallax on scroll
- **3D globe:** `@react-three/fiber` + `@react-three/drei` for an animated Earth sphere in the hero section
- **Frontend:** Vite + React + TypeScript + Tailwind CSS — deep-blue/teal palette, `Space Grotesk` display font, `DM Sans` body, mobile-first `max-w-md` layout
- **Icons:** `@web3icons/react` for USDC/chain icons, `lucide-react` for UI icons

---

## Files to Create / Modify

1. `src/assets/images/backgrounds/` — placeholder directory; build agent adds 6 `.webp` slots and imports them
2. `src/hooks/useGeolocation.ts` — HTML5 geolocation + Nominatim reverse geocode → `{ lat, lng, country, city, timezone }`
3. `src/hooks/useLocalTime.ts` — live clock that updates every second using the detected timezone
4. `src/hooks/useModularWallet.ts` — Circle Modular Wallet init, passkey register/login, USDC balance polling on Arc Testnet
5. `src/hooks/useFeed.ts` — mock geo-fenced feed generator keyed by country code, read/unread state in `localStorage`
6. `src/lib/backgroundImages.ts` — imports the 6 bundled `.webp` fallbacks into an array, exports `getRandomBundledBackground()`
6a. `src/hooks/useBackgroundImages.ts` — orchestrates the three-tier image priority system; watches geolocation for significant movement (>10 km Haversine distance), fetches Wikimedia Commons thumbnail for the new city, merges with user uploads and bundled fallbacks, exposes `currentBackground`, `allImages`, and `imageSource` (`'user' | 'geo' | 'bundled'`)
6b. `src/lib/wikimediaFetch.ts` — thin wrapper around Wikimedia REST `GET /page/summary/{city_name}` to extract `thumbnail.source`; caches result per country code in `localStorage`
7. `src/lib/offrampUrl.ts` — builds Onramper widget URL with region/country pre-filled from geolocation
8. `src/lib/mockFeedData.ts` — typed alert objects (security alerts + cultural facts) per region
9. `src/components/Globe3D.tsx` — `@react-three/fiber` animated Earth globe for the hero section
10. `src/components/ParallaxBackground.tsx` — full-screen background with CSS parallax scroll effect; accepts any image URL (bundled `.webp` path, Wikimedia URL, or user object URL); shows a subtle "geo" or "your photo" source badge in the corner
10a. `src/components/TravelPhotosManager.tsx` — settings-style panel (accessible from a camera icon in the dashboard header) with: file input accepting `.webp/.jpg/.png` (up to 20 photos), thumbnail grid of uploaded images, delete-per-image button, and a "Use my photos" toggle that pins user photos as the active source
11. `src/components/OnboardingScreen.tsx` — first-launch nickname entry, stores in `localStorage`, triggers wallet creation
12. `src/components/WalletCreatedModal.tsx` — post-passkey-registration modal showing wallet address, QR code, and "I have saved my address" confirmation checkbox
13. `src/components/Dashboard.tsx` — main screen: globe hero, local time + location badge, USDC balance card, Deposit and Offramp CTAs, feed panel
14. `src/components/DepositModal.tsx` — wallet address + QR code + network selector (Arc Testnet / Base / Arbitrum) with copy button
15. `src/components/OfframpModal.tsx` — Onramper iframe widget with detected country pre-filled; close button
16. `src/components/FeedCard.tsx` — single alert card (security vs cultural type badge, title, body, dismiss/mark-read button)
17. `src/components/FeedPanel.tsx` — scrollable list of `FeedCard` components, unread badge count, All/Unread filter tabs
18. `src/components/LocalTimeBadge.tsx` — live time + city/country pill displayed in the dashboard header
19. `src/App.tsx` — top-level router: shows `OnboardingScreen` on first launch, otherwise `Dashboard`; wraps with modular wallet provider
20. `src/config.ts` — Arc Testnet chain config, USDC address, Onramper base URL
21. `.env` — add `VITE_CLIENT_KEY=` (blank) and `VITE_CLIENT_URL=https://modular-sdk.circle.com/v1/rpc/w3s/buidl`

---

## Build Sequence

1. **Environment & dependencies** — add `@circle-fin/modular-wallets-core`, `@react-three/fiber`, `@react-three/drei`, `three`, `qrcode.react` to `package.json`; write `.env` with `VITE_CLIENT_URL` pre-filled and `VITE_CLIENT_KEY` blank
2. **Asset scaffold** — create `src/assets/images/backgrounds/` with 6 curated placeholder `.webp` files (travel-themed solid gradients) and `src/lib/backgroundImages.ts` array import
3. **Geo hooks** — `useGeolocation.ts` (HTML5 + Nominatim) and `useLocalTime.ts` (live clock); include Haversine distance helper used by `useBackgroundImages`
4. **Mock feed** — `src/lib/mockFeedData.ts` with typed alerts per country/region, then `useFeed.ts` with read/unread state
5. **Modular Wallet hook** — `useModularWallet.ts`: passkey transport init, register/login, `toCircleSmartAccount`, USDC balance read, `sendUserOperation` with `paymaster: true`
6. **Onboarding flow** — `OnboardingScreen.tsx` (nickname input → localStorage) + `WalletCreatedModal.tsx` (address + QR + confirmation checkbox)
7. **Globe & background** — `Globe3D.tsx` (rotating sphere with texture map) + `wikimediaFetch.ts` + `useBackgroundImages.ts` (three-tier image engine) + `ParallaxBackground.tsx` (crossfade transition between images) + `TravelPhotosManager.tsx` (upload panel)
8. **Deposit modal** — `DepositModal.tsx` with `QRCodeSVG`, address copy, multi-network note
9. **Offramp modal** — `offrampUrl.ts` builder + `OfframpModal.tsx` Onramper iframe embed
10. **Feed UI** — `FeedCard.tsx` + `FeedPanel.tsx` with filter tabs and unread badge
11. **Dashboard assembly** — `Dashboard.tsx` composing all components: hero (globe + parallax bg), time/location badge, balance card, action row, feed panel
12. **App router** — `App.tsx` first-launch detection, onboarding → dashboard flow
13. **Polish** — deep-blue/teal Tailwind theme, `Space Grotesk` + `DM Sans` fonts, 3D CSS parallax depth, responsive spacing, loading skeletons

---

## Done When

- [ ] App loads, requests geolocation, and displays current city, country, and live local time in the header
- [ ] First launch shows nickname entry screen; nickname is persisted across reloads
- [ ] After nickname entry, passkey registration fires and a Circle Modular Wallet (MSCA) is created on Arc Testnet
- [ ] `WalletCreatedModal` shows wallet address + QR code; "I have saved my address" checkbox must be checked before dismissal
- [ ] Dashboard displays the USDC balance (polling Arc Testnet)
- [ ] Deposit modal opens with wallet address, QR code, and copy-to-clipboard
- [ ] Offramp modal opens Onramper widget with the user's detected country pre-filled
- [ ] Feed panel shows at least 4 mock alerts (mix of security + cultural) matching the detected region, with working read/dismiss state
- [ ] Unread badge count on the feed panel decrements as cards are dismissed
- [ ] Background shows a geo-fetched Wikimedia destination photo when geolocation is available, with a smooth crossfade transition when location changes significantly (>10 km)
- [ ] Bundled `.webp` fallbacks appear when geo fetch is pending or fails
- [ ] User can open the Travel Photos panel (camera icon in header), upload their own photos (jpg/png/webp), see a thumbnail grid, delete individual photos, and toggle "Use my photos" to make them the active source
- [ ] Background source badge ("your photo" / "near you" / "travel pal") is visible in the corner of the background
- [ ] Background has a visible parallax effect on scroll regardless of image source
- [ ] 3D globe renders in the hero section and rotates continuously
- [ ] App is fully responsive and usable on a 375px mobile viewport

# meetjenna.ai — Build & Design Analysis

Researched live via browser automation (real rendering, computed styles, clicked interactions) — not a static text fetch. Site: AI voice hostess/phone-answering product for restaurants.

---

## 1. Tech stack

- **Next.js** (`_next/static/chunks/...`, `main-app-*.js`) — React framework, App Router.
- **Tailwind CSS** utility classes throughout (e.g. `self-stretch flex justify-center flex-col text-[#242424] text-sm font-semibold leading-6 font-sans`) — no custom CSS framework, no CSS-in-JS library detected.
- **No embedded `<video>` tags anywhere on the page.** Confirmed via DOM scan — `videoCount: 0`.
- The "Demo" button in the nav and every "Book a Demo" CTA link to `https://www.meetjenna.ai/book-demo` — a **separate page**, not a modal or inline video. So the product "demo" you experience on the homepage is entirely **animated UI mockups built in HTML/CSS/JS**, not real footage or a screen recording.
- "Sign in" links to `https://portal.meetjenna.ai/` — the actual product dashboard lives on a separate subdomain.

---

## 2. Design system

| Token | Value |
|---|---|
| Background | `oklch(0.973 0 0)` ≈ `#F8F8F7` (near-white light grey, used almost everywhere) |
| Body text | `#242424` (near-black, not pure black) |
| Font (everything) | **Inter** — headline and body both, no second typeface |
| H1 size/weight | `56px / 600 weight / letter-spacing -1.4px` (tight tracking, no serif, no italic) |
| Accent color | One indigo/purple (`#4F39FA`-ish, used only for the logo mark and a couple of chat bubbles) |
| Primary button | Solid black, white text, no border-radius tricks — just a clean dark pill/rectangle |
| Cards | Light grey (`#EFEFEF`-ish) panels, no border, no shadow most of the time — flat and quiet |
| Color in general | Almost none. Color only shows up *inside* the product mockups (chart bars, status dots) — never as page decoration |

**Key observation:** there is no "dark mode section" anywhere except the Enterprise pricing card, which inverts to full black as a single deliberate accent. The entire page is light. Credibility comes from *showing real-looking product UI*, not from a colorful brand system.

---

## 3. Page structure (top to bottom)

1. **Nav** — logo, Features / Pricing / FAQ anchor links, Sign in, "Demo ↗" pill button. Transparent background, no border, sticky.
2. **Hero** — centered, huge two-line headline ("The AI Hostess For Every Restaurant"), grey subhead, **no CTA buttons in the hero itself** (relies on nav's Demo button). Behind/around the subhead, 4 small white badge icons (POS integration logos: Clover, Toast, Square, etc.) are scattered at different depths — decorative, foreshadowing the "Connects to Your POS" section later.
3. **Tabbed feature showcase (the centerpiece)** — see §4, this is the most important mechanic on the page.
4. **Logo wall** — "Connects to Your POS" headline + 8 real POS/restaurant-tech logos (Toast, Square, Clover, Lightspeed, Aloha, Oracle Micros, Focus, Flipdish) in a flat grid of equal cards.
5. **2×2 feature grid** — "Handles Every Call" headline, then four cards, each pairing a **custom mini-visualization** with a title + one-sentence description:
   - *Every Event, Organized* → a fanned stack of colorful order/reservation cards (pickup/delivery/reservation entries) — visually similar to the activity-card stack we already built for DentalGrowthSystems.
   - *Every Call, Natural* → a chat-bubble conversation mockup with a voice-waveform icon.
   - *Every Order, Accurate* → a concentric-circle "orbit" diagram with POS integration icons orbiting the Jenna logo.
   - *Every Number, Tracked* → a colorful revenue bar chart with a real-looking dollar total.
6. **"How it works" steps** — a second instance of the tab-driven-live-preview pattern: a vertical list of steps ("We sync with your menu", "We customize for you", "We attach it to your phone") next to a live preview panel (a "Greeting" editor mockup showing a voice-settings UI with a waveform).
7. **Pricing** — two cards side by side: Starter ($500/location/month, light card, black button) and Enterprise (custom pricing, fully inverted to black background, white button). Plain checklist with checkmarks under each price.
8. **FAQ** — split layout: sticky-feeling title + subtitle on the left, accordion list of 6 questions on the right with chevron icons and hairline dividers.
9. **Final CTA band** — just a headline + one black "Book a Demo ↗" button, no extra imagery.
10. **Footer** — logo + one-line tagline + social icons on the left, four link columns (Product / Solutions / Company / Resources) on the right. Plain, dense, no dark band.

---

## 4. The signature mechanic: tabbed feature showcase ↔ live dashboard preview

This is the thing worth studying closest, and it appears **twice** on the page (once for the main "Handles Every Call" pitch, once for "How it works").

**Structure:**
- Above: a large mockup of a real product dashboard — a left sidebar (Overview, Calls, Orders, Reservations, Menu, Integrations, Analytics) and a main content panel.
- Below: 2–3 cards in a row, each a short label + one-sentence description (e.g. "Answers every call", "Takes the whole order", "Syncs to your POS").

**Confirmed behavior (I clicked through it live):**
- Exactly one card is "active" at a time — active card has a **white background** (inactive ones are flat grey) and a **thin black progress bar across its top edge**.
- The progress bar **fills automatically over a few seconds**, then auto-advances to the next card — so it's a **timed auto-rotating carousel**, not just decorative.
- **Clicking any card jumps directly to it and resets its timer** — manual override always available, never fights the user.
- When the active card changes, **two things update together**: the main dashboard content panel swaps (e.g. switches from an "Order #1042" ticket view to a live "Calls" table with a pulsing "Now" row), **and** the dashboard's own left sidebar updates its highlighted nav item to match (e.g. highlights "Integrations" for the POS-sync card, highlights "Calls" with a green "Live" badge for the call-answering card). This is the "sidebar moving with it" — the sidebar isn't static set-dressing, it's wired to the same state as the content.
- The dashboard content itself is fully fake/static data (hardcoded order numbers, call logs, dollar amounts) — there's no real backend call happening, it's all pre-built mockup markup that gets shown/hidden per tab.

**Why it works:** instead of telling you "Jenna handles calls, takes orders, and syncs to your POS" as three bullet points, it *shows* you what using the actual product would look like, in a way that feels alive (live-row pulse, auto-advancing) without requiring you to actually demo it.

---

## 5. Animation patterns

- **Scroll-triggered reveal**: headlines and cards fade up from ~0 opacity + slight downward offset as they enter the viewport (caught mid-animation during scrolling — confirms this is scroll-linked, not just on-load).
- **Page-load entrance**: the hero headline and subhead fade in from low opacity within the first ~1 second of load (caught two frames apart showing partial → full opacity).
- **Tab auto-rotation**: timed progress-bar fill (a few seconds per tab) drives automatic advancement through the feature cards, as described above.
- **Floating integration badges** in the hero: small icon badges scattered behind the subhead text, likely with a subtle entrance stagger (not confirmed to loop/float continuously — could be a one-time settle-in).
- Notably **no parallax, no 3D, no glassmorphism, no gradient blobs, no particle effects.** The restraint is part of the brand: motion is used only to demonstrate product behavior (the live dashboard) or to soften content entrances — never as decoration for its own sake.

---

## 6. What this means for DentalGrowthSystems

Honest read: meetjenna.ai's whole credibility strategy is "look like a real, mature SaaS product with a real dashboard" — it's optimized for a buyer evaluating *software*. DentalGrowthSystems is selling a *managed service* (an agency that runs ads + automation for you), so a 1:1 clone would slightly misrepresent what's being sold — but the **mechanic** (tab-driven live mockup instead of static bullet cards) is absolutely transferable and would be a meaningful upgrade over our current static activity-card stack.

Concretely transferable, ranked by effort vs. payoff:
1. **2×2 "what we track/run" grid with custom mini-visuals per card** (we already have 3 AI-differentiator cards as plain text — could add a small custom visual per card, e.g. a tiny call-log strip, a review-request notification stack, a recall-calendar strip).
2. **FAQ accordion** — we don't have an FAQ section at all yet; this is a clean, low-effort addition.
3. **Tab-driven live dashboard mockup** for the hero or a dedicated section — highest effort, highest payoff. Would replace or supplement the activity-card stack with something like: 3 tabs ("Calls answered" / "Reviews requested" / "Patients reactivated") driving one shared mock dashboard panel showing fake-but-realistic data (call log table, review timeline, reactivation list), built with vanilla JS tab-state + CSS transitions, no new dependencies needed.
4. **Logo wall** — we could do an equivalent for our tech stack credibility (Google, Meta, GA4 logos) if desired, though our current vitals strip already does similar trust-signaling with numbers instead of logos.

None of this requires abandoning the gold/obsidian palette — it's all structural/interaction pattern, fully skinnable to our existing system.

# RULES.MD — OCTOMEM Technical Rules & Design Invariants

> **NON-NEGOTIABLE DIRECTIVES**: This document establishes the absolute standards for all human and AI contributors working on OCTOMEM. These rules apply universally to all pages: the Landing Page, the Studio (`/studio`), Modals, and Auth routes. **NEVER VIOLATE THESE RULES.**

---

## 1. Universal Aesthetic & Design Invariants (DroneOS HUD Standard)

### 1. Palette: Obsidian Black, Pure Neutral Charcoal, Electric Orange (Zero Navy)
* **Canvas Substrate**: Pure Pitch Black `#000000`.
* **Card & HUD Surfaces**: Pure Neutral Charcoal Glass `#050505`, `#080808`, `#0D0D0D` with `backdrop-filter: blur(24px)`.
* **STRICTLY ZERO NAVY BLUE / ZERO BLUE-TINTED GRAYS**:
  * Never use backgrounds where the blue channel is elevated: FORBIDDEN: `#0E0E14`, `#121218`, `#14141C`, `#181820`, `#1E1E28`, `rgba(14,14,18,...)`.
  * All dark surfaces must be strictly neutral monochromatic values (`R == G == B`), such as `#000000`, `#080808`, `#0D0D0D`, `#121212`.
* **STRICTLY ZERO BACKGROUND GRADIENTS / BLUR BLOBS**: Never add radial glow gradients, blurred background color circles (`blur-[160px]`), or hazy backdrops. Solid `#000000` with subtle 1px white CAD grid lines (`64px × 64px` at 4% opacity).
* **Brand Accent**: Electric Orange `#FF5500` with warm amber `#FFA000` accents.

### 2. DroneOS Precision HUD Borders (No Jagged Polygon Clip-Paths & No Redundant Inner L-Borders)
* **STRICTLY FORBIDDEN**: Never apply jagged 45° chamfered polygon clip-paths (`clip-path: polygon(...)`) with thick orange borders around input chassis, cards, or message bubbles.
* **STRICTLY FORBIDDEN**: Never render floating inner L-borders (`border-t border-l`) inside boxes that already have a container border (`border border-white/...`). In Tailwind, `space-y-*` pushes them down by `margin-top`, making them float in the middle of padding and look like broken visual bugs.
* **MANDATORY**: Follow the sleek DroneOS aerospace HUD architecture:
  * Ultra-thin clean borders: `border border-white/[0.08]` to `border border-white/[0.12]`.
  * Top FUI Specular Bevel Line:
    ```tsx
    <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    ```
  * Corner Viewfinder Reticles (`border-t border-l`) belong **ONLY** framing unbordered visual stages (such as the 3D memory card artwork stage `#studio-card-dock`), never inside standard rectangular boxes or modals.

### 3. Strictly Zero Starter Cards / Prompt Boxes in Chat (No Clutter)
* **STRICTLY FORBIDDEN**: Never add 4 starter prompt cards, archetype boxes, or generic prompt suggestion grids in `/studio`.
* **MANDATORY**: Keep the studio chat screen spacious, clean, and minimal. Focus directly on the conversation and the input chassis.
* **STRICTLY FORBIDDEN**: Never build "cards-inside-cards-inside-cards" nested box containers.

### 4. Memory Card Component Invariants (DitherVeil on octo-hero.png Everywhere)
* **MANDATORY**: Both the Landing Page and the Studio (`/studio`) MUST showcase the 3D Mecha Octopus memory card using `<DitherVeil />` on `/images/octo-hero.png` (or uploaded custom cover).
* **MANDATORY DITHERVEIL SETTINGS**:
  * `rim={0}` (0% rim strictly enforced).
  * `pattern="floyd"` with `pixelSize={2}`, `levels={2}`, `palette="rgb"`.
  * `wander={false}`, `clickBurst={true}`.
  * Strictly NO floating animation keyframes (`animate-bounce`, hovering translateY).
  * Strictly NO mouse parallax tilt on the card dock.
  * Strictly NO Pokémon-style foil preset buttons (`BURSTS`, `SHARDS`, etc.) in the studio.

### 5. Strictly No `"//"` Symbols and No Harsh Cyber/Hacker Clichés in Copy
* **STRICTLY FORBIDDEN**: Never prefix or separate titles, category tags, or headers with `"//"` (e.g., NO `CARTRIDGE SLOT // PORT_01`, NO `SYNTHESIS // INQUIRY`).
* **STRICTLY FORBIDDEN**: Never use cyber/hacker jargon in consumer-facing text.
* **MANDATORY**: Copy must be clean, elegant, accessible human English.

### 7. Studio Layout, Modal UI & Connecting Wire Standards
* **Modals (`StudioSettingsModal`, `StudioSaveModal`, `StudioPassphraseModal`)**:
  * All modals MUST be spacious, wide, and breathable (`max-w-2xl` to `max-w-3xl`), never cramped or undersized.
  * Segmented tabs with provider telemetry and active orange status pins.
  * Quick model preset pills (e.g. Llama 3.3 70B, Claude 3.5 Sonnet, DeepSeek R1).
  * High-end input chassis with subtle icons (Key, CPU, Globe), eye show/hide toggles for sensitive keys, and zero-cloud local storage guarantees.
  * Top specular line, 4 DroneOS optical corner ticks (`border-white/40`), and high-impact electric orange save buttons.
* **Animated Cybernetic "Stegano Buffer" Module**:
  * Displayed on the memory card dock (`StudioCardPanel.tsx`).
  * Features live dancing frequency equalizer waveform bars (`animate-[pulse_..._infinite]`).
  * Animated dual-layer laser progress bar with segmented optical dividers and a pulsing scan line.
  * Telemetry matrix displaying: `AES-256-GCM CIPHER`, live byte weight (`~X.X KB tEXt`), and active turn count.
* **Studio Navbar**:
  * Never render noisy filler text like `CHRONOCARD BUFFER READY • CLIENT PRIVACY ZERO-CLOUD`. Keep the navbar clean, displaying active card pill if mounted.
* **Cyber-Physical Fiber-Optic Connecting Wire**:
  * On desktop screens (`lg:flex`), render an animated glowing SVG cable with dual-layer glow and pulsing light stream (`#FF5500`, `#FFF2CC`, `strokeDasharray="6 6"`) connecting the bottom chat dock port (`#studio-chat-port`) directly to the memory card dock port (`#studio-card-port`).

### 8. Typography Hierarchy
* **Headlines & Section Titles**: Orbitron (`font-orbitron`).
* **UI Copy, Buttons & Labels**: Share Tech Mono (`font-matrix`).
* **Code, Hashes & Cryptographic Specs**: JetBrains Mono (`font-mono`).

---

## 2. Core Architectural & Cryptographic Invariants

1. **ZERO-CLOUD PRIVACY MANDATE**:
   - Never introduce server-side databases (PostgreSQL, MongoDB, Supabase, Firebase, Prisma) for storing conversation transcripts or companion memory.
   - All memory persistence MUST be encapsulated in client-side AES-256-GCM encrypted PNG ancillary chunks (`tEXt` keyword `chronocard_state` or `octomem_state`).
   - Server routes in `/api` must only act as stateless utilities or BYOK inference proxies.
2. **PORTABILITY FIRST (ISO/IEC 15948 STANDARD)**:
   - Every generated cartridge MUST be a valid, standard ISO PNG image viewable in any default photo viewer (Apple Photos, Windows Viewer, Android Gallery, web browsers) while containing the encrypted memory state.
3. **SYMMETRIC ENCRYPTION**:
   - AES-256-GCM with 128-bit authentication tag, scrypt key derivation ($N=32768$), and cryptographically secure random 12-byte IVs.

---

## 3. Development & Verification Standards

1. **VERIFY WITH TYPESCRIPT**:
   - Always run `npx tsc --noEmit` before concluding any turn. Must pass with **0 errors**.
2. **WORKING CODE MUST REMAIN WORKING**:
   - Modifying styling must never break chat streaming, PNG chunk steganography roundtrips, or model provider inference in `/studio`.
3. **CLICKABLE FILE LINKS**:
   - Always provide clickable Markdown links with `file:///` URLs when communicating file locations.

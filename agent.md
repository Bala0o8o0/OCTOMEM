# AGENT.MD — OCTOMEM Autonomous Engineering & Design Guide

> **System Profile**: This document instructs autonomous AI agents, pair programmers, and engineers working in this repository. Read this file before initiating modifications. **ALL RULES IN THIS FILE ARE HARD ARCHITECTURAL AND AESTHETIC DIRECTIVES.**

---

## ⚠️ STRICT AESTHETIC AND COPYWRITING DIRECTIVES (DO NOT VIOLATE)

Any changes to the landing page, studio (`/studio`), UI components, cards, modals, or copy **MUST** adhere strictly to the following 7 golden rules:

### 1. Hero & Product Visual — 3D Mecha Octopus Memory Card Only (`/images/octo-hero.png`)
* The hero and memory card showcase visuals MUST exclusively use the **3D Wireframe Mecha Octopus Memory Card** (`/images/octo-hero.png`).
* Visual specification: High-end 3D product render of a physical sci-fi memory card cartridge featuring an illuminated glowing electric orange (`#FF5500`) MECHA OCTOPUS logo in the center, wireframe mesh armor casing with 45° chamfered faceted edges, carbon fiber accents, heatsink fins, and gold connector pins at the bottom over a pitch black void.
* **STRICTLY FORBIDDEN**: Never overlay unnecessary pins, floating badges, or tags across the hero image (e.g., NO tags like `Holographic Mecha Card`, `Interactive 3D Stage`, `Mecha Cephalopod Core`, `Standard PNG File`, etc.). The hero visual must remain pure, clean, and uncluttered.

### 2. Strictly Zero Background Gradients & Zero Navy Blue
* The palette is **Pure Pitch Black (`#000000`), Pure Neutral Charcoal (`#080808`, `#0D0D0D`), and Electric Orange (`#FF5500`) with Amber (`#FFA000`)**.
* **APPLIES TO ALL PAGES**: Landing page, Studio (`/studio`), Auth pages, and all Modals.
* **STRICTLY ZERO NAVY BLUE / ZERO BLUE TINT**:
  * Never use backgrounds where the blue channel is elevated (e.g., FORBIDDEN: `#0E0E14`, `#121218`, `#14141C`, `#181820`, `#1E1E28`, `rgba(14,14,18,...)`).
  * All dark surfaces must be strictly neutral monochromatic values (`R == G == B`), such as `#000000`, `#080808`, `#0D0D0D`, `#121212`.
* **STRICTLY ZERO BACKGROUND GRADIENTS / BLUR BLOBS**: Never add background radial glow gradients or blurred color circles (`blur-[160px]`). The canvas is flat, crisp, solid `#000000` with subtle 1px white CAD grid lines (`64px × 64px` at 4% opacity).
* Cards and container backgrounds must use **DroneOS Neutral Glass**:
  * Background: `#080808`/90 to `#0D0D0D`/90 with `backdrop-filter: blur(24px)`.
  * Border: `border-white/[0.08]` to `border-white/[0.12]`.

### 3. DroneOS Precision HUD Borders (No Jagged Polygon Clip-Paths & No Redundant Inner L-Borders)
* **STRICTLY FORBIDDEN**: Never apply jagged 45° chamfered polygon clip-paths (`clip-path: polygon(...)`) with thick orange stroke borders around cards, boxes, or input chassis.
* **STRICTLY FORBIDDEN**: Never render floating inner L-borders (`border-t border-l`) inside boxes that already have a container border (`border border-white/...`). In Tailwind, `space-y-*` pushes them down by `margin-top`, making them float in the middle of padding and look like broken visual bugs.
* **MANDATORY**: Follow the sleek DroneOS aerospace HUD architecture:
  * Ultra-thin clean borders: `border border-white/[0.08]` to `border border-white/[0.12]`.
  * Top FUI Specular Bevel Line:
    ```tsx
    <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    ```
  * Corner Viewfinder Reticles (`border-t border-l`) belong **ONLY** framing unbordered visual stages (such as the 3D memory card artwork stage `#studio-card-dock`), never inside standard rectangular boxes or modals.

### 4. Strictly No `"//"` Symbols and No Harsh Tech Clichés in User Copy
* **STRICTLY FORBIDDEN**: Never prefix or separate section headers, category labels, or titles with `"//"` anywhere in the app (e.g., NO `CARTRIDGE SLOT // PORT_01`, NO `SYNTHESIS // INQUIRY`, NO `SELECT PRESET // AUTO-BOOT`, NO `// SECTION 01`).
* **STRICTLY FORBIDDEN**: Never use cyber/hacker jargon or overwhelming technical gibberish in consumer-facing text (e.g., NO `[PNG STEGO PARSER]`, NO `NEURAL REHYDRATION BAY`, NO `BOOT COMPANION`).
* **MANDATORY**: Copy must be clean, elegant, accessible, plain human English explaining what the product does:
  * *"Drop Your Memory Card to Continue"*
  * *"Research & Insights"*
  * *"Architecture & Code"*
  * *"Start Conversation"*
  * *"Your AI Conversations, Saved Forever."*
  * *"Never lose an important conversation again."*
  * *"Three simple steps to save your chat."*
  * *"An image on the outside. Your conversation inside."*

### 5. Matrix & Sci-Fi Headings Typography
* UI Copy, labels, and telemetry: `font-matrix` (`Share Tech Mono`).
* Display headlines and section titles: `font-orbitron` (`Orbitron`).
* Code / Stego specifications: `font-mono` (`JetBrains Mono`).

### 6. High-Visibility Glowing Fiber-Optic Connection Wires
* For visual callout lines and architecture diagrams (such as in `PortableMemoryCardSection.tsx`), lines must never be faint or invisible.
* Use dual-layer fiber-optic SVG paths: an intense glowing outer path with `filter: drop-shadow(0 0 8px #FF5500)` and a high-brightness pulsing dashed core line.

### 7. Kinetic Lenis Smooth Scroll & ReactBits Integration
* Lenis smooth scrolling with kinetic parallax HUD nodes and micro-skew effects.
* ReactBits components: `DitherVeil` (WebGL shader interactive Floyd-Steinberg dither on hero image), `BlurText`, `ShinyText`, `HolographicCard`, and `FlexCarousel` with WebGL shaders.

### 8. Strictly Zero Starter Cards / Prompt Boxes in Chat (No Cards-Inside-Cards UI)
* Never render 4 starter prompt cards, archetype boxes, or generic prompt suggestion grids in `/studio`.
* The chat workbench must remain clean, spacious, and focused directly on the conversation.
* Strictly avoid "cards-inside-cards-inside-cards" nested boxes.

### 9. Memory Card Invariant: DitherVeil on octo-hero.png Everywhere
* The memory card showcase on both the Landing page and the Studio (`/studio`) MUST use `<DitherVeil />` on `/images/octo-hero.png` (or custom user upload).
* Settings: `rim={0}`, `pattern="floyd"`, `palette="rgb"`, `pixelSize={2}`, `wander={false}`, `clickBurst={true}`.
* Strictly NO floating keyframe animations (`animate-bounce`, hovering translateY).
* Strictly NO mouse parallax tilt moving.
* Strictly NO Pokemon card rainbow foil presets in the studio.

### 10. Studio Modals Standard (Spacious, DroneOS HUD Architecture)
* All modals (`StudioSettingsModal`, `StudioSaveModal`, `StudioPassphraseModal`) MUST be spacious (`max-w-2xl` to `max-w-3xl`) with DroneOS optical reticles and specular top line.
* Segmented tabs with provider telemetry and active orange status pins.
* Quick model preset pills (e.g. Llama 3.3 70B, Claude 3.5 Sonnet, DeepSeek R1).
* High-end input chassis with subtle icons (Key, CPU, Globe), eye show/hide toggles for sensitive keys, and zero-cloud local storage guarantees.
* Strictly NO cramped, tiny modal dialogs.

### 11. Animated Cybernetic Stegano Buffer
* The Stegano Buffer in `StudioCardPanel.tsx` is an animated cybernetic telemetry deck:
  * Dancing frequency equalizer waveform bars (`animate-[pulse_..._infinite]`).
  * Segmented laser progress bar with optical dividers and pulsing scan line.
  * Live payload byte estimation (`~X.X KB tEXt`) and `AES-256-GCM CIPHER` lock badge.

### 12. Studio Glowing Connecting Wire
* Render an animated dual-layer SVG glowing fiber-optic cable (`#FF5500` glow + `#FFF2CC` pulsing dash beam) connecting `#studio-chat-port` at the bottom chat dock directly to `#studio-card-port` at the memory card dock on desktop viewports.

---

## 1. Project Identity & Mission

**OCTOMEM** (protocol: OCTOMEM) is a sovereign artificial intelligence memory platform.
It eliminates the modern AI tragedy of **cloud amnesia, platform lock-in, and perpetual subscription rent**.

### Core Technical Thesis: *Memory as Matter*
* Standard AI chats treat memories as volatile server-side session logs that vanish upon context saturation, account bans, or provider policy revisions.
* OCTOMEM bakes conversational context, distilled knowledge graphs, and evolving companion personas directly into standard, lossless **PNG artwork cartridges**.
* **Steganographic ISO Standard**: Encrypted states are embedded inside ancillary PNG chunks (`tEXt` with keyword `chronocard_state`) compliant with ISO/IEC 15948:2004. Standard image viewers render the artwork; OCTOMEM Studio mounts the cognitive state.
* **100% Client-Side Cryptography**: Zero cloud database. Zero telemetry. AES-256-GCM encryption with scrypt key derivation (32,768 iterations) executes exclusively in client browser RAM. If all servers vanish, the user's companion runs offline forever.
* **Radical Anti-Subscription**: ₹100 / 7-day Studio Access Pass. Users pay for the minting/export utility; exported memory cards belong to the user permanently with zero recurring rent.

---

## 2. Landing Page Section Architecture

The landing page (`src/app/page.tsx`) renders the following ordered sections from `src/components/site/`:
1. **HeroSection.tsx**: 3D CAD sketch outline (`/images/mecha-card-hologram-sketch.png`), parallax tilt physics, About OCTOMEM liquid glassmorphism HUD box, zero floating pins.
2. **KeepContextSection.tsx**: Comparison of ordinary ephemeral chat vs. permanent OCTOMEM memory cards, with interactive CAD blueprint sketch motion graphic.
3. **WorkflowSection.tsx**: 3-step workflow (Talk Freely → Save to an Image → Drop in & Resume) with real-time Mecha Acoustic Visualizer and mechanical dock chamber.
4. **PortableMemoryCardSection.tsx**: 3D Mecha Card with high-visibility glowing fiber-optic conduits and chamfered HUD callouts.
5. **CardCollectionSection.tsx**: WebGL OGL shader optical refraction carousel showcase across archetypes.
6. **ComparisonSection.tsx**: Clear table comparing ordinary chat logs to OCTOMEM memory cards.
7. **PricingSection.tsx**: ₹100 / 7-day Studio Access Pass ticket with perforated edges.
8. **FaqSection.tsx**: Chamfered Framer Motion accordions answering core questions in simple English.
9. **CtaBanner.tsx**: Final call to launch OCTOMEM Studio.
10. **Navbar.tsx & Footer.tsx**: Chamfered navigation and telemetry footer.

---

## 3. Design Tokens & Styling Guide

| Element | Specification |
| :--- | :--- |
| **Canvas Background** | Pure Pitch Black `#000000` |
| **Primary Accent** | Electric Orange `#FF5500` |
| **Secondary Accent** | Warm Amber `#FFA000` |
| **Card Surface** | Liquid Glassmorphism `rgba(14, 14, 18, 0.5)` with `backdrop-filter: blur(28px) saturate(190%)` |
| **Corner Geometry** | Strictly 45° Chamfered Facets (`polygon(...)`), NEVER rounded |
| **Headings Font** | Orbitron (`font-orbitron`) |
| **Body / UI Font** | Share Tech Mono (`font-matrix`) |
| **Code Font** | JetBrains Mono (`font-mono`) |

---

## 4. Development & Verification Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# TypeScript type check (MUST pass with 0 errors)
npx tsc --noEmit

# Production build test
npm run build
```

---

## 5. Instructions for Agents

1. **Verify TypeScript & Build**: Always run `npx tsc --noEmit` before concluding any turn. Ensure 0 errors.
2. **Preserve Studio Functionality**: Never modify crypto or stego engine files in `src/lib/` without running unit tests.
3. **Never Re-introduce Rounded Cards or Navy Blue**: Keep all cards faceted and all backgrounds obsidian liquid glass.
4. **Never Add "//" Symbols or Tech Jargon**: Keep all headings and descriptions human-friendly and accessible.
5. **Clickable Links**: Always provide clickable links with the `file://` scheme when referencing files.

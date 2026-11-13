import * as k from "./iso-kit";
import { type Flat, type Point3, type Plan, type SolidPaths, type Projection } from "./iso-kit";

export const WIDTH = 960;
export const HEIGHT = 540;

// Base Machine Bench Plate
export const PLATE: Plan = { x: -140, y: -90, w: 280, d: 180, r: 8 };
export const PLATE_H = 10;
export const FOOT_H = 5;

// Memory Card Dimensions
export const CARD_W = 72;
export const CARD_D = 98;
export const CARD: Plan = { x: -CARD_W / 2, y: -CARD_D / 2 - 4, w: CARD_W, d: CARD_D, r: 4 };

// Guide Pillars Positions (4 corners of card dock)
export const PILLAR_OFFSET_X = CARD_W / 2 + 10;
export const PILLAR_OFFSET_Y = CARD_D / 2 + 6;
export const PILLARS: [number, number][] = [
  [-PILLAR_OFFSET_X, -PILLAR_OFFSET_Y - 4], // Top-Left
  [PILLAR_OFFSET_X, -PILLAR_OFFSET_Y - 4],  // Top-Right
  [-PILLAR_OFFSET_X, PILLAR_OFFSET_Y - 4],  // Bottom-Left
  [PILLAR_OFFSET_X, PILLAR_OFFSET_Y - 4],   // Bottom-Right
];
export const PILLAR_H = 76;

// Dial Indicator Position (Mounted on right side rail)
export const DIAL_X = 92;
export const DIAL_Y = -12;
export const DIAL_Z = 38;

// Projection fitted with ample margin (pad: 45) so NOTHING ever touches canvas boundaries
export const P: Projection = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [CARD.x - 12, CARD.y - 12, 85],
    [CARD.x + CARD.w + 12, CARD.y + CARD.d + 12, 85],
    [DIAL_X + 20, DIAL_Y - 20, DIAL_Z + 35],
    [-130, 80, 0], // Ruler strip edge
  ],
  WIDTH,
  HEIGHT,
  { pad: 45, azimuth: 44, elevation: 30 }
);

export const at = (point: Point3): Flat => k.iso(point, P);
export const byDepth = (points: [number, number][]) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ─── BASE PLATE GEOMETRY ───────────────────────────────────────────────────
const strip = { x: -125, y: PLATE.y + PLATE.d - 13, w: 250, d: 7, r: 1 };
const specPlate = { x: -125, y: -78, w: 60, d: 24, r: 2 };
const specPlateScrews = [
  at([specPlate.x + 3.5, specPlate.y + 3.5, 0.8]),
  at([specPlate.x + specPlate.w - 3.5, specPlate.y + 3.5, 0.8]),
  at([specPlate.x + 3.5, specPlate.y + specPlate.d - 3.5, 0.8]),
  at([specPlate.x + specPlate.w - 3.5, specPlate.y + specPlate.d - 3.5, 0.8]),
];

const groundTerminal = [-118, 12];
const screws = k.corners(PLATE, 10);

export const BASE_ART = {
  halo: k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P),
  feet: byDepth(k.corners(PLATE, 22)).map(([x, y]) => [
    k.cylinder(x, y, 7.5, -PLATE_H - FOOT_H, 1.6, P, 28),
    k.cylinder(x, y, 5.8, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28),
  ]),
  slab: k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4),
  groove: k.planOutline(k.insetPlan(PLATE, 5), 0, P),
  screws: screws.map(([x, y]) => at([x, y, 0])),
  screwRings: screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""),
  // Millimeter Ruler Strip
  rulerSlab: k.slabOf(strip, 0, 0.8, P, 3),
  rulerMinor: k.topTicks(strip.x + 4, strip.x + strip.w - 4, 3, 5, strip.y + 0.8, 0.8, [1.8, 3.4], P).minor,
  rulerMajor: k.topTicks(strip.x + 4, strip.x + strip.w - 4, 3, 5, strip.y + 0.8, 0.8, [1.8, 3.4], P).major,
  rulerPins: [at([strip.x + 2, strip.y + 3.5, 0.8]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.8])],
  // Specification Badge Plate
  specSlab: k.slabOf(specPlate, 0, 0.8, P, 4),
  specOutline: k.planOutline(k.insetPlan(specPlate, 1.6), 0.8, P),
  specLines: [
    k.lineOnTop([specPlate.x + 6, specPlate.y + 7], [specPlate.x + specPlate.w - 6, specPlate.y + 7], 0.8, P),
    k.lineOnTop([specPlate.x + 6, specPlate.y + 12], [specPlate.x + specPlate.w - 14, specPlate.y + 12], 0.8, P),
    k.lineOnTop([specPlate.x + 6, specPlate.y + 17], [specPlate.x + specPlate.w - 20, specPlate.y + 17], 0.8, P),
  ].join(""),
  specPins: specPlateScrews,
  // Knurled Grounding Terminal Knob
  groundBase: k.cylinder(groundTerminal[0], groundTerminal[1], 6.5, 0, 3, P, 28),
  groundKnurl: k.knurl(groundTerminal[0], groundTerminal[1], 6.5, 0, 3, 30, P),
  groundCap: k.cylinder(groundTerminal[0], groundTerminal[1], 4.5, 3, 2.5, P, 24),
  groundDot: at([groundTerminal[0], groundTerminal[1], 5.5]),
};

// ─── GUIDE PILLARS & RIG FIXTURE ──────────────────────────────────────────
export const PILLARS_ART = byDepth(PILLARS).map(([x, y]) => ({
  collar: k.cylinder(x, y, 5.2, 0, 2.5, P, 24),
  pillar: k.cylinder(x, y, 3.4, 2.5, PILLAR_H - 2.5, P, 24),
  cap: k.cylinder(x, y, 4.2, PILLAR_H, 2.0, P, 24),
  topDot: at([x, y, PILLAR_H + 2.0]),
}));

// Docking Bed (Where Bottom Chassis Rests)
const dockPlan: Plan = { x: CARD.x - 3, y: CARD.y - 3, w: CARD.w + 6, d: CARD.d + 6, r: 5 };
export const DOCK_ART = {
  bed: k.slabOf(dockPlan, 0, 3.5, P, 5, 0.8),
  well: k.slabOf(CARD, 3.5, 1.5, P, 4, 0.4),
  recessOutline: k.planOutline(CARD, 3.5, P),
};

// ─── DIAL INDICATOR (DEPTH / EXCLUSION GAUGE) ──────────────────────────────
export const DIAL_ART = {
  clampPost: k.cylinder(DIAL_X, DIAL_Y, 4.0, 0, DIAL_Z + 12, P, 24),
  bracket: k.slabOf({ x: DIAL_X - 16, y: DIAL_Y - 4, w: 20, d: 8, r: 1.5 }, DIAL_Z, 4, P, 3, 0.5),
  gaugeBody: k.cylinder(DIAL_X - 22, DIAL_Y, 12, DIAL_Z - 6, 12, P, 32),
  bezelRim: k.cylinder(DIAL_X - 22, DIAL_Y, 12.8, DIAL_Z + 6, 2.2, P, 32),
  dialFace: at([DIAL_X - 22, DIAL_Y, DIAL_Z + 8.2]),
  centerPin: at([DIAL_X - 22, DIAL_Y, DIAL_Z + 8.5]),
};

// ─── TIER 1: BOTTOM CHASSIS & 8-PIN GOLD INTERFACE BUS ─────────────────────
// Height z = 3.5 in carriage
export const PIN_COUNT = 8;
const pinWidth = 5.2;
const pinSpacing = 6.8;
const pinStartX = -(PIN_COUNT * pinSpacing) / 2 + pinWidth / 2;
const pinY = CARD.y + CARD.d - 13;

export const BOTTOM_CHASSIS_ART = {
  casing: k.slabOf(CARD, 3.5, 5.0, P, 4, 0.8),
  recessInner: k.planOutline(k.insetPlan(CARD, 2.5), 8.5, P),
  // 8 Gold Contact Interface Pins
  goldPins: Array.from({ length: PIN_COUNT }).map((_, i) => {
    const px = pinStartX + i * pinSpacing;
    return {
      pin: k.slabOf({ x: px, y: pinY, w: pinWidth, d: 11, r: 0.6 }, 8.5, 0.9, P, 2, 0.2),
      viaDot: at([px + pinWidth / 2, pinY + 2, 9.4]),
    };
  }),
  // Bus trace lines routing from pins to front edge
  busLines: Array.from({ length: PIN_COUNT }).map((_, i) => {
    const px = pinStartX + i * pinSpacing + pinWidth / 2;
    return k.pathOf([at([px, pinY + 11, 8.5]), at([px, CARD.y + CARD.d + 1, 3.5])]);
  }),
};

// ─── TIER 2: SILICON SUBSTRATE & QUANTUM CONTEXT ENCLAVE ───────────────────
// Sits at zOffset (dynamically translated along guide pillars)
const siliconPlan: Plan = k.insetPlan(CARD, 2.2);
export const SILICON_ART = {
  // Base silicon PCB wafer (thickness 2.0)
  wafer: k.slabOf(siliconPlan, 0, 2.0, P, 4, 0.4),
  waferGroove: k.planOutline(k.insetPlan(siliconPlan, 1.8), 2.0, P),

  // Central Quantum Neural Core Die (multi-tier processor chip)
  coreBase: k.slabOf({ x: -13, y: -16, w: 26, d: 26, r: 2.2 }, 2.0, 1.6, P, 4, 0.4),
  coreDie: k.slabOf({ x: -9.5, y: -12.5, w: 19, d: 19, r: 1.5 }, 3.6, 1.2, P, 4, 0.3),
  coreResonator: k.slabOf({ x: -5.5, y: -8.5, w: 11, d: 11, r: 1.0 }, 4.8, 0.8, P, 4, 0.2),
  coreDot: at([0, -3, 5.6]),

  // 4 Crystalline Context Memory Banks (Sapphire/Quartz dies)
  // Bank A: Top-Left (Architecture & Schemas)
  bankA: k.slabOf({ x: -28, y: -38, w: 16, d: 16, r: 1.5 }, 2.0, 3.2, P, 3, 0.4),
  // Bank B: Top-Right (AI Persona & Guidelines)
  bankB: k.slabOf({ x: 12, y: -38, w: 16, d: 16, r: 1.5 }, 2.0, 3.2, P, 3, 0.4),
  // Bank C: Bottom-Left (Resolved Bug History & Fixes)
  bankC: k.slabOf({ x: -28, y: 10, w: 16, d: 16, r: 1.5 }, 2.0, 3.2, P, 3, 0.4),
  // Bank D: Bottom-Right (Multi-turn Session History)
  bankD: k.slabOf({ x: 12, y: 10, w: 16, d: 16, r: 1.5 }, 2.0, 3.2, P, 3, 0.4),

  // 45-degree Gold Bus Traces etched on silicon surface
  circuitTraces: [
    // Top-Left bus to Bank A
    k.pathOf([at([-9.5, -9.5, 2.0]), at([-18, -18, 2.0]), at([-20, -22, 2.0])]),
    k.pathOf([at([-9.5, -6.5, 2.0]), at([-16, -13, 2.0]), at([-20, -22, 2.0])]),
    // Top-Right bus to Bank B
    k.pathOf([at([9.5, -9.5, 2.0]), at([18, -18, 2.0]), at([20, -22, 2.0])]),
    k.pathOf([at([9.5, -6.5, 2.0]), at([16, -13, 2.0]), at([20, -22, 2.0])]),
    // Bottom bus lines routing toward connector pins
    k.pathOf([at([-6, 10, 2.0]), at([-10, 20, 2.0]), at([-18, 26, 2.0])]),
    k.pathOf([at([6, 10, 2.0]), at([10, 20, 2.0]), at([18, 26, 2.0])]),
    k.pathOf([at([-3, 10, 2.0]), at([-3, 26, 2.0])]),
    k.pathOf([at([3, 10, 2.0]), at([3, 26, 2.0])]),
  ],

  // Solder Via Dots on Silicon
  vias: [
    at([-20, -22, 2.0]),
    at([20, -22, 2.0]),
    at([-18, 26, 2.0]),
    at([18, 26, 2.0]),
    at([-3, 26, 2.0]),
    at([3, 26, 2.0]),
  ],
};

// ─── TIER 3: TOP CASING COVER & FACEPLATE (SURFACE CARRIER) ────────────────
const faceplatePlan: Plan = k.insetPlan(CARD, 3.2);
export const TOP_CASING_ART = {
  casing: k.slabOf(CARD, 0, 5.5, P, 4, 1.0),
  chamferAccent: k.lineOnTop([CARD.x + CARD.w - 12, CARD.y], [CARD.x + CARD.w, CARD.y + 12], 5.5, P),
  faceplate: k.slabOf(faceplatePlan, 5.0, 0.7, P, 3, 0.2),
  faceplateBezel: k.planOutline(k.insetPlan(faceplatePlan, 1.5), 5.7, P),
  // Octopus Insignia on Faceplate (Laser-etched)
  octopusDome: k.cylinder(0, -12, 10, 5.7, 0.4, P, 24),
  octopusEyeL: at([-4, -13, 6.1]),
  octopusEyeR: at([4, -13, 6.1]),
  // 3 Tactical Data Stripes
  stripes: [-1, 5, 11].map((offsetY) =>
    k.pathOf([at([-14, offsetY, 5.7]), at([14, offsetY, 5.7])])
  ),
  cornerBrackets: [
    k.pathOf([at([faceplatePlan.x + 4, faceplatePlan.y + 10, 5.7]), at([faceplatePlan.x + 4, faceplatePlan.y + 4, 5.7]), at([faceplatePlan.x + 10, faceplatePlan.y + 4, 5.7])]),
    k.pathOf([at([faceplatePlan.x + faceplatePlan.w - 10, faceplatePlan.y + 4, 5.7]), at([faceplatePlan.x + faceplatePlan.w - 4, faceplatePlan.y + 4, 5.7]), at([faceplatePlan.x + faceplatePlan.w - 4, faceplatePlan.y + 10, 5.7])]),
    k.pathOf([at([faceplatePlan.x + 4, faceplatePlan.y + faceplatePlan.d - 10, 5.7]), at([faceplatePlan.x + 4, faceplatePlan.y + faceplatePlan.d - 4, 5.7]), at([faceplatePlan.x + 10, faceplatePlan.y + faceplatePlan.d - 4, 5.7])]),
    k.pathOf([at([faceplatePlan.x + faceplatePlan.w - 10, faceplatePlan.y + faceplatePlan.d - 4, 5.7]), at([faceplatePlan.x + faceplatePlan.w - 4, faceplatePlan.y + faceplatePlan.d - 4, 5.7]), at([faceplatePlan.x + faceplatePlan.w - 4, faceplatePlan.y + faceplatePlan.d - 10, 5.7])]),
  ],
};

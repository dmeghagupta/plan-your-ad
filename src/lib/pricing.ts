/**
 * Single source of truth for every credit figure in Launchpad.
 * Nothing in the UI may hardcode a credit total — everything is derived here.
 */

// From the HexCoded pricing page: one generated image costs 5 credits.
export const IMAGE_CREDITS = 5;

// From the HexCoded pricing page: a five second clip costs 60 to 90 credits
// depending on the model tier.
export const CLIP_5S_MIN_CREDITS = 60;
export const CLIP_5S_MAX_CREDITS = 90;

// From the HexCoded pricing page: a finished 15 second 1080p ad costs about
// 2,000 credits.
export const AD_15S_1080P_CREDITS = 2000;

// From the HexCoded pricing page: a keyframe (still used as a shot anchor)
// costs 8 credits.
export const KEYFRAME_CREDITS = 8;

// From the HexCoded pricing page: default free credit grant for a new account.
export const FREE_CREDITS_DEFAULT = 40;

// From the HexCoded pricing page: monthly credit allowances per plan.
export const PLANS = [
  { name: "Starter", monthlyCredits: 6000 },
  { name: "Creator", monthlyCredits: 20000 },
  { name: "Studio", monthlyCredits: 60000 },
] as const;

export const SHOT_COUNT = 5;
export const AD_LENGTH_SECONDS = 15;
export const SHOT_LENGTH_SECONDS = AD_LENGTH_SECONDS / SHOT_COUNT;

/** Credits for one shot of a standard 1080p ad, derived from the 15s ad price. */
export const BASE_SHOT_CREDITS = AD_15S_1080P_CREDITS / SHOT_COUNT;

// From the HexCoded pricing page: relative per-second cost of each video model.
export const MODELS = {
  "Seedance 2 Fast": 0.75,
  "Kling 3.0 Turbo": 1,
  "Veo 3.1": 1.6,
} as const;

export type ModelName = keyof typeof MODELS;
export const MODEL_NAMES = Object.keys(MODELS) as ModelName[];

// From the HexCoded pricing page: render resolution multipliers.
export const RESOLUTION_MULTIPLIERS = {
  "480p": 0.6,
  "1080p": 1,
} as const;

export type Resolution = keyof typeof RESOLUTION_MULTIPLIERS;

export function shotCredits(model: ModelName, resolution: Resolution = "1080p") {
  return Math.round(BASE_SHOT_CREDITS * MODELS[model] * RESOLUTION_MULTIPLIERS[resolution]);
}

export function planTotal(models: ModelName[], resolution: Resolution = "1080p") {
  return models.reduce((sum, m) => sum + shotCredits(m, resolution), 0);
}

export type Scenario = {
  key: string;
  label: string;
  detail: string;
  resolution: Resolution;
  model: ModelName;
};

export const SCENARIOS: Scenario[] = [
  { key: "budget", label: "Budget", detail: "480p", resolution: "480p", model: "Seedance 2 Fast" },
  { key: "balanced", label: "Balanced", detail: "1080p", resolution: "1080p", model: "Kling 3.0 Turbo" },
  { key: "premium", label: "Premium", detail: "1080p, top model", resolution: "1080p", model: "Veo 3.1" },
];

export function scenarioTotal(scenario: Scenario) {
  return planTotal(Array.from({ length: SHOT_COUNT }, () => scenario.model), scenario.resolution);
}

/** Cheapest plan that covers the given per-ad cost, plus ads per month. */
export function planCoverage(totalCredits: number) {
  const plan = PLANS.find((p) => p.monthlyCredits >= totalCredits) ?? PLANS[PLANS.length - 1];
  const ads = Math.floor(plan.monthlyCredits / Math.max(totalCredits, 1));
  return { plan: plan.name, ads };
}

export function keyframesFor(credits: number) {
  return Math.floor(credits / KEYFRAME_CREDITS);
}

export function testImagesFor(credits: number) {
  return Math.floor(credits / IMAGE_CREDITS);
}

export function timingLabel(index: number) {
  const start = index * SHOT_LENGTH_SECONDS;
  const end = start + SHOT_LENGTH_SECONDS;
  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));
  return `${fmt(start)} to ${fmt(end)}s`;
}

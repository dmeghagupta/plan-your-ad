import type { ModelName } from "@/lib/pricing";

export const EXAMPLE_BRIEF =
  "A 15 second vertical Instagram ad for Minimalist Niacinamide 10 percent face serum, aimed at Indian audiences aged 20 to 30 with oily skin, calm and clean tone, one recurring character named Riya.";

export type Shot = {
  id: string;
  scene: string;
  onScreenText: string;
  model: ModelName;
};

export const EXAMPLE_SHOTS: Shot[] = [
  {
    id: "shot-1",
    scene:
      "Riya, mid twenties, wakes in soft morning light in a Mumbai apartment. Close on her oily T-zone in a bathroom mirror. Vertical framing, natural light.",
    onScreenText: "Shine by 11am?",
    model: "Kling 3.0 Turbo",
  },
  {
    id: "shot-2",
    scene:
      "Product hero. The Minimalist Niacinamide 10% bottle on a plain white ledge, slow push in, single soft shadow, clinical and calm.",
    onScreenText: "Niacinamide 10% + Zinc 1%",
    model: "Kling 3.0 Turbo",
  },
  {
    id: "shot-3",
    scene:
      "Riya applies two drops with the dropper, fingertips pressing serum into her cheek. Macro detail on skin texture, no filter look.",
    onScreenText: "Two drops. Morning and night.",
    model: "Seedance 2 Fast",
  },
  {
    id: "shot-4",
    scene:
      "Time passes: same bathroom, same angle, skin visibly calmer and less shiny. Subtle match cut between the two states.",
    onScreenText: "Less shine in 4 weeks",
    model: "Kling 3.0 Turbo",
  },
  {
    id: "shot-5",
    scene:
      "Riya steps into daylight on a balcony, relaxed, looks into lens. Product bottle lower third with logo lockup.",
    onScreenText: "Minimalist. Skin, simplified.",
    model: "Veo 3.1",
  },
];

export const EXAMPLE_ACTOR = {
  displayName: "Riya",
  handle: "riya-minimalist",
  gender: "Female",
  ageRange: "25 to 34",
  language: "Hindi",
  vibe: "Calm, clean, everyday",
  description:
    "Riya is 24, lives in Mumbai, has oily skin and a no-fuss morning routine. Warm but understated on camera.",
};

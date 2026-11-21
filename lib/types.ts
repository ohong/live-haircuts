export const FLOW_STEPS = ["upload", "describe", "result", "video"] as const;

export type FlowStep = (typeof FLOW_STEPS)[number];

export type HaircutResult = {
  originalImageUrl: string;
  imageUrl: string;
  userPrompt: string;
};

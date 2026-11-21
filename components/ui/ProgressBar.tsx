"use client";

import { FLOW_STEPS, type FlowStep } from "@/lib/types";

const stepLabels: Record<FlowStep, string> = {
  upload: "Upload",
  describe: "Describe",
  result: "Result",
  video: "Video",
};

export function ProgressBar({ currentStep }: { currentStep: FlowStep }) {
  const currentIndex = FLOW_STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-2">
        {FLOW_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step} aria-current={isCurrent ? "step" : undefined} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                <div
                  className={`h-1 w-full rounded-full transition-colors ${
                    isCompleted || isCurrent ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent ? "text-zinc-900" : isCompleted ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                {stepLabels[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

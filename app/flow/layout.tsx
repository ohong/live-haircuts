"use client";

import { usePathname } from "next/navigation";
import { FlowProvider } from "@/lib/flow-context";
import { FLOW_STEPS } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

function FlowShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = FLOW_STEPS.find((step) => pathname === `/flow/${step}`) ?? "upload";

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="space-y-2">
        <h1 className="text-lg font-bold text-zinc-900">Live Haircuts</h1>
        <ProgressBar currentStep={currentStep} />
      </div>
      <div className="animate-fade-in flex-1">{children}</div>
    </main>
  );
}

export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <FlowProvider>
      <FlowShell>{children}</FlowShell>
    </FlowProvider>
  );
}

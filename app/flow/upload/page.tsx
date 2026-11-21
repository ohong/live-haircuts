"use client";

import { useRouter } from "next/navigation";
import { useFlow } from "@/lib/flow-context";
import { SelfieCapture } from "@/components/flow/SelfieCapture";
import { Button } from "@/components/ui/Button";

export default function UploadPage() {
  const router = useRouter();
  const { selfie, selectSelfie } = useFlow();

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Upload your selfie</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Take a photo or upload one to get started.
        </p>
      </div>

      <SelfieCapture onCapture={selectSelfie} selfie={selfie} />

      <Button
        onClick={() => router.push("/flow/describe")}
        disabled={!selfie}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}

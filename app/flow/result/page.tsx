"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BeforeAfterView } from "@/components/flow/BeforeAfterView";
import { Button } from "@/components/ui/Button";
import { useFlow } from "@/lib/flow-context";
import { postGeneration, useGeneration } from "@/lib/use-generation";

export default function ResultPage() {
  const router = useRouter();
  const { result, videoUrl, setVideoUrl, clearResult } = useFlow();
  const { run, isLoading, error } = useGeneration();

  if (!result) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">No haircut preview yet</h2>
        <Link href="/flow/upload" className="underline">Go to upload</Link>
      </div>
    );
  }

  function generateVideo() {
    if (!result) return;
    const { originalImageUrl: originalUrl, imageUrl: resultUrl, userPrompt } = result;

    void run(async (signal) => {
      const { prompt: animationPrompt } = await postGeneration<{ prompt: string }>(
        "/api/generate-animation-prompt",
        { originalUrl, resultUrl, userPrompt },
        signal,
        "Animation prompt generation failed",
      );
      const { animationUrl } = await postGeneration<{ animationUrl: string }>(
        "/api/generate-animation",
        { originalUrl, resultUrl, animationPrompt },
        signal,
        "Video generation failed",
      );

      signal.throwIfAborted();
      setVideoUrl(animationUrl);
      router.push("/flow/video");
    });
  }

  return (
    <div className="animate-slide-up space-y-6">
      <h2 className="text-xl font-bold text-zinc-900">Your new look</h2>
      <BeforeAfterView beforeUrl={result.originalImageUrl} afterUrl={result.imageUrl} />
      <div className="flex flex-col gap-3">
        <Button
          onClick={videoUrl ? () => router.push("/flow/video") : generateVideo}
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? "Generating video…" : videoUrl ? "Watch video" : "Generate video"}
        </Button>
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={() => {
            clearResult();
            router.push("/flow/describe");
          }}
          className="w-full"
        >
          Try another style
        </Button>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}

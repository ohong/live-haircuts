"use client";

import { useRouter } from "next/navigation";
import { useFlow } from "@/lib/flow-context";
import { VideoPlayer } from "@/components/flow/VideoPlayer";
import { Button } from "@/components/ui/Button";

export default function VideoPage() {
  const router = useRouter();
  const { videoUrl, result, reset } = useFlow();

  const handleStartOver = () => {
    reset();
    router.push("/flow/upload");
  };

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-sm text-zinc-500">No video yet.</p>
        <Button variant="secondary" onClick={() => router.push(result ? "/flow/result" : "/flow/upload")}>
          {result ? "Back to result" : "Go to upload"}
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Your transformation</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Watch your haircut transformation come to life.
        </p>
      </div>

      <VideoPlayer videoUrl={videoUrl} />

      <Button variant="secondary" onClick={handleStartOver} className="w-full">
        Start Over
      </Button>
    </div>
  );
}

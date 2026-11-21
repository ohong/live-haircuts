"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HaircutPromptForm } from "@/components/flow/HaircutPromptForm";
import { SelfiePreview } from "@/components/flow/SelfiePreview";
import { useFlow } from "@/lib/flow-context";
import { postGeneration, useGeneration } from "@/lib/use-generation";

export default function DescribePage() {
  const router = useRouter();
  const { selfie, showResult } = useFlow();
  const [prompt, setPrompt] = useState("");
  const { run, isLoading, error } = useGeneration();

  if (!selfie) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Add a selfie first</h2>
        <Link className="underline" href="/flow/upload">Go to upload</Link>
      </div>
    );
  }

  function submit() {
    if (!selfie || !prompt.trim()) return;
    const userPrompt = prompt.trim();
    const body = new FormData();
    body.append("image", selfie.file);
    body.append("prompt", userPrompt);

    void run(async (signal) => {
      const { imageUrl, originalImageUrl } = await postGeneration<{
        imageUrl: string;
        originalImageUrl: string;
      }>("/api/generate-haircut", body, signal, "Haircut generation failed");

      signal.throwIfAborted();
      showResult({ imageUrl, originalImageUrl, userPrompt });
      router.push("/flow/result");
    });
  }

  return (
    <div className="animate-slide-up space-y-6">
      <h2 className="text-xl font-bold text-zinc-900">Describe your haircut</h2>
      <SelfiePreview key={selfie.previewUrl} selfie={selfie} className="mx-auto h-32 w-32 rounded-xl object-cover" />
      <HaircutPromptForm value={prompt} onChange={setPrompt} onSubmit={submit} isLoading={isLoading} />
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Link href="/flow/upload" className="inline-block text-sm underline">Change photo</Link>
    </div>
  );
}

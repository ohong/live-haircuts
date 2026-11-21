"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { HaircutResult } from "./types";

function useFlowState() {
  const [selfie, setSelfie] = useState<{ file: File; previewUrl: string } | null>(null);
  const [result, setResult] = useState<HaircutResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selfie) return () => URL.revokeObjectURL(selfie.previewUrl);
  }, [selfie]);

  function selectSelfie(file: File) {
    setSelfie({ file, previewUrl: URL.createObjectURL(file) });
    clearResult();
  }

  function clearResult() {
    setResult(null);
    setVideoUrl(null);
  }

  function showResult(result: HaircutResult) {
    setResult(result);
    setVideoUrl(null);
  }

  function reset() {
    setSelfie(null);
    clearResult();
  }

  return { selfie, result, videoUrl, selectSelfie, clearResult, showResult, setVideoUrl, reset };
}

const FlowContext = createContext<ReturnType<typeof useFlowState> | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  return <FlowContext.Provider value={useFlowState()}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const flow = useContext(FlowContext);
  if (!flow) throw new Error("useFlow must be used within a FlowProvider");
  return flow;
}

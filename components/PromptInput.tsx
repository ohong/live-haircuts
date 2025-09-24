"use client";

import type { ChangeEvent } from "react";

const MAX_PROMPT_LENGTH = 200;

type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function PromptInput({ value, onChange, disabled = false }: PromptInputProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value.slice(0, MAX_PROMPT_LENGTH);
    onChange(nextValue);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="haircut-prompt" className="block text-sm font-medium text-zinc-700">
        Describe your desired haircut
      </label>
      <textarea
        id="haircut-prompt"
        name="haircut-prompt"
        placeholder="e.g. Short buzz cut with fade"
        value={value}
        onChange={handleChange}
        maxLength={MAX_PROMPT_LENGTH}
        disabled={disabled}
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
      />
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <p>Freeform text, up to 200 characters.</p>
        <p>
          {value.length}
          /
          {MAX_PROMPT_LENGTH}
        </p>
      </div>
    </div>
  );
}

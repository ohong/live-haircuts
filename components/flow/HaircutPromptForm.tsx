"use client";

import { MAX_PROMPT_LENGTH } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

const SUGGESTIONS = [
  "Buzz cut with skin fade",
  "Shoulder-length layers",
  "Curtain bangs with waves",
  "Pixie cut",
  "Slicked back undercut",
  "Curly bob",
];

type HaircutPromptFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function HaircutPromptForm({ value, onChange, onSubmit, isLoading }: HaircutPromptFormProps) {
  return (
    <form className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}>
      <div>
        <label htmlFor="haircut-prompt" className="mb-2 block text-sm font-medium text-zinc-700">
          Haircut description
        </label>
        <textarea
          id="haircut-prompt"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_PROMPT_LENGTH}
          disabled={isLoading}
          placeholder="e.g. Buzz cut with a sharp fade on the sides..."
          rows={3}
          className="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors border-zinc-300 focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={isLoading}
            onClick={() => onChange(suggestion)}
            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-white"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <Button
        type="submit"
        loading={isLoading}
        disabled={!value.trim()}
        className="w-full"
      >
        {isLoading ? "Generating..." : "Generate Haircut"}
      </Button>
    </form>
  );
}

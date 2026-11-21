type BeforeAfterViewProps = {
  beforeUrl: string;
  afterUrl: string;
};

export function BeforeAfterView({ beforeUrl, afterUrl }: BeforeAfterViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
            Before
          </p>
          {/* Load the provider asset directly since its host may vary. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeUrl}
            alt="Original selfie"
            className="w-full rounded-xl object-cover aspect-square"
          />
        </div>
        <div className="space-y-2">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
            After
          </p>
          {/* Load the provider asset directly since its host may vary. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterUrl}
            alt="Generated haircut"
            className="w-full rounded-xl object-cover aspect-square"
          />
        </div>
      </div>
    </div>
  );
}

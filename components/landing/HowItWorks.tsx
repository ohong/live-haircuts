const steps = [
  {
    number: "1",
    title: "Upload a selfie",
    description: "Take a photo or upload one from your gallery.",
  },
  {
    number: "2",
    title: "Describe your style",
    description: "Tell us what haircut you want, or pick a suggestion.",
  },
  {
    number: "3",
    title: "See the result",
    description: "AI generates a realistic before & after comparison.",
  },
  {
    number: "4",
    title: "Watch the transformation",
    description: "Get a video showing the smooth transition to your new look.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
        How it works
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white">
              {step.number}
            </div>
            <h3 className="mb-2 text-base font-semibold text-zinc-900">{step.title}</h3>
            <p className="text-sm text-zinc-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

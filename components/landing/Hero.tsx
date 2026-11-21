import Link from "next/link";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        See your new haircut
        <br />
        <span className="text-zinc-500">before the scissors touch.</span>
      </h1>
      <p className="max-w-md text-base text-zinc-600 sm:text-lg">
        Upload a selfie, preview a new hairstyle, and see the change in a short video.
      </p>
      <Link
        href="/flow/upload"
        className="mt-2 rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white hover:bg-zinc-700"
      >
        Try it now
      </Link>
    </section>
  );
}

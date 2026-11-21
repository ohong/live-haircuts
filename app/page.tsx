import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6">
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}

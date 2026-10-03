import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: canonical("/"),
};

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Stack />
      <Projects />
      <Experience />
      <About />
      <Contact />
    </main>
  );
}

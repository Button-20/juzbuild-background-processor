"use client";

import FAQ from "@/components/Home/FAQs";
import FeaturedProperty from "@/components/Home/FeaturedProperty";
import GetInTouch from "@/components/Home/GetInTouch";
import Hero from "@/components/Home/Hero";
import Properties from "@/components/Home/Properties";
import Services from "@/components/Home/Services";
import Testimonial from "@/components/Home/Testimonial";
import BlogSmall from "@/components/shared/Blog";
import { useSettings } from "@/hooks/useSettings";

export default function Home() {
  const { isBlogEnabled } = useSettings();

  return (
    <main>
      <Hero />
      <Services />
      <Properties />
      <FeaturedProperty />
      <Testimonial />
      {isBlogEnabled && <BlogSmall />}
      <GetInTouch />
      <FAQ />
    </main>
  );
}

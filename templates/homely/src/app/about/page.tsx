"use client";

import HeroSub from "@/components/shared/HeroSub";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

interface Settings {
  siteName: string;
  tagline: string;
  aboutSection: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();

        if (data.success) {
          setSettings(data.settings);
        } else {
          console.error("Failed to fetch settings");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <HeroSub
        title={settings?.siteName || "About Us"}
        description={settings?.tagline || "Learn more about our story"}
        badge="About Us"
      />

      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* About Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Icon
                  icon="ph:info"
                  width={20}
                  height={20}
                  className="text-primary"
                />
              </span>
              <p className="text-base font-semibold text-badge dark:text-white/90">
                Our Story
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-base md:text-lg text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                  {settings?.aboutSection ||
                    "Welcome to our company. We are dedicated to providing the best service to our customers."}
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-lg dark:shadow-white/5 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Icon
                    icon="ph:target"
                    width={24}
                    height={24}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-black dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
                To deliver exceptional service and value to our clients, helping
                them achieve their goals with integrity and excellence.
              </p>
            </div>

            {/* Vision */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-lg dark:shadow-white/5 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Icon
                    icon="ph:eye"
                    width={24}
                    height={24}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-black dark:text-white">
                  Our Vision
                </h3>
              </div>
              <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
                To be recognized as the leading provider in our industry,
                setting standards for quality, innovation, and customer
                satisfaction.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Icon
                    icon="ph:star"
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                </span>
                <p className="text-base font-semibold text-badge dark:text-white/90">
                  Our Values
                </p>
              </div>
              <h3 className="text-3xl md:text-4xl font-medium tracking-tighter text-black dark:text-white">
                What We Stand For
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Value 1 */}
              <div className="text-center p-6 border border-black/10 dark:border-white/10 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Icon
                    icon="ph:shield-check"
                    width={32}
                    height={32}
                    className="text-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Integrity
                </h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Operating with honesty and transparency in all our dealings
                </p>
              </div>

              {/* Value 2 */}
              <div className="text-center p-6 border border-black/10 dark:border-white/10 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Icon
                    icon="ph:trophy"
                    width={32}
                    height={32}
                    className="text-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Excellence
                </h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Striving for the highest quality in everything we do
                </p>
              </div>

              {/* Value 3 */}
              <div className="text-center p-6 border border-black/10 dark:border-white/10 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Icon
                    icon="ph:lightbulb"
                    width={32}
                    height={32}
                    className="text-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Innovation
                </h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Embracing new ideas and creative solutions
                </p>
              </div>

              {/* Value 4 */}
              <div className="text-center p-6 border border-black/10 dark:border-white/10 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Icon
                    icon="ph:users-three"
                    width={32}
                    height={32}
                    className="text-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Community
                </h4>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Building lasting relationships with our clients
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center border border-black/10 dark:border-white/10 rounded-2xl p-12 shadow-lg dark:shadow-white/5 bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="text-3xl md:text-4xl font-medium tracking-tighter text-black dark:text-white mb-4">
              Ready to Work With Us?
            </h3>
            <p className="text-base text-black/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              We're here to help you achieve your goals. Get in touch with us
              today and let's start a conversation.
            </p>
            <a
              href="/contactus"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
              <Icon icon="ph:arrow-right" width={20} height={20} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

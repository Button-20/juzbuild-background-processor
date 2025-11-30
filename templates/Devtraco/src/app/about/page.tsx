"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Settings {
  siteName: string;
  tagline: string;
  aboutSection: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

interface Statistic {
  value: string;
  label: string;
  icon: string;
}

interface AboutPageData {
  storyHeading: string;
  storyImage?: string;
  missionText: string;
  visionText: string;
  values: Value[];
  statistics: Statistic[];
  ctaHeading: string;
  ctaDescription: string;
  ctaImage?: string;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsResponse, aboutResponse] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/about"),
        ]);

        const settingsData = await settingsResponse.json();
        const aboutResponseData = await aboutResponse.json();

        if (settingsData.success) {
          setSettings(settingsData.settings);
        } else {
          console.error("Failed to fetch settings");
        }

        if (aboutResponseData.success) {
          setAboutData(aboutResponseData.aboutPage);
        } else {
          console.error("Failed to fetch about page data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
      {/* Hero Section with Background */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-24 overflow-hidden bg-linear-to-br from-primary/10 via-white to-primary/5 dark:from-primary/5 dark:via-black dark:to-primary/10">
        {/* Geometric Pattern Illustration */}
        <div className="absolute inset-0 z-0 opacity-40">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Grid pattern */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary"
                />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#grid)" />

            {/* Building illustrations */}
            {/* Building 1 */}
            <g className="text-primary" opacity="0.5">
              <rect
                x="100"
                y="400"
                width="120"
                height="300"
                fill="currentColor"
              />
              <rect
                x="110"
                y="420"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="140"
                y="420"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="170"
                y="420"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="110"
                y="470"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="140"
                y="470"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="170"
                y="470"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="110"
                y="520"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="140"
                y="520"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="170"
                y="520"
                width="20"
                height="30"
                fill="white"
                opacity="0.5"
              />
            </g>

            {/* Building 2 */}
            <g className="text-primary" opacity="0.45">
              <rect
                x="900"
                y="350"
                width="150"
                height="350"
                fill="currentColor"
              />
              <rect
                x="915"
                y="380"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="950"
                y="380"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="985"
                y="380"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="915"
                y="440"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="950"
                y="440"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="985"
                y="440"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="915"
                y="500"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="950"
                y="500"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
              <rect
                x="985"
                y="500"
                width="25"
                height="35"
                fill="white"
                opacity="0.5"
              />
            </g>

            {/* House illustration */}
            <g className="text-primary" opacity="0.4">
              <polygon points="500,300 400,400 600,400" fill="currentColor" />
              <rect
                x="420"
                y="400"
                width="160"
                height="180"
                fill="currentColor"
              />
              <rect
                x="460"
                y="450"
                width="40"
                height="60"
                fill="white"
                opacity="0.6"
              />
              <rect
                x="520"
                y="430"
                width="35"
                height="35"
                fill="white"
                opacity="0.6"
              />
            </g>

            {/* Decorative circles */}
            <circle
              cx="200"
              cy="200"
              r="80"
              fill="currentColor"
              className="text-primary"
              opacity="0.2"
            />
            <circle
              cx="1000"
              cy="150"
              r="100"
              fill="currentColor"
              className="text-primary"
              opacity="0.2"
            />
            <circle
              cx="600"
              cy="600"
              r="60"
              fill="currentColor"
              className="text-primary"
              opacity="0.2"
            />

            {/* Key icon */}
            <g
              className="text-primary"
              opacity="0.3"
              transform="translate(750, 500)"
            >
              <circle
                cx="0"
                cy="0"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <rect
                x="20"
                y="-8"
                width="80"
                height="16"
                rx="8"
                fill="currentColor"
              />
              <rect x="60" y="-20" width="8" height="12" fill="currentColor" />
              <rect x="80" y="-20" width="8" height="12" fill="currentColor" />
            </g>
          </svg>
        </div>
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex gap-2.5 items-center justify-center mb-3">
              <span>
                <Icon
                  icon={"ph:house-simple-fill"}
                  width={20}
                  height={20}
                  className="text-primary"
                />
              </span>
              <p className="text-base font-semibold text-primary">About Us</p>
            </div>
            <h1 className="font-medium text-5xl sm:text-7xl md:text-[80px] text-black dark:text-white tracking-tighter mb-6">
              {settings?.siteName || "About Us"}
            </h1>
            <p className="text-lg md:text-xl text-black/70 dark:text-white/70 max-w-3xl mx-auto">
              {settings?.tagline || "Learn more about our story"}
            </p>
          </div>
        </div>
      </section>

      {/* About Story Section with Image */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white dark:bg-black">
        <div className="container max-w-8xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={
                  aboutData?.storyImage ||
                  "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                }
                alt="Our Story"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Right: Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
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
              <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black dark:text-white mb-6">
                {aboutData?.storyHeading || "Building Dreams, Creating Homes"}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-base md:text-lg text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                  {settings?.aboutSection ||
                    "Welcome to our company. We are dedicated to providing the best service to our customers. With years of experience in the real estate industry, we have helped countless families find their perfect homes and investors discover profitable opportunities.\n\nOur commitment to excellence, integrity, and customer satisfaction sets us apart in the competitive real estate market."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-neutral-900">
        <div className="container max-w-8xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Icon
                  icon="ph:compass"
                  width={20}
                  height={20}
                  className="text-primary"
                />
              </span>
              <p className="text-base font-semibold text-badge dark:text-white/90">
                Our Purpose
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black dark:text-white">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative overflow-hidden border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white dark:bg-black shadow-lg dark:shadow-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                    <Icon
                      icon="ph:target"
                      width={28}
                      height={28}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
                    Our Mission
                  </h3>
                </div>
                <p className="text-base md:text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  {aboutData?.missionText ||
                    "To deliver exceptional service and value to our clients, helping them achieve their real estate goals with integrity, transparency, and excellence. We strive to make every transaction seamless and rewarding."}
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative overflow-hidden border border-black/10 dark:border-white/10 rounded-2xl p-8 bg-white dark:bg-black shadow-lg dark:shadow-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                    <Icon
                      icon="ph:eye"
                      width={28}
                      height={28}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
                    Our Vision
                  </h3>
                </div>
                <p className="text-base md:text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  {aboutData?.visionText ||
                    "To be recognized as the leading real estate provider, setting standards for quality, innovation, and customer satisfaction. We envision a future where everyone finds their perfect property."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Images */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white dark:bg-black">
        <div className="container max-w-8xl mx-auto">
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
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black dark:text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
              Our core values guide everything we do and define who we are
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData?.values.map((value, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      value.image ||
                      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170"
                    }
                    alt={value.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4 -mt-12 relative z-10 bg-white dark:bg-neutral-900 border-4 border-white dark:border-neutral-900">
                    <Icon
                      icon={value.icon}
                      width={28}
                      height={28}
                      className="text-primary"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-black dark:text-white mb-3 text-center">
                    {value.title}
                  </h4>
                  <p className="text-sm text-black/60 dark:text-white/60 text-center leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-neutral-900">
        <div className="container max-w-8xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutData?.statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Icon
                    icon={stat.icon}
                    width={32}
                    height={32}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-base text-black/60 dark:text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action with Background Image */}
      <section className="relative py-24 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              aboutData?.ctaImage ||
              "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
            }
            alt="Contact us"
            fill
            className="object-cover brightness-[0.3]"
            unoptimized
          />
        </div>
        <div className="container max-w-8xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white mb-6">
              {aboutData?.ctaHeading || "Ready to Work With Us?"}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10">
              {aboutData?.ctaDescription ||
                "We're here to help you achieve your real estate goals. Get in touch with us today and let's start a conversation."}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contactus"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Us
                <Icon icon="ph:arrow-right" width={20} height={20} />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                View Properties
                <Icon icon="ph:house-line" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

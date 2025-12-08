"use client";

import { fetchContactData } from "@/lib/contactInfo-client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const Logo: React.FC<{
  isHomepage?: boolean;
  sticky?: boolean;
}> = ({ isHomepage, sticky }: { isHomepage?: boolean; sticky?: boolean }) => {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [darkModeLogoUrl, setDarkModeLogoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Load logos from settings
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const data = await fetchContactData();
        setLogoUrl(data.logoUrl || "");
        setDarkModeLogoUrl(data.darkModeLogoUrl || "");
      } catch (error) {
        console.error("Error loading logo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
    setMounted(true);
  }, []);

  // Wait for component to mount and theme to be resolved
  if (!mounted || isLoading) {
    return null;
  }

  // Determine which logo to show based on current theme
  const isDarkMode = resolvedTheme === "dark";
  const currentLogo = isDarkMode && darkModeLogoUrl ? darkModeLogoUrl : logoUrl;

  // If we have a custom logo, show it
  if (currentLogo) {
    return (
      <div className="w-30 h-auto sm:w-32 lg:w-[180px]">
        <Image
          src={currentLogo}
          alt="logo"
          width={150}
          height={68}
          unoptimized={true}
          className="w-full h-auto max-h-[68px] object-contain"
          priority
          key={`${isDarkMode ? "dark" : "light"}-${currentLogo}`}
        />
      </div>
    );
  }

  // Fallback to default SVG logos
  return (
    <>
      <Image
        src={"/images/header/dark-logo.svg"}
        alt="logo"
        width={150}
        height={68}
        unoptimized={true}
        className={`w-30 h-auto sm:w-32 lg:w-[180px] ${
          isHomepage
            ? sticky
              ? "block dark:hidden"
              : "hidden"
            : sticky
            ? "block dark:hidden"
            : "block dark:hidden"
        }`}
      />
      <Image
        src={"/images/header/logo.svg"}
        alt="logo"
        width={150}
        height={68}
        unoptimized={true}
        className={`w-30 h-auto sm:w-32 lg:w-[180px] ${
          isHomepage
            ? sticky
              ? "hidden dark:block"
              : "block"
            : sticky
            ? "dark:block hidden"
            : "dark:block hidden"
        }`}
      />
    </>
  );
};

export default Logo;

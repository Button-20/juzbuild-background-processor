"use client";

import { fetchContactData } from "@/lib/contactInfo-client";
import Image from "next/image";
import { useEffect, useState } from "react";

const Logo: React.FC<{
  isHomepage?: boolean;
  sticky?: boolean;
}> = ({ isHomepage, sticky }: { isHomepage?: boolean; sticky?: boolean }) => {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const data = await fetchContactData();
        setLogoUrl(data.logoUrl || "");
      } catch (error) {
        console.error("Error loading logo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, []);

  // If we have a custom logo from database, display it
  if (logoUrl && !isLoading) {
    return (
      <div className="w-30 h-auto sm:w-32 lg:w-[180px]">
        <Image
          src={logoUrl}
          alt="logo"
          width={150}
          height={68}
          unoptimized={true}
          className="w-full h-auto max-h-[68px] object-contain"
          priority
        />
      </div>
    );
  }

  // Fallback to default SVG logos
  return (
    <>
      <Image
        src={"https://res.cloudinary.com/dho8jec7k/image/upload/w_200,h_48,c_fit,f_auto,q_auto/v1764480513/juzbuild/logos/logo_1764480504523_xvzy9wr7l5b.webp"}
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
        src={"https://res.cloudinary.com/dho8jec7k/image/upload/w_200,h_48,c_fit,f_auto,q_auto/v1764480513/juzbuild/logos/logo_1764480504523_xvzy9wr7l5b.webp"}
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

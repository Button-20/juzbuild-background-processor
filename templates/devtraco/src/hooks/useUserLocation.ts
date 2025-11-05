"use client";

import { useEffect, useState } from "react";

export interface LocationInfo {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
}

export function useUserLocation() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectLocation() {
      try {
        // Try to get location from ipapi.co
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error("Failed to detect location");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.reason || "Location detection failed");
        }

        const currencyMap: Record<
          string,
          { currency: string; symbol: string }
        > = {
          GH: { currency: "GHS", symbol: "₵" },
          US: { currency: "USD", symbol: "$" },
          GB: { currency: "GBP", symbol: "£" },
          NG: { currency: "NGN", symbol: "₦" },
          DE: { currency: "EUR", symbol: "€" },
          FR: { currency: "EUR", symbol: "€" },
          ES: { currency: "EUR", symbol: "€" },
          IT: { currency: "EUR", symbol: "€" },
          NL: { currency: "EUR", symbol: "€" },
        };

        const countryCode = data.country_code || "GH";
        const currencyInfo = currencyMap[countryCode] || {
          currency: "GHS",
          symbol: "₵",
        };

        setLocation({
          country: data.country_name || "Ghana",
          countryCode: countryCode,
          currency: currencyInfo.currency,
          currencySymbol: currencyInfo.symbol,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error detecting location:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // Set default location
        setLocation({
          country: "Ghana",
          countryCode: "GH",
          currency: "GHS",
          currencySymbol: "₵",
        });
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  return { location, loading, error };
}

export function formatPrice(price: number, currency: string = "GHS"): string {
  const symbols: Record<string, string> = {
    GHS: "₵",
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
  };

  const symbol = symbols[currency] || currency;
  const formatted = price.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (currency === "GHS" || currency === "NGN") {
    return `${symbol} ${formatted}`;
  }

  return `${symbol}${formatted}`;
}

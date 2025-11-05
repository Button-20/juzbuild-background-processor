"use client";

import { useEffect, useState } from "react";

interface CurrencyBadgeProps {
  currency?: string;
  country?: string;
  className?: string;
}

export default function CurrencyBadge({
  currency,
  country,
  className = "",
}: CurrencyBadgeProps) {
  const [currencyInfo, setCurrencyInfo] = useState<{
    code: string;
    symbol: string;
    flag: string;
  } | null>(null);

  useEffect(() => {
    if (currency && country) {
      const flagEmoji = getFlagEmoji(country);
      const symbol = getCurrencySymbol(currency);
      setCurrencyInfo({
        code: currency,
        symbol: symbol,
        flag: flagEmoji,
      });
    }
  }, [currency, country]);

  if (!currencyInfo) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium ${className}`}
    >
      <span className="text-lg">{currencyInfo.flag}</span>
      <span>
        Showing prices in <strong>{currencyInfo.code}</strong>
      </span>
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  const flags: Record<string, string> = {
    GH: "🇬🇭",
    US: "🇺🇸",
    GB: "🇬🇧",
    UK: "🇬🇧",
    NG: "🇳🇬",
    DE: "🇩🇪",
    FR: "🇫🇷",
    ES: "🇪🇸",
    IT: "🇮🇹",
    NL: "🇳🇱",
  };

  return flags[countryCode] || "🌍";
}

function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    GHS: "₵",
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
  };

  return symbols[currencyCode] || currencyCode;
}

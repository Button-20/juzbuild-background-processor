"use client";

import { useEffect, useState } from "react";

interface Settings {
  contactMethods: string[];
  leadCaptureMethods: string[];
  includedPages: string[];
}

const defaultSettings: Settings = {
  contactMethods: [],
  leadCaptureMethods: [],
  includedPages: [],
};

let cachedSettings: Settings | null = null;
let settingsPromise: Promise<Settings> | null = null;

const fetchSettings = async (): Promise<Settings> => {
  if (cachedSettings) {
    return cachedSettings;
  }

  if (settingsPromise) {
    return settingsPromise;
  }

  settingsPromise = fetch("/api/settings")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.settings) {
        cachedSettings = {
          contactMethods: data.settings.contactMethods || [],
          leadCaptureMethods: data.settings.leadCaptureMethods || [],
          includedPages: data.settings.includedPages || [],
        };
        return cachedSettings;
      }
      return defaultSettings;
    })
    .catch((error) => {
      console.error("Failed to fetch settings:", error);
      return defaultSettings;
    })
    .finally(() => {
      settingsPromise = null;
    });

  return settingsPromise;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(
    cachedSettings || defaultSettings
  );
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    fetchSettings().then((fetchedSettings) => {
      setSettings(fetchedSettings);
      setLoading(false);
    });
  }, []);

  const isContactMethodEnabled = (method: string) => {
    return settings.contactMethods.includes(method);
  };

  const isLeadCaptureMethodEnabled = (method: string) => {
    return settings.leadCaptureMethods.includes(method);
  };

  const isPageIncluded = (page: string) => {
    return settings.includedPages.includes(page);
  };

  return {
    settings,
    loading,
    isContactMethodEnabled,
    isLeadCaptureMethodEnabled,
    isPageIncluded,
    isWhatsAppEnabled: isContactMethodEnabled("WhatsApp"),
    isEmailEnabled: isContactMethodEnabled("Email"),
    isPhoneEnabled: isContactMethodEnabled("Phone"),
    isAiChatbotEnabled: isLeadCaptureMethodEnabled("AI Chatbot"),
    isContactFormEnabled: isLeadCaptureMethodEnabled("Contact Form"),
    isInquiryFormEnabled: isLeadCaptureMethodEnabled("Inquiry Form"),
    isBlogEnabled: isPageIncluded("blog"),
    isAboutEnabled: isPageIncluded("about"),
  };
};

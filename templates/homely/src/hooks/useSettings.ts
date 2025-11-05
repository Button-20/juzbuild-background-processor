"use client";

import { useEffect, useState } from "react";

interface Settings {
  contactMethods: string[];
  leadCaptureMethods: string[];
}

const defaultSettings: Settings = {
  contactMethods: [],
  leadCaptureMethods: [],
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

  return {
    settings,
    loading,
    isContactMethodEnabled,
    isLeadCaptureMethodEnabled,
    isWhatsAppEnabled: isContactMethodEnabled("WhatsApp"),
    isEmailEnabled: isContactMethodEnabled("Email"),
    isPhoneEnabled: isContactMethodEnabled("Phone"),
    isAiChatbotEnabled: isLeadCaptureMethodEnabled("AI Chatbot"),
    isContactFormEnabled: isLeadCaptureMethodEnabled("Contact Form"),
    isInquiryFormEnabled: isLeadCaptureMethodEnabled("Inquiry Form"),
  };
};

"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSettings = void 0;
const react_1 = require("react");
const defaultSettings = {
    contactMethods: [],
    leadCaptureMethods: [],
    includedPages: [],
};
let cachedSettings = null;
let settingsPromise = null;
const fetchSettings = async () => {
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
const useSettings = () => {
    const [settings, setSettings] = (0, react_1.useState)(cachedSettings || defaultSettings);
    const [loading, setLoading] = (0, react_1.useState)(!cachedSettings);
    (0, react_1.useEffect)(() => {
        fetchSettings().then((fetchedSettings) => {
            setSettings(fetchedSettings);
            setLoading(false);
        });
    }, []);
    const isContactMethodEnabled = (method) => {
        return settings.contactMethods.includes(method);
    };
    const isLeadCaptureMethodEnabled = (method) => {
        return settings.leadCaptureMethods.includes(method);
    };
    const isPageIncluded = (page) => {
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
exports.useSettings = useSettings;
//# sourceMappingURL=useSettings.js.map
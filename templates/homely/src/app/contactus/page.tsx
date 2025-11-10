"use client";

import SEOComponent from "@/components/shared/SEOComponent";
import { useSettings } from "@/hooks/useSettings";
import { generatePageMetadata, SEO_CONFIG } from "@/lib/seo";
import { getAddress, getPhoneNumber, getSupportEmail } from "@/lib/siteConfig";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  company: string;
  subject: string;
  budget: string;
  timeline: string;
  message: string;
}

export default function ContactUs() {
  const initialFormData: FormData = {
    name: "",
    phone: "",
    email: "",
    company: "",
    subject: "",
    budget: "",
    timeline: "",
    message: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const { isPhoneEnabled, isEmailEnabled, isContactFormEnabled } =
    useSettings();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Your message has been sent successfully!",
        });
        resetForm();
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const contactMetadata = generatePageMetadata.contact();

  // Contact page schema
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${SEO_CONFIG.COMPANY_NAME}`,
    description: contactMetadata.description,
    url: `${SEO_CONFIG.WEBSITE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: SEO_CONFIG.COMPANY_NAME,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SEO_CONFIG.COMPANY_PHONE,
        contactType: "Customer Service",
        email: SEO_CONFIG.COMPANY_EMAIL,
        areaServed: SEO_CONFIG.SERVICE_AREAS.split(",").map((area) =>
          area.trim()
        ),
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: SEO_CONFIG.COMPANY_ADDRESS,
        addressLocality: SEO_CONFIG.PRIMARY_LOCATION,
      },
    },
  };

  // Track contact page view
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: contactMetadata.title,
        page_location: window.location.href,
        page_path: "/contact",
      });
    }
  }, [contactMetadata.title]);

  return (
    <>
      <SEOComponent
        title={contactMetadata.title as string}
        description={contactMetadata.description as string}
        canonical={`${SEO_CONFIG.WEBSITE_URL}/contact`}
        keywords={contactMetadata.keywords as string}
        structuredData={contactSchema}
      />

      <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28">
        <div className="mb-16">
          <div className="flex gap-2.5 items-center justify-center mb-3">
            <span>
              <Icon
                icon={"ph:house-simple-fill"}
                width={20}
                height={20}
                className="text-primary"
              />
            </span>
            <p className="text-base font-semibold text-badge dark:text-white/90">
              Contact us
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14">
              Have questions? ready to help!
            </h3>
            <p className="text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6">
              Looking for your dream home or ready to sell? Our expert team
              offers personalized guidance and market expertise tailored to you.
            </p>
          </div>
        </div>
        {/* form */}
        <div className="border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl dark:shadow-white/10">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 min-h-[600px]">
            <div className="relative w-full lg:w-fit shrink-0 h-[500px] lg:h-auto">
              <Image
                src="https://res.cloudinary.com/dho8jec7k/image/upload/v1760938661/contactUs_h5xh6w.jpg"
                alt="wall"
                width={497}
                height={630}
                className="rounded-2xl brightness-50 w-full lg:w-[497px] h-full min-h-[500px] lg:min-h-full object-cover"
                unoptimized={true}
              />
              <div className="absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2">
                <h5 className="text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white">
                  Contact information
                </h5>
                <p className="text-sm xs:text-base mobile:text-xm font-normal text-white/80">
                  Ready to find your dream home or sell your property? We’re
                  here to help!
                </p>
              </div>
              <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white">
                {/* Only show phone if enabled */}
                {isPhoneEnabled && (
                  <Link href={`tel:${getPhoneNumber()}`} className="w-fit">
                    <div className="flex items-center gap-4 group w-fit">
                      <Icon icon={"ph:phone"} width={32} height={32} />
                      <p className="text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary">
                        {getPhoneNumber()}
                      </p>
                    </div>
                  </Link>
                )}
                {/* Only show email if enabled */}
                {isEmailEnabled && (
                  <Link href={`mailto:${getSupportEmail()}`} className="w-fit">
                    <div className="flex items-center gap-4 group w-fit">
                      <Icon
                        icon={"ph:envelope-simple"}
                        width={32}
                        height={32}
                      />
                      <p className="text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary">
                        {getSupportEmail()}
                      </p>
                    </div>
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <Icon icon={"ph:map-pin"} width={32} height={32} />
                  <p className="text-sm xs:text-base mobile:text-xm font-normal">
                    {getAddress()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              {/* Show message if contact form is disabled */}
              {!isContactFormEnabled ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <Icon
                      icon="ph:envelope-simple-slash"
                      width={64}
                      height={64}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <h3 className="text-2xl font-semibold mb-2">
                      Contact Form Unavailable
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please use the contact information provided to reach us.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div
                      className={`mb-6 p-4 rounded-lg ${
                        submitStatus.type === "success"
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={
                            submitStatus.type === "success"
                              ? "ph:check-circle"
                              : "ph:warning-circle"
                          }
                          width={20}
                          height={20}
                        />
                        <p className="text-sm font-medium">
                          {submitStatus.message}
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          autoComplete="name"
                          placeholder="Name*"
                          required
                          disabled={isSubmitting}
                          className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          autoComplete="tel"
                          placeholder="Phone number*"
                          required
                          disabled={isSubmitting}
                          className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        placeholder="Email address*"
                        required
                        disabled={isSubmitting}
                        className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline disabled:opacity-50 disabled:cursor-not-allowed"
                      />

                      <div className="flex flex-col lg:flex-row gap-6">
                        <input
                          type="text"
                          name="company"
                          id="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Company (optional)"
                          disabled={isSubmitting}
                          className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <select
                          name="subject"
                          id="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select inquiry type*</option>
                          <option value="property_inquiry">
                            Property Inquiry
                          </option>
                          <option value="buy_property">Looking to Buy</option>
                          <option value="sell_property">Looking to Sell</option>
                          <option value="rent_property">Looking to Rent</option>
                          <option value="investment">
                            Investment Opportunities
                          </option>
                          <option value="valuation">Property Valuation</option>
                          <option value="general">General Information</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6">
                        <input
                          type="text"
                          name="budget"
                          id="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="Budget range (e.g., $100k - $200k)"
                          disabled={isSubmitting}
                          className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="timeline"
                          id="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          placeholder="Timeline (e.g., 3-6 months)"
                          disabled={isSubmitting}
                          className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-full outline-primary focus:outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <textarea
                        rows={8}
                        cols={50}
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Write here your message"
                        required
                        disabled={isSubmitting}
                        className="px-6 py-3.5 border border-black/10 dark:border-white/10 rounded-2xl outline-primary focus:outline disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:cursor-pointer hover:bg-dark duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Icon
                              icon="ph:spinner"
                              width={20}
                              height={20}
                              className="animate-spin"
                            />
                            Sending...
                          </>
                        ) : (
                          "Send message"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

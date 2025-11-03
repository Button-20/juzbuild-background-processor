"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order: number;
}

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("/api/faqs");
        if (response.ok) {
          const data = await response.json();
          setFaqs(data.faqs || []);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading || faqs.length === 0) {
    return null; // Hide section if no FAQs or loading
  }

  return (
    <section id="faqs" className="py-12 sm:py-16 lg:py-20">
      <div className="container max-w-8xl mx-auto px-4 sm:px-5 2xl:px-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="order-2 lg:order-1 mx-auto lg:mx-0">
            <Image
              src="https://res.cloudinary.com/dho8jec7k/image/upload/v1760938455/faq-image_jp6p4w.png"
              alt="FAQ illustration"
              width={680}
              height={644}
              className="w-full h-auto max-w-md sm:max-w-lg lg:max-w-full"
              unoptimized={true}
            />
          </div>
          <div className="order-1 lg:order-2 lg:px-8 xl:px-12">
            <p className="text-dark/75 dark:text-white/75 text-sm sm:text-base font-semibold flex gap-2 mb-3 sm:mb-4">
              <Icon
                icon="ph:house-simple-fill"
                className="text-xl sm:text-2xl text-primary"
              />
              FAQs
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-40 xl:text-52 leading-[1.2] font-medium text-dark dark:text-white mb-4 sm:mb-6">
              Everything about {process.env.NEXT_PUBLIC_COMPANY_NAME || "Homely"}
            </h2>
            <p className="text-dark/50 dark:text-white/50 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 lg:pr-8 xl:pr-20">
              We know that buying, selling, or investing in real estate can be
              overwhelming. Here are some frequently asked questions to help
              guide you through the process
            </p>
            <div className="mt-6 sm:mt-8">
              <Accordion
                type="single"
                defaultValue={
                  faqs.length > 0 ? `item-${faqs[0]._id}` : undefined
                }
                collapsible
                className="w-full flex flex-col gap-4 sm:gap-6"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq._id} value={`item-${faq._id}`}>
                    <AccordionTrigger className="text-sm sm:text-base font-medium hover:no-underline py-4 sm:py-6 text-left">
                      {index + 1}. {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-dark/70 dark:text-white/70 pb-4 sm:pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

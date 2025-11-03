import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Homely",
  description:
    "Learn more about our story, mission, vision, and the values that drive us to provide exceptional service to our clients.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

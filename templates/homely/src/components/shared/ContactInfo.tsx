"use client";

import { fetchContactData } from "@/lib/contactInfo-client";
import { useEffect, useState } from "react";

export default function ContactInfo() {
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await fetchContactData();
        setEmail(data.contact.supportEmail);
        setAddress(data.contact.address);
      } catch (error) {
        console.error("Failed to load contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  if (loading) {
    return <p>Loading contact information...</p>;
  }

  return (
    <>
      <p>
        Email: {email}
        <br />
        Address: {address}
      </p>
    </>
  );
}

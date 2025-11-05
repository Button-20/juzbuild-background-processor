"use client";

import { getAddress, getSupportEmail } from "@/lib/siteConfig";

export default function ContactInfo() {
  return (
    <>
      <p>
        Email: {getSupportEmail()}
        <br />
        Address: {getAddress()}
      </p>
    </>
  );
}

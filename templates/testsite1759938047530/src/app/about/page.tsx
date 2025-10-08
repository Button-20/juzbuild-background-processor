
import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Test Real Estate Company</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          We are a leading real estate company specializing in residential and commercial properties.
        </p>
        <p className="mb-4">
          Our team is dedicated to helping you find the perfect property that meets your needs and budget.
          With years of experience in the real estate market, we provide expert guidance throughout
          your property journey.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Services</h2>
        <ul className="list-disc pl-6">
          <li>Property Sales</li>
          <li>Property Rentals</li>
          <li>Property Management</li>
          <li>Investment Consultation</li>
        </ul>
      </div>
    </div>
  );
}

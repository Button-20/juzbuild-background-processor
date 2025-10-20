
import React from 'react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Contact Dejason Real Estate Group</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>jasonaddy51@gmail.com</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>Available upon request</p>
            </div>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>123 Real Estate Street<br />Property City, PC 12345</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows={4} className="w-full border rounded-md px-3 py-2"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

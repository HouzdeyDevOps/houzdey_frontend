"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "How do I list my property on Houzdey?",
      answer: "To list your property, click on the 'Create Listing' button in the navigation bar. Follow the step-by-step process to add property details, photos, and pricing information. Make sure to provide accurate information to attract potential tenants."
    },
    {
      question: "What are the fees for listing a property?",
      answer: "Basic listings are free. Premium features and enhanced visibility options are available with our Premium subscription plan. Visit our Premium page for detailed pricing information."
    },
    {
      question: "How long do listings stay active?",
      answer: "Free listings remain active for 30 days. Premium listings can be renewed automatically and stay active as long as your subscription is valid."
    },
    {
      question: "How can I contact property owners?",
      answer: "Once you find a property you're interested in, click the 'Contact Host' button on the listing page. You can then communicate directly with the property owner through our secure messaging system."
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg">
            <button
              className="w-full px-6 py-4 flex items-center justify-between"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-left">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface ContactMethod {
  label: string;
  value: string;
  action: string;
  link?: string;
}

export default function ContactInformation() {
  const contactMethods: ContactMethod[] = [
    {
      label: "Phone number:",
      value: "+2348042660894",
      action: "Call"
    },
    {
      label: "Email address:",
      value: "houzdey@gmail.com",
      action: "Email us"
    },
    {
      label: "Live chat",
      value: "chat/whatsapp.houzdey",
      action: "Message"
    }
  ];

  const socialLinks = [
    {
      url: "http/facebook:houzdey",
      platform: "Facebook"
    },
    {
      url: "http/linkedin:houzdey",
      platform: "LinkedIn"
    },
    {
      url: "http/twitter:houzdey",
      platform: "Twitter"
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Link href="/support" className="flex items-center text-gray-600">
          <ChevronLeft className="w-5 h-5" />
          <span>Support</span>
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Contact Information</h1>
      <p className="text-gray-600 mb-8">
        Contact us through our phone number, email address, a live chat or social media links.
      </p>

      <div className="space-y-8">
        {contactMethods.map((method, index) => (
          <div key={index} className="border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-2">{method.label}</h3>
                <p className="text-gray-600">{method.value}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                {method.action}
              </button>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <h3 className="font-medium mb-4">Social Media</h3>
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="text-gray-600">
                <Link href={link.url} className="hover:text-indigo-600">
                  {link.url}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
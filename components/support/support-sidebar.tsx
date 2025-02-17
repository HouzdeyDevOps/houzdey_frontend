"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Contact information",
    href: "/support/contact",
  },
  {
    label: "FAQs",
    href: "/support/faqs",
  },
  {
    label: "Submit a request",
    href: "/support/submit-request",
  },
  {
    label: "Community forums",
    href: "/support/forums",
  },
  {
    label: "Feedback",
    href: "/support/feedback",
  },
];

export default function SupportSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl shadow-sm min-h-screen sticky top-0">
      <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
        <span className="">
          <ChevronLeft className="w-6 h-6" />
        </span>
        Support
      </h2>
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg ${
              pathname === item.href
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

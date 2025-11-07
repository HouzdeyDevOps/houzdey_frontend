"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MessageCircle, 
  Book, 
  Send, 
  Users, 
  MessageSquare,
  Phone,
  Mail,
  Search,
  HelpCircle,
  FileText,
  Headphones
} from "lucide-react";

interface SupportOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface QuickLink {
  question: string;
  href: string;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const supportOptions: SupportOption[] = [
    {
      title: "Contact Information",
      description: "Get in touch with our support team via phone, email, or live chat",
      icon: <Phone className="w-6 h-6" />,
      href: "/support/contact",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "FAQs",
      description: "Find quick answers to commonly asked questions",
      icon: <HelpCircle className="w-6 h-6" />,
      href: "/support/faqs",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Submit a Request",
      description: "Create a support ticket for personalized assistance",
      icon: <Send className="w-6 h-6" />,
      href: "/support/submit-request",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Community Forums",
      description: "Join discussions and get help from the community",
      icon: <Users className="w-6 h-6" />,
      href: "/support/forums",
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Feedback",
      description: "Share your thoughts and help us improve Houzdey",
      icon: <MessageSquare className="w-6 h-6" />,
      href: "/support/feedback",
      color: "bg-pink-50 text-pink-600"
    }
  ];

  const quickLinks: QuickLink[] = [
    {
      question: "How do I list my property?",
      href: "/support/faqs"
    },
    {
      question: "What are the listing fees?",
      href: "/support/faqs"
    },
    {
      question: "How to contact property owners?",
      href: "/support/faqs"
    },
    {
      question: "How do I update my profile?",
      href: "/support/faqs"
    },
    {
      question: "What payment methods are accepted?",
      href: "/support/faqs"
    },
    {
      question: "How to report a property?",
      href: "/support/submit-request"
    }
  ];

  const filteredQuickLinks = quickLinks.filter(link =>
    link.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-4 rounded-full">
            <Headphones className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">How can we help you?</h1>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Welcome to Houzdey Support Center. Find answers, get assistance, and connect with our community.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Support Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportOptions.map((option, index) => (
          <Link
            key={index}
            href={option.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-indigo-200 group"
          >
            <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {option.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
              {option.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {option.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Popular Help Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(searchQuery ? filteredQuickLinks : quickLinks).map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:scale-125 transition-transform" />
              <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                {link.question}
              </span>
            </Link>
          ))}
        </div>
        {searchQuery && filteredQuickLinks.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No results found. Try a different search term or{" "}
            <Link href="/support/submit-request" className="text-indigo-600 hover:underline">
              submit a request
            </Link>
            .
          </p>
        )}
      </div>

      {/* Contact Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-indigo-100">
              Our support team is available 24/7 to assist you
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/support/contact"
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors text-center"
            >
              Contact Support
            </Link>
            <Link
              href="/support/submit-request"
              className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors border border-indigo-500 text-center"
            >
              Submit a Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
            <Book className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-semibold mb-2">Documentation</h4>
            <p className="text-sm text-gray-600 mb-3">
              Comprehensive guides and tutorials
            </p>
            <Link href="/support/faqs" className="text-indigo-600 text-sm font-medium hover:underline">
              Learn more →
            </Link>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
            <Users className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-semibold mb-2">Community</h4>
            <p className="text-sm text-gray-600 mb-3">
              Connect with other Houzdey users
            </p>
            <Link href="/support/forums" className="text-indigo-600 text-sm font-medium hover:underline">
              Join forums →
            </Link>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
            <Mail className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-semibold mb-2">Email Updates</h4>
            <p className="text-sm text-gray-600 mb-3">
              Get the latest news and updates
            </p>
            <Link href="/support/contact" className="text-indigo-600 text-sm font-medium hover:underline">
              Subscribe →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy - Houzdey",
  description: "Learn how Houzdey protects your privacy and handles your personal information. Read our privacy policy for details on data collection, usage, and security.",
  openGraph: {
    title: "Privacy Policy - Houzdey",
    description: "Learn how Houzdey protects your privacy and handles your personal information.",
    url: "https://houzdey.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-20">
          <Link
            href="/"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Back to Home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Your privacy and data security are our top priorities
          </p>
          <p className="text-indigo-200 mt-2">
            Last updated: November 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-7 h-7 text-indigo-600" />
                <h2 className="text-2xl md:text-3xl font-semibold">Your Privacy Matters</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                At Houzdey, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This privacy policy explains how we collect, use, and safeguard your data when you use our property listing and rental platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-7 h-7 text-indigo-600" />
                <h2 className="text-2xl md:text-3xl font-semibold">Information We Collect</h2>
              </div>
              <div className="space-y-5">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Name, email address, and phone number</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Profile pictures and identification documents</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Property preferences and search history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Communication records and messages</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-3">Property Information</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Property listings and descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Photos, videos, and virtual tours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Location and contact details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Rental history and reviews</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-3">Usage Information</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Device information and IP address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Browser type and operating system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Pages visited and features used</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>Cookies and similar tracking technologies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-7 h-7 text-indigo-600" />
                <h2 className="text-2xl md:text-3xl font-semibold">How We Use Your Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-3 text-lg">Service Delivery</h3>
                  <p className="text-blue-800">
                    To provide property search, listing management, and communication services between tenants, landlords, and agents.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-900 mb-3 text-lg">Security & Verification</h3>
                  <p className="text-green-800">
                    To verify user identities, prevent fraud, and maintain the safety and integrity of our platform community.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-3 text-lg">Communication</h3>
                  <p className="text-purple-800">
                    To send important updates, notifications, property alerts, and respond to your inquiries and support requests.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                  <h3 className="font-semibold text-orange-900 mb-3 text-lg">Service Improvement</h3>
                  <p className="text-orange-800">
                    To analyze usage patterns, improve our services, and develop new features based on user feedback and needs.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-7 h-7 text-indigo-600" />
                <h2 className="text-2xl md:text-3xl font-semibold">Data Protection & Security</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse:
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Encryption</h3>
                  <p className="text-sm text-gray-600">End-to-end encryption for all sensitive data transmission and storage</p>
                </div>
                <div className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Shield className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Secure Storage</h3>
                  <p className="text-sm text-gray-600">Protected servers with regular security audits and monitoring</p>
                </div>
                <div className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Eye className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Access Control</h3>
                  <p className="text-sm text-gray-600">Limited access to personal data on a strict need-to-know basis</p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Data Sharing & Third Parties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information to third parties. However, we may share your data in the following circumstances:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Service Providers</h3>
                    <p className="text-gray-600">With trusted service providers who help us operate our platform (e.g., cloud hosting, payment processing, email services)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Property Transactions</h3>
                    <p className="text-gray-600">With landlords, agents, or tenants when necessary to facilitate property viewings, bookings, or transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Legal Requirements</h3>
                    <p className="text-gray-600">When required by law, court order, or government regulations, or to protect our legal rights</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Your Rights & Choices</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Access & Update</h3>
                    <p className="text-gray-700">You can access and update your personal information at any time through your profile settings. You also have the right to request a copy of all data we hold about you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Data Deletion</h3>
                    <p className="text-gray-700">You can request deletion of your account and associated personal data by contacting our support team. Please note that some information may be retained for legal or legitimate business purposes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Communication Preferences</h3>
                    <p className="text-gray-700">You can manage your notification preferences and opt out of marketing communications at any time through your account settings or by clicking the unsubscribe link in our emails.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Data Portability</h3>
                    <p className="text-gray-700">You have the right to receive your personal data in a structured, commonly used format and to transfer it to another service provider where technically feasible.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Cookies & Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your experience on our platform. Cookies help us:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-gray-700">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Remember your preferences and settings</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Analyze site traffic and usage patterns</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Personalize content and property recommendations</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Measure the effectiveness of our marketing campaigns</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our platform.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-100">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Questions About Privacy?</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                If you have any questions about this privacy policy, how we handle your data, or if you wish to exercise any of your rights, please don't hesitate to contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email us</p>
                    <a href="mailto:privacy@houzdey.com" className="font-medium text-indigo-600 hover:text-indigo-700">
                      privacy@houzdey.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Call us</p>
                    <a href="tel:+2341234567890" className="font-medium text-indigo-600 hover:text-indigo-700">
                      +234 (0) 123 456 7890
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Privacy Policy</h2>
        <p className="text-gray-600">
          Last updated: November 2025
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-semibold">Your Privacy Matters</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            At Houzdey, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This privacy policy explains how we collect, use, and safeguard your data when you use our property rental platform.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-semibold">Information We Collect</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Personal Information</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Name, email address, and phone number</li>
                <li>• Profile pictures and identification documents</li>
                <li>• Property preferences and search history</li>
                <li>• Communication records and messages</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Property Information</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Property listings and descriptions</li>
                <li>• Photos and virtual tours</li>
                <li>• Location and contact details</li>
                <li>• Rental history and reviews</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-semibold">How We Use Your Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Service Delivery</h4>
              <p className="text-blue-800 text-sm">
                To provide property search, listing management, and communication services between tenants and landlords.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Security & Verification</h4>
              <p className="text-green-800 text-sm">
                To verify user identities, prevent fraud, and maintain the safety of our platform community.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Communication</h4>
              <p className="text-purple-800 text-sm">
                To send important updates, notifications, and respond to your inquiries and support requests.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Improvement</h4>
              <p className="text-orange-800 text-sm">
                To analyze usage patterns, improve our services, and develop new features based on user needs.
              </p>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-semibold">Data Protection</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Lock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Encryption</h4>
                <p className="text-sm text-gray-600">End-to-end encryption for all data transmission</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Secure Storage</h4>
                <p className="text-sm text-gray-600">Protected servers with regular security audits</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Eye className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Access Control</h4>
                <p className="text-sm text-gray-600">Limited access on a need-to-know basis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Your Rights & Choices</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Access & Update</h4>
                <p className="text-sm text-gray-600">You can access and update your personal information at any time through your profile settings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Data Deletion</h4>
                <p className="text-sm text-gray-600">You can request deletion of your account and associated data by contacting our support team.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Communication Preferences</h4>
                <p className="text-sm text-gray-600">You can manage your notification preferences and opt out of marketing communications.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Questions About Privacy?</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions about this privacy policy or how we handle your data, please don't hesitate to contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span className="text-sm">privacy@houzdey.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-600" />
              <span className="text-sm">+234 (0) 123 456 7890</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 
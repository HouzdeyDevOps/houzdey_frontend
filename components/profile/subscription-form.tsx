"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface PlanFeature {
  feature: string;
  free: boolean;
  premium: boolean;
}

export default function SubscriptionForm() {
  const [currentPlan, setCurrentPlan] = useState("free");

  const features: PlanFeature[] = [
    {
      feature: "Post up to 5 listings",
      free: true,
      premium: true,
    },
    {
      feature: "Listings stay active for 30 days.",
      free: true,
      premium: true,
    },
    {
      feature: "Basic listing analytics",
      free: true,
      premium: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Premium</h2>
      <h3 className="text-xl mb-4">Manage subscription</h3>
      
      <p className="text-gray-600 mb-8">
        Upgrade to Houzdey Premium and unlock the power to post multiple property listings, reach more
        potential buyers or renters, and maximize your visibility.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="border rounded-lg p-6">
          <h4 className="text-lg font-medium mb-6">Free</h4>
          <ul className="space-y-4 mb-8">
            {features.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {item.free && (
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                )}
                <span className="text-gray-600">{item.feature}</span>
              </li>
            ))}
          </ul>
          <div className="mb-6">
            <span className="text-2xl font-semibold">₦0</span>
            <span className="text-gray-600"> / month</span>
          </div>
          <button
            className={`w-full py-2 px-4 rounded-lg border ${
              currentPlan === "free"
                ? "bg-gray-100 text-gray-600"
                : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            }`}
            disabled={currentPlan === "free"}
          >
            Your current plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="border rounded-lg p-6">
          <h4 className="text-lg font-medium mb-6">Premium</h4>
          <ul className="space-y-4 mb-8">
            {features.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {item.premium && (
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                )}
                <span className="text-gray-600">{item.feature}</span>
              </li>
            ))}
          </ul>
          <div className="mb-6">
            <span className="text-2xl font-semibold">₦5000</span>
            <span className="text-gray-600"> / month</span>
          </div>
          <button
            className={`w-full py-2 px-4 rounded-lg ${
              currentPlan === "premium"
                ? "bg-gray-100 text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            disabled={currentPlan === "premium"}
          >
            {currentPlan === "premium" ? "Your current plan" : "Upgrade to premium"}
          </button>
        </div>
      </div>
    </div>
  );
}
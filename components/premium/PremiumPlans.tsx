"use client";

import { useState } from "react";
import { Check, Crown, Star, Zap, TrendingUp, Shield, HeadphonesIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
  color: string;
  savings?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
    icon: Star,
    color: "gray",
    features: [
      "List up to 3 properties",
      "Basic property details",
      "Standard image uploads (5 per property)",
      "Basic search visibility",
      "Email notifications",
      "Community support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 5000,
    period: "month",
    description: "Great for individual agents",
    icon: Zap,
    color: "blue",
    features: [
      "List up to 15 properties",
      "Enhanced property details",
      "Standard image uploads (15 per property)",
      "Video tours (1 per property)",
      "Priority in search results",
      "Email & SMS notifications",
      "Priority email support",
      "Basic analytics dashboard",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 15000,
    period: "month",
    description: "Best for growing agencies",
    icon: Crown,
    color: "indigo",
    popular: true,
    savings: "Save 40% with annual billing",
    features: [
      "Unlimited property listings",
      "Premium property showcase",
      "Unlimited image uploads",
      "Video tours (unlimited)",
      "Featured listings badge",
      "Top placement in search",
      "Advanced analytics & insights",
      "Email, SMS & WhatsApp notifications",
      "Priority phone support",
      "Virtual tour integration",
      "Lead management dashboard",
      "Custom property branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 50000,
    period: "month",
    description: "For large real estate firms",
    icon: Sparkles,
    color: "purple",
    savings: "Custom pricing available",
    features: [
      "Everything in Professional",
      "Multi-user team accounts",
      "White-label branding options",
      "API access for integrations",
      "Dedicated account manager",
      "24/7 priority support",
      "Custom reporting & analytics",
      "Advanced lead automation",
      "Training & onboarding",
      "SLA guarantees",
      "Custom integrations",
    ],
  },
];

const additionalFeatures = [
  {
    icon: TrendingUp,
    title: "Boost Your Visibility",
    description: "Premium listings get 5x more views on average",
  },
  {
    icon: Shield,
    title: "Verified Badge",
    description: "Build trust with potential clients instantly",
  },
  {
    icon: HeadphonesIcon,
    title: "Priority Support",
    description: "Get help when you need it, faster responses",
  },
];

export default function PremiumPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      showErrorToast("Please sign in to subscribe");
      router.push("/signin?redirect=/premium");
      return;
    }

    setIsLoading(planId);

    try {
      // TODO: Implement payment integration with Paystack
      // For now, show a coming soon message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showSuccessToast("Payment integration coming soon! We'll notify you when it's ready.");
      
      // Redirect to contact or support page for manual upgrade
      // router.push("/support?subject=premium-upgrade");
      
    } catch (error) {
      showErrorToast("Failed to process subscription. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return "Free";
    const price = billingCycle === "annual" ? plan.price * 10 : plan.price; // 2 months free on annual
    return `₦${price.toLocaleString()}`;
  };

  const getPlanPeriod = (plan: PricingPlan) => {
    if (plan.price === 0) return plan.period;
    return billingCycle === "annual" ? "year" : plan.period;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4">
          <Crown className="w-5 h-5" />
          <span className="font-medium">Upgrade to Premium</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your Perfect Plan
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Scale your real estate business with powerful tools and features designed for success
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === "annual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {pricingPlans.map((plan, index) => {
          const Icon = plan.icon;
          const isPopular = plan.popular;

          return (
            <motion.div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                isPopular ? "ring-2 ring-indigo-500 scale-105" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-${plan.color}-100 flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {getPlanPrice(plan)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/{getPlanPeriod(plan)}</span>
                    )}
                  </div>
                  {plan.savings && billingCycle === "annual" && (
                    <p className="text-sm text-green-600 mt-1">{plan.savings}</p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading !== null}
                  className={`w-full py-3 rounded-lg font-medium transition-all mb-6 ${
                    isPopular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } ${
                    isLoading === plan.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading === plan.id
                    ? "Processing..."
                    : plan.price === 0
                    ? "Current Plan"
                    : "Get Started"}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Features Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose Houzdey Premium?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Have Questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Our support team is here to help you choose the right plan
        </p>
        <button
          onClick={() => router.push("/support")}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <HeadphonesIcon className="w-5 h-5" />
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}

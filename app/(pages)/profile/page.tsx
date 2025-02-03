"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PersonalInfoForm from "@/components/profile/personal-info-form";
import SubscriptionForm from "@/components/profile/subscription-form";
import SecurityForm from "@/components/profile/security-form";
import ChangePasswordPage from "@/components/profile/change-password";
import Navbar from "@/components/navbar/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get("tab") || "personal"
  );

  const menuItems = [
    {
      id: "personal",
      title: "Personal information",
      description: "Update your details",
    },
    {
      id: "premium",
      title: "Premium",
      description: "Manage your subscription",
    },
    {
      id: "security",
      title: "Login & security",
      description: "Update password and settings",
      subItems: [
        {
          id: "change-password",
          title: "Change password",
          description: "Update your password",
        },
      ],
    },
    {
      id: "reviews",
      title: "Reviews",
      description: "View your reviews",
    },
    {
      id: "blocked",
      title: "Blocked",
      description: "Manage blocked users",
    },
    {
      id: "privacy",
      title: "Privacy policy",
      description: "View data policies",
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log(tabId);
    setActiveSection(tabId);
    router.push(`/profile?tab=${tabId}`, { scroll: false });
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && menuItems.some((item) => item.id === tab)) {
      setActiveSection(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false}/>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="flex items-center text-gray-600 gap-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xl font-bold text-black ">User profile</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeSection === item.id ||
                    item.subItems?.some(
                      (subItem) => subItem.id === activeSection
                    )
                      ? "bg-indigo-50 border-l-4 border-indigo-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </button>

                {item?.subItems && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item?.subItems?.map((subItem) => (
                      <button
                        onClick={() => handleTabChange(subItem.id)}
                        key={subItem.id}
                        className="block p-3 rounded-lg hover:bg-gray-100 transition-colors w-full"
                      >
                        <h4 className="font-medium text-sm text-left">
                          {subItem.title}
                        </h4>
                        <p className="text-xs text-gray-600 text-left">
                          {subItem.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Content children */}
          <div className="md:col-span-3">
            {activeSection === "personal" && <PersonalInfoForm />}
            {activeSection === "premium" && <SubscriptionForm />}
            {activeSection === "security" && <SecurityForm />}

            {/* sub items */}
            {activeSection === "change-password" && <ChangePasswordPage />}
          </div>
        </div>
      </div>
    </div>
  );
}

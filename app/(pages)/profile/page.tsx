"use client";

import { useState, useEffect, Suspense } from "react";
import ProfilePageSkeleton from "@/components/ui/profile-page-skeleton";
import ProfileContentSkeleton from "@/components/ui/profile-content-skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PersonalInfoForm from "@/components/profile/personal-info-form";
import SubscriptionForm from "@/components/profile/subscription-form";
import SecurityForm from "@/components/profile/security-form";
import ChangePasswordPage from "@/components/profile/change-password";
import ProfileReviews from "@/components/profile/ProfileReviews";
import BlockedUsers from "@/components/profile/BlockedUsers";
import PrivacyPolicy from "@/components/profile/PrivacyPolicy";
import Navbar from "@/components/navbar/Navbar";
import ProtectedRoute from "@/components/auth/protected-route";

function ProfileContent() {
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
    if (tab && menuItems.some((item) => item.id === tab || item.subItems?.some(subItem => subItem.id === tab))) {
      setActiveSection(tab);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoForm />;
      case "premium":
        return <SubscriptionForm />;
      case "security":
        return <SecurityForm />;
      case "change-password":
        return <ChangePasswordPage />;
      case "reviews":
        return <ProfileReviews />;
      case "blocked":
        return <BlockedUsers />;
      case "privacy":
        return <PrivacyPolicy />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      
      <div className="flex">
        {/* Fixed Left Panel - Profile Header + Sidebar */}
        <div className="hidden md:block md:fixed md:top-24 md:left-0 md:w-80 md:h-[calc(100vh-6rem)] md:bg-white md:border-r md:border-gray-200 md:shadow-sm md:overflow-y-auto">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center text-gray-600 gap-2 hover:text-gray-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xl font-bold text-black">User profile</span>
            </Link>
          </div>

          {/* Sidebar Menu */}
          <div className="p-4">
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
                          className={`block p-3 rounded-lg transition-colors w-full ${
                            activeSection === subItem.id
                              ? "bg-indigo-50 border-l-4 border-indigo-600"
                              : "hover:bg-gray-100"
                          }`}
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
          </div>
        </div>

        {/* Mobile Header (visible on small screens) */}
        <div className="md:hidden w-full">
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 py-4">
              <Link href="/" className="flex items-center text-gray-600 gap-2 hover:text-gray-800 transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xl font-bold text-black">User profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-80">
          <div className="px-4 sm:px-8 pt-8 md:pt-28 pb-8">
            {/* Mobile Sidebar */}
            <div className="md:hidden mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
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
                              className={`block p-3 rounded-lg transition-colors w-full ${
                                activeSection === subItem.id
                                  ? "bg-indigo-50 border-l-4 border-indigo-600"
                                  : "hover:bg-gray-100"
                              }`}
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
              </div>
            </div>

            {/* Main Content */}
            <Suspense fallback={<ProfileContentSkeleton />}>
              {renderContent()}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfileContent />
      </Suspense>
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { MessageCircle, Phone, AlertTriangle } from "lucide-react";
import { chatApi } from "@/api/chat";
import PhoneVerificationModal from "@/components/modals/PhoneVerificationModal";
import { propertyApi } from "@/api/properties";
import { useAuth } from "@/hooks/useAuth";
import { setCurrentModal } from "@/store/slices/authModalSlice";

interface PropertyContactSectionProps {
  propertyId: string;
  host: {
    name: string;
    image: string;
    company: string;
    role: string;
    phone_number?: string;
  };
  isOwner: boolean;
  userId?: string;
  // Agent details for scraped properties
  agent_name?: string;
  agent_phone?: string;
}

export default function PropertyContactSection({
  propertyId,
  host,
  isOwner,
  userId,
  agent_name,
  agent_phone,
}: PropertyContactSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  // Use agent info if available (for scraped properties), otherwise use host info
  const contactName = agent_name || host.name;
  const contactPhone = agent_phone || host.phone_number;

  const handleContactHost = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      dispatch(setCurrentModal("signin"));
      return;
    }

    try {
      setIsLoading(true);
      const conversation = await chatApi.createConversation(propertyId);
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerified = async (phoneNumber: string) => {
    try {
      // Refresh to get updated host info
      window.location.reload();
    } catch (err) {
      console.error("Error refreshing property data:", err);
    }
  };

  return (
    <>
      <div className="sticky top-40">
        <div className="border rounded-xl p-6 space-y-4">
          {isOwner ? (
            /* Owner View - Show property management options */
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Your Property
                </h3>
                <p className="text-sm text-green-700">
                  This is your property listing. You can manage it from your dashboard.
                </p>
              </div>
              <button
                onClick={() => router.push("/manage-listings")}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                Manage Listing
              </button>
            </div>
          ) : (
            /* Visitor View - Show contact options */
            <>
              {contactPhone ? (
                <>
                  <button
                    onClick={handleContactHost}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {isLoading ? "Loading..." : "Chat with Host"}
                  </button>
                  <a
                    href={`tel:${contactPhone}`}
                    className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    {agent_name ? "Call Agent" : "Call Host"}
                  </a>
                </>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        Contact information not available
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        The host hasn't provided contact information yet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showPhoneVerificationModal}
        onClose={() => setShowPhoneVerificationModal(false)}
        onVerified={handlePhoneVerified}
      />
    </>
  );
}

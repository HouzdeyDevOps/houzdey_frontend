"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, AlertTriangle } from "lucide-react";
import PhoneVerificationModal from "@/components/modals/PhoneVerificationModal";

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
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false);
  const router = useRouter();

  const contactPhone = agent_phone || host.phone_number;

  const handlePhoneVerified = async (phoneNumber: string) => {
    window.location.reload();
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
                  <a
                    href={`tel:${contactPhone}`}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
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

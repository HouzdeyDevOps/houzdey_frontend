import { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import PremiumPlans from "@/components/premium/PremiumPlans";

export const metadata: Metadata = {
  title: "Premium Plans - Unlock More Features",
  description: "Upgrade to Houzdey Premium and get access to exclusive features, priority support, and unlimited property listings.",
  keywords: "premium, subscription, property listing, real estate premium, houzdey premium",
  openGraph: {
    title: "Premium Plans - Houzdey",
    description: "Upgrade to Houzdey Premium and get access to exclusive features",
    type: "website",
  },
};

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />
      <main className="pt-24 pb-16">
        <PremiumPlans />
      </main>
    </div>
  );
}

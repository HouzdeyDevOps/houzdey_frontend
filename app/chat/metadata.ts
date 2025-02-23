import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Houzdey - Connect with Property Owners",
  description: "Chat with property owners and interested tenants in real-time. Discuss property details, arrange viewings, and negotiate terms securely on Houzdey.",
  keywords: "property chat, real estate messaging, tenant communication, landlord messages, property viewing arrangement",
  openGraph: {
    title: "Messages | Houzdey",
    description: "Connect with property owners and interested tenants in real-time",
    type: "website",
    siteName: "Houzdey",
  },
  robots: {
    index: false, // Don't index chat pages for privacy
    follow: true,
  },
}; 
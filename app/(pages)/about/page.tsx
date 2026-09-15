import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, MapPin, Mail, Building2, Home, Users, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us - Houzdey",
  description:
    "Learn about Houzdey — Nigeria's trusted real estate platform for finding, renting, and buying properties. A product of Keleddy Innovations Limited (RC No. 8989070).",
  openGraph: {
    title: "About Us - Houzdey",
    description:
      "Houzdey is Nigeria's trusted platform for property listings, rentals, and sales. A product of Keleddy Innovations Limited.",
    url: "https://houzdey.com/about",
  },
  alternates: {
    canonical: "/about",
  },
};

const stats = [
  { label: "Properties Listed", value: "10,000+" },
  { label: "Nigerian States Covered", value: "37" },
  { label: "Verified Landlords", value: "2,000+" },
  { label: "Happy Tenants", value: "5,000+" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "Every listing is reviewed to ensure accuracy. We verify landlords and agents so you can browse with confidence.",
  },
  {
    icon: Home,
    title: "Homes for Everyone",
    description:
      "From budget-friendly rooms to luxury apartments, we connect Nigerians at every income level with the right home.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We build tools that empower both property seekers and owners — making the rental and sales process simple for all.",
  },
  {
    icon: Building2,
    title: "Pan-Nigeria Coverage",
    description:
      "We cover all 36 states and the FCT, with deep local knowledge of every major city and neighbourhood.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-20">
          <Link
            href="/"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Back to Home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Houzdey</h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Nigeria&apos;s trusted platform for finding, renting, and buying properties — built by Nigerians, for Nigerians.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Mission */}
        <section className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Houzdey was built to solve a real problem: finding a home in Nigeria is hard. Listings are scattered, unverified, and often misleading.
            We set out to create a single, trustworthy platform where property seekers can browse thousands of verified listings across every Nigerian state — and where landlords and agents can reach genuine buyers and tenants quickly.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mt-4">
            Whether you&apos;re looking for a one-bedroom flat in Lagos, a family duplex in Abuja, or land in Enugu, Houzdey makes it easy, safe, and transparent.
          </p>
        </section>

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-6 shadow-sm text-center"
              >
                <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                    <p className="text-sm text-gray-500">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Company Info */}
        <section className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Houzdey is a product of{" "}
              <span className="font-semibold text-gray-900">Keleddy Innovations Limited</span>, a technology company incorporated in Nigeria and registered with the Corporate Affairs Commission (CAC).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Registered Name</p>
                <p className="font-semibold text-gray-900">Keleddy Innovations Limited</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">RC Number</p>
                <p className="font-semibold text-gray-900">8989070</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Incorporated</p>
                <p className="font-semibold text-gray-900">November 2025</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Country</p>
                <p className="font-semibold text-gray-900">Federal Republic of Nigeria</p>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p>
                <span className="font-medium text-gray-700">Address: </span>
                Plot 519 Biejina Street by Splendour, Airport Extension, Thinkers Corner, Enugu, Enugu State
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <p>
                <span className="font-medium text-gray-700">Email: </span>
                <a href="mailto:Houzdey@gmail.com" className="text-indigo-600 hover:underline">
                  Houzdey@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}

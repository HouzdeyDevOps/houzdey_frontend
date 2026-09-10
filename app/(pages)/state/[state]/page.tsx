import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { nigeriaStates, statesBySlug, zoneGradients } from "@/data/nigeria-states";
import StatePropertyListings from "@/components/state/StatePropertyListings";
import Navbar from "@/components/navbar/Navbar";
import { MapPin, Users, Square, Building2, ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  return nigeriaStates.map((s) => ({ state: s.slug }));
}

export const revalidate = 3600;

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const data = statesBySlug[slug];
  if (!data) return {};

  const title = `Properties for Rent & Sale in ${data.name} State | Houzdey`;
  const description = `Find houses, apartments, and land for rent or sale in ${data.name} State, Nigeria. ${data.propertyContext}`;
  const canonical = `https://houzdey.com/state/${data.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Houzdey",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function StateLandingPage({ params }: Props) {
  const { state: slug } = await params;
  const data = statesBySlug[slug];

  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://houzdey.com" },
          {
            "@type": "ListItem",
            position: 2,
            name: `${data.name} Properties`,
            item: `https://houzdey.com/state/${data.slug}`,
          },
        ],
      },
      {
        "@type": "Place",
        name: `${data.name} State, Nigeria`,
        description: data.description,
        address: {
          "@type": "PostalAddress",
          addressRegion: data.name,
          addressCountry: "NG",
        },
        containedInPlace: { "@type": "Country", name: "Nigeria" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50">
        <Navbar showSearch={false} showPropertyTypeFilters={false} />

        {/* Breadcrumb */}
        <div className="pt-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/state" className="hover:text-primary transition-colors">All States</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-gray-800 font-medium">{data.name}</span>
          </div>
        </div>

        {/* Hero */}
        <div>
          {/* Landmark image / gradient banner */}
          <div className="relative h-48 md:h-64 w-full overflow-hidden">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt={`${data.name} landmark`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${
                  zoneGradients[data.region] ?? "from-gray-500 to-gray-700"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 left-4 sm:left-8">
              <p className="text-white/80 text-sm font-medium">{data.region} · Nigeria</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-0.5">
                {data.name} State
              </h1>
            </div>
          </div>

          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              {/* Stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: MapPin, label: "Capital", value: data.capital },
                  { icon: Users, label: "Population", value: data.population },
                  { icon: Square, label: "Area", value: data.area },
                  { icon: Building2, label: "LGAs", value: `${data.lgaCount} LGAs` },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* About */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About {data.name} State</h2>
                <p className="text-gray-600 leading-relaxed">{data.description}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Economy</h2>
                <p className="text-gray-600 leading-relaxed">{data.economy}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Real Estate in {data.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">{data.propertyContext}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Known For</h3>
                <ul className="space-y-2">
                  {data.knownFor.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Major Cities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.majorCities.map((city) => (
                    <span
                      key={city}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Landmarks</h3>
                <ul className="space-y-2">
                  {data.landmarks.map((lm) => (
                    <li key={lm} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                      {lm}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Live property listings */}
          <StatePropertyListings stateName={data.name} />
        </div>
      </main>
    </>
  );
}

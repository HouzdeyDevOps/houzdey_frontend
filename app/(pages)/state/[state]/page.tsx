import { notFound } from "next/navigation";
import { Metadata } from "next";
import { nigeriaStates, statesBySlug } from "@/data/nigeria-states";
import StatePropertyListings from "@/components/state/StatePropertyListings";
import Navbar from "@/components/navbar/Navbar";
import { MapPin, Users, Square, Building2 } from "lucide-react";

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

        {/* Hero */}
        <div className="bg-white border-b border-gray-100 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span>Nigeria</span>
              <span>›</span>
              <span className="text-gray-900 font-medium">{data.region}</span>
              <span>›</span>
              <span className="text-gray-900 font-medium">{data.name}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {data.name} State
            </h1>
            <p className="text-gray-500 text-base mb-6">{data.region} · Capital: {data.capital}</p>

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

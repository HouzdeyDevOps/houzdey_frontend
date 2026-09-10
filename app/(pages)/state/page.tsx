import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import { nigeriaStates, zoneGradients } from "@/data/nigeria-states";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Properties by State in Nigeria | Houzdey",
  description:
    "Find houses, apartments, and land for rent or sale across all 36 states and FCT in Nigeria. Browse properties by state on Houzdey.",
  alternates: { canonical: "https://houzdey.com/state" },
  openGraph: {
    title: "Browse Properties by State in Nigeria | Houzdey",
    description:
      "Explore property listings across every Nigerian state — from Lagos to Kano, Enugu to Abuja.",
    url: "https://houzdey.com/state",
    siteName: "Houzdey",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const ZONE_ORDER = [
  "South West",
  "South East",
  "South South",
  "North Central",
  "North West",
  "North East",
];

const zoneColors: Record<string, string> = {
  "South West":   "bg-violet-50 border-violet-100 text-violet-700",
  "South East":   "bg-emerald-50 border-emerald-100 text-emerald-700",
  "South South":  "bg-cyan-50 border-cyan-100 text-cyan-700",
  "North Central":"bg-amber-50 border-amber-100 text-amber-700",
  "North West":   "bg-orange-50 border-orange-100 text-orange-700",
  "North East":   "bg-rose-50 border-rose-100 text-rose-700",
};

export default function StateLandingIndex() {
  const byZone = ZONE_ORDER.map((zone) => ({
    zone,
    states: nigeriaStates.filter((s) => s.region === zone),
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} showPropertyTypeFilters={false} />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-sm text-primary font-medium mb-2">Explore Nigeria</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Browse Properties by State
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Find houses, apartments, and land for rent or sale across all 36 states and the
            Federal Capital Territory. Select a state to explore listings and learn more about
            the property market.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {byZone.map(({ zone, states }) => (
          <section key={zone}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold text-gray-900">{zone}</h2>
              <span className="text-xs text-gray-400">{states.length} states</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {states.map((state) => (
                <Link
                  key={state.slug}
                  href={`/state/${state.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Image / gradient banner */}
                  <div className="relative h-32 w-full overflow-hidden">
                    {state.imageUrl ? (
                      <Image
                        src={state.imageUrl}
                        alt={`${state.name} landmark`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          zoneGradients[state.region] ?? "from-gray-400 to-gray-600"
                        } flex items-end p-3`}
                      >
                        <span className="text-white/70 text-xs font-medium">{state.region}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {state.name}
                      </h3>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                          zoneColors[state.region] ?? "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        {state.region.split(" ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Capital: {state.capital}</span>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {state.knownFor.slice(0, 2).join(" · ")}
                    </p>

                    <div className="mt-auto pt-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View properties →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

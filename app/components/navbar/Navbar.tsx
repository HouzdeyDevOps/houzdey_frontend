import Link from "next/link";
import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import CreateListingModal from "../properties/create-listing-modal/create-listing-modal";

const Navbar = () => {
  const [showCreateListing, setShowCreateListing] = useState(false);

  return (
    <div>
      <header className="p-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <Image
              src="/assets/images/houzdey-logo.png"
              alt="Houzdey"
              width={180}
              height={50}
            />
          </Link>
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative flex flex-1 items-center justify-center gap-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Properties, Locations ..."
                  className="w-full px-4 py-3 border shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2">
                  <Search />
                </button>
              </div>
              <button className="p-1 hover:text-gray-700">
                {/* count of filters */}
                <span className="absolute -top-2 -right-3 bg-indigo-60 text-black rounded-full px-2 py-1 text-sm">
                  5
                </span>
                <SlidersHorizontal className="w-7 h-7 text-indigo-600" />
              </button>
            </div>
          </div>
          <div className="flex gap-4 justify-end items-center">
            <button
              onClick={() => setShowCreateListing(true)}
              className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Create listing
            </button>
            <Link href="/auth/signup" className="px-4 py-2 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </header>
      {/* Property Type Filters */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-8 overflow-x-auto py-4">
            <li>
              <Link
                href="/"
                className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1"
              >
                All
              </Link>
            </li>
            {[
              "Apartments",
              "Bungalows",
              "Detached houses",
              "Duplexes",
              "Flats",
              "Mansions",
              "Office spaces",
              "Penthouses",
            ].map((type) => (
              <li key={type}>
                <Link
                  href={`/properties?type=${type.toLowerCase()}`}
                  className="text-gray-600 hover:text-gray-900 dark:"
                >
                  {type}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Add the modal component: */}
      <CreateListingModal
        isOpen={showCreateListing}
        onClose={() => setShowCreateListing(false)}
      />
    </div>
  );
};

export default Navbar;

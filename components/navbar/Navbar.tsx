"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import CreateListingModal from "../properties/create-listing-modal/create-listing-modal";
import SignUpModal from "../auth/signup-modal";
import PropertyTypeNav from "./PropertyTypeNav";
import FilterModal from "../properties/filter-modal";

const Navbar = ({
  showSearch,
  showPropertyTypeFilters,
}: {
  showSearch: boolean;
  showPropertyTypeFilters: boolean;
}) => {
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  return (
    <div>
      {/* nav bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <header
          className={`relative border-b ${
            showPropertyTypeFilters ? "p-4" : "p-2"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <Image
                src="/assets/images/houzdey-logo.png"
                alt="Houzdey"
                width={180}
                height={50}
              />
            </Link>
            {showSearch && (
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
                  <button
                    onClick={() => setShowFilters(true)}
                    className="p-1 hover:text-gray-700 relative"
                  >
                    {filterCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-indigo-60 text-black rounded-full px-2 py-1 text-sm">
                        {filterCount}
                      </span>
                    )}
                    <SlidersHorizontal className="w-7 h-7 text-indigo-600" />
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-end items-center">
              <button
                onClick={() => setShowCreateListing(true)}
                className="px-4 py-3 font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Create listing
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="px-4 py-2 font-bold hover:text-indigo-600"
              >
                Sign up
              </button>
            </div>
          </div>
        </header>

        {/* Property Type Filters */}
        {showPropertyTypeFilters && (
          <>
            <nav className="border-b">
              <PropertyTypeNav />
            </nav>
          </>
        )}

        {/* Add the modal component: */}
        <CreateListingModal
          isOpen={showCreateListing}
          onClose={() => setShowCreateListing(false)}
        />
        <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onFilterChange={setFilterCount}
        />
      </div>
    </div>
  );
};

export default Navbar;

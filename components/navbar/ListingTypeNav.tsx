"use client";

import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/propertySlice";
import { RootState } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function ListingTypeNav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentListingType = useSelector((state: RootState) => state.property.filters.listing_type);

  useEffect(() => {
    const listingType = searchParams.get('listing_type');
    if (listingType && listingType !== currentListingType) {
      console.log('Setting initial listing type from URL:', listingType);
      dispatch(setFilters({
        listing_type: listingType,
        page: 1
      }));
    }
  }, [searchParams, dispatch, currentListingType]);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleListingTypeClick = (type: string | null) => {
    console.log('Listing type clicked:', type);
    console.log('Current listing type:', currentListingType);

    const filterUpdate = {
      listing_type: type || undefined,
      page: 1
    };
    console.log('Dispatching filter update:', filterUpdate);
    dispatch(setFilters(filterUpdate));

    const queryString = type ? createQueryString("listing_type", type) : createQueryString("listing_type", null);
    const newPath = pathname + (queryString ? "?" + queryString : "");
    console.log('Updating URL to:', newPath);
    router.push(newPath);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 border-b">
      <div className="flex gap-8 py-4">
        <button
          onClick={() => handleListingTypeClick(null)}
          className={`text-gray-600 hover:text-gray-900 font-medium pb-2 px-4 transition-colors ${
            !currentListingType ? "text-indigo-600 border-b-2 border-indigo-600" : ""
          }`}
        >
          All Properties
        </button>
        <button
          onClick={() => handleListingTypeClick('rent')}
          className={`text-gray-600 hover:text-gray-900 font-medium pb-2 px-4 transition-colors ${
            currentListingType === 'rent' ? "text-blue-600 border-b-2 border-blue-600" : ""
          }`}
        >
          🏠 For Rent
        </button>
        <button
          onClick={() => handleListingTypeClick('sale')}
          className={`text-gray-600 hover:text-gray-900 font-medium pb-2 px-4 transition-colors ${
            currentListingType === 'sale' ? "text-green-600 border-b-2 border-green-600" : ""
          }`}
        >
          🏡 For Sale
        </button>
      </div>
    </div>
  );
} 
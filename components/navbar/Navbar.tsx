"use client";

import Link from "next/link";
import React, { useState, Suspense } from "react";
import { Search, SlidersHorizontal, X, AlertTriangle, Menu, List, Heart, Settings, LogOut, Bell } from "lucide-react";
import Image from "next/image";
import CreateListingModal from "../properties/create-listing-modal/create-listing-modal";
import SignUpModal from "../auth/signup-modal";
import PropertyTypeNav from "./PropertyTypeNav";
import PropertyTypeNavSkeleton from "@/components/ui/property-type-nav-skeleton";
import FilterModal from "../properties/filter-modal";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentModal, closeModal } from "@/store/slices/authModalSlice";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { RootState } from "@/store/store";
import SignInModal from "../auth/signin-modal";
import { PropertyFilters } from "@/@types/property";
import { useRouter } from "next/navigation";
import PhoneVerificationModal from "@/components/modals/PhoneVerificationModal";
import { User, logout } from "@/store/slices/userAuthSlice";
import ForgotPasswordModal from "../auth/forgot-password-modal";
import ResetPasswordModal from "../auth/reset-password-modal";

interface NavbarProps {
  showSearch: boolean;
  showPropertyTypeFilters: boolean;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: Partial<PropertyFilters>) => void;
  onFilterClick?: () => void;
  showListingButton?: boolean;
}

const Navbar = ({
  showSearch,
  showPropertyTypeFilters,
  onSearchChange,
  onFilterChange,
  onFilterClick,
  showListingButton = true,
}: NavbarProps) => {
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] =
    useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const currentModal = useSelector(
    (state: RootState) => state.authModal.currentModal
  );
  const email = useSelector((state: RootState) => state.userAuth.email);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const MobileMenu = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
        <div className="flex justify-end p-4">
          <button onClick={toggleMobileMenu} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-4 py-2 space-y-6">
          {user ? (
            <div className="flex items-center gap-3 px-2">
              <Image
                src={user?.profile_picture || "/assets/images/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
                style={{ width: '40px', height: '40px' }}
              />
              <div>
                <p className="font-semibold">{[user.first_name, user.last_name].filter(Boolean).join(' ') || 'User'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          ) : null}

          {/* Mobile Search */}
          {showSearch && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Properties, Locations ..."
                  className="w-full px-4 py-3 border shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2">
                  <Search />
                </button>
              </div>
              <button
                onClick={() => {
                  onFilterClick?.();
                  toggleMobileMenu();
                }}
                className="flex items-center gap-2 p-2 w-full hover:bg-gray-50 rounded-lg"
              >
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <span>Filters {filterCount > 0 && `(${filterCount})`}</span>
              </button>
            </div>
          )}

          {/* Mobile Property Type Filters */}
          {showPropertyTypeFilters && (
            <div className="py-2 border-t">
              <Suspense fallback={<PropertyTypeNavSkeleton />}>
                <PropertyTypeNav visibleCount={3} />
              </Suspense>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 border-t pt-4">
            {showListingButton && (
              <button
                onClick={() => {
                  if (user) {
                    setShowCreateListing(true);
                  } else {
                    dispatch(setCurrentModal("signin"));
                  }
                  toggleMobileMenu();
                }}
                className="w-full px-4 py-3 font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Create listing
              </button>
            )}
            {!user && (
              <button
                onClick={() => {
                  dispatch(closeModal());
                  dispatch(setCurrentModal("signup"));
                  toggleMobileMenu();
                }}
                className="w-full px-4 py-2 font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl"
              >
                Sign up
              </button>
            )}
          </div>

          {/* User Menu Items */}
          {user && (
            <div className="space-y-1 border-t pt-4">
              <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span>Notifications</span>
                </div>
                <NotificationDropdown />
              </div>
              <Link
                href="/manage-listings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <List className="w-5 h-5 text-gray-500" />
                <span>Manage listings</span>
              </Link>
              <Link
                href="/favourites"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <Heart className="w-5 h-5 text-gray-500" />
                <span>Favourites</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <Settings className="w-5 h-5 text-gray-500" />
                <span>Settings</span>
              </Link>
              <button
                onClick={() => {
                  dispatch(logout());
                  toggleMobileMenu();
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-red-600 w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* nav bar */}

      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        {user?.phone_verified === false && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Please verify your phone number to enable all features
                  <button
                    onClick={() => setShowPhoneVerificationModal(true)}
                    className="ml-2 font-medium text-blue-700 underline hover:text-blue-600"
                  >
                    Verify now
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        <header
          className={`relative border-b ${
            showPropertyTypeFilters ? "p-4" : "p-2"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="text-2xl font-bold"
            >
              <Image
                src="/assets/images/houzdey-logo.png"
                alt="Houzdey"
                width={180}
                height={40}
                style={{ width: "auto", height: "80px" }}
                priority
              />
            </button>
            
            {/* Desktop Search */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative flex flex-1 items-center justify-center gap-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search Properties, Locations ..."
                      className="w-full px-4 py-3 border shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                    <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2">
                      <Search />
                    </button>
                  </div>
                  <button
                    onClick={() => onFilterClick?.()}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-gray-700 relative"
                  >
                    {filterCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-indigo-600 text-white rounded-full px-2 py-1 text-xs">
                        {filterCount}
                      </span>
                    )}
                    <SlidersHorizontal className="w-7 h-7 text-indigo-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4 justify-end items-center">
              {showListingButton && (
                <button
                  onClick={
                    user
                      ? () => setShowCreateListing(true)
                      : () => dispatch(setCurrentModal("signin"))
                  }
                  className="px-4 py-3 font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Create listing
                </button>
              )}
              {user ? (
                <ProfileDropdown />
              ) : (
                <button
                  onClick={() => {
                    dispatch(closeModal());
                    dispatch(setCurrentModal("signup"));
                  }}
                  className="px-4 py-2 font-bold hover:text-indigo-600"
                >
                  Sign up
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Desktop Property Type Filters */}
        {showPropertyTypeFilters && (
          <nav className="border-b px-4 py-2 hidden md:block">
            <Suspense fallback={<PropertyTypeNavSkeleton />}>
              <PropertyTypeNav />
            </Suspense>
          </nav>
        )}

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Add the modal component: */}
        <CreateListingModal
          isOpen={showCreateListing}
          onClose={() => setShowCreateListing(false)}
        />
        <SignUpModal
          isOpen={currentModal === "signup"}
          onClose={() => {
            dispatch(closeModal());
          }}
        />

        <SignInModal
          isOpen={currentModal === "signin"}
          onClose={() => {
            dispatch(closeModal());
          }}
        />
        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onFilterChange={(filters) => {
            onFilterChange?.(filters);
            setFilterCount(Object.keys(filters).length);
          }}
        />

        {/* Add PhoneVerificationModal */}
        <PhoneVerificationModal
          isOpen={showPhoneVerificationModal && !user?.phone_verified}
          onClose={() => setShowPhoneVerificationModal(false)}
          onVerified={(phoneNumber: string) => {
            // Update user state with verified phone number
            dispatch({
              type: "userAuth/updateUser",
              payload: { phone_verified: true, phone_number: phoneNumber },
            });
          }}
        />

        <ForgotPasswordModal
          isOpen={currentModal === "forgotPassword"}
          onClose={() => dispatch(closeModal())}
          onBack={() => dispatch(setCurrentModal("signin"))}
        />

        <ResetPasswordModal
          isOpen={currentModal === 'resetPassword'}
          onClose={() => dispatch(closeModal())}
          onBack={() => dispatch(setCurrentModal('forgotPassword'))}
          email={email || ''}
        />
      </div>
    </div>
  );
};

export default Navbar;

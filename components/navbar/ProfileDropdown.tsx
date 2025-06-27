import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userAuthSlice";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  Settings,
  LogOut,
  Heart,
  Crown,
  HelpCircle,
  List,
  Bell,
} from "lucide-react";
import { RootState } from "@/store/store";
import CreateListingModal from "../properties/create-listing-modal/create-listing-modal";
import NotificationDropdown from "./NotificationDropdown";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userAuth.user);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const menuItems = [
    { label: "Chats", icon: MessageSquare, href: "/chat" },
    { 
      label: "Create a listing", 
      icon: List, 
      onClick: () => {
        setShowCreateListing(true);
        setIsOpen(false);
      }
    },
    {
      label: "Manage listings",
      icon: List,
      href: "/manage-listings",
      badge: "1",
    },
    { label: "Favourite listings", icon: Heart, href: "/favourites" },
    { label: "User profile", icon: Settings, href: "/profile" },
    { label: "Premium subscription", icon: Crown, href: "/premium" },
    { label: "Support", icon: HelpCircle, href: "/support" },
    { label: "Sign out", icon: LogOut, onClick: handleLogout },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <Image
          src={user?.profile_picture || "/assets/images/default-avatar.png"}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
          style={{
            width: '40px',
            height: '40px'
          }}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 py-2 border">
            {/* Notifications Section */}
            <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <span>Notifications</span>
              <div className="ml-auto">
                <NotificationDropdown />
              </div>
            </div>
            <div className="my-2 border-b border-gray-200" />
            
            {menuItems.map((item, index) => (
              <div key={item.label}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
                {index === 2 || index === 4 || index === 7 ? (
                  <div className="my-2 border-b border-gray-200" />
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      <CreateListingModal
        isOpen={showCreateListing}
        onClose={() => setShowCreateListing(false)}
      />
    </div>
  );
}

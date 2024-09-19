import React, { useEffect, useState } from "react";
import DarkMode from "./DarkMode";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
    className={`lg:fixed top-0 left-0 w-full z-50 text-sm xl:text-base font-bold ${
      isScrolled ? "shadow-md" : ""
    }`}
  >
    <div className="navbar">
      <div className="navbar-start">
        <a href="/" className="">
          <img src="/assets/images/houzdey-logo.png" alt="Houzdey logo" className="w-44" />
        </a>
      </div>

      {/* nav center */}
      <div className="navbar-center max-md:hidden">
        <a className="btn btn-ghost text-sm rounded-2xl">
          Find your next home with{" "}
          <span className="underline decoration-wavy underline-offset-4 decoration-2 decoration-indigo-600 font-bold">
            ease
          </span>
        </a>
      </div>

      <div className="navbar-end items-center">
        {/* Dark mode toggle */}

        {/* dark mode switch */}
        <DarkMode />

        {/* Notification bell */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

        {/* User avatar menu */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            // avatar
            className="btn bg-transparent hover:bg-transparent rounded-full w-24"
          >
            <div className="flex space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-7 w-7 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
  );
};

export default Navbar;

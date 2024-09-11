import { useUser } from "../Provider/UserContext";
import MenuBox from "./MenuBox";
import "./dropdown.css";
import { useEffect, useState, useRef } from "react";
import useFetchProfilePicture from "../hooks/useFetchProfilePicture";


function Dropdown({ toggleLogin, toggleRegister }) {
  const { imageUrl } = useFetchProfilePicture();
  const { loading, setToken, currentUser } = useUser(); // Get the setCurrentUser function from context
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <> loading... </>;
  return (
    <>
      <div ref={dropdownRef} className="menu cursor-pointer">
        {/* Dropdown Toggle Button */}
        <div
          className="flex p-2 border-[2px] rounded-full hover:shadow-md transition"
          onClick={handleClick}
        >
          {/* Dropdown Toggle Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 md:h-8 md:w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div>

            <img
              src={
                currentUser?.profile_picture
                  ? imageUrl
                  : "/Images/placeholder.jpg"
              }
              alt=""
              className="w-6 h-6 md:h-8 md:w-8 rounded-full"
            />
          </div>
        </div>
        {/* Dropdown Menu Box */}
        <MenuBox
          isOpen={isOpen}
          handleClick={handleClick}
          toggleRegister={toggleRegister}
          toggleLogin={toggleLogin}
        />
      </div>
    </>
  );
}

export default Dropdown;

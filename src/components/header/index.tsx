import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";
import Dropdown from "../dropDownMenu/dropdown.js";
import { LgaSearch } from "../Search/LgaSearch.js";
import { MobileFilterBox } from "../Search/MobileFilterBox.js";
import { useUser } from "../Provider/UserContext.js";

function Header({
  searchLocation,
  location,
  cheapest,
  searchCheapest,
  uniqueLocations,
  filterSearch,
  setNewHome,
  setLocation,
  mobileFilter,
  toggleMobileFilter,
  filterSearchMobile,
  properties,
  setMyProperties
}) {
  const urlLocation = useLocation(); // Get the current location
  // Check if the current path is not the home page

  const isWhistListPage = urlLocation.pathname.includes("/wishlistpage");
  const isPropertyPage = urlLocation.pathname.includes("/property/") || urlLocation.pathname.includes("/user/profile");
  const { currentUser } = useUser();

  // Check if currentUser is defined before destructuring
  // const { username } = currentUser || {};

  // console.log(username);

  return (
    <div className="nav pl-4 md:pl-11 md:pr-11  fixed sm:sticky   z-30 top-0 border-b-[1px] border-b-gray-200">
      <div className="nav-bar relative">
        <div className=" ">
          <Link to="/">
            <img
              onClick={() => {
                window.location.href = "/";
              }}
              src="/Images/myhomeblue.png"
              alt="logo"
              className="h-auto w-10 lg:w-17 md:w-16 "
            />
          </Link>
        </div>
        <div className=" hidden md:flex gap-[10%] ml-[150px]">
          <div className="link2">
            <a href="#">Rent</a>
          </div>
          <div className="link2">
            <a href="#">Buy</a>
          </div>
          <div className="link2">
            <a href="#">Sell</a>
          </div>
        </div>
        <div
          onClick={() => toggleMobileFilter()}
          className="sm:hidden w-[65%] rounded-full h-11 ml- border-[1px] ml-4 gap-4 flex  items-center pl-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 "
            onClick={() => toggleMobileFilter()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          <p className="text-11 text-[#00000080]"> Filter search</p>
        </div>
        <MobileFilterBox
          mobileFilter={mobileFilter}
          toggleMobileFilter={toggleMobileFilter}
          uniqueLocations={uniqueLocations}
          cheapest={cheapest}
          searchCheapest={searchCheapest}
          setNewHome={setNewHome}
          setLocation={setLocation}
          filterSearchMobile={filterSearchMobile}
        />
        <div className="profileDiv">
          {currentUser ? (
            <div className="post md:block font-extrabold">
              <button
                onClick={() => {
                  document.getElementById("post_your_house_modal").showModal();
                  handleClick();
                }}
                href="#"
              >
                Post Your House{" "}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                document.getElementById("my_modal_4").showModal();
                handleClick();
              }}
              className="text-white bg-[#575dfb] hover:bg-[#4a4fc9] text-base py-3 px-6 rounded-3xl hover:transition hidden sm:block"
            >
              Login
            </button>
          )}

          <div className="language hidden sm:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="languge1 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </div>
          <Dropdown />
        </div>
      </div>
      {(!isPropertyPage && !isWhistListPage )&& (
        <div className="nav-links2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] sm:hidden md:flex overflow-hidden border-0 mt-5">
          <div
            onClick={searchLocation}
            className={`${
              location ? "bg-[var(--headerBlue)]" : "bg-transparent"
            } link4 `}
          >
            <a href="#"> Anywhere</a>
          </div>
          <div
            onClick={searchCheapest}
            className={` link3 ${
              cheapest
                ? "bg-[var(--headerBlue)] h-[230%] rounded-[38px]"
                : "bg-transparent"
            }`}
          >
            <a href="#"> Cheapest</a>
          </div>
          <div className="join items-center rounded-[40px]">
            <div className="link4i">
              <a className="link4i  flex items-center justify-center" href="#">
                {" "}
                Location
              </a>
            </div>
            <div className="searchDiv">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="searchbtn"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bg-transparent   ">
            <LgaSearch
              location={location}
              uniqueLocations={uniqueLocations}
              filterSearch={filterSearch}
              setNewHome={setNewHome}
              setLocation={setLocation}
              setMyProperties={setMyProperties}
              properties={properties}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

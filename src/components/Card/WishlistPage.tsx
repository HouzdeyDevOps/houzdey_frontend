import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Provider/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "./Loading";

export const WishlistPage = ({ properties }) => {
  const { currentUser, loading, token } = useUser();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  //   const token = localStorage.getItem("token");

  const ENDPOINT = "https://my-home-xlox.onrender.com";
  const formattingPrice = (price) => new Intl.NumberFormat().format(price);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // setIsLoading(true);
      try {
        const response = await axios.get(`${ENDPOINT}/api/me`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;

        setWishlist(new Set(user.wishlist));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, []);

  const toggleWishlist = async (propertyId) => {
    if (!currentUser) {
      document.getElementById("my_modal_4").showModal();
      return;
    }

    try {
      const response = await axios.get(`${ENDPOINT}/api/me`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;

      const updatedWishlist = new Set([...wishlist]);

      if (user.wishlist.includes(propertyId)) {
        await axios.delete(
          `${ENDPOINT}/api/user/wishlist/?property_id=${propertyId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        updatedWishlist.delete(propertyId);
      } else {
        const response = await axios.post(
          `${ENDPOINT}/api/user/wishlist/?property_id=${propertyId}`,
          {},
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        updatedWishlist.add(propertyId);
      }
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error(error);
    }
  };

  const redirectToDetails = (id) => {
    if (!currentUser) {
      document.getElementById("my_modal_4").showModal();
      return;
    }
    try {
      navigate(`/property/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <div className="flex flex-col">
      <p className="ml-20 mt-8 text-[30px] mb-4">Your Wishlist</p>
      <div className="min-h-screen flex flex-wrap gap-6 ml-5 mt-5">
        {properties
          .filter(
            (property) => currentUser && wishlist.has(property.id.toString())
          )
          .map((property, index) => (
            <div key={index} className=" w-[300px] pb-6">
              <svg
                onClick={() => toggleWishlist(property.id.toString())}
                xmlns="http://www.w3.org/2000/svg"
                fill={`${
                  currentUser && wishlist.has(property.id) ? "red" : "#00000070"
                }`}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 absolute z-10 bg-transparent text-white mt-3 ml-[10px]`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>

              <Carousel className="carouselImg" showThumbs={false}>
                {property?.images.map((img, idx) => (
                  <div key={idx} onClick={() => redirectToDetails(property.id)}>
                    <img src={img} className="h-[200px] " />
                  </div>
                ))}
              </Carousel>
              <div className="infoDiv">
                <div className="location">
                  <p className="pmain">
                    {property?.property_location_details.area}
                  </p>
                  <p className="p2">
                    {property?.property_location_details.street_address}
                  </p>
                  <p>&#8358; {formattingPrice(property?.price)}.00</p>
                </div>
                <div className="rating">
                  <div className="star mt-1">
                    <img src="./Images/Star 1.svg" alt="" />
                  </div>

                  <p>4</p>
                </div>
              </div>
            </div>
          ))}
        <ToastContainer containerId={"friendRequest"} />
      </div>
    </div>
  );
};

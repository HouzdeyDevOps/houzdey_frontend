import "./style.css";
import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Provider/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropertyCard from "./PropertyCard";
import Loading from "../loading";
import { endpoint } from "../hooks/config";

export default function Card({ properties }) {
  const { currentUser, loading, token } = useUser();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    if (currentUser && currentUser.wishlist) {
      setWishlist(new Set(currentUser.wishlist));
    }
  }, [currentUser]);

  const toggleWishlist = async (propertyId) => {
    if (!currentUser) {
      document.getElementById("my_modal_4").showModal();
      return;
    }

    try {
      // Create a new set based on the current wishlist
      const updatedWishlist = new Set([...wishlist]);

      // Update the wishlist state immediately to reflect the change in UI
      if (wishlist.has(propertyId)) {
        updatedWishlist.delete(propertyId);
      } else {
        updatedWishlist.add(propertyId);
      }
      setWishlist(updatedWishlist);

      // Send request to update the wishlist on the server
      if (wishlist.has(propertyId)) {
        // Property is in wishlist, remove it
        await axios.delete(
          `${endpoint}/api/user/wishlist/?property_id=${propertyId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Property is not in wishlist, add it
        const response = await axios.post(
          `${endpoint}/api/user/wishlist/?property_id=${propertyId}`,
          {},
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const redirectToDetails = (id) => navigate(`/property/${id.toString()}`);
  const redirectToDetails = (id) => {
    const property = properties.find((property) => property.id === id);
    if (property) {
      navigate(`/property/${id}`, { state: { property } });
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="h-screen cursor-default mt-5 pt-[80px] sm:pt-0 ">
      <div className="flex flex-wrap gap-6  justify-center items-center  pb-[70px] sm:pb-0">
        {properties.map((property, index) => (
          <PropertyCard
            key={index}
            showLike={true}
            showIcons={false}
            property={property}
            index={index}
            toggleWishlist={toggleWishlist}
            currentUser={currentUser}
            wishlist={wishlist}
            redirectToDetails={redirectToDetails}
          />
        ))}
        <ToastContainer />
      </div>
    </div>
  );
}

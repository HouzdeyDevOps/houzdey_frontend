import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { Loading } from "../Card/Loading";
import { useUser } from "../Provider/UserContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const { currentUser } = useUser();

  const ENDPOINT = "https://my-home-xlox.onrender.com";
  const token = localStorage.getItem("token");

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

      // Create a new set based on the current wishlist
      const updatedWishlist = new Set([...wishlist]);

      // Check if property is in wishlist
      if (user.wishlist.includes(propertyId)) {
        // Property is in wishlist, remove it
        await axios.delete(
          `${ENDPOINT}/api/user/wishlist/?property_id=${propertyId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the wishlist state
        updatedWishlist.delete(propertyId);
      } else {
        // Property is not in wishlist, add it
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
        // Update the wishlist state
        updatedWishlist.add(propertyId);
      }
      // Update the wishlist state with the new set
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `https://my-home-xlox.onrender.com/properties`
        );
        // console.log(res);
        setProperty(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, []);

  const filteredProperty = property?.filter((i) => i._id === id);
  const formattingPrice = (price) => new Intl.NumberFormat().format(price);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center gap-8">
        <Loading />
      </div>
    );
  }

  // console.log(formattingPrice(2.0));
  // console.log(filteredProperty);

  if (filteredProperty) {
    return filteredProperty.map((_prop, id) => (
      <div key={id} className="container mx-auto px-4 min-h-screen text-black pb-11 sm:mt-0 mt-[70px]">
        <div className="w-[87%] flex justify-between items-center">
          <div className="flex pl-4 flex-col">
            <h1 className="text-[22px] font-semibold mb-2 mt-4">
              {_prop.name}
            </h1>
            <p className="text-[14px]">{_prop.property_type}</p>
          </div>
          <div className="flex gap-3 mt-4">
            <svg
              onClick={() => toggleWishlist(_prop.id)}
              xmlns="http://www.w3.org/2000/svg"
              fill={`${
                currentUser && wishlist.has(_prop.id) ? "red" : "none"
              }`}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 ${currentUser && wishlist.has(_prop.id) ? "text-transparent":"text-black"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <p>save</p>
          </div>
        </div>
        <div className=" flex gap-[10px] justify-between mt-4 sm:flex-row flex-col items-center ">
          <div className=" sm:w-[90%]  w-[100%] ">
            <Carousel>
              {_prop.images.map((image, index) => (
                <div key={index} className="">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="imge rounded-[20px] object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="md:col-span-1 flex flex-col items-center  p-4 h-[40%] w-[90%]">
            <div className="  border-[1px] py-6 px-8 sm:w-[50%] w-[90%]">
              <div className="flex items-center justify-center gap-2 border-b-[1px]">
                <p className="text-[22px]">
                  {_prop.property_location_details.area}
                </p>
              </div>
              <div className="flex mt-6 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>

                <p className="text-black">
                  {_prop.property_location_details.street_address},{" "}
                  {_prop.property_location_details.state}
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>

                <p className="text-black">{_prop.phone_number}</p>
              </div>
              <div className="flex mt-4 justify-between w-[100%]">
                <div className="mt-4 flex gap-1">
                  <img src="/Images/🦆 icon _bed_.svg" className="w-6 h-6" />
                  <p className="text-black">
                    {_prop.property_features.number_of_rooms}
                  </p>
                </div>
                <div className="mt-4 flex gap-1">
                  <img
                    src="/Images/🦆 icon _bathroom_.svg"
                    className="w-6 h-6"
                  />
                  <p className="text-black">
                    {_prop.property_features.number_of_toilets}
                  </p>
                </div>
                <div className="mt-4 flex gap-1">
                  <img src="/Images/water.png" className="w-6 h-6" />
                  <p className="text-black">
                    {_prop.property_features.running_water ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
            <div className=" sm:w-[50%] w-full border-[1px] py-6 p-2 mt-8">
              <div className="flex items-center justify-center gap-2 border-b-[1px]">
                <p className="text-[22px]">₦ {formattingPrice(_prop.price)}</p>
              </div>
              <div className="flex items-center justify-center text-center py-4 border-b-[1px]">
                <p>
                  please note that the price is inclusive of all necesarry fees
                </p>
              </div>
              <div className="flex items-center justify-center text-center mt-3 ">
                <p className="text-[13px]">
                  In order to avoid being a victim of scam confirm that the
                  property exists and is available before making any payments on
                  any property
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  return <div className="min-h-screen">Property not found.</div>;
};

export default PropertyDetails;

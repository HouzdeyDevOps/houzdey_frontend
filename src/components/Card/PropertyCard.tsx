import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

function PropertyCard({
  property,
  index,
  toggleWishlist,
  currentUser,
  wishlist,
  showLike,
  showIcons,
  handleEdit,
  handleDelete,
  propertyEdit,
}) {


  return (
    <div className="block rounded-[20px] sm:mb-6 bg-white w-[20rem] ">
      <div
        className="relative overflow-hidden bg-cover bg-no-repeat"
        data-te-ripple-init
        data-te-ripple-color="light"
      >
        {/* Like button */}
        <svg
          onClick={() => toggleWishlist(property.id.toString())}
          xmlns="http://www.w3.org/2000/svg"
          fill={`${
            showLike && currentUser && wishlist.has(property.id)
              ? "red"
              : "#00000070"
          }`}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${
            showLike
              ? "w-8 h-8 absolute z-10 bg-transparent text-white mt-3 ml-[10px] cursor-pointer"
              : "hidden"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>

        {/* Delete button */}
        <svg
          onClick={() => handleDelete(property.id)}
          className={`${
            showIcons
              ? "w-6 h-6 absolute z-10  text-white bg-[#bfbcbc6d] rounded-full mt-3 ml-[10px] cursor-pointer"
              : "hidden"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="48px"
          height="48px"
        >
          <linearGradient
            id="nyvBozV7VK1PdF3LtMmOna"
            x1="18.405"
            x2="33.814"
            y1="10.91"
            y2="43.484"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#32bdef" />
            <stop offset="1" stopColor="#1ea2e4" />
          </linearGradient>
          <path
            fill="url(#nyvBozV7VK1PdF3LtMmOna)"
            d="M39,10l-2.835,31.181C36.072,42.211,35.208,43,34.174,43H13.826	c-1.034,0-1.898-0.789-1.992-1.819L9,10H39z"
          />
          <path
            fill="#0176d0"
            d="M32,7c0-1.105-0.895-2-2-2H18c-1.105,0-2,0.895-2,2c0,0,0,0.634,0,1h16C32,7.634,32,7,32,7z"
          />
          <path
            fill="#007ad9"
            d="M7,9.886L7,9.886C7,9.363,7.358,8.912,7.868,8.8C10.173,8.293,16.763,7,24,7s13.827,1.293,16.132,1.8	C40.642,8.912,41,9.363,41,9.886v0C41,10.501,40.501,11,39.886,11H8.114C7.499,11,7,10.501,7,9.886z"
          />
        </svg>

        {/* Edit button */}
        <svg
          onClick={()=>propertyEdit(property.id)}
          className={`${
            showIcons
              ? "w-6 h-6 absolute top-0 right-0 z-10 text-white bg-[#a3aac421] rounded-full mt-3 mr-3 cursor-pointer"
              : "hidden"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>

        <Carousel className="">
          {property?.images.map((img) => (
            <div
              key={index}
              // onClick={() => redirectToDetails(property.id)}
            >
              <img
                className="rounded-lg  sm:m-h-64 md:h-64 w-full"
                src={img}
                alt=""
              />
              <Link to={`property/${property.id}`}>
                {" "}
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="p-2 pt-0">
        <div className="flex justify-between">
          <h5 className="mb-1 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50">
            {property.property_location_details.state}
          </h5>
          <h5 className="mb-1 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50 flex">
            5.0{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          </h5>
        </div>
        <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-200">
          {property.property_location_details.area}
        </p>

        <p className="mb-1 text-base text-neutral-600 dark:text-neutral-200">
          {property.property_location_details.street_address}
        </p>
        <h5 className="mb- text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-50">
          &#8358;
          {property.price.toLocaleString("en-NG", {})}
        </h5>
      </div>
    </div>
  );
}

export default PropertyCard;

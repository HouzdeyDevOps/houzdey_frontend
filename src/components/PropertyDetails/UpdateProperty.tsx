import axios from "axios";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useUser } from "../Provider/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endpoint } from "../hooks/config";

const UpdateProperty = ({id}) => {
  const [property, setProperty] = useState({
    name: "",
    price: "",
    property_type: "",
    phone_number: "",
    street_address: "",
    area: "",
    state: "",
    number_of_rooms: 0,
    number_of_toilets: 0,
    running_water: false,
    POP_available: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isWater, setIsWater] = useState(false);
  const [image, setImage] = useState(null);
  const [isPop, setIsPop] = useState(false);
  const { token, currentUser } = useUser();
  const [propertyType, setPropertyType] = useState(false)

  const handleChange = (event) => {
    setProperty({
      ...property,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    const areValidFiles = files.every((file) =>
      validImageTypes.includes(file.type)
    );

    if (areValidFiles) {
      setImage(files);
    } else {
      toast.error("Invalid file input, please select only image files.");
      event.target.value = "";
    }
  };

  const propertyTypeChange = (e) => {
    setPropertyType(true);
    setProperty({
      ...property,
      property_type: e.target.value
    });
  };
console.log(id)
  const handleSubmit = async (event) => {
    event.preventDefault();
   

    if (!image || image.length === 0) {
      toast.error("Please upload an image.");
      return;
    }
    setIsLoading(true);

    const upload = {
      name: property.name,
      price: property.price,
      property_type: property.property_type,
      phone_number: currentUser.phone_number,
      property_location_details: {
        street_address: property.street_address,
        area: property.area,
        state: property.state,
      },
      property_features: {
        number_of_rooms: property.number_of_rooms,
        number_of_toilets: property.number_of_toilets,
        running_water: isWater,
        POP_available: isPop,
      },
    };

    const formData = new FormData();

    for (const key in upload) {
      if (key === "property_location_details" || key === "property_features") {
        formData.append(key, JSON.stringify(upload[key]));
      } else {
        formData.append(key, upload[key]);
      }
    }

    for (const file of image) {
      formData.append("images", file);
    }
    const postProperty = () => {
      return axios.put(`${endpoint}/properties/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    };
    toast
      .promise(postProperty(), {
        pending: "Posting property...",
        success: "Property posted successfully!",
        error: "Error posting property.",
      })
      
      .finally(() => {
        handleClose();
        setIsLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  const handleClose = () => {
    document.getElementById("updateProperty_modal").close();
  };

  return (
    <div className=" p-3 sm:p-6 border flex flex-col items-center justify-center rounded-[20px] bg-white">
      <div className="text-center w-full p-2 pb-4 relative border-b-[1px]">
        <button
          type="button"
          onClick={() => {
            handleClose();
          }}
          className="absolute left-0 top-0 bg-transparent "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="sm:w-[30px] sm:h-[30px] w-6 h-6 ml-1 bg-transparent"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6 18 12-12M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className=" text-lg text-[#575DFB] font-bold">Update property Info</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="mt-4 w-[320px] sm:w-[350px] rounded-lg pt-0 sm:pt-2 p-2">
              <label
                htmlFor="name"
                className="text-black block absolute p-1 -mt-4 ml-3"
              >
                Listing Name*
              </label>
              <input
                autoComplete="off"
                onChange={handleChange}
                name="name"
                type="text"
                id="name"
                required
                placeholder="Name for the property to be listed"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none h-[50px] border-[#575DFB]"
              />
            </div>

            <div className="mt-4 w-[320px] sm:w-[350px] rounded-lg pt-0 sm:pt-2 p-2 ">
              <label
                htmlFor="category"
                className="absolute ml-3 text-black block -mt-4 p-1"
              >
                Category*
              </label>
              <select
                onChange={propertyTypeChange}
                name="property_type"
                id=""
                className="w-full border-[#575DFB] rounded-lg focus:outline-none outline-none"
              >
                <option
                  className="text-[#64748B]"
                  value=""
                  disabled={propertyType}
                >
                  Select property type
                </option>
                <option value="Single room">Single room</option>
                <option value="Self-con">Self-con</option>
                <option value="Flat">Flat</option>
                <option value="Duplex">Duplex</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between">
            <div className="mt-4 w-[320px] sm:w-[350px] rounded-lg pt-0 sm:pt-2 p-2">
              <label className="text-black block absolute p-1 -mt-4 ml-3">
                Address*
              </label>
              <input
                autoComplete="off"
                onChange={handleChange}
                name="street_address"
                type="text"
                id="Address"
                required
                placeholder="14 Golf view layout"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none h-[50px] border-[#575DFB]"
              />
            </div>

            <div className="mt-4 w-[320px] sm:w-[350px] rounded-lg pt-0 sm:pt-2 p-2">
              <label className="text-black block absolute p-1 -mt-4 ml-3">
                Area*
              </label>
              <input
                autoComplete="off"
                onChange={handleChange}
                name="area"
                type="text"
                id="area"
                required
                placeholder="Trans-Ekulu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none h-[50px] border-[#575DFB]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center w-[350px] sm:w-full">
            <div className="mt-4 rounded-lg sm:mr-0 p-1 sm:p-2">
              <label className="text-black block absolute p-1 -mt-4 ml-3">
                Amount*
              </label>
              <label className="text-black block absolute p-1 mt-3 text-[20px] bg-transparent ml-3">
                &#8358;
              </label>
              <input
                autoComplete="off"
                onChange={handleChange}
                name="price"
                type="text"
                id="Amount"
                required
                value={property.price}
                placeholder="400,000"
                className="w-[300px] sm:w-[340px] ml-2 sm:ml-0 pl-11 px-4 py-2 border rounded-lg focus:outline-none h-[50px] border-[#575DFB]"
              />
            </div>

            <div className="mt-4 flex justify-between items-center gap-1">
              <div className="">
                <select
                  name="number_of_rooms"
                  className="w-[70%] sm:w-full h-[50px] rounded-[10px] border border-[#C4C4C4] pl-4"
                  onChange={(e) =>
                    setProperty({
                      ...property,
                      number_of_rooms: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Number of Rooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="">
                <select
                  name="number_of_toilets"
                  className="w-[70%] sm:w-full h-[50px] rounded-[10px] border border-[#C4C4C4] pl-4"
                  onChange={(e) =>
                    setProperty({
                      ...property,
                      number_of_toilets: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" defaultValue>
                    Number of Toilets
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="w-full pl-5 flex justify-between flex-col sm:flex-row">
            <div className="flex flex-col">
              <input
                type="file"
                name="file"
                multiple
                className="mt-4 file:bg-[#575DFB] file:rounded-sm"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex gap-1 mt-2 sm:mt-0 items-center">
              <label>Has POP?</label>
              <input
                type="checkbox"
                className="rounded-md w-6 h-6 ml-2"
                checked={isPop}
                onChange={() => setIsPop(!isPop)}
              />
            </div>

            <div className="flex gap-1 items-center">
              <p>Running water?</p>
              <input
                type="checkbox"
                className="rounded-md mt-2 sm:mt-0 w-6 h-6 ml-2"
                checked={isWater}
                onChange={() => setIsWater(!isWater)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`sm:w-[420px] h-[50px] w-[95%] my-8  rounded-[10px] bg-[#575DFB] text-white  transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#434BE6]"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <ClipLoader className="bg-transparent" color="#ffffff" />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProperty;

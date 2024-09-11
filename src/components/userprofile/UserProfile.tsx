import { useEffect, useState } from "react";
import { useUser } from "../Provider/UserContext";
import Cookies from "js-cookie";
import PropertyCard from "../Card/PropertyCard";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Card, Dropdown } from "flowbite-react";
import { endpoint } from "../hooks/config";
import UpdateProperty from "../PropertyDetails/UpdateProperty";


const UserProfile = () => {
  const [myProperties, setMyProperties] = useState([]);
  const {currentUser} = useUser();
  const [id, setId] = useState("");

  const fetchProperties = async () => {
    const response = await axios.get(`${endpoint}/users/me/properties`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    setMyProperties(response.data);
  };

  useEffect(() => {
    fetchProperties()
    if (currentUser?.id) fetchProperties();
  }, [currentUser?.id]);

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`${endpoint}/users/me/properties/${propertyId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const propertyEdit = (id)=>{
    setId(id)
    document.getElementById("updateProperty_modal").showModal()

  }


  return (
    <div>
      <dialog id="updateProperty_modal" className="modal">
        <UpdateProperty key={id} id={id}/>
      </dialog>
    <div className="">
      {currentUser ? (
        <div className="w-full h-screen">
          <Card className="">
            <div className="flex flex-col items-center pb-10">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="hiddenFileInput"
                onChange={handleImageUpload}
              />
              {isUploading ? (
                <PuffLoader color="#36d7b7" />
              ) : (
                <img
                  alt="Profile image"
                  height={100}
                  src={imageUrl ? imageUrl : "/Images/placeholder.jpg"}
                  width={100}
                  className="mb-3 rounded-full shadow-lg max-w-[100px] max-h-[100px] cursor-pointer hover:opacity-90 transition duration-300 ease-in-out"
                  onClick={() =>
                    document.getElementById("hiddenFileInput").click()
                  }
                />
              )}
              <h5 className="mb-1 text-xl text-gray-900 dark:text-white font-bold">
                {currentUser?.name}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Role: User
              </span>
              <div className="mt-4 flex justify-center items-center space-x-3 lg:mt-6">
                <p className="font-bold">Properties Listed:</p>

                <a
                  // href="#"
                  className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-base font-bold text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                >
                  {myProperties.length}
                </a>
              </div>
            </div>
          </Card>

          <div className="mt10 shadow-xl p-5 card">
            <h2 className="mt-5 text-2xl font-extrabold text-black sm:text-3xl text-left">
              My Properties
            </h2>
            {/* <p className="mt-5 text-lg text-gray-600 sm:text-xl max-w-2xl text-left">
          Here are the properties you have listed on our platform.
        </p> */}
            <div className="flex flex-wrap gap-6 justify-center items-center mt-5">
              {myProperties.map((property, index) => (
                <PropertyCard
                  key={index}
                  property={property}
                  index={index}
                  showLike={false}
                  showIcons={true}
                  propertyEdit={propertyEdit}

                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // (window.location.href = "/")
        <Loading />
      )}
    </div>
    </div>
  );
};

export default UserProfile;

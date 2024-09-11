import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "./config";
import Cookies from "js-cookie";

export const useFetchProfilePicture = () => {
  const [imageUrl, setImageUrl] = useState("/Images/placeholder.jpg");

  useEffect(() => {
    const fetchProfilePicture = async () => {
      axios
        .get(`${endpoint}/api/user/profile-picture`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          responseType: "blob",
        })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setImageUrl(imageUrl);
        })
        .catch((error) => {
          console.error(error);
          setImageUrl(
            "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          );
        });
    };
    
    fetchProfilePicture();
  }, []);

  return { imageUrl };
};

export default useFetchProfilePicture;

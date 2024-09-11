import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { endpoint } from "./hooks/config";

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid or expired link");
        return;
      }

      try {
        const response = await axios.post(
          `${endpoint}/api/verify-email/${token}`
        );
        setMessage(response.data.message);
        if (response.status === 201) {
          toast.success(response.data.message);

          setTimeout(() => {
            document.getElementById("my_modal_4").showModal();
          }, 3000);
        }
      } catch (error) {
        setMessage(error.response.data.detail);
        toast.error(error.response.data.detail);
      }
    };

    verifyEmail();
  }, [location]);

  return <div className="h-screen"></div>;
};

export default EmailVerification;

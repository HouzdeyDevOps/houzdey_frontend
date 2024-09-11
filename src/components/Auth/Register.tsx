import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../hooks/config";
import { ClipLoader } from "react-spinners";

export const Register = () => {
  const navigate = useNavigate();
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Password validation
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /\W/.test(password);
  const PHONE_REGEX = /^\+234\d{10}$/;
  const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  let errorMessage = ""; // Define errorMessage

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setPhoneNumberError("");
    setPasswordError("");
    setEmailError("");

    // Phone number validation
    if (!PHONE_REGEX.test(phone_number)) {
      const errorMessage =
        "Phone number must start with +234 and must be valid phone number.";
      setPhoneNumberError(errorMessage);

      // Reset the error message after 5 seconds
      setTimeout(() => {
        setPhoneNumberError("");
      }, 5000);
      return;
    }

    // Email validation
    if (!email || !EMAIL_REGEX.test(email)) {
      const errorMessage = "Please provide a valid email.";
      setEmailError(errorMessage);

      // Reset the error message after 5 seconds
      setTimeout(() => {
        setEmailError("");
      }, 5000);
      return;
    }

    // Name validation
    if (!name) {
      const errorMessage = "Please fill in your name.";
      setNameError(errorMessage);

      // Reset the error message after 5 seconds
      setTimeout(() => {
        setNameError("");
      }, 5000);
      return;
    }

    if (!password) {
      const errorMessage = "Password field cannot be empty.";
      setPasswordError(errorMessage);

      // Reset the error message after 5 seconds
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }

    // Password length validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }


    if (!hasUpperCase) {
      setPasswordError("Password must contain at least one uppercase letter.");
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }

    if (!hasLowerCase) {
      setPasswordError("Password must contain at least one lowercase letter.");
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }

    if (!hasNumber) {
      setPasswordError("Password must contain at least one number.");
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }

    if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character.");
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }
    
    try {
      setIsLoading(true);
      // Send registration request to backend
      const response = await axios.post(
        `${endpoint}/api/register`,
        { phone_number, email, name, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        // Registration successful
        handleClose();
        toast.success("Registration successful", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setIsLoading(false);
        setPhoneNumber("");
        setEmail("");
        setName("");

        setEmailSent(true);

        // //  wait for 5 seconds
        // setTimeout(() => {
        //   // document.getElementById("my_modal_4").close();
        //   document.getElementById("my_modal_4").showModal();
        // }, 2000);

        //
      }
    } catch (error) {
      if (error.response.status == 400) {
        toast.error(error.response.data.detail);
        setIsLoading(false);
      } else {
        toast("Registration failed");
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    document.getElementById("register_modal").close();
  };
  const CloseVerifyEmail = () => {
    document.getElementById("verify-email").close();
    setEmailSent(false);
  };

  useEffect(() => {
    if (emailSent) {
      document.getElementById("verify-email")?.showModal();
    }
  }, [emailSent]);

  return (
    <div className="cursor-default rounded-xl">
      {emailSent ? (
        <dialog id="verify-email" className="modal text-center">
          <div className="modal-box bg-white">
            <h1 className="font-extrabold text-3xl">Check your inbox</h1>
            <p className="py-4 font-semibold text-xl">
              We are glad, that you’re with us ? We’ve sent you a verification
              link to your email address {email}
            </p>
            <button onClick={CloseVerifyEmail} className="btn bg-[#575DFB] text-white hover:bg-gray-200 hover:text-black hover:transition-all">
              Close
            </button>
          </div>
        </dialog>
      ) : (
        // <div className="mt-4">
        //   <p className="text-green-500 font-bold">
        //     Registration successful! A verification link has been sent to your
        //     email.
        //   </p>
        // </div>
        <div className="px-5 rounded-xl cursor-default">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col p-4 pb-[80px] rounded-[30px]"
          >
            {/* Form Inputs */}
            <div className=" flex flex-col justify-center items-center relative">
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-1 right-1 bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[30px] h-[30px] ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 18 12-12M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="absolute top-1 w-full bg-transparent"></div>
              <div className="flex justify-center items-center  w-[100%] border-b-[1px] p-6">
                <p className="text-[28px] sm:text-[36px] text-[#575DFB]">
                  Register
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p className="w-[488px] leading-snug p-4 flex text-center justify-center text-[18px]  sm:text-[24px]">
                  Create an account to access all the features of myHome!
                </p>
              </div>
              <div className="mt-4">
                <p>Phone Number</p>
                <input
                  type="tel"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-[450px] h-[50px] mt-2 rounded-[10px]"
                  // pattern={PHONE_REGEX.source}
                  title="Please enter a valid phone number starting with a country code"
                  placeholder="+234"
                />
                {phoneNumberError && (
                  <p className="text-red-500 mt-2 font-bold">
                    {phoneNumberError}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <p>Email</p>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[450px] h-[50px] mt-2 rounded-[10px]"
                  placeholder="email@example.com"
                />
                {emailError && (
                  <p className="text-red-500 mt-2 font-bold">{emailError}</p>
                )}
              </div>
              <div className="mt-4">
                <p>Display Name</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[450px] h-[50px] mt-2 rounded-[10px]"
                  placeholder="John Doe"
                />
                {nameError && (
                  <p className="text-red-500 mt-2 font-bold">{nameError}</p>
                )}
              </div>
              <div className="mt-4">
                <p>Your Password</p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[450px] h-[50px] mt-2 rounded-[10px]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 mt-2">{passwordError}</p>
                )}
              </div>
              <div className=" flex flex-col justify-center items-center mt-9">
                <button
                  type="submit"
                  className={`sm:w-[420px] h-[50px] w-[350px] mt-2 rounded-[10px] bg-[#575DFB] text-white  transition duration-200 ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#434BE6]"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ClipLoader className="bg-transparent" color="#ffffff" />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
              <div className="text-[12px] flex gap-1 mt-4  w-[220px] ">
                <p className="bold">Have an account?</p>
                <button
                  onClick={(e) => {
                    document.getElementById("my_modal_4").showModal();
                    handleClose();
                    e.preventDefault();
                  }}
                  className="text-[#575DFB]"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

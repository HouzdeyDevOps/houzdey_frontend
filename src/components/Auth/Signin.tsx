import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../Provider/UserContext";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import { endpoint } from "../hooks/config";
import ForgotPassword from "./ForgotPassword";
import { Link } from "react-router-dom";

export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useUser(); // Get the setCurrentUser function from context
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /\W/.test(password);
  const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  let errorMessage = ""; // Define errorMessage

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!username || !EMAIL_REGEX.test(username)) {
      const errorMessage = "Please provide a valid email.";
      setEmailError(errorMessage);

      // Reset the error message after 5 seconds
      setTimeout(() => {
        setEmailError("");
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

    setIsLoading(true);

    try {
      // Send login request to backend
      const response = await axios.post(
        `${endpoint}/api/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const token = response.data.access_token;
        Cookies.set("token", token);
        setToken("token", token);
        handleClose();

        toast.success("Logged in successfully", {
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

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } 
    } catch (error) {
      console.log(error);
      toast.error("Incorrect email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    document.getElementById("my_modal_4").close();
  };

  useEffect(() => {
    const rememberMeCookie = Cookies.get("rememberMe");
    if (rememberMeCookie) {
      setRememberMe(rememberMeCookie === "true");
    }
  }, []);

  useEffect(() => {
    Cookies.set("rememberMe", rememberMe.toString());
  }, [rememberMe]);

  const handleRememberMeChange = (event) => {
    const isChecked = event.target.checked;
    setRememberMe(isChecked);
    Cookies.set("rememberMe", isChecked ? "true" : "false", { expires: 365 });
  };

  return (
    <div className="px-5 rounded-xl cursor-default">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:p-4 p-7 sm:pb-[150px] pb-11 rounded-[30px]"
      >
        <div className="flex flex-col justify-center items-center relative">
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

          <div className="flex justify-center items-center w-[100%] border-b-[1px] p-6">
            <p className="text-[28px] sm:text-[36px] text-[#575DFB]">Login</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="w-[px] p-4 flex text-center justify-center text-[18px] sm:text-[24px]">
              Welcome back to myHome!
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <p className="ml-2">Email</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#575DFB] absolute sm:mt-[88px] mt-[80px] ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                />
              </svg>
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="email@example.com"
              type="email"
              className="sm:w-[420px] sm:h-[50px] w-[350px] border-[#575DFB] mt-2 rounded-[10px] pl-11"
            />
            {emailError && (
              <p className="text-red-500 mt-2 font-bold">{emailError}</p>
            )}
          </div>
          <div className="mt-4 relative">
            <div className="flex items-center gap-2">
              <p className="ml-41">Your password</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#575DFB] absolute sm:mt-[88px] mt-[80px] ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type={showPassword ? "text" : "password"}
              className="sm:w-[420px] sm:h-[50px] w-[350px] border-[#575DFB] mt-2 rounded-[10px] pl-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-[70%] transform -translate-y-1/2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 mt-2">{passwordError}</p>
          )}
        </div>
        {/* remember me */}
        <div className="mt-3">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="rounded-sm mr-2"
            />
            Remember me
          </label>
        </div>

        <Link
          to="#"
          className="text-[12px] text-[#575DFB] border-b-[#575DFB] border-b-[1px] w-[102px] mt-3"
          onClick={(e) => {
            e.preventDefault();
            setShowForgotPasswordModal(true);
          }}
        >
          Forgot Password?
        </Link>
        {showForgotPasswordModal && (
          <ForgotPassword email={username} onClose={() => setShowForgotPasswordModal(false)} />
        )}

        <div className="flex flex-col justify-center items-center mt-9">
          <button
            type="submit"
            className={`sm:w-[420px] h-[50px] w-[350px] mt-2 rounded-[10px] bg-[#575DFB] text-white  transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#434BE6]"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader className="bg-transparent" color="#ffffff" />
            ) : (
              "Login"
            )}
          </button>
          <div className="sm:w-[420px] h-[50px] w-[350px] overflow-hidden mt-6 border-black rounded-[10px] flex justify-center items-center border-[1px] hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200">
            <div className="h-6 w-6 mr-2">
              <img className="" src="/Images/Logo.svg" alt="Logo" />
            </div>
            <a className="hover:bg-gray-100" href="/your-url-here">
              Continue with Google
            </a>
          </div>

          <div className="text-[12px] flex gap-1 mt-4  w-[220px] ">
            <p className="bold">Don't have an account?</p>
            <button
              onClick={() => {
                document.getElementById("register_modal").showModal();
                handleClose();
              }}
              className="text-[#575DFB]"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

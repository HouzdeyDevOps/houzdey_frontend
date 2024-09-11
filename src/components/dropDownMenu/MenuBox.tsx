import { Register } from "../Auth/Register";
import { SignIn } from "../Auth/Signin";
import PostYourHouse from "../PostYourHouse";
import "./dropdown.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../Provider/UserContext";

const MenuBox = ({ isOpen, handleClick, }) => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const urlLocation = useLocation()
  const isUserProfile = urlLocation.pathname.includes("/user/profile");

  return (
    <>
      <dialog id="my_modal_4" className="modal ">
        <SignIn />
      </dialog>
      <dialog id="register_modal" className="modal">
        <Register />
      </dialog>
    

      <dialog id="post_your_house_modal" className="modal cursor-default">
        <PostYourHouse />
      </dialog>

      {(currentUser)? (isUserProfile?
        <div
          className="pages mr-[135px] sm:mr-32  md:mr-6 md:mt-5 font-bold"
          style={{ display: isOpen ? "flex" : "none" }}
        >
          <ul>
            <li>
              <button
                className="postHouse"
                onClick={() => {
                  document.getElementById("post_your_house_modal").showModal();
                  handleClick();
                }}
              >
                Post your house
              </button>
            </li>
            <li>
              <button
                className="postHouse"
                onClick={() => {
                  // navigate("/user/profile");
                  handleClick();
                }}
              >
                Edit Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/wishlistpage");
                  handleClick();
                }}
              >
                Wishlists
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  document.getElementById("my_modal_5").showModal();
                  handleClick();
                }}
              >
                Help
              </button>
            </li>

            <div className=" border-[1px] w-[100%] "></div>
            <li>
              <button
                className="login"
                onClick={() => {
                  logout();
                  handleClick();
                  toast.success('Logged out', {
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
                }}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      :
      <div
          className="pages mr-[135px] sm:mr-32  md:mr-6 md:mt-5 font-bold"
          style={{ display: isOpen ? "flex" : "none" }}
        >
          <ul>
            <li>
              <button
                className="postHouse"
                onClick={() => {
                  document.getElementById("post_your_house_modal").showModal();
                  handleClick();
                }}
              >
                Post your house
              </button>
            </li>
            <li>
              <button
                className="postHouse"
                onClick={() => {
                  navigate("/user/profile");
                  handleClick();
                }}
              >
                Account Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/wishlistpage");
                  handleClick();
                }}
              >
                Wishlists
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  document.getElementById("my_modal_5").showModal();
                  handleClick();
                }}
              >
                Help
              </button>
            </li>

            <div className=" border-[1px] w-[100%] "></div>
            <li>
              <button
                className="login"
                onClick={() => {
                  logout();
                  handleClick();
                  toast.success('Logged out', {
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
                }}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div> ) : (
        <div
          className="pages mr-[135px] sm:mr-32  md:mr-6 md:mt-5"
          style={{ display: isOpen ? "flex" : "none" }}
        >
          <ul>
            <li>
              <button
                onClick={() => {
                  document.getElementById("register_modal").showModal();

                  handleClick();
                }}
              >
                Sign up
              </button>
            </li>
            <li>
              <button
                className="login"
                onClick={() => {
                  document.getElementById("my_modal_4").showModal();
                  handleClick();
                }}
              >
                Log in
              </button>
            </li>
            <div className=" border-[1px] w-[100%] "></div>

            <li>
              <button
                onClick={() => {
                  document.getElementById("my_modal_5").showModal();
                  handleClick();
                }}
              >
                Help
              </button>
            </li>
          </ul>
        </div>
      )}
      {/* {isUserProfile ?()} */}
    </>
  );
};

export default MenuBox;
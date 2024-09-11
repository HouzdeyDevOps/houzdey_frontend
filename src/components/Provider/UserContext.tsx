import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { endpoint } from "../hooks/config";
import { ReactNode } from "react"; 

// export const removeCookie = (key)=> Cookies.remove(key)

interface UserContextType {
  currentUser: null;
  setCurrentUser: React.Dispatch<React.SetStateAction<null>>;
  logout: () => void;
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [token, setToken] = useState(Cookies.get("token"));

  const logout = () => {
    // Remove the user's information from localStorage
    Cookies.remove("token");
    // window.location.reload();

    // Update the currentUser state
    setCurrentUser(null);
  };

  // Load user from local storage when application loads
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(`${endpoint}/api/me`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const user = response.data;

        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // Store user in local storage whenever it changes

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, logout, token, setToken, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
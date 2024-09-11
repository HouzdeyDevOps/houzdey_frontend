import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "./config";

export const useFetchProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${endpoint}/properties`);
        setProperties(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return { properties, isLoading };
};



export default useFetchProperties;

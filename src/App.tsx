import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HOMES } from "./assets/data/homes";
import Card from "./components/Card/Card";
import Header from "./components/header/index";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import { BottomNav } from "./components/Auth/BottomNav";
import PropertyDetails from "./components/propetrydetails/PropertyDetails";
import "react-toastify/dist/ReactToastify.css";
import useFetchProperties from "./components/hooks/useFetchProperties";
import { WishlistPage } from "./components/Card/WishlistPage";
import UserProfile from "./components/userprofile/UserProfile";
import EmailVerification from "./components/EmailVerification";

function App() {
  const [newHome, setNewHome] = useState(HOMES);
  const [location, setLocation] = useState(false);
  const [cheapest, setCheapest] = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const { properties } = useFetchProperties();
  const [myProperties, setMyProperties] = useState([]);
  const { setProperties } = useFetchProperties();

  useEffect(() => {
    setMyProperties(properties);
  }, [properties]);

  const searchLocation = () => {
    setLocation(!location);
    setCheapest(false);
    setNewHome(HOMES);
  };

  const searchCheapest = () => {
    const prices = properties.filter((x) => x.price !== null);
    prices.sort((a, b) => a.price - b.price);
    const sorted = [...prices];
    setCheapest((prev) => !prev);
    setLocation(false);
    setMyProperties(cheapest ? properties : sorted);
  };

  const uniqueLocations = [...new Set(properties.map((items) => items.property_location_details.area))];

  const filterSearch = (LGA) => {
    const filteredSearch = properties.filter((items) => items.property_location_details.area === LGA);
    setMyProperties(filteredSearch);
    setLocation(!location);
    console.log(uniqueLocations);
    console.log(myProperties);
  };
  const filterSearchMobile = (LGA) => {
    const filteredSearch = HOMES.filter((items) => items.value.LGA === LGA);
    setNewHome(filteredSearch);
  };
  const toggleMobileFilter = () => {
    setMobileFilter(!mobileFilter);
  };

  return (
    <div className="text-black">
      <Header
        searchLocation={searchLocation}
        location={location}
        uniqueLocations={uniqueLocations}
        cheapest={cheapest}
        searchCheapest={searchCheapest}
        filterSearch={filterSearch}
        setNewHome={setNewHome}
        setLocation={setLocation}
        toggleMobileFilter={toggleMobileFilter}
        mobileFilter={mobileFilter}
        filterSearchMobile={filterSearchMobile}
        setMyProperties={setMyProperties}
        properties = {properties}
      />
      <div className="">
        <Routes>
          <Route exact path="/" element={<Card properties={myProperties} />} />
          <Route
            path="/property/:id"
            element={<PropertyDetails properties={properties} />}
          />

          <Route path="/wishlistpage" element={<WishlistPage properties={properties}/>} />


          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;

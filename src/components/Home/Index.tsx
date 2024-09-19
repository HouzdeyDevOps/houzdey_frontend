import React from "react";
import PropertySearch from "./components/PropertySearch";
import Card from "./components/Card";


const Home = () => {
  return (
    <section className="container mt-20 h-screen">
      <PropertySearch />
      <Card/>
    </section>
  );
};

export default Home;

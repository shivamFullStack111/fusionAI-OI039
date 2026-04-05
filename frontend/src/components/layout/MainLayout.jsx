import React from "react";
import Header from "../common/home-page/Header";
import Footer from "../common/home-page/Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      {" "}
      <Header></Header>
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;

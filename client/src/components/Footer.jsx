import React from "react";
import LogoUC from "../assets/logoUC.png";
import LogoCbgi from "../assets/logoCbgi.jpeg";

const Footer = () => {
  return (
    <div className="w-full flex flex-row items-center bg-white pl-16 pr-16 pt-12 pb-12">
      <div className="w-1/12 absolute">
        <img
          src={LogoUC}
          alt="Logo Universitas Ciputra"
          className="h-10 w-10 md:w-20 md:h-20"
        ></img>
      </div>
      <div className="w-1/6 flex justify-start absolute ml-24">
        <img
          src={LogoCbgi}
          alt="Logo Universitas Ciputra"
          className="h-5 w-12 md:w-24 md:h-11"
        ></img>
      </div>
      <div className="w-full flex flex-row justify-center align-middle">
          <h1 className="">Developed by Delsun Co. 2021</h1>
      </div>
    </div>
  );
};

export default Footer;

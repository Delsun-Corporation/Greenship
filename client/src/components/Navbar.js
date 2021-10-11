import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons/lib";
import { isAuth, Signout } from "../helpers/auth";
import "./Navbar.css";

const Navbar = (props) => {
  const [sidebar, setSidebar] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
  };

  const showDropdown = () => {
    setDropdown(!dropdown);
  };

  const logOut = () => {
    Signout();
  };

  return (
    <IconContext.Provider value={{ color: "white" }}>
      <div>
        <div className="navbar">
          <Link to="#" className={props.isDashboard ? "hidden" : "menu-bars" }>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className="navbar-left">
            <a
              class="navbar-brand items-center justify-center flex-row"
              href="/"
            >
              <h1 className="font-title font-regular ml-5 text-xl md:text-3xl">
                DEFINE
              </h1>
              <h4 className="font-body font-semibold ml-5 text-sm md:text-base">
                DESIGN FOR NET ZERO AND HEALTHY BUILDING
              </h4>
            </a>
          </div>
          <div className="navbar-right flex-row items-center justify-end mr-10">
            <div className="flex-col">
              {!isAuth() ? (
                <a class="navbar-brand-right" href="/login">
                  Sign in
                </a>
              ) : (
                <div>
                  <h4
                    class="navbar-brand-right font-body text-left justify-start"
                    href="/login"
                  >
                    {isAuth().name}
                  </h4>
                  <h4 className="navbar-brand-right font-body font-light text-left justify-start">
                    {isAuth().email}
                  </h4>
                </div>
              )}
            </div>
            <div className="flex-row items-center ml-5">
              <Link to="#" onClick={showDropdown}>
                <FaIcons.FaChevronDown />
              </Link>
            </div>
            <div
              className={
                dropdown
                  ? "flex justify-end bg-white mt-0 transition duration-500 absolute w-52 top-20 h-10 items-center"
                  : "-mt-100 transition duration-500"
              }
            >
              <span
                className={
                  dropdown
                    ? "font-body font-bold text-red-600 mr-2 items-center"
                    : "hidden"
                }
              >
                <FaIcons.FaArrowAltCircleRight color="red" />
              </span>
              <span
                className={
                  dropdown
                    ? "font-body font-bold text-red-600 items-center mr-10"
                    : "hidden"
                }
              >
                <Link to="/login" onClick={logOut}>
                  LOG OUT
                </Link>
              </span>
              <div className= {
                  dropdown
                    ? "bg-antiqueBrass w-4 h-full"
                    : "hidden"
                }/>
            </div>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars" onClick={showSidebar}>
                <AiIcons.AiFillCloseCircle />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path} onClick={showSidebar}>
                    {item.icon}
                    <span className="sidebar-span">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </IconContext.Provider>
  );
};

export default Navbar;

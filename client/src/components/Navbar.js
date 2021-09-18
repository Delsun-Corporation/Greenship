import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons/lib";
import Logo from "../assets/bootstrap-logo.svg";
import { isAuth } from "../helpers/auth";
import "./Navbar.css";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <IconContext.Provider value={{ color: "white" }}>
      <div>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className="navbar-left">
            <a class="navbar-brand" href="#">
              <img
                src={Logo}
                alt=""
                width="30"
                height="24"
                class="d-inline-block align-text-top"
              />
              Bootstrap
            </a>
          </div>
          <div className="navbar-right">
            {!isAuth() ? (
              <a class="navbar-brand-right" href="/login">
                Sign in
              </a>
            ) : null}
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
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
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

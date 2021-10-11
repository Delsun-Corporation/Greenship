import React from "react";
import Navbar from "./components/Navbar";
import { Redirect } from "react-router";
import { isAuth } from "./helpers/auth";

function App() {
  return (
    <div className="bg-gray-400 min-h-screen">
      {!isAuth() ? <Redirect to="/login" /> : null }
      <Navbar isDashboard="true" />
      App
    </div>
  );
}

export default App;

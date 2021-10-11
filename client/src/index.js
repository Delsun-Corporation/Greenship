import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import App from "./App";
import Register from "./Screens/Register.jsx";
import Activate from "./Screens/Activate.jsx";
import { injectStyle } from "react-toastify/dist/inject-style";
import Login from "./Screens/Login";
import ForgotPass from "./Screens/ForgotPass";
import Reset from "./Screens/Reset";
import NotFoundPage from "./Screens/NotFoundPage";
import "./index.css";
import Footer from "./components/Footer.jsx";

if (typeof window !== "undefined") {
  injectStyle();
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <App {...props} />} />
      <Route path="/login" exact render={(props) => <Login {...props} />} />
      <Route
        path="/users/passwords/forget"
        exact
        render={(props) => <ForgotPass {...props} />}
      />
      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />
      <Route
        path="/users/activate/:token"
        exact
        render={(props) => <Activate {...props} />}
      />
      <Route
        path="/users/passwords/reset/:token"
        exact
        render={(props) => <Reset {...props} />}
      />
      <Route
        path="" 
        exact
        render={(props) => <NotFoundPage {...props} />}
      />
    </Switch>
    <Footer></Footer>
  </BrowserRouter>,
  document.getElementById("root")
);

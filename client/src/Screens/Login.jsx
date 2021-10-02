import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { authenticate, isAuth } from "../helpers/auth";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import authPict from "../assets/authPict.jpeg";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
  });

  const { email, password1 } = formData;
  // Handle change from inputs
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  // Submit data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password1) {
      setFormData({ ...formData });
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          email,
          password: password1,
        })
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password1: "",
            });

            toast.success(res.data.message);
          });

          // if authenticate but not admin redirect to /private
          // if admin redirect to /admin
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push("/private");

          toast.success(`Hey ${res.data.user.name}, Welcome back!`);
        })
        .catch((err) => {
          if (err.response.data.error) {
            toast.error(err.response.data.error);
          } else {
            toast.error("Error for some reason");
          }
        });
    } else {
      toast.error("Please fill all fields");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="relative bg-auto w-full bg-cover bg-center bg-no-repeat rounded-l-lg bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex justify-center items-center"
            style={{ backgroundImage: `url(${authPict})` }}
          >
            <div className="z-10">
              <h1 className="font-title text-white text-7xl font-semibold">GREENSHIP</h1>
              <h4 className="font-body text-white font-bold">NET ZERO CALCULATOR</h4>
            </div>
            <div className="rounded-l-lg absolute z-0 opacity-50 w-full h-full bg-greenOverlay mix-blend-multiply"></div>
          </div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="font-body text-2xl xl:text-3xl font-extrabold">
              Sign into Your Account
            </h1>
            <form
              className="w-full flex-1 mt-8 text-primary"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleChange("email")}
                  value={email}
                  className="rounded font-body w-full px-8 py-4 font-medium bg-white-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:ring-primary focus:ring-2"
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password1")}
                  value={password1}
                  className="rounded font-body w-full px-8 py-4 font-medium bg-white-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:ring-primary focus:ring-2 mt-5"
                />
                <button
                  type="submit"
                  className="font-body mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-4 rounded-lg hover:bg-secondary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  SIGN IN
                </button>
                <Link
                  to="/users/passwords/forget"
                  className="font-body no-underline hover:underline font-small text-primary text-md text-right absolute right-0  mt-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="my-12 border-b text-center">
                <div className="font-body leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or Register a New account
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a
                  href="/register"
                  className="font-body w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                >
                  REGISTER
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

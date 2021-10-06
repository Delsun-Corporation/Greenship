import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { isAuth } from "../helpers/auth";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Redirect } from "react-router-dom";
import authPict from "../assets/authPict.jpeg";

const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }

  }, [match.params]);

  const { name, token } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/activation`, {
        token
      })
      .then((res) => {
        setFormData({ ...formData, show: false });
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
      <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="relative w-full bg-cover bg-center bg-no-repeat rounded-l-lg bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex justify-center items-center"
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
            <h1 className="font-body text-center text-2xl xl:text-3xl font-extrabold">
              Welcome, {name}
            </h1>
            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative ">
                <button
                  type="submit"
                  className="font-body mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-4 rounded-lg hover:bg-secondary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className="ml-3">ACTIVATE YOUR ACCOUNT</span>
                </button>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  or Register Again
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                  href="/register"
                  target="_self"
                >
                  <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                  <span className="ml-4">REGISTER</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Activate;

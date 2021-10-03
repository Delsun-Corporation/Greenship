import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import authPict from "../assets/authPict.jpeg";

const ForgotPass = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    textChange: "SUBMIT",
  });

  const { email, textChange } = formData;
  // Handle change from inputs
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  // Submit data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setFormData({ ...formData, textChange: "SUBMITTING..." });
      axios
        .put(`${process.env.REACT_APP_API_URL}/password/forget`, {
          email,
        })
        .then((res) => {
          setFormData({
            ...formData,
            email: "",
            textChange: "SUBMIT",
          });

          toast.success("Please Check Your Email");
        })
        .catch((err) => {
          toast.error(err.response.data.error);
          setFormData({
            ...formData,
            textChange: "SUBMIT",
          });
        });
    } else {
      toast.error("Please fill all fields");
      setFormData({
        ...formData,
        textChange: "SUBMIT",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
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
              Forgot Password
            </h1>
            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleChange("email")}
                  value={email}
                  className="rounded font-body w-full px-8 py-4 font-medium bg-white-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:ring-primary focus:ring-2 mt-5"
                />
                <button
                  type="submit"
                  className="font-body mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-4 rounded-lg hover:bg-secondary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span className="ml-3">{textChange}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;

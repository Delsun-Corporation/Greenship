import React, {useState, useEffect} from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import authPict from "../assets/authPict.jpeg";

const Reset = ({match}) => {
    const [formData, setFormData] = useState({
        password1: '',
        password2: '',
        token: true,
      });

    const { password1, password2, token } = formData;

    useEffect(() => {
        let token = match.params.token;
        if (token) {
            setFormData({...formData, token});
        }
    }, [match.params]);

    const handleChange = text => e => {
        setFormData({...formData, [text]: e.target.value })
    }

    const handleSubmit = e => {
        e.preventDefault();
        if((password1 === password2) && password2 && password1) {
            axios.put(`${process.env.REACT_APP_API_URL}/password/reset`, {
                newPassword: password1,
                resetPasswordLink: token
            }).then((res) => {
                setFormData({...formData, password1: '', password2: ''})
                toast.success(res.data.message);
            }).catch((err) => {
                toast.error(`${err.response.data.error}`);
            });
        } else {
            toast.error('Password do not matches');

        }
    };

    return (
        <div className='min-h-screen bg-gray-100 text-gray-900 flex justify-center'>
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
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
        <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='font-body text-2xl xl:text-3xl font-extrabold'>
              Reset Your Password
            </h1>
            <div className='w-full flex-1 mt-8 text-primary'>
              <form
                className='mx-auto max-w-xs relative '
                onSubmit={handleSubmit}
              >
                <input
                  className='rounded font-body w-full px-8 py-4 font-medium bg-white-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:ring-primary focus:ring-2'
                  type='password'
                  placeholder='New Password'
                  onChange={handleChange('password1')}
                  value={password1}
                  />
                  <input
                  className='mt-5 rounded font-body w-full px-8 py-4 font-medium bg-white-100 border border-gray-400 placeholder-gray-500 text-sm focus:outline-none focus:ring-primary focus:ring-2'
                  type='password'
                  placeholder='Repeat New Password'
                  onChange={handleChange('password2')}
                  value={password2}
                />
                <button
                  type='submit'
                  className='font-body mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-4 rounded-lg hover:bg-secondary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
                >
                  <i className='fas fa-sign-in-alt  w-6  -ml-2' />
                  <span className='ml-3'>Submit</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
};

export default Reset;
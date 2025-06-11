import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { freeAxios } from "../api/Axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    freeAxios
      .post("/user/signin", formData)
      .then((responce) => {
        if (responce.data.success) {
          const token = responce.data.token;
          localStorage.setItem("token", token);
          const user = responce.data.user;
          localStorage.setItem("user", JSON.stringify(user));

          toast.success(responce.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          navigate("/home");
        } else {
          toast.error(responce.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }

        setFormData({
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        console.error("Error during sign In:", error);
        toast.error("Sign In Failed", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col lg:flex-row">
      {/* Right section */}
      <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 lg:p-8 order-2 lg:order-1">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 lg:p-8">
          {/* Logo and Title */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="logo of the note share platform"
                className="w-16 h-16 rounded-full "
              />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              Join our community of note sharers
            </p>
          </div>

          {/* Sign In Form */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100 mb-4 lg:mb-6 text-center">
              LogIn to Your Account
            </h3>

            <div className="space-y-4">
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-slate-400"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-6"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-slate-700 dark:text-slate-300">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Left section  */}
      <div className="w-full lg:w-1/2 bg-blue-600 dark:bg-slate-800 flex flex-col justify-center items-center p-6 lg:p-12 min-h-[200px] lg:min-h-screen order-1 lg:order-2">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-gray-100 mb-4 lg:mb-6">
            Sign In
          </h1>
          <div className="w-24 lg:w-32 h-1 bg-white dark:bg-blue-400 mx-auto mb-4 lg:mb-6"></div>
          <p className="text-lg lg:text-xl font-medium text-blue-100 dark:text-slate-300">
            Welcome to our community
          </p>
          <p className="text-base lg:text-lg mt-2 lg:mt-4 text-blue-200 dark:text-slate-400">
            Share knowledge, connect with learners
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

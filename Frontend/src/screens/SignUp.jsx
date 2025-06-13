import React, { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { freeAxios } from "../api/Axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    grade: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    await freeAxios
      .post("/user/signup", formData)
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
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          age: "",
          grade: "",
        });
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error("Error during sign up:", error);
        toast.error("Sign Up Failed", {
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
      {/* Left section  */}
      <div className="w-full lg:w-1/2 bg-blue-600 dark:bg-slate-800 flex flex-col justify-center items-center p-6 lg:p-12 min-h-[200px] lg:min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-3 mb-4 lg:mb-6">
            Sign Up
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

      {/* Right section  */}
      <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 lg:p-8">
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

          {/* Sign Up Form */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100 mb-4 lg:mb-6 text-center">
              Create Account
            </h3>

            <div className="space-y-4">
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-slate-400"
                  />
                </div>

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

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
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

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Age Field */}
                  <div className="flex-1">
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={(e) => {
                        if (e.target.value >= 0 && e.target.value <= 80)
                          handleChange(e);
                      }}
                      required
                      min={1}
                      max={80}
                      placeholder="Enter your Age"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-slate-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="grade"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Grade
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100"
                    >
                      <option value="">Select your grade</option>
                      <option value="primaryschool">Primary School</option>
                      <option value="highschool">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-6"
                >
                  Create Account
                </button>
              </form>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-slate-700 dark:text-slate-300">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

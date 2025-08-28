import React from "react";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NoPage;

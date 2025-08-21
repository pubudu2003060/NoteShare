import React, { useEffect } from "react";
import { Home, ArrowLeft, Search, Compass, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + H for home
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "h") {
        e.preventDefault();
        navigate("/home");
      }
      // Escape key for home
      if (e.key === "Escape") {
        navigate("/home");
      }
      // Enter key for home
      if (e.key === "Enter") {
        navigate("/home");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  const quickActions = [
    {
      icon: Home,
      label: "Go Home",
      description: "Return to the main dashboard",
      action: () => navigate("/home"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: Search,
      label: "Search Groups",
      description: "Find study groups to join",
      action: () => navigate("/home"),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: BookOpen,
      label: "My Groups",
      description: "View your created groups",
      action: () => navigate("/home/mygroups"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      icon: Compass,
      label: "Explore",
      description: "Discover new content",
      action: () => navigate("/home"),
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-slate-700 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Search size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved.
            Don't worry, let's get you back on track.
          </p>

          {/* Keyboard Shortcuts Info */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Quick Navigation:
            </h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 dark:text-slate-400">
              <span className="bg-white dark:bg-slate-600 px-2 py-1 rounded border">
                <kbd className="font-mono">Esc</kbd> - Go Home
              </span>
              <span className="bg-white dark:bg-slate-600 px-2 py-1 rounded border">
                <kbd className="font-mono">Enter</kbd> - Go Home
              </span>
              <span className="bg-white dark:bg-slate-600 px-2 py-1 rounded border">
                <kbd className="font-mono">Ctrl+H</kbd> - Go Home
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go to Home
            </button>
            <button
              onClick={handleGoBack}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-slate-600 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 group text-left"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${action.color} transition-colors`}
                >
                  <action.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-500">
            Lost? Press{" "}
            <kbd className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-mono">
              Esc
            </kbd>{" "}
            or{" "}
            <kbd className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-mono">
              Enter
            </kbd>{" "}
            to return home
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoPage;

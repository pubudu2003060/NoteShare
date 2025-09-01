import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Users,
  Globe,
  Lock,
  Star,
  User,
  Info,
  Home,
  ChartArea,
  MessageCircle,
} from "lucide-react";
import logo from "../../assets/logo/logo.jpg";
import { useSelector } from "react-redux";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unviewedCount = useSelector(
    (state) => state.Notification.unviewedCount
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 dark:bg-slate-800 rounded-md shadow-lg hover:bg-blue-700 dark:hover:bg-slate-700"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-white dark:text-gray-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed  inset-y-0 left-0 z-40 w-64 bg-blue-600 dark:bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="mb-6 mt-12 md:mt-0">
            <Link
              to="/home"
              className="flex items-center gap-2 group"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={logo}
                alt="NoteShare Logo"
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white dark:text-gray-100 group-hover:text-blue-200 dark:group-hover:text-blue-400 transition-colors">
                NoteShare
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  to=""
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900/20 hover:text-white dark:hover:text-blue-400 text-blue-100 dark:text-slate-300 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:block md:block">Home</span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="mygroups"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900/20 hover:text-white dark:hover:text-blue-400 text-blue-100 dark:text-slate-300 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:block md:block">My Groups</span>
                  <span className="block sm:hidden md:hidden text-xs">
                    My Groups
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="editorgroups"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-green-900/20 hover:text-white dark:hover:text-green-400 text-blue-100 dark:text-slate-300 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:block md:block">
                    Editor Groups
                  </span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Editor Groups
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="usergroups"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-purple-900/20 hover:text-white dark:hover:text-purple-400 text-blue-100 dark:text-slate-300 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:block md:block">User Groups</span>
                  <span className="block sm:hidden md:hidden text-xs">
                    User Groups
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="notification"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-purple-900/20 hover:text-white dark:hover:text-purple-400 text-blue-100 dark:text-slate-300 font-medium transition-all duration-200 group relative"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:block md:block">Notification</span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Notification
                  </span>
                  {unviewedCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                      {unviewedCount > 99 ? "99+" : unviewedCount}
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer Links */}
          <div className="space-y-1 border-t border-blue-500 dark:border-slate-700 pt-4 mt-4">
            <Link
              to="profile"
              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-slate-700 text-blue-200 dark:text-slate-400 text-sm transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block md:block">Profile</span>
              <span className="block sm:hidden md:hidden text-xs">Profile</span>
            </Link>
            <Link
              to="about"
              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-slate-700 text-blue-200 dark:text-slate-400 text-sm transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:block md:block">About</span>
              <span className="block sm:hidden md:hidden text-xs">Info</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;

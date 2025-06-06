import { Link } from "react-router-dom";
import { useState } from "react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="mb-6 mt-12 md:mt-0">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                NoteShare
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  to="mygroups"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="hidden sm:block md:block">My Groups</span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Groups
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="publicgroups"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-green-50 hover:text-green-600 text-gray-700 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="hidden sm:block md:block">
                    Public Groups
                  </span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Public
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="privategroups"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-purple-50 hover:text-purple-600 text-gray-700 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="hidden sm:block md:block">
                    Private Groups
                  </span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Private
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="stared"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 text-gray-700 font-medium transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span className="hidden sm:block md:block">Starred</span>
                  <span className="block sm:hidden md:hidden text-xs">
                    Star
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer Links */}
          <div className="space-y-1 border-t border-gray-200 pt-4 mt-4">
            <Link
              to="profile"
              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-50 text-gray-600 text-sm transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden sm:block md:block">Profile</span>
              <span className="block sm:hidden md:hidden text-xs">Me</span>
            </Link>
            <Link
              to="about"
              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-50 text-gray-600 text-sm transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
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

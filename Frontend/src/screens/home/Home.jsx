import { useState, useEffect } from "react";
import { Search, Users, Lock, Filter } from "lucide-react";
import logo from "../../assets/logo/logo.jpg";
import { Link } from "react-router-dom";
import { JWTAxios } from "../../api/Axios";
import Card from "../../components/card/Card";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // New state for actual search
  const [showPublic, setShowPublic] = useState(true);
  const [showPrivate, setShowPrivate] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from backend based on searchKeyword
  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await JWTAxios.get(
        `/group/searchgroups/${searchKeyword}`
      );

      if (response.data.success) {
        setAllGroups(response.data.groups); // raw data from backend
      } else {
        console.log("Could not fetch group data");
      }
    } catch (error) {
      console.error("Error fetching groups:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // This effect runs whenever searchKeyword changes (actual search trigger)
  useEffect(() => {
    fetchGroups();
  }, [searchKeyword]);

  // Filter by public/private (frontend only)
  useEffect(() => {
    const filtered = allGroups.filter((item) => {
      const matchesType =
        (showPublic && !item.isPrivate) || (showPrivate && item.isPrivate);
      return matchesType;
    });

    setFilteredData(filtered);
  }, [showPublic, showPrivate, allGroups]);

  // Handle search input change (just updates the input value)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search execution
  const handleSearch = () => {
    setSearchKeyword(searchTerm);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePublicChange = (e) => {
    setShowPublic(e.target.checked);
  };

  const handlePrivateChange = (e) => {
    setShowPrivate(e.target.checked);
  };

  // Load initial data on component mount
  useEffect(() => {
    setSearchKeyword(""); // This will trigger fetchGroups with empty string (random groups)
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Keeping your centered layout */}
        <div className="rounded-xl p-6 mb-8">
          {/* Logo and Title Section - Enhanced spacing */}
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="relative">
              <Link to="/home">
                <img
                  src={logo}
                  alt="logo of the note share platform"
                  className="w-20 h-20 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                <Link to="/home">NoteShare</Link>
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-400 font-medium">
                Discover and share knowledge
              </p>
            </div>
          </div>

          {/* Search Bar - Improved responsive width */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Search groups..."
              className="w-full pl-12 pr-16 py-4 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="h-5 w-5 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors" />
              )}
            </button>
          </div>

          {/* Filters - Enhanced styling while keeping your layout */}
          <div className="flex flex-wrap flex-col md:flex-row justify-center items-start md:items-center gap-3 md:gap-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                Show:
              </span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={showPublic}
                onChange={handlePublicChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                Public Groups
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={showPrivate}
                onChange={handlePrivateChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <Lock size={16} className="text-green-600" />
                Private Groups
              </span>
            </label>
          </div>
        </div>

        {/* Results - Enhanced styling */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-slate-400 font-medium">
              Showing{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {filteredData.length}
              </span>{" "}
              results
            </p>
            <div className="text-sm text-gray-500 dark:text-slate-500">
              {filteredData.filter((item) => !item.isPrivate).length} public •{" "}
              {filteredData.filter((item) => item.isPrivate).length} private
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-slate-400">
                Searching groups...
              </span>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* No Results - Enhanced styling */}
        {!isLoading && filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 dark:text-slate-600 mb-6">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              We couldn't find any{" "}
              {!showPublic
                ? "private groups"
                : !showPrivate
                ? "public groups"
                : "groups"}{" "}
              matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

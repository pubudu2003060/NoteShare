import { useState, useEffect } from "react";
import { Search, Users, FileText, Filter } from "lucide-react";
import logo from "../../assets/logo/logo.jpg";
import { Link } from "react-router-dom";
import HomeCard from "../../components/card/HomeCard";

const sampleGroups = [
  {
    id: 1,
    name: "Computer Science Study Group",
    image:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
    description:
      "A collaborative space for CS students to share algorithms, data structures, and programming concepts.",
    tags: ["Programming", "Algorithms", "Data Structures", "Computer Science"],
    type: "group",
    members: 156,
  },
  {
    id: 2,
    name: "Mathematics Notes Hub",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
    description:
      "Advanced calculus, linear algebra, and statistics notes shared by university students.",
    tags: ["Mathematics", "Calculus", "Statistics", "Linear Algebra"],
    type: "group",
    members: 89,
  },
  {
    id: 3,
    name: "React Hooks Deep Dive",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
    description:
      "Comprehensive notes on React hooks with practical examples and best practices.",
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    type: "note",
    author: "Sarah Chen",
  },
  {
    id: 4,
    name: "Physics Laboratory Group",
    image:
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=300&h=200&fit=crop",
    description:
      "Share experimental procedures, lab reports, and physics problem solutions.",
    tags: ["Physics", "Laboratory", "Experiments", "Science"],
    type: "group",
    members: 73,
  },
  {
    id: 5,
    name: "Python Data Science Guide",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop",
    description:
      "Complete guide to data science with Python including pandas, numpy, and matplotlib examples.",
    tags: ["Python", "Data Science", "Machine Learning", "Analytics"],
    type: "note",
    author: "Alex Kumar",
  },
  {
    id: 6,
    name: "History Study Circle",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
    description:
      "Discussing world history, sharing research papers and historical analysis.",
    tags: ["History", "Research", "World History", "Analysis"],
    type: "group",
    members: 124,
  },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showGroups, setShowGroups] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [filteredData, setFilteredData] = useState(sampleGroups);

  const filterData = () => {
    let filtered = sampleGroups.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType =
        (showGroups && item.type === "group") ||
        (showNotes && item.type === "note");

      return matchesSearch && matchesType;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchTerm, showGroups, showNotes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupsChange = (e) => {
    setShowGroups(e.target.checked);
  };

  const handleNotesChange = (e) => {
    setShowNotes(e.target.checked);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Keeping your centered layout */}
        <div className="rounded-xl p-6 mb-8">
          {/* Logo and Title Section - Enhanced spacing */}
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="relative">
              <Link to="/home">
                {" "}
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
              placeholder="Search groups and notes..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 transition-all duration-300 shadow-sm hover:shadow-md"
            />
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
                checked={showGroups}
                onChange={handleGroupsChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                Groups
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={handleNotesChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <FileText size={16} className="text-green-600" />
                Notes
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
              {filteredData.filter((item) => item.type === "group").length}{" "}
              groups •{" "}
              {filteredData.filter((item) => item.type === "note").length} notes
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <HomeCard key={item.id} item={item} />
          ))}
        </div>

        {/* No Results - Enhanced styling */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 dark:text-slate-600 mb-6">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              We couldn't find any{" "}
              {!showGroups
                ? "notes"
                : !showNotes
                ? "groups"
                : "groups or notes"}{" "}
              matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

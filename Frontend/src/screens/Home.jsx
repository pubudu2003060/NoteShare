import { useState } from "react";
import { Search, Users, FileText, Filter } from "lucide-react";
import HomeCard from "../components/home/HomeCard";
import logo from "../assets/logo/logo.jpg";

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

  useState(() => {
    filterData();
  }, [searchTerm, showGroups, showNotes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterData();
  };

  const handleGroupsChange = (e) => {
    setShowGroups(e.target.checked);
    setTimeout(filterData, 0);
  };

  const handleNotesChange = (e) => {
    setShowNotes(e.target.checked);
    setTimeout(filterData, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" rounded-xl  p-6 mb-6 ">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <img
              src={logo}
              alt="logo of the note share platform"
              className="w-16 h-16 rounded-xl shadow-md"
            />
            <div>
              <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-white">
                NoteShare
              </h1>
              <p className="text-center text-gray-600 dark:text-slate-400">
                Discover and share knowledge
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6 flex m-auto w-75 md:w-3xl">
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
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex m-auto justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Show:
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showGroups}
                onChange={handleGroupsChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                <Users size={16} />
                Groups
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={handleNotesChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                <FileText size={16} />
                Notes
              </span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-slate-400">
            Showing {filteredData.length} results
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <HomeCard key={item.id} item={item} />
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-slate-500 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-slate-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

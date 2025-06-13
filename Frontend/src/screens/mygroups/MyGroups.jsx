import { Plus, X, Upload, Users } from "lucide-react";
import Card from "../../components/card/Card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MyGroups = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: null,
    tags: "",
    subject: "",
    status: "",
  });

  const sampleGroups = [
    {
      id: 1,
      name: "Computer Science Study Group",
      image:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
      description:
        "A collaborative space for CS students to share algorithms, data structures, and programming concepts.",
      tags: [
        "Programming",
        "Algorithms",
        "Data Structures",
        "Computer Science",
      ],
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
      type: "group",
      members: 89,
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
      type: "group",
      members: 89,
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

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    setFormData({
      name: "",
      description: "",
      photo: null,
      tags: "",
      subject: "",
      status: "private",
    });
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      photo: null,
      tags: "",
      subject: "",
      status: "private",
    });
    setShowCreateForm(false);
  };

  return (
    <div className=" min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      <div className=" max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center md:items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className=" text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 p-1">
              My Groups
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Manage and create your study groups
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
          title="Create New Group"
        >
          <Plus size={24} />
        </button>

        {/* Groups Count */}
        <div className="mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Total Groups
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sampleGroups.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleGroups.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {sampleGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 dark:text-slate-600 mb-6">
              <Users size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No groups yet
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Create your first study group to start collaborating with others
              and sharing knowledge.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Your First Group
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Group
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Group Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Group Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Describe your group and its purpose"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Group Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-slate-700 flex items-center justify-center gap-2"
                  >
                    <Upload
                      size={20}
                      className="text-gray-500 dark:text-slate-400"
                    />
                    <span className="text-gray-600 dark:text-slate-400">
                      {formData.photo
                        ? formData.photo.name
                        : "Upload group photo"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Tags and Subject Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tags */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Category *
                  </label>
                  <select
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <option value="lecturenotes">Lecture Notes</option>
                    <option value="pastpapers">Past Papers</option>
                    <option value="summary">Summary</option>
                    <option value="examtip">Exam Tips</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select subject</option>
                    <option value="science">Science</option>
                    <option value="maths">Mathematics</option>
                    <option value="biology">Biology</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="computer-science">Computer Science</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Privacy Setting *
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select status</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {formData.status === "private"
                    ? "Only invited members can join this group"
                    : "Anyone can discover and join this group"}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroups;

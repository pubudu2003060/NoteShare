import { Plus, X, Upload, Users } from "lucide-react";
import Card from "../../components/card/Card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { JWTAxios } from "../../api/Axios";

const MyGroups = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storedAdmin = localStorage.getItem("user");
  const admin = JSON.parse(storedAdmin);
  const adminId = admin.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: null,
    tags: [],
    isPrivate: false,
    userId: adminId,
  });

  const [tagInput, setTagInput] = useState("");

  const fetchMyGroups = async () => {
    setIsLoading(true);
    try {
      const response = await JWTAxios.post("/group/getmygroups", {
        id: adminId,
      });

      if (response.data.success) {
        setMyGroups(response.data.data);
      } else {
        toast.error("Failed to load your groups", {
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
    } catch (error) {
      console.error("Error fetching groups:", error.message);
      toast.error("Error loading groups", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files) {
      const file = files[0];

      if (file && file.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      } else {
        e.target.value = "";
        toast.error("Please select an image file only.", {
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
    } else if (name === "isPrivate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("userId", formData.userId);
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("isPrivate", formData.isPrivate);

      if (formData.tags.length > 0) {
        submitData.append("tags", JSON.stringify(formData.tags));
      } else {
        toast.error("Please add tags for describe the group", {
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

      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      const response = await JWTAxios.post("/group/creategroup", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const newGroup = response.data.data;
        const user = JSON.parse(localStorage.getItem("user"));
        user.adminGroups.push(newGroup.id);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Group created successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        setFormData({
          name: "",
          description: "",
          photo: null,
          tags: [],
          isPrivate: false,
          userId: adminId,
        });
        setTagInput("");
        setShowCreateForm(false);

        fetchMyGroups();
      } else {
        toast.error(response.data.message || "Failed to create group", {
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
    } catch (error) {
      console.error("Error creating group:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create group";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      photo: null,
      tags: [],
      isPrivate: false,
      userId: adminId,
    });
    setTagInput("");
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 ">
      <div className="max-w-7xl mx-auto ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center md:items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 p-1">
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
                  {myGroups.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-slate-400">
                Loading your groups...
              </span>
            </div>
          </div>
        )}

        {/* Groups Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && myGroups.length === 0 && (
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
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto color-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Group
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isSubmitting}
                  placeholder="Describe your group and its purpose"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className={`w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-slate-700 flex items-center justify-center gap-2 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload
                      size={20}
                      className="text-gray-500 dark:text-slate-400"
                    />
                    <span className="text-gray-600 dark:text-slate-400">
                      {formData.photo
                        ? formData.photo.name
                        : "Upload group photo (images only)"}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tagInput"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="tagInput"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyPress={handleTagKeyPress}
                      disabled={isSubmitting}
                      placeholder="Add tags (press Enter or comma to add)"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      disabled={isSubmitting}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>

                  {/* Display Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            disabled={isSubmitting}
                            className="hover:text-blue-600 dark:hover:text-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Add relevant tags to help others discover your group
                </p>
              </div>

              {/* Privacy Setting */}
              <div>
                <label
                  htmlFor="isPrivate"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Privacy Setting *
                </label>
                <select
                  name="isPrivate"
                  id="isPrivate"
                  value={formData.isPrivate}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={false}>Public</option>
                  <option value={true}>Private</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {formData.isPrivate
                    ? "Only invited members can join this group"
                    : "Anyone can discover and join this group"}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Group"
                  )}
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

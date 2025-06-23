import React, { useState } from "react";
import { Plus, X, Upload, Users } from "lucide-react";
import { toast } from "react-toastify";
import { JWTAxios } from "../../api/Axios";

const EditGroup = ({ onClose, groupData, onGroupUpdated }) => {
  const storedAdmin = localStorage.getItem("user");
  const admin = JSON.parse(storedAdmin);
  const adminId = admin.id;

  const initialFormData = {
    name: groupData.name || "",
    description: groupData.description || "",
    photo: null,
    tags: groupData.tags,
    isPrivate: groupData.isPrivate,
    groupId: groupData.id,
  };

  const [formData, setFormData] = useState({
    name: groupData.name || "",
    description: groupData.description || "",
    photo: null,
    tags: groupData.tags,
    isPrivate: groupData.isPrivate,
    groupId: groupData.id,
  });

  const hasFormChanged = () => {
    if (
      formData.name !== initialFormData.name ||
      formData.description !== initialFormData.description ||
      formData.isPrivate !== initialFormData.isPrivate ||
      formData.photo !== initialFormData.photo
    ) {
      return true;
    }

    const tagsChanged =
      formData.tags.length !== initialFormData.tags.length ||
      formData.tags.some((tag, i) => tag !== initialFormData.tags[i]);

    if (tagsChanged) {
      return true;
    }

    return false;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

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

    if (hasFormChanged()) {
      setIsSubmitting(true);
      try {
        const submitData = new FormData();
        submitData.append("groupId", formData.groupId);

        if (initialFormData.name !== formData.name) {
          submitData.append("name", formData.name);
        }
        if (initialFormData.description !== formData.description) {
          submitData.append("description", formData.description);
        }
        if (initialFormData.isPrivate !== formData.isPrivate) {
          submitData.append("isPrivate", formData.isPrivate);
        }

        const tagsChanged =
          formData.tags.length !== initialFormData.tags.length ||
          formData.tags.some((tag, i) => tag !== initialFormData.tags[i]);

        if (formData.tags.length > 0) {
          if (tagsChanged) {
            submitData.append("tags", JSON.stringify(formData.tags));
          }
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

        const response = await JWTAxios.put(`/group/updategroup`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success("Group updated successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          if (onGroupUpdated) {
            console.log(response.data.updatedGroup);
            onGroupUpdated(response.data.updatedGroup);
          }

          onClose();
        } else {
          toast.error(response.data.message || "Failed to update group", {
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
        console.error("Error updating group:", error);
        const errorMessage =
          error.response?.data?.message || "Error to update group";
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
    } else {
      toast.error("Please update First", {
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
  };

  const handleCancel = () => {
    setFormData({
      name: groupData.name || "",
      description: groupData.description || "",
      photo: null,
      tags: groupData.tags || [],
      isPrivate: groupData.isPrivate || false,
      userId: adminId,
      groupId: groupData.id || groupData._id,
    });
    setTagInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto color-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Group
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
            {/* Show current photo if exists */}
            {groupData.photo && !formData.photo && (
              <div className="mb-3">
                <img
                  src={groupData.photo}
                  alt="Current group photo"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-slate-600"
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Current photo (upload a new one to replace)
                </p>
              </div>
            )}
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
                    : "Upload new group photo (images only)"}
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
                  Updating...
                </>
              ) : (
                "Update Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGroup;

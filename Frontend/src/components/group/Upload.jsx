import React, { useState } from "react";
import {
  X,
  Upload as UploadIcon,
  FileText,
  Image,
  FileVideo,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { longJWTAxios } from "../../api/Axios";
import { useDispatch } from "react-redux";
import { addNewNote } from "../../state/group/Group";

const TAGS = ["note", "pastpapers", "examtip", "mindtip", "other"];

const Upload = ({ onClose, groupId }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: [],
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        tags: checked
          ? [...prev.tags, value]
          : prev.tags.filter((tag) => tag !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = 10 - form.files.length;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...filesToAdd],
    }));

    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (form.tags.length === 0) {
      alert("Please select at least one tag.");
      setIsSubmitting(false);
      return;
    }

    if (form.files.length === 0) {
      alert("Please upload at least one file.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("tags", JSON.stringify(form.tags));
    formData.append("group", groupId);

    form.files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await longJWTAxios.post("/note/createnotes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        dispatch(addNewNote(response.data.note));
        handleCancel();
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(response.data.message, {
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
      toast.error("Error adding new note", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error("Error loading group:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: "",
      description: "",
      tags: [],

      files: [],
    });
    onClose();
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/"))
      return <Image size={16} className="text-blue-500" />;
    if (file.type.startsWith("video/"))
      return <FileVideo size={16} className="text-purple-500" />;
    if (file.type === "application/pdf")
      return <FileText size={16} className="text-red-500" />;
    return <FileText size={16} className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto color-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload from Machine
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
          {/* Note Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
            >
              Note Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter note name (optional)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              disabled={isSubmitting}
              placeholder="Describe your note (optional)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Tags *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag}
                    checked={form.tags.includes(tag)}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:border-slate-500 disabled:opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
            {form.tags.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Please select at least one tag
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Upload Files * (Max: 10 files)
            </label>

            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                id="files"
                multiple
                onChange={handleFileUpload}
                disabled={isSubmitting || form.files.length >= 10}
                accept=".pdf,image/*,video/*"
                className="hidden"
              />
              <label
                htmlFor="files"
                className={`w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-slate-700 flex flex-col items-center justify-center gap-3 ${
                  isSubmitting || form.files.length >= 10
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <UploadIcon
                  size={32}
                  className="text-gray-400 dark:text-slate-500"
                />
                <div className="text-center">
                  <p className="text-gray-600 dark:text-slate-400 font-medium">
                    {form.files.length >= 10
                      ? "Maximum files reached (10/10)"
                      : `Upload  files`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                    {form.files.length}/10 files uploaded
                  </p>
                </div>
              </label>
            </div>

            {/* File List */}
            {form.files.length > 0 && (
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto color-scrollbar">
                <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Uploaded Files ({form.files.length}/10)
                </h4>
                {form.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={
                isSubmitting ||
                form.tags.length === 0 ||
                form.files.length === 0
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon size={16} />
                  Upload Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;

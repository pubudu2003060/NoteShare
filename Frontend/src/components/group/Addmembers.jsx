import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, Users, Loader2, User } from "lucide-react";
import { toast } from "react-toastify";
import { JWTAxios } from "../../api/Axios";

const AddMembers = ({ onClose, groupData, onMembersUpdated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers();
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await JWTAxios.get(
        `/user/searchUsers?query=${searchTerm.trim()}`
      );

      if (response.data.success) {
        // Filter out users who are already members or editors
        const existingMemberIds = [
          ...(groupData.members || []).map((m) => m.id || m._id),
          ...(groupData.editors || []).map((e) => e.id || e._id),
          groupData.admin?.id || groupData.admin?._id,
        ];

        const filteredUsers = response.data.users.filter(
          (user) => !existingMemberIds.includes(user.id || user._id)
        );

        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
        toast.error(response.data.message || "Failed to search users", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
      toast.error("Error searching users", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.find(
      (u) => (u.id || u._id) === (user.id || user._id)
    );

    if (isSelected) {
      setSelectedUsers(
        selectedUsers.filter((u) => (u.id || u._id) !== (user.id || user._id))
      );
    } else {
      setSelectedUsers([...selectedUsers, { ...user, role: "member" }]);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedUsers(
      selectedUsers.map((user) =>
        (user.id || user._id) === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to add", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const membersToAdd = selectedUsers.filter(
        (user) => user.role === "member"
      );
      const editorsToAdd = selectedUsers.filter(
        (user) => user.role === "editor"
      );

      const requestData = {
        groupId: groupData.id || groupData._id,
        members: membersToAdd.map((user) => user.id || user._id),
        editors: editorsToAdd.map((user) => user.id || user._id),
      };

      const response = await JWTAxios.post("/user/addmembers", requestData);

      if (response.data.success) {
        toast.success(
          `Successfully added ${selectedUsers.length} user(s) to the group!`,
          {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          }
        );

        // Call the callback to update the parent component
        if (onMembersUpdated) {
          onMembersUpdated(response.data.updatedGroup);
        }

        onClose();
      } else {
        toast.error(response.data.message || "Failed to add members", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error adding members:", error);
      const errorMessage =
        error.response?.data?.message || "Error adding members";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedUsers([]);
    setHasSearched(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Members to {groupData.name}
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
        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto color-scrollbar">
              {/* Search Section */}
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                >
                  Search Users
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                  />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by username or email..."
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2
                        size={16}
                        className="animate-spin text-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results */}
              {hasSearched && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    Search Results ({searchResults.length})
                  </h3>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-300 dark:text-slate-600 mb-3">
                        <Users size={32} className="mx-auto" />
                      </div>
                      <p className="text-gray-500 dark:text-slate-400 text-sm">
                        {searchTerm
                          ? "No users found matching your search."
                          : "Start typing to search for users"}
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto color-scrollbar space-y-2">
                      {searchResults.map((user) => {
                        const isSelected = selectedUsers.find(
                          (u) => (u.id || u._id) === (user.id || user._id)
                        );
                        return (
                          <div
                            key={user.id || user._id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                            }`}
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.username?.charAt(0).toUpperCase() || (
                                    <User size={16} />
                                  )}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {user.username}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-slate-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    Selected Users ({selectedUsers.length})
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto color-scrollbar">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id || user._id}
                        className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id || user._id,
                                e.target.value
                              )
                            }
                            disabled={isSubmitting}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                          >
                            <option value="member">Member</option>
                            <option value="editor">Editor</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
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
                disabled={isSubmitting || selectedUsers.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Adding Members...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Add {selectedUsers.length} Member
                    {selectedUsers.length !== 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMembers;

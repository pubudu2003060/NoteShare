import React, { useState } from "react";
import {
  Users,
  UserMinus,
  UserPlus,
  Settings,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { JWTAxios } from "../../api/Axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUsersAndMembers } from "../../state/group/Group";

const SidebarSection = ({ setEditGroup, editGroup, SetAddMembers }) => {
  const groupData = useSelector((state) => state.Group.data);
  const accesslevel = useSelector((state) => state.Group.data.accesslevel);
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberFilter, setMemberFilter] = useState("members");
  const [loading, setLoading] = useState(false);

  const getFilteredMembers = (memberType) => {
    if (!groupData) return [];

    let members = [];
    if (memberType === "editors" && groupData.editors) {
      members = groupData.editors.map((editor) => ({
        ...editor,
        role: "editor",
      }));
    } else if (memberType === "members" && groupData.members) {
      members = groupData.members.map((member) => ({
        ...member,
        role: "member",
      }));
    }

    if (searchTerm) {
      members = members.filter((member) =>
        member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return members;
  };

  const getAllFilteredMembers = () => {
    if (!groupData) return [];

    let allMembers = [];
    if (groupData.editors) {
      allMembers = [
        ...allMembers,
        ...groupData.editors.map((editor) => ({ ...editor, role: "editor" })),
      ];
    }
    if (groupData.members) {
      allMembers = [
        ...allMembers,
        ...groupData.members.map((member) => ({ ...member, role: "member" })),
      ];
    }

    if (searchTerm) {
      allMembers = allMembers.filter((member) =>
        member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allMembers;
  };

  const upgradeUser = async (memberId) => {
    setLoading(true);
    try {
      const response = await JWTAxios.post("/user/upgradeuser", {
        userId: memberId,
        groupId: groupData.id,
      });

      if (response.data.success) {
        dispatch(updateUsersAndMembers(response.data.data));
        console.log(response.data.data);
        toast.success("User upgraded successfully!", {
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
        toast.error(response.data.message || "Failed to upgrade user", {
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
      console.error("Error upgrading user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to upgrade user. Please try again.";
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
      setLoading(false);
    }
  };

  const downgradeUser = async (memberId, targetRole) => {
    setLoading(true);
    try {
      const response = await JWTAxios.post("/user/downgradeuser", {
        userId: memberId,
        groupId: groupData.id,
        targetRole: targetRole,
      });

      if (response.data.success) {
        dispatch(updateUsersAndMembers(response.data.data));
        console.log(response.data.data);

        toast.success("User downgraded successfully!", {
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
        toast.error(response.data.message || "Failed to downgrade user", {
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
      console.error("Error downgrading user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to downgrade user. Please try again.";
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
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    toast.success(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to remove this member from the group?</p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              downgradeUser(memberId, "none");
              toast.dismiss();
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => {
              toast.dismiss();
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  };

  return (
    <div className="lg:w-1/3 space-y-6">
      <div className="relative md:min-h-screen max-h-screen bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {/* Group Image */}
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {groupData.photo ? (
            <img
              src={groupData.photo}
              alt="Group"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Users size={48} className="text-white/80" />
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {groupData.name}
          </h3>

          <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
            {groupData.description}
          </p>
          {accesslevel === "admin" ? (
            <button
              onClick={() => {
                setEditGroup(!editGroup);
              }}
              disabled={loading}
              className="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings size={16} />
              Edit Group
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className={`${expanded ? "block" : "hidden"}  md:block p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </h3>

            {accesslevel === "admin" ? (
              <button
                onClick={() => SetAddMembers()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus size={14} />
                Add Members
              </button>
            ) : (
              <></>
            )}
          </div>

          {/* Member Search and Filter */}
          <div className="mb-4 space-y-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex gap-1">
              {accesslevel === "admin" ? (
                <button
                  onClick={() => setMemberFilter("all")}
                  disabled={loading}
                  className={`px-2 py-1 text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                    memberFilter === "all"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400"
                  }`}
                >
                  All
                </button>
              ) : (
                <></>
              )}

              {accesslevel === "admin" ? (
                <button
                  onClick={() => setMemberFilter("editors")}
                  disabled={loading}
                  className={`px-2 py-1 text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                    memberFilter === "editors"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400"
                  }`}
                >
                  Editors
                </button>
              ) : (
                <></>
              )}

              <button
                onClick={() => setMemberFilter("members")}
                disabled={loading}
                className={`px-2 py-1 text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                  memberFilter === "members"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400"
                }`}
              >
                Members
              </button>
            </div>
          </div>

          <div className="max-h-80 md:max-h-55 overflow-y-auto  color-scrollbar">
            {accesslevel === "admin" ? (
              /* Display filtered members */ memberFilter === "all" && (
                <div className="space-y-4   overflow-y-auto">
                  {/* Editors Section */}
                  {getFilteredMembers("editors").length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                          Editors ({getFilteredMembers("editors").length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {getFilteredMembers("editors").map((editor, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
                                <span className="text-orange-800 dark:text-orange-200 text-sm font-medium">
                                  {editor.username?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {editor.username}
                                </span>
                                <span className="text-gray-900 dark:text-white font-extralight">
                                  {editor.email}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                downgradeUser(editor._id, "member")
                              }
                              disabled={loading}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <UserMinus size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Members Section */}
                  {getFilteredMembers("members").length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                          Members ({getFilteredMembers("members").length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {getFilteredMembers("members").map((member, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center">
                                <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                                  {member.username?.charAt(0).toUpperCase()}
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {member.username}
                                </span>
                                <span className="text-gray-900 dark:text-white font-extralight">
                                  {member.email}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => upgradeUser(member._id)}
                                disabled={loading}
                                className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors p-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Promote to Editor"
                              >
                                <UserPlus size={16} />
                              </button>
                              <button
                                onClick={() => handleRemoveMember(member._id)}
                                disabled={loading}
                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove Member"
                              >
                                <UserMinus size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <></>
            )}

            {accesslevel === "admin" /* Show only editors */ ? (
              memberFilter === "editors" && (
                <div className="space-y-2">
                  {getFilteredMembers("editors").map((editor, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
                          <span className="text-orange-800 dark:text-orange-200 text-sm font-medium">
                            {editor.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-900 dark:text-white font-medium">
                            {editor.username}
                          </span>
                          <span className="text-gray-900 dark:text-white font-extralight">
                            {editor.email}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => downgradeUser(editor._id, "member")}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <></>
            )}

            {/* Show only members */}
            {memberFilter === "members" && (
              <div className="space-y-2">
                {getFilteredMembers("members").map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                          {member.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {member.username}
                        </span>
                        <span className="text-gray-900 dark:text-white font-extralight">
                          {member.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {accesslevel === "admin" ? (
                        <>
                          <button
                            onClick={() => upgradeUser(member._id)}
                            disabled={loading}
                            className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors p-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Promote to Editor"
                          >
                            <UserPlus size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove Member"
                          >
                            <UserMinus size={16} />
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {((memberFilter === "all" &&
              getAllFilteredMembers().length === 0) ||
              (memberFilter === "editors" &&
                getFilteredMembers("editors").length === 0) ||
              (memberFilter === "members" &&
                getFilteredMembers("members").length === 0)) && (
              <div className="text-center py-8">
                <div className="text-gray-300 dark:text-slate-600 mb-3">
                  <Users size={32} className="mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                  {searchTerm
                    ? "No members found matching your search."
                    : "No members yet. Invite people to join this group."}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setExpanded(!expanded);
          }}
          disabled={loading}
          className="absolute bottom-0 right-5 md:hidden  text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
    </div>
  );
};

export default SidebarSection;

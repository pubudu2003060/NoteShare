import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, MessageCircle, Lock, Globe } from "lucide-react";
import { useSelector } from "react-redux";
import { JWTAxios } from "../../api/Axios";
import { toast } from "react-toastify";

const ChatMenu = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUserGroups = async () => {
      setIsLoading(true);
      try {
        const [myGroupsRes, editorGroupsRes, userGroupsRes] = await Promise.all(
          [
            JWTAxios.post("/group/getmygroups"),
            JWTAxios.post("/group/geteditorgroups"),
            JWTAxios.post("/group/getusergroups"),
          ]
        );

        const allUserGroups = [];

        if (myGroupsRes.data.success) {
          myGroupsRes.data.data.forEach((group) => {
            allUserGroups.push({
              ...group,
              accesslevel: "admin",
            });
          });
        }

        if (editorGroupsRes.data.success) {
          editorGroupsRes.data.data.forEach((group) => {
            if (!allUserGroups.find((g) => g.id === group.id)) {
              allUserGroups.push({
                ...group,
                accesslevel: "editor",
              });
            }
          });
        }

        if (userGroupsRes.data.success) {
          userGroupsRes.data.data.forEach((group) => {
            if (!allUserGroups.find((g) => g.id === group.id)) {
              allUserGroups.push({
                ...group,
                accesslevel: "member",
              });
            }
          });
        }

        setAllGroups(allUserGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error("Failed to load groups", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUserGroups();
  }, []);

  const filteredGroups = allGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (accesslevel) => {
    switch (accesslevel) {
      case "admin":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "editor":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
      case "member":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/home/chat/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Group Chats
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Select a group to start chatting with your team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
            />
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

        {/* Groups List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Group Image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {group.photo ? (
                      <img
                        src={group.photo}
                        alt={group.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Users size={24} className="text-white" />
                    )}
                  </div>

                  {/* Group Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {group.name}
                        </h3>
                        <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-2 mt-1">
                          {group.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {/* Privacy Status */}
                        <div className="flex items-center gap-1">
                          {group.isPrivate ? (
                            <Lock
                              size={14}
                              className="text-green-600 dark:text-green-400"
                            />
                          ) : (
                            <Globe
                              size={14}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          )}
                        </div>

                        {/* Role Badge */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(
                            group.accesslevel
                          )}`}
                        >
                          {group.accesslevel}
                        </span>
                      </div>
                    </div>

                    {/* Group Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{group.members || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        <MessageCircle size={14} />
                        <span className="font-medium">Open Chat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 dark:text-slate-600 mb-6">
              <MessageCircle size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {searchTerm ? "No groups found" : "No chat groups available"}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms to find the group you're looking for."
                : "Join some groups first to start chatting with your teammates."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMenu;

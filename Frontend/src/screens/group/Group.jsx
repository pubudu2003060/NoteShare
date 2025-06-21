import { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Lock,
  Edit3,
  UserMinus,
  UserPlus,
  Settings,
  Tag,
  Search,
  MoreVertical,
  Share2,
  ChevronUp,
  ChevronDown,
  Upload,
  FileText,
} from "lucide-react";
import useQuery from "../../components/hooks/UseQuery";
import { JWTAxios } from "../../api/Axios";
import Uploadform from "../../components/group/Upload";
import NoteCard from "../../components/note/NoteCard";

const Group = () => {
  const query = useQuery();
  const groupId = query.get("id");

  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberFilter, setMemberFilter] = useState("members");
  const [showGroupActions, setShowGroupActions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newNote, setNewNote] = useState(false);
  const [showNoteOptions, setShowNoteOptions] = useState(false);
  const [notes, setNotes] = useState([]);

  const [accesslevel, setAccesslevel] = useState("none");

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await JWTAxios.get(
          `/group/getgroupfromid?id=${groupId}`
        );
        if (response.data.success) {
          setGroupData(response.data.group);
          const accesslevel = response.data.group.accesslevel;
          setAccesslevel(accesslevel);
        } else {
          console.error("Failed to load group data");
        }
      } catch (error) {
        console.error("Error loading group:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const notesResponse = await JWTAxios.post("/note/getnotesbygroup", {
          groupId,
        });
        if (notesResponse.data.success) {
          setNotes(notesResponse.data.notes);
        }
      } catch (error) {
        console.error("Error loading   notes:", error.message);
      } finally {
      }
    };

    if (groupId) {
      fetchNoteData();
    }
  }, [groupId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".note-options-dropdown") &&
        !event.target.closest(".add-note-button")
      ) {
        setShowNoteOptions(false);
      }
      if (
        !event.target.closest(".group-actions-dropdown") &&
        !event.target.closest(".group-actions-button")
      ) {
        setShowGroupActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handlePromoteToEditor = async (memberId) => {
    // Add your promotion logic here
    console.log("Promoting member to editor:", memberId);
  };

  const handleRemoveMember = async (memberId, role) => {
    // Add your removal logic here
    console.log("Removing member:", memberId, "with role:", role);
  };

  const handleUploadFromMachine = () => {
    console.log("Upload from machine clicked");
    setShowNoteOptions(false);
    setNewNote(!newNote);
    // Add your upload from machine logic here
    // You can open a file input dialog or navigate to upload page
  };

  const handleCreateNote = () => {
    console.log("Create note clicked");
    setShowNoteOptions(false);
    setNewNote(true);
  };

  const totalMembers =
    (groupData?.editors?.length || 0) + (groupData?.members?.length || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">
            Loading group data...
          </p>
        </div>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-300 dark:text-slate-600 mb-4">
            <Users size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Group not found
          </h3>
          <p className="text-gray-500 dark:text-slate-400">
            The group you're looking for doesn't exist or you don't have access
            to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" bg-gray-50 dark:bg-slate-900 p-4 md:p-6 ">
        <div className="flex flex-col-reverse lg:flex-row gap-6  max-w-7xl mx-auto ">
          {/* Main Content - Notes Section */}
          <div className="flex-1 lg:w-2/3 ">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 min-h-150 max-h-150 md:min-h-screen md:max-h-screen  relative">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {groupData.name}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                      <span>Admin:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {groupData.admin?.username}
                      </span>
                      <span>•</span>
                      <span>
                        {totalMembers} member{totalMembers !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {groupData.isPrivate ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        <Lock size={14} />
                        Private
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        <Users size={14} />
                        Public
                      </div>
                    )}

                    {/* Group Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowGroupActions(!showGroupActions)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <MoreVertical
                          size={16}
                          className="text-gray-600 dark:text-slate-400"
                        />
                      </button>

                      {showGroupActions && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg py-1 min-w-[160px] z-20">
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600">
                            <Share2 size={14} />
                            Share Group
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {groupData.tags && groupData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {groupData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-md"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Notes Search Bar */}
                <div className="mt-4">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes Content */}
              <div className="p-6">
                {notes.length > 0 ? (
                  <div className="max-h-65 md:max-h-120 overflow-y-auto  color-scrollbar">
                    {" "}
                    {notes.map((note, idx) => (
                      <NoteCard key={idx} note={note} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-300 dark:text-slate-600 mb-6">
                      <Edit3 size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      No notes yet
                    </h3>

                    <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      Start collaborating by creating your first note in this
                      group.
                    </p>
                  </div>
                )}
              </div>
              {accesslevel === "admin" ? (
                <div className="absolute bottom-6 right-6 z-20">
                  <div className="relative">
                    {/* Note Options Dropdown */}
                    {showNoteOptions && (
                      <div className="note-options-dropdown absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg py-2 min-w-[200px]">
                        <button
                          onClick={handleCreateNote}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
                            <FileText
                              size={16}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Create Note</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              Start writing a new note
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={handleUploadFromMachine}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-md">
                            <Upload
                              size={16}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">
                              Upload from Machine
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              Upload documents or files
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Main Add Note Button */}
                    <button
                      onClick={() => setShowNoteOptions(!showNoteOptions)}
                      className={`add-note-button bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group ${
                        showNoteOptions
                          ? "scale-110 bg-blue-700 dark:bg-blue-600"
                          : ""
                      }`}
                    >
                      <Plus
                        size={20}
                        className={`transition-transform duration-200 ${
                          showNoteOptions ? "rotate-45" : ""
                        }`}
                      />
                      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-slate-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {showNoteOptions ? "Close Menu" : "Add Note"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Sidebar - Group Info & Members */}
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
                  <button className="w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Settings size={16} />
                    Change Status
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
                    <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
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
                      accesslevel="text"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-1">
                    {accesslevel === "admin" ? (
                      <button
                        onClick={() => setMemberFilter("all")}
                        className={`px-2 py-1 text-xs rounded ${
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
                        className={`px-2 py-1 text-xs rounded ${
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
                      className={`px-2 py-1 text-xs rounded ${
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
                              {getFilteredMembers("editors").map(
                                (editor, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
                                        <span className="text-orange-800 dark:text-orange-200 text-sm font-medium">
                                          {editor.username
                                            ?.charAt(0)
                                            .toUpperCase()}
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
                                        handleRemoveMember(editor.id, "editor")
                                      }
                                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                                    >
                                      <UserMinus size={16} />
                                    </button>
                                  </div>
                                )
                              )}
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
                              {getFilteredMembers("members").map(
                                (member, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center">
                                        <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                                          {member.username
                                            ?.charAt(0)
                                            .toUpperCase()}
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
                                        onClick={() =>
                                          handlePromoteToEditor(member.id)
                                        }
                                        className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors p-1 text-sm"
                                        title="Promote to Editor"
                                      >
                                        <UserPlus size={16} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRemoveMember(
                                            member.id,
                                            "member"
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                                        title="Remove Member"
                                      >
                                        <UserMinus size={16} />
                                      </button>
                                    </div>
                                  </div>
                                )
                              )}
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
                              onClick={() =>
                                handleRemoveMember(editor.id, "editor")
                              }
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
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
                            <button
                              onClick={() => handlePromoteToEditor(member.id)}
                              className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors p-1 text-sm"
                              title="Promote to Editor"
                            >
                              <UserPlus size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveMember(member.id, "member")
                              }
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                              title="Remove Member"
                            >
                              <UserMinus size={16} />
                            </button>
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
                className="absolute bottom-0 right-5 md:hidden  text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                {expanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {newNote && (
        <Uploadform onClose={() => setNewNote(false)} groupId={groupId} />
      )}
    </>
  );
};

export default Group;

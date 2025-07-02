import { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Lock,
  Edit3,
  Tag,
  Search,
  MoreVertical,
  Share2,
  Upload,
  FileText,
} from "lucide-react";
import NoteCard from "../note/NoteCard";
import { JWTAxios } from "../../api/Axios";

const NoteSection = ({
  groupData,
  groupId,
  accesslevel,
  setNewNote,
  newNote,
}) => {
  const [notesLoading, setNotesLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [showGroupActions, setShowGroupActions] = useState(false);
  const [showNoteOptions, setShowNoteOptions] = useState(false);

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
        setNotesLoading(false);
      }
    };

    if (groupId) {
      fetchNoteData();
    }
  }, [groupId]);

  const handleUploadFromMachine = () => {
    console.log("Upload from machine clicked");
    setShowNoteOptions(false);
    setNewNote(!newNote);
  };

  const handleCreateNote = () => {
    console.log("Create note clicked");
  };

  const totalMembers =
    (groupData?.editors?.length || 0) + (groupData?.members?.length || 0);

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

  return (
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
          {notesLoading ? (
            <div className="max-h-65 md:max-h-120 overflow-y-auto  color-scrollbar">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-slate-400">
                  Loading note data...
                </p>
              </div>
            </div>
          ) : notes.length > 0 ? (
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
                Start collaborating by creating your first note in this group.
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
                      <div className="font-medium">Upload from Machine</div>
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
  );
};

export default NoteSection;

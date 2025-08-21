import React, { useState, useEffect } from "react";
import { Delete, MoreVertical, Tag } from "lucide-react";
import { JWTAxios } from "../../api/Axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteNote } from "../../state/group/Group";

const NoteCard = ({ note, groupId }) => {
  const dispatch = useDispatch();

  const { id, name, description, tags, content, createdBy } = note;

  const [noteOptions, setNoteOptions] = useState(false);

  const deleteItem = async () => {
    const deleteIt = async () => {
      try {
        const result = await JWTAxios.delete("/note/deletenote", {
          data: {
            noteId: id,
            groupId: groupId,
          },
        });

        if (result.data.success) {
          dispatch(deleteNote(result.data.noteId));

          toast.success("Note Deleted.", {
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
          toast.error("Note deleted fail.", {
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

        setNoteOptions(false);
      } catch (error) {
        toast.error("Note deleted fail.", {
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

    toast.success(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this group?</p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              deleteIt();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".note-options-dropdown") &&
        !event.target.closest(".note-options-button") &&
        !event.target.closest(".delete-note-button")
      ) {
        setNoteOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6">
      {/* Note Header */}
      <div className="relative flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-gray-100">
            {name}
          </h2>
          <span className="text-sm text-slate-700 dark:text-slate-300">
            By: {createdBy?.username || "Unknown User"}
          </span>
        </div>

        <button
          onClick={() => setNoteOptions(!noteOptions)}
          className="note-options-button p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <MoreVertical
            size={16}
            className="text-gray-600 dark:text-slate-400"
          />
        </button>

        {noteOptions && (
          <div className="note-options-dropdown absolute right-0 top-5 md:top-7 mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg py-1 min-w-[160px] z-20">
            <button
              onClick={() => {
                console.log("Delete button clicked for note ID:", id);
                deleteItem();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors delete-note-button"
            >
              <Delete size={14} />
              Delete Note
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      {content.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
            Attachments
          </h3>
          {content.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.type}
                </span>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View File
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Empty Content State */}
      {content.length === 0 && (
        <div className="text-center py-6">
          <p className="text-slate-500 dark:text-slate-400">
            No attachments available for this note.
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteCard;

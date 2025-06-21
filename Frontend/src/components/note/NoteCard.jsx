import React from "react";
import { Tag } from "lucide-react";

const NoteCard = ({ note }) => {
  const {
    name = "Untitled Note",
    description = "No description available",
    tags = [],
    content = [],
    createdBy,
  } = note;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6">
      {/* Note Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-gray-100">
          {name}
        </h2>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          By: {createdBy?.username || "Unknown User"}
        </span>
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

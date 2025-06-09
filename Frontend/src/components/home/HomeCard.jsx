import { Search, Users, FileText, Filter } from "lucide-react";

// HomeCard Component
const HomeCard = ({ item }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-slate-700">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          {item.type === "group" ? (
            <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Users size={12} />
              Group
            </div>
          ) : (
            <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <FileText size={12} />
              Note
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {item.name}
        </h3>

        <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-gray-500 dark:text-slate-400 text-xs px-2 py-1">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
          {item.type === "group" ? (
            <span className="flex items-center gap-1">
              <Users size={14} />
              {item.members} members
            </span>
          ) : (
            <span>By {item.author}</span>
          )}
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            View {item.type === "group" ? "Group" : "Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;

import { Users } from "lucide-react";
import Card from "../../components/card/Card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { JWTAxios } from "../../api/Axios";

const EditorGroups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyGroups = async () => {
    setIsLoading(true);
    try {
      const response = await JWTAxios.post("/group/geteditorgroups");

      if (response.data.success) {
        setMyGroups(response.data.data);
      } else {
        toast.error("Failed to load Editor groups", {
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
      console.error("Error fetching groups:", error.message);
      toast.error("Error loading groups", {
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 ">
      <div className="max-w-7xl mx-auto ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center md:items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 p-1">
              Editor Groups
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Manage and create your editor groups
            </p>
          </div>
        </div>

        {/* Groups Count */}
        <div className="mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Total Groups
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myGroups.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-slate-400">
                Loading Editor groups...
              </span>
            </div>
          </div>
        )}

        {/* Groups Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && myGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 dark:text-slate-600 mb-6">
              <Users size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No groups yet
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Join to your first editor group to start collaborating with others
              and sharing knowledge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorGroups;

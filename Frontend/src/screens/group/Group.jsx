import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import useQuery from "../../components/hooks/UseQuery";
import { JWTAxios } from "../../api/Axios";
import Uploadform from "../../components/group/Upload";
import EditGroup from "../../components/group/EditGroup";
import NoteSection from "../../components/group/NoteSection";
import SidebarSection from "../../components/group/SidebarSection";

const Group = () => {
  const query = useQuery();
  const groupId = query.get("id");

  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState(false);
  const [accesslevel, setAccesslevel] = useState("none");
  const [editGroup, setEditGroup] = useState(false);

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

  const handleGroupUpdate = (update) => {
    console.log(update);
    setGroupData((prew) => ({
      ...prew,
      ...update,
    }));
    console.log(groupData);
    setEditGroup(false);
  };

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
          <NoteSection
            groupData={groupData}
            groupId={groupId}
            accesslevel={accesslevel}
            setNewNote={setNewNote}
            newNote={newNote}
          />

          {/* Sidebar - Group Info & Members */}
          <SidebarSection
            groupData={groupData}
            accesslevel={accesslevel}
            setEditGroup={setEditGroup}
            editGroup={editGroup}
          />
        </div>
      </div>

      {newNote && (
        <Uploadform onClose={() => setNewNote(false)} groupId={groupId} />
      )}

      {editGroup && (
        <EditGroup
          groupData={groupData}
          onClose={() => {
            setEditGroup(false);
          }}
          onGroupUpdated={handleGroupUpdate}
        />
      )}
    </>
  );
};

export default Group;

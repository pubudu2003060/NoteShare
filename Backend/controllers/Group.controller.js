import Group from "../models/Group.model.js";

export const searchGroups = async (req, res) => {
  const { keyword } = req.params;

  try {
    let groups;

    if (keyword.trim() === "") {
      groups = await Group.aggregate([{ $sample: { size: 20 } }]);
    } else {
      groups = await Group.find({
        name: { $regex: keyword, $options: "i" },
      }).populate("members", "_id");
    }

    const formattedGroups = groups.map((group) => ({
      id: group._id,
      name: group.name,
      image: group.image || "https://via.placeholder.com/300x200",
      description: group.description,
      tags: group.tags,
      type: "group",
      members: group.members?.length || 0,
    }));

    res.status(200).json({
      success: true,
      message:
        keyword.trim() != ""
          ? "Groups matching your search"
          : "Random 20 groups",
      groups: formattedGroups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while fetching groups",
    });
  }
};

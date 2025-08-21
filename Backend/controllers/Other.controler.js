import Group from "../models/Group.model.js";
import Note from "../models/Note.model.js";
import User from "../models/User.model.js";

export const getAboutSectionData = async (req, res) => {
  try {
    const users = await User.find({});
    const userCount = users.length;

    const notes = await Note.find({});
    const noteCount = notes.length;

    const groups = await Group.find({});
    const groupCount = groups.length;

    if (!users || !notes || !groups) {
      return res
        .status(404)
        .json({ successs: false, message: "Data not found" });
    }

    return res.status(200).json({
      success: true,
      message: "About section data",
      data: { noteCount, groupCount, userCount },
    });
  } catch (error) {
    console.log("Error fetching about section data: ", error);
    res.status(500).json({
      successs: false,
      message: "Error in fetching about section data",
    });
  }
};

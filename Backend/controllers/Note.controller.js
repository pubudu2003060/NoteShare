import Note from "../models/Note.model.js";

export const getRandomTenNotes = async (req, res) => {
  try {
    const randomNotes = await Note.aggregate([{ $sample: { size: 10 } }]);
    req
      .status(200)
      .json({
        success: true,
        message: "succefully get 10 notes",
        notes: randomNotes,
      });
  } catch (error) {
    console.log("Error fetching random 10 notes " + error.message);
    req.status(500).json({
      success: false,
      message: "Error get 10 notes",
    });
  }
};

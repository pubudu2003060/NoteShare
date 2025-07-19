import cloudinary from "../config/Cloudinary.js";

export const deleteGroupImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Delete result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

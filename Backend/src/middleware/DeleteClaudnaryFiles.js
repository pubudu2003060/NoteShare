import cloudinary from "../config/Cloudinary.js";

export const deleteCloudinaryItems = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

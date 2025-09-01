import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./Cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const fileType = file.mimetype.split("/")[0];
    if (fileType === "application") {
      // PDFs or other docs
      return {
        folder: "noteapp_uploads",
        resource_type: "raw",
        public_id: `${file.fieldname}-${Date.now()}`,
      };
    }
    // Images or videos
    return {
      folder: "noteapp_uploads",
      resource_type: "auto",
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|mp4|mkv/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, and videos are allowed!"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export default upload;

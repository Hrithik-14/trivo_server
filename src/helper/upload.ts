import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto";

    if (file.mimetype === "application/pdf") {
      resourceType = "raw";
    }

    return {
      folder: "messenger",
      resource_type: resourceType
    };
  },
});

export const messengerUpload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "audio/mpeg",
      "audio/mp3",
      "video/mp4",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images, pdf, audio (mp3), and video (mp4) are allowed"));
    }
  },
});

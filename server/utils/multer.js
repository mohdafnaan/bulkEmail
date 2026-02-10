import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedExt = [".pdf", ".doc", ".docx"];
const allowedMime = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
         cb(null, uploadDir);
    },
    filename : (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}_${name}${ext}`);
    },
});

const upload = multer({
    storage : storage,
    limits : { fileSize : 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        if (!allowedExt.includes(ext) || !allowedMime.includes(mime)) {
            return cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
        }

        cb(null, true);
    }
});

export default upload;
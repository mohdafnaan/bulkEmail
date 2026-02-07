import multer from "multer";
import path from "path";

const allowedExt = [".pdf", ".doc", ".docx"];
const allowedMime = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];


const upload = multer({
    storage : multer.diskStorage({
        destination : (req, file, cb) => {
             // Use process.cwd() instead of hardcoded path
             // Assuming server runs from 'server' directory, uploads is in cwd/uploads
             // If ran from root, we might need adjustment, but usually backend runs in its own dir.
             // Safest for now is likely process.cwd() if they run 'npm start' from server dir.
             cb(null, path.join(process.cwd(), "uploads"));
        },
        filename : (req,file,cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname,ext);
            const date = Date.now();
            cb(null,`${date}_${name}${ext}`);
        },
    }),
    limits : {fileSize : 5 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        if(!allowedExt.includes(ext) || !allowedMime.includes(mime)){
            return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
        }

        cb(null,true)
    }
})

export default upload ;
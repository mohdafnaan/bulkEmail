import multer from "multer";
import path from "path";

const allowedExt = [".pdf"];
const allowedMime = ["application/pdf"];


const upload = multer({
    storage : multer.diskStorage({
        destination : "/home/afnaan/bulkEmail/server/uploads",
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
            return cb(new Error("only  PDF files are allowed"));
        }

        cb(null,true)
    }
})

export default upload ;
import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/Public");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.filename}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
export default upload

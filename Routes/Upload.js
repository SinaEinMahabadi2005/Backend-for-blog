import { Router } from "express";
import upload from "../Utils/uploadFile.js";
import { deleteFile, uploadCn, uploadMulti } from "../Controllers/UploadCn.js";
const uploadRouter = Router();
uploadRouter
  .route("/")
  .post(upload.single("File"), uploadCn)
  .delete(deleteFile);
  uploadRouter
  .route("/multi")
  .post(upload.array("Files",5), uploadMulti)
  
export default uploadRouter;

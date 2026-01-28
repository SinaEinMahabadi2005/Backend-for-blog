import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./Routes/Auth.js";
import postRouter from "./Routes/Post.js";
import categoryRouter from "./Routes/Category.js";
import commentRouter from "./Routes/Comment.js";
import userRouter from "./Routes/User.js";
import cors from "cors";
import { catchError } from "vanta-api";
import { exportValidationData } from "./Middlewares/ExportValidation.js";
import { searchRouter } from "./Routes/Search.js";
import isAuthor from "./Middlewares/isAuthor.js";
import uploadRouter from "./Routes/Upload.js";
import seedRouter from "./Routes/Seed.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use('/upload',express.static(`${__dirname}/Public`))
app.use(exportValidationData);
app.use("api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/upload-file", uploadRouter);
app.use("/api/seed",seedRouter)
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});
app.use(catchError);
export default app;

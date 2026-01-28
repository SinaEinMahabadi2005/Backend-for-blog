import { Router } from "express";
import isAdmin from "../Middlewares/isAdmin.js";
import {
  changePublish,
  create,
  getAll,
  getAllCommentsPost,
  remove,
  reply,
} from "../Controllers/CommentCn.js";
import isLogin from "../Middlewares/isLogin.js";

const commentRouter = Router();
commentRouter.route("/").get(isAdmin, getAll).post(isLogin, create);
commentRouter
  .route("/:id")
  .get(getAllCommentsPost)
  .patch(isAdmin, changePublish)
  .delete(isAdmin, remove);
commentRouter.route("/reply/:id").post(isAdmin, reply);

export default commentRouter;

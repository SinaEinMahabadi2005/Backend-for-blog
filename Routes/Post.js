import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  like,
  remove,
  update,
} from "../Controllers/PostCn.js";
import isAuthor from "../Middlewares/isAuthor.js";
import isLogin from "../Middlewares/isLogin.js";
const postRouter = Router();
postRouter.route("/").get(getAll).post(isAuthor, create);
postRouter
  .route("/:id")
  .get(getOne)
  .patch(isAuthor, update)
  .delete(isAuthor, remove);
postRouter.route("/like/:id").post(isLogin, like);

export default postRouter;
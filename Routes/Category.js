import { Router } from "express";
import isAdmin from "../Middlewares/isAdmin.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/CategoryCn.js";
const categoryRouter = Router();
categoryRouter.route("/").post(isAdmin, create).get(getAll);
categoryRouter
  .route("/:id")
  .patch(isAdmin, update)
  .get(getOne)
  .delete(isAdmin, remove);

export default categoryRouter;

import { Router } from "express";
import { createAdmin } from "../seed/admin.js";

const seedRouter=Router()
seedRouter.route("/create-admin").post(createAdmin)
export default seedRouter
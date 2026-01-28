import { Router } from "express";
import { search } from "../Controllers/SearchCn.js";
export const searchRouter=Router()
searchRouter.route("/").get(search)
import { Router } from "express";
import { login, register } from "../Controllers/AuthCn.js";
 const authRouter=Router()

authRouter.route('/').post(login)
authRouter.route('/register').post(register)


export default authRouter
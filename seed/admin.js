import { catchAsync, HandleERROR } from "vanta-api";
import User from "../Models/UserMd.js";
import bcryptjs from "bcryptjs";

export const createAdmin = catchAsync(async (req, res, next) => {
  const { password = null } = req.body;
  const users = await User.find();
  if (users.length > 0) {
    return next(new HandleERROR("admin is exist", 400));
  }
  if (!password) {
    return next(new HandleERROR("password is required", 400));
  }
  const hashPassword = bcryptjs.hashSync(password, 10);
  const user = await User.create({
    username: "admin",
    password: hashPassword,
    role: "admin",
  });
  return res.status(200).json({
    success: true,
    message: "admin created successfully",
    data: user,
  });
});

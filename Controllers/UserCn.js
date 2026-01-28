import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Category from "../Models/CategoryMd.js";
import fs from "fs";
import { __dirname } from "../app.js";
import Post from "../Models/PostMd.js";
import User from "../Models/UserMd.js";
import bcryptjs from "bcryptjs";
// Get All Model 2 (With Library)
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
// Get One
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role == "admin" ? { _id: req.params.id } : { _id: req.userId }
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
//Update
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.role != "admin" && req.userId.toString() != id.toString()) {
    return next(new HandleERROR("you don't have permission", 401));
  }
  const user = await findById(id);
  const {
    role = null,
    isActive = null,
    username = null,
    password = null,
  } = req.body;
if(req.role=="admin"){
    user.role=role || user.role
    user.isActive=isActive ||user.isActive
}
user.password=password ? bcryptjs.hashSync(password,10) : user.password
if(username && user.username!=username){
    const existUser=await findOne({username})
    if(existUser){
        return next(new HandleERROR("username is already exist",400))
    }
    user.username=username
}
const newUser=await user.save()
  return res.status(200).json({
    success: true,
    message: "Update User Successfully",
    data: newUser,
  });
});

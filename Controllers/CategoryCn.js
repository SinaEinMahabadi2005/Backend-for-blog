import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Category from "../Models/CategoryMd.js";
import fs from "fs";
import { __dirname } from "../app.js";
import Post from "../Models/PostMd.js";
//Create
export const create = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  return res.status(200).json({
    success: true,
    message: "Create Category Successfully",
    data: category,
  });
});
// Get All Model 1 (Standard)

// export const getAll = catchAsync(async (req, res, next) => {
//   const filter = req?.query?.filter || {};
//   const sort = req?.query?.sort || "-createdAt";
//   const limit = req?.query?.limit || 10;
//   const skip = (req?.query?.page - 1) * limit;
//   const limitFields = req?.query?.limitFields || "";
//   const populate = req?.query?.populate;
//   const customFilter =
//     req.role == "admin" || req.role == "author" ? {} : { isPublished: true };
//   const category = await Category.find({ ...filter, ...customFilter })
//     .sort(sort)
//     .limit(limit)
//     .skip(skip)
//     .select(limitFields)
//     .populate(populate);
//   const count = Category.countDocuments({ ...filter, ...customFilter });
//   return res.status(200).json({
//     success: true,
//     message: "Get Category Successfully",
//     data: category,
//     count,
//   });
// });

// category?filter[price][$gt]=300&filter[price][$lt]=400&sort=createdAt
// Get All Model 2 (With Library)
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "author" ? {} : { isPublished: true }
    )
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
      req.role == "admin" || req.role == "author"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { isPublished: true }] }
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
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(200).json({
    success: true,
    message: "Update Category Successfully",
    data: category,
  });
});
//Remove

export const remove = catchAsync(async (req, res, next) => {
  const {id}=req.params
  const post=await Post.find({categoryId:id})
  if(post.length > 0){
    return next(new HandleERROR("This Category Contain some Post , You Can't delete this category ",400))
  }
  const category = await Category.findByIdAndDelete(id);
  if (category.icon && fs.existsSync(`${__dirname}/Public/${category.icon}`)) {
    fs.unlinkSync(`${__dirname}/Public/${category.icon}`);
  }
  return res.status(200).json({
    success: true,
    message: "Remove Category Successfully",
  });
});

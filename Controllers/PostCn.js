import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Category from "../Models/CategoryMd.js";
import fs from "fs";
import { __dirname } from "../app.js";
import Post from "../Models/PostMd.js";
import User from "../Models/UserMd.js";
import Comment from "../Models/CommentMd.js";
//Create
export const create = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, authorId: req.userId });
  return res.status(201).json({
    success: true,
    message: "Create Post Successfully",
    data: post,
  });
});
// Get All Model 2 (With Library)
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Post, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "author" ? {} : { isPublished: true }
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "categoryId", select: "title" },
      { path: "authorId", select: "username" },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
// Get One
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Post, req.query, req.role)
    .addManualFilters(
      req.role == "admin" || req.role == "author"
        ? { _id: req.params.id }
        : { $and: [{ _id: req.params.id }, { isPublished: true }] }
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "categoryId", select: "title" },
      { path: "authorId", select: "username" },
    ]);
  let like = false;
  if (req.userId) {
    const user = await User.findById(req.userId);
    like = user.postLikeIds.find(
      (postId) => postId.toString() == req.params.id.toString()
    )
      ? true
      : false;
  }
  const result = await features.execute();
  return res.status(200).json({ ...result, like });
});
//Update
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { authorId = null, ...otherData } = req.body;
  const post = await Post.findById(id);
  if (
    req.role != "admin" &&
    req.userId.toString() != post.authorId.toString()
  ) {
    return next(
      new HandleERROR("you don't have permission for update this post", 401)
    );
  }
  const newPost = await Category.findByIdAndUpdate(id, otherData, {
    runValidators: true,
    new: true,
  });
  return res.status(200).json({
    success: true,
    message: "Update Post Successfully",
    data: newPost,
  });
});
//Remove

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.find(id);
  if (
    req.role != "admin" &&
    req.userId.toString() != post.authorId.toString()
  ) {
    return next(
      new HandleERROR("you don't have permission for delete this post", 401)
    );
  }
  await Post.findByIdAndDelete(id);
  await Comment.deleteMany({ postId: id });
  for (let img of post.images) {
    if (img && fs.existsSync(`${__dirname}/Public/${img}`)) {
      fs.unlinkSync(`${__dirname}/Public/${img}`);
    }
  }
  return res.status(200).json({
    success: true,
    message: "Remove Post Successfully",
  });
});
//Like.
export const like = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const user = await User.findById(req.userId);
  let type;
  if (
    user.postLikeIds.find(
      (postId) => postId.toString() == req.params.id.toString()
    )
  ) {
    type = "remove";
    post.likes = post.likes - 1;
    user.postLikeIds.filter(
      (postId) => postId.toString() != req.params.id.toString()
    );
  } else {
    type = "add";
    post.likes = post.likes - 1;
    user.postLikeIds.push(id);
  }
  await user.save();
  await post.save();
  return res.status(200).json({
    success: true,
    message:
      type == "add" ? "you like this post" : " romove your like from this post",
  });
});

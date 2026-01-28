import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Comment from "../Models/CommentMd.js";

export const create = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({
    ...req.body,
    isPublished: false,
    userId: req.userId,
  });
  return res.status(200).json({
    success: true,
    message: "comment create successfully",
    data: comment,
  });
});
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getAllCommentsPost = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role == "admin"
        ? { postId: req.params.id }
        : {
            $ands: [
              { postId: req.params.id },
              { isPublished: true },
              { isReply: false },
            ],
          }
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "username" },
      { path: "replyIds", populate: { path: "userId", select: "username" } },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const changePublish = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  comment.isPublished = !comment.isPublished;
  await comment.save();
  return res.status(200).json({
    success: true,
    message: "comment update successfully",
    data: comment,
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findByIdAndDelete(id);
  for (let i of comment.replyIds) {
    await Comment.findByIdAndDelete(i);
  }
  return res.status(200).json({
    success: true,
    message: "comment Remove successfully",
  });
});
export const reply = catchAsync(async (req, res, next) => {
  const { id: commentId } = req.params;
  const otherData = req.body;
  if (!commentId) {
    return next(new HandleERROR("comment id is required", 400));
  }
  const comment = await Comment.findById(commentId);
  if (comment.isReply) {
    return next(new HandleERROR("you can't reply this comment", 400));
  }
  const replyComment = await Comment.create({
    ...otherData,
    isReply: true,
    userId: req.userId,
  });
  comment.replyIds.push(replyComment._id);
  await comment.save();
  return res.status(200).json({
    success: true,
    message: "reply comment created successfully",
    data: replyComment,
  });
});

import { catchAsync } from "vanta-api";
import Post from "../Models/PostMd.js";
import Category from "../Models/CategoryMd.js";

export const search = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  const posts = await Post.find({ title: { $regex: q, $option: "i" } });
  const categories = await Category.find({
    title: { $regex: q, $option: "i" },
  });
  if(posts?.length==0 && categories?.length==0){
    return res.status(404).json({
        success:false ,
        data:{posts,categories}
    })
  }
  return res.status(200).json({
    success:true ,
    data:{posts,categories}
  })
});
// api/search?q=al
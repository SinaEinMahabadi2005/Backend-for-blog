import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      maxlength: [32, "Max length is 32 Charrcter"],
      minlength: [5, "Min length is 5 character"],
      // validate: {
      //   validator: (x) => {
      //     if (x.length > 5) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   },
      // },
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;

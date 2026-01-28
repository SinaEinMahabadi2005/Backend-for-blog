import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: [true, "title is exsit"],
    },
    icon: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);
export default Category;

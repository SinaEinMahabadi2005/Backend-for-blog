import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username is exsit"],
      required: [true, "Username is required"],
      trim: true,
      // immutale:true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "author"],
      default: "user",
    },
    postLikeIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;

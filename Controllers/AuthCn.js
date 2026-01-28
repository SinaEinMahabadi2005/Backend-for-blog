// import bcrypt from "bcryptjs";
// import User from "../Models/UserMd.js";
// const register = async (req, res, next) => {
//   try {
//     const { username = null, password = null } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and Password are required",
//       });
//     }
//     const passwordRegex = new RegExp(
//       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
//     );
//     const isMatch = passwordRegex.test(password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Password Doesn't Math Format",
//       });
//     }
//     const hashPassword = bcrypt.hashSync(password, 10);
//     const user=await User.create({username,password:hashPassword})
//     return res.status(201).json({
//         success:true ,
//         message:"Register Successfully"
//     })
//   } catch (error) {
//     return res.status(400).json({
//         success:false ,
//         message:error.message
//     })
//   }
// };
// with vanta api
import bcrypt from "bcryptjs";
import User from "../Models/UserMd.js";
import { catchAsync, HandleERROR } from "vanta-api";
import jwt from "jsonwebtoken";
export const register = catchAsync(async (req, res, next) => {
  const { username = null, password = null } = req.body;
  if (!username || !password) {
    return next(new HandleERROR("Username and Password are required", 400));
  }
  const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
  );
  const isMatch = passwordRegex.test(password);
  if (!isMatch) {
    return next(new HandleERROR("Password Doesn't Math Format", 400));
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ username, password: hashPassword });
  return res.status(201).json({
    success: true,
    message: "Register Successfully",
  });
});
//
export const login = catchAsync(async (req, res, next) => {
  const { username = null, password = null } = req.body;
  if (!username || !password) {
    return next(new HandleERROR("Username and Password Are Required", 400));
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next("Username or password incorrect", 400);
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next("Username or password incorrect", 400);
  }
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        username: user.username,
        role: user.role,
        postLikeIds: user.postLikeIds,
      },
    },
  });
});

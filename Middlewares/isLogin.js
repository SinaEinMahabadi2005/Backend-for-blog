import { catchAsync, HandleERROR } from "vanta-api";

const isLogin = catchAsync(
  async(req, res, next) => {
    if (!req.role) {
      return next(new HandleERROR("You Don't have permission"));
    }
    return next();
  })

export default isLogin
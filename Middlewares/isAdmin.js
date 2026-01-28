import { catchAsync, HandleERROR } from "vanta-api";

const isAdmin = catchAsync(async (req, res, next) => {
  if (req.role != "admin") {
    return next(new HandleERROR("You Don't have permission"));
  }
  return next();
});

export default isAdmin;

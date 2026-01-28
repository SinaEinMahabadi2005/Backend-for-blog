import { catchAsync, HandleERROR } from "vanta-api";

const isAuthor = catchAsync(
  async(req, res, next) => {
    if (req.role != "admin" && req.role != "author" ) {
      return next(new HandleERROR("You Don't have permission"));
    }
    return next();
  })

export default isAuthor
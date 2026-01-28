import jwt from "jsonwebtoken";
export const exportValidationData = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const { _id, role } = jwt.verify(token, process.env.JWT_SECRET);
    // Create Key
    req.userId = _id;
    req.role = role;
  } catch (error) {
    req.userId = null;
    req.role = null;
  }
  next();
};

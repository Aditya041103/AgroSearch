import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.id; // Assuming you're using cookies
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = token; // Ensure this is the correct field
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    console.log(error);
  }
};

export default authMiddleware;

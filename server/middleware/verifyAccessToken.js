import { env } from "process";
import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const secretKey = env.ACCESS_TOKEN_SECRET;

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Access Token missing" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "{צריך להיכנס כמנהל למערכת!!!}" });
  }
};

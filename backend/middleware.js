import { JWT_SECRET } from "./config.js";
import jwt from "jsonwebtoken";

/**
 *! Header -
 *! Authorization: Bearer <actual token>
 */

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({message : "authHeader Error"});
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    //! In the given line req.userId = decoded.userId;, the middleware is attaching a new property called userId to the req (request) object.
    next();
  } catch (error) {
    return res.status(403).json({});
  }
};

// export default authMiddleware;

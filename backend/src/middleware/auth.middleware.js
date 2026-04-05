import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils.js";
import { User } from "../schemas/user.schema.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken)
      return res
        .status(401)
        .send({ success: false, message: "Token not found" });

    const user = jwt.verify(authToken, ACCESS_TOKEN_SECRET);

    if (!user)
      return res
        .status(401)
        .send({ success: false, message: "Token is expired" });

    const userr = await User.findById(user?._id);

    if (!userr) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = userr;

    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: error.message });
  }
};

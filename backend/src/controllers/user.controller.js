import { User } from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils.js";
import CookieParser from "cookie-parser";
import { setRefreshTokenCookies } from "../utils/functions.js";
import { Knowledge } from "../schemas/knowledge.schema.js";
import { Section } from "../schemas/section.schema.js";
import { Chatbot } from "../schemas/chatbot.schema.js";
import { Message } from "../schemas/message.schema.js";
import { Conversation } from "../schemas/conversation.schema.js";

export const register = async (req, res) => {
  try {
    if (
      !req.body?.name ||
      !req.body?.email ||
      !req.body?.password ||
      !req.body?.confirmPassword
    )
      return res.send({
        success: false,
        message: "name, email, password and confirmPassword is required",
      });
    const { name, email, password, confirmPassword } = req.body;

    const isExist = await User.findOne({ email });

    if (isExist)
      return res.send({
        success: false,
        message: "User already exist with this email",
      });

    if (password?.length < 8 || confirmPassword.length < 8)
      return res.send({
        success: false,
        message: "Password lenght must be greater or equals to 8",
      });
    const isSame = password === confirmPassword;

    if (!isSame)
      return res.send({
        success: false,
        message: "Password and Confirm password must be same",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = jwt.sign({ _id: newUser?._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const refreshToken = jwt.sign({ _id: newUser?._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    setRefreshTokenCookies(res, refreshToken);

    // TO GET COOKIES USE BELOW CODE BUT THIS MEHTOD IS ONLY USE WHEN cookie-parser MIDDLEWARE IS USED
    // const token = req.cookies.refreshToken;

    return res.send({
      success: true,
      message: "Register success",
      accessToken: accessToken,
      user: {
        _id: newUser?._id,
        name: newUser?.name,
        email: newUser?.email,
      },
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body?.email || !req.body?.password)
      return res.send({
        success: false,
        message: " email and password  is required",
      });

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.send({
        success: false,
        message: "User not exist register to continue",
      });

    const isSame = await bcrypt.compare(password, user.password);

    if (!isSame)
      return res.send({
        success: false,
        message: "Password is wrong",
      });

    const accessToken = jwt.sign({ _id: user?._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const refreshToken = jwt.sign({ _id: user?._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/", // 🔥 add this
    });

    return res.send({
      success: true,
      message: "Login success",
      accessToken: accessToken,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken");

    return res.send({ success: true, message: "Logout success" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res
        .status(401)
        .send({ success: false, message: "refresh token not found" });

    const userr = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ _id: userr?._id });

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "Token is expired or invalid" });
    }

    const accessToken = jwt.sign({ _id: user?._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ success: true, message: "token refreshed", accessToken });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

// checking in middleware
export const isAuthenticated = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user?._id });
    return res.send({
      success: true,
      message: "user is authenticated",
      user: user,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const body = req.body;

    if (!body.password || !body.newPassword) {
      return res.send({
        success: false,
        message: " password and new password is required",
      });
    }

    if (body.newPassword.length < 8)
      return res.send({ success: false, message: "" });

    const user = await User.findOne({ _id: req?.user?._id });

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch)
      return res.send({ success: false, message: "Wrong Password" });

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.send({ success: true, message: "Password is changed" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req?.user?._id });

    const knowledges = await Knowledge.find({
      userId: req?.user?._id,
    });
    const sections = await Section.find({
      userId: req?.user?._id,
    });
    const chatbot = await Chatbot.findOne({ userId: req?.user?._id });
    const recent5Conversations = await Conversation.find({
      chatbotId: chatbot?._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.send({
      success: true,
      message: "Dashboard data fetched",
      user: user,
      knowledges,
      sections,
      chatbot,
      recent5Conversations,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

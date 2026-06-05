import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: "admin",
      enum: ["admin", "member"],
    },
    parentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      immutable: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("user", userSchema);

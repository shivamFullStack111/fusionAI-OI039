import mongoose from "mongoose";

// env variables
const MONGOOSE_URL = process.env.MONGOOSE_URL;

export const connectDB = async () => {
  // db connect
  mongoose
    .connect(MONGOOSE_URL)
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err.message);
    });

  return;
};

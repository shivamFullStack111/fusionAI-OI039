import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversation",
    required:true
  },

  role: {
    type:String,
    enum:['ai','user','support'],  // SUPPORT is for admin and their users responses after ticket is raised
    required:true
  },
  tokens:{
    type:Number,
    // required:true
  },
  content: {
    type: String,
    required:true
  },

},{timestamps:true});

export const Message = mongoose.model("message", messageSchema);

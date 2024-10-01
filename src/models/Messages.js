import mongoose from "mongoose";

export const messageSchemas = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "The message content is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchemas);

export default Message;

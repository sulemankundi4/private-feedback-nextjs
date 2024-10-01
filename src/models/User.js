import mongoose from "mongoose";
import { messageSchemas } from "./Messages";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "The user name is required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
    match: [emailRegex, "Please enter a valid email address"],
  },

  password: {
    type: String,
    required: [true, "The password is required"],
  },

  otpCode: {
    type: String,
    required: [true, "The otp code is required"],
  },

  otpCodeExpiry: {
    type: Date,
    default: Date.now,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  messages: {
    type: [messageSchemas],
    default: [],
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

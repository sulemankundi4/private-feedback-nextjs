import { dbConnection } from "@/lib/dbConnection";
import bcryptjs from "bcryptjs";
import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";
import { NextResponse } from "next/server";
import User from "@/models/User";

export const POST = async (req) => {
  await dbConnection();

  try {
    const { userName, otpCode } = await req.json();

    const decodedUserName = decodeURIComponent(userName);

    const user = await User.findOne({ userName: decodedUserName });

    if (!user) {
      return NextResponse.json({ message: "user not found!", success: false }, { status: 500 });
    }

    const isOtpValid = user.otpCode === otpCode;
    const isOtpExpired = user.otpCodeExpiry > new Date(user.otpCodeExpiry > new Date());

    if (isOtpExpired && isOtpValid) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json({ message: "User verified successfully", success: true }, { status: 200 });
    }

    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP", success: false }, { status: 400 });
    }

    if (!isOtpExpired) {
      return NextResponse.json({ message: "OTP expired", success: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return NextResponse.json({ message: "Error verifying user", success: false }, { status: 500 });
  }
};

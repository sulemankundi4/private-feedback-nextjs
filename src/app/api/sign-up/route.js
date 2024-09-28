import { dbConnection } from "@/lib/dbConnection";
import bcryptjs from "bcryptjs";
import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";
import { NextResponse } from "next/server";
import User from "@/models/User";

export const POST = async (req) => {
  await dbConnection();

  try {
    const { userName, email, password } = await req.json();

    const existingUserVerifiedByUserName = await User.findOne({ userName, isVerified: true });

    if (existingUserVerifiedByUserName) {
      return NextResponse.json({ message: "User name already taken", success: false }, { status: 400 });
    }

    const existingUserByEmail = await User.findOne({ email });

    //six digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json({ message: "Email already taken", success: false }, { status: 400 });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.otpCode = verificationCode;
      existingUserByEmail.otpCodeExpiry = new Date(Date.now() + 3600000);

      await existingUserByEmail.save();
    } else {
      const hashedPassword = await bcryptjs.hash(password, 12);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        otpCode: verificationCode,
        otpCodeExpiry: expiryDate,
      });

      await newUser.save();
    }

    const emailResponce = await SendVerificationEmail({ email, userName, verificationCode });

    if (!emailResponce.success) {
      return NextResponse.json({ message: emailResponce.message, success: false }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully plz verify your email", success: true }, { status: 201 });
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json({ message: "Error registering user", success: false }, { status: 500 });
  }
};

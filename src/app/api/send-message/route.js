import UserModel from "../../../models/User";
import { dbConnection } from "@/lib/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
export const GET = async (req) => {
  await dbConnection();

  const { userName, content } = await req.json();

  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        data: {
          message: "User not found",
        },
      });
    }

    if (!user.isAcceptingMessage) {
      return NextResponse.json({
        status: 400,
        success: false,
        data: {
          message: "User is not accepting messages",
        },
      });
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage);

    await user.save();

    return NextResponse.json({
      status: 200,
      success: true,
      data: {
        message: "Message sent successfully",
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      data: {
        message: "Failed to send message",
      },
    });
  }
};

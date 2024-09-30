import UserModel from "../../../models/User";
import { dbConnection } from "@/lib/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return {
      status: 401,
      success: false,
      data: {
        message: "Unauthorized",
      },
    };
  }

  const userId = user._id;

  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true });
    if (!updatedUser) {
      return NextResponse.json({
        status: 404,
        success: false,
        data: {
          message: "Failed to update user status to accept messages",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      data: {
        message: "Message acceptance status updated successfully!",
      },
      updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user status to accept messages", error);
    return NextResponse.json({
      status: 500,
      success: false,
      data: {
        message: "Failed to update user status to accept messages",
      },
    });
  }
};

export const GET = async (req) => {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return {
      status: 401,
      success: false,
      data: {
        message: "Unauthorized",
      },
    };
  }

  const userId = user._id;

  try {
    const userFound = await UserModel.findById(userId);

    if (!userFound) {
      return NextResponse.json({
        status: 404,
        success: false,
        data: {
          message: "User not found",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      isAcceptingMessages: userFound.isAcceptingMessage,
    });
  } catch (error) {
    console.error("Error in getting status message", error);
    return NextResponse.json({
      status: 500,
      success: false,
      data: {
        message: "Error in getting status message",
      },
    });
  }
};

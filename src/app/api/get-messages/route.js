import UserModel from "../../../models/User";
import { dbConnection } from "@/lib/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

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
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      {
        $unwind: "$messages",
      },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || !user.length) {
      return NextResponse.json({
        status: 404,
        success: false,
        data: {
          message: "No messages found",
        },
      });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      messages: user[0].messages,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      data: {
        message: "Failed to get messages",
      },
    });
  }
};

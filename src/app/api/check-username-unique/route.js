import { dbConnection } from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const userNameQuerySchema = z.object({
  userName: usernameValidation,
});

export const GET = async (req) => {
  await dbConnection();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      userName: searchParams.get("userName"),
    };

    const isUserNameUnique = userNameQuerySchema.safeParse(queryParam);

    console.log("check this", isUserNameUnique);

    if (!isUserNameUnique.success) {
      const userNameErrors = isUserNameUnique.error.format().userName?._errors || [];
      console.log("check this as well plz", userNameErrors);
      return NextResponse.json({ message: userNameErrors, success: false }, { status: 400 });
    }

    const { userName } = isUserNameUnique.data;

    const existingVerifiedUser = await User.findOne({ userName, isVerified: true });
    if (existingVerifiedUser) {
      return NextResponse.json({ message: "User name already taken", success: false }, { status: 400 });
    }

    return NextResponse.json({ message: "User name is available", success: true }, { status: 200 });
  } catch (e) {
    console.error("error checking username", e);
    return NextResponse.json({ message: "Error checking username", success: false }, { status: 500 });
  }
};

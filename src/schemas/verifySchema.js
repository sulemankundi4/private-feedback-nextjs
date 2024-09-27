import { z } from "zod";

export const verifySchema = z.object({
  otpCode: z.string().length(6, { message: "The otp code must be 6 characters long" }),
});

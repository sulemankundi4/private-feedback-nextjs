import { z } from "zod";

export const messageSchema = z.object({
  message: z.string().min(10, { message: "The message must be at least 10 characters long" }).max(300, { message: "The message must be at most 300 characters long" }),
});

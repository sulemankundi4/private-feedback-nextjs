import { z } from "zod";

export const acceptMessagesSchema = z.object({
  isAcceptingMessage: z.boolean(),
});

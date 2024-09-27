import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "The username must be alphanumeric and can contain underscores",
  });

export const signUpSchema = z.object({
  userName: usernameValidation,
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "The password must be at least 6 characters long" })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message: "The password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

try {
  const validData = signUpSchema.parse({
    userName: "test_user",
    email: "test@example.com",
    password: "Password123",
  });
  console.log("Valid data:", validData);
} catch (e) {
  console.error("Validation errors:", e.errors);
}

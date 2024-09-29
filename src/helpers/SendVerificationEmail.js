import VerificationEmail from "../app/components/EmailTemplate.jsx";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const SendVerificationEmail = async ({ email, userName, verificationCode }) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Email",
      react: VerificationEmail({ userName, verificationCode }),
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: error.message };
  }
};

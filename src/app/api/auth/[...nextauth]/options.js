import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { dbConnection } from "@/lib/dbConnection";
import User from "@/models/User";
dbConnection();

export const authOptions = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
        userName: { label: "userName", type: "text" },
      },
      async authorize(credentials) {
        try {
          dbConnection();
          const user = await User.findOne({
            $or: [
              {
                email: credentials.email,
              },
              {
                userName: credentials.userName,
              },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (user.isVerified === false) {
            throw new Error("Please verify your email first");
          }
          const isPasswordCorrect = await bcryptjs.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.userName = user.userName;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session(session, token) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.userName = token.userName;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
});

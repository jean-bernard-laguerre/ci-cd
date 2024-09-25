import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { actions } from "../../../services/userService";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await actions.login(credentials);
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

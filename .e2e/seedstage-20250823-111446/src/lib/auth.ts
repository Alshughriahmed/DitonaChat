import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: (await import("@next-auth/prisma-adapter")).PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      (session as any).user = { ...(session.user || {}), id: user.id };
      return session;
    },
  },
};

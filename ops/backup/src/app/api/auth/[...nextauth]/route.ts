import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// تخزين روابط الدخول مؤقتًا في الذاكرة (Dev Echo)
const g: any = globalThis as any;
if (!g.__MAGIC_STORE) g.__MAGIC_STORE = Object.create(null);
const MAGIC_STORE: Record<string, string> = g.__MAGIC_STORE;

const devEcho = (process.env.EMAIL_DEV_ECHO_LINK === "1") || process.env.NODE_ENV !== "production";

const emailProvider = EmailProvider({
  server: process.env.EMAIL_SERVER, // غير مطلوب في وضع Dev Echo
  from: process.env.EMAIL_FROM || "DitonaChat <info@ditonachat.com>",
  async sendVerificationRequest({ identifier, url, provider }) {
    if (devEcho || !provider.server) {
      console.info("[auth][dev] Magic link for", identifier, url);
      MAGIC_STORE[identifier] = url;
      return;
    }
    // إن تم ضبط SMTP لاحقًا، أضف nodemailer هنا لإرسال الإيميلات فعليًا.
    throw new Error("EMAIL_SERVER not configured. Set EMAIL_SERVER to enable real emails.");
  },
});

const providers: any[] = [emailProvider];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }));
}

export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }: any) {
      if (session?.user) (session.user as any).id = user.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

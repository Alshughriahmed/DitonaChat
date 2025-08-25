import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: { orderBy: { updatedAt: "desc" }, take: 3 },
    } as any
  });

  return NextResponse.json({
    userId,
    email: user?.email ?? null,
    stripeCustomerId: (user as any)?.stripeCustomerId ?? null,
    subscriptions: (user as any)?.subscriptions ?? [],
  });
}

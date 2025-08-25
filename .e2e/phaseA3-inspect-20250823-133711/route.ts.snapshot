import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { peerId } = await req.json();
    if (!peerId || typeof peerId !== "string") {
      return NextResponse.json({ error: "peerId required" }, { status: 400 });
    }

    // هل هناك لايك سابق؟
    const existing = await prisma.like.findUnique({
      where: { fromId_toId: { fromId: session.user.id, toId: peerId } },
    });

    let liked: boolean;
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.like.create({
        data: { fromId: session.user.id, toId: peerId },
      });
      liked = true;
    }

    // العدّ الإجمالي لطرف peerId
    const total = await prisma.like.count({ where: { toId: peerId } });

    // اختياري: مزامنة Profile.likes (لو موجود)
    await prisma.profile.updateMany({
      where: { userId: peerId },
      data: { likes: total },
    });

    return NextResponse.json({ ok: true, liked, total });
  } catch (e) {
    console.error("likes/toggle error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

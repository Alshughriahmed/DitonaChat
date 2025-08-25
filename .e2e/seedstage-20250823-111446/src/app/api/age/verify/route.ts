import { NextResponse } from "next/server";

function computeAge(dob: Date) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export async function POST(req: Request) {
  try {
    const { birthDate, gender, consent } = await req.json();

    if (!consent) {
      return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 400 });
    }

    // تحقق أساسي من تاريخ الميلاد
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) {
      return NextResponse.json({ error: "INVALID_DOB" }, { status: 400 });
    }

    const age = computeAge(dob);
    if (age < 18) {
      return NextResponse.json({ error: "UNDER_18" }, { status: 400 });
    }

    // ✅ MVP: بدون DB الآن. لاحقًا نُسجل birthYear/consentAt على الخادم.
    const maxAge = 30 * 24 * 3600; // 30 يومًا
    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: "ageok",
      value: "1",
      path: "/",
      maxAge,
      sameSite: "lax",
      httpOnly: false, // اجعله true إذا لا تحتاج قراءته في العميل
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }
}

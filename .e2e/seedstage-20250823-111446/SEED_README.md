# DitonaChat — Seed Pack (شرح سريع)

هذه الحزمة تحتوي **كل ما يحتاجه مساعد جديد** لفهم المشروع وتشغيله محليًا (بدون الاعتماد على منتجات ضخمة أو أصول كبيرة).

## ما داخل الحزمة
- **src/**: كل السورس بما فيه:
  - `app/chat/*` شاشة المحادثة (Stage علوي/سفلي، الرسائل كـ Dock شفاف، الـComposer، وشريط الأدوات)
  - `components/chat/*` (Toolbar الذكي، ChatMessages، ChatComposer، PeerHeader، LowerRightQuick)
  - `app/api/*` (مسارات API الأساسية: join, turn, subscription, health, الخ…)
- **public/**: أصول خفيفة الاستخدام
- **package.json / pnpm-lock.yaml**: التبعيات
- **tailwind.config.js / postcss.config.js / tsconfig.json**: التهيئات
- **src/middleware.ts** (إن وُجد): توجيه بسيط (مثل gate)

## تشغيل محليًا
> Node 18 مدعوم بشكل ممتاز. إن كنت على Node أحدث، شغّل كما هو (Next 14 يعمل في التطوير).
```bash
pnpm i
pnpm dev -p 3001
# افتح http://localhost:3001/chat


md

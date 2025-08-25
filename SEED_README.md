# DitonaChat — Seed README

## 1) نظرة عامة
- **الإطار**: Next.js 14 (App Router) + React 18 + Tailwind (Plugin: `@tailwindcss/postcss`) + TypeScript.
- **الهدف**: واجهة فيديو/نص للجوال أولاً. الشاشة الأساسية تبقى مرئية دائمًا، مع:
  - **Toolbar** ثابت بالأسفل (ذكي/مرن).
  - **Composer** (شريط كتابة) يظهر/يختفي عند الطلب.
  - **Message Dock** شفاف يعرض آخر 2–3 رسائل (ويوفّر سجل عند السحب للأعلى).
- **طبقات الواجهة (z-index)**: Stage(z-0) < Messages(z-10) < Composer(z-20) < Toolbar(z-30).
- **متغيّرات CSS**: `--tb-h`, `--safe-b`, `--kb-pad` لضبط المسافات مع الـ safe-area ولوحة المفاتيح.

## 2) شجرة الملفات المهمة (مقتطفات)


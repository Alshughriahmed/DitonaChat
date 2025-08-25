import type { ReactNode } from "react";
import HeaderLite from "@/components/HeaderLite";

export const dynamic = "force-static";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderLite />
      {children}
    </>
  );
}

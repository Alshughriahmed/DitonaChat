import type { ReactNode } from "react";
import SafelistSSR from "@/app/SafelistSSR";

export default function ChatTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <SafelistSSR />
      {children}
    </>
  );
}

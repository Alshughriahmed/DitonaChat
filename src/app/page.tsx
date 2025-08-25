export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
import type { Viewport } from 'next';
import { redirect } from "next/navigation";
export default function Index(){ redirect("/home"); }

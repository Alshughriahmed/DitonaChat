import ClientShell from "./ClientShell";
import "./globals.css";
import type { Metadata, Viewport } from 'next';
import React from 'react';

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export const metadata: Metadata = {};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* SSR markers (no visual impact) */}<ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

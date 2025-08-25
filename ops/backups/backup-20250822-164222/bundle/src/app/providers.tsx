'use client';
import { makeSocket, type SocketT } from '@/utils/socket';
// src/app/providers.tsx

import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

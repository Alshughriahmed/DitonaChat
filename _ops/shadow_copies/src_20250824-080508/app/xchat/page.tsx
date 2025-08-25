
import NextDynamic from 'next/dynamic';

const ClientOnly = NextDynamic(() => import('./page.client'), { ssr: false });

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default function XChatPage() {
  return <ClientOnly />;
}

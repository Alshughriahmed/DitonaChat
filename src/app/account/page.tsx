export const dynamic = 'force-dynamic'; // لا تُولّد ستاتيك أثناء build
export const revalidate = 0;

export default function AccountPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-8 text-white bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="opacity-80 text-sm">
          Your account area will be here after launch. (Build-safe stub)
        </p>
      </div>
    </main>
  );
}

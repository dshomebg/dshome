import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Само за страниците извън /login
  const isLoginPage = false; // Винаги показвай layout за тест

  if (!session?.user && !isLoginPage) {
    redirect('/login');
  }

  // Ако е login страница, покажи само children
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header user={session?.user || { name: 'Guest' }} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

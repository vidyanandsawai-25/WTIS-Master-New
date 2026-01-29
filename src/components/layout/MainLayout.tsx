import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { SessionWatcher } from './SessionWatcher';
import { masterService } from '@/services/master.service';
import { cookies } from 'next/headers';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component that wraps all pages
 * Provides consistent header and sidebar across the application
 */
export async function MainLayout({ children }: MainLayoutProps) {
  let ulbData = undefined;
  try {
    const ulbResponse = await masterService.getActiveUlbs();
    if (ulbResponse.success && ulbResponse.data && ulbResponse.data.length > 0) {
      ulbData = ulbResponse.data[0];
    }
  } catch (error) {

  }

  const cookieStore = await cookies();
  const userName = cookieStore.get('user_name')?.value;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <SessionWatcher />
      <Header ulbData={ulbData} username={userName} />
      <Sidebar />
      <main className="flex-1 transition-all duration-300 pt-20 lg:pl-20 flex flex-col">
        <div className="flex-1 w-full px-3 py-3 md:px-4">
          {children}
        </div>
        <Footer ulbData={ulbData} />
      </main>
    </div>
  );
}

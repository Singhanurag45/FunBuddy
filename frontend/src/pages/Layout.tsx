import { Outlet } from 'react-router-dom';
import { MemoizedMobileBottomNav, MemoizedSidebar } from '../components/Sidebar';

export function Layout() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-800">
      <MemoizedSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto pb-24 lg:pb-10">
        <div className="max-w-7xl mx-auto mt-1 md:mt-6">
          <Outlet />
        </div>
      </main>
      <MemoizedMobileBottomNav />
    </div>
  );
}

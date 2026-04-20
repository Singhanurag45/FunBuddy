import { Outlet } from 'react-router-dom';
import { MemoizedSidebar } from '../components/Sidebar';

export function Layout() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-800">
      <MemoizedSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto mt-2 md:mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

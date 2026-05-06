import { Outlet } from "react-router-dom";
import {
  MemoizedMobileBottomNav,
  MemoizedSidebar,
} from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <MemoizedSidebar />
      <main className="flex min-h-screen flex-1 flex-col pb-24 lg:pb-10">
        <Navbar variant="dashboard" />
        <div className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-7xl mx-auto mt-1 md:mt-3">
            <Outlet />
          </div>
        </div>
      </main>
      <MemoizedMobileBottomNav />
    </div>
  );
}

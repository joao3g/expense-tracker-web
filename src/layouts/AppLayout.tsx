import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 ml-70 px-36 py-8">
        <Outlet />
      </main>
    </div>
  )
}
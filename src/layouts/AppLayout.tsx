import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex bg-neutral-200 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-90 mt-20 px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}
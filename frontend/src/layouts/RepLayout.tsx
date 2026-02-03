import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

export default function RepLayout() {
  return (
    <div className="min-h-screen bg-carbon flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

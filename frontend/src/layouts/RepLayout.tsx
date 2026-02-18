import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import ChatBubble from "../components/chat/ChatBubble";

const MARKETPLACE_PATHS = ["/rep/offers", "/rep/applications"];

export default function RepLayout() {
  const { pathname } = useLocation();
  const isMarketplace = MARKETPLACE_PATHS.some((p) => pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-carbon flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      {isMarketplace && <ChatBubble context="marketplace" />}
    </div>
  );
}

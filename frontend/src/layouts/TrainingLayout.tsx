import { Outlet } from "react-router-dom";
import ChatBubble from "../components/chat/ChatBubble";

export default function TrainingLayout() {
  return (
    <>
      <Outlet />
      <ChatBubble context="training" />
    </>
  );
}

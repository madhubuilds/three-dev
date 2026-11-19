import { useState, useRef } from "react"; 
import { WorldCanvas } from "./scene/WorldCanvas";
import { HUD } from "./ui/HUD";

function App() {
  const [animation, setAnimation] = useState("idle");
  const [colors, setColors] = useState({
    skin: "#FFE600",
    hair: "#080808",
    shirt: "#FF5A1F",
    pants: "#17233F",
  });

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const timerRef = useRef(null);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessage(chatInput.trim());
    setChatInput("");

    // Auto-hide chat bubble after 4 seconds
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setChatMessage(""), 4000);
  };
  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden">
      <WorldCanvas />
      <HUD />
    </main>
  );
}

export default App;

import { useState, useRef } from "react";  
import { Route, Routes } from "react-router-dom";
import { WorldPage } from "./pages/WorldPage";
import { AvatarStudioPage } from "./pages/AvatarStudioPage";

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
      <Routes>
        <Route path="/" element={<WorldPage />} />
        <Route path="/avatar" element={<AvatarStudioPage />} />
      </Routes> 
  );
}

export default App;

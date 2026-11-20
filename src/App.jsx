import { Route, Routes } from "react-router-dom";
import { WorldPage } from "./pages/WorldPage";
import { PlazaPage } from "./pages/PlazaPage";
import { AvatarStudioPage } from "./pages/AvatarStudioPage";
import { SceneTransition } from "./ui/navigation/SceneTransition";

function App() {
  return (
    <>
      <SceneTransition />

      <Routes>
        <Route path="/" element={<WorldPage />} />
        <Route path="/plaza" element={<PlazaPage />} />
        <Route path="/avatar" element={<AvatarStudioPage />} />
      </Routes>
    </>
  );
}

export default App;

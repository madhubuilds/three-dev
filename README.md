# 🏠✨ 3D Social Room & Plaza (`three-dev`)

> **A mobile-first, miniature 3D virtual social space** built with React Three Fiber—blending cozy diorama aesthetics, **Blocky & Low-Poly** customizable rooms, expressive 360° avatars, tap-to-walk navigation, and open social hangouts right in the browser.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-FF5A1F?style=for-the-badge&logo=github)](https://madhubuilds.github.io/three-dev/)
[![React](https://img.shields.io/badge/React-19-17233F?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F_%2B_Drei-080808?style=for-the-badge&logo=threedotjs&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand_%2B_Persist-FFE600?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

---

## 💡 The Core Idea

Most social apps reduce people to flat profile cards and static grids. **This project reimagines social profiles as living, playable 3D spaces:**

1. **Your Room is Your Profile (`/`):** Instead of just reading a bio, visitors step into a miniature diorama room you decorated yourself—complete with a live **3D Wall Bio Board**, mood lighting themes, and a mix-and-match catalog of **Blocky** and **Low-Poly** furniture.
2. **Your Avatar is Your Presence (`/avatar`):** Express your vibe with a 360° customizable character, live status badges, poses, and floating speech bubbles.
3. **The Plaza is Your Community (`/plaza`):** Step outside your room into a sun-lit courtyard designed for casual discovery, waving at neighbours, and real-time social hangouts.

---

## 🎨 How the Product Looks & Feels

- **Dual 3D Art Styles (`Blocky` + `Low-Poly`):** Mix nostalgic voxel-inspired pieces (`Cozy Sofa`, `Mini Arcade`, `Neon Cube`) with faceted clay-style procedural geometry (`Cloud Lounger`, `Faceted Monstera`, `Sculpted Bonsai`, `Crystal Prism Lamp`, `Compact DJ Deck`).
- **Warm Clay Diorama Rendering:** Powered by `ACESFilmicToneMapping`, hemisphere sky-to-ground bounce lighting, procedural studio `<Lightformer>` reflections, warm espresso `<ContactShadows>`, and glowing emissive accents (`toneMapped={false}`).
- **Frosted Tactile Minimal HUD:** Translucent glassmorphic pills (`backdrop-blur-md`), soft rounded corners, `lucide-react` icons, and a warm **Coral Orange (`#FF5A1F`) + Deep Navy (`#17233F`)** palette with smooth frosted route transitions.
- **Mobile-First Controls & Viewport Lock:** Browser scroll and rubber-band bounce are locked at the viewport root (`100dvh`), combining **Tap-to-Walk** floor navigation with a conflict-free bottom-left thumbstick and floating bottom dock.

---

## 🚀 Implemented Features

### 🏠 1. Interactive Profile Room (`/`)

- **3 Switchable Room Vibes:** Instant theme switching between **Cozy** (warm walnut & terracotta), **Studio** (clean gallery white), and **Midnight** (deep slate & glowing neon).
- **Live 3D Wall Bio Board:** Dynamically renders your `@username`, live status indicator (`Online`, `Chilling`, `Building`, `AFK`), and wrapped bio directly onto a framed 3D wall plaque using `THREE.CanvasTexture`.
- **18-Item Blocky & Low-Poly Decor Catalog:** Filter by style (`All`, `Blocky`, `Low-Poly`) across **Sofas**, **Plants**, **Lamps**, and **Tables**. Includes screen-aligned directional nudge controls, **90° rotation**, automatic wall/floor bounds clamping, and live AABB collision registration.
- **Auto-Snapshot 3D Inventory Previews:** A one-shot offscreen WebGL stage renders every procedural 3D item into a transparent `160×160` PNG thumbnail on first open and immediately disposes its context—delivering real 3D previews with zero ongoing GPU overhead.

### 🌳 2. Open Courtyard Plaza (`/plaza`)

- **Dedicated Outdoor Route:** A sun-lit stone-and-turf courtyard with low diorama curbs, perimeter trees, glowing lanterns, a central gathering circle, and a frosted route transition curtain.
- **Interactive NPCs (`Aarav` & `Diya`):** Proximity-aware characters that smoothly turn toward you, wave, pop speech bubbles, and open stepped conversation cards with a **Wave Back** emote response.

### 🧑🎨 3. 360° Avatar Studio (`/avatar`)

- **Full Character Customization:** Edit your `@username`, preview poses (`Idle`, `Walk`, `Wave`), pick custom colours (`Skin`, `Hair`, `Shirt`, `Pants`), and mix-and-match **7 accessory & facial slots** (`Hair`, `Hats`, `Glasses`, `Eyes`, `Nose`, `Mouth`, `Mustache`).

### 🎥 4. Navigation, Cameras & 60fps Engine

- **Tap-to-Walk Floor Navigation:** Tap anywhere on the room or plaza floor to spawn a pulsing destination ring and walk smoothly around obstacles, with instant override when using the joystick or `WASD` keys.
- **3 Live Camera Modes:** Switch on the fly from the top header between **Iso** (locked 45° orthographic diorama), **3D** (perspective `OrbitControls` to tilt and inspect angles), and **Follow** (close-up third-person camera), with camera-aligned movement in every view.
- **60fps Zero-Rerender Architecture & Persistence:** Joystick input, walk targets, avatar coordinates, and AABB colliders run through mutable bridges outside React's render cycle, while permanent profile and room layouts persist automatically in `localStorage`.

---

## 🗂️ Project Structure

```text
src/
├── data/
│   └── roomCatalog.js                  # 18 Blocky & Low-Poly items, dimensions & extents
├── pages/
│   ├── WorldPage.jsx                   # Route: /       (Indoor Profile Room)
│   ├── PlazaPage.jsx                   # Route: /plaza  (Outdoor Courtyard & NPCs)
│   └── AvatarStudioPage.jsx            # Route: /avatar (360° Character Customizer)
├── scene/
│   ├── WorldCanvas.jsx                 # Room R3F Canvas + ACES tone mapping + shadows
│   ├── PlazaCanvas.jsx                 # Plaza R3F Canvas + NPCs + Tap-to-Walk
│   ├── avatar/
│   │   ├── PlayerController.jsx        # Camera-aligned & tap-to-walk movement + AABB collision
│   │   ├── PlazaNPC.jsx                # Proximity detection, smooth rotation & dialogue triggers
│   │   └── RobloxAvatar.jsx            # Modular 3D character mesh & animations
│   ├── environment/
│   │   ├── IsometricCameraRig.jsx      # Hot-swappable Iso / 3D Orbit / Follow camera controller
│   │   ├── TapToWalkFloor.jsx          # Floor raycast catcher & pulsing destination marker
│   │   ├── SceneLighting.jsx           # Hemisphere, directional sun & Lightformer studio bounce
│   │   ├── ProfileRoom.jsx             # Floor seams, rug, curtains & themed walls
│   │   └── OpenPlaza.jsx               # Courtyard slab, stone circle, trees & lanterns
│   ├── hooks/
│   │   ├── useCollider.js              # Dynamic AABB obstacle registration
│   │   └── SpringPopIn.jsx             # Elastic scale-in animation wrapper
│   └── props/
│       ├── LowPolyAssets.jsx           # 8 procedural faceted low-poly models (flatShading)
│       ├── RoomFurniture.jsx           # 10 blocky furniture models + low-poly dispatcher
│       ├── WallBioBoard.jsx            # Live CanvasTexture @username & bio wall plaque
│       ├── WallDecor.jsx               # Floating shelves, digital clock & neon cloud signs
│       ├── ProfileDesk.jsx             # Interactive desk with glowing dome lamp
│       └── HangoutBench.jsx            # Interactive seating prop
├── store/
│   └── useAvatarStore.js               # Zustand store with localStorage persistence + 60fps bridges
└── ui/
    ├── HUD.jsx                         # Overlay orchestrator
    ├── navigation/
    │   ├── TopNav.jsx                  # Profile pill, Iso/3D/Follow switcher, Decor & Quick Chat
    │   ├── BottomNav.jsx               # Floating glassmorphic Room / Plaza / Avatar dock
    │   └── SceneTransition.jsx         # Frosted route transition curtain
    ├── controls/
    │   └── Joystick.jsx                # Mobile-first touch thumbstick
    ├── decor/
    │   ├── RoomDecorDrawer.jsx         # Blocky/Low-Poly filter, category tabs & 3D thumbnails
    │   └── FurnitureThumbnailGenerator.jsx # One-shot offscreen WebGL PNG snapshotter
    ├── interactions/
    │   └── InteractionPrompt.jsx       # Contextual action pills, NPC dialogue & Profile modal
    └── avatar/
        └── AvatarCustomizerPanel.jsx     # Tabbed studio UI for outfit, face & colours
```

---

## 📍 Current Stage & Future Roadmap

We have completed **Phase 1, Phase 2 & Phase 3**—a full, persistent single-player frontend MVP featuring dual **Blocky & Low-Poly** 3D asset collections, auto-generated 3D inventory thumbnails, multi-angle cameras, tap-to-walk navigation, and interactive NPCs.

| Phase       | Milestone                                          |   Status   | Details                                                                                                                  |
| :---------- | :------------------------------------------------- | :--------: | :----------------------------------------------------------------------------------------------------------------------- |
| **Phase 1** | **3D Engine & Avatar Core**                        |  ✅ Done   | R3F setup, modular avatar builder, 60fps AABB collision, and mobile joystick                                             |
| **Phase 2** | **Diorama Lighting, Decor & Plaza**                |  ✅ Done   | ACES Filmic lighting, 3-mode camera switcher, 3D Bio Board, `/plaza` NPCs, Frosted UI & `localStorage`                   |
| **Phase 3** | **Low-Poly Collection, Thumbnails & Tap-to-Walk**  |  ✅ Done   | 8 faceted low-poly assets, style filter, one-shot WebGL PNG thumbnails, scene transitions & tap-to-walk                  |
| **Phase 4** | **Playable Furniture, Quick Emotes & Share Links** |  🔜 Next   | Sit-on-sofa/bench animations, playable Mini Arcade modal, HUD emote bar, and `?visit=` URL sharing                       |
| **Phase 5** | **Real-Time Multiplayer & Social**                 | 🔮 Planned | WebSocket / PartyKit room sync so friends can visit your room, see live chat bubbles, and hang out in the Plaza together |

---

## 🛠️ Run Locally & Deploy

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build and deploy to GitHub Pages
npm run deploy
```

# 🏠✨ 3D Social Room & Plaza (`three-dev`)

> **A mobile-first, miniature 3D virtual social space** built with React Three Fiber—blending cozy diorama aesthetics, customizable personal rooms, expressive avatars, and open social hangouts right in the browser.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-FF5A1F?style=for-the-badge&logo=github)](https://madhubuilds.github.io/three-dev/)
[![React](https://img.shields.io/badge/React-19-17233F?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F_%2B_Drei-080808?style=for-the-badge&logo=threedotjs&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand_%2B_Persist-FFE600?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

---

## 💡 The Core Idea

Most social apps reduce people to flat profile cards and static grids. **This project reimagines social profiles as living, playable 3D spaces:**

1. **Your Room is Your Profile (`/`):** Instead of just reading a bio, visitors step into a warm, miniature diorama room you decorated yourself—complete with a live **3D Wall Bio Board**, mood lighting themes, and interactive furniture.
2. **Your Avatar is Your Presence (`/avatar`):** Express your vibe with a 360° customizable character, live status badges, poses, and floating speech bubbles.
3. **The Plaza is Your Community (`/plaza`):** Step outside your room into an open courtyard designed for casual discovery, waving at neighbours, and real-time social hangouts.

---

## 🎨 How the Product Looks & Feels

* **Warm Clay Diorama Rendering:** Powered by `ACESFilmicToneMapping`, hemisphere sky-to-ground bounce lighting, procedural studio `<Lightformer>` reflections, warm espresso `<ContactShadows>`, and glowing emissive accents (`toneMapped={false}`) like neon cloud signs, dome lamps, and arcade screens.
* **Frosted Tactile Minimal HUD:** Translucent glassmorphic pills (`backdrop-blur-md`), soft rounded corners, `lucide-react` icons, and a warm **Coral Orange (`#FF5A1F`) + Deep Navy (`#17233F`)** palette that keeps the 3D canvas front and centre.
* **Mobile-First Thumb Ergonomics:** Conflict-free bottom-left virtual joystick, bottom-right contextual action pills, and a floating bottom navigation dock built for effortless one-handed mobile play as well as desktop `WASD` controls.

---

## 🚀 Implemented Features

### 🏠 1. Interactive Profile Room (`/`)
* **3 Switchable Room Vibes:** Instant theme switching between **Cozy** (warm walnut & terracotta), **Studio** (clean gallery white), and **Midnight** (deep slate & glowing neon).
* **Live 3D Wall Bio Board:** Dynamically renders your `@username`, live status indicator (`Online`, `Chilling`, `Building`, `AFK`), and wrapped bio directly onto a framed 3D wall plaque using `THREE.CanvasTexture`.
* **Tabbed Room Decor Inventory:** Place variants across **Sofas**, **Plants**, **Lamps**, and **Tables**. Includes screen-aligned directional nudge controls, **90° rotation**, and automatic wall/floor bounds clamping with AABB collision registration.
* **Interactive Props:** Walk up to your **Profile Desk** or **Hangout Bench** to trigger contextual interaction cards.

### 🌳 2. Open Courtyard Plaza (`/plaza`)
* **Dedicated Outdoor Route:** A sun-lit stone-and-turf courtyard with low diorama curbs, perimeter trees, glowing lanterns, and a central gathering circle.
* **Interactive NPCs (`Aarav` & `Diya`):** Proximity-aware characters that smoothly turn toward you, wave, pop speech bubbles, and open stepped conversation cards with a **Wave Back** emote response.

### 🧑🎨 3. 360° Avatar Studio (`/avatar`)
* **Full Character Customization:** Edit your `@username`, preview poses (`Idle`, `Walk`, `Wave`), pick custom colours (`Skin`, `Hair`, `Shirt`, `Pants`), and mix-and-match **7 accessory & facial slots** (`Hair`, `Hats`, `Glasses`, `Eyes`, `Nose`, `Mouth`, `Mustache`).

### 🎥 4. Multi-Angle Camera & Movement System
* **3 Live Camera Modes:** Switch on the fly from the top header between **Iso** (locked 45° orthographic diorama with bounded pan & zoom), **3D** (perspective `OrbitControls` to tilt and inspect angles), and **Follow** (close-up third-person camera).
* **Camera-Relative Controls:** Movement vectors automatically align with the active camera orientation so `Up / W` always walks forward on screen.
* **60fps Zero-Rerender Architecture:** Joystick input, avatar coordinates, and AABB colliders run through mutable bridges outside React's render cycle, while permanent preferences persist automatically via `localStorage`.

---

## 🗂️ Project Structure

```text
src/
├── data/
│   └── roomCatalog.js              # Furniture dimensions, scale multipliers & categories
├── pages/
│   ├── WorldPage.jsx               # Route: /       (Indoor Profile Room)
│   ├── PlazaPage.jsx               # Route: /plaza  (Outdoor Courtyard & NPCs)
│   └── AvatarStudioPage.jsx        # Route: /avatar (360° Character Customizer)
├── scene/
│   ├── WorldCanvas.jsx             # Room R3F Canvas + ACES tone mapping + shadows
│   ├── PlazaCanvas.jsx             # Plaza R3F Canvas + NPCs
│   ├── avatar/
│   │   ├── PlayerController.jsx    # Camera-aligned movement & AABB collision checks
│   │   ├── PlazaNPC.jsx            # Proximity detection, smooth rotation & dialogue triggers
│   │   └── RobloxAvatar.jsx        # Modular 3D character mesh & animations
│   ├── environment/
│   │   ├── IsometricCameraRig.jsx  # Hot-swappable Iso / 3D Orbit / Follow camera controller
│   │   ├── SceneLighting.jsx       # Hemisphere, directional sun & Lightformer studio bounce
│   │   ├── ProfileRoom.jsx         # Floor seams, rug, curtains & themed walls
│   │   └── OpenPlaza.jsx           # Courtyard slab, stone circle, trees & lanterns
│   └── props/
│       ├── WallBioBoard.jsx        # Live CanvasTexture @username & bio wall plaque
│       ├── RoomFurniture.jsx       # Modular sofas, plants, emissive lamps & arcade meshes
│       ├── WallDecor.jsx           # Floating shelves, digital clock & neon cloud signs
│       ├── ProfileDesk.jsx         # Interactive desk with glowing dome lamp
│       └── HangoutBench.jsx        # Interactive seating prop
├── store/
│   └── useAvatarStore.js           # Zustand store with localStorage persistence + 60fps bridges
└── ui/
    ├── HUD.jsx                     # Overlay orchestrator
    ├── navigation/
    │   ├── TopNav.jsx              # Profile pill, Iso/3D/Follow switcher, Decor & Quick Chat
    │   └── BottomNav.jsx           # Floating glassmorphic Room / Plaza / Avatar dock
    ├── controls/
    │   └── Joystick.jsx            # Mobile-first touch thumbstick
    ├── decor/
    │   └── RoomDecorDrawer.jsx     # Tabbed furniture catalog & move/rotate controls
    ├── interactions/
    │   └── InteractionPrompt.jsx   # Contextual action pills, NPC dialogue & Profile modal
    └── avatar/
        └── AvatarCustomizerPanel.jsx # Tabbed studio UI for outfit, face & colours
```

---

## 📍 Current Stage & Future Roadmap

We have completed **Phase 1 & Phase 2**—a full, persistent single-player frontend MVP with custom 3D environments, room decoration, multi-angle cameras, and interactive NPCs.

| Phase | Milestone | Status | Details |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **3D Engine & Avatar Core** | ✅ Done | R3F setup, modular avatar builder, 60fps AABB collision, and mobile joystick |
| **Phase 2** | **Diorama Lighting, Decor & Plaza** | ✅ Done | ACES Filmic lighting, 3-mode camera switcher, room decor inventory, 3D Bio Board, `/plaza` NPCs, Frosted UI & `localStorage` |
| **Phase 3** | **Interactive Mini-Activities & Audio** | 🔜 Next | Playable Mini Arcade popups, sit-on-bench animations, and synthesized Web Audio footsteps & placement chimes |
| **Phase 4** | **Real-Time Multiplayer & Social** | 🔮 Planned | WebSocket / PartyKit room sync so friends can visit your room, see live chat bubbles, and hang out in the Plaza together |

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
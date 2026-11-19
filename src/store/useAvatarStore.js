import { create } from "zustand";

export const useAvatarStore = create((set) => ({
  username: "you",
  animation: "idle",
  chatMessage: "",
  colors: {
    skin: "#FFE600",
    hair: "#080808",
    shirt: "#FF5A1F",
    pants: "#17233F",
  },
  accessories: {
    hair: "classic", // none | classic | spiky | mohawk | bob | afro
    hat: "none", // none | cap | beanie | tophat | crown
    glasses: "none", // none | shades | visor
    eyes: "classic", // classic | happy | angry | cyber
    nose: "button", // none | button | blocky | long | round
    mouth: "smile", // smile | neutral | open | smirk
    mustache: "none", // none | classic | handlebar | walrus | goatee
  },

  setAccessory: (slot, value) =>
    set((state) => ({
      accessories: { ...state.accessories, [slot]: value },
    })),
  // Interaction state
  nearbyProp: null, // Pop-up button when standing close
  activeProp: null, // Full modal when user taps the button
  setUsername: (username) => set({ username }),
  setAnimation: (animation) => set({ animation }),
  setColor: (part, value) =>
    set((state) => ({
      colors: { ...state.colors, [part]: value },
    })),
  setChatMessage: (chatMessage) => set({ chatMessage }),
  setNearbyProp: (nearbyProp) => set({ nearbyProp }),
  setActiveProp: (activeProp) => set({ activeProp }),
}));

// Non-reactive 60fps bridges
export const joystickInput = { x: 0, y: 0 };
export const playerPosition = { x: 0, z: 0 };
export const colliders = new Map();
export const registerCollider = (id, box) => colliders.set(id, box);
export const unregisterCollider = (id) => colliders.delete(id);

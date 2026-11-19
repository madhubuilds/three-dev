import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as THREE from "three";
import { getEffectiveExtents } from "../data/roomCatalog";

const ROOM_MIN = -6.75;
const ROOM_MAX = 6.75;

function clampToRoom(x, z, itemId, rotation) {
  const { halfW, halfD } = getEffectiveExtents(itemId, rotation);
  return {
    x: THREE.MathUtils.clamp(x, ROOM_MIN + halfW, ROOM_MAX - halfW),
    z: THREE.MathUtils.clamp(z, ROOM_MIN + halfD, ROOM_MAX - halfD),
  };
}

export const useAvatarStore = create(
  persist(
    (set) => ({
      cameraMode: "iso",
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
        hair: "classic",
        hat: "none",
        glasses: "none",
        eyes: "classic",
        nose: "button",
        mouth: "smile",
        mustache: "none",
      },
      bio: "Building cool 3D worlds on the web.",
      status: "Online",
      roomTheme: "cozy",
      setCameraMode: (cameraMode) => set({ cameraMode }),
      setBio: (bio) => set({ bio }),
      setStatus: (status) => set({ status }),
      setRoomTheme: (roomTheme) => set({ roomTheme }),
      setAccessory: (slot, value) =>
        set((state) => ({
          accessories: { ...state.accessories, [slot]: value },
        })),

      // Interaction state
      nearbyProp: null,
      activeProp: null,
      setUsername: (username) => set({ username }),
      setAnimation: (animation) => set({ animation }),
      setColor: (part, value) =>
        set((state) => ({
          colors: { ...state.colors, [part]: value },
        })),
      setChatMessage: (chatMessage) => set({ chatMessage }),
      setNearbyProp: (nearbyProp) => set({ nearbyProp }),
      setActiveProp: (activeProp) => set({ activeProp }),

      // Room Decor Inventory & Placement
      isDecorating: false,
      setIsDecorating: (isDecorating) =>
        set({ isDecorating, selectedInstanceId: null }),

      selectedInstanceId: null,
      selectRoomItem: (selectedInstanceId) => set({ selectedInstanceId }),

      placedItems: [
        {
          instanceId: "starter-lamp",
          itemId: "lamp-floor",
          x: 5.4,
          z: -5.4,
          rotation: 0,
        },
      ],

      addRoomItem: (itemId) =>
        set((state) => {
          const instanceId = `${itemId}-${Date.now()}`;
          const pos = clampToRoom(0.4, 1.2, itemId, 0);
          return {
            placedItems: [
              ...state.placedItems,
              { instanceId, itemId, x: pos.x, z: pos.z, rotation: 0 },
            ],
            selectedInstanceId: instanceId,
          };
        }),

      moveSelectedItem: (dx, dz) =>
        set((state) => {
          if (!state.selectedInstanceId) return state;
          return {
            placedItems: state.placedItems.map((item) => {
              if (item.instanceId !== state.selectedInstanceId) return item;
              const pos = clampToRoom(
                item.x + dx,
                item.z + dz,
                item.itemId,
                item.rotation,
              );
              return { ...item, x: pos.x, z: pos.z };
            }),
          };
        }),

      rotateSelectedItem: () =>
        set((state) => {
          if (!state.selectedInstanceId) return state;
          return {
            placedItems: state.placedItems.map((item) => {
              if (item.instanceId !== state.selectedInstanceId) return item;
              const nextRot = (item.rotation + 1) % 4;
              const pos = clampToRoom(item.x, item.z, item.itemId, nextRot);
              return { ...item, x: pos.x, z: pos.z, rotation: nextRot };
            }),
          };
        }),

      removeSelectedItem: () =>
        set((state) => ({
          placedItems: state.placedItems.filter(
            (item) => item.instanceId !== state.selectedInstanceId,
          ),
          selectedInstanceId: null,
        })),
    }),
    {
      name: "profile-room-storage",
      partialize: (state) => ({
        username: state.username,
        bio: state.bio,
        status: state.status,
        roomTheme: state.roomTheme,
        colors: state.colors,
        accessories: state.accessories,
        placedItems: state.placedItems,
      }),
    },
  ),
);

// Non-reactive 60fps bridges
export const joystickInput = { x: 0, y: 0 };
export const playerPosition = { x: 0, z: 0 };
export const colliders = new Map();
export const registerCollider = (id, box) => colliders.set(id, box);
export const unregisterCollider = (id) => colliders.delete(id);

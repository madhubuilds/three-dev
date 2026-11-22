import { create } from "zustand";
import { persist } from "zustand/middleware";

const round3 = (n) => Math.round(n * 1000) / 1000;

export const SNAP_OPTIONS = [0.05, 0.1, 0.25, 0.5, 1];

const SHAPE_LABELS = {
  box: "Block",
  roof: "Roof",
  pillar: "Pillar",
  dome: "Dome",
};

export const useDevBuilderStore = create(
  persist(
    (set, get) => ({
      theme: "light", // "light" | "dark"
      activeTool: "place", // "place" | "select"
      selectedShape: "box", // "box" | "roof" | "pillar" | "dome"
      selectedStyle: "lowpoly", // "blocky" | "lowpoly"
      selectedGradient: 0, // index in GRADIENT_PALETTE
      gradientMode: "continuous", // "continuous" | "uniform" | "object"
      customColor: null, // hex string when user picks custom solid color
      gridSnap: 0.5, // 0.05 | 0.1 | 0.25 | 0.5 | 1
      transformMode: "translate", // "translate" | "rotate" | "scale"
      isDraggingGizmo: false,

      // Live Animation Preview State (non-persisted)
      previewAnim: "none", // "none" | "idle" | "drive" | "jump" | "stop" | "drift"
      previewSteer: 0, // -1 (left) | 0 (straight) | 1 (right)

      folders: [], // [{ id, name, collapsed, visible }]
      activeFolderId: null,
      selectedFolderId: null,

      blocks: [],
      selectedBlockId: null,

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      setPreviewAnim: (previewAnim) =>
        set((s) => ({
          previewAnim,
          activeTool: previewAnim !== "none" ? "select" : s.activeTool,
        })),

      setPreviewSteer: (previewSteer) => set({ previewSteer }),

      setActiveTool: (activeTool) =>
        set((s) => ({
          activeTool,
          previewAnim: activeTool === "place" ? "none" : s.previewAnim,
          selectedBlockId: activeTool === "place" ? null : s.selectedBlockId,
          selectedFolderId: activeTool === "place" ? null : s.selectedFolderId,
        })),

      setSelectedShape: (selectedShape) =>
        set({
          selectedShape,
          activeTool: "place",
          previewAnim: "none",
          selectedBlockId: null,
          selectedFolderId: null,
        }),

      setSelectedStyle: (selectedStyle) => {
        const { selectedBlockId, selectedFolderId, blocks } = get();
        if (selectedBlockId) {
          set({
            selectedStyle,
            blocks: blocks.map((b) =>
              b.id === selectedBlockId ? { ...b, style: selectedStyle } : b,
            ),
          });
        } else if (selectedFolderId) {
          set({
            selectedStyle,
            blocks: blocks.map((b) =>
              b.folderId === selectedFolderId
                ? { ...b, style: selectedStyle }
                : b,
            ),
          });
        } else {
          set({ selectedStyle });
        }
      },

      setGradientMode: (gradientMode) => {
        const { selectedBlockId, selectedFolderId, blocks } = get();
        if (selectedBlockId) {
          set({
            gradientMode,
            blocks: blocks.map((b) =>
              b.id === selectedBlockId ? { ...b, gradientMode } : b,
            ),
          });
        } else if (selectedFolderId) {
          set({
            gradientMode,
            blocks: blocks.map((b) =>
              b.folderId === selectedFolderId ? { ...b, gradientMode } : b,
            ),
          });
        } else {
          set({ gradientMode });
        }
      },

      setSelectedGradient: (selectedGradient) => {
        const { selectedBlockId, selectedFolderId, blocks } = get();
        if (selectedBlockId) {
          set({
            selectedGradient,
            customColor: null,
            blocks: blocks.map((b) =>
              b.id === selectedBlockId
                ? { ...b, gradientIndex: selectedGradient, customColor: null }
                : b,
            ),
          });
        } else if (selectedFolderId) {
          set({
            selectedGradient,
            customColor: null,
            blocks: blocks.map((b) =>
              b.folderId === selectedFolderId
                ? { ...b, gradientIndex: selectedGradient, customColor: null }
                : b,
            ),
          });
        } else {
          set({ selectedGradient, customColor: null });
        }
      },

      setCustomColor: (customColor) => {
        const { selectedBlockId, selectedFolderId, blocks } = get();
        if (selectedBlockId) {
          set({
            customColor,
            blocks: blocks.map((b) =>
              b.id === selectedBlockId ? { ...b, customColor } : b,
            ),
          });
        } else if (selectedFolderId) {
          set({
            customColor,
            blocks: blocks.map((b) =>
              b.folderId === selectedFolderId ? { ...b, customColor } : b,
            ),
          });
        } else {
          set({ customColor });
        }
      },

      setGridSnap: (gridSnap) => set({ gridSnap }),

      toggleGridSnap: () =>
        set((s) => {
          const idx = SNAP_OPTIONS.indexOf(s.gridSnap);
          const next = SNAP_OPTIONS[(idx + 1) % SNAP_OPTIONS.length];
          return { gridSnap: next };
        }),

      setTransformMode: (transformMode) => set({ transformMode }),

      setIsDraggingGizmo: (isDraggingGizmo) => set({ isDraggingGizmo }),

      /* --- FOLDER ACTIONS --- */
      createFolder: (rawName = "") => {
        const { folders } = get();
        const trimmed = String(rawName || "").trim();
        const name = trimmed || `Folder #${folders.length + 1}`;
        const id = `fld_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        set({
          folders: [...folders, { id, name, collapsed: false, visible: true }],
          activeFolderId: id,
          selectedFolderId: id,
          selectedBlockId: null,
        });
        return id;
      },

      renameFolder: (folderId, rawName) => {
        const trimmed = String(rawName || "").trim();
        if (!trimmed) return;
        set((s) => ({
          folders: s.folders.map((f) =>
            f.id === folderId ? { ...f, name: trimmed } : f,
          ),
        }));
      },

      toggleFolderCollapse: (folderId) =>
        set((s) => ({
          folders: s.folders.map((f) =>
            f.id === folderId ? { ...f, collapsed: !f.collapsed } : f,
          ),
        })),

      toggleFolderVisibility: (folderId) =>
        set((s) => ({
          folders: s.folders.map((f) =>
            f.id === folderId ? { ...f, visible: f.visible === false } : f,
          ),
        })),

      selectFolder: (folderId) =>
        set({
          selectedFolderId: folderId,
          activeFolderId: folderId,
          selectedBlockId: null,
          activeTool: "select",
        }),

      assignBlockToFolder: (blockId, folderId) =>
        set((s) => ({
          activeFolderId: folderId || s.activeFolderId,
          blocks: s.blocks.map((b) =>
            b.id === blockId ? { ...b, folderId: folderId || null } : b,
          ),
        })),

      nudgeFolder: (folderId, axisIndex, delta) =>
        set((s) => {
          const folderBlocks = s.blocks.filter((b) => b.folderId === folderId);
          if (folderBlocks.length === 0) return s;

          let safeDelta = delta;
          if (axisIndex === 1 && delta < 0) {
            const minClearance = Math.min(
              ...folderBlocks.map((b) => b.position[1] - b.scale[1] / 2),
            );
            safeDelta = Math.max(delta, -minClearance);
          }

          return {
            blocks: s.blocks.map((b) => {
              if (b.folderId !== folderId) return b;
              const nextPos = [...b.position];
              nextPos[axisIndex] = round3(nextPos[axisIndex] + safeDelta);
              return { ...b, position: nextPos };
            }),
          };
        }),

      rotateFolderY: (folderId, deltaRad) =>
        set((s) => {
          const folderBlocks = s.blocks.filter((b) => b.folderId === folderId);
          if (folderBlocks.length === 0) return s;

          const avgX =
            folderBlocks.reduce((acc, b) => acc + b.position[0], 0) /
            folderBlocks.length;
          const avgZ =
            folderBlocks.reduce((acc, b) => acc + b.position[2], 0) /
            folderBlocks.length;

          const cos = Math.cos(deltaRad);
          const sin = Math.sin(deltaRad);

          return {
            blocks: s.blocks.map((b) => {
              if (b.folderId !== folderId) return b;
              const dx = b.position[0] - avgX;
              const dz = b.position[2] - avgZ;
              const nextX = round3(avgX + dx * cos + dz * sin);
              const nextZ = round3(avgZ - dx * sin + dz * cos);
              const nextRot = [...b.rotation];
              nextRot[1] = round3(nextRot[1] + deltaRad);

              return {
                ...b,
                position: [nextX, b.position[1], nextZ],
                rotation: nextRot,
              };
            }),
          };
        }),

      deleteFolder: (folderId) =>
        set((s) => ({
          folders: s.folders.filter((f) => f.id !== folderId),
          blocks: s.blocks.filter((b) => b.folderId !== folderId),
          activeFolderId:
            s.activeFolderId === folderId ? null : s.activeFolderId,
          selectedFolderId:
            s.selectedFolderId === folderId ? null : s.selectedFolderId,
          selectedBlockId:
            s.blocks.find((b) => b.id === s.selectedBlockId)?.folderId ===
            folderId
              ? null
              : s.selectedBlockId,
        })),

      /* --- BLOCK ACTIONS --- */
      selectBlock: (selectedBlockId) =>
        set((s) => {
          const blk = s.blocks.find((b) => b.id === selectedBlockId);
          return {
            selectedBlockId,
            selectedFolderId: null,
            activeFolderId: blk ? blk.folderId || null : s.activeFolderId,
            activeTool: selectedBlockId ? "select" : s.activeTool,
          };
        }),

      renameBlock: (blockId, rawName) => {
        const trimmed = String(rawName || "").trim();
        if (!trimmed) return;
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === blockId ? { ...b, name: trimmed } : b,
          ),
        }));
      },

      addBlock: (surfacePoint = [0, 0, 0], autoSelect = false) => {
        const {
          selectedShape,
          selectedStyle,
          selectedGradient,
          gradientMode,
          customColor,
          activeFolderId,
          blocks,
        } = get();

        const count =
          blocks.filter((b) => b.shape === selectedShape).length + 1;
        const id = `blk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const scale = [1, 1, 1];
        const centerPos = [
          round3(surfacePoint[0]),
          round3(surfacePoint[1] + scale[1] / 2),
          round3(surfacePoint[2]),
        ];

        const newBlock = {
          id,
          folderId: activeFolderId || null,
          name: `${SHAPE_LABELS[selectedShape] || "Block"} #${count}`,
          shape: selectedShape,
          style: selectedStyle,
          gradientIndex: selectedGradient,
          gradientMode,
          customColor,
          position: centerPos,
          rotation: [0, 0, 0],
          scale,
        };

        set({
          blocks: [...blocks, newBlock],
          selectedBlockId: autoSelect ? id : get().selectedBlockId,
          selectedFolderId: null,
          previewAnim: "none",
          activeTool: autoSelect ? "select" : "place",
        });
      },

      updateBlockTransform: (id, position, rotation, scale) =>
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === id
              ? {
                  ...b,
                  position: position.map(round3),
                  rotation: rotation.map(round3),
                  scale: scale.map(round3),
                }
              : b,
          ),
        })),

      setSelectedBlockPositionAxis: (axisIndex, rawValue) =>
        set((s) => {
          if (!s.selectedBlockId || !Number.isFinite(rawValue)) return s;
          return {
            blocks: s.blocks.map((b) => {
              if (b.id !== s.selectedBlockId) return b;
              const nextPos = [...b.position];
              nextPos[axisIndex] = round3(rawValue);
              return { ...b, position: nextPos };
            }),
          };
        }),

      nudgeSelectedBlock: (axisIndex, delta) =>
        set((s) => {
          if (!s.selectedBlockId) return s;
          return {
            blocks: s.blocks.map((b) => {
              if (b.id !== s.selectedBlockId) return b;
              const nextPos = [...b.position];
              nextPos[axisIndex] = round3(nextPos[axisIndex] + delta);
              const minCenterY = b.scale[1] / 2;
              if (axisIndex === 1 && nextPos[1] < minCenterY) {
                nextPos[1] = round3(minCenterY);
              }
              return { ...b, position: nextPos };
            }),
          };
        }),

      setSelectedBlockRotationAxisDeg: (axisIndex, degrees) =>
        set((s) => {
          if (!s.selectedBlockId || !Number.isFinite(degrees)) return s;
          return {
            blocks: s.blocks.map((b) => {
              if (b.id !== s.selectedBlockId) return b;
              const nextRot = [...b.rotation];
              nextRot[axisIndex] = round3((degrees * Math.PI) / 180);
              return { ...b, rotation: nextRot };
            }),
          };
        }),

      rotateSelectedBlock: (axisIndex, deltaRad) =>
        set((s) => {
          if (!s.selectedBlockId) return s;
          return {
            blocks: s.blocks.map((b) => {
              if (b.id !== s.selectedBlockId) return b;
              const nextRot = [...b.rotation];
              nextRot[axisIndex] = round3(nextRot[axisIndex] + deltaRad);
              return { ...b, rotation: nextRot };
            }),
          };
        }),

      setSelectedBlockScaleAxis: (axisIndex, rawValue) =>
        set((s) => {
          if (!s.selectedBlockId || !Number.isFinite(rawValue)) return s;
          return {
            blocks: s.blocks.map((b) => {
              if (b.id !== s.selectedBlockId) return b;
              const nextScale = [...b.scale];
              const prevVal = nextScale[axisIndex];
              const nextVal = Math.max(0.05, round3(rawValue));
              nextScale[axisIndex] = nextVal;

              const nextPos = [...b.position];
              if (axisIndex === 1) {
                nextPos[1] = round3(nextPos[1] + (nextVal - prevVal) / 2);
              }

              return { ...b, scale: nextScale, position: nextPos };
            }),
          };
        }),

      scaleSelectedBlock: (axisIndex, delta) =>
        set((s) => {
          if (!s.selectedBlockId) return s;
          return {
            blocks: s.blocks.map((b) => {
              if (b.id !== s.selectedBlockId) return b;
              const nextScale = [...b.scale];
              const prevVal = nextScale[axisIndex];
              const nextVal = Math.max(0.05, round3(prevVal + delta));
              nextScale[axisIndex] = nextVal;

              const nextPos = [...b.position];
              if (axisIndex === 1) {
                nextPos[1] = round3(nextPos[1] + (nextVal - prevVal) / 2);
              }

              return { ...b, scale: nextScale, position: nextPos };
            }),
          };
        }),

      duplicateSelectedBlock: () => {
        const { selectedBlockId, blocks, gridSnap } = get();
        const source = blocks.find((b) => b.id === selectedBlockId);
        if (!source) return;

        // Strip trailing " Copy" or " Copy 2" to prevent "Copy Copy" chains
        const baseName = (source.name || "Block")
          .replace(/(\s+Copy(\s+\d+)?)+$/i, "")
          .trim();

        const existingNames = new Set(blocks.map((b) => b.name));
        let nextName = `${baseName} Copy`;
        let counter = 2;
        while (existingNames.has(nextName)) {
          nextName = `${baseName} Copy ${counter}`;
          counter += 1;
        }

        const id = `blk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const clone = {
          ...source,
          id,
          name: nextName,
          position: [
            round3(source.position[0] + Math.max(gridSnap, 0.25) * 2),
            source.position[1],
            source.position[2],
          ],
        };

        set({
          blocks: [...blocks, clone],
          selectedBlockId: id,
          selectedFolderId: null,
          activeTool: "select",
        });
      },

      importBlocks: (incomingBlocks, incomingFolders = []) => {
        if (!Array.isArray(incomingBlocks)) return;
        const folderIdMap = new Map();
        const normalizedFolders = Array.isArray(incomingFolders)
          ? incomingFolders.map((f, idx) => {
              const newId = `fld_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`;
              if (f.id) folderIdMap.set(f.id, newId);
              return {
                id: newId,
                name: f.name || `Folder #${idx + 1}`,
                collapsed: false,
                visible: true,
              };
            })
          : [];

        const normalizedBlocks = incomingBlocks.map((b, idx) => ({
          id: `blk_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 5)}`,
          folderId: b.folderId ? folderIdMap.get(b.folderId) || null : null,
          name: b.name || `Block #${idx + 1}`,
          shape: b.shape || "box",
          style: b.style || "lowpoly",
          gradientIndex:
            typeof b.gradientIndex === "number" ? b.gradientIndex : 0,
          gradientMode: b.gradientMode || "continuous",
          customColor: b.customColor || null,
          position: Array.isArray(b.position)
            ? b.position.map(round3)
            : [0, 0.5, 0],
          rotation: Array.isArray(b.rotation)
            ? b.rotation.map(round3)
            : [0, 0, 0],
          scale: Array.isArray(b.scale) ? b.scale.map(round3) : [1, 1, 1],
        }));

        set((s) => ({
          folders: [...s.folders, ...normalizedFolders],
          blocks: [...s.blocks, ...normalizedBlocks],
          selectedFolderId: normalizedFolders[0]?.id || null,
          activeFolderId: normalizedFolders[0]?.id || s.activeFolderId,
          selectedBlockId: normalizedFolders[0]
            ? null
            : normalizedBlocks[0]?.id || null,
          activeTool: "select",
        }));
      },

      removeBlockById: (id) =>
        set((s) => ({
          blocks: s.blocks.filter((b) => b.id !== id),
          selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
        })),

      removeSelectedBlock: () => {
        const { selectedBlockId, removeBlockById } = get();
        if (selectedBlockId) removeBlockById(selectedBlockId);
      },

      clearBlocks: () =>
        set({
          blocks: [],
          folders: [],
          selectedBlockId: null,
          selectedFolderId: null,
          activeFolderId: null,
          previewAnim: "none",
        }),
    }),
    {
      name: "three-dev-world-builder-v1",
      version: 3,
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState?.blocks) {
          persistedState = {
            ...persistedState,
            gradientMode: "continuous",
            blocks: persistedState.blocks.map((b) => ({
              ...b,
              gradientMode: b.gradientMode || "continuous",
              position: [
                b.position[0],
                round3(b.position[1] + (b.scale?.[1] ?? 1) / 2),
                b.position[2],
              ],
            })),
          };
        }
        if (version < 3) {
          return {
            ...persistedState,
            folders: persistedState?.folders || [],
            activeFolderId: null,
            selectedFolderId: null,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        theme: state.theme,
        gridSnap: state.gridSnap,
        folders: state.folders,
        blocks: state.blocks,
        selectedStyle: state.selectedStyle,
        selectedGradient: state.selectedGradient,
        gradientMode: state.gradientMode,
      }),
    },
  ),
);

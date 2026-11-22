import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Copy,
  Cylinder,
  Download,
  Eye,
  EyeOff,
  FileJson,
  Folder,
  FolderOpen,
  FolderPlus,
  Hexagon,
  Layers,
  Maximize2,
  Minus,
  Moon,
  MousePointer,
  Move,
  Palette,
  Pencil,
  Plus,
  RotateCw,
  SlidersHorizontal,
  Sun,
  Trash2,
  Triangle,
  Upload,
  ArrowUp,
  Gauge,
  Octagon,
  Play,
  Square,
  Wind,
} from "lucide-react";
import { GRADIENT_PALETTE } from "../../utils/gradientPalette";
import {
  SNAP_OPTIONS,
  useDevBuilderStore,
} from "../../store/useDevBuilderStore";
import {
  exportBlocksToGLB,
  exportBlocksToJSON,
  slugifyFilename,
} from "../../utils/devExporter";

const SHAPES = [
  { id: "box", label: "Block", icon: Box },
  { id: "roof", label: "Roof", icon: Triangle },
  { id: "pillar", label: "Pillar", icon: Cylinder },
  { id: "dome", label: "Dome", icon: Circle },
];

const AXIS_BADGE_STYLES = [
  "bg-rose-500/15 text-rose-500",
  "bg-emerald-500/15 text-emerald-500",
  "bg-sky-500/15 text-sky-500",
];

function AxisNumberRow({
  axisCode,
  label,
  axisIdx,
  value,
  step,
  suffix = "",
  isDark,
  onStep,
  onCommit,
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    const parsed = parseFloat(draft);
    if (Number.isFinite(parsed)) {
      onCommit(parsed);
    } else {
      setDraft(String(value));
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 shadow-2xs ${
        isDark ? "bg-[#192236]" : "bg-white"
      }`}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${AXIS_BADGE_STYLES[axisIdx]}`}
        >
          {axisCode}
        </span>
        <span
          className={`truncate text-[11px] font-bold ${
            isDark ? "text-slate-300" : "text-[#17233F]/75"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onStep(-step)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg active:scale-90 ${
            isDark
              ? "bg-white/10 text-white hover:bg-white/16"
              : "bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/14"
          }`}
        >
          <Minus size={13} />
        </button>

        <div
          className={`flex items-center rounded-lg border px-1.5 py-1 focus-within:border-[#FF5A1F] ${
            isDark
              ? "border-white/12 bg-[#0F1523] text-white"
              : "border-[#17233F]/12 bg-[#17233F]/[0.03] text-[#17233F]"
          }`}
        >
          <input
            type="number"
            inputMode="decimal"
            step={step}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const parsed = parseFloat(e.target.value);
              if (Number.isFinite(parsed)) onCommit(parsed);
            }}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitDraft();
                e.currentTarget.blur();
              }
            }}
            className="w-12 bg-transparent text-center font-mono text-xs font-bold outline-none"
          />
          {suffix && (
            <span
              className={`text-[10px] font-bold ${
                isDark ? "text-slate-400" : "text-[#17233F]/45"
              }`}
            >
              {suffix}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onStep(step)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg active:scale-90 ${
            isDark
              ? "bg-white/10 text-white hover:bg-white/16"
              : "bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/14"
          }`}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

export function DevTopBar({ mobileDrawer, setMobileDrawer }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [isExportingGLB, setIsExportingGLB] = useState(false);

  const theme = useDevBuilderStore((s) => s.theme);
  const activeTool = useDevBuilderStore((s) => s.activeTool);
  const selectedStyle = useDevBuilderStore((s) => s.selectedStyle);
  const gridSnap = useDevBuilderStore((s) => s.gridSnap);
  const folders = useDevBuilderStore((s) => s.folders);
  const selectedFolderId = useDevBuilderStore((s) => s.selectedFolderId);
  const blocks = useDevBuilderStore((s) => s.blocks);
  const selectedBlockId = useDevBuilderStore((s) => s.selectedBlockId);

  const toggleTheme = useDevBuilderStore((s) => s.toggleTheme);
  const setActiveTool = useDevBuilderStore((s) => s.setActiveTool);
  const setSelectedStyle = useDevBuilderStore((s) => s.setSelectedStyle);
  const toggleGridSnap = useDevBuilderStore((s) => s.toggleGridSnap);
  const importBlocks = useDevBuilderStore((s) => s.importBlocks);
  const clearBlocks = useDevBuilderStore((s) => s.clearBlocks);

  const isDark = theme === "dark";
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const activeStyle = selectedBlock ? selectedBlock.style : selectedStyle;

  // Determine blocks for "Selected .GLB" export (either selected folder or selected single block)
  const selectedExportBlocks = selectedFolder
    ? blocks.filter((b) => b.folderId === selectedFolder.id)
    : selectedBlock
      ? [selectedBlock]
      : [];

  const selectedExportLabel = selectedFolder
    ? selectedFolder.name
    : selectedBlock
      ? selectedBlock.name
      : "";

  const handleDownloadSelectedGLB = async () => {
    if (selectedExportBlocks.length === 0 || isExportingGLB) return;
    try {
      setIsExportingGLB(true);
      await exportBlocksToGLB(
        selectedExportBlocks,
        `${slugifyFilename(selectedExportLabel, "selected")}.glb`,
      );
    } finally {
      setIsExportingGLB(false);
    }
  };

  const handleDownloadAllGLB = async () => {
    if (blocks.length === 0 || isExportingGLB) return;
    try {
      setIsExportingGLB(true);
      await exportBlocksToGLB(blocks, `full-scene-${Date.now()}.glb`);
    } finally {
      setIsExportingGLB(false);
    }
  };

  const handleExportJSON = async () => {
    if (blocks.length === 0) return;
    await exportBlocksToJSON(blocks, true, folders);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const list = Array.isArray(parsed) ? parsed : parsed.blocks;
        const folderList = Array.isArray(parsed?.folders) ? parsed.folders : [];
        if (list) importBlocks(list, folderList);
      } catch {
        // Ignore malformed JSON files
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div
      className={`pointer-events-auto flex w-full flex-wrap items-center justify-between gap-2 border-b px-3 py-2 backdrop-blur-md transition-colors ${
        isDark
          ? "border-white/10 bg-[#111726]/92 text-slate-100"
          : "border-[#17233F]/10 bg-white/92 text-[#17233F]"
      }`}
    >
      {/* Left: Place vs Edit + Style Toggle */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex rounded-full p-0.5 ${
            isDark ? "bg-white/8" : "bg-[#17233F]/6"
          }`}
        >
          <button
            onClick={() => setActiveTool("place")}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              activeTool === "place"
                ? "bg-[#FF5A1F] text-white shadow-xs"
                : isDark
                  ? "text-slate-300"
                  : "text-[#17233F]/70"
            }`}
          >
            <Plus size={13} />
            <span>Place</span>
          </button>
          <button
            onClick={() => setActiveTool("select")}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              activeTool === "select"
                ? isDark
                  ? "bg-white text-[#0B0F19] shadow-xs"
                  : "bg-[#17233F] text-white shadow-xs"
                : isDark
                  ? "text-slate-300"
                  : "text-[#17233F]/70"
            }`}
          >
            <MousePointer size={12} />
            <span>Edit</span>
          </button>
        </div>

        <button
          onClick={() =>
            setSelectedStyle(activeStyle === "lowpoly" ? "blocky" : "lowpoly")
          }
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
            activeStyle === "lowpoly"
              ? isDark
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-emerald-600/15 text-emerald-700"
              : isDark
                ? "bg-white/10 text-slate-200"
                : "bg-[#17233F]/8 text-[#17233F]"
          }`}
        >
          <Hexagon size={13} />
          <span>{activeStyle === "lowpoly" ? "Low-Poly" : "Blocky"}</span>
        </button>
      </div>

      {/* Right: Mobile Drawers + Selective/All .GLB Export + JSON + Theme + Snap + Exit */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() =>
            setMobileDrawer(mobileDrawer === "outliner" ? null : "outliner")
          }
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold md:hidden ${
            mobileDrawer === "outliner"
              ? "bg-[#FF5A1F] text-white"
              : isDark
                ? "bg-white/10 text-slate-200"
                : "bg-[#17233F]/8 text-[#17233F]"
          }`}
        >
          <Layers size={13} />
          <span>Folders ({folders.length})</span>
        </button>

        <button
          onClick={() =>
            setMobileDrawer(mobileDrawer === "inspector" ? null : "inspector")
          }
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold md:hidden ${
            mobileDrawer === "inspector"
              ? "bg-[#FF5A1F] text-white"
              : isDark
                ? "bg-white/10 text-slate-200"
                : "bg-[#17233F]/8 text-[#17233F]"
          }`}
        >
          <SlidersHorizontal size={13} />
          <span>Props</span>
        </button>

        {/* Download Selected Folder / Object Only */}
        {selectedExportBlocks.length > 0 && (
          <button
            onClick={handleDownloadSelectedGLB}
            disabled={isExportingGLB}
            title={`Download ${selectedExportLabel} only (.glb)`}
            className="flex items-center gap-1 rounded-full bg-[#FF5A1F] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-40"
          >
            <Download size={13} />
            <span className="max-w-24 truncate">{selectedExportLabel}.glb</span>
          </button>
        )}

        {/* Download Full Scene (.GLB) */}
        <button
          onClick={handleDownloadAllGLB}
          disabled={blocks.length === 0 || isExportingGLB}
          title="Download entire scene as one .glb"
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-40 ${
            selectedExportBlocks.length === 0
              ? "bg-[#FF5A1F] text-white shadow-xs"
              : isDark
                ? "bg-white/10 text-slate-200 hover:bg-white/18"
                : "bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/14"
          }`}
        >
          <Download size={13} />
          <span>{selectedExportBlocks.length > 0 ? "All .GLB" : ".GLB"}</span>
        </button>

        {/* Copy & Download JSON Blueprint */}
        <button
          onClick={handleExportJSON}
          disabled={blocks.length === 0}
          title="Copy & Download JSON Blueprint (with folders)"
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-40 ${
            jsonCopied
              ? "bg-emerald-600 text-white"
              : isDark
                ? "bg-white/10 text-slate-200 hover:bg-white/18"
                : "bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/14"
          }`}
        >
          {jsonCopied ? <Check size={13} /> : <FileJson size={13} />}
          <span>{jsonCopied ? "Copied" : "JSON"}</span>
        </button>

        {/* Import JSON Blueprint */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import JSON Blueprint"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition active:scale-90 ${
            isDark
              ? "bg-white/10 text-slate-200 hover:bg-white/18"
              : "bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/14"
          }`}
        >
          <Upload size={14} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportJSON}
          className="hidden"
        />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark or Light Mode"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition active:scale-90 ${
            isDark
              ? "bg-amber-400/15 text-amber-300 hover:bg-amber-400/25"
              : "bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/15"
          }`}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={toggleGridSnap}
          title="Cycle Grid & Step Snap (0.05m to 1m)"
          className={`rounded-full px-2.5 py-1.5 text-xs font-bold ${
            isDark
              ? "bg-white/10 text-slate-200"
              : "bg-[#17233F]/6 text-[#17233F]"
          }`}
        >
          Snap {gridSnap}m
        </button>

        {blocks.length > 0 && (
          <button
            onClick={clearBlocks}
            aria-label="Clear All"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-red-500 active:scale-90"
          >
            <Trash2 size={14} />
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className={`rounded-full px-3 py-1.5 text-xs font-bold active:scale-95 ${
            isDark ? "bg-white text-[#0B0F19]" : "bg-[#17233F] text-white"
          }`}
        >
          Exit
        </button>
      </div>
    </div>
  );
}

/* LEFT COLUMN: Shapes + Folders Hierarchy & Per-Folder .GLB Export */
export function DevOutlinerPanel({ onCloseMobile }) {
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingNameDraft, setEditingNameDraft] = useState("");

  const theme = useDevBuilderStore((s) => s.theme);
  const activeTool = useDevBuilderStore((s) => s.activeTool);
  const selectedShape = useDevBuilderStore((s) => s.selectedShape);
  const folders = useDevBuilderStore((s) => s.folders);
  const activeFolderId = useDevBuilderStore((s) => s.activeFolderId);
  const selectedFolderId = useDevBuilderStore((s) => s.selectedFolderId);
  const blocks = useDevBuilderStore((s) => s.blocks);
  const selectedBlockId = useDevBuilderStore((s) => s.selectedBlockId);

  const setSelectedShape = useDevBuilderStore((s) => s.setSelectedShape);
  const addBlock = useDevBuilderStore((s) => s.addBlock);
  const createFolder = useDevBuilderStore((s) => s.createFolder);
  const renameFolder = useDevBuilderStore((s) => s.renameFolder);
  const toggleFolderCollapse = useDevBuilderStore(
    (s) => s.toggleFolderCollapse,
  );
  const toggleFolderVisibility = useDevBuilderStore(
    (s) => s.toggleFolderVisibility,
  );
  const selectFolder = useDevBuilderStore((s) => s.selectFolder);
  const deleteFolder = useDevBuilderStore((s) => s.deleteFolder);
  const selectBlock = useDevBuilderStore((s) => s.selectBlock);
  const assignBlockToFolder = useDevBuilderStore((s) => s.assignBlockToFolder);
  const removeBlockById = useDevBuilderStore((s) => s.removeBlockById);

  const isDark = theme === "dark";
  const looseBlocks = blocks.filter((b) => !b.folderId);

  const handleCreateFolder = (e) => {
    e?.preventDefault();
    createFolder(newFolderName);
    setNewFolderName("");
  };

  const handleExportSingleFolder = async (e, folder) => {
    e.stopPropagation();
    const folderBlocks = blocks.filter((b) => b.folderId === folder.id);
    if (folderBlocks.length === 0) return;
    await exportBlocksToGLB(
      folderBlocks,
      `${slugifyFilename(folder.name, "folder")}.glb`,
    );
  };

  const renderBlockItem = (block, indented = false) => {
    const isSelected = block.id === selectedBlockId;
    const swatch = GRADIENT_PALETTE[block.gradientIndex] || GRADIENT_PALETTE[0];

    return (
      <div
        key={block.id}
        onClick={() => {
          selectBlock(block.id);
          onCloseMobile?.();
        }}
        className={`flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 transition ${
          indented ? "ml-3.5" : ""
        } ${
          isSelected
            ? "bg-[#FF5A1F] text-white shadow-sm"
            : isDark
              ? "bg-white/[0.04] text-slate-200 hover:bg-white/10"
              : "bg-[#17233F]/[0.03] text-[#17233F] hover:bg-[#17233F]/8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/80 shadow-2xs"
            style={{
              background: block.customColor
                ? block.customColor
                : `linear-gradient(180deg, ${swatch.top}, ${swatch.bottom})`,
            }}
          />
          <span className="truncate text-[11px] font-bold">
            {block.name || block.shape}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {/* Quick assign to folder if block is loose and folders exist */}
          {!block.folderId && folders.length > 0 && (
            <select
              aria-label="Move to folder"
              value=""
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                if (e.target.value)
                  assignBlockToFolder(block.id, e.target.value);
              }}
              className={`max-w-16 rounded px-1 py-0.5 text-[9px] font-bold outline-none ${
                isSelected
                  ? "bg-white/20 text-white"
                  : isDark
                    ? "bg-white/10 text-slate-300"
                    : "bg-[#17233F]/8 text-[#17233F]"
              }`}
            >
              <option value="">+Folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="text-black">
                  {f.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeBlockById(block.id);
            }}
            aria-label={`Delete ${block.name}`}
            className={`rounded-lg p-1 transition ${
              isSelected
                ? "text-white/85 hover:bg-white/20 hover:text-white"
                : isDark
                  ? "text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                  : "text-[#17233F]/45 hover:bg-red-500/10 hover:text-red-600"
            }`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`flex h-full w-full flex-col border-r backdrop-blur-xl transition-colors ${
        isDark
          ? "border-white/10 bg-[#111726]/95 text-slate-100"
          : "border-[#17233F]/10 bg-white/95 text-[#17233F]"
      }`}
    >
      {/* Add Shapes Grid */}
      <div
        className={`border-b p-3 ${
          isDark ? "border-white/10" : "border-[#17233F]/10"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-[#17233F]/55"
            }`}
          >
            Add Shapes
          </span>
          <button
            onClick={() => {
              addBlock([0, 0, 0], true);
              onCloseMobile?.();
            }}
            className="flex items-center gap-1 rounded-full bg-[#FF5A1F] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs active:scale-95"
          >
            <Plus size={12} />
            <span>Drop Center</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {SHAPES.map(({ id, label, icon: Icon }) => {
            const active = activeTool === "place" && selectedShape === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSelectedShape(id);
                  onCloseMobile?.();
                }}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-bold transition active:scale-95 ${
                  active
                    ? "border-[#FF5A1F] bg-[#FF5A1F]/15 text-[#FF5A1F]"
                    : isDark
                      ? "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10"
                      : "border-[#17233F]/8 bg-[#17233F]/[0.03] text-[#17233F]/80 hover:bg-[#17233F]/8"
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create New Folder Bar */}
      <form
        onSubmit={handleCreateFolder}
        className={`flex items-center gap-1.5 border-b px-2.5 py-2 ${
          isDark ? "border-white/10" : "border-[#17233F]/10"
        }`}
      >
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder (e.g. Bench)"
          className={`min-w-0 flex-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[#FF5A1F] ${
            isDark
              ? "border-white/12 bg-white/5 text-white placeholder:text-slate-500"
              : "border-[#17233F]/12 bg-[#17233F]/[0.03] text-[#17233F] placeholder:text-[#17233F]/40"
          }`}
        />
        <button
          type="submit"
          title="Create Folder"
          className="flex h-8 shrink-0 items-center gap-1 rounded-xl bg-[#17233F] px-2.5 text-xs font-bold text-white active:scale-95 dark:bg-[#FF5A1F]"
        >
          <FolderPlus size={14} />
        </button>
      </form>

      {/* Folders & Objects Hierarchy */}
      <div className="flex-1 space-y-2 overflow-y-auto px-2.5 py-2.5">
        {folders.map((folder) => {
          const folderBlocks = blocks.filter((b) => b.folderId === folder.id);
          const isFolderSelected = selectedFolderId === folder.id;
          const isFolderActive = activeFolderId === folder.id;
          const isVisible = folder.visible !== false;

          return (
            <div
              key={folder.id}
              className={`rounded-2xl border p-1.5 transition ${
                isFolderSelected
                  ? "border-[#FF5A1F] bg-[#FF5A1F]/10"
                  : isDark
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-[#17233F]/10 bg-[#17233F]/[0.02]"
              }`}
            >
              {/* Folder Header Row */}
              <div
                onClick={() => selectFolder(folder.id)}
                className="flex cursor-pointer items-center justify-between gap-1 px-1 py-1"
              >
                <div className="flex min-w-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolderCollapse(folder.id);
                    }}
                    className="rounded p-0.5 opacity-70 hover:opacity-100"
                  >
                    {folder.collapsed ? (
                      <ChevronRight size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                  </button>

                  {folder.collapsed ? (
                    <Folder size={14} className="shrink-0 text-[#FF5A1F]" />
                  ) : (
                    <FolderOpen size={14} className="shrink-0 text-[#FF5A1F]" />
                  )}

                  {editingFolderId === folder.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editingNameDraft}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setEditingNameDraft(e.target.value)}
                      onBlur={() => {
                        renameFolder(folder.id, editingNameDraft);
                        setEditingFolderId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          renameFolder(folder.id, editingNameDraft);
                          setEditingFolderId(null);
                        }
                      }}
                      className="w-20 rounded bg-white px-1 text-xs font-bold text-[#17233F] outline-none"
                    />
                  ) : (
                    <span className="truncate text-xs font-extrabold">
                      {folder.name}
                    </span>
                  )}

                  <span className="shrink-0 text-[10px] opacity-55">
                    ({folderBlocks.length})
                  </span>

                  {isFolderActive && (
                    <span
                      title="Active Folder (new parts go here)"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                    />
                  )}
                </div>

                {/* Folder Actions: Rename, Show/Hide, Download Folder .GLB, Delete */}
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    title="Rename Folder"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder.id);
                      setEditingNameDraft(folder.name);
                    }}
                    className="rounded p-1 opacity-65 hover:opacity-100"
                  >
                    <Pencil size={11} />
                  </button>

                  <button
                    type="button"
                    title={isVisible ? "Hide Folder" : "Show Folder"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolderVisibility(folder.id);
                    }}
                    className="rounded p-1 opacity-75 hover:opacity-100"
                  >
                    {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>

                  <button
                    type="button"
                    disabled={folderBlocks.length === 0}
                    title={`Download ${folder.name}.glb only`}
                    onClick={(e) => handleExportSingleFolder(e, folder)}
                    className="rounded p-1 text-[#FF5A1F] transition hover:bg-[#FF5A1F]/15 disabled:opacity-30"
                  >
                    <Download size={12} />
                  </button>

                  <button
                    type="button"
                    title="Delete Folder & Parts"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder.id);
                    }}
                    className="rounded p-1 text-red-500 opacity-75 hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Folder Children */}
              {!folder.collapsed && (
                <div className="mt-1 space-y-1">
                  {folderBlocks.length === 0 ? (
                    <p className="py-1 pl-6 text-[10px] opacity-50">
                      Active — new shapes placed go here
                    </p>
                  ) : (
                    folderBlocks.map((b) => renderBlockItem(b, true))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Loose / Unassigned Objects */}
        {looseBlocks.length > 0 && (
          <div className="space-y-1 pt-1">
            <span
              className={`block px-1 text-[10px] font-extrabold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-[#17233F]/50"
              }`}
            >
              Loose Parts ({looseBlocks.length})
            </span>
            {looseBlocks.map((b) => renderBlockItem(b, false))}
          </div>
        )}

        {folders.length === 0 && blocks.length === 0 && (
          <div
            className={`rounded-2xl border border-dashed p-4 text-center text-xs ${
              isDark
                ? "border-white/15 text-slate-400"
                : "border-[#17233F]/15 text-[#17233F]/50"
            }`}
          >
            Create a folder like{" "}
            <strong className={isDark ? "text-white" : "text-[#17233F]"}>
              Bench
            </strong>{" "}
            above, then place blocks to group &amp; export it as{" "}
            <strong className="text-[#FF5A1F]">bench.glb</strong>.
          </div>
        )}
      </div>
    </aside>
  );
}

/* RIGHT COLUMN: Folder or Block Transform Inspector + Big 24-Color Gradient Palette */
export function DevInspectorPanel() {
  const theme = useDevBuilderStore((s) => s.theme);
  const selectedStyle = useDevBuilderStore((s) => s.selectedStyle);
  const selectedGradient = useDevBuilderStore((s) => s.selectedGradient);
  const gradientMode = useDevBuilderStore((s) => s.gradientMode);
  const customColor = useDevBuilderStore((s) => s.customColor);
  const gridSnap = useDevBuilderStore((s) => s.gridSnap);
  const transformMode = useDevBuilderStore((s) => s.transformMode);
  const folders = useDevBuilderStore((s) => s.folders);
  const selectedFolderId = useDevBuilderStore((s) => s.selectedFolderId);
  const blocks = useDevBuilderStore((s) => s.blocks);
  const selectedBlockId = useDevBuilderStore((s) => s.selectedBlockId);
  const renameBlock = useDevBuilderStore((s) => s.renameBlock);
  const setGridSnap = useDevBuilderStore((s) => s.setGridSnap);
  const setTransformMode = useDevBuilderStore((s) => s.setTransformMode);
  const setSelectedStyle = useDevBuilderStore((s) => s.setSelectedStyle);
  const setGradientMode = useDevBuilderStore((s) => s.setGradientMode);
  const setSelectedGradient = useDevBuilderStore((s) => s.setSelectedGradient);
  const setCustomColor = useDevBuilderStore((s) => s.setCustomColor);
  const assignBlockToFolder = useDevBuilderStore((s) => s.assignBlockToFolder);
  const nudgeFolder = useDevBuilderStore((s) => s.nudgeFolder);
  const rotateFolderY = useDevBuilderStore((s) => s.rotateFolderY);

  const setSelectedBlockPositionAxis = useDevBuilderStore(
    (s) => s.setSelectedBlockPositionAxis,
  );
  const nudgeSelectedBlock = useDevBuilderStore((s) => s.nudgeSelectedBlock);

  const setSelectedBlockRotationAxisDeg = useDevBuilderStore(
    (s) => s.setSelectedBlockRotationAxisDeg,
  );
  const rotateSelectedBlock = useDevBuilderStore((s) => s.rotateSelectedBlock);

  const setSelectedBlockScaleAxis = useDevBuilderStore(
    (s) => s.setSelectedBlockScaleAxis,
  );
  const scaleSelectedBlock = useDevBuilderStore((s) => s.scaleSelectedBlock);

  const duplicateSelectedBlock = useDevBuilderStore(
    (s) => s.duplicateSelectedBlock,
  );
  const removeSelectedBlock = useDevBuilderStore((s) => s.removeSelectedBlock);

  const isDark = theme === "dark";
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const folderBlocks = selectedFolder
    ? blocks.filter((b) => b.folderId === selectedFolder.id)
    : [];

  const activeStyle = selectedBlock ? selectedBlock.style : selectedStyle;
  const activeGrad = selectedBlock
    ? selectedBlock.gradientIndex
    : selectedGradient;
  const activeGradMode = selectedBlock
    ? selectedBlock.gradientMode || "continuous"
    : gradientMode;
  const activeHex = selectedBlock ? selectedBlock.customColor : customColor;

  const deg = (rad) => Math.round(((rad * 180) / Math.PI) * 10) / 10;

  return (
    <aside
      className={`flex h-full w-full flex-col overflow-y-auto border-l p-3.5 backdrop-blur-xl transition-colors ${
        isDark
          ? "border-white/10 bg-[#111726]/95 text-slate-100"
          : "border-[#17233F]/10 bg-white/95 text-[#17233F]"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span
            className={`block text-[10px] font-extrabold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-[#17233F]/45"
            }`}
          >
            {selectedFolder ? "Folder Group" : "Inspector"}
          </span>
          <h2 className="text-sm font-extrabold">
            {selectedFolder
              ? `${selectedFolder.name} (${folderBlocks.length} parts)`
              : selectedBlock
                ? selectedBlock.name
                : "New Block Brush"}
          </h2>
        </div>
        {selectedBlock ? (
          <input
            type="text"
            value={selectedBlock.name}
            onChange={(e) => renameBlock(selectedBlock.id, e.target.value)}
            aria-label="Part Name"
            className={`w-40 rounded-lg border border-transparent px-1.5 py-0.5 text-sm font-extrabold outline-none focus:border-[#FF5A1F] ${
              isDark
                ? "bg-white/6 text-white"
                : "bg-[#17233F]/[0.04] text-[#17233F]"
            }`}
          />
        ) : (
          <h2 className="text-sm font-extrabold">
            {selectedFolder
              ? `${selectedFolder.name} (${folderBlocks.length} parts)`
              : "New Block Brush"}
          </h2>
        )}
      </div>

      {/* FOLDER GROUP CONTROLS (When a folder is selected) */}
      {selectedFolder && (
        <div
          className={`mb-4 space-y-2.5 rounded-2xl border p-3 ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-[#17233F]/8 bg-[#17233F]/[0.02]"
          }`}
        >
          <button
            onClick={() =>
              exportBlocksToGLB(
                folderBlocks,
                `${slugifyFilename(selectedFolder.name, "folder")}.glb`,
              )
            }
            disabled={folderBlocks.length === 0}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#FF5A1F] py-2 text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-40"
          >
            <Download size={14} />
            <span>Download {selectedFolder.name}.glb</span>
          </button>

          {/* Move Entire Folder */}
          <div className="space-y-1.5">
            <span
              className={`block text-[10px] font-extrabold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-[#17233F]/55"
              }`}
            >
              Move Whole Folder ({gridSnap}m)
            </span>
            {[
              { code: "X", label: "Left / Right", idx: 0 },
              { code: "Y", label: "Down / Up", idx: 1 },
              { code: "Z", label: "Back / Front", idx: 2 },
            ].map(({ code, label, idx }) => (
              <div
                key={code}
                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 ${
                  isDark ? "bg-[#192236]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black ${AXIS_BADGE_STYLES[idx]}`}
                  >
                    {code}
                  </span>
                  <span className="text-[11px] font-bold">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      nudgeFolder(selectedFolder.id, idx, -gridSnap)
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isDark ? "bg-white/10" : "bg-[#17233F]/8"
                    }`}
                  >
                    <Minus size={13} />
                  </button>
                  <button
                    onClick={() =>
                      nudgeFolder(selectedFolder.id, idx, gridSnap)
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isDark ? "bg-white/10" : "bg-[#17233F]/8"
                    }`}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Turn Entire Folder */}
          <div
            className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 ${
              isDark ? "bg-[#192236]" : "bg-white"
            }`}
          >
            <span className="text-[11px] font-bold">Turn Folder (45°)</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => rotateFolderY(selectedFolder.id, -Math.PI / 4)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDark ? "bg-white/10" : "bg-[#17233F]/8"
                }`}
              >
                <Minus size={13} />
              </button>
              <button
                onClick={() => rotateFolderY(selectedFolder.id, Math.PI / 4)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDark ? "bg-white/10" : "bg-[#17233F]/8"
                }`}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Switcher (Blocky vs Low-Poly) */}
      <div
        className={`mb-3 grid grid-cols-2 gap-1.5 rounded-2xl p-1 ${
          isDark ? "bg-white/8" : "bg-[#17233F]/6"
        }`}
      >
        {["blocky", "lowpoly"].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStyle(st)}
            className={`rounded-xl py-1.5 text-xs font-bold transition ${
              activeStyle === st
                ? isDark
                  ? "bg-white text-[#0B0F19] shadow-xs"
                  : "bg-[#17233F] text-white shadow-xs"
                : isDark
                  ? "text-slate-300"
                  : "text-[#17233F]/70"
            }`}
          >
            {st === "lowpoly" ? "Low-Poly" : "Blocky"}
          </button>
        ))}
      </div>

      {/* Single-Mode Block Transform Panel */}
      {selectedBlock ? (
        <div
          className={`mb-4 space-y-2.5 rounded-2xl border p-3 ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-[#17233F]/8 bg-[#17233F]/[0.02]"
          }`}
        >
          {/* Assign Block to Folder */}
          {folders.length > 0 && (
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-[#17233F]/50"
                }`}
              >
                Folder
              </span>
              <select
                value={selectedBlock.folderId || ""}
                onChange={(e) =>
                  assignBlockToFolder(selectedBlock.id, e.target.value || null)
                }
                className={`rounded-lg border px-2 py-1 text-xs font-bold outline-none ${
                  isDark
                    ? "border-white/15 bg-[#192236] text-white"
                    : "border-[#17233F]/15 bg-white text-[#17233F]"
                }`}
              >
                <option value="">Loose (No Folder)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3-Mode Tab Bar */}
          <div
            className={`grid grid-cols-3 gap-1 rounded-xl p-1 ${
              isDark ? "bg-white/8" : "bg-[#17233F]/6"
            }`}
          >
            {[
              { id: "translate", label: "Move", icon: Move },
              { id: "rotate", label: "Rotate", icon: RotateCw },
              { id: "scale", label: "Scale", icon: Maximize2 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTransformMode(id)}
                className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition ${
                  transformMode === id
                    ? "bg-[#FF5A1F] text-white shadow-xs"
                    : isDark
                      ? "text-slate-300"
                      : "text-[#17233F]/70"
                }`}
              >
                <Icon size={12} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Step Precision Pills (0.05m to 1m) */}
          {transformMode !== "rotate" && (
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-[#17233F]/50"
                }`}
              >
                Step
              </span>
              <div className="flex gap-1">
                {SNAP_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGridSnap(opt)}
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold transition ${
                      gridSnap === opt
                        ? "bg-[#FF5A1F] text-white"
                        : isDark
                          ? "bg-white/8 text-slate-300 hover:bg-white/15"
                          : "bg-[#17233F]/6 text-[#17233F]/70 hover:bg-[#17233F]/12"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {transformMode === "translate" && (
            <div className="space-y-1.5">
              {[
                { code: "X", label: "Left / Right", idx: 0 },
                { code: "Y", label: "Down / Up", idx: 1 },
                { code: "Z", label: "Back / Front", idx: 2 },
              ].map(({ code, label, idx }) => (
                <AxisNumberRow
                  key={code}
                  axisCode={code}
                  label={label}
                  axisIdx={idx}
                  value={selectedBlock.position[idx]}
                  step={gridSnap}
                  suffix="m"
                  isDark={isDark}
                  onStep={(delta) => nudgeSelectedBlock(idx, delta)}
                  onCommit={(val) => setSelectedBlockPositionAxis(idx, val)}
                />
              ))}
            </div>
          )}

          {transformMode === "rotate" && (
            <div className="space-y-1.5">
              {[
                { code: "X", label: "Tilt", idx: 0, stepDeg: 15 },
                { code: "Y", label: "Turn", idx: 1, stepDeg: 45 },
                { code: "Z", label: "Roll", idx: 2, stepDeg: 15 },
              ].map(({ code, label, idx, stepDeg }) => (
                <AxisNumberRow
                  key={code}
                  axisCode={code}
                  label={label}
                  axisIdx={idx}
                  value={deg(selectedBlock.rotation[idx])}
                  step={stepDeg}
                  suffix="°"
                  isDark={isDark}
                  onStep={(deltaDeg) =>
                    rotateSelectedBlock(idx, (deltaDeg * Math.PI) / 180)
                  }
                  onCommit={(valDeg) =>
                    setSelectedBlockRotationAxisDeg(idx, valDeg)
                  }
                />
              ))}
            </div>
          )}

          {transformMode === "scale" && (
            <div className="space-y-1.5">
              {[
                { code: "X", label: "Width", idx: 0 },
                { code: "Y", label: "Height", idx: 1 },
                { code: "Z", label: "Depth", idx: 2 },
              ].map(({ code, label, idx }) => (
                <AxisNumberRow
                  key={code}
                  axisCode={code}
                  label={label}
                  axisIdx={idx}
                  value={selectedBlock.scale[idx]}
                  step={gridSnap}
                  suffix="×"
                  isDark={isDark}
                  onStep={(delta) => scaleSelectedBlock(idx, delta)}
                  onCommit={(val) => setSelectedBlockScaleAxis(idx, val)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        !selectedFolder && (
          <div
            className={`mb-4 rounded-2xl border border-dashed p-3 text-center text-xs ${
              isDark
                ? "border-white/15 text-slate-400"
                : "border-[#17233F]/15 text-[#17233F]/55"
            }`}
          >
            Tap a folder or object in the left list or 3D viewport to edit or
            download it.
          </div>
        )
      )}

      {/* BIG 24-Color Blender Gradient Palette */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-[#17233F]/55"
            }`}
          >
            Gradient Palette ({GRADIENT_PALETTE.length})
          </span>
          <span className="text-[11px] font-bold text-[#FF5A1F]">
            {activeHex
              ? activeHex.toUpperCase()
              : GRADIENT_PALETTE[activeGrad]?.name}
          </span>
        </div>

        <div
          className={`mb-2.5 grid grid-cols-3 gap-1 rounded-xl p-1 ${
            isDark ? "bg-white/8" : "bg-[#17233F]/6"
          }`}
        >
          {[
            { id: "continuous", label: "Seamless" },
            { id: "uniform", label: "Same Color" },
            { id: "object", label: "Per Block" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setGradientMode(id)}
              className={`rounded-lg py-1 text-[10px] font-bold transition ${
                activeGradMode === id
                  ? isDark
                    ? "bg-white text-[#0B0F19] shadow-2xs"
                    : "bg-[#17233F] text-white shadow-2xs"
                  : isDark
                    ? "text-slate-300"
                    : "text-[#17233F]/65"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {GRADIENT_PALETTE.map((swatch, idx) => {
            const isSelected = !activeHex && activeGrad === idx;
            return (
              <button
                key={swatch.id}
                onClick={() => setSelectedGradient(idx)}
                title={swatch.name}
                style={{
                  background: `linear-gradient(180deg, ${swatch.top} 0%, ${swatch.bottom} 100%)`,
                }}
                className={`group relative flex h-14 flex-col items-center justify-end rounded-2xl border-2 p-1.5 transition active:scale-95 ${
                  isSelected
                    ? isDark
                      ? "scale-[1.03] border-[#FFE600] ring-2 ring-[#FF5A1F]/50"
                      : "scale-[1.03] border-[#17233F] ring-2 ring-[#FF5A1F]/40"
                    : isDark
                      ? "border-white/15 shadow-sm"
                      : "border-white shadow-sm"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#17233F] text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <span className="w-full truncate rounded-md bg-black/40 px-1 py-0.5 text-center text-[9px] font-bold text-white backdrop-blur-2xs">
                  {swatch.name}
                </span>
              </button>
            );
          })}

          <label
            className={`relative flex h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 transition active:scale-95 ${
              activeHex
                ? isDark
                  ? "scale-[1.03] border-[#FFE600] ring-2 ring-[#FF5A1F]/50"
                  : "scale-[1.03] border-[#17233F] ring-2 ring-[#FF5A1F]/40"
                : isDark
                  ? "border-dashed border-white/25 bg-white/5 text-slate-200"
                  : "border-dashed border-[#17233F]/30 bg-[#17233F]/5 text-[#17233F]"
            }`}
            style={activeHex ? { backgroundColor: activeHex } : undefined}
          >
            <Palette
              size={18}
              className={activeHex ? "text-white drop-shadow-xs" : ""}
            />
            <span
              className={`text-[10px] font-bold ${
                activeHex ? "text-white drop-shadow-xs" : ""
              }`}
            >
              Custom
            </span>
            <input
              type="color"
              value={activeHex || "#FF5A1F"}
              onChange={(e) => setCustomColor(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
const ANIM_PRESETS = [
  { id: "none", label: "Off", icon: Square },
  { id: "idle", label: "Idle", icon: Gauge },
  { id: "drive", label: "Drive", icon: Play },
  { id: "jump", label: "Jump", icon: ArrowUp },
  { id: "stop", label: "Stop", icon: Octagon },
  { id: "drift", label: "Drift", icon: Wind },
];

/* FLOATING BOTTOM-CENTER LIVE ANIMATION PREVIEW BAR */
export function DevAnimationBar() {
  const theme = useDevBuilderStore((s) => s.theme);
  const previewAnim = useDevBuilderStore((s) => s.previewAnim);
  const previewSteer = useDevBuilderStore((s) => s.previewSteer);
  const folders = useDevBuilderStore((s) => s.folders);
  const selectedFolderId = useDevBuilderStore((s) => s.selectedFolderId);
  const blocks = useDevBuilderStore((s) => s.blocks);
  const selectedBlockId = useDevBuilderStore((s) => s.selectedBlockId);

  const setPreviewAnim = useDevBuilderStore((s) => s.setPreviewAnim);
  const setPreviewSteer = useDevBuilderStore((s) => s.setPreviewSteer);

  if (blocks.length === 0) return null;

  const isDark = theme === "dark";
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const parentFolder = selectedBlock?.folderId
    ? folders.find((f) => f.id === selectedBlock.folderId)
    : null;

  const targetLabel = selectedFolder
    ? selectedFolder.name
    : parentFolder
      ? parentFolder.name
      : selectedBlock
        ? selectedBlock.name
        : "All";

  const showSteerToggle = previewAnim === "drive" || previewAnim === "drift";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center gap-1.5 px-3">
      {/* Left / Center / Right Steer Toggle for Drive & Drift */}
      {showSteerToggle && (
        <div
          className={`pointer-events-auto flex items-center gap-1 rounded-full border px-2 py-1 shadow-md backdrop-blur-md ${
            isDark
              ? "border-white/12 bg-[#111726]/92 text-slate-200"
              : "border-[#17233F]/10 bg-white/92 text-[#17233F]"
          }`}
        >
          <span className="px-1.5 text-[10px] font-extrabold uppercase opacity-60">
            Steer
          </span>
          {[
            { val: -1, label: "Left" },
            { val: 0, label: "Straight" },
            { val: 1, label: "Right" },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setPreviewSteer(val)}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                previewSteer === val
                  ? "bg-[#FF5A1F] text-white"
                  : isDark
                    ? "hover:bg-white/10"
                    : "hover:bg-[#17233F]/8"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Main Animation Pill Bar */}
      <div
        className={`pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border px-2.5 py-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl ${
          isDark
            ? "border-white/12 bg-[#111726]/92 text-slate-100"
            : "border-[#17233F]/10 bg-white/92 text-[#17233F]"
        }`}
      >
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
            previewAnim !== "none"
              ? "bg-emerald-500/20 text-emerald-500"
              : isDark
                ? "bg-white/8 text-slate-400"
                : "bg-[#17233F]/6 text-[#17233F]/55"
          }`}
        >
          {targetLabel}
        </span>

        {ANIM_PRESETS.map(({ id, label, icon: Icon }) => {
          const active = previewAnim === id;
          return (
            <button
              key={id}
              onClick={() => setPreviewAnim(id)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                active
                  ? id === "none"
                    ? isDark
                      ? "bg-white text-[#0B0F19]"
                      : "bg-[#17233F] text-white"
                    : "bg-[#FF5A1F] text-white shadow-xs"
                  : isDark
                    ? "text-slate-300 hover:bg-white/10"
                    : "text-[#17233F]/75 hover:bg-[#17233F]/8"
              }`}
            >
              <Icon size={12} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

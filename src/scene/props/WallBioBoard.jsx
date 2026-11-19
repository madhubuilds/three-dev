import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useAvatarStore } from "../../store/useAvatarStore";

const STATUS_COLORS = {
  Online: "#22C55E",
  Chilling: "#38BDF8",
  Building: "#FF5A1F",
  AFK: "#F59E0B",
};

const BOARD_PALETTES = {
  cozy: {
    frame: "#9E5326",
    cardBg: "#FFFDF9",
    cardBorder: "#E8D5C0",
    primary: "#17233F",
    secondary: "#5C4938",
    pillBg: "#F5ECE2",
    accent: "#FF5A1F",
  },
  studio: {
    frame: "#17233F",
    cardBg: "#FFFFFF",
    cardBorder: "#E2E8F0",
    primary: "#0F172A",
    secondary: "#475569",
    pillBg: "#F1F5F9",
    accent: "#FF5A1F",
  },
  midnight: {
    frame: "#FF5A1F",
    cardBg: "#131C31",
    cardBorder: "#263554",
    primary: "#F8FAFC",
    secondary: "#CBD5E1",
    pillBg: "#1E293B",
    accent: "#FFE600",
  },
};

const frameGeo = new THREE.BoxGeometry(2.75, 1.55, 0.1);
const faceGeo = new THREE.PlaneGeometry(2.55, 1.35);
const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16);

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth, maxLines = 3) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

export function WallBioBoard() {
  const username = useAvatarStore((s) => s.username);
  const status = useAvatarStore((s) => s.status);
  const bio = useAvatarStore((s) => s.bio);
  const roomTheme = useAvatarStore((s) => s.roomTheme);
  const isDecorating = useAvatarStore((s) => s.isDecorating);
  const setActiveProp = useAvatarStore((s) => s.setActiveProp);

  const [hovered, setHovered] = useState(false);
  const palette = BOARD_PALETTES[roomTheme] || BOARD_PALETTES.cozy;

  useEffect(() => {
    document.body.style.cursor = hovered && !isDecorating ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, isDecorating]);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 544;
    const ctx = canvas.getContext("2d");

    // Card background
    ctx.fillStyle = palette.cardBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle inner border
    ctx.strokeStyle = palette.cardBorder;
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, 20, 20, canvas.width - 40, canvas.height - 40, 32);
    ctx.stroke();

    // Top accent bar
    ctx.fillStyle = palette.accent;
    drawRoundedRect(ctx, 56, 52, 84, 12, 6);
    ctx.fill();

    // @username heading
    const handle = `@${(username || "you").trim()}`;
    ctx.fillStyle = palette.primary;
    ctx.font = "800 62px system-ui, -apple-system, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(handle, 56, 128);

    // Live status pill (top-right)
    const activeStatus = status || "Online";
    ctx.font = "700 30px system-ui, -apple-system, sans-serif";
    const statusTextWidth = ctx.measureText(activeStatus).width;
    const pillW = statusTextWidth + 78;
    const pillH = 56;
    const pillX = canvas.width - 56 - pillW;
    const pillY = 98;

    ctx.fillStyle = palette.pillBg;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 28);
    ctx.fill();

    // Status dot
    ctx.fillStyle = STATUS_COLORS[activeStatus] || "#22C55E";
    ctx.beginPath();
    ctx.arc(pillX + 30, pillY + pillH / 2, 11, 0, Math.PI * 2);
    ctx.fill();

    // Status label
    ctx.fillStyle = palette.primary;
    ctx.fillText(activeStatus, pillX + 52, pillY + pillH / 2 + 2);

    // Horizontal divider
    ctx.strokeStyle = palette.cardBorder;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(56, 196);
    ctx.lineTo(canvas.width - 56, 196);
    ctx.stroke();

    // Bio body text
    const bioText = (bio || "Building cool 3D worlds on the web.").trim();
    ctx.fillStyle = palette.secondary;
    ctx.font = "600 40px system-ui, -apple-system, sans-serif";
    const lines = wrapText(ctx, bioText, canvas.width - 112, 3);
    lines.forEach((line, idx) => {
      ctx.fillText(line, 56, 258 + idx * 58);
    });

    // Subtle footer hint
    ctx.fillStyle = palette.accent;
    ctx.font = "700 24px system-ui, -apple-system, sans-serif";
    ctx.fillText("TAP BOARD TO EDIT PROFILE", 56, canvas.height - 54);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [username, status, bio, palette]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const handleClick = (e) => {
    if (isDecorating) return;
    e.stopPropagation();
    setActiveProp({ id: "profile-desk", type: "profile" });
  };

  return (
    <group
      position={[-3.2, 2.75, -6.93]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Frame */}
      <mesh geometry={frameGeo} castShadow receiveShadow>
        <meshStandardMaterial color={palette.frame} roughness={0.75} />
      </mesh>

      {/* Live Canvas Face */}
      <mesh geometry={faceGeo} position={[0, 0, 0.053]}>
        <meshStandardMaterial
          map={texture}
          roughness={0.65}
          emissive={roomTheme === "midnight" ? "#1E293B" : "#000000"}
          emissiveIntensity={roomTheme === "midnight" ? 0.35 : 0}
        />
      </mesh>

      {/* Corner Mounting Pins */}
      {[
        [-1.26, 0.66],
        [1.26, 0.66],
      ].map(([px, py], i) => (
        <mesh
          key={i}
          geometry={pinGeo}
          position={[px, py, 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#080808" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
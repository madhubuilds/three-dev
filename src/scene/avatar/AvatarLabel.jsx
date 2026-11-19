import { Html } from "@react-three/drei";

export function AvatarLabel({ username = "Player", message = "" }) {
  return (
    <Html
      position={[0, 3.25, 0]} // Sits cleanly above the hair
      center 
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          fontFamily: "sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {/* Chat Bubble (only renders when there is a message) */}
        {message && (
          <div
            style={{
              background: "#FFFFFF",
              color: "#080808",
              border: "2px solid #080808",
              boxShadow: "3px 3px 0px #080808",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "bold",
              maxWidth: "180px",
              whiteSpace: "normal",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* Username Tag */}
        <div
          style={{
            background: "#080808",
            color: "#FFE600",
            padding: "3px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          @{username}
        </div>
      </div>
    </Html>
  );
}

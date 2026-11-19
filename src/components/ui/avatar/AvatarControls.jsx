const ANIMATIONS = ["idle", "walk", "wave"];

export function AvatarControls({ animation, setAnimation, colors, setColors }) {
  const updateColor = (part, value) => {
    setColors((prev) => ({ ...prev, [part]: value }));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        background: "#FFFFFF",
        border: "3px solid #080808",
        boxShadow: "4px 4px 0px #080808",
        padding: "16px",
        width: "220px",
        fontFamily: "sans-serif",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          fontSize: "14px",
          textTransform: "uppercase",
        }}
      >
        Animation
      </h3>

      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {ANIMATIONS.map((anim) => (
          <button
            key={anim}
            onClick={() => setAnimation(anim)}
            style={{
              flex: 1,
              padding: "6px 0",
              cursor: "pointer",
              fontWeight: "bold",
              textTransform: "capitalize",
              border: "2px solid #080808",
              background: animation === anim ? "#FF5A1F" : "#FFFFFF",
              color: animation === anim ? "#FFFFFF" : "#080808",
            }}
          >
            {anim}
          </button>
        ))}
      </div>

      <h3
        style={{
          margin: "0 0 10px 0",
          fontSize: "14px",
          textTransform: "uppercase",
        }}
      >
        Customize Outfit
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { key: "skin", label: "Skin" },
          { key: "hair", label: "Hair" },
          { key: "shirt", label: "Shirt" },
          { key: "pants", label: "Pants" },
        ].map(({ key, label }) => (
          <label
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {label}
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => updateColor(key, e.target.value)}
              style={{
                width: "36px",
                height: "26px",
                border: "2px solid #080808",
                cursor: "pointer",
                padding: 0,
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

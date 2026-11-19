import { Environment, Lightformer } from "@react-three/drei";

export function SceneLighting() {
  return (
    <>
      {/* Replaces flat ambientLight: warm cream from above, caramel bounce from below */}
      <hemisphereLight args={["#FFF3E0", "#B57644", 0.7]} />

      {/* Main Window Sunlight (from left/front-left casting soft diagonal shadows) */}
      <directionalLight
        position={[-8, 15, 7]}
        intensity={1.7}
        color="#FFE2C2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Soft opposite rim light so back edges stay readable */}
      <directionalLight position={[8, 6, -6]} intensity={0.35} color="#FFD2A6" />

      {/* Warm Desk Lamp Pool of Light */}
      <pointLight
        position={[-3.2, 2.0, -5.0]}
        intensity={3.5}
        distance={6}
        decay={2}
        color="#FF9D42"
      />

      {/* Lightweight Procedural Studio Bounce (Zero external HDRI download) */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#FFF5E6"
          scale={[12, 12, 1]}
          position={[0, 10, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#FFD8B1"
          scale={[8, 6, 1]}
          position={[-10, 4, 2]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#C98A56"
          scale={[10, 10, 1]}
          position={[10, 2, 8]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </Environment>
    </>
  );
}
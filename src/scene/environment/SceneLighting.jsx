import { ContactShadows, Environment } from '@react-three/drei'

export function SceneLighting() {
  return (
    <>
      {/* 1. Soft sky-to-ground bounce */}
      <hemisphereLight args={['#ffffff', '#8d99ae', 0.6]} />

      {/* 2. Key Light: Main sun from front-right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />

      {/* 3. Rim Light: Warm highlight from back-left */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.8}
        color="#FFE600"
      />

      {/* 4. Subtle real-world reflections */}
      <Environment preset="city" environmentIntensity={0.3} />

      {/* 5. Soft shadow right beneath the feet */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  )
}
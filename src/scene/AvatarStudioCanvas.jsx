import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SceneLighting } from './environment/SceneLighting'
import { RobloxAvatar } from './avatar/RobloxAvatar'
import { useAvatarStore } from '../store/useAvatarStore'

export function AvatarStudioCanvas() {
  const { username, animation, colors } = useAvatarStore()

  return (
    <div className="h-full w-full touch-none">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2.2, 4.5], fov: 45 }}>
        <color attach="background" args={['#FFE600']} />
        <SceneLighting />

        <RobloxAvatar
          position={[0, 0, 0]}
          username={username}
          animation={animation}
          skinColor={colors.skin}
          hairColor={colors.hair}
          shirtColor={colors.shirt}
          pantsColor={colors.pants}
        />

        {/* Studio Pedestal */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[1.4, 1.5, 0.1, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        <OrbitControls
          target={[0, 1.35, 0]}
          enablePan={false}
          minDistance={3}
          maxDistance={6.5}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
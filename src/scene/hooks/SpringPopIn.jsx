import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SpringPopIn({ children, delay = 0, targetScale = 1 }) {
  const groupRef = useRef();
  const elapsed = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current || !groupRef.current) return;

    elapsed.current += Math.min(delta, 0.1);
    if (elapsed.current < delay) {
      groupRef.current.scale.setScalar(0.001);
      return;
    }

    const t = Math.min((elapsed.current - delay) / 0.38, 1);
    // Elastic overshoot curve
    const easeOutBack =
      1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
    const s = THREE.MathUtils.clamp(easeOutBack, 0.001, 1.15) * targetScale;

    groupRef.current.scale.setScalar(s);
    if (t >= 1) {
      groupRef.current.scale.setScalar(targetScale);
      done.current = true;
    }
  });

  return (
    <group ref={groupRef} scale={0.001}>
      {children}
    </group>
  );
}
import { useEffect } from "react";
import {
  registerCollider,
  unregisterCollider,
} from "../../store/useAvatarStore";

export function useCollider(id, x, z, halfW, halfD) {
  useEffect(() => {
    registerCollider(id, { x, z, halfW, halfD });
    return () => unregisterCollider(id);
  }, [id, x, z, halfW, halfD]);
}
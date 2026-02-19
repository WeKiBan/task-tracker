import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStore } from "@/hooks/use-store";

export function AuthSync() {
  const { setUserId, setAuthReady, loadFromCloud, resetForSignOut } = useStore();

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resetForSignOut();
        return;
      }

      setUserId(user.uid);
      await loadFromCloud();
    });

    return unsubscribe;
  }, [loadFromCloud, resetForSignOut, setAuthReady, setUserId]);

  return null;
}

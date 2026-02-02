import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";

export type SessionStatus = 
  | "loading" 
  | "unauthenticated" 
  | "needs-setup" 
  | "ready";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      setUser(firebaseUser);

      try {
        const setupSnap = await getDoc(
          doc(db, "users", firebaseUser.uid, "setup", "status")
        );

        if (setupSnap.exists() && setupSnap.data().completed) {
          setStatus("ready");
        } else {
          setStatus("needs-setup");
        }
      } catch {
        setStatus("needs-setup");
      }
    });

    return unsubscribe;
  }, []);

  return { user, status };
}

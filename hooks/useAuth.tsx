// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      
      const storedUID = await AsyncStorage.getItem("userUID");
      if (storedUID) {
      
        setUser({ uid: storedUID } as User);
      }

      
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          AsyncStorage.setItem("userUID", firebaseUser.uid);
        } else {
          setUser(null);
          AsyncStorage.removeItem("userUID");
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    restoreSession();
  }, []);

  return { user, loading };
}

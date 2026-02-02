import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config/firebase";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
    
      await signOut(auth);

      await AsyncStorage.multiRemove([
        "userUID",
        "uid",
      ]);
   
      router.replace("/_auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "Please try again.");
    }
  };

  return { logout };
}

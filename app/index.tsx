import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const { height } = Dimensions.get("window");
const isSmallScreen = height < 700;

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const decideRoute = async () => {
      if (loading) return;

      if (!user) {
        router.replace("/_auth/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

      
        if (!userSnap.exists()) {
          router.replace("/_auth/register");
        }
      
        else {
          router.replace("/_auth/login");
        }
      } catch (error) {
        console.error("Index routing error:", error);
        router.replace("/_auth/login");
      } finally {
        setChecking(false);
      }
    };

    decideRoute();
  }, [user, loading]);

  // Hard loading gate (no UI flicker)
  if (loading || checking) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.surface,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Fallback UI (almost never visible)
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Image
            source={require("../assets/pawfeed.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>
            PawFeed
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Preparing your experience…
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

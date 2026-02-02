import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/useTheme";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");
const isSmallScreen = height < 700;

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading } = useAuth();

  const [checking, setChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (loading) return;

      try {
      
        if (!user) {
          setShowOnboarding(true);
          setChecking(false);
          return;
        }

        const onboardingCompleted = await AsyncStorage.getItem("onboardingCompleted");
        if (onboardingCompleted === "true") {
          router.replace("/main/dashboard");
          return;
        }

        setShowOnboarding(true);
      } catch (err) {
        console.error("Session check error:", err);
        setShowOnboarding(true);
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [user, loading]);

  const handleGetStarted = () => {
    router.push("/_auth/register");
  };

  if (loading || checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.surface,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!showOnboarding) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.diagonalBackground, { backgroundColor: theme.background }]} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome to{"\n"}PawFeed
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.primary + "20" }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>
                Smart Pet Care
              </Text>
            </View>
          </View>

          <View style={styles.logoContainer}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.primary + "30",
                  shadowColor: "#000",
                },
              ]}
            >
              <Image
                source={require("../assets/pawfeed.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Ensuring your furry friends never miss a meal.
          </Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Follow the setup guide to connect your PawFeed device and start managing your pet's feeding schedule with ease and convenience.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportButton}>
            <Text style={[styles.helpText, { color: theme.muted }]}>
              Need help? Visit support center
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  diagonalBackground: {
    position: "absolute",
    top: -height * 0.1,
    left: 0,
    right: 0,
    height: height * 0.45,
    transform: [{ skewY: "-10deg" }],
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 30,
    paddingTop: isSmallScreen ? 30 : 50,
    height: height * 0.32,
  },
  titleContainer: { flex: 1, paddingTop: 10 },
  title: { fontSize: isSmallScreen ? 34 : 42, fontWeight: "900", letterSpacing: -1, lineHeight: isSmallScreen ? 38 : 46 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 12 },
  badgeText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  logoContainer: { justifyContent: "center", alignItems: "center" },
  iconCircle: {
    width: isSmallScreen ? 90 : 110,
    height: isSmallScreen ? 90 : 110,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  logoImage: { width: "75%", height: "75%" },
  content: { flex: 1, paddingHorizontal: 35, justifyContent: "center", marginTop: -20 },
  subtitle: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 15, lineHeight: 28 },
  description: { fontSize: 16, textAlign: "center", lineHeight: 24, paddingHorizontal: 10 },
  footer: { paddingHorizontal: 30, paddingBottom: isSmallScreen ? 30 : 50 },
  button: { paddingVertical: 18, borderRadius: 18, alignItems: "center", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  supportButton: { marginTop: 20, paddingVertical: 10 },
  helpText: { textAlign: "center", fontSize: 14, fontWeight: "600", textDecorationLine: "underline" },
});

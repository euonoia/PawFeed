import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme"; // Adjust this path to your actual file

const { height } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const theme = useTheme(); 

  const handleGetStarted = () => {
    router.push("/_setup/PowerOn");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Background Gray Section with Diagonal Cut */}
      <View style={[styles.grayBackground, { backgroundColor: theme.background }]} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Top Left Text */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome to{"\n"}PawFeed
            </Text>
          </View>

          {/* Logo Section (Right Side) */}
          <View style={styles.logoContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
              <Ionicons name="paw" size={60} color={theme.primary} />
            </View>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Let’s get your device connected so your furry friends never miss a meal.
          </Text>
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor:theme.primary, shadowColor: theme.primary }]} 
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.helpText, { color: theme.muted }]}>
              Need help? Visit support
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grayBackground: {
    position: "absolute",
    top: -50,
    left: 0,
    right: 0,
    height: height * 0.45,
    transform: [{ skewY: "-10deg" }],
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 60,
    height: height * 0.35,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    fontFamily: "System", 
    lineHeight: 48,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    padding: 20,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    fontFamily: "System",
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF", // Keep white for contrast on primary button
    fontSize: 20,
    fontWeight: "700",
  },
  helpText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
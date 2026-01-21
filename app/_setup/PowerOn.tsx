import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

const { height } = Dimensions.get("window");

export default function PowerOn() {
  const router = useRouter();
  const theme = useTheme(); // Accessing the full theme object

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.primary, width: "20%" }]} />
      </View>

      <View style={styles.content}>
        {/* Step Indicator */}
        <Text style={[styles.stepText, { color: theme.primary }]}>STEP 1 OF 3</Text>
        <Text style={[styles.title, { color: theme.text }]}>Power On</Text>

        {/* Visual Illustration Area */}
        <View style={[styles.illustrationContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.pulseContainer, { backgroundColor: theme.surface }]}>
            <Ionicons name="power" size={80} color={theme.primary} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionBox}>
          <Text style={[styles.text, { color: theme.text }]}>
            Plug in your PawFeed device. Look for a blinking light to confirm it's ready.
          </Text>
          
          <View style={[styles.wifiCard, { backgroundColor: theme.background }]}>
            <Ionicons name="wifi" size={20} color={theme.primary} style={{ marginRight: 10 }} />
            <Text style={[styles.wifiText, { color: theme.text }]}>
              Broadcasting: <Text style={styles.bold}>PawFeed_XXXX</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={() => router.push("/_setup/ConnectDevice")}
        >
          <Text style={styles.buttonText}>I've Plugged It In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: theme.muted }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    height: 4,
    width: "100%",
    backgroundColor: "#E0E0E0",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: "System",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 30,
    fontFamily: "System",
  },
  illustrationContainer: {
    height: height * 0.25,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  pulseContainer: {
    padding: 20,
    borderRadius: 60,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  instructionBox: {
    gap: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    fontFamily: "System",
  },
  wifiCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#CCC",
  },
  wifiText: {
    fontSize: 16,
    fontFamily: "System",
  },
  bold: {
    fontWeight: "800",
  },
  footer: {
    padding: 30,
    gap: 15,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  backText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
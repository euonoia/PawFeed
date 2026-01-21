import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

const { height } = Dimensions.get("window");
const isSmallScreen = height < 700; // Detection for smaller devices

export default function EnterWifi() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      
      {/* 🟢 PROGRESS BAR (Pinned to top) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.primary, width: "80%" }]} />
      </View>

      <View style={styles.mainContainer}>
        {/* Top Section: Header & Step */}
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>STEP 4 OF 5</Text>
          <Text style={[styles.title, { color: theme.text }]}>Wi-Fi Credentials</Text>
        </View>

        {/* Middle Section: Warning & Instructions (Flex 1 makes this occupy available space) */}
        <View style={styles.body}>
          <View style={[styles.warningCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary }]}>
            <Ionicons name="alert-circle" size={isSmallScreen ? 20 : 24} color={theme.primary} />
            <View style={styles.warningTextContainer}>
              <Text style={[styles.warningTitle, { color: theme.primary }]}>2.4GHz Required</Text>
              <Text style={[styles.warningDescription, { color: theme.text }]} numberOfLines={2}>
                PawFeed does not support 5GHz. Use a 2.4GHz signal.
              </Text>
            </View>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={[styles.instructionText, { color: theme.text }]}>
              In the browser window, enter your home Wi-Fi details.
            </Text>

            <View style={styles.bulletPointContainer}>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                <Text style={[styles.bulletText, { color: theme.muted }]}>Check for typos in password.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                <Text style={[styles.bulletText, { color: theme.muted }]}>Device will blink blue when ready.</Text>
              </View>
            </View>
          </View>

          {!isSmallScreen && (
            <View style={[styles.noteBox, { backgroundColor: theme.background }]}>
              <Text style={[styles.subNote, { color: theme.muted }]}>
                <Text style={styles.bold}>Note: </Text>
                Pawfeed will restart after entering Wi-Fi details.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Section: Navigation (Naturally pushed to bottom) */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]} 
            onPress={() => router.push("/_setup/VerifyConnection")}
          >
            <Text style={styles.buttonText}>I've Entered the Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.muted }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  progressContainer: {
    height: 4,
    width: "100%",
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: isSmallScreen ? 15 : 30,
    justifyContent: 'space-between', // Pushes footer to bottom
  },
  header: {
    marginBottom: isSmallScreen ? 10 : 20,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: "800",
  },
  body: {
    flex: 1,
    justifyContent: 'center', // Centers content vertically in the middle space
  },
  warningCard: {
    flexDirection: 'row',
    padding: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: isSmallScreen ? 15 : 25,
    gap: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  warningDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  instructionContainer: {
    gap: 12,
  },
  instructionText: {
    fontSize: isSmallScreen ? 16 : 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  bulletPointContainer: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletText: {
    fontSize: 14,
  },
  noteBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
  },
  subNote: {
    fontSize: 13,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '800',
  },
  footer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    paddingVertical: isSmallScreen ? 14 : 18,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: 'underline',
  },
});
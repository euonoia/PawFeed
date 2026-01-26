import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

export default function PowerOn() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Visual Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: theme.background }]}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary, width: "33%" }]} />
      </View>

      <View style={styles.content}>
        <View>
          <Text style={[styles.stepLabel, { color: theme.primary }]}>STEP 1 OF 3</Text>
          <Text style={[styles.title, { color: theme.text }]}>Power On</Text>
        </View>

        {/* Central Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
            <Ionicons name="power" size={60} color={theme.primary} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={[styles.description, { color: theme.text }]}>
            Plug in your <Text style={[styles.bold, { color: theme.text }]}>PawFeed</Text> device. 
            Wait for the status light to turn <Text style={{color: theme.primary, fontWeight: '700'}}>Red</Text>.
          </Text>
          
          <View style={[styles.infoBadge, { backgroundColor: theme.background }]}>
            <Ionicons name="wifi" size={16} color={theme.muted} />
            <Text style={[styles.infoText, { color: theme.muted }]}>Broadcasting: PawFeed_XXXX</Text>
          </View>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
          onPress={() => router.push("/_setup/ConnectDevice")}
        >
          <Text style={styles.buttonText}>I've Plugged It In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
  progressTrack: {
    height: 6,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 50,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  instructionContainer: {
    gap: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
  bold: {
    fontWeight: "700",
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 30,
    gap: 15,
  },
  primaryButton: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Keeping icons for better UX

export default function PowerOn() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Visual Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: "33%" }]} />
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
          <Text style={styles.title}>Power On</Text>
        </View>

        {/* Central Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="power" size={60} color="#FF4B4B" />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={styles.description}>
            Plug in your <Text style={styles.bold}>PawFeed</Text> device. 
            Wait for the status light to turn <Text style={{color: '#FF4B4B', fontWeight: '700'}}>Red</Text>.
          </Text>
          
          <View style={styles.infoBadge}>
            <Ionicons name="wifi" size={16} color="#666" />
            <Text style={styles.infoText}>Broadcasting: PawFeed_XXXX</Text>
          </View>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push("/_setup/ConnectDevice")}
        >
          <Text style={styles.buttonText}>I've Plugged It In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF4B4B", // Change this to your brand color
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
    color: "#FF4B4B",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A1A",
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
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  instructionContainer: {
    gap: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    color: "#444",
    textAlign: "center",
  },
  bold: {
    fontWeight: "700",
    color: "#000",
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F8F8F8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  footer: {
    padding: 30,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#1A1A1A",
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
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
});
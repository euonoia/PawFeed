import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,  Clipboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

export default function ConnectDevice() {
  const router = useRouter();
  const theme = useTheme();

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
   
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Progress Header */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary, width: "66%" }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>STEP 2 OF 3</Text>
          <Text style={[styles.title, { color: theme.text }]}>Connect Wi-Fi</Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            Go to your phone's Wi-Fi settings and connect to the device network.
          </Text>
        </View>

        {/* Credentials Card */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.cardRow}>
            <View>
              <Text style={[styles.label, { color: theme.muted }]}>NETWORK NAME</Text>
              <Text style={[styles.value, { color: theme.text }]}>PawFeed</Text>
            </View>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="wifi" size={20} color={theme.primary} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.muted + '20' }]} />

          <View style={styles.cardRow}>
            <View>
              <Text style={[styles.label, { color: theme.muted }]}>PASSWORD</Text>
              <Text style={[styles.value, { color: theme.text }]}>pawfeed@admin</Text>
            </View>
            <TouchableOpacity 
              onPress={() => copyToClipboard("pawfeed@admin")}
              style={[styles.copyButton, { backgroundColor: theme.surface }]}
            >
              <Ionicons name="copy-outline" size={16} color={theme.primary} />
              <Text style={[styles.copyText, { color: theme.primary }]}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Note */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={theme.muted} />
          <Text style={[styles.infoText, { color: theme.muted }]}>
            This is a temporary connection used only to set up your device.
          </Text>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
          onPress={() => router.push("/_setup/OpenConfigPage")}
        >
          <Text style={styles.buttonText}>I'm Connected</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
    backgroundColor: "#F0F0F0",
  },
  progressFill: {
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  copyText: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 10,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    paddingVertical: 12,
  },
  backText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
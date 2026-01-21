import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Clipboard } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

const { height } = Dimensions.get("window");

export default function ConnectDevice() {
  const router = useRouter();
  const theme = useTheme();

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    // You could add a Toast or Alert here to say "Copied!"
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.primary, width: "40%" }]} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.stepText, { color: theme.primary }]}>STEP 2 OF 3</Text>
        <Text style={[styles.title, { color: theme.text }]}>Connect Wi-Fi</Text>

        <Text style={[styles.description, { color: theme.muted }]}>
          Go to your phone's Wi-Fi settings and connect to the PawFeed network.
        </Text>

        {/* Credentials Card */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: theme.muted }]}>NETWORK NAME</Text>
              <Text style={[styles.value, { color: theme.text }]}>PawFeed</Text>
            </View>
            <Ionicons name="wifi" size={24} color={theme.primary} />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.muted + '33' }]} />

          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: theme.muted }]}>PASSWORD</Text>
              <Text style={[styles.value, { color: theme.text }]}>pawfeed@admin</Text>
            </View>
            <TouchableOpacity 
              onPress={() => copyToClipboard("pawfeed@admin")}
              style={[styles.copyButton, { backgroundColor: theme.surface }]}
            >
              <Ionicons name="copy-outline" size={18} color={theme.primary} />
              <Text style={[styles.copyText, { color: theme.primary }]}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={theme.muted} />
          <Text style={[styles.infoText, { color: theme.muted }]}>
           this is just temporary connection to connect the pawfeed to internet! 
          </Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={() => router.push("/_setup/OpenConfigPage")}
        >
          <Text style={styles.buttonText}>I'm Connected</Text>
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
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  copyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
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
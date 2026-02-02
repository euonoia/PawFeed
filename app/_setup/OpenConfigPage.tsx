import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

export default function OpenConfigPage() {
  const router = useRouter();
  const theme = useTheme();

  const openBrowser = () => Linking.openURL("http://192.168.4.1");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Progress Header */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary, width: "100%" }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.stepText, { color: theme.primary }]}>STEP 3 OF 3</Text>
          <Text style={[styles.title, { color: theme.text }]}>Configure Device</Text>
        </View>

        {/* Validation Check Box */}
        <View style={[styles.statusBox, { backgroundColor: theme.background }]}>
          <View style={[styles.checkCircle, { backgroundColor: theme.success + '20' }]}>
            <Ionicons name="shield-checkmark" size={20} color={theme.success} />
          </View>
          <Text style={[styles.statusText, { color: theme.text }]}>
            Connected to <Text style={styles.boldText}>PawFeed</Text> Wi-Fi
          </Text>
        </View>

        <Text style={[styles.description, { color: theme.muted }]}>
          Now, we need to tell the device which Wi-Fi to use. Tap the card below to open the setup portal.
        </Text>

        {/* Enhanced Browser Action Card */}
        <TouchableOpacity 
          style={[styles.browserCard, { borderColor: theme.primary + '40' }]} 
          onPress={openBrowser}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="globe-outline" size={28} color={theme.primary} />
          </View>
          <View style={styles.browserTextContainer}>
            <Text style={[styles.browserTitle, { color: theme.text }]}>Open Setup Page</Text>
            <Text style={[styles.browserUrl, { color: theme.primary }]}>192.168.4.1</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
          onPress={() => router.push("/_setup/claimDevice")}
        >
          <Text style={styles.buttonText}>I've Finished Setup</Text>
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
    marginBottom: 24,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
  },
  statusBox: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '800',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  browserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  browserTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  browserTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  browserUrl: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
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
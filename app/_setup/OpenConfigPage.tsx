import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

const { height } = Dimensions.get("window");

export default function OpenConfigPage() {
  const router = useRouter();
  const theme = useTheme();

  const openBrowser = () => {
    // Standard ESP8266/ESP32 captive portal IP
    Linking.openURL("http://192.168.4.1");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.primary, width: "60%" }]} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.stepText, { color: theme.primary }]}>STEP 3 OF 3</Text>
        <Text style={[styles.title, { color: theme.text }]}>Configure Device</Text>

        {/* Warning/Status Box */}
        <View style={[styles.statusBox, { backgroundColor: theme.background }]}>
          <Ionicons name="shield-checkmark" size={24} color={theme.success} />
          <Text style={[styles.statusText, { color: theme.text }]}>
            Ensure you are connected to <Text style={styles.bold}>PawFeed</Text> Wi-Fi before proceeding.
          </Text>
        </View>

        <Text style={[styles.description, { color: theme.muted }]}>
          Click the button below to open the device settings. There, you will select your home Wi-Fi and enter its password.
        </Text>

        {/* Browser Action Card */}
        <TouchableOpacity 
          style={[styles.browserCard, { borderColor: theme.primary }]} 
          onPress={openBrowser}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="globe-outline" size={30} color={theme.primary} />
          </View>
          <View style={styles.browserTextContainer}>
            <Text style={[styles.browserTitle, { color: theme.text }]}>Open Setup Page</Text>
            <Text style={[styles.browserUrl, { color: theme.muted }]}>http://192.168.4.1</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={() => router.push("/_setup/claimDevice")}
        >
          <Text style={styles.buttonText}>I've Finished Setup</Text>
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
    marginBottom: 20,
  },
  statusBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  browserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  browserTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  browserTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  browserUrl: {
    fontSize: 14,
    marginTop: 2,
  },
  bold: {
    fontWeight: '800',
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
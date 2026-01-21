import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

const { height } = Dimensions.get("window");
const isSmallScreen = height < 700;

export default function VerifyConnection() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      
      {/* 🟢 PROGRESS BAR (100% Complete) */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.success, width: "100%" }]} />
      </View>

      <View style={styles.mainWrapper}>
        {/* Top Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.stepText, { color: theme.success }]}>FINAL STEP</Text>
          <Text style={[styles.title, { color: theme.text }]}>All Set!</Text>
        </View>

        {/* Flexible Center Section */}
        <View style={styles.centerSection}>
          <View style={[
            styles.successCircle, 
            { backgroundColor: theme.success + '15' },
            isSmallScreen && { width: 120, height: 120, borderRadius: 60 }
          ]}>
            <Ionicons 
              name="checkmark-circle" 
              size={isSmallScreen ? 80 : 120} 
              color={theme.success} 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.headline, { color: theme.text }]}>
              Connection Verified
            </Text>
            <Text style={[styles.description, { color: theme.muted }]} numberOfLines={3}>
              Your PawFeed device is now online. Your pets are going to love this!
            </Text>
          </View>
        </View>

        {/* Bottom Section: Tip & Button */}
        <View style={styles.bottomSection}>
          <View style={[styles.tipCard, { backgroundColor: theme.background }]}>
            <Ionicons name="bulb-outline" size={20} color={theme.primary} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              You can now set feeding schedules from your dashboard.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]} 
            onPress={() => router.replace("/main/home")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Finish Setup</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
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
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: isSmallScreen ? 10 : 30,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginBottom: isSmallScreen ? 10 : 20,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: "800",
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 15 : 25,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headline: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomSection: {
    gap: 16,
    marginBottom: isSmallScreen ? 10 : 20,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: isSmallScreen ? 14 : 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
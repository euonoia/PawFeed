import { View, StyleSheet, Text } from "react-native";
import { Slot } from "expo-router";
import { useTheme } from "@/theme/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar"; 
export default function SetupLayout() {
  const theme = useTheme();

  const isDark = theme.background === "#0F172A"; 

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Modern Minimal Header */}
      <SafeAreaView edges={['top']} style={[styles.header, { borderBottomColor: theme.background + '40' }]}>
        <Text style={[styles.headerText, { color: theme.text }]}>
          PawFeed Setup
        </Text>
      </SafeAreaView>

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1, 
    backgroundColor: "transparent",
  },
  headerText: { 
    fontSize: 18, 
    fontWeight: "800",
    letterSpacing: -0.5,
    fontFamily: "System",
  },
  content: { 
    flex: 1, 
  },
});
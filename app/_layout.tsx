import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useTheme } from "@/theme/useTheme";

export default function RootLayout() {
  const theme = useTheme();

  // Check if current theme is dark to set the System UI style
  const isDark = theme.text === "#F8FAFC" || theme.text === "#E5E7EB";

  return (
    // Wrap the stack in a themed View to prevent white flashes during transitions
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      {/* Set global status bar and navigation bar style */}
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <Stack
        screenOptions={{
          headerShown: false,
          // This ensures the background color of the navigator matches your theme
          contentStyle: { backgroundColor: theme.surface },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="main" />
        <Stack.Screen name="_setup" />
      </Stack>
    </View>
  );
}
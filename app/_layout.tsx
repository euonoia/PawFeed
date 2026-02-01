import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/theme/useTheme";
import { useAuth } from "@/hooks/useAuth";

export default function RootLayout() {
  const theme = useTheme();
  const { user, loading } = useAuth();

  const isDark = theme.text === "#F8FAFC" || theme.text === "#E5E7EB";


  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.surface,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.surface },
        }}
      >
       
        {!user && <Stack.Screen name="_auth" />}

       
        {user && <Stack.Screen name="main" />}

      
        <Stack.Screen name="_setup" />
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}

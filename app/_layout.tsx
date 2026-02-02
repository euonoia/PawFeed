import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/theme/useTheme";
import { useSession, SessionStatus } from "@/hooks/useSession";

export default function RootLayout() {
  const theme = useTheme();
  const { user, status } = useSession();

  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.surface }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
     
      {status === "unauthenticated" && <Stack.Screen name="_auth" />}

  
      {status === "needs-setup" && <Stack.Screen name="_setup" />}

      
      {status === "ready" && <Stack.Screen name="main" />}

     
      <Stack.Screen name="index" />
    </Stack>
  );
}

import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/theme/useTheme";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const theme = useTheme();
  const { user, status } = useSession();

  if (status === "loading") {
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="_auth" />
      <Stack.Screen name="_setup" />
      <Stack.Screen name="main" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";
import { auth } from "@/config/firebase";

export default function TabsLayout() {
  const theme = useTheme();

  if (!auth.currentUser) {
    return <Redirect href="/_auth/login" />;
  }

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.secondary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="controller"
        options={{
          title: "Controller",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

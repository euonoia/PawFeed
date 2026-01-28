import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";
import { auth } from "@/config/firebase";

export default function TabsLayout() {
  const theme = useTheme();

  // Basic auth guard
  if (!auth.currentUser) {
    return <Redirect href="/_auth/login" />;
  }

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        // Using Primary to match the buttons and "Step" text color
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          height: 70, // Slightly taller for a more premium feel
          paddingBottom: 12,
          paddingTop: 10,
          borderTopWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          elevation: 0, // Flat look
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800", // Bold weights consistent with Setup UI
          letterSpacing: 0.5,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "DASHBOARD",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="controller"
        options={{
          title: "CONTROLLER",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "game-controller" : "game-controller-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
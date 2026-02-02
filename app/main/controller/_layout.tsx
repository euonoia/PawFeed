import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";
import { useSession, SessionStatus } from "@/hooks/useSession";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function ControllerLayout() {
  const theme = useTheme();
  const { user, status } = useSession();

 
  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.surface }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  
  if (status === "unauthenticated") {
    return <Redirect href="/_auth/login" />;
  }


  if (status === "needs-setup") {
    return <Redirect href="/_setup/PowerOn" />;
  }

  
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "800",
          letterSpacing: 0.5,
          color: theme.text,
        },
        headerTintColor: theme.text,
        drawerStyle: {
          backgroundColor: theme.surface,
          width: 280,
          borderRightWidth: 1,
          borderColor: "rgba(0,0,0,0.05)",
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.muted,
        drawerActiveBackgroundColor: theme.primary + "10",
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: "700",
          marginLeft: -10,
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 12,
        },
      }}
    >
      <Drawer.Screen
        name="manualFeed"
        options={{
          title: "Manual Feed",
          drawerLabel: "Manual Feed",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="schedule"
        options={{
          title: "Feeding Schedule",
          drawerLabel: "Schedule",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

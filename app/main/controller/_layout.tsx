import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

export default function ControllerLayout() {
  const theme = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        drawerStyle: {
          backgroundColor: theme.surface,
          width: 260,
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Manual Feed",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="schedule"
        options={{
          title: "Schedule",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
    
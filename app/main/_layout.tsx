import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";
import { useSession, SessionStatus } from "@/hooks/useSession";

export default function TabsLayout() {
  const theme = useTheme();
  const { user, status } = useSession();

  if (status === "loading") return null;

  // Redirect based on session status
  if (status === "unauthenticated") return <Redirect href="/_auth/login" />;
  if (status === "needs-setup") return <Redirect href="/_setup/PowerOn" />;

  // ready → allow tabs
  if (status === "ready") {
    return (
      <Tabs
        initialRouteName="dashboard"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.muted,
          tabBarStyle: {
            backgroundColor: theme.surface,
            height: 70,
            paddingBottom: 12,
            paddingTop: 10,
            borderTopWidth: 1,
            borderColor: "rgba(0,0,0,0.05)",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "800",
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

  return null; // fallback if status is unknown
}

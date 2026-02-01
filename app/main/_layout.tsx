import React, { useEffect, useState } from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/theme/useTheme";
import { auth } from "@/config/firebase";

export default function TabsLayout() {
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    const checkUser = async () => {
      try {
        // First check Firebase memory currentUser
        if (auth.currentUser) {
          setIsLoggedIn(true);
          // Save UID to AsyncStorage
          await AsyncStorage.setItem("userUID", auth.currentUser.uid);
          return;
        }

        // Check AsyncStorage if app was reloaded
        const storedUID = await AsyncStorage.getItem("userUID");
        if (storedUID) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error checking login state:", err);
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, []);

  // Show loading while checking
  if (isLoggedIn === null) return null;

  // Redirect if not logged in
  if (!isLoggedIn) return <Redirect href="/_auth/login" />;

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

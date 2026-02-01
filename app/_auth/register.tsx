import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, rtdb } from "@/config/firebase";
import { ref, get } from "firebase/database";
import { useTheme } from "@/theme/useTheme";

export default function Register() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user already owns a device
  const checkExistingDevice = async (uid: string) => {
    try {
      const snapshot = await get(ref(rtdb, "devices/feeder_001/owner"));
      if (snapshot.exists() && snapshot.val() === uid) {
        router.replace("/main/dashboard"); 
      }
    } catch (error) {
      console.log("Error checking existing device:", error);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await checkExistingDevice(userCredential.user.uid);
      router.replace("/_setup/PowerOn");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 30, justifyContent: "center", backgroundColor: theme.surface }}>
      <Text style={{ fontSize: 32, fontWeight: "800", color: theme.text }}>Create Account</Text>
      <Text style={{ fontSize: 16, color: theme.muted, marginBottom: 20 }}>Sign up to setup your PawFeed device</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ padding: 16, marginBottom: 12, borderRadius: 12, backgroundColor: theme.background, color: theme.text }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ padding: 16, marginBottom: 12, borderRadius: 12, backgroundColor: theme.background, color: theme.text }}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ padding: 16, marginBottom: 20, borderRadius: 12, backgroundColor: theme.background, color: theme.text }}
      />

      <TouchableOpacity
        style={{ padding: 16, borderRadius: 16, backgroundColor: theme.primary, alignItems: "center" }}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: "#FFF", fontWeight: "700" }}>Create Account</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

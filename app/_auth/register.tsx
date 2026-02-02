import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, rtdb } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";

export default function Register() {
  const theme = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

     
      await setDoc(doc(db, "users", uid), {
        email: email.trim(),
        createdAt: new Date(),
      });

      
      await setDoc(doc(db, "users", uid, "setup", "status"), {
        completed: false,
      });

    
      router.replace("/_setup/PowerOn");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 30, justifyContent: "center", backgroundColor: theme.surface }}
    >
      <Text style={{ fontSize: 32, fontWeight: "800", color: theme.text }}>
        Create Account
      </Text>
      <Text style={{ fontSize: 16, color: theme.muted, marginBottom: 20 }}>
        Sign up to setup your PawFeed device
      </Text>

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
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={{ color: "#FFF", fontWeight: "700" }}>Create Account</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
 
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useTheme } from "@/theme/useTheme";

export default function Login() {
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/main/dashboard");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Welcome Back
        </Text>

        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Sign in to continue using your PawFeed 
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/_auth/register")}>
          <Text style={[styles.link, { color: theme.primary }]}>
            Don’t have an account? Create one
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  link: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
});

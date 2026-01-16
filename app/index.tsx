import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/_setup/PowerOn");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PawFeed!</Text>
      <Text style={styles.subtitle}>
        Let's get your PawFeed device connected to your home Wi-Fi so it can start feeding your pets automatically.
      </Text>
      <Button title="Get Started" onPress={handleGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 32 },
});

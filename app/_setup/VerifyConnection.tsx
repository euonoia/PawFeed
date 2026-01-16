import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function VerifyConnection() {
  const router = useRouter();

  return (
    <View>
      <Text style={styles.title}>Step 5: Verify Connection</Text>
      <Text style={styles.text}>
        Once your PawFeed device reconnects to your home Wi-Fi, it is ready to use! You can now start controlling PawFeed from your app.
      </Text>
      <Button title="Finish Setup" onPress={() => router.replace("/main/home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 24 },
});

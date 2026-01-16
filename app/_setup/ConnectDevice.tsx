import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ConnectDevice() {
  const router = useRouter();

  return (
    <View>
      <Text style={styles.title}>Step 2: Connect to the Device</Text>
      <Text style={styles.text}>
        On your phone or computer, go to Wi-Fi settings and connect to the <Text style={styles.bold}>PawFeed</Text> network. Password: <Text style={styles.bold}>pawfeed@admin</Text>.
      </Text>
      <Button title="Next" onPress={() => router.push("/_setup/OpenConfigPage")} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 24 },
  bold: { fontWeight: "700" },
});

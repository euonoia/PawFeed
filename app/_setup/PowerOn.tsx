import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function PowerOn() {
  const router = useRouter();

  return (
    <View>
      <Text style={styles.title}>Step 1: Power On</Text>
      <Text style={styles.text}>
        Make sure your PawFeed device is plugged in and powered on. The device will start broadcasting a Wi-Fi network called <Text style={styles.bold}>PawFeed</Text>.
      </Text>
      <Button title="Next" onPress={() => router.push("/_setup/ConnectDevice")} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 24 },
  bold: { fontWeight: "700" },
});

import { View, Text, Button, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function OpenConfigPage() {
  const router = useRouter();

  const openBrowser = () => {
    Linking.openURL("http://192.168.4.1");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 3: Open Configuration Page</Text>
      <Text style={styles.text}>
        On the PawFeed configuration page, you can enter your home Wi-Fi credentials so the device can connect to your network. make sure you are connected
        to PawFeed Wi-Fi before opening the page.
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Open Setup Page" onPress={openBrowser} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={() => router.push("/_setup/EnterWifi")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 24, lineHeight: 22 },
  bold: { fontWeight: "700" },
  buttonContainer: { marginVertical: 8 },
});

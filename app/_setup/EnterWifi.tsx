import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function EnterWifi() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step 4: Enter Wi-Fi Credentials</Text>
      <Text style={styles.text}>
        Please enter your home Wi-Fi network credentials so your PawFeed device can connect. 
        <Text style={styles.bold}> Note:</Text> PawFeed only supports <Text style={styles.bold}>2.4 GHz Wi-Fi networks</Text>. 
        If you are using a 5 GHz or dual-band network, make sure to connect to the 2.4 GHz band.
      </Text>

      <Text style={styles.text}>
        Make sure you type your wifi name and password correctly. After entering the credentials, the PawFeed device will save them and restart to connect to your Wi-Fi.
      </Text>

      <View style={styles.buttonContainer}>
        <Button 
          title="Next" 
          onPress={() => router.push("/_setup/VerifyConnection")} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 16, lineHeight: 22 },
  bold: { fontWeight: "700" },
  buttonContainer: { marginTop: 16 },
});

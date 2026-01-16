import { View, ScrollView, StyleSheet, Text } from "react-native";
import { Slot } from "expo-router";

export default function SetupLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PawFeed Setup</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Slot />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingTop: 15,
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  content: { padding: 24 },
});

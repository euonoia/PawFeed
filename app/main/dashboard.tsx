import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/useTheme";

export default function dashboard() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Pet Feeder Dashboard
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.muted }]}>Device Status</Text>
        <Text style={[styles.value, { color: theme.text }]}>Online</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.muted }]}>Last Feeding</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          Today — 07:00 AM
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.muted }]}>Food Level</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          85%
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
  },
});

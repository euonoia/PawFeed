import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HTMLElements() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HTML Elements</Text>
      <Button title="Next: HTML Exam" onPress={() => router.push('/lessons/html-exam')} />
      <Button title="Back: HTML Basics" onPress={() => router.push('/lessons/html-basics')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});

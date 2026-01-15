import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function GreetingsLesson() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Greetings Lesson</Text>
      <Button title="Next: HTML Basics" onPress={() => router.push('/lessons/html-basics')} />
      <Button title="Back to Dashboard" onPress={() => router.push('/dashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});

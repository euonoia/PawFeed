import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HTMLBasics() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HTML Basics</Text>
      <Button title="Next: HTML Elements" onPress={() => router.push('/lessons/html-elements')} />
      <Button title="Back: Greetings" onPress={() => router.push('/lessons/greetings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});

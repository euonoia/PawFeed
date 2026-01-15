import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HTMLExam() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HTML Exam</Text>
      <Button title="Back: HTML Elements" onPress={() => router.push('/lessons/html-elements')} />
      <Button title="Back to Dashboard" onPress={() => router.push('/dashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});

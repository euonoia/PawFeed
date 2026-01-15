import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="Go to Dashboard"
        onPress={() => router.push('/dashboard')}
      />
      <Button
        title="Start Lessons"
        onPress={() => router.push('/lessons/greetings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});

import { Stack } from 'expo-router';

export default function LessonsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="greetings" options={{ title: 'Greetings Lesson' }} />
      <Stack.Screen name="html-basics" options={{ title: 'HTML Basics' }} />
      <Stack.Screen name="html-elements" options={{ title: 'HTML Elements' }} />
      <Stack.Screen name="html-exam" options={{ title: 'HTML Exam' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      {/* Public screens and initial routing logic */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />

      {/* Route groups — Expo Router resolves each group's internal _layout */}
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(kiosk)" />
      <Stack.Screen name="(operator)" />
      <Stack.Screen name="(shared)" />
    </Stack>
  );
}

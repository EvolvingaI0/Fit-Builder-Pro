import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="quiz" options={{ title: 'Create Your Profile', presentation: 'modal', headerLeft: () => null, gestureEnabled: false }} />
    </Stack>
  );
}

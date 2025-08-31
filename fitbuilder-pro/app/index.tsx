import { useAuth } from '@/lib/auth';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function StartPage() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }
  
  if (!profile?.goal) {
    return <Redirect href="/onboarding/quiz" />;
  }
  
  return <Redirect href="/(tabs)/dashboard" />;
}

import { Slot, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EnvCheck from '@/components/EnvCheck';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <EnvCheck>
          <RootLayoutNav />
        </EnvCheck>
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

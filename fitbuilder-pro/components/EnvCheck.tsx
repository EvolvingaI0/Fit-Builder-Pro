import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const EnvCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_API_BASE_URL
  } = Constants.expoConfig?.extra ?? {};

  const missingVars = [];
  if (!EXPO_PUBLIC_SUPABASE_URL) missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!EXPO_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  if (!EXPO_PUBLIC_API_BASE_URL) missingVars.push('EXPO_PUBLIC_API_BASE_URL');

  if (missingVars.length > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Configuration Error</Text>
        <Text style={styles.message}>
          The application is missing the following required environment variables:
        </Text>
        <View style={styles.list}>
            {missingVars.map(v => <Text key={v} style={styles.listItem}>- {v}</Text>)}
        </View>
        <Text style={styles.message}>
          Please copy `.env.example` to a new `.env` file and fill in the values. Then, restart the application.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fef2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  list: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  listItem: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#b91c1c',
  }
});

export default EnvCheck;

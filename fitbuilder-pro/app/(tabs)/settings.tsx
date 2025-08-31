import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { UserProfile } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';

export default function SettingsScreen() {
  const { session, profile, setProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
    }
  }, [profile]);
  
  if (!profile) {
      return <Spinner />;
  }

  async function updateProfile() {
    if (!session) return;
    setLoading(true);
    try {
      const updates = {
        id: session.user.id,
        name,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      setProfile({ ...profile, name });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.form}>
        <Input
          label="Email"
          value={session?.user?.email || ''}
          disabled
        />
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Update Profile" onPress={updateProfile} loading={loading} />
      </View>
      <Button title="Sign Out" onPress={signOut} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F7F8FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  }
});

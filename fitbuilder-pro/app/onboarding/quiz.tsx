import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function OnboardingQuiz() {
  const { session, profile, setProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'other'>('male');
  const [goal, setGoal] = useState<'lose_fat' | 'gain_muscle' | 'maintain'>('lose_fat');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('sedentary');

  async function handleSubmit() {
    if (!weight || !height || !age) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    
    const userSettings = {
      user_id: session!.user.id,
      weight_kg: parseFloat(weight),
      height_cm: parseFloat(height),
      age: parseInt(age, 10),
      sex,
      goal,
      activity_level: activityLevel,
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. Save settings to Supabase
      const { error: upsertError } = await supabase.from('user_settings').upsert(userSettings);
      if (upsertError) throw upsertError;

      // 2. Trigger plan generation on the backend
      await api.post('/plan/generate', {});

      // 3. Update local profile state
      if (profile) {
        setProfile({ ...profile, ...userSettings });
      }

      // 4. Navigate to dashboard
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      Alert.alert('Error', error.message || 'Failed to save settings and generate plan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about yourself</Text>
      <Text style={styles.subtitle}>This helps us create your personalized plan.</Text>
      
      <Input label="Current Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <Input label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
      <Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      
      <SegmentedControl
        label="Sex"
        options={[{label: 'Male', value: 'male'}, {label: 'Female', value: 'female'}, {label: 'Other', value: 'other'}]}
        selectedValue={sex}
        onValueChange={(v) => setSex(v as any)}
      />
      <SegmentedControl
        label="Primary Goal"
        options={[{label: 'Lose Fat', value: 'lose_fat'}, {label: 'Gain Muscle', value: 'gain_muscle'}, {label: 'Maintain', value: 'maintain'}]}
        selectedValue={goal}
        onValueChange={(v) => setGoal(v as any)}
      />
      <SegmentedControl
        label="Activity Level"
        options={[
            {label: 'Sedentary', value: 'sedentary'}, 
            {label: 'Light', value: 'light'}, 
            {label: 'Moderate', value: 'moderate'}, 
            {label: 'Active', value: 'active'}
        ]}
        selectedValue={activityLevel}
        onValueChange={(v) => setActivityLevel(v as any)}
      />

      <Button title="Create My Plan" onPress={handleSubmit} loading={loading} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
});

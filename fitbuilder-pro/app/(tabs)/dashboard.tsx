import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import { Plan, MealLog } from '@/lib/types';
import Card from '@/components/ui/Card';
import MealLogCard from '@/components/MealLogCard';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ErrorState';

export default function DashboardScreen() {
  const { profile } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [recentMeals, setRecentMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch latest plan
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (planError) throw planError;
      setPlan(planData);

      // Fetch recent meals
      const { data: mealsData, error: mealsError } = await supabase
        .from('meal_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (mealsError) throw mealsError;
      setRecentMeals(mealsData);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.greeting}>{getGreeting()}, {profile?.name || 'User'}!</Text>
      
      <Card>
        <Text style={styles.cardTitle}>Your Daily Plan</Text>
        {plan ? (
            <View style={styles.planContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{plan.calories}</Text>
                <Text style={styles.metricLabel}>Calories</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{plan.protein_g}g</Text>
                <Text style={styles.metricLabel}>Protein</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{plan.carbs_g}g</Text>
                <Text style={styles.metricLabel}>Carbs</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{plan.fat_g}g</Text>
                <Text style={styles.metricLabel}>Fat</Text>
              </View>
            </View>
        ) : (
          <Text style={styles.placeholderText}>No plan generated yet. Complete your profile!</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Recent Meals</Text>
        {recentMeals.length > 0 ? (
          recentMeals.map((meal) => <MealLogCard key={meal.id} meal={meal} />)
        ) : (
          <Text style={styles.placeholderText}>No meals analyzed yet. Go to the Analyze tab!</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F8FA',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827'
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6d28d9',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 16,
  },
});

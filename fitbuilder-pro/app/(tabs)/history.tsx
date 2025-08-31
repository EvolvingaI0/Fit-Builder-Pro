import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MealLog } from '@/lib/types';
import MealLogCard from '@/components/MealLogCard';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ErrorState';

const PAGE_SIZE = 10;

export default function HistoryScreen() {
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMealLogs = async (isInitial = false) => {
    if (loadingMore || !hasMore && !isInitial) return;

    const current_page = isInitial ? 0 : page;
    if (isInitial) {
        setLoading(true);
        setError(null);
    } else {
        setLoadingMore(true);
    }

    try {
      const from = current_page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: dbError } = await supabase
        .from('meal_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (dbError) throw dbError;

      if (data) {
        setMealLogs(prev => isInitial ? data : [...prev, ...data]);
        setPage(current_page + 1);
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Failed to fetch meal history.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setHasMore(true);
      fetchMealLogs(true);
    }, [])
  );
  
  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={() => fetchMealLogs(true)} />;

  return (
    <FlatList
      data={mealLogs}
      renderItem={({ item }) => <View style={styles.cardContainer}><MealLogCard meal={item} /></View>}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      onEndReached={() => fetchMealLogs()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals analyzed yet.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#F7F8FA',
  },
  cardContainer: {
    margin: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

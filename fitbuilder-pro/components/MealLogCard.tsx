import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealLog } from '@/lib/types';
import Card from './ui/Card';

interface MealLogCardProps {
  meal: MealLog;
}

const MealLogCard: React.FC<MealLogCardProps> = ({ meal }) => {
  const formattedDate = new Date(meal.created_at).toLocaleString();

  return (
    <Card style={styles.container}>
      <Text style={styles.description}>{meal.description}</Text>
      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.calories}</Text>
          <Text style={styles.macroLabel}>kcal</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.protein_g}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.carbs_g}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{meal.fat_g}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
      </View>
      <Text style={styles.date}>{formattedDate}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6d28d9',
  },
  macroLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
});

export default MealLogCard;

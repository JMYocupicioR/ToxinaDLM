import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SelectedMuscle } from '@/types/dosage';
import { X } from 'lucide-react-native';

interface SelectedMusclesListProps {
  muscles: SelectedMuscle[];
  onMusclesChange: (muscles: SelectedMuscle[]) => void;
}

export function SelectedMusclesList({ muscles, onMusclesChange }: SelectedMusclesListProps) {
  const removeMuscle = (muscleName: string) => {
    onMusclesChange(muscles.filter((m) => m.name !== muscleName));
  };

  const toggleDosageType = (muscle: SelectedMuscle) => {
    const updatedMuscles = muscles.map((m) => {
      if (m.name === muscle.name) {
        const newType = m.dosageType === 'min' ? 'max' : 'min';
        return {
          ...m,
          dosageType: newType,
          baseAmount: newType === 'min' ? m.baseAmount : m.adjustedAmount,
        };
      }
      return m;
    });
    onMusclesChange(updatedMuscles);
  };

  if (muscles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected Muscles</Text>
      {muscles.map((muscle) => (
        <View key={muscle.name} style={styles.muscleItem}>
          <View style={styles.muscleHeader}>
            <Text style={styles.muscleName}>{muscle.name}</Text>
            <TouchableOpacity
              onPress={() => removeMuscle(muscle.name)}
              style={styles.removeButton}>
              <X size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.dosageContainer}>
            <TouchableOpacity
              style={[
                styles.dosageButton,
                muscle.dosageType === 'min' && styles.activeDosageButton,
              ]}
              onPress={() => toggleDosageType(muscle)}>
              <Text
                style={[
                  styles.dosageButtonText,
                  muscle.dosageType === 'min' && styles.activeDosageButtonText,
                ]}>
                Min
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dosageButton,
                muscle.dosageType === 'max' && styles.activeDosageButton,
              ]}
              onPress={() => toggleDosageType(muscle)}>
              <Text
                style={[
                  styles.dosageButtonText,
                  muscle.dosageType === 'max' && styles.activeDosageButtonText,
                ]}>
                Max
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.dosageText}>
            Dose: {muscle.adjustedAmount} U
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  muscleItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  muscleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  muscleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  removeButton: {
    padding: 4,
  },
  dosageContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dosageButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  activeDosageButton: {
    backgroundColor: '#0891b2',
  },
  dosageButtonText: {
    fontSize: 12,
    color: '#334155',
  },
  activeDosageButtonText: {
    color: '#ffffff',
  },
  dosageText: {
    fontSize: 12,
    color: '#64748b',
  },
});
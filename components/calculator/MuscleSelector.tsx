import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ToxinBrand, SelectedMuscle } from '@/types/dosage';
import { toxinData } from '@/data/toxinData';
import { AnatomicalSelector } from '../AnatomicalSelector';
import { ToxinSelector } from '../ToxinSelector';

interface MuscleSelectorProps {
  brand: ToxinBrand;
  selectedMuscles: SelectedMuscle[];
  onMusclesChange: (muscles: SelectedMuscle[]) => void;
}

export function MuscleSelector({ brand, selectedMuscles, onMusclesChange }: MuscleSelectorProps) {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedToxin, setSelectedToxin] = useState('');

  const addMuscle = (muscleName: string) => {
    if (selectedMuscles.some((m) => m.name === muscleName)) {
      return;
    }

    const muscleData = toxinData[brand][muscleName];
    const newMuscle: SelectedMuscle = {
      name: muscleName,
      dosageType: 'min',
      baseAmount: muscleData.min,
      adjustedAmount: muscleData.min,
    };

    onMusclesChange([...selectedMuscles, newMuscle]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Muscles</Text>
      
      <AnatomicalSelector
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />
      
      <ToxinSelector
        selectedToxin={selectedToxin}
        onSelectToxin={setSelectedToxin}
      />
      
      <ScrollView style={styles.muscleList}>
        {Object.keys(toxinData[brand]).map((muscleName) => (
          <Text
            key={muscleName}
            style={styles.muscleItem}
            onPress={() => addMuscle(muscleName)}>
            {muscleName}
          </Text>
        ))}
      </ScrollView>
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
  muscleList: {
    maxHeight: 200,
  },
  muscleItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    color: '#334155',
    fontSize: 14,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface AnatomicalSelectorProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
}

const ANATOMICAL_AREAS = [
  'Forehead',
  'Glabellar',
  'Crow\'s Feet',
  'Masseter',
  'Neck',
  'Upper Limb',
  'Lower Limb',
];

export function AnatomicalSelector({ selectedArea, onSelectArea }: AnatomicalSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Anatomical Area</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.buttonContainer}>
          {ANATOMICAL_AREAS.map((area) => (
            <TouchableOpacity
              key={area}
              style={[
                styles.areaButton,
                selectedArea === area && styles.selectedButton,
              ]}
              onPress={() => onSelectArea(area)}>
              <Text
                style={[
                  styles.areaButtonText,
                  selectedArea === area && styles.selectedButtonText,
                ]}>
                {area}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  areaButtonText: {
    fontSize: 14,
    color: '#334155',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
});
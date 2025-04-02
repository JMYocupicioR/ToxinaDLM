import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ToxinSelectorProps {
  selectedToxin: string;
  onSelectToxin: (toxin: string) => void;
}

const TOXIN_TYPES = [
  'OnabotulinumtoxinA',
  'AbobotulinumtoxinA',
  'IncobotulinumtoxinA',
  'RimabotulinumtoxinB',
];

export function ToxinSelector({ selectedToxin, onSelectToxin }: ToxinSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Toxin Type</Text>
      <View style={styles.buttonContainer}>
        {TOXIN_TYPES.map((toxin) => (
          <TouchableOpacity
            key={toxin}
            style={[
              styles.toxinButton,
              selectedToxin === toxin && styles.selectedButton,
            ]}
            onPress={() => onSelectToxin(toxin)}>
            <Text
              style={[
                styles.toxinButtonText,
                selectedToxin === toxin && styles.selectedButtonText,
              ]}>
              {toxin}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    flexDirection: 'column',
    gap: 8,
  },
  toxinButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  toxinButtonText: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
});
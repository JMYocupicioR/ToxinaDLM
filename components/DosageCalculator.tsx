import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { AnatomicalSelector } from './AnatomicalSelector';
import { ToxinSelector } from './ToxinSelector';

interface DosageCalculatorProps {
  onCalculate: (calculation: any) => void;
}

export function DosageCalculator({ onCalculate }: DosageCalculatorProps) {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedToxin, setSelectedToxin] = useState('');
  const [patientWeight, setPatientWeight] = useState('');
  const [severity, setSeverity] = useState('');

  const handleCalculation = () => {
    // Perform calculations based on selected parameters
    const calculation = {
      area: selectedArea,
      toxin: selectedToxin,
      weight: parseFloat(patientWeight),
      severity: parseInt(severity, 10),
      // Add calculated values
      totalDose: 0,
      maxSessionDose: 400,
      muscleSpecificDose: 0,
      maxMuscleDose: 100,
    };

    onCalculate(calculation);
  };

  return (
    <View style={styles.container}>
      <AnatomicalSelector
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />

      <ToxinSelector
        selectedToxin={selectedToxin}
        onSelectToxin={setSelectedToxin}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={patientWeight}
          onChangeText={setPatientWeight}
          keyboardType="numeric"
          placeholder="Enter patient weight"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Condition Severity (1-10)</Text>
        <TextInput
          style={styles.input}
          value={severity}
          onChangeText={setSeverity}
          keyboardType="numeric"
          placeholder="Enter severity"
          maxLength={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0f172a',
  },
});
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Patient } from '@/types/dosage';

interface PatientInfoProps {
  patient: Patient;
  onPatientChange: (patient: Patient) => void;
}

export function PatientInfo({ patient, onPatientChange }: PatientInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Patient Information (Optional)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Patient Name"
          value={patient.name}
          onChangeText={(text) => onPatientChange({ ...patient, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={patient.weight?.toString()}
          onChangeText={(text) => {
            const weight = parseFloat(text) || undefined;
            onPatientChange({ ...patient, weight });
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={patient.age?.toString()}
          onChangeText={(text) => {
            const age = parseInt(text) || undefined;
            onPatientChange({ ...patient, age });
          }}
        />
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
  inputContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#334155',
  },
});
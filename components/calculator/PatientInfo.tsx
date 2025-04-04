import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Patient } from '@/types/dosage';
import { ChevronDown, ChevronUp, User } from 'lucide-react-native';

interface PatientInfoProps {
  patient: Patient;
  onPatientChange: (patient: Patient) => void;
}

export function PatientInfo({ patient, onPatientChange }: PatientInfoProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Check if any patient info is filled in
  const hasPatientInfo = patient.name || patient.weight || patient.age;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <User size={18} color="#64748b" style={styles.icon} />
          <Text style={styles.label}>
            {hasPatientInfo 
              ? 'Patient Information' 
              : 'Patient Information (Optional)'}
          </Text>
        </View>
        
        {expanded ? (
          <ChevronUp size={18} color="#64748b" />
        ) : (
          <ChevronDown size={18} color="#64748b" />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Patient Name"
              value={patient.name}
              onChangeText={(text) => onPatientChange({ ...patient, name: text })}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Weight"
                keyboardType="numeric"
                value={patient.weight?.toString()}
                onChangeText={(text) => {
                  const weight = text === '' ? undefined : parseFloat(text);
                  onPatientChange({ ...patient, weight });
                }}
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={patient.age?.toString()}
                onChangeText={(text) => {
                  const age = text === '' ? undefined : parseInt(text);
                  onPatientChange({ ...patient, age });
                }}
              />
            </View>
          </View>
          
          {patient.age !== undefined && patient.age < 18 && (
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeText}>
                Pediatric patient detected. Dosage will be adjusted according to weight.
              </Text>
            </View>
          )}
        </View>
      )}
      
      {!expanded && hasPatientInfo && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {[
              patient.name,
              patient.age !== undefined && `${patient.age} years`,
              patient.weight !== undefined && `${patient.weight} kg`
            ].filter(Boolean).join(' • ')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#334155',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  noticeContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    marginTop: 4,
  },
  noticeText: {
    fontSize: 12,
    color: '#334155',
  },
  summary: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#334155',
  },
});
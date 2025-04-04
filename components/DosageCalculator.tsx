import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Patient, SelectedMuscle, ToxinBrand, TOXIN_BRANDS, SESSION_LIMITS } from '@/types/dosage';
import { toxinData } from '@/data/toxinData';
import { 
  BrandSelector,
  PatientInfo,
  MuscleSelector,
  SelectedMusclesList,
  CalculatorActions
} from '@/components/calculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';

interface DosageCalculatorProps {
  onCalculate?: (
    totalDose: number, 
    musclesList: SelectedMuscle[], 
    alerts: string[],
    brand: ToxinBrand,
    patient: Patient
  ) => void;
}

export function DosageCalculator({ onCalculate }: DosageCalculatorProps) {
  // State for the calculator
  const [selectedBrand, setSelectedBrand] = useState<ToxinBrand | ''>('');
  const [selectedMuscles, setSelectedMuscles] = useState<SelectedMuscle[]>([]);
  const [patient, setPatient] = useState<Patient>({ name: '', weight: undefined, age: undefined });
  const [totalDose, setTotalDose] = useState<number | null>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);

  // Enable or disable calculate button
  const canCalculate = selectedBrand !== '' && selectedMuscles.length > 0;

  // Calculate total dose when muscles are updated
  useEffect(() => {
    if (selectedMuscles.length > 0) {
      calculateTotalDose();
    } else {
      setTotalDose(null);
      setSafetyAlerts([]);
    }
  }, [selectedMuscles, patient]);

  // Handle brand selection
  const handleBrandChange = (brand: ToxinBrand | '') => {
    if (brand !== selectedBrand) {
      setSelectedBrand(brand);
      setSelectedMuscles([]);
      setTotalDose(null);
      setSafetyAlerts([]);
    }
  };

  // Handle muscle selection changes
  const handleMusclesChange = (muscles: SelectedMuscle[]) => {
    setSelectedMuscles(muscles);
  };

  // Handle patient info changes
  const handlePatientChange = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  };

  // Calculate dose adjustment factor based on patient data
  const calculateAdjustmentFactor = (): number => {
    // Standard adjustment for pediatric patients
    if (patient.age !== undefined && patient.age < 18 && patient.weight !== undefined) {
      // Simple adjustment based on weight - can be refined
      return Math.min(Math.max(patient.weight / 50, 0.6), 1.0);
    }
    return 1.0;
  };

  // Calculate total dose from selected muscles
  const calculateTotalDose = () => {
    if (!selectedBrand) return;

    const adjustmentFactor = calculateAdjustmentFactor();
    const alerts: string[] = [];
    let total = 0;

    // If adjustment factor is not 1.0, it means adjustments were made
    if (adjustmentFactor !== 1.0) {
      alerts.push(`Pediatric adjustment applied (factor: ${adjustmentFactor.toFixed(2)})`);
    }

    // Calculate the total dose and apply the adjustment
    const updatedMuscles = selectedMuscles.map(muscle => {
      const muscleData = toxinData[selectedBrand][muscle.name];
      const baseAmount = muscle.dosageType === 'min' ? muscleData.min : muscleData.max;
      const adjustedAmount = Math.round(baseAmount * adjustmentFactor);
      
      total += adjustedAmount;
      
      return {
        ...muscle,
        baseAmount,
        adjustedAmount
      };
    });

    // Check session limits
    const sessionLimit = SESSION_LIMITS[selectedBrand as ToxinBrand];
    if (total > sessionLimit) {
      alerts.push(`Warning: Total dose (${total}U) exceeds recommended session limit for ${selectedBrand} (${sessionLimit}U)`);
    }

    setSelectedMuscles(updatedMuscles);
    setTotalDose(total);
    setSafetyAlerts(alerts);

    // Notify parent component if callback provided
    if (onCalculate) {
      onCalculate(total, updatedMuscles, alerts, selectedBrand as ToxinBrand, patient);
    }
  };

  // Reset calculator to initial state
  const handleReset = () => {
    setSelectedBrand('');
    setSelectedMuscles([]);
    setPatient({ name: '', weight: undefined, age: undefined });
    setTotalDose(null);
    setSafetyAlerts([]);
  };

  return (
    <ScrollView style={styles.container}>
      {safetyAlerts.length > 0 && <SafetyAlerts alerts={safetyAlerts} />}

      <BrandSelector
        selectedBrand={selectedBrand}
        onBrandChange={handleBrandChange}
        brands={TOXIN_BRANDS}
      />

      <PatientInfo
        patient={patient}
        onPatientChange={handlePatientChange}
      />

      {selectedBrand && (
        <MuscleSelector
          brand={selectedBrand as ToxinBrand}
          selectedMuscles={selectedMuscles}
          onMusclesChange={handleMusclesChange}
        />
      )}

      <SelectedMusclesList
        muscles={selectedMuscles}
        onMusclesChange={handleMusclesChange}
      />

      <CalculatorActions
        onCalculate={calculateTotalDose}
        onReset={handleReset}
        canCalculate={canCalculate}
      />

      {totalDose !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Total Recommended Dose:</Text>
          <Text style={styles.resultValue}>{totalDose} U</Text>
          <Text style={styles.disclaimer}>
            Note: This tool is for reference only and does not replace clinical judgment.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0891b2',
  },
  resultLabel: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
});
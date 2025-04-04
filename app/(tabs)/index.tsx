import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DosageCalculator } from '@/components/DosageCalculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';
import { CalculationResults } from '@/components/calculator/CalculationResults';
import { SelectedMuscle, ToxinBrand, Patient } from '@/types/dosage';

export default function CalculatorScreen() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [calculationDone, setCalculationDone] = useState(false);
  const [calculationResult, setCalculationResult] = useState<{
    totalDose: number;
    musclesList: SelectedMuscle[];
    brand: ToxinBrand;
    patient: Patient;
  } | null>(null);

  const handleDosageCalculation = (
    totalDose: number, 
    musclesList: SelectedMuscle[], 
    calculationAlerts: string[],
    brand: ToxinBrand,
    patient: Patient
  ) => {
    setCalculationResult({ 
      totalDose, 
      musclesList,
      brand,
      patient
    });
    setAlerts(calculationAlerts);
    setCalculationDone(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>ToxinaDLM: Botulinum Toxin Calculator</Text>
          <Text style={styles.subtitle}>
            Medical dosage calculator for botulinum toxin procedures
          </Text>
          
          {alerts.length > 0 && (
            <SafetyAlerts alerts={alerts} />
          )}
          
          {calculationDone && calculationResult && (
            <CalculationResults
              totalDose={calculationResult.totalDose}
              selectedMuscles={calculationResult.musclesList}
              brand={calculationResult.brand}
              patientName={calculationResult.patient.name}
              patientAge={calculationResult.patient.age}
              patientWeight={calculationResult.patient.weight}
              safetyAlerts={alerts}
            />
          )}
          
          <DosageCalculator 
            onCalculate={(totalDose, musclesList, alerts, brand, patient) => 
              handleDosageCalculation(totalDose, musclesList, alerts, brand, patient)
            } 
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>About ToxinaDLM</Text>
            <Text style={styles.infoText}>
              ToxinaDLM is a specialized calculator for medical professionals created by Dr. Marcos Yocupicio to accurately determine botulinum toxin dosages for various anatomical sites, taking into account patient characteristics and clinical parameters.
            </Text>
            <Text style={styles.infoText}>
              Features include multi-brand support, anatomical area selection, patient-specific adjustments, safety alerts, pediatric calculations, and detailed reference information.
            </Text>
            <Text style={styles.disclaimer}>
              © 2025 Your Medical Company. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
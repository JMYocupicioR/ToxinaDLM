import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DosageCalculator } from '@/components/DosageCalculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';
import { Patient, SelectedMuscle, SESSION_LIMITS, ToxinBrand } from '@/types/dosage';

export default function CalculatorScreen() {
  const [selectedBrand, setSelectedBrand] = useState<ToxinBrand | ''>('');
  const [patient, setPatient] = useState<Patient>({});
  const [selectedMuscles, setSelectedMuscles] = useState<SelectedMuscle[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  const handleCalculation = () => {
    if (!selectedBrand) return;
    
    const newAlerts: string[] = [];
    const sessionLimit = SESSION_LIMITS[selectedBrand];
    const totalDose = selectedMuscles.reduce((sum, muscle) => sum + muscle.adjustedAmount, 0);
    
    if (totalDose > sessionLimit) {
      newAlerts.push(`Session limit exceeded (${sessionLimit} U)`);
    }
    
    setAlerts(newAlerts);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Botulinum Toxin Dosage Calculator</Text>
          
          {alerts.length > 0 && (
            <SafetyAlerts alerts={alerts} />
          )}
          
          <DosageCalculator
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            patient={patient}
            onPatientChange={setPatient}
            selectedMuscles={selectedMuscles}
            onMusclesChange={setSelectedMuscles}
            onCalculate={handleCalculation}
          />
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
    marginBottom: 16,
    textAlign: 'center',
  },
});
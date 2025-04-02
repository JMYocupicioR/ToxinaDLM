import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DosageCalculator } from '@/components/DosageCalculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';

export default function CalculatorScreen() {
  const [alerts, setAlerts] = useState<string[]>([]);

  const handleDosageCalculation = (calculation: any) => {
    // Validate dosage and update safety alerts
    const newAlerts = [];
    
    if (calculation.totalDose > calculation.maxSessionDose) {
      newAlerts.push('Total session dose limit exceeded');
    }
    
    if (calculation.muscleSpecificDose > calculation.maxMuscleDose) {
      newAlerts.push('Per-muscle maximum dose exceeded');
    }
    
    setAlerts(newAlerts);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Dosage Calculator</Text>
          
          {alerts.length > 0 && (
            <SafetyAlerts alerts={alerts} />
          )}
          
          <DosageCalculator onCalculate={handleDosageCalculation} />
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
  },
});
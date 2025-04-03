import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DosageCalculator } from '@/components/DosageCalculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';

// Define la estructura para los resultados del cálculo
interface DosageCalculationResult {
  area: string;
  toxin: string;
  weight: number;
  severity: number;
  totalDose: number;
  maxSessionDose: number;
  muscleSpecificDose: number;
  maxMuscleDose: number;
  recommendedDose: number;
  recommendedDoseRange: { min: number; max: number };
  isPediatric: boolean;
  safetyAlerts: string[];
}

export default function CalculatorScreen() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [calculationResult, setCalculationResult] = useState<DosageCalculationResult | null>(null);

  const handleDosageCalculation = (calculation: DosageCalculationResult) => {
    setCalculationResult(calculation);
    setAlerts(calculation.safetyAlerts || []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Botulinum Toxin Dosage Calculator</Text>
          
          {alerts.length > 0 && (
            <SafetyAlerts alerts={alerts} />
          )}
          
          <DosageCalculator onCalculate={handleDosageCalculation} />

          {calculationResult && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Dosage Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Anatomical Area:</Text>
                <Text style={styles.summaryValue}>{calculationResult.area}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Toxin Type:</Text>
                <Text style={styles.summaryValue}>{calculationResult.toxin}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Patient Profile:</Text>
                <Text style={styles.summaryValue}>
                  {calculationResult.weight} kg, Severity: {calculationResult.severity}/10
                  {calculationResult.isPediatric ? ' (Pediatric)' : ''}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Calculated Dose:</Text>
                <Text style={styles.summaryValue}>
                  {calculationResult.totalDose.toFixed(0)} units
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Recommended Range:</Text>
                <Text style={styles.summaryValue}>
                  {calculationResult.recommendedDoseRange.min.toFixed(0)}-
                  {calculationResult.recommendedDoseRange.max.toFixed(0)} units
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Max Session Dose:</Text>
                <Text style={styles.summaryValue}>{calculationResult.maxSessionDose} units</Text>
              </View>

              <Text style={styles.disclaimer}>
                These calculations are provided as a reference only. Clinical judgment should always be used when determining appropriate dosing.
              </Text>
            </View>
          )}
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
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    flex: 1,
    textAlign: 'right',
  },
  disclaimer: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
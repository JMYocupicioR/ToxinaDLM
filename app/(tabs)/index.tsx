import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { DosageCalculator, DosageCalculatorMethods } from '@/components/DosageCalculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';
import { CalculationResults } from '@/components/calculator/CalculationResults';
import { SelectedMuscle, ToxinBrand, Patient, TOXIN_BRANDS } from '@/types/dosage';
import { pathologies } from '@/data/pathologyData';
import { 
  saveCalculationToHistory, 
  getRecentCalculation, 
  CalculationResult 
} from '@/services/storageService';

export default function CalculatorScreen() {
  // Get params from URL if coming from pathologies screen
  const { pathologyId, source } = useLocalSearchParams<{ pathologyId?: string, source?: string }>();
  
  // Reference to calculator methods
  const calculatorRef = useRef<DosageCalculatorMethods>(null);
  
  // State
  const [alerts, setAlerts] = useState<string[]>([]);
  const [calculationDone, setCalculationDone] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent calculation or initialize with parameters from navigation
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        // If coming from pathologies screen with a pathologyId
        if (source === 'pathologies' && pathologyId) {
          // Get pathology details
          const selectedPathology = pathologies.find(p => p.id === pathologyId);
          
          if (selectedPathology && calculatorRef.current) {
            // Find brands that have recommendations for this pathology
            const availableBrands = TOXIN_BRANDS.filter(
              brand => selectedPathology.recommendedMuscles[brand]?.length > 0
            );
            
            if (availableBrands.length > 0) {
              // Set initial brand
              calculatorRef.current.setSelectedBrand(availableBrands[0]);
              
              // After a short delay to ensure brand is set
              setTimeout(() => {
                if (calculatorRef.current) {
                  // Set pathology and apply recommended muscles
                  calculatorRef.current.setSelectedPathology(pathologyId);
                  calculatorRef.current.applyRecommendedMuscles();
                }
              }, 100);
            }
          }
        } else {
          // Not coming from pathologies screen, try to load recent calculation
          const recentCalc = await getRecentCalculation();
          
          if (recentCalc) {
            setCalculationResult(recentCalc);
            setAlerts(recentCalc.alerts || []);
            setCalculationDone(true);
            
            // Initialize calculator with saved state if needed
            // (This would be used if we want to pre-populate the calculator with last values)
          }
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [pathologyId, source]);

  // Handle calculation results
  const handleDosageCalculation = (
    totalDose: number, 
    musclesList: SelectedMuscle[], 
    calculationAlerts: string[],
    brand: ToxinBrand,
    patient: Patient,
    calculationPathologyId?: string | null
  ) => {
    // Create calculation result
    const result: CalculationResult = { 
      totalDose, 
      musclesList,
      brand,
      patient,
      alerts: calculationAlerts,
      pathologyId: calculationPathologyId || undefined
    };
    
    // Update state
    setCalculationResult(result);
    setAlerts(calculationAlerts);
    setCalculationDone(true);
    
    // Save to history
    saveCalculationToHistory(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
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
                safetyAlerts={calculationResult.alerts}
              />
            )}
            
            <DosageCalculator 
              ref={calculatorRef}
              onCalculate={(totalDose, musclesList, alerts, brand, patient, pathologyId) => 
                handleDosageCalculation(totalDose, musclesList, alerts, brand, patient, pathologyId)
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
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
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
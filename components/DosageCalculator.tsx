import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Patient, SelectedMuscle, ToxinBrand, TOXIN_BRANDS, SESSION_LIMITS } from '@/types/dosage';
import { toxinData } from '@/data/toxinData';
import { pathologies } from '@/data/pathologyData';
import { 
  BrandSelector,
  PatientInfo,
  MuscleSelector,
  SelectedMusclesList,
  CalculatorActions,
  PathologySelector,
  RecommendedMuscles
} from '@/components/calculator';
import { SafetyAlerts } from '@/components/SafetyAlerts';

interface DosageCalculatorProps {
  onCalculate?: (
    totalDose: number, 
    musclesList: SelectedMuscle[], 
    alerts: string[],
    brand: ToxinBrand,
    patient: Patient,
    pathologyId?: string | null
  ) => void;
  initialBrand?: ToxinBrand;
  initialPathologyId?: string;
}

export interface DosageCalculatorMethods {
  setSelectedBrand: (brand: ToxinBrand) => void;
  setSelectedPathology: (pathologyId: string | null) => void;
  applyRecommendedMuscles: () => void;
  resetCalculator: () => void;
  calculateTotalDose: () => void;
  getState: () => {
    selectedBrand: ToxinBrand | '';
    selectedPathology: string | null;
    selectedMuscles: SelectedMuscle[];
    patient: Patient;
  };
}

export const DosageCalculator = forwardRef<DosageCalculatorMethods, DosageCalculatorProps>(
  ({ onCalculate, initialBrand, initialPathologyId }, ref) => {
    // State for the calculator
    const [selectedBrand, setSelectedBrand] = useState<ToxinBrand | ''>(initialBrand || '');
    const [selectedPathology, setSelectedPathology] = useState<string | null>(initialPathologyId || null);
    const [selectedMuscles, setSelectedMuscles] = useState<SelectedMuscle[]>([]);
    const [patient, setPatient] = useState<Patient>({ name: '', weight: undefined, age: undefined });
    const [totalDose, setTotalDose] = useState<number | null>(null);
    const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);

    // Enable or disable calculate button
    const canCalculate = selectedBrand !== '' && selectedMuscles.length > 0;

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      setSelectedBrand: (brand: ToxinBrand) => {
        handleBrandChange(brand);
      },
      setSelectedPathology: (pathologyId: string | null) => {
        handlePathologyChange(pathologyId);
      },
      applyRecommendedMuscles: () => {
        applyRecommendedMuscles();
      },
      resetCalculator: () => {
        handleReset();
      },
      calculateTotalDose: () => {
        calculateTotalDose();
      },
      getState: () => {
        return {
          selectedBrand,
          selectedPathology,
          selectedMuscles,
          patient
        };
      }
    }));

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

    // Handle pathology selection
    const handlePathologyChange = (pathologyId: string | null) => {
      setSelectedPathology(pathologyId);
      
      // Clear previous muscle selections when pathology changes
      if (pathologyId !== selectedPathology) {
        setSelectedMuscles([]);
        setTotalDose(null);
        setSafetyAlerts([]);
      }
    };

    // Apply recommended muscles for the selected pathology
    const applyRecommendedMuscles = () => {
      if (!selectedBrand || !selectedPathology) return;
      
      const pathology = pathologies.find(p => p.id === selectedPathology);
      if (!pathology) return;
      
      // Get recommended muscles for the selected brand
      const recommendedMuscles = pathology.recommendedMuscles[selectedBrand] || [];
      
      // Filter out muscles that don't exist in toxin data
      const availableMuscles = recommendedMuscles.filter(
        muscle => toxinData[selectedBrand][muscle.muscleName]
      );
      
      if (availableMuscles.length === 0) return;
      
      // Calculate adjustment factor for children
      const adjustmentFactor = calculateAdjustmentFactor();
      
      // Create new muscle objects with dosage types from recommendations
      const newMuscles = availableMuscles.map(recommendation => {
        const muscleData = toxinData[selectedBrand][recommendation.muscleName];
        const baseAmount = recommendation.recommendedDosage === 'min' 
          ? muscleData.min 
          : muscleData.max;
          
        return {
          name: recommendation.muscleName,
          dosageType: recommendation.recommendedDosage,
          baseAmount,
          adjustedAmount: Math.round(baseAmount * adjustmentFactor)
        };
      });
      
      // Set the new muscles
      setSelectedMuscles(newMuscles);
      
      // Calculate total dose
      calculateTotalDose(newMuscles);
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
    const calculateTotalDose = (muscles = selectedMuscles) => {
      if (!selectedBrand || muscles.length === 0) {
        setTotalDose(null);
        setSafetyAlerts([]);
        return;
      }

      const adjustmentFactor = calculateAdjustmentFactor();
      const alerts: string[] = [];
      let total = 0;

      // If adjustment factor is not 1.0, it means adjustments were made
      if (adjustmentFactor !== 1.0) {
        alerts.push(`Pediatric adjustment applied (factor: ${adjustmentFactor.toFixed(2)})`);
      }

      // Add pathology-specific alert if a pathology is selected
      if (selectedPathology) {
        const pathology = pathologies.find(p => p.id === selectedPathology);
        if (pathology) {
          alerts.push(`Following protocol for: ${pathology.name}`);
        }
      }

      // Calculate the total dose and apply the adjustment
      const updatedMuscles = muscles.map(muscle => {
        const muscleData = toxinData[selectedBrand as ToxinBrand][muscle.name];
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
        onCalculate(
          total, 
          updatedMuscles, 
          alerts, 
          selectedBrand as ToxinBrand, 
          patient,
          selectedPathology
        );
      }
    };

    // Reset calculator to initial state
    const handleReset = () => {
      setSelectedBrand('');
      setSelectedPathology(null);
      setSelectedMuscles([]);
      setPatient({ name: '', weight: undefined, age: undefined });
      setTotalDose(null);
      setSafetyAlerts([]);
    };

    // Function to handle recommended muscle selection from PathologySelector
    const handleRecommendedMusclesApply = (recommendations: Array<{
      muscleName: string;
      recommendedDosage: 'min' | 'max';
    }>) => {
      if (!selectedBrand) return;
      
      const adjustmentFactor = calculateAdjustmentFactor();
      
      // Create muscle objects based on recommendations
      const newMuscles = recommendations.map(rec => {
        const muscleData = toxinData[selectedBrand as ToxinBrand][rec.muscleName];
        if (!muscleData) return null;
        
        const baseAmount = rec.recommendedDosage === 'min' ? muscleData.min : muscleData.max;
        
        return {
          name: rec.muscleName,
          dosageType: rec.recommendedDosage,
          baseAmount,
          adjustedAmount: Math.round(baseAmount * adjustmentFactor)
        };
      }).filter((m): m is SelectedMuscle => m !== null);
      
      setSelectedMuscles(newMuscles);
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
          <>
            <PathologySelector
              selectedBrand={selectedBrand}
              selectedPathologyId={selectedPathology}
              onSelectPathology={handlePathologyChange}
              onApplyRecommendedMuscles={handleRecommendedMusclesApply}
            />

            {selectedPathology && (
              <RecommendedMuscles
                selectedPathology={selectedPathology}
                selectedBrand={selectedBrand}
                selectedMuscles={selectedMuscles}
                onAddMuscle={(muscleName, dosageType) => {
                  // Check if muscle is already selected
                  if (selectedMuscles.some(m => m.name === muscleName)) return;
                  
                  const muscleData = toxinData[selectedBrand][muscleName];
                  const adjustmentFactor = calculateAdjustmentFactor();
                  const baseAmount = dosageType === 'min' ? muscleData.min : muscleData.max;
                  
                  const newMuscle: SelectedMuscle = {
                    name: muscleName,
                    dosageType,
                    baseAmount,
                    adjustedAmount: Math.round(baseAmount * adjustmentFactor)
                  };
                  
                  setSelectedMuscles([...selectedMuscles, newMuscle]);
                }}
              />
            )}

            <MuscleSelector
              brand={selectedBrand as ToxinBrand}
              selectedMuscles={selectedMuscles}
              onMusclesChange={handleMusclesChange}
            />
          </>
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
);

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
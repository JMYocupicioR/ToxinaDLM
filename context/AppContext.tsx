import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ToxinBrand, Patient, SelectedMuscle } from '@/types/dosage';
import { toxinData } from '@/data/toxinData';
import { pathologies } from '@/data/pathologyData';

// Define the context state type
interface AppContextState {
  // Selected toxin brand
  selectedBrand: ToxinBrand | '';
  setSelectedBrand: (brand: ToxinBrand | '') => void;
  
  // Selected pathology
  selectedPathologyId: string | null;
  setSelectedPathologyId: (pathologyId: string | null) => void;
  
  // Selected patient
  selectedPatientId: string | null;
  setSelectedPatientId: (patientId: string | null) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  
  // Selected muscles
  selectedMuscles: SelectedMuscle[];
  setSelectedMuscles: (muscles: SelectedMuscle[]) => void;
  
  // Calculation results
  totalDose: number | null;
  setTotalDose: (dose: number | null) => void;
  safetyAlerts: string[];
  setSafetyAlerts: (alerts: string[]) => void;
  
  // Helpers
  calculateAdjustmentFactor: () => number;
  applyRecommendedMuscles: () => void;
  addMuscle: (muscleName: string, dosageType: 'min' | 'max') => void;
  removeMuscle: (muscleName: string) => void;
  toggleMuscleDosage: (muscle: SelectedMuscle) => void;
  calculateTotalDose: () => void;
  resetCalculator: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextState | undefined>(undefined);

// Context provider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // State declarations
  const [selectedBrand, setSelectedBrand] = useState<ToxinBrand | ''>('');
  const [selectedPathologyId, setSelectedPathologyId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedMuscles, setSelectedMuscles] = useState<SelectedMuscle[]>([]);
  const [totalDose, setTotalDose] = useState<number | null>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);

  // Calculate adjustment factor based on patient data
  const calculateAdjustmentFactor = (): number => {
    if (!selectedPatient) return 1.0;
    
    // Standard adjustment for pediatric patients
    if (selectedPatient.age !== undefined && selectedPatient.age < 18 && selectedPatient.weight !== undefined) {
      // Simple adjustment based on weight - can be refined
      return Math.min(Math.max(selectedPatient.weight / 50, 0.6), 1.0);
    }
    return 1.0;
  };

  // Apply recommended muscles from selected pathology
  const applyRecommendedMuscles = () => {
    if (!selectedBrand || !selectedPathologyId) return;
    
    const pathology = pathologies.find(p => p.id === selectedPathologyId);
    if (!pathology) return;
    
    // Get recommended muscles for the selected brand
    const recommendedMuscles = pathology.recommendedMuscles[selectedBrand] || [];
    
    // Filter out muscles that don't exist in toxin data
    const availableMuscles = recommendedMuscles.filter(
      muscle => toxinData[selectedBrand][muscle.muscleName]
    );
    
    // Calculate adjustment factor
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
    calculateTotalDose();
  };

  // Add a single muscle
  const addMuscle = (muscleName: string, dosageType: 'min' | 'max' = 'min') => {
    if (!selectedBrand || selectedMuscles.some(m => m.name === muscleName)) {
      return;
    }
    
    const muscleData = toxinData[selectedBrand][muscleName];
    if (!muscleData) return;
    
    const baseAmount = dosageType === 'min' ? muscleData.min : muscleData.max;
    const adjustmentFactor = calculateAdjustmentFactor();
    
    const newMuscle: SelectedMuscle = {
      name: muscleName,
      dosageType,
      baseAmount,
      adjustedAmount: Math.round(baseAmount * adjustmentFactor)
    };
    
    setSelectedMuscles(prev => [...prev, newMuscle]);
  };

  // Remove a muscle
  const removeMuscle = (muscleName: string) => {
    setSelectedMuscles(prev => prev.filter(m => m.name !== muscleName));
  };

  // Toggle muscle dosage type between min and max
  const toggleMuscleDosage = (muscle: SelectedMuscle) => {
    if (!selectedBrand) return;
    
    setSelectedMuscles(prev => prev.map(m => {
      if (m.name === muscle.name) {
        const muscleData = toxinData[selectedBrand][muscle.name];
        const newDosageType = m.dosageType === 'min' ? 'max' : 'min';
        const newBaseAmount = newDosageType === 'min' ? muscleData.min : muscleData.max;
        const adjustmentFactor = calculateAdjustmentFactor();
        
        return {
          ...m,
          dosageType: newDosageType,
          baseAmount: newBaseAmount,
          adjustedAmount: Math.round(newBaseAmount * adjustmentFactor)
        };
      }
      return m;
    }));
  };

  // Calculate total dose from selected muscles
  const calculateTotalDose = () => {
    if (!selectedBrand || selectedMuscles.length === 0) {
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
    if (selectedPathologyId) {
      const pathology = pathologies.find(p => p.id === selectedPathologyId);
      if (pathology) {
        alerts.push(`Following protocol for: ${pathology.name}`);
      }
    }
    
    // Add patient-specific alert if a patient is selected
    if (selectedPatient && selectedPatient.name) {
      alerts.push(`Patient: ${selectedPatient.name}`);
    }
    
    // Update adjusted amounts and calculate total
    const updatedMuscles = selectedMuscles.map(muscle => {
      const adjustedAmount = Math.round(muscle.baseAmount * adjustmentFactor);
      total += adjustedAmount;
      
      return {
        ...muscle,
        adjustedAmount
      };
    });
    
    // Check session limits
    const sessionLimits = {
      'Dysport': 1000,
      'Botox': 400,
      'Xeomin': 400
    };
    
    const sessionLimit = sessionLimits[selectedBrand as ToxinBrand];
    if (total > sessionLimit) {
      alerts.push(`Warning: Total dose (${total}U) exceeds recommended session limit for ${selectedBrand} (${sessionLimit}U)`);
    }
    
    setSelectedMuscles(updatedMuscles);
    setTotalDose(total);
    setSafetyAlerts(alerts);
  };

  // Reset all calculation state
  const resetCalculator = () => {
    setSelectedBrand('');
    setSelectedPathologyId(null);
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setSelectedMuscles([]);
    setTotalDose(null);
    setSafetyAlerts([]);
  };

  // Combine all state and functions into context value
  const contextValue: AppContextState = {
    selectedBrand,
    setSelectedBrand,
    selectedPathologyId,
    setSelectedPathologyId,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    setSelectedPatient,
    selectedMuscles,
    setSelectedMuscles,
    totalDose,
    setTotalDose,
    safetyAlerts,
    setSafetyAlerts,
    calculateAdjustmentFactor,
    applyRecommendedMuscles,
    addMuscle,
    removeMuscle,
    toggleMuscleDosage,
    calculateTotalDose,
    resetCalculator
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
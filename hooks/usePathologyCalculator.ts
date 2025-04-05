import { useState, useEffect } from 'react';
import { pathologies } from '@/data/pathologyData';
import { toxinData } from '@/data/toxinData';
import { ToxinBrand, SelectedMuscle, Patient } from '@/types/dosage';

export function usePathologyCalculator() {
  const [selectedBrand, setSelectedBrand] = useState<ToxinBrand | ''>('');
  const [selectedPathology, setSelectedPathology] = useState<string | null>(null);
  const [selectedMuscles, setSelectedMuscles] = useState<SelectedMuscle[]>([]);
  const [patient, setPatient] = useState<Patient>({
    name: '',
    weight: undefined,
    age: undefined
  });
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);
  const [totalDose, setTotalDose] = useState<number | null>(null);
  
  // Reset state when brand changes
  const handleBrandChange = (brand: ToxinBrand | '') => {
    if (brand !== selectedBrand) {
      setSelectedBrand(brand);
      setSelectedMuscles([]);
      setSelectedPathology(null);
      setTotalDose(null);
      setSafetyAlerts([]);
    }
  };
  
  // Update state when pathology changes
  const handlePathologyChange = (pathologyId: string | null) => {
    setSelectedPathology(pathologyId);
    
    // Clear previous muscle selections when pathology changes
    if (pathologyId !== selectedPathology) {
      setSelectedMuscles([]);
      setTotalDose(null);
      setSafetyAlerts([]);
    }
  };
  
  // Apply all recommended muscles for the selected pathology
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
  
  // Calculate adjustment factor based on patient data
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
    
    // Calculate the total dose
    muscles.forEach(muscle => {
      total += muscle.adjustedAmount;
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
    
    setTotalDose(total);
    setSafetyAlerts(alerts);
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
    
    const updatedMuscles = [...selectedMuscles, newMuscle];
    setSelectedMuscles(updatedMuscles);
    calculateTotalDose(updatedMuscles);
  };
  
  // Remove a muscle
  const removeMuscle = (muscleName: string) => {
    const updatedMuscles = selectedMuscles.filter(m => m.name !== muscleName);
    setSelectedMuscles(updatedMuscles);
    calculateTotalDose(updatedMuscles);
  };
  
  // Toggle muscle dosage type between min and max
  const toggleMuscleDosage = (muscle: SelectedMuscle) => {
    if (!selectedBrand) return;
    
    const updatedMuscles = selectedMuscles.map(m => {
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
    });
    
    setSelectedMuscles(updatedMuscles);
    calculateTotalDose(updatedMuscles);
  };
  
  // Reset all state
  const resetCalculator = () => {
    setSelectedBrand('');
    setSelectedPathology(null);
    setSelectedMuscles([]);
    setPatient({ name: '', weight: undefined, age: undefined });
    setTotalDose(null);
    setSafetyAlerts([]);
  };
  
  // Update patient info
  const updatePatient = (newPatient: Patient) => {
    setPatient(newPatient);
    
    // Recalculate doses if muscles are selected
    if (selectedMuscles.length > 0) {
      const adjustmentFactor = calculateAdjustmentFactor();
      
      // Only update if patient age or weight changed (which affects adjustment)
      if (
        (newPatient.age !== patient.age) || 
        (newPatient.weight !== patient.weight)
      ) {
        const updatedMuscles = selectedMuscles.map(muscle => {
          return {
            ...muscle,
            adjustedAmount: Math.round(muscle.baseAmount * adjustmentFactor)
          };
        });
        
        setSelectedMuscles(updatedMuscles);
        calculateTotalDose(updatedMuscles);
      }
    }
  };
  
  return {
    selectedBrand,
    selectedPathology,
    selectedMuscles,
    patient,
    safetyAlerts,
    totalDose,
    handleBrandChange,
    handlePathologyChange,
    applyRecommendedMuscles,
    addMuscle,
    removeMuscle,
    toggleMuscleDosage,
    resetCalculator,
    updatePatient,
    calculateTotalDose
  };
}
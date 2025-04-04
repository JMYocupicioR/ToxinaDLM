import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { 
  DosageCalculationResult, 
  MuscleReference, 
  ToxinConversion, 
  ToxinProduct 
} from '@/types/dosage';

// Import AnatomicalSelector with correct path
import { AnatomicalSelector } from '@/components/AnatomicalSelector';

interface DosageCalculatorProps {
  onCalculate: (calculation: DosageCalculationResult) => void;
}

// Toxin product database with clinical data
const TOXIN_PRODUCTS: ToxinProduct[] = [
  {
    name: 'Botox',
    type: 'OnabotulinumtoxinA',
    unitsPerVial: 100,
    dilutionRange: { min: 1, max: 10, recommended: 2.5 }
  },
  {
    name: 'Dysport',
    type: 'AbobotulinumtoxinA',
    unitsPerVial: 300,
    dilutionRange: { min: 1.5, max: 10, recommended: 2.5 }
  },
  {
    name: 'Xeomin',
    type: 'IncobotulinumtoxinA',
    unitsPerVial: 100,
    dilutionRange: { min: 1, max: 10, recommended: 2.5 }
  },
  {
    name: 'Myobloc',
    type: 'RimabotulinumtoxinB',
    unitsPerVial: 5000,
    dilutionRange: { min: 1, max: 5, recommended: 2.5 }
  },
];

// Define toxin types with their brand names for clarity
const TOXIN_TYPES = [
  { id: 'OnabotulinumtoxinA', name: 'OnabotulinumtoxinA (Botox)' },
  { id: 'AbobotulinumtoxinA', name: 'AbobotulinumtoxinA (Dysport)' },
  { id: 'IncobotulinumtoxinA', name: 'IncobotulinumtoxinA (Xeomin)' },
  { id: 'RimabotulinumtoxinB', name: 'RimabotulinumtoxinB (Myobloc)' },
];

// Clinical dosage guidelines by anatomical area (reference for OnabotulinumtoxinA/Botox)
const MUSCLE_REFERENCES: MuscleReference[] = [
  { 
    name: 'Frontalis', 
    minDose: 10, 
    maxDose: 20, 
    recommendedDose: 15,
    anatomicalArea: 'Forehead' 
  },
  { 
    name: 'Procerus/Corrugator', 
    minDose: 20, 
    maxDose: 25, 
    recommendedDose: 20,
    anatomicalArea: 'Glabellar' 
  },
  { 
    name: 'Orbicularis Oculi', 
    minDose: 8, 
    maxDose: 12, 
    recommendedDose: 10,
    anatomicalArea: 'Crow\'s Feet' 
  },
  { 
    name: 'Masseter', 
    minDose: 20, 
    maxDose: 30, 
    recommendedDose: 25,
    anatomicalArea: 'Masseter' 
  },
  { 
    name: 'Platysma', 
    minDose: 20, 
    maxDose: 60, 
    recommendedDose: 40,
    anatomicalArea: 'Neck' 
  },
  { 
    name: 'Biceps/Triceps', 
    minDose: 75, 
    maxDose: 200, 
    recommendedDose: 100,
    anatomicalArea: 'Upper Limb' 
  },
  { 
    name: 'Gastrocnemius/Soleus', 
    minDose: 100, 
    maxDose: 300, 
    recommendedDose: 200,
    anatomicalArea: 'Lower Limb' 
  },
];

// Pediatric dosing guidelines per kg (for spasticity)
const PEDIATRIC_DOSING = {
  minWeight: 10, // kg
  maxDosePerKg: 16, // units/kg for OnabotulinumtoxinA
  maxTotalDose: 400, // max units per session for OnabotulinumtoxinA
  weightThreshold: 45, // kg - below this is considered pediatric
};

export function DosageCalculator({ onCalculate }: DosageCalculatorProps) {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedToxin, setSelectedToxin] = useState('OnabotulinumtoxinA');
  const [patientWeight, setPatientWeight] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [severity, setSeverity] = useState('5');
  const [calculatedDose, setCalculatedDose] = useState<number | null>(null);
  const [doseRange, setDoseRange] = useState<{ min: number; max: number } | null>(null);

  // Component for selecting toxin type
  const ToxinSelector = () => (
    <View style={styles.container}>
      <Text style={styles.label}>Select Toxin Type</Text>
      <View style={styles.buttonContainer}>
        {TOXIN_TYPES.map((toxin) => (
          <TouchableOpacity
            key={toxin.id}
            style={[
              styles.toxinButton,
              selectedToxin === toxin.id && styles.selectedButton,
            ]}
            onPress={() => setSelectedToxin(toxin.id)}>
            <Text
              style={[
                styles.toxinButtonText,
                selectedToxin === toxin.id && styles.selectedButtonText,
              ]}>
              {toxin.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Get reference doses for the selected anatomical area
  const getReferenceDoses = () => {
    const reference = MUSCLE_REFERENCES.find(m => m.anatomicalArea === selectedArea);
    if (!reference) return null;
    
    // Convert doses based on selected toxin type
    if (selectedToxin === 'OnabotulinumtoxinA' || selectedToxin === 'IncobotulinumtoxinA') {
      return {
        min: reference.minDose,
        max: reference.maxDose,
        recommended: reference.recommendedDose
      };
    } else if (selectedToxin === 'AbobotulinumtoxinA') {
      // Dysport conversion (typically 1:2.5-3)
      return {
        min: reference.minDose * 2.5,
        max: reference.maxDose * 2.5,
        recommended: reference.recommendedDose * 2.5
      };
    } else if (selectedToxin === 'RimabotulinumtoxinB') {
      // Myobloc conversion (typically 1:50)
      return {
        min: reference.minDose * 50,
        max: reference.maxDose * 50,
        recommended: reference.recommendedDose * 50
      };
    }
    
    return null;
  };

  // Calculate the dose based on all parameters
  const calculateDose = () => {
    if (!selectedArea || !selectedToxin || !patientWeight) {
      return null;
    }

    const weight = parseFloat(patientWeight);
    const age = patientAge ? parseInt(patientAge, 10) : 0;
    const severityLevel = parseInt(severity, 10);
    const isPediatric = weight < PEDIATRIC_DOSING.weightThreshold;
    
    const referenceDoses = getReferenceDoses();
    if (!referenceDoses) return null;
    
    let calculatedDose = referenceDoses.recommended;
    const alerts: string[] = [];
    
    // Adjust for severity (1-10 scale)
    const severityFactor = severityLevel / 5; // 5 is the midpoint
    calculatedDose *= severityFactor;
    
    // Adjust for weight in adult patients (basic adjustment)
    if (!isPediatric) {
      // Slight adjustment based on weight for adults
      const standardWeight = 70; // reference weight in kg
      const weightFactor = Math.min(Math.max(weight / standardWeight, 0.8), 1.2);
      calculatedDose *= weightFactor;
    } else {
      // Pediatric dosing based on weight
      if (weight < PEDIATRIC_DOSING.minWeight) {
        alerts.push(`Patient weight below minimum threshold of ${PEDIATRIC_DOSING.minWeight}kg for pediatric dosing`);
      }
      
      // For spasticity in pediatric patients, use weight-based calculation
      if (selectedArea === 'Upper Limb' || selectedArea === 'Lower Limb') {
        // Calculate based on units per kg
        let pediatricDose = weight * PEDIATRIC_DOSING.maxDosePerKg;
        
        // Apply toxin conversion if not OnabotulinumtoxinA
        if (selectedToxin === 'AbobotulinumtoxinA') {
          pediatricDose *= 2.5;
        } else if (selectedToxin === 'RimabotulinumtoxinB') {
          pediatricDose *= 50;
        }
        
        calculatedDose = pediatricDose;
      }
    }
    
    // Round to the nearest whole number
    calculatedDose = Math.round(calculatedDose);
    
    // Check maximum doses
    const maxMuscleDose = referenceDoses.max * 1.2; // Allow 20% above reference max
    const maxSessionDose = isPediatric 
      ? PEDIATRIC_DOSING.maxTotalDose 
      : (selectedToxin === 'AbobotulinumtoxinA' ? 1000 : 400);
    
    if (calculatedDose > maxMuscleDose) {
      alerts.push(`Calculated dose (${calculatedDose} units) exceeds maximum recommended dose for this muscle (${maxMuscleDose} units)`);
    }
    
    if (calculatedDose > maxSessionDose) {
      alerts.push(`Calculated dose exceeds maximum recommended session dose (${maxSessionDose} units)`);
    }
    
    // Prepare result object
    const result: DosageCalculationResult = {
      area: selectedArea,
      toxin: selectedToxin,
      weight: weight,
      severity: severityLevel,
      totalDose: calculatedDose,
      maxSessionDose: maxSessionDose,
      muscleSpecificDose: calculatedDose,
      maxMuscleDose: maxMuscleDose,
      recommendedDose: referenceDoses.recommended,
      recommendedDoseRange: { min: referenceDoses.min, max: referenceDoses.max },
      isPediatric,
      safetyAlerts: alerts
    };
    
    return result;
  };

  // Handle form submission
  const handleCalculation = () => {
    const result = calculateDose();
    if (result) {
      setCalculatedDose(result.totalDose);
      setDoseRange({
        min: result.recommendedDoseRange.min,
        max: result.recommendedDoseRange.max
      });
      onCalculate(result);
    }
  };

  // Update calculations when inputs change
  useEffect(() => {
    const referenceDoses = getReferenceDoses();
    if (referenceDoses) {
      setDoseRange({
        min: referenceDoses.min,
        max: referenceDoses.max
      });
    }
  }, [selectedArea, selectedToxin]);

  return (
    <View style={styles.mainContainer}>
      <AnatomicalSelector
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />
      
      <ToxinSelector />
      
      <View style={styles.container}>
        <Text style={styles.label}>Patient Information</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={patientWeight}
            onChangeText={setPatientWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Age (years)"
            keyboardType="numeric"
            value={patientAge}
            onChangeText={setPatientAge}
          />
        </View>
      </View>
      
      <View style={styles.container}>
        <Text style={styles.label}>Condition Severity (1-10)</Text>
        <View style={styles.severityContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.severityButton,
                parseInt(severity, 10) === level && styles.selectedButton,
              ]}
              onPress={() => setSeverity(level.toString())}>
              <Text
                style={[
                  styles.severityButtonText,
                  parseInt(severity, 10) === level && styles.selectedButtonText,
                ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.calculateButton,
          (!selectedArea || !patientWeight) && styles.disabledButton,
        ]}
        onPress={handleCalculation}
        disabled={!selectedArea || !patientWeight}>
        <Text style={styles.calculateButtonText}>Calculate Dose</Text>
      </TouchableOpacity>
      
      {calculatedDose !== null && doseRange && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Calculated Dose:</Text>
          <Text style={styles.resultValue}>{calculatedDose} units</Text>
          <Text style={styles.resultRange}>
            Recommended range: {doseRange.min.toFixed(0)} - {doseRange.max.toFixed(0)} units
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  toxinButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  toxinButtonText: {
    fontSize: 14,
    color: '#334155',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#334155',
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  severityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  severityButtonText: {
    fontSize: 14,
    color: '#334155',
  },
  calculateButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
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
    marginBottom: 4,
  },
  resultRange: {
    fontSize: 12,
    color: '#64748b',
  },
});
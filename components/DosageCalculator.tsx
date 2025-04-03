import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { AnatomicalSelector } from './AnatomicalSelector';
import { ToxinSelector } from './ToxinSelector';
import { DosageCalculation, MuscleReference, ToxinConversion, ToxinProduct } from '@/types/dosage';

interface DosageCalculatorProps {
  onCalculate: (calculation: DosageCalculationResult) => void;
}

// Define new types for calculated results
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

// Conversion factors based on clinical evidence
const CONVERSION_FACTORS: ToxinConversion[] = [
  { fromType: 'OnabotulinumtoxinA', toType: 'AbobotulinumtoxinA', factor: 2.5 },
  { fromType: 'OnabotulinumtoxinA', toType: 'IncobotulinumtoxinA', factor: 1 },
  { fromType: 'OnabotulinumtoxinA', toType: 'RimabotulinumtoxinB', factor: 50 },
  { fromType: 'AbobotulinumtoxinA', toType: 'OnabotulinumtoxinA', factor: 0.4 },
  { fromType: 'AbobotulinumtoxinA', toType: 'IncobotulinumtoxinA', factor: 0.4 },
  { fromType: 'AbobotulinumtoxinA', toType: 'RimabotulinumtoxinB', factor: 20 },
  { fromType: 'IncobotulinumtoxinA', toType: 'OnabotulinumtoxinA', factor: 1 },
  { fromType: 'IncobotulinumtoxinA', toType: 'AbobotulinumtoxinA', factor: 2.5 },
  { fromType: 'IncobotulinumtoxinA', toType: 'RimabotulinumtoxinB', factor: 50 },
  { fromType: 'RimabotulinumtoxinB', toType: 'OnabotulinumtoxinA', factor: 0.02 },
  { fromType: 'RimabotulinumtoxinB', toType: 'AbobotulinumtoxinA', factor: 0.05 },
  { fromType: 'RimabotulinumtoxinB', toType: 'IncobotulinumtoxinA', factor: 0.02 },
];

interface ToxinConversionReferenceProps {}

export function ToxinConversionReference({}: ToxinConversionReferenceProps) {
  const [fromToxin, setFromToxin] = useState('OnabotulinumtoxinA');
  const [toToxin, setToToxin] = useState('AbobotulinumtoxinA');
  const [inputDose, setInputDose] = useState('');
  const [convertedDose, setConvertedDose] = useState<number | null>(null);

  // Find conversion factor between two toxin types
  const findConversionFactor = (from: string, to: string): number => {
    // If converting to the same toxin, return 1
    if (from === to) return 1;

    const conversion = CONVERSION_FACTORS.find(
      factor => factor.fromType === from && factor.toType === to
    );
    
    return conversion ? conversion.factor : 1;
  };

  // Convert dose between toxin types
  const convertDose = () => {
    if (!inputDose) {
      setConvertedDose(null);
      return;
    }

    const dose = parseFloat(inputDose);
    if (isNaN(dose)) {
      setConvertedDose(null);
      return;
    }

    const factor = findConversionFactor(fromToxin, toToxin);
    const result = dose * factor;
    setConvertedDose(result);
  };

  // Get conversion description
  const getConversionDescription = (): string => {
    if (fromToxin === toToxin) {
      return 'No conversion needed (1:1)';
    }

    const factor = findConversionFactor(fromToxin, toToxin);
    if (factor < 1) {
      return `1 unit = ${factor.toFixed(2)} units`;
    } else {
      return `1 unit = ${factor.toFixed(1)} units`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toxin Conversion Calculator</Text>
      
      <View style={styles.converterContainer}>
        <View style={styles.toxinSelectorContainer}>
          <Text style={styles.label}>From:</Text>
          <View style={styles.buttonContainer}>
            {TOXIN_TYPES.map(toxin => (
              <TouchableOpacity
                key={`from-${toxin.id}`}
                style={[
                  styles.toxinButton,
                  fromToxin === toxin.id && styles.selectedButton,
                ]}
                onPress={() => {
                  setFromToxin(toxin.id);
                  convertDose();
                }}>
                <Text
                  style={[
                    styles.toxinButtonText,
                    fromToxin === toxin.id && styles.selectedButtonText,
                  ]}>
                  {toxin.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.toxinSelectorContainer}>
          <Text style={styles.label}>To:</Text>
          <View style={styles.buttonContainer}>
            {TOXIN_TYPES.map(toxin => (
              <TouchableOpacity
                key={`to-${toxin.id}`}
                style={[
                  styles.toxinButton,
                  toToxin === toxin.id && styles.selectedButton,
                ]}
                onPress={() => {
                  setToToxin(toxin.id);
                  convertDose();
                }}>
                <Text
                  style={[
                    styles.toxinButtonText,
                    toToxin === toxin.id && styles.selectedButtonText,
                  ]}>
                  {toxin.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.conversionInfoContainer}>
          <Text style={styles.conversionInfoText}>
            Conversion Factor: {getConversionDescription()}
          </Text>
        </View>
        
        <View style={styles.doseCalculatorContainer}>
          <View style={styles.doseInputContainer}>
            <Text style={styles.label}>Enter dose:</Text>
            <TextInput
              style={styles.doseInput}
              value={inputDose}
              onChangeText={(text) => {
                setInputDose(text);
                // Auto-convert when the input changes
                const newDose = parseFloat(text);
                if (!isNaN(newDose)) {
                  const factor = findConversionFactor(fromToxin, toToxin);
                  setConvertedDose(newDose * factor);
                } else {
                  setConvertedDose(null);
                }
              }}
              keyboardType="numeric"
              placeholder="Enter units"
            />
          </View>
          
          <TouchableOpacity
            style={styles.convertButton}
            onPress={convertDose}>
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>
        
        {convertedDose !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Converted Dose:</Text>
            <Text style={styles.resultValue}>
              {convertedDose.toFixed(1)} units
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Note: Conversion factors are approximate and based on clinical guidelines. 
          Individual patient response may vary. Always use clinical judgment when 
          converting between toxin types.
        </Text>
      </View>
      
      <View style={styles.referenceContainer}>
        <Text style={styles.referenceTitle}>Quick Reference</Text>
        <View style={styles.referenceTable}>
          <View style={styles.referenceHeader}>
            <Text style={styles.referenceHeaderText}>From</Text>
            <Text style={styles.referenceHeaderText}>To</Text>
            <Text style={styles.referenceHeaderText}>Multiply By</Text>
          </View>
          
          {[
            { from: 'Botox', to: 'Dysport', factor: 2.5 },
            { from: 'Botox', to: 'Xeomin', factor: 1 },
            { from: 'Dysport', to: 'Botox', factor: 0.4 },
            { from: 'Dysport', to: 'Xeomin', factor: 0.4 },
            { from: 'Xeomin', to: 'Botox', factor: 1 },
            { from: 'Xeomin', to: 'Dysport', factor: 2.5 },
          ].map((conv, index) => (
            <View key={index} style={styles.referenceRow}>
              <Text style={styles.referenceCell}>{conv.from}</Text>
              <Text style={styles.referenceCell}>{conv.to}</Text>
              <Text style={styles.referenceCell}>{conv.factor}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

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
    } else {
      setDoseRange(null);
    }
    
    // Auto-calculate when all required fields are filled
    if (selectedArea && selectedToxin && patientWeight && parseFloat(patientWeight) > 0) {
      handleCalculation();
    }
  }, [selectedArea, selectedToxin, patientWeight, severity, patientAge]);

  return (
    <View style={styles.container}>
      <AnatomicalSelector
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />

      <ToxinSelector
        selectedToxin={selectedToxin}
        onSelectToxin={setSelectedToxin}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={patientWeight}
          onChangeText={setPatientWeight}
          keyboardType="numeric"
          placeholder="Enter patient weight"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Patient Age (years)</Text>
        <TextInput
          style={styles.input}
          value={patientAge}
          onChangeText={setPatientAge}
          keyboardType="numeric"
          placeholder="Enter patient age (optional)"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Condition Severity (1-10)</Text>
        <TextInput
          style={styles.input}
          value={severity}
          onChangeText={setSeverity}
          keyboardType="numeric"
          placeholder="Enter severity"
          maxLength={2}
        />
      </View>

      {doseRange && (
        <View style={styles.doseRangeContainer}>
          <Text style={styles.label}>Recommended Dose Range</Text>
          <View style={styles.doseRangeBox}>
            <Text style={styles.doseRangeText}>
              {doseRange.min.toFixed(0)} - {doseRange.max.toFixed(0)} units
            </Text>
          </View>
        </View>
      )}

      {calculatedDose !== null && (
        <View style={styles.calculatedDoseContainer}>
          <Text style={styles.label}>Calculated Dose</Text>
          <View style={styles.calculatedDoseBox}>
            <Text style={styles.calculatedDoseText}>
              {calculatedDose.toFixed(0)} units
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={styles.calculateButton}
        onPress={handleCalculation}
      >
        <Text style={styles.calculateButtonText}>Calculate Dose</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Dosages are calculated based on clinical guidelines and may need adjustment
          based on individual patient factors and clinical judgment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  doseRangeContainer: {
    marginBottom: 16,
  },
  doseRangeBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  doseRangeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  calculatedDoseContainer: {
    marginBottom: 16,
  },
  calculatedDoseBox: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  calculatedDoseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  calculateButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
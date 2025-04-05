import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SelectedMuscle, ToxinBrand } from '@/types/dosage';
import { Printer, Share2, ChevronDown, ChevronUp } from 'lucide-react-native';

interface CalculationResultsProps {
  totalDose: number;
  selectedMuscles: SelectedMuscle[];
  patientName?: string;
  patientAge?: number;
  patientWeight?: number;
  brand: ToxinBrand;
  safetyAlerts: string[];
}

export function CalculationResults({
  totalDose,
  selectedMuscles,
  patientName,
  patientAge,
  patientWeight,
  brand,
  safetyAlerts,
}: CalculationResultsProps) {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);

  // Group muscles by dosage type (min vs max)
  const minDoseMuscles = selectedMuscles.filter(m => m.dosageType === 'min');
  const maxDoseMuscles = selectedMuscles.filter(m => m.dosageType === 'max');

  // Get session limit for the selected brand
  const sessionLimits = {
    'Dysport': 1000,
    'Botox': 400,
    'Xeomin': 400
  };
  
  const sessionLimit = sessionLimits[brand];
  const exceedsLimit = totalDose > sessionLimit;

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Calculation Results</Text>
        <Text style={styles.timestamp}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.patientBar}>
        <Text style={styles.brandName}>{brand}</Text>
        {patientName && <Text style={styles.patientName}>Patient: {patientName}</Text>}
      </View>

      <View style={styles.doseSummary}>
        <View style={styles.summaryTop}>
          <Text style={styles.totalDoseLabel}>Total Calculated Dose</Text>
          <Text style={[
            styles.totalDoseValue,
            exceedsLimit && styles.exceedsDoseValue
          ]}>
            {totalDose} U
          </Text>
        </View>
        
        <View style={styles.summaryDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Session Limit:</Text>
            <Text style={styles.detailValue}>{sessionLimit} U</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Selected Muscles:</Text>
            <Text style={styles.detailValue}>{selectedMuscles.length}</Text>
          </View>
          
          {patientWeight && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Patient Weight:</Text>
              <Text style={styles.detailValue}>{patientWeight} kg</Text>
            </View>
          )}
          
          {patientAge && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Patient Age:</Text>
              <Text style={styles.detailValue}>{patientAge} years</Text>
            </View>
          )}
        </View>
      </View>

      {safetyAlerts.length > 0 && (
        <View style={styles.alertsContainer}>
          <Text style={styles.alertsTitle}>Safety Alerts</Text>
          {safetyAlerts.map((alert, index) => (
            <Text key={index} style={styles.alertText}>• {alert}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={styles.detailsToggle}
        onPress={() => setDetailsExpanded(!detailsExpanded)}
      >
        <Text style={styles.detailsToggleText}>
          {detailsExpanded ? 'Hide Muscle Details' : 'Show Muscle Details'}
        </Text>
        {detailsExpanded ? (
          <ChevronUp size={16} color="#64748b" />
        ) : (
          <ChevronDown size={16} color="#64748b" />
        )}
      </TouchableOpacity>

      {detailsExpanded && (
        <ScrollView style={styles.musclesContainer}>
          {minDoseMuscles.length > 0 && (
            <View>
              <Text style={styles.musclesGroupTitle}>Minimum Dose Muscles</Text>
              {minDoseMuscles.map((muscle) => (
                <View key={muscle.name} style={styles.muscleRow}>
                  <Text style={styles.muscleName}>{muscle.name}</Text>
                  <Text style={styles.muscleDose}>{muscle.adjustedAmount} U</Text>
                </View>
              ))}
            </View>
          )}
          
          {maxDoseMuscles.length > 0 && (
            <View>
              <Text style={styles.musclesGroupTitle}>Maximum Dose Muscles</Text>
              {maxDoseMuscles.map((muscle) => (
                <View key={muscle.name} style={styles.muscleRow}>
                  <Text style={styles.muscleName}>{muscle.name}</Text>
                  <Text style={styles.muscleDose}>{muscle.adjustedAmount} U</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Printer size={16} color="#64748b" />
          <Text style={styles.actionButtonText}>Print</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={16} color="#64748b" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.disclaimer}>
          This calculation is provided as a clinical reference only. Always use professional judgment when determining appropriate dosing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  patientBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f1f5f9',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0891b2',
  },
  patientName: {
    fontSize: 14,
    color: '#334155',
  },
  doseSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryTop: {
    marginBottom: 12,
  },
  totalDoseLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  totalDoseValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0891b2',
  },
  exceedsDoseValue: {
    color: '#ef4444',
  },
  summaryDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  alertsContainer: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  alertsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#b91c1c',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 12,
    color: '#dc2626',
    marginBottom: 4,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailsToggleText: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 4,
  },
  musclesContainer: {
    maxHeight: 200,
    padding: 12,
  },
  musclesGroupTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
    marginTop: 8,
  },
  muscleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  muscleName: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  muscleDose: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0891b2',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
});
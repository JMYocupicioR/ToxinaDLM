import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { CalculatorIcon, RefreshCw, Printer, Share2 } from 'lucide-react-native';

interface CalculatorActionsProps {
  onCalculate: () => void;
  onReset: () => void;
  canCalculate: boolean;
}

export function CalculatorActions({ onCalculate, onReset, canCalculate }: CalculatorActionsProps) {
  const handleShare = () => {
    // Share functionality would be implemented here
    // On a real app, this would use the Share API to export results
    console.log('Share functionality would be triggered here');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.mainButton, !canCalculate && styles.disabledButton]}
        onPress={onCalculate}
        disabled={!canCalculate}>
        <CalculatorIcon size={18} color="#ffffff" />
        <Text style={styles.mainButtonText}>Calculate Dose</Text>
      </TouchableOpacity>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onReset}>
          <RefreshCw size={16} color="#64748b" />
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={[styles.secondaryButton, !canCalculate && styles.disabledSecondaryButton]}
            disabled={!canCalculate}>
            <Printer size={16} color={canCalculate ? "#64748b" : "#cbd5e1"} />
            <Text style={[
              styles.secondaryButtonText, 
              !canCalculate && styles.disabledSecondaryText
            ]}>
              Print
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.secondaryButton, !canCalculate && styles.disabledSecondaryButton]}
          onPress={handleShare}
          disabled={!canCalculate}>
          <Share2 size={16} color={canCalculate ? "#64748b" : "#cbd5e1"} />
          <Text style={[
            styles.secondaryButtonText, 
            !canCalculate && styles.disabledSecondaryText
          ]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowColor: '#94a3b8',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    marginLeft: 6,
  },
  disabledSecondaryButton: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
  },
  disabledSecondaryText: {
    color: '#cbd5e1',
  },
});
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calculator, RefreshCw, Printer } from 'lucide-react-native';

interface CalculatorActionsProps {
  onCalculate: () => void;
  onReset: () => void;
  canCalculate: boolean;
}

export function CalculatorActions({ onCalculate, onReset, canCalculate }: CalculatorActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.calculateButton, !canCalculate && styles.disabledButton]}
        onPress={onCalculate}
        disabled={!canCalculate}>
        <Calculator size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={onReset}>
        <RefreshCw size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.printButton, !canCalculate && styles.disabledButton]}
        disabled={!canCalculate}>
        <Printer size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Print</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  calculateButton: {
    backgroundColor: '#0891b2',
  },
  resetButton: {
    backgroundColor: '#64748b',
  },
  printButton: {
    backgroundColor: '#0891b2',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
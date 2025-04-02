import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface SafetyAlertsProps {
  alerts: string[];
}

export function SafetyAlerts({ alerts }: SafetyAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      {alerts.map((alert, index) => (
        <View key={index} style={styles.alert}>
          <AlertTriangle size={20} color="#dc2626" />
          <Text style={styles.alertText}>{alert}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  alertText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
});
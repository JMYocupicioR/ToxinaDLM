import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, OctagonAlert as AlertOctagon } from 'lucide-react-native';

// Add severity levels for alerts
export type AlertSeverity = 'info' | 'warning' | 'error';

export interface Alert {
  message: string;
  severity: AlertSeverity;
}

interface SafetyAlertsProps {
  alerts: (string | Alert)[];
}

export function SafetyAlerts({ alerts }: SafetyAlertsProps) {
  if (alerts.length === 0) return null;

  // Convert strings to Alert objects with default severity
  const normalizedAlerts: Alert[] = alerts.map(alert => 
    typeof alert === 'string' 
      ? { message: alert, severity: 'warning' } 
      : alert
  );

  return (
    <View style={styles.container}>
      {normalizedAlerts.map((alert, index) => (
        <View 
          key={index} 
          style={[
            styles.alert,
            alert.severity === 'info' && styles.infoAlert,
            alert.severity === 'warning' && styles.warningAlert,
            alert.severity === 'error' && styles.errorAlert,
          ]}
        >
          {alert.severity === 'info' && <AlertCircle size={20} color="#0284c7" />}
          {alert.severity === 'warning' && <AlertTriangle size={20} color="#dc2626" />}
          {alert.severity === 'error' && <AlertOctagon size={20} color="#7f1d1d" />}
          
          <Text style={[
            styles.alertText,
            alert.severity === 'info' && styles.infoText,
            alert.severity === 'warning' && styles.warningText,
            alert.severity === 'error' && styles.errorText,
          ]}>
            {alert.message}
          </Text>
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
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  alertText: {
    fontSize: 14,
    flex: 1,
  },
  infoAlert: {
    backgroundColor: '#e0f2fe',
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
  },
  warningAlert: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorAlert: {
    backgroundColor: '#fecaca',
    borderLeftWidth: 4,
    borderLeftColor: '#7f1d1d',
  },
  infoText: {
    color: '#0284c7',
  },
  warningText: {
    color: '#dc2626',
  },
  errorText: {
    color: '#7f1d1d',
  },
});
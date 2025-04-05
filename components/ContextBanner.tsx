import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, User, FileText, ArrowRightCircle } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { usePatients } from '@/hooks/usePatients';
import { pathologies } from '@/data/pathologyData';
import { useAppNavigation } from '@/utils/navigation';

type BannerType = 'patient' | 'pathology' | 'both';

interface ContextBannerProps {
  type?: BannerType;
}

export function ContextBanner({ type = 'both' }: ContextBannerProps) {
  const { 
    selectedPatientId, 
    setSelectedPatientId,
    selectedPathologyId,
    setSelectedPathologyId
  } = useAppContext();
  
  const { getPatient } = usePatients();
  const { navigateToCalculator, navigateToPatients, navigateToPathologies } = useAppNavigation();
  
  // Get patient data if available
  const patientData = selectedPatientId ? getPatient(selectedPatientId) : null;
  
  // Get pathology data if available
  const pathologyData = selectedPathologyId 
    ? pathologies.find(p => p.id === selectedPathologyId)
    : null;
  
  // If neither data is available or the requested type has no data, don't show anything
  if ((type === 'patient' && !patientData) || 
      (type === 'pathology' && !pathologyData) ||
      (type === 'both' && !patientData && !pathologyData)) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      {(type === 'patient' || type === 'both') && patientData && (
        <View style={styles.bannerCard}>
          <View style={styles.iconContainer}>
            <User size={20} color="#0891b2" />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Patient: {patientData.name}</Text>
            <Text style={styles.subtitle}>
              {[
                patientData.age && `${patientData.age} years`,
                patientData.weight && `${patientData.weight} kg`
              ].filter(Boolean).join(' • ')}
            </Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToPatients({ patientId: patientData.id })}
            >
              <ArrowRightCircle size={18} color="#64748b" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedPatientId(null)}
            >
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {(type === 'pathology' || type === 'both') && pathologyData && (
        <View style={styles.bannerCard}>
          <View style={styles.iconContainer}>
            <FileText size={20} color="#0891b2" />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Protocol: {pathologyData.name}</Text>
            <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
              {pathologyData.description}
            </Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToPathologies({ pathologyId: pathologyData.id })}
            >
              <ArrowRightCircle size={18} color="#64748b" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedPathologyId(null)}
            >
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {patientData && pathologyData && type === 'both' && (
        <TouchableOpacity 
          style={styles.calculatorButton}
          onPress={() => navigateToCalculator({
            patientId: patientData.id,
            pathologyId: pathologyData.id
          })}
        >
          <Text style={styles.calculatorButtonText}>Open in Calculator</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginRight: 4,
  },
  closeButton: {
    padding: 6,
  },
  calculatorButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  calculatorButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
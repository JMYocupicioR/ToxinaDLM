import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Patient } from '@/types/dosage';
import { ChevronDown, ChevronUp, User, Search, X, UserPlus } from 'lucide-react-native';
import { usePatients, PatientRecord } from '@/hooks/usePatients';
import { useAppContext } from '@/context/AppContext';
import { ContextBanner } from '@/components/ContextBanner';

interface PatientInfoProps {
  patient: Patient;
  onPatientChange: (patient: Patient) => void;
}

export function PatientInfo({ patient, onPatientChange }: PatientInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const [patientSelectorVisible, setPatientSelectorVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Get patients data and functions
  const { patients } = usePatients();
  
  // Get context values
  const { selectedPatientId, setSelectedPatientId } = useAppContext();
  
  // Check if any patient info is filled in
  const hasPatientInfo = patient.name || patient.weight || patient.age;
  
  // Filter patients based on search
  const filteredPatients = searchText
    ? patients.filter(p => 
        p.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : patients;
    
  // Handle selecting a patient from the list
  const handleSelectPatient = (selectedPatient: PatientRecord) => {
    setSelectedPatientId(selectedPatient.id);
    onPatientChange({
      name: selectedPatient.name,
      age: selectedPatient.age,
      weight: selectedPatient.weight
    });
    setPatientSelectorVisible(false);
  };
  
  // Clear selected patient
  const clearPatient = () => {
    setSelectedPatientId(null);
    onPatientChange({
      name: '',
      age: undefined,
      weight: undefined
    });
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <User size={18} color="#64748b" style={styles.icon} />
          <Text style={styles.label}>
            {hasPatientInfo 
              ? 'Patient Information' 
              : 'Patient Information (Optional)'}
          </Text>
        </View>
        
        {expanded ? (
          <ChevronUp size={18} color="#64748b" />
        ) : (
          <ChevronDown size={18} color="#64748b" />
        )}
      </TouchableOpacity>
      
      {/* Patient Context Banner when not expanded */}
      {!expanded && selectedPatientId && (
        <ContextBanner type="patient" />
      )}
      
      {expanded && (
        <View style={styles.content}>
          <View style={styles.patientActions}>
            <TouchableOpacity
              style={styles.selectPatientButton}
              onPress={() => setPatientSelectorVisible(true)}
            >
              <User size={16} color="#0891b2" />
              <Text style={styles.selectPatientText}>
                {selectedPatientId ? 'Change Patient' : 'Select Existing Patient'}
              </Text>
            </TouchableOpacity>
            
            {selectedPatientId && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearPatient}
              >
                <X size={16} color="#ef4444" />
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Patient Name"
              value={patient.name}
              onChangeText={(text) => onPatientChange({ ...patient, name: text })}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Weight"
                keyboardType="numeric"
                value={patient.weight?.toString()}
                onChangeText={(text) => {
                  const weight = text === '' ? undefined : parseFloat(text);
                  onPatientChange({ ...patient, weight });
                }}
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={patient.age?.toString()}
                onChangeText={(text) => {
                  const age = text === '' ? undefined : parseInt(text);
                  onPatientChange({ ...patient, age });
                }}
              />
            </View>
          </View>
          
          {patient.age !== undefined && patient.age < 18 && (
            <View style={styles.noticeContainer}>
              <Text style={styles.noticeText}>
                Pediatric patient detected. Dosage will be adjusted according to weight.
              </Text>
            </View>
          )}
        </View>
      )}
      
      {!expanded && hasPatientInfo && !selectedPatientId && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {[
              patient.name,
              patient.age !== undefined && `${patient.age} years`,
              patient.weight !== undefined && `${patient.weight} kg`
            ].filter(Boolean).join(' • ')}
          </Text>
        </View>
      )}
      
      {/* Patient Selection Modal */}
      <Modal
        visible={patientSelectorVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPatientSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Patient</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setPatientSelectorVisible(false)}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={18} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search patients..."
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <X size={16} color="#64748b" />
                </TouchableOpacity>
              )}
            </View>
            
            {filteredPatients.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchText 
                    ? `No patients match "${searchText}"` 
                    : 'No patients available'}
                </Text>
                <TouchableOpacity 
                  style={styles.addPatientButton}
                  onPress={() => {
                    setPatientSelectorVisible(false);
                    // Navigate to patient screen
                    // You'd implement this with proper navigation
                  }}
                >
                  <UserPlus size={16} color="#0891b2" />
                  <Text style={styles.addPatientText}>Add New Patient</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredPatients}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.patientsList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.patientItem,
                      selectedPatientId === item.id && styles.selectedPatientItem
                    ]}
                    onPress={() => handleSelectPatient(item)}
                  >
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>{item.name}</Text>
                      <View style={styles.patientDetails}>
                        {item.age && (
                          <Text style={styles.patientDetail}>Age: {item.age}</Text>
                        )}
                        {item.weight && (
                          <Text style={styles.patientDetail}>Weight: {item.weight} kg</Text>
                        )}
                      </View>
                      {item.lastVisit && (
                        <Text style={styles.visitDate}>
                          Last visit: {new Date(item.lastVisit).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  patientActions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  selectPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
  },
  selectPatientText: {
    fontSize: 14,
    color: '#0891b2',
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#334155',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  noticeContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    marginTop: 4,
  },
  noticeText: {
    fontSize: 12,
    color: '#334155',
  },
  summary: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalCloseButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    margin: 16,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#334155',
  },
  patientsList: {
    padding: 16,
  },
  patientItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedPatientItem: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0891b2',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  patientDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  patientDetail: {
    fontSize: 12,
    color: '#64748b',
  },
  visitDate: {
    fontSize: 12,
    color: '#0891b2',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  addPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addPatientText: {
    fontSize: 14,
    color: '#0891b2',
    marginLeft: 8,
  },
});
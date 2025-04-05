import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User, UserPlus, ChevronRight, X, Save, Trash2 } from 'lucide-react-native';

// Sample patient data
interface Patient {
  id: string;
  name: string;
  age?: number;
  weight?: number;
  notes?: string;
  lastVisit?: string;
}

const samplePatients: Patient[] = [
  { 
    id: '1', 
    name: 'Ana García', 
    age: 42, 
    weight: 65,
    notes: 'Cervical dystonia, responds well to Botox treatment.',
    lastVisit: '2025-03-15'
  },
  { 
    id: '2', 
    name: 'José Ramírez', 
    age: 57, 
    weight: 78,
    notes: 'Upper limb spasticity (post-stroke), typically uses Dysport.',
    lastVisit: '2025-03-22'
  },
  { 
    id: '3', 
    name: 'María López', 
    age: 36, 
    weight: 58,
    notes: 'Chronic migraine, responds well to frontalis and temporal injections.',
    lastVisit: '2025-02-18'
  },
  { 
    id: '4', 
    name: 'Carlos Vega', 
    age: 62, 
    weight: 84,
    notes: 'Lower limb spasticity, long-term treatment with Xeomin.',
    lastVisit: '2025-03-29'
  }
];

export default function PatientsScreen() {
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient>({
    id: '',
    name: '',
    age: undefined,
    weight: undefined,
    notes: '',
    lastVisit: new Date().toISOString().split('T')[0]
  });
  
  const filteredPatients = searchText
    ? patients.filter(patient => 
        patient.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : patients;
    
  const handleAddPatient = () => {
    const newId = String(Math.max(...patients.map(p => Number(p.id)), 0) + 1);
    
    setEditingPatient({
      id: newId,
      name: '',
      age: undefined,
      weight: undefined,
      notes: '',
      lastVisit: new Date().toISOString().split('T')[0]
    });
    
    setSelectedPatient(null);
    setIsModalVisible(true);
  };
  
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditingPatient({ ...patient });
    setIsModalVisible(true);
  };
  
  const handleSavePatient = () => {
    if (!editingPatient.name.trim()) {
      Alert.alert('Error', 'Patient name is required');
      return;
    }
    
    if (selectedPatient) {
      // Editing existing patient
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? editingPatient : p
      ));
    } else {
      // Adding new patient
      setPatients([...patients, editingPatient]);
    }
    
    setIsModalVisible(false);
  };
  
  const handleDeletePatient = () => {
    if (!selectedPatient) return;
    
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${selectedPatient.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setPatients(patients.filter(p => p.id !== selectedPatient.id));
            setIsModalVisible(false);
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Patients</Text>
          
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patients"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPatient}
          >
            <UserPlus size={18} color="#ffffff" />
            <Text style={styles.addButtonText}>Add New Patient</Text>
          </TouchableOpacity>
          
          {filteredPatients.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={48} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>No Patients Found</Text>
              <Text style={styles.emptyStateText}>
                {searchText 
                  ? `No patients match "${searchText}"`
                  : 'Start by adding your first patient'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.patientsList}>
              {filteredPatients.map(patient => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.patientItem}
                  onPress={() => handleEditPatient(patient)}
                >
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={styles.patientDetails}>
                      {patient.age && (
                        <Text style={styles.patientDetail}>Age: {patient.age}</Text>
                      )}
                      {patient.weight && (
                        <Text style={styles.patientDetail}>Weight: {patient.weight} kg</Text>
                      )}
                    </View>
                    {patient.lastVisit && (
                      <Text style={styles.visitDate}>
                        Last visit: {formatDate(patient.lastVisit)}
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Patient Editor Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editingPatient.name}
                  onChangeText={(text) => setEditingPatient({...editingPatient, name: text})}
                  placeholder="Patient's name"
                />
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={editingPatient.age?.toString() || ''}
                    onChangeText={(text) => {
                      const age = text === '' ? undefined : parseInt(text);
                      setEditingPatient({...editingPatient, age});
                    }}
                    placeholder="Years"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={editingPatient.weight?.toString() || ''}
                    onChangeText={(text) => {
                      const weight = text === '' ? undefined : parseFloat(text);
                      setEditingPatient({...editingPatient, weight});
                    }}
                    placeholder="kg"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Visit</Text>
                <TextInput
                  style={styles.input}
                  value={editingPatient.lastVisit || ''}
                  onChangeText={(text) => setEditingPatient({...editingPatient, lastVisit: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editingPatient.notes || ''}
                  onChangeText={(text) => setEditingPatient({...editingPatient, notes: text})}
                  placeholder="Clinical notes about the patient"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              {selectedPatient && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeletePatient}
                >
                  <Trash2 size={18} color="#ef4444" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePatient}
              >
                <Save size={18} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891b2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  patientsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  patientInfo: {
    flex: 1,
    marginRight: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  patientDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  patientDetail: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  visitDate: {
    fontSize: 12,
    color: '#0891b2',
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
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
    maxHeight: '80%',
    maxWidth: 600,
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
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#334155',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 8,
  },
});
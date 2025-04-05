import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Info, X, ChevronRight } from 'lucide-react-native';
import { ToxinBrand } from '@/types/dosage';
import { Pathology, pathologyData } from '@/data/pathologyData';

interface PathologySelectorProps {
  selectedBrand: ToxinBrand | '';
  selectedPathologyId: string | null;
  onSelectPathology: (pathologyId: string | null) => void;
  onApplyRecommendedMuscles?: (muscles: Array<{
    muscleName: string;
    recommendedDosage: 'min' | 'max';
  }>) => void;
}

export function PathologySelector({ 
  selectedBrand, 
  selectedPathologyId, 
  onSelectPathology,
  onApplyRecommendedMuscles 
}: PathologySelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPathologyForDetail, setSelectedPathologyForDetail] = useState<Pathology | null>(null);

  const selectedPathology = selectedPathologyId 
    ? pathologyData.find(p => p.id === selectedPathologyId) || null 
    : null;

  const handleOpenPathologyDetail = (pathology: Pathology) => {
    setSelectedPathologyForDetail(pathology);
    setIsModalVisible(true);
  };

  const handleSelectPathology = (pathologyId: string) => {
    // If already selected, deselect it
    if (pathologyId === selectedPathologyId) {
      onSelectPathology(null);
    } else {
      onSelectPathology(pathologyId);
    }
  };

  const handleApplyRecommendedMuscles = () => {
    if (!selectedPathology || !selectedBrand || !onApplyRecommendedMuscles) return;
    
    const muscles = selectedPathology.recommendedMuscles[selectedBrand as ToxinBrand];
    if (muscles) {
      onApplyRecommendedMuscles(
        muscles.map(m => ({
          muscleName: m.muscleName,
          recommendedDosage: m.recommendedDosage
        }))
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pathology</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.pathologiesRow}>
          {pathologyData.map((pathology) => (
            <View key={pathology.id} style={styles.pathologyItem}>
              <TouchableOpacity
                style={[
                  styles.pathologyButton,
                  selectedPathologyId === pathology.id && styles.selectedPathologyButton
                ]}
                onPress={() => handleSelectPathology(pathology.id)}
              >
                <Text 
                  style={[
                    styles.pathologyButtonText,
                    selectedPathologyId === pathology.id && styles.selectedPathologyButtonText
                  ]}
                >
                  {pathology.name}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleOpenPathologyDetail(pathology)}
              >
                <Info size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {selectedPathology && selectedBrand && onApplyRecommendedMuscles && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyRecommendedMuscles}
        >
          <Text style={styles.applyButtonText}>
            Apply Recommended Muscles
          </Text>
          <ChevronRight size={16} color="#ffffff" />
        </TouchableOpacity>
      )}
      
      {/* Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPathologyForDetail && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPathologyForDetail.name}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <X size={18} color="#64748b" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedPathologyForDetail.description}
                  </Text>
                  
                  {selectedBrand && selectedPathologyForDetail.recommendedMuscles[selectedBrand as ToxinBrand] && (
                    <>
                      <Text style={styles.sectionTitle}>Recommended Muscles</Text>
                      <Text style={styles.noteText}>
                        For {selectedBrand} treatment
                      </Text>
                      
                      <View style={styles.musclesContainer}>
                        <Text style={styles.muscleGroupTitle}>Primary Muscles</Text>
                        {selectedPathologyForDetail.recommendedMuscles[selectedBrand as ToxinBrand]
                          ?.filter(m => m.priority === 'primary')
                          .map((muscle, index) => (
                            <View key={index} style={styles.muscleItem}>
                              <Text style={styles.muscleName}>{muscle.muscleName}</Text>
                              <Text style={styles.muscleDetail}>
                                {muscle.recommendedDosage === 'min' ? 'Minimum' : 'Maximum'} dose
                              </Text>
                            </View>
                          ))
                        }
                        
                        <Text style={[styles.muscleGroupTitle, { marginTop: 16 }]}>Secondary Muscles</Text>
                        {selectedPathologyForDetail.recommendedMuscles[selectedBrand as ToxinBrand]
                          ?.filter(m => m.priority === 'secondary')
                          .map((muscle, index) => (
                            <View key={index} style={styles.muscleItem}>
                              <Text style={styles.muscleName}>{muscle.muscleName}</Text>
                              <Text style={styles.muscleDetail}>
                                {muscle.recommendedDosage === 'min' ? 'Minimum' : 'Maximum'} dose
                              </Text>
                            </View>
                          ))
                        }
                        
                        {selectedPathologyForDetail.recommendedMuscles[selectedBrand as ToxinBrand]?.filter(m => m.priority === 'secondary').length === 0 && (
                          <Text style={styles.emptyText}>No secondary muscles recommended</Text>
                        )}
                      </View>
                    </>
                  )}
                  
                  {selectedPathologyForDetail.references && (
                    <View style={styles.referencesContainer}>
                      <Text style={styles.sectionTitle}>References</Text>
                      {selectedPathologyForDetail.references.map((reference, index) => (
                        <Text key={index} style={styles.referenceText}>
                          • {reference}
                        </Text>
                      ))}
                    </View>
                  )}
                  
                  {selectedBrand && onApplyRecommendedMuscles && (
                    <TouchableOpacity
                      style={styles.modalApplyButton}
                      onPress={() => {
                        const muscles = selectedPathologyForDetail.recommendedMuscles[selectedBrand as ToxinBrand];
                        if (muscles) {
                          onApplyRecommendedMuscles(
                            muscles.map(m => ({
                              muscleName: m.muscleName,
                              recommendedDosage: m.recommendedDosage
                            }))
                          );
                          setIsModalVisible(false);
                        }
                      }}
                    >
                      <Text style={styles.modalApplyButtonText}>
                        Apply Recommended Muscles
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </>
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
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  scrollView: {
    marginBottom: 8,
  },
  pathologiesRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  pathologyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  pathologyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedPathologyButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  pathologyButtonText: {
    fontSize: 14,
    color: '#334155',
  },
  selectedPathologyButtonText: {
    color: '#ffffff',
  },
  infoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
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
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  musclesContainer: {
    marginBottom: 20,
  },
  muscleGroupTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  muscleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    marginBottom: 4,
  },
  muscleName: {
    fontSize: 14,
    color: '#334155',
  },
  muscleDetail: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
  referencesContainer: {
    marginBottom: 20,
  },
  referenceText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
    marginLeft: 8,
  },
  modalApplyButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  modalApplyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  }
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { pathologies, Pathology } from '@/data/pathologyData';
import { TOXIN_BRANDS } from '@/types/dosage';
import { ChevronRight, FileText } from 'lucide-react-native';

export default function PathologiesScreen() {
  const router = useRouter();
  const [selectedPathology, setSelectedPathology] = useState<Pathology | null>(null);

  const handleSelectPathology = (pathology: Pathology) => {
    setSelectedPathology(pathology);
  };

  const handleOpenCalculator = (pathologyId: string) => {
    router.push({
      pathname: '/',
      params: { 
        pathologyId,
        source: 'pathologies'
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Clinical Indications</Text>
        <Text style={styles.subtitle}>
          Browse treatment protocols by clinical indication
        </Text>

        <View style={styles.mainContainer}>
          <View style={styles.listSection}>
            <FlatList
              data={pathologies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pathologyItem,
                    selectedPathology?.id === item.id && styles.selectedPathologyItem,
                  ]}
                  onPress={() => handleSelectPathology(item)}
                >
                  <Text style={[
                    styles.pathologyName,
                    selectedPathology?.id === item.id && styles.selectedPathologyName,
                  ]}>
                    {item.name}
                  </Text>
                  <ChevronRight 
                    size={18} 
                    color={selectedPathology?.id === item.id ? '#0891b2' : '#94a3b8'} 
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.pathologyList}
            />
          </View>

          <View style={styles.detailSection}>
            {selectedPathology ? (
              <ScrollView style={styles.pathologyDetail}>
                <Text style={styles.detailTitle}>{selectedPathology.name}</Text>
                
                <View style={styles.detailCard}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>{selectedPathology.description}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.sectionTitle}>Recommended Muscles by Brand</Text>
                  
                  {TOXIN_BRANDS.map((brand) => (
                    <View key={brand} style={styles.brandSection}>
                      <Text style={styles.brandTitle}>{brand}</Text>
                      
                      {selectedPathology.recommendedMuscles[brand]?.length ? (
                        <View style={styles.musclesList}>
                          {selectedPathology.recommendedMuscles[brand]?.map((muscle, index) => (
                            <View key={index} style={styles.muscleItem}>
                              <View style={[
                                styles.priorityIndicator, 
                                muscle.priority === 'primary' ? styles.primaryPriority : styles.secondaryPriority
                              ]} />
                              <View style={styles.muscleDetail}>
                                <Text style={styles.muscleName}>{muscle.muscleName}</Text>
                                <View style={styles.muscleInfo}>
                                  <Text style={styles.muscleInfoText}>
                                    Priority: {muscle.priority === 'primary' ? 'Primary' : 'Secondary'}
                                  </Text>
                                  <Text style={styles.muscleInfoText}>
                                    Dosage: {muscle.recommendedDosage === 'min' ? 'Minimum' : 'Maximum'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.noDataText}>
                          No specific recommendations available for {brand}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.calculatorButton}
                  onPress={() => handleOpenCalculator(selectedPathology.id)}
                >
                  <FileText size={18} color="#ffffff" />
                  <Text style={styles.calculatorButtonText}>
                    Open Calculator with This Protocol
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View style={styles.noSelectionView}>
                <Text style={styles.noSelectionText}>
                  Select a clinical indication to view details
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  listSection: {
    flex: 1,
    maxWidth: 300,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  pathologyList: {
    padding: 8,
  },
  pathologyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedPathologyItem: {
    backgroundColor: '#e0f2fe',
  },
  pathologyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  selectedPathologyName: {
    color: '#0891b2',
  },
  detailSection: {
    flex: 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  pathologyDetail: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  brandSection: {
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0891b2',
    marginBottom: 8,
  },
  musclesList: {
    gap: 8,
  },
  muscleItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priorityIndicator: {
    width: 4,
  },
  primaryPriority: {
    backgroundColor: '#0891b2',
  },
  secondaryPriority: {
    backgroundColor: '#64748b',
  },
  muscleDetail: {
    flex: 1,
    padding: 12,
  },
  muscleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  muscleInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleInfoText: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noDataText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  calculatorButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  calculatorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  noSelectionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
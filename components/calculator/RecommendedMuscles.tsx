import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AlertTriangle, CheckCircle2, Plus } from 'lucide-react-native';
import { ToxinBrand, SelectedMuscle } from '@/types/dosage';
import { pathologies, MuscleRecommendation } from '@/data/pathologyData';
import { toxinData } from '@/data/toxinData';

interface RecommendedMusclesProps {
  selectedPathology: string | null;
  selectedBrand: ToxinBrand;
  selectedMuscles: SelectedMuscle[];
  onAddMuscle: (muscleName: string, dosageType: 'min' | 'max') => void;
}

export function RecommendedMuscles({
  selectedPathology,
  selectedBrand,
  selectedMuscles,
  onAddMuscle,
}: RecommendedMusclesProps) {
  // If no pathology is selected, don't show anything
  if (!selectedPathology) {
    return null;
  }

  // Find the pathology data
  const pathology = pathologies.find((p) => p.id === selectedPathology);
  if (!pathology) {
    return null;
  }

  // Get the recommended muscles for the selected brand
  const recommendedMuscles = pathology.recommendedMuscles[selectedBrand] || [];
  if (recommendedMuscles.length === 0) {
    return (
      <View style={styles.noRecommendationsContainer}>
        <AlertTriangle size={20} color="#f59e0b" />
        <Text style={styles.noRecommendationsText}>
          No specific muscle recommendations are available for this clinical indication with {selectedBrand}.
        </Text>
      </View>
    );
  }

  // Filter out muscles that are not available in the toxin data
  const availableRecommendedMuscles = recommendedMuscles.filter(
    (muscle) => toxinData[selectedBrand][muscle.muscleName]
  );

  // Check if the muscle is already selected
  const isMuscleSelected = (muscleName: string): boolean => {
    return selectedMuscles.some((m) => m.name === muscleName);
  };

  // Group muscles by priority
  const primaryMuscles = availableRecommendedMuscles.filter(
    (muscle) => muscle.priority === 'primary'
  );
  const secondaryMuscles = availableRecommendedMuscles.filter(
    (muscle) => muscle.priority === 'secondary'
  );

  // Handle adding a recommended muscle
  const handleAddMuscle = (recommendation: MuscleRecommendation) => {
    onAddMuscle(recommendation.muscleName, recommendation.recommendedDosage);
  };

  // Function to render a muscle recommendation item
  const renderMuscleItem = (recommendation: MuscleRecommendation) => {
    const isSelected = isMuscleSelected(recommendation.muscleName);
    const muscleData = toxinData[selectedBrand][recommendation.muscleName];
    const dosage = recommendation.recommendedDosage === 'min' ? muscleData.min : muscleData.max;

    return (
      <View
        key={recommendation.muscleName}
        style={[
          styles.muscleItem,
          isSelected && styles.selectedMuscleItem,
        ]}
      >
        <View style={styles.muscleInfo}>
          <Text style={styles.muscleName}>{recommendation.muscleName}</Text>
          <Text style={styles.dosageText}>
            Recommended: {dosage} U ({recommendation.recommendedDosage === 'min' ? 'Minimum' : 'Maximum'} dose)
          </Text>
        </View>
        
        {isSelected ? (
          <View style={styles.selectedIndicator}>
            <CheckCircle2 size={20} color="#10b981" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddMuscle(recommendation)}
          >
            <Plus size={16} color="#0891b2" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Muscles for {pathology.name}</Text>
      
      <ScrollView style={styles.musclesList}>
        {primaryMuscles.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Primary Targets</Text>
            {primaryMuscles.map(renderMuscleItem)}
          </View>
        )}
        
        {secondaryMuscles.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Secondary Targets</Text>
            {secondaryMuscles.map(renderMuscleItem)}
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.applyAllButton}
        onPress={() => {
          // Add all unselected recommended muscles
          availableRecommendedMuscles.forEach(muscle => {
            if (!isMuscleSelected(muscle.muscleName)) {
              handleAddMuscle(muscle);
            }
          });
        }}
      >
        <Text style={styles.applyAllButtonText}>
          Apply All Recommended Muscles
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  musclesList: {
    maxHeight: 220,
  },
  sectionContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedMuscleItem: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdfa',
  },
  muscleInfo: {
    flex: 1,
  },
  muscleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 2,
  },
  dosageText: {
    fontSize: 12,
    color: '#64748b',
  },
  selectedIndicator: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addButtonText: {
    fontSize: 12,
    color: '#0891b2',
    marginLeft: 4,
  },
  applyAllButton: {
    backgroundColor: '#0891b2',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyAllButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  noRecommendationsContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  noRecommendationsText: {
    fontSize: 14,
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
  },
});
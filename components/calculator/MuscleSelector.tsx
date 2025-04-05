import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { ToxinBrand, SelectedMuscle } from '@/types/dosage';
import { toxinData } from '@/data/toxinData';
import { Search, X, Plus, ChevronDown } from 'lucide-react-native';

interface MuscleSelectorProps {
  brand: ToxinBrand;
  selectedMuscles: SelectedMuscle[];
  onMusclesChange: (muscles: SelectedMuscle[]) => void;
}

// Group muscles by anatomical region
const MUSCLE_GROUPS = {
  'Upper Limb': [
    'Biceps brachii', 'Brachialis', 'Brachioradialis', 'Triceps brachii',
    'Pronator teres', 'Pronator quadratus', 'Supinador',
    'Flexor carpi radialis', 'Flexor carpi ulnaris', 'Extensor carpi radialis brevis',
    'Extensor carpi radialis longus', 'Extensor carpi ulnaris'
  ],
  'Hand': [
    'Adductor pollicis longus', 'Flexor pollicis longus', 'Extensor pollicis brevis',
    'Extensor pollicis longus', 'Extensor indicis', 'Extensor digiti minimi',
    'Extensor digitorum communis', 'Flexor digitorum profundus', 'Flexor digitorum superficialis'
  ],
  'Shoulder': [
    'Deltoides', 'Infraespinoso', 'Trapecio', 'Pectoral mayor', 'Pectoralis minor',
    'Serrato anterior', 'Redondo mayor', 'Redondo menor', 'Romboides', 'Dorsal ancho',
    'Subscapularis', 'Supraespinoso', 'Coracobrachialis'
  ],
  'Lower Limb': [
    'Rectus femoris', 'Vastus lateralis', 'Vastus medialis', 'Biceps femoris',
    'Semitendinosus', 'Semimembranosus', 'Gracilis', 'Adductor longus',
    'Adductor magnus', 'Tibialis anterior', 'Tibialis posterior',
    'Gastrocnemio (cabeza lateral)', 'Gastrocnemio (cabeza medial)', 'Sóleo'
  ],
  'Foot': [
    'Abductor hallucis', 'Flexor hallucis brevis', 'Flexor hallucis longus',
    'Extensor hallucis longus', 'Flexor digitorum brevis', 'Flexor digitorum longus',
    'Extensor digitorum longus', 'Peroneus brevis', 'Peroneus longus', 'Peroneus tertius'
  ],
  'Trunk & Hip': [
    'Cuadrado lumbar', 'Psoas mayor', 'Glúteo medio', 'Ilíaco', 'Pectineus',
    'Popliteus'
  ]
};

export function MuscleSelector({ brand, selectedMuscles, onMusclesChange }: MuscleSelectorProps) {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredMuscles, setFilteredMuscles] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  
  // Get all available muscles for current brand
  const allMuscles = Object.keys(toxinData[brand]);
  
  // Filter muscles by search text or selected group
  useEffect(() => {
    let filtered = allMuscles;
    
    if (searchText) {
      filtered = allMuscles.filter(muscle => 
        muscle.toLowerCase().includes(searchText.toLowerCase())
      );
    } else if (selectedGroup) {
      filtered = MUSCLE_GROUPS[selectedGroup as keyof typeof MUSCLE_GROUPS] || [];
      // Only include muscles that are available for the selected brand
      filtered = filtered.filter(muscle => allMuscles.includes(muscle));
    }
    
    setFilteredMuscles(filtered);
  }, [searchText, brand, selectedGroup, allMuscles]);
  
  const addMuscle = (muscleName: string) => {
    if (selectedMuscles.some((m) => m.name === muscleName)) {
      return;
    }

    const muscleData = toxinData[brand][muscleName];
    const newMuscle: SelectedMuscle = {
      name: muscleName,
      dosageType: 'min',
      baseAmount: muscleData.min,
      adjustedAmount: muscleData.min,
    };

    onMusclesChange([...selectedMuscles, newMuscle]);
    setIsModalVisible(false);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Muscles</Text>
      
      <TouchableOpacity
        style={styles.muscleSelector}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.muscleButtonText}>
          {selectedMuscles.length > 0 
            ? `${selectedMuscles.length} muscle${selectedMuscles.length > 1 ? 's' : ''} selected` 
            : 'Select muscles to treat'}
        </Text>
        <ChevronDown size={18} color="#64748b" />
      </TouchableOpacity>
      
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Muscles</Text>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={18} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search muscles..."
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <X size={16} color="#64748b" />
                </TouchableOpacity>
              )}
            </View>
            
            {!searchText && (
              <View style={styles.groupsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.groupButton,
                      selectedGroup === null && styles.activeGroupButton
                    ]}
                    onPress={() => setSelectedGroup(null)}
                  >
                    <Text style={[
                      styles.groupButtonText,
                      selectedGroup === null && styles.activeGroupButtonText
                    ]}>
                      All
                    </Text>
                  </TouchableOpacity>
                  
                  {Object.keys(MUSCLE_GROUPS).map((group) => (
                    <TouchableOpacity
                      key={group}
                      style={[
                        styles.groupButton,
                        selectedGroup === group && styles.activeGroupButton
                      ]}
                      onPress={() => setSelectedGroup(group)}
                    >
                      <Text style={[
                        styles.groupButtonText,
                        selectedGroup === group && styles.activeGroupButtonText
                      ]}>
                        {group}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            <FlatList
              data={filteredMuscles}
              style={styles.muscleList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.muscleItem}
                  onPress={() => addMuscle(item)}
                >
                  <Text style={styles.muscleText}>{item}</Text>
                  <Plus size={18} color="#0891b2" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {searchText 
                      ? 'No matching muscles found' 
                      : 'No muscles available for this selection'}
                  </Text>
                </View>
              }
            />
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
  muscleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  muscleButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  groupsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  groupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeGroupButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  groupButtonText: {
    fontSize: 14,
    color: '#334155',
  },
  activeGroupButtonText: {
    color: '#ffffff',
  },
  muscleList: {
    flexGrow: 0,
    maxHeight: 400,
  },
  muscleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  muscleText: {
    fontSize: 14,
    color: '#334155',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
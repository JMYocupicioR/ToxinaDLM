import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';

interface ToxinSelectorProps {
  selectedToxin: string;
  onSelectToxin: (toxin: string) => void;
}

interface ToxinInfo {
  id: string;
  name: string;
  brandNames: string[];
  conversionFactor: string;
  description: string;
  useCases: string[];
}

const TOXIN_TYPES: ToxinInfo[] = [
  {
    id: 'OnabotulinumtoxinA',
    name: 'OnabotulinumtoxinA',
    brandNames: ['Botox'],
    conversionFactor: 'Reference standard (1:1)',
    description: 'Most widely used botulinum toxin with extensive clinical data across various indications.',
    useCases: [
      'Cosmetic wrinkle reduction',
      'Chronic migraine prophylaxis',
      'Upper/lower limb spasticity',
      'Cervical dystonia',
      'Hyperhidrosis',
      'Overactive bladder'
    ]
  },
  {
    id: 'AbobotulinumtoxinA',
    name: 'AbobotulinumtoxinA',
    brandNames: ['Dysport'],
    conversionFactor: '2.5-3:1 ratio to OnabotulinumtoxinA',
    description: 'Diffuses more widely than Botox, requiring different dosing and potentially offering a wider field of effect.',
    useCases: [
      'Cosmetic wrinkle reduction',
      'Upper/lower limb spasticity',
      'Cervical dystonia',
      'Pediatric spasticity (approved for ages 2+)'
    ]
  },
  {
    id: 'IncobotulinumtoxinA',
    name: 'IncobotulinumtoxinA',
    brandNames: ['Xeomin'],
    conversionFactor: '1:1 ratio to OnabotulinumtoxinA',
    description: 'Free from complexing proteins, potentially reducing immunogenicity with repeated treatments.',
    useCases: [
      'Cosmetic wrinkle reduction',
      'Upper limb spasticity',
      'Cervical dystonia',
      'Blepharospasm',
      'Sialorrhea (approved for pediatric use)'
    ]
  },
  {
    id: 'RimabotulinumtoxinB',
    name: 'RimabotulinumtoxinB',
    brandNames: ['Myobloc', 'Neurobloc'],
    conversionFactor: '50:1 ratio to OnabotulinumtoxinA',
    description: 'Type B toxin with different receptor targeting, potentially useful for patients resistant to type A toxins.',
    useCases: [
      'Cervical dystonia',
      'Sialorrhea',
      'Alternative for type A resistant patients'
    ]
  }
];

export function ToxinSelector({ selectedToxin, onSelectToxin }: ToxinSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedToxinInfo, setSelectedToxinInfo] = useState<ToxinInfo | null>(null);

  const openInfoModal = (toxin: ToxinInfo) => {
    setSelectedToxinInfo(toxin);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Toxin Type</Text>
      <View style={styles.buttonContainer}>
        {TOXIN_TYPES.map((toxin) => (
          <View key={toxin.id} style={styles.toxinRow}>
            <TouchableOpacity
              style={[
                styles.toxinButton,
                selectedToxin === toxin.id && styles.selectedButton,
              ]}
              onPress={() => onSelectToxin(toxin.id)}>
              <Text
                style={[
                  styles.toxinButtonText,
                  selectedToxin === toxin.id && styles.selectedButtonText,
                ]}>
                {toxin.name}
              </Text>
              <Text
                style={[
                  styles.brandNameText,
                  selectedToxin === toxin.id && styles.selectedBrandNameText,
                ]}>
                {toxin.brandNames.join(', ')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => openInfoModal(toxin)}>
              <AlertCircle size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedToxinInfo && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedToxinInfo.name}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <X size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Brand Names:</Text>
                    <Text style={styles.infoText}>{selectedToxinInfo.brandNames.join(', ')}</Text>
                  </View>
                  
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Conversion Factor:</Text>
                    <Text style={styles.infoText}>{selectedToxinInfo.conversionFactor}</Text>
                  </View>
                  
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Description:</Text>
                    <Text style={styles.infoText}>{selectedToxinInfo.description}</Text>
                  </View>
                  
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Clinical Applications:</Text>
                    {selectedToxinInfo.useCases.map((useCase, index) => (
                      <Text key={index} style={styles.bulletPoint}>• {useCase}</Text>
                    ))}
                  </View>
                </View>
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
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  toxinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toxinButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  toxinButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  brandNameText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  selectedBrandNameText: {
    color: '#e0f2fe',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
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
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
});
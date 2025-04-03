import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ToxinBrand } from '@/types/dosage';

interface BrandSelectorProps {
  selectedBrand: ToxinBrand | '';
  onBrandChange: (brand: ToxinBrand | '') => void;
  brands: readonly ToxinBrand[];
}

export function BrandSelector({ selectedBrand, onBrandChange, brands }: BrandSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Brand</Text>
      <View style={styles.buttonContainer}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand}
            style={[
              styles.brandButton,
              selectedBrand === brand && styles.selectedButton,
            ]}
            onPress={() => onBrandChange(brand)}>
            <Text
              style={[
                styles.brandButtonText,
                selectedBrand === brand && styles.selectedButtonText,
              ]}>
              {brand}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedButton: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  brandButtonText: {
    fontSize: 14,
    color: '#334155',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
});
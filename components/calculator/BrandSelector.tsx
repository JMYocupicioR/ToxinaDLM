import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ToxinBrand } from '@/types/dosage';
import { AlertCircle } from 'lucide-react-native';

interface BrandSelectorProps {
  selectedBrand: ToxinBrand | '';
  onBrandChange: (brand: ToxinBrand | '') => void;
  brands: readonly ToxinBrand[];
}

// Toxin brand information
const BRAND_INFO = {
  'Botox': {
    fullName: 'OnabotulinumtoxinA',
    description: 'Most widely used botulinum toxin with extensive clinical data',
    color: '#3b82f6',
  },
  'Dysport': {
    fullName: 'AbobotulinumtoxinA',
    description: 'Diffuses more widely, often with 2.5:1 conversion ratio',
    color: '#8b5cf6',
  },
  'Xeomin': {
    fullName: 'IncobotulinumtoxinA',
    description: 'Free from complexing proteins, may reduce immunogenicity',
    color: '#10b981',
  }
};

export function BrandSelector({ selectedBrand, onBrandChange, brands }: BrandSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Toxin Brand</Text>
      
      <View style={styles.brandsGrid}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand}
            style={[
              styles.brandCard,
              selectedBrand === brand && styles.selectedBrandCard,
              { borderLeftColor: BRAND_INFO[brand].color }
            ]}
            onPress={() => onBrandChange(brand)}
          >
            <View style={styles.brandCardContent}>
              <View style={styles.brandNameContainer}>
                <Text style={styles.brandName}>{brand}</Text>
                <Text style={styles.brandScientific}>
                  {BRAND_INFO[brand].fullName}
                </Text>
              </View>
              
              <Text style={styles.brandDescription}>
                {BRAND_INFO[brand].description}
              </Text>
              
              {brand === 'Dysport' && (
                <View style={styles.conversionInfo}>
                  <AlertCircle size={14} color="#64748b" />
                  <Text style={styles.conversionText}>
                    Uses 2.5-3x units vs Botox
                  </Text>
                </View>
              )}
            </View>
            
            <View 
              style={[
                styles.brandSelector, 
                selectedBrand === brand && styles.selectedBrandSelector,
                { backgroundColor: selectedBrand === brand ? BRAND_INFO[brand].color : '#e2e8f0' }
              ]} 
            />
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
  brandsGrid: {
    gap: 10,
  },
  brandCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  selectedBrandCard: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
  },
  brandCardContent: {
    flex: 1,
    padding: 12,
  },
  brandNameContainer: {
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  brandScientific: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  brandDescription: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  brandSelector: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  selectedBrandSelector: {
    backgroundColor: '#3b82f6',
  },
  conversionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  conversionText: {
    fontSize: 10,
    color: '#64748b',
  },
});
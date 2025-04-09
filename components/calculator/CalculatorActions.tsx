import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, ActivityIndicator, Share } from 'react-native';
import { Calculator, RefreshCw, Printer, Share2 } from 'lucide-react-native';

interface CalculatorActionsProps {
  onCalculate: () => void;
  onReset: () => void;
  canCalculate: boolean;
  isCalculating?: boolean;
}

export function CalculatorActions({ 
  onCalculate, 
  onReset, 
  canCalculate, 
  isCalculating = false 
}: CalculatorActionsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!canCalculate || isSharing) return;
    
    setIsSharing(true);
    try {
      await Share.share({
        message: 'ToxinaDLM - Cálculo de dosis',
        title: 'Compartir cálculo'
      });
    } catch (error) {
      console.error('Error sharing calculation:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.mainButton, 
          !canCalculate && styles.disabledButton,
          isCalculating && styles.loadingButton
        ]}
        onPress={onCalculate}
        disabled={!canCalculate || isCalculating}>
        
        {isCalculating ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Calculator size={18} color="#ffffff" />
        )}
        
        <Text style={styles.mainButtonText}>
          {isCalculating ? 'Calculando...' : 'Calcular Dosis'}
        </Text>
      </TouchableOpacity>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onReset}>
          <RefreshCw size={16} color="#64748b" />
          <Text style={styles.secondaryButtonText}>Reiniciar</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={[
              styles.secondaryButton, 
              !canCalculate && styles.disabledSecondaryButton
            ]}
            disabled={!canCalculate}>
            <Printer 
              size={16} 
              color={canCalculate ? "#64748b" : "#cbd5e1"} 
            />
            <Text style={[
              styles.secondaryButtonText, 
              !canCalculate && styles.disabledSecondaryText
            ]}>
              Imprimir
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.secondaryButton, 
            (!canCalculate || isSharing) && styles.disabledSecondaryButton
          ]}
          onPress={handleShare}
          disabled={!canCalculate || isSharing}>
          {isSharing ? (
            <ActivityIndicator size="small" color="#64748b" />
          ) : (
            <Share2 
              size={16} 
              color={canCalculate ? "#64748b" : "#cbd5e1"} 
            />
          )}
          <Text style={[
            styles.secondaryButtonText,
            (!canCalculate || isSharing) && styles.disabledSecondaryText
          ]}>
            {isSharing ? 'Compartiendo...' : 'Compartir'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowColor: '#94a3b8',
  },
  loadingButton: {
    backgroundColor: '#0e7490',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    marginLeft: 6,
  },
  disabledSecondaryButton: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
  },
  disabledSecondaryText: {
    color: '#cbd5e1',
  }
});
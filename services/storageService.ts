// services/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { Patient, ToxinBrand, SelectedMuscle } from '@/types/dosage';

// Actualizar la interfaz CalculationResult con el modelo de paciente unificado
export interface CalculationResult {
  totalDose: number;
  musclesList: SelectedMuscle[];
  brand: ToxinBrand;
  patient: Patient;
  alerts: string[];
  timestamp?: string;
  pathologyId?: string;
}

export interface AppSettings {
  isDarkMode: boolean;
  areNotificationsEnabled: boolean;
  useMetricUnits: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  CALCULATION_HISTORY: 'toxinadlm_calculation_history',
  PATIENTS: 'toxinadlm_patients',
  RECENT_CALCULATION: 'toxinadlm_recent_calculation',
  SETTINGS: 'toxinadlm_settings'
};

// Función de utilidad para mostrar alertas si no estamos en una plataforma web
const showErrorAlert = (title: string, message: string) => {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message);
  }
  console.error(`${title}: ${message}`);
};

// Función de utilidad para operaciones de AsyncStorage con manejo de errores mejorado
const safeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      showErrorAlert('Storage Error', `Failed to read from storage: ${key}`);
      throw error; // Re-throw para permitir manejo personalizado
    }
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      showErrorAlert('Storage Error', `Failed to write to storage: ${key}`);
      throw error;
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      showErrorAlert('Storage Error', `Failed to remove from storage: ${key}`);
      throw error;
    }
  }
};

// Implementación de un almacenamiento en memoria como fallback
const memoryStorage: Record<string, string> = {};

// Función de fallback que usa almacenamiento en memoria si AsyncStorage falla
const fallbackStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return memoryStorage[key] || null;
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStorage[key] = value;
  },
  
  removeItem: async (key: string): Promise<void> => {
    delete memoryStorage[key];
  }
};

// Save calculation to history with improved error handling
export const saveCalculationToHistory = async (calculation: CalculationResult): Promise<boolean> => {
  try {
    // Get existing history
    let history: CalculationResult[] = [];
    
    try {
      const historyString = await safeAsyncStorage.getItem(STORAGE_KEYS.CALCULATION_HISTORY);
      history = historyString ? JSON.parse(historyString) : [];
    } catch (error) {
      console.warn('Failed to fetch calculation history, starting fresh');
    }
    
    // Add new calculation with timestamp
    const calculationWithTimestamp = {
      ...calculation,
      timestamp: new Date().toISOString()
    };
    
    // Limit history to last 100 calculations
    history.unshift(calculationWithTimestamp);
    if (history.length > 100) history.pop();
    
    // Save updated history
    await safeAsyncStorage.setItem(STORAGE_KEYS.CALCULATION_HISTORY, JSON.stringify(history));
    
    // Save as recent calculation
    await safeAsyncStorage.setItem(STORAGE_KEYS.RECENT_CALCULATION, JSON.stringify(calculationWithTimestamp));
    
    return true;
  } catch (error) {
    console.error('Error saving calculation to history:', error);
    
    // Fallback: try using memory storage
    try {
      const calculationWithTimestamp = {
        ...calculation,
        timestamp: new Date().toISOString()
      };
      
      await fallbackStorage.setItem(STORAGE_KEYS.RECENT_CALCULATION, JSON.stringify(calculationWithTimestamp));
      console.log('Saved calculation to memory fallback storage');
      return true;
    } catch (fallbackError) {
      console.error('Even fallback storage failed:', fallbackError);
      return false;
    }
  }
};

// Get calculation history with improved error handling
export const getCalculationHistory = async (): Promise<CalculationResult[]> => {
  try {
    const historyString = await safeAsyncStorage.getItem(STORAGE_KEYS.CALCULATION_HISTORY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting calculation history:', error);
    showErrorAlert('Error', 'Failed to load calculation history');
    return [];
  }
};

// Clear calculation history with improved error handling
export const clearCalculationHistory = async (): Promise<boolean> => {
  try {
    await safeAsyncStorage.removeItem(STORAGE_KEYS.CALCULATION_HISTORY);
    return true;
  } catch (error) {
    console.error('Error clearing calculation history:', error);
    showErrorAlert('Error', 'Failed to clear calculation history');
    return false;
  }
};

// Get recent calculation with improved error handling
export const getRecentCalculation = async (): Promise<CalculationResult | null> => {
  try {
    const recentString = await safeAsyncStorage.getItem(STORAGE_KEYS.RECENT_CALCULATION);
    return recentString ? JSON.parse(recentString) : null;
  } catch (error) {
    console.error('Error getting recent calculation:', error);
    
    // Try fallback storage
    try {
      const fallbackString = await fallbackStorage.getItem(STORAGE_KEYS.RECENT_CALCULATION);
      return fallbackString ? JSON.parse(fallbackString) : null;
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
      return null;
    }
  }
};

// Mejorar el manejo de errores en las operaciones de almacenamiento
export const savePatient = async (patient: Patient): Promise<boolean> => {
  try {
    // Obtener pacientes existentes
    let patients: Patient[] = [];
    try {
      const patientsString = await safeAsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
      patients = patientsString ? JSON.parse(patientsString) : [];
    } catch (fetchError) {
      console.warn('Failed to fetch existing patients, starting fresh');
    }
    
    // Verificar si el paciente ya existe
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    
    if (existingIndex >= 0) {
      // Actualizar paciente existente
      patients[existingIndex] = patient;
    } else {
      // Generar ID para nuevo paciente si no tiene
      if (!patient.id) {
        patient.id = String(Date.now());
      }
      // Añadir nuevo paciente
      patients.push(patient);
    }
    
    // Guardar pacientes actualizados
    await safeAsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    
    // Sincronizar con localStorage si estamos en web
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving patient:', error);
    showErrorAlert('Error', 'Failed to save patient information');
    
    // Intentar con almacenamiento en memoria
    try {
      const fallbackString = await fallbackStorage.getItem(STORAGE_KEYS.PATIENTS);
      let patients = fallbackString ? JSON.parse(fallbackString) : [];
      
      const existingIndex = patients.findIndex(p => p.id === patient.id);
      
      if (existingIndex >= 0) {
        patients[existingIndex] = patient;
      } else {
        if (!patient.id) {
          patient.id = String(Date.now());
        }
        patients.push(patient);
      }
      
      await fallbackStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      console.log('Saved patient to memory fallback storage');
      return true;
    } catch (fallbackError) {
      console.error('Even fallback storage failed:', fallbackError);
      return false;
    }
  }
};

// Get patients with improved error handling
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const patientsString = await safeAsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    return patientsString ? JSON.parse(patientsString) : [];
  } catch (error) {
    console.error('Error getting patients:', error);
    showErrorAlert('Error', 'Failed to load patient data');
    
    // Try fallback storage
    try {
      const fallbackString = await fallbackStorage.getItem(STORAGE_KEYS.PATIENTS);
      return fallbackString ? JSON.parse(fallbackString) : [];
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
      return [];
    }
  }
};

// Delete patient with improved error handling
export const deletePatient = async (patientId: string): Promise<boolean> => {
  try {
    const patientsString = await safeAsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!patientsString) return true;
    
    const patients: Patient[] = JSON.parse(patientsString);
    const updatedPatients = patients.filter(p => p.id !== patientId);
    
    await safeAsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    
    // Sincronizar con localStorage si estamos en web
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    showErrorAlert('Error', 'Failed to delete patient');
    return false;
  }
};

// Save settings with improved error handling
export const saveSettings = async (settings: AppSettings): Promise<boolean> => {
  try {
    await safeAsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    showErrorAlert('Error', 'Failed to save settings');
    
    // Try fallback storage
    try {
      await fallbackStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (fallbackError) {
      return false;
    }
  }
};

// Get settings with improved error handling
export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const settingsString = await safeAsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsString ? JSON.parse(settingsString) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    showErrorAlert('Error', 'Failed to load settings');
    
    // Try fallback storage
    try {
      const fallbackString = await fallbackStorage.getItem(STORAGE_KEYS.SETTINGS);
      return fallbackString ? JSON.parse(fallbackString) : null;
    } catch (fallbackError) {
      return null;
    }
  }
};
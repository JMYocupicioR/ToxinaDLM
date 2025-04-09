// services/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Save calculation to history
export const saveCalculationToHistory = async (calculation: CalculationResult): Promise<boolean> => {
  try {
    // Get existing history
    const historyString = await AsyncStorage.getItem(STORAGE_KEYS.CALCULATION_HISTORY);
    const history: CalculationResult[] = historyString ? JSON.parse(historyString) : [];
    
    // Add new calculation with timestamp
    const calculationWithTimestamp = {
      ...calculation,
      timestamp: new Date().toISOString()
    };
    
    // Limit history to last 100 calculations
    history.unshift(calculationWithTimestamp);
    if (history.length > 100) history.pop();
    
    // Save updated history
    await AsyncStorage.setItem(STORAGE_KEYS.CALCULATION_HISTORY, JSON.stringify(history));
    
    // Save as recent calculation
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_CALCULATION, JSON.stringify(calculationWithTimestamp));
    
    return true;
  } catch (error) {
    console.error('Error saving calculation to history:', error);
    return false;
  }
};

// Get calculation history
export const getCalculationHistory = async (): Promise<CalculationResult[]> => {
  try {
    const historyString = await AsyncStorage.getItem(STORAGE_KEYS.CALCULATION_HISTORY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting calculation history:', error);
    return [];
  }
};

// Clear calculation history
export const clearCalculationHistory = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CALCULATION_HISTORY);
    return true;
  } catch (error) {
    console.error('Error clearing calculation history:', error);
    return false;
  }
};

// Get recent calculation
export const getRecentCalculation = async (): Promise<CalculationResult | null> => {
  try {
    const recentString = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_CALCULATION);
    return recentString ? JSON.parse(recentString) : null;
  } catch (error) {
    console.error('Error getting recent calculation:', error);
    return null;
  }
};

// Mejorar el manejo de errores en las operaciones de almacenamiento
export const savePatient = async (patient: Patient): Promise<boolean> => {
  try {
    // Obtener pacientes existentes
    const patientsString = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    const patients: Patient[] = patientsString ? JSON.parse(patientsString) : [];
    
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
    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    
    // Sincronizar con localStorage si estamos en web
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving patient:', error);
    return false;
  }
};

// Get patients
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const patientsString = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    return patientsString ? JSON.parse(patientsString) : [];
  } catch (error) {
    console.error('Error getting patients:', error);
    return [];
  }
};

// Delete patient
export const deletePatient = async (patientId: string): Promise<boolean> => {
  try {
    const patientsString = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!patientsString) return true;
    
    const patients: Patient[] = JSON.parse(patientsString);
    const updatedPatients = patients.filter(p => p.id !== patientId);
    
    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    return false;
  }
};

// Save settings
export const saveSettings = async (settings: AppSettings): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Get settings
export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const settingsString = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsString ? JSON.parse(settingsString) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Función simple para encriptar texto (en producción usar una biblioteca de encriptación real)
export const encryptData = (data: string): string => {
  // Implementación simplificada (no usar en producción)
  return btoa(data);
};

// Función simple para desencriptar texto
export const decryptData = (encryptedData: string): string => {
  // Implementación simplificada (no usar en producción)
  return atob(encryptedData);
};

// Guardar datos sensibles de forma segura
export const saveSecureData = async (key: string, value: string): Promise<boolean> => {
  try {
    // En una implementación real, usaríamos expo-secure-store o react-native-keychain
    // Esta es una implementación simplificada
    const encryptedValue = encryptData(value);
    await AsyncStorage.setItem(`secure_${key}`, encryptedValue);
    return true;
  } catch (error) {
    console.error('Error saving secure data:', error);
    return false;
  }
};

// Obtener datos sensibles
export const getSecureData = async (key: string): Promise<string | null> => {
  try {
    const encryptedValue = await AsyncStorage.getItem(`secure_${key}`);
    if (!encryptedValue) return null;
    return decryptData(encryptedValue);
  } catch (error) {
    console.error('Error getting secure data:', error);
    return null;
  }
};

// Registrar actividad del usuario para cumplimiento normativo
export const logUserActivity = async (
  userId: string, 
  action: string, 
  details: object
): Promise<boolean> => {
  try {
    // Obtener registros existentes
    const logsJson = await AsyncStorage.getItem('user_activity_logs');
    const logs = logsJson ? JSON.parse(logsJson) : [];
    
    // Añadir nuevo registro
    logs.push({
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      device: Platform.OS,
      appVersion: '1.0.0' // En una app real, obtener dinámicamente
    });
    
    // Limitar a los últimos 1000 registros para evitar problemas de almacenamiento
    const trimmedLogs = logs.slice(-1000);
    
    // Guardar registros actualizados
    await AsyncStorage.setItem('user_activity_logs', JSON.stringify(trimmedLogs));
    return true;
  } catch (error) {
    console.error('Error logging user activity:', error);
    return false;
  }
};

// Exportar registros de actividad para auditoría
export const exportActivityLogs = async (): Promise<string | null> => {
  try {
    const logsJson = await AsyncStorage.getItem('user_activity_logs');
    if (!logsJson) return null;
    
    // En una implementación real, aquí se podría formatear como CSV o PDF
    return logsJson;
  } catch (error) {
    console.error('Error exporting logs:', error);
    return null;
  }
};
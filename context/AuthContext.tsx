import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir interfaz para usuario autenticado
interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse';
}

// Definir interfaz para el contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem('auth_user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Error checking auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Función de inicio de sesión
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En una aplicación real, esto sería una llamada a API
      // Aquí simulamos una autenticación simple con usuarios hardcodeados
      if (username === 'doctor' && password === 'password123') {
        const userData: User = {
          id: '1',
          username: 'doctor',
          name: 'Dr. Marcos Yocupicio',
          role: 'doctor'
        };
        
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        setError('Invalid username or password');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de cierre de sesión
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('auth_user');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
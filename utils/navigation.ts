import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';

// Navigation routes with their parameters
export type AppRoutes = {
  calculator: {
    patientId?: string;
    pathologyId?: string;
    toxinBrand?: string;
  };
  pathologies: {
    pathologyId?: string;
  };
  patients: {
    patientId?: string;
  };
  reference: {
    muscleGroup?: string;
    muscle?: string;
  };
  settings: {};
};

// Navigation utility hook that integrates with AppContext
export function useAppNavigation() {
  const {
    setSelectedBrand,
    setSelectedPathologyId,
    setSelectedPatientId,
  } = useAppContext();

  // Navigate to calculator with optional parameters
  const navigateToCalculator = (params: AppRoutes['calculator'] = {}) => {
    if (params.toxinBrand) {
      setSelectedBrand(params.toxinBrand as any);
    }
    
    if (params.pathologyId) {
      setSelectedPathologyId(params.pathologyId);
    }
    
    if (params.patientId) {
      setSelectedPatientId(params.patientId);
    }
    
    router.push('/');
  };

  // Navigate to pathologies with optional parameters
  const navigateToPathologies = (params: AppRoutes['pathologies'] = {}) => {
    if (params.pathologyId) {
      setSelectedPathologyId(params.pathologyId);
    }
    
    router.push('/pathologies');
  };

  // Navigate to patients with optional parameters
  const navigateToPatients = (params: AppRoutes['patients'] = {}) => {
    if (params.patientId) {
      setSelectedPatientId(params.patientId);
    }
    
    router.push('/patients');
  };

  // Navigate to reference with optional parameters
  const navigateToReference = (params: AppRoutes['reference'] = {}) => {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.muscleGroup) {
      queryParams.append('muscleGroup', params.muscleGroup);
    }
    
    if (params.muscle) {
      queryParams.append('muscle', params.muscle);
    }
    
    const queryString = queryParams.toString();
    router.push(queryString ? `/reference?${queryString}` : '/reference');
  };

  // Navigate to settings
  const navigateToSettings = () => {
    router.push('/settings');
  };

  return {
    navigateToCalculator,
    navigateToPathologies,
    navigateToPatients,
    navigateToReference,
    navigateToSettings
  };
}
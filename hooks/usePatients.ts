import { useState, useEffect } from 'react';
import { Patient } from '@/types/dosage';

// Extended patient interface with ID and treatment history
export interface PatientRecord extends Patient {
  id: string;
  lastVisit?: string;
  notes?: string;
  treatmentHistory?: {
    date: string;
    toxin: string;
    totalDose: number;
    muscles: Array<{
      name: string;
      dose: number;
    }>;
    notes?: string;
  }[];
}

// Sample data for initial development
const initialPatients: PatientRecord[] = [
  { 
    id: '1', 
    name: 'Ana García', 
    age: 42, 
    weight: 65,
    notes: 'Cervical dystonia, responds well to Botox treatment.',
    lastVisit: '2025-03-15',
    treatmentHistory: [
      {
        date: '2025-03-15',
        toxin: 'Botox',
        totalDose: 200,
        muscles: [
          { name: 'Trapecio', dose: 75 },
          { name: 'Infraespinoso', dose: 60 },
          { name: 'Dorsal ancho', dose: 65 }
        ]
      },
      {
        date: '2024-12-10',
        toxin: 'Botox',
        totalDose: 180,
        muscles: [
          { name: 'Trapecio', dose: 75 },
          { name: 'Infraespinoso', dose: 50 },
          { name: 'Dorsal ancho', dose: 55 }
        ]
      }
    ]
  },
  { 
    id: '2', 
    name: 'José Ramírez', 
    age: 57, 
    weight: 78,
    notes: 'Upper limb spasticity (post-stroke), typically uses Dysport.',
    lastVisit: '2025-03-22',
    treatmentHistory: [
      {
        date: '2025-03-22',
        toxin: 'Dysport',
        totalDose: 750,
        muscles: [
          { name: 'Biceps brachii', dose: 300 },
          { name: 'Flexor carpi radialis', dose: 160 },
          { name: 'Flexor carpi ulnaris', dose: 160 },
          { name: 'Pronator teres', dose: 130 }
        ]
      }
    ]
  },
  { 
    id: '3', 
    name: 'María López', 
    age: 36, 
    weight: 58,
    notes: 'Chronic migraine, responds well to frontalis and temporal injections.',
    lastVisit: '2025-02-18',
    treatmentHistory: [
      {
        date: '2025-02-18',
        toxin: 'Botox',
        totalDose: 155,
        muscles: [
          { name: 'Frontalis', dose: 20 },
          { name: 'Corrugator', dose: 10 },
          { name: 'Procerus', dose: 5 },
          { name: 'Occipitalis', dose: 30 },
          { name: 'Trapecio', dose: 90 }
        ]
      }
    ]
  },
  { 
    id: '4', 
    name: 'Carlos Vega', 
    age: 62, 
    weight: 84,
    notes: 'Lower limb spasticity, long-term treatment with Xeomin.',
    lastVisit: '2025-03-29',
    treatmentHistory: [
      {
        date: '2025-03-29',
        toxin: 'Xeomin',
        totalDose: 320,
        muscles: [
          { name: 'Gastrocnemio (cabeza lateral)', dose: 100 },
          { name: 'Gastrocnemio (cabeza medial)', dose: 100 },
          { name: 'Sóleo', dose: 120 }
        ]
      }
    ]
  }
];

// Function to persist patients to localStorage (for web)
const savePatients = (patients: PatientRecord[]) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('toxinadlm_patients', JSON.stringify(patients));
    }
  } catch (error) {
    console.error('Error saving patients data:', error);
  }
};

// Function to load patients from localStorage (for web)
const loadPatients = (): PatientRecord[] => {
  try {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('toxinadlm_patients');
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error('Error loading patients data:', error);
  }
  return initialPatients;
};

// Custom hook for patient management
export function usePatients() {
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [isLoading, setIsLoading] = useState(true);

  // Load patients on initial mount
  useEffect(() => {
    const loadedPatients = loadPatients();
    setPatients(loadedPatients);
    setIsLoading(false);
  }, []);

  // Save patients when they change
  useEffect(() => {
    if (!isLoading) {
      savePatients(patients);
    }
  }, [patients, isLoading]);

  // Add a new patient
  const addPatient = (patient: Omit<PatientRecord, 'id'>): PatientRecord => {
    const newId = String(Math.max(...patients.map(p => Number(p.id)), 0) + 1);
    const newPatient: PatientRecord = {
      ...patient,
      id: newId,
      treatmentHistory: []
    };
    
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  // Update an existing patient
  const updatePatient = (updatedPatient: PatientRecord): PatientRecord => {
    setPatients(prev => 
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
    return updatedPatient;
  };

  // Delete a patient
  const deletePatient = (patientId: string): boolean => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    return true;
  };

  // Get a patient by ID
  const getPatient = (patientId: string): PatientRecord | undefined => {
    return patients.find(p => p.id === patientId);
  };

  // Add treatment record to patient history
  const addTreatmentRecord = (
    patientId: string,
    treatmentData: Omit<PatientRecord['treatmentHistory'][0], 'date'>
  ): boolean => {
    const patient = getPatient(patientId);
    if (!patient) return false;
    
    const treatmentRecord = {
      ...treatmentData,
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedPatient: PatientRecord = {
      ...patient,
      lastVisit: treatmentRecord.date,
      treatmentHistory: [
        treatmentRecord,
        ...(patient.treatmentHistory || [])
      ]
    };
    
    updatePatient(updatedPatient);
    return true;
  };

  return {
    patients,
    isLoading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    addTreatmentRecord
  };
}
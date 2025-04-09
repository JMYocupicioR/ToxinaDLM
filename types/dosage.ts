import { z } from 'zod';

export interface DosageRange {
  min: number;
  max: number;
}

export interface MuscleData {
  [key: string]: DosageRange;
}

export interface ToxinData {
  [key: string]: MuscleData;
}

export const PatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  weight: z.number().positive().optional(),
  age: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  lastVisit: z.string().optional(),
  treatmentHistory: z.array(
    z.object({
      date: z.string(),
      toxin: z.string(),
      totalDose: z.number().positive(),
      muscles: z.array(
        z.object({
          name: z.string(),
          dose: z.number().positive()
        })
      ),
      notes: z.string().optional()
    })
  ).optional()
});

export type Patient = z.infer<typeof PatientSchema>;

export interface SelectedMuscle {
  name: string;
  dosageType: 'min' | 'max';
  baseAmount: number;
  adjustedAmount: number;
}

export const TOXIN_BRANDS = ['Dysport', 'Botox', 'Xeomin'] as const;
export type ToxinBrand = typeof TOXIN_BRANDS[number];

export const SESSION_LIMITS: Record<ToxinBrand, number> = {
  Dysport: 1000,
  Botox: 400,
  Xeomin: 400,
};

// Definición para el historial de tratamientos
export interface TreatmentRecord {
  id?: string;
  date: string;
  toxin: ToxinBrand;
  totalDose: number;
  muscles: Array<{
    name: string;
    dose: number;
  }>;
  pathologyId?: string;
  notes?: string;
}

// Nuevos tipos para la calculadora de dosis
export interface DosageCalculationResult {
  area: string;
  toxin: string;
  weight: number;
  severity: number;
  totalDose: number;
  maxSessionDose: number;
  muscleSpecificDose: number;
  maxMuscleDose: number;
  recommendedDose: number;
  recommendedDoseRange: { min: number; max: number };
  isPediatric: boolean;
  safetyAlerts: string[];
  pathology?: string;
}

export interface ToxinProduct {
  name: string;
  type: string;
  unitsPerVial: number;
  dilutionRange: {
    min: number;
    max: number;
    recommended: number;
  };
}

export interface ToxinConversion {
  fromType: string;
  toType: string;
  factor: number;
}

export interface MuscleReference {
  name: string;
  minDose: number;
  maxDose: number;
  recommendedDose: number;
  anatomicalArea: string;
  alternateNames?: string[];
  innervation?: string;
  bloodSupply?: string;
  origin?: string;
  insertion?: string;
  action?: string;
}

export interface DosageCalculation {
  patient: Patient;
  area: string;
  toxin: string;
  severity: number;
  pathology?: string;
  result?: DosageCalculationResult;
}

// Tipos para alertas de seguridad
export type AlertSeverity = 'info' | 'warning' | 'error';

export interface SafetyAlert {
  message: string;
  severity: AlertSeverity;
  code?: string;
  recommendation?: string;
}

// Configuración para cálculos pediátricos
export interface PediatricAdjustment {
  ageRange: {
    min: number;
    max: number;
  };
  weightFactor: number;
  minFactor: number;
  maxFactor: number;
}

export const PEDIATRIC_ADJUSTMENTS: PediatricAdjustment[] = [
  { ageRange: { min: 0, max: 2 }, weightFactor: 60, minFactor: 0.4, maxFactor: 0.6 },
  { ageRange: { min: 2, max: 6 }, weightFactor: 55, minFactor: 0.5, maxFactor: 0.7 },
  { ageRange: { min: 6, max: 12 }, weightFactor: 50, minFactor: 0.6, maxFactor: 0.8 },
  { ageRange: { min: 12, max: 18 }, weightFactor: 45, minFactor: 0.7, maxFactor: 0.9 }
];

// Función de utilidad para calcular el factor de ajuste pediátrico
export const calculatePediatricAdjustment = (age?: number, weight?: number): number => {
  if (age === undefined || weight === undefined || age >= 18) {
    return 1.0;
  }

  // Encontrar el ajuste apropiado para la edad
  const adjustment = PEDIATRIC_ADJUSTMENTS.find(
    adj => age >= adj.ageRange.min && age < adj.ageRange.max
  );

  if (!adjustment) {
    return 1.0;
  }

  // Calcular y limitar el factor de ajuste
  return Math.min(
    Math.max(weight / adjustment.weightFactor, adjustment.minFactor),
    adjustment.maxFactor
  );
};
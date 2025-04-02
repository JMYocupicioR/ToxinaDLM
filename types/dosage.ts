import { z } from 'zod';

export const DosageCalculationSchema = z.object({
  anatomicalArea: z.string(),
  toxinType: z.string(),
  patientWeight: z.number().positive(),
  severity: z.number().int().min(1).max(10),
  treatmentHistory: z.array(z.object({
    date: z.date(),
    dose: z.number(),
    response: z.string(),
  })).optional(),
});

export type DosageCalculation = z.infer<typeof DosageCalculationSchema>;

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
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
  name: z.string().optional(),
  weight: z.number().positive().optional(),
  age: z.number().int().min(0).optional(),
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
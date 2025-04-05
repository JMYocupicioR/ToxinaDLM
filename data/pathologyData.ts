import { ToxinBrand } from '@/types/dosage';

export interface MuscleRecommendation {
  muscleName: string;
  priority: 'primary' | 'secondary';
  recommendedDosage: 'min' | 'max';
}

export interface Pathology {
  id: string;
  name: string;
  description: string;
  recommendedMuscles: {
    [key in ToxinBrand]?: MuscleRecommendation[];
  };
  references?: string[];
}

export const pathologies: Pathology[] = [
  {
    id: 'cervical_dystonia',
    name: 'Cervical Dystonia',
    description: 'Involuntary contraction of neck muscles causing abnormal head positioning',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Trapecio', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Deltoides', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Infraespinoso', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Trapecio', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Deltoides', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Infraespinoso', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Trapecio', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Deltoides', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Infraespinoso', priority: 'secondary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'upper_limb_spasticity',
    name: 'Upper Limb Spasticity',
    description: 'Increased muscle tone in the upper limbs resulting from neurological conditions',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Biceps brachii', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Flexor carpi radialis', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Flexor carpi ulnaris', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Pronator teres', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum profundus', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum superficialis', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Biceps brachii', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Flexor carpi radialis', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Flexor carpi ulnaris', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Pronator teres', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum profundus', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum superficialis', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Biceps brachii', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Flexor carpi radialis', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Flexor carpi ulnaris', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Pronator teres', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum profundus', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum superficialis', priority: 'secondary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'lower_limb_spasticity',
    name: 'Lower Limb Spasticity',
    description: 'Increased muscle tone in the lower limbs affecting gait and motor function',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Gastrocnemio (cabeza lateral)', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Gastrocnemio (cabeza medial)', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Sóleo', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Tibialis posterior', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum longus', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Gastrocnemio (cabeza lateral)', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Gastrocnemio (cabeza medial)', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Sóleo', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Tibialis posterior', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum longus', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Gastrocnemio (cabeza lateral)', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Gastrocnemio (cabeza medial)', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Sóleo', priority: 'primary', recommendedDosage: 'max' },
        { muscleName: 'Tibialis posterior', priority: 'secondary', recommendedDosage: 'min' },
        { muscleName: 'Flexor digitorum longus', priority: 'secondary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'blepharospasm',
    name: 'Blepharospasm',
    description: 'Involuntary eyelid spasms and contractions that may lead to functional blindness',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Orbicularis oculi', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Orbicularis oculi', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Orbicularis oculi', priority: 'primary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'hyperhidrosis',
    name: 'Hyperhidrosis',
    description: 'Excessive sweating, typically in the armpits, palms, and soles',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Axillary region', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Axillary region', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Axillary region', priority: 'primary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'chronic_migraine',
    name: 'Chronic Migraine',
    description: 'Headache occurring at least 15 days per month, with at least 8 days of migraine features',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Frontalis', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Corrugator', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Procerus', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Occipitalis', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Trapecio', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Frontalis', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Corrugator', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Procerus', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Occipitalis', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Trapecio', priority: 'secondary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Frontalis', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Corrugator', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Procerus', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Occipitalis', priority: 'primary', recommendedDosage: 'min' },
        { muscleName: 'Trapecio', priority: 'secondary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'masseter_hypertrophy',
    name: 'Masseter Hypertrophy',
    description: 'Enlargement of the masseter muscle, often for aesthetic facial slimming',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Masseter', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Masseter', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Masseter', priority: 'primary', recommendedDosage: 'min' },
      ]
    }
  },
  {
    id: 'gummy_smile',
    name: 'Gummy Smile',
    description: 'Excessive gingival display when smiling, can be treated with toxin to reduce muscle elevation',
    recommendedMuscles: {
      'Botox': [
        { muscleName: 'Levator labii superioris alaeque nasi', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Dysport': [
        { muscleName: 'Levator labii superioris alaeque nasi', priority: 'primary', recommendedDosage: 'min' },
      ],
      'Xeomin': [
        { muscleName: 'Levator labii superioris alaeque nasi', priority: 'primary', recommendedDosage: 'min' },
      ]
    }
  }
];
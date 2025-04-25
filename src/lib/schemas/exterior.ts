import { z } from 'zod'

export const exteriorSchema = z.object({
  buildSize: z.object({
    squareFootage: z.number().min(0, 'Square footage must be greater than 0'),
    photos: z.array(z.string()).optional(),
  }),
  wallSurface: z.object({
    type: z.string().min(1, 'Please select a surface type'),
    repairCondition: z.enum(['None', 'Maintenance', 'Minor Repair', 'Major Repair', 'Upgrade', 'Note (Open field)']),
    recommendation: z.string().optional(),
    task: z.enum([
      'Repair',
      'Replace',
      'Repair or Replace',
      'Further Evaluation',
      'Improve',
      'Monitor',
      'Service',
      'Request Disclosure',
      'Service Annually',
      'Demolish',
      'Remodel',
      'Upgrade',
      'Remove',
      'Protect',
      'Clean',
      'Provide'
    ]),
    repairTime: z.enum([
      'Immediate',
      'Less than 1 yr',
      'Less than 2 yrs',
      'Less than 3 yrs',
      'Less than 4 yrs',
      'Less than 5 yrs',
      'Discretionary',
      'Ongoing',
      'Unknown',
      'Unpredictable',
      'Maintenance',
      'If necessary'
    ]),
    repairCostMin: z.string(),
    repairCostMax: z.number(),
    photos: z.array(z.string()).optional(),
  })
})

export type ExteriorFormData = z.infer<typeof exteriorSchema> 
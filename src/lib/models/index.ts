import { z, type ZodObj } from 'fuma'
import type { Prisma } from '@prisma/client'

export const modelAlgorithm = {
    name: z.string().min(3),
    description: z.string().min(100),
    score3: z.number(),
    score5: z.number(),
    score100: z.number(),
    score500: z.number(),
    execTime500: z.number(),
} satisfies ZodObj<Omit<Prisma.AlgorithmCreateInput, 'author' | 'wasm'>>

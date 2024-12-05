import { z, type ZodObj } from 'fuma'
import type { Prisma } from '@prisma/client'

export const modelAlgorithm = {
    name: z.string().min(3),
    description: z.string().min(42),
    score3: z.coerce.number(),
    score5: z.coerce.number(),
    score100: z.coerce.number(),
    score500: z.coerce.number(),
    execTime500: z.coerce.number(),
} satisfies ZodObj<Omit<Prisma.AlgorithmCreateInput, 'author' | 'wasm'>>

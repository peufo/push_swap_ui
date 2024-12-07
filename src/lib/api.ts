import type { Prisma } from '@prisma/client'
import { useApiClient, type ApiConfig } from 'fuma/api'

export const apiConfig = {
    Algorithm: (search) => ({ where: { name: { contains: search } } }),
} satisfies ApiConfig<Prisma.TypeMap>

export const api = useApiClient<Prisma.TypeMap, typeof apiConfig>(apiConfig)

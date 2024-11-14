import zod from 'zod'

export type Move =
  | 'sa'
  | 'sb'
  | 'ss'
  | 'pa'
  | 'pb'
  | 'ra'
  | 'rb'
  | 'rr'
  | 'rra'
  | 'rrb'
  | 'rrr'

export const moveShema = zod.enum([
  'sa',
  'sb',
  'ss',
  'pa',
  'pb',
  'ra',
  'rb',
  'rr',
  'rra',
  'rrb',
  'rrr',
])
export type Sequence = Move[]
export const sequenceShema = zod.array(moveShema)

type State = {
  values: number[]
}

export const moves = {
  sa: () => {},
  sb: () => {},
  ss: () => {},
  pa: () => {},
  pb: () => {},
  ra: () => {},
  rb: () => {},
  rr: () => {},
  rra: () => {},
  rrb: () => {},
  rrr: () => {},
} satisfies Record<Move, (state: State) => void>

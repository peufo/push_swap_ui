import zod from 'zod'
import { type State } from './state'

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

export const moves = {
  sa(s) {
    if (s.cursor > s.values.length - 2) return s
    const value = s.values[s.cursor]
    s.values[s.cursor] = s.values[s.cursor + 1]
    s.values[s.cursor + 1] = value
    return s
  },
  sb(s) {
    if (s.cursor < 2) return s
    const value = s.values[s.cursor - 1]
    s.values[s.cursor - 1] = s.values[s.cursor - 2]
    s.values[s.cursor - 2] = value
    return s
  },
  ss(s) {
    return this.sb(this.sa(s))
  },
  pa(s) {
    if (s.cursor > 0) s.cursor--
    return s
  },
  pb(s) {
    if (s.cursor < s.values.length - 1) s.cursor++
    return s
  },
  ra(s) {
    if (s.cursor > s.values.length - 2) return s
    const [value] = s.values.splice(s.cursor, 1)
    s.values.push(value)
    return s
  },
  rb(s) {
    if (s.cursor < 1) return s
    const [value] = s.values.splice(s.cursor - 1, 1)
    s.values.unshift(value)
    return s
  },
  rr(s) {
    return this.ra(this.rb(s))
  },
  rra(s) {
    if (s.cursor > s.values.length - 2) return s
    const value = s.values.pop()!
    s.values.splice(s.cursor, 0, value)
    return s
  },
  rrb(s) {
    if (s.cursor < 1) return s
    const value = s.values.shift()!
    s.values.splice(s.cursor - 1, 0, value)
    return s
  },
  rrr(s) {
    return this.rra(this.rrb(s))
  },
} satisfies Record<Move, (state: State) => State>

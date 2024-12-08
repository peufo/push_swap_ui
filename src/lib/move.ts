import zod from 'zod'

export type Stack = {
    cursor: number
    values: number[]
}

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

export const moveList = [
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
] as const satisfies Move[]

export const moveShema = zod.enum(moveList)
export type Sequence = Move[]
export const sequenceShema = zod.array(moveShema)

type MoveFunc<S = Stack> = (stack: S) => S

const moves: Record<Move, MoveFunc> = {
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
        if (s.cursor < s.values.length) s.cursor++
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
}

export function move<S extends Stack>(stack: S, m: Move): void {
    moves[m](stack)
}

export function toMove<S extends Stack>(stack: S, m: Move): S {
    let s: S = JSON.parse(JSON.stringify(stack))
    return moves[m](s) as S
}

export const moveReverseMap: Record<Move, Move> = {
    sa: 'sa',
    sb: 'sb',
    ss: 'ss',
    pa: 'pb',
    pb: 'pa',
    ra: 'rra',
    rb: 'rrb',
    rr: 'rrr',
    rra: 'ra',
    rrb: 'rb',
    rrr: 'rr',
}

export function moveReverse<S extends Stack>(stack: S, m: Move): S {
    let s: Stack = JSON.parse(JSON.stringify(stack))
    return moves[moveReverseMap[m]](s) as S
}

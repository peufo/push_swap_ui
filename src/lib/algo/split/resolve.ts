import { move, type Move, type Stack } from '$lib/move'
import { optimize } from '../optimize'

export function resolve(values: number[]): Move[] {
    const sorted = values.toSorted((a, b) => a - b)
    const indexes = values.map((v) => sorted.indexOf(v))
    const specialMoves = use_special_case(values)
    if (specialMoves) return specialMoves
    const moves = splitA({ values: indexes, cursor: 0 }, values.length)
    return optimize(moves)
}

function use_special_case(values: number[]): Move[] | null {
    if (values.length !== 3) return null
    if (is_case([1, 2, 0])) return ['rra']
    if (is_case([2, 1, 0])) return ['sa', 'rra']
    if (is_case([1, 0, 2])) return ['sa']
    return null
    function is_case(nbs: number[]): boolean {
        for (let index = 0; index < 3; index++)
            if (values[index] !== nbs[index]) return false
        return true
    }
}

function splitA(s: Stack, len: number): Move[] {
    const subLen = Math.floor(len / 2)
    const pivot = s.cursor + subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    let behindCount = getBehindCount()

    if (len <= 1) {
        while (behindCount-- > 0) add('rra')
        return moves
    }
    if (len == 2) {
        while (behindCount-- > 0) add('rra')
        if (s.values[s.cursor] > s.values[s.cursor + 1]) add('sa')
        return moves
    }

    pushBeforePivot()

    moves.push(...splitA(s, len - subLen))
    moves.push(...splitB(s, subLen))
    return moves

    function pushBeforePivot() {
        const isBeforePivot = createIsBetween(s.cursor, pivot)
        while (s.cursor < pivot) {
            while (!isBeforePivot(s.values[s.cursor])) {
                if (behindCount-- > 0) add('rra')
                else add('ra')
            }
            add('pb')
        }
    }

    function getBehindCount(): number {
        const isInWorkZone = createIsBetween(s.cursor, s.cursor + len)
        let count = 0
        let index = s.values.length - 1
        while (isInWorkZone(s.values[index]) && index > s.cursor) {
            count++
            index--
        }
        if (index == s.cursor) return 0
        return count
    }
}

function splitB(s: Stack, len: number): Move[] {
    const subLen = Math.floor(len / 2)
    const pivot = s.cursor - subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)

    let behindCount = getBehindCount()

    if (len <= 1) {
        while (behindCount-- > 0) add('rrb')
        add('pa')
        return moves
    }
    if (len == 2) {
        while (behindCount-- > 0) add('rrb')
        if (s.values[s.cursor - 2] > s.values[s.cursor - 1]) add('sb')
        add('pa', 'pa')
        return moves
    }

    pushBeforePivot()

    moves.push(...splitA(s, subLen))
    moves.push(...splitB(s, len - subLen))
    return moves

    function pushBeforePivot() {
        const isBeforeOk = createIsBetween(pivot, s.cursor)
        while (s.cursor > pivot) {
            while (!isBeforeOk(s.values[s.cursor - 1])) {
                if (behindCount-- > 0) add('rrb')
                else add('rb')
            }
            add('pa')
        }
    }

    function getBehindCount(): number {
        const isInWorkZone = createIsBetween(s.cursor - len, s.cursor)
        let index = 0
        while (isInWorkZone(s.values[index]) && index < s.cursor - 1) {
            index++
        }
        if (index == s.cursor - 1) return 0
        return index
    }
}

function createAdd(s: Stack, moves: Move[]) {
    return (...ms: Move[]) => {
        for (const m of ms) {
            moves.push(m)
            move(s, m)
        }
    }
}

function createIsBetween(min: number, max: number) {
    return (value: number) => min <= value && value < max
}

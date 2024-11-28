import { move, type Move, type Stack } from '$lib/move'
import { cleanSequence } from './cleanSequence'

export function resolve(values: number[]): Move[] {
    const sorted = values.toSorted((a, b) => a - b)
    const indexes = values.map((v) => sorted.indexOf(v))
    if (is120(indexes)) return ['rra']
    const moves = splitA({ values: indexes, cursor: 0 }, values.length)
    return cleanSequence(moves)
}

function is120(values: number[]) {
    if (values.length !== 3) return false
    return JSON.stringify(values) === '[1,2,0]'
}

function splitA(s: Stack, len: number): Move[] {
    const subLen = Math.round(len / 2)
    const cursor = s.cursor
    const pivot = cursor + subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    const isBeforePivot = createIsOk(cursor, pivot)
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
        while (s.cursor < pivot) {
            while (!isBeforePivot(s.values[s.cursor])) {
                if (behindCount-- > 0) add('rra')
                else add('ra')
            }
            add('pb')
        }
    }

    function getBehindCount(): number {
        const isInWorkZone = createIsOk(cursor, cursor + len)
        let count = 0
        let index = s.values.length - 1
        while (isInWorkZone(s.values[index]) && index > cursor) {
            count++
            index--
        }
        if (index == cursor) return 0
        return count
    }
}

function splitB(s: Stack, len: number): Move[] {
    const subLen = Math.round(len / 2)
    const cursor = s.cursor
    const pivot = cursor - subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    const isBeforeOk = createIsOk(pivot, cursor)
    let behindCount = getBehindCount()

    if (len <= 1) {
        while (behindCount-- > 0) add('rrb')
        add('pa')
        return moves
    }
    if (len == 2) {
        while (behindCount-- > 0) add('rrb')
        if (s.values[cursor - 2] > s.values[cursor - 1]) add('sb')
        add('pa', 'pa')
        return moves
    }

    pushBeforePivot()

    moves.push(...splitA(s, subLen))
    moves.push(...splitB(s, len - subLen))
    return moves

    function pushBeforePivot() {
        while (s.cursor > pivot) {
            while (!isBeforeOk(s.values[s.cursor - 1])) {
                if (behindCount-- > 0) add('rrb')
                else add('rb')
            }
            add('pa')
        }
    }

    function getBehindCount(): number {
        const isInWorkZone = createIsOk(cursor - len, cursor)
        let count = 0
        let index = 0
        while (isInWorkZone(s.values[index]) && index < cursor - 1) {
            count++
            index++
        }
        if (index == cursor - 1) return 0
        return count
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

function createIsOk(min: number, max: number) {
    return (value: number) => min <= value && value < max
}

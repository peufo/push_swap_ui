import { move, type Move, type Stack } from '$lib/move'
import { logSplitA } from './logger'

export function resolve(values: number[]): Move[] {
    const sorted = values.toSorted((a, b) => a - b)
    const indexes = values.map((v) => sorted.indexOf(v))
    const moves = splitA({ values: indexes, cursor: 0 }, values.length)
    return moves
}

function splitA(s: Stack, len: number): Move[] {
    const subLen = Math.ceil(len / 2)
    const cursor = s.cursor
    const pivot = cursor + subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    const isBeforePivot = createIsOk(cursor, pivot)
    let behindCount = getBehindCount()

    if (len <= 1) {
        while (behindCount--) add('rra')
        return moves
    }
    if (len == 2) {
        while (behindCount--) add('rra')
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
    const subLen = Math.ceil(len / 2)
    const cursor = s.cursor
    const pivot = cursor - subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    const isBeforeOk = createIsOk(pivot, cursor)
    let behindCount = getBehindCount()

    if (len <= 1) {
        while (behindCount--) add('rrb')
        add('pa')
        return moves
    }
    if (len == 2) {
        while (behindCount--) add('rrb')
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
        const isInWorkZone = createIsOk(cursor - len - 1, cursor - 1)
        let count = 0
        let index = 0
        while (isInWorkZone(s.values[index]) && index > cursor - 1) {
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

function createIsAllOk(
    min: number,
    max: number
): (values: number[]) => boolean {
    const isOk = createIsOk(min, max)
    return (values) => {
        for (let index = min; index < max; index++) {
            if (!isOk(values[index])) return false
        }
        return true
    }
}

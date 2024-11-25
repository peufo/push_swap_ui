import { move, type Move, type Stack } from "$lib/move";

export function resolve(values: number[]): Move[] {
    const sorted = values.toSorted((a, b) => a - b)
    const indexes = values.map((v) => sorted.indexOf(v))
    const moves = splitA({ values: indexes, cursor: 0 }, values.length)
    return moves
}


function splitA(s: Stack, len: number): Move[] {
    const subLen = Math.floor(len / 2)
    const cursor = s.cursor
    const pivot = cursor + subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    const isBeforePivot = createIsOk(cursor, pivot)

    if (len <= 1) return []
    if (len == 2) {
        if (s.values[s.cursor] < s.values[s.cursor + 1]) return []
        add('sa')
        return moves
    }

    pushBeforePivot()
    ensureAfterOk()

    moves.push(...splitA(s, len - subLen))
    moves.push(...splitB(s, subLen))
    return moves

    function pushBeforePivot() {
        while (s.cursor < pivot) {
            while (!isBeforePivot(s.values[s.cursor])) {
                add('ra')
            }
            add('pb')
        }
    }
    function ensureAfterOk() {
        const isAfterOk = createIsAllOk(pivot, cursor + len)
        while (!isAfterOk(s.values)) {
            add('rra')
        }
    }
}

function splitB(s: Stack, len: number): Move[] {
    const subLen = Math.ceil(len / 2)
    const cursor = s.cursor
    const pivot = cursor - subLen
    const moves: Move[] = []
    const add = createAdd(s, moves)
    const isBeforeOk = createIsOk(pivot, cursor)

    if (len <= 1) {
        add('pa')
        return moves
    }
    if (len == 2) {
        if (s.values[cursor - 2] > s.values[cursor - 1]) add('sb')
        add('pa', 'pa')
        return moves
    }

    pushBeforePivot()
    ensureAfterOk()

    moves.push(...splitA(s, subLen))
    moves.push(...splitB(s, len - subLen))
    return moves

    function pushBeforePivot() {
        while (s.cursor > pivot) {
            while (!isBeforeOk(s.values[s.cursor - 1])) {
                add('rb')
            }
            add('pa')
        }
    }

    function ensureAfterOk() {
        const isAfterOk = createIsAllOk(cursor - len, pivot)
        while (!isAfterOk(s.values)) {
            add('rrb')
        }
    }
}


function createAdd(s: Stack, moves: Move[]) {
    return (...ms: Move[]) => {
        for (const m of ms) {
            moves.push(m);
            move(s, m)
        }
    }
}

function createIsOk(min: number, max: number) {
    return (value: number) => min <= value && value < max
}

function createIsAllOk(min: number, max: number): (values: number[]) => boolean {
    const isOk = createIsOk(min, max)
    return (values) => {
        for (let index = min;index < max;index++) {
            if (!isOk(values[index])) return false
        }
        return true
    }
}
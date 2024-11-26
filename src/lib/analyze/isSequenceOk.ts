import { move, type Move, type Stack } from '$lib/move'

export function isSequenceOk(stack: Stack, sequence: Move[]) {
    const s: Stack = { values: [...stack.values], cursor: stack.cursor }
    for (const m of sequence) {
        move(s, m)
    }
    if (s.cursor !== 0) return false
    const len = s.values.length
    for (let index = 1; index < len; index++) {
        if (s.values[index - 1] > s.values[index]) return false
    }
    return true
}

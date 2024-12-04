import type { Stack } from '$lib/move'

const COL = 4
type SplitInfo = {
    cursor: number
    pivot: number
    subLen: number
    behindCount: number
}
export function logSplitA(
    s: Stack,
    { cursor, pivot, subLen, behindCount }: SplitInfo
) {
    let msg = ''
    msg += ' '.repeat(cursor * COL)
    msg += '◦'
    msg += '─'.repeat(subLen * COL - 2)
    msg += `┐ (${cursor} + ${subLen} = ${pivot}) << ${behindCount}\n`
    msg += logValues(s)
    console.log(msg)
}
export function logSplitB(
    s: Stack,
    { cursor, pivot, subLen, behindCount }: SplitInfo
) {
    let msg = ''
    msg += ' '.repeat(pivot * COL)
    msg += '┌'
    msg += '─'.repeat(subLen * COL - 2)
    msg += `◦ (${cursor} - ${subLen} = ${pivot}) >> ${behindCount}\n`
    msg += logValues(s)
    console.log(msg)
}

function logValues(s: Stack): string {
    return s.values.map((v) => v.toString().padStart(COL - 1, ' ')).join('|')
}

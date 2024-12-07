import type { Move } from '$lib/move'

const replacer: [Move[], Move[]][] = [
    [['pb', 'pa'], []],
    [['pa', 'pb'], []],
    [['rra', 'ra'], []],
    [['rrb', 'rb'], []],

    [['ra', 'rb'], ['rr']],
    [['rb', 'ra'], ['rr']],
    [['rra', 'rrb'], ['rrr']],
    [['rrb', 'rra'], ['rrr']],

    // Not implemented in mine
    [['pb', 'rb', 'pb', 'rrb', 'sb', 'pa', 'pa'], []],

    [['pb', 'pb', 'sb', 'pa', 'pa'], ['sa']],
    [['pa', 'pa', 'sa', 'pb', 'pb'], ['sb']],
    [['sa', 'sb'], ['ss']],
    [['sb', 'sa'], ['ss']],
    [
        ['sa', 'pa', 'pa', 'sa'],
        ['ss', 'pa', 'pa'],
    ],
    [
        ['sb', 'pa', 'pa', 'sb'],
        ['pa', 'pa', 'ss'],
    ],
    [
        ['pb', 'sb', 'pa', 'pa'],
        ['pa', 'sa'],
    ],
    [
        ['pb', 'ra', 'pa'],
        ['sa', 'ra'],
    ],
    [
        ['sa', 'rb', 'pa', 'pa', 'sa'],
        ['rb', 'ss', 'pa', 'pa'],
    ],
]

export function getOptimizationPotential(sequence: Move[]): number {
    const optimized = optimize(sequence)
    return sequence.length - optimized.length
}

export function optimize(sequence: Move[]): Move[] {
    let isClean = false
    let index = 0
    let len = 0
    let limit = 50
    let cleaner: Move[] = []

    while (!isClean && limit--) {
        index = 0
        isClean = true
        cleaner = []
        len = sequence.length
        while (index < len) {
            const [stupid, better] = find(index)
            if (!stupid) {
                cleaner.push(sequence[index])
                index++
                continue
            }
            isClean = false
            cleaner.push(...better)
            index += stupid.length
        }
        sequence = cleaner
    }
    return sequence.filter(Boolean)

    function find(index: number): [Move[], Move[]] | [null, null] {
        for (const [stupid, better] of replacer) {
            if (match(stupid, index)) {
                return [stupid, better]
            }
        }
        return [null, null]
    }

    function match(pattern: Move[], index: number): boolean {
        const len = pattern.length
        if (index > sequence.length - len) return false
        let i = 0
        while (i < len) {
            if (pattern[i] !== sequence[index + i]) return false
            i++
        }
        return true
    }
}

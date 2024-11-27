import type { Move } from '$lib/move'

const replacer: [Move[], Move[]][] = [
    [['pb', 'pa'], []],
    [['pa', 'pb'], []],
    [
        ['pb', 'sb', 'pa', 'pa'],
        ['pa', 'sa'],
    ],
    [['pb', 'pb', 'sb', 'pa', 'pa'], ['sa']],
    [['pa', 'pa', 'sa', 'pb', 'pb'], ['sb']],
    [['sa', 'sb'], ['ss']],
    [['sb', 'sa'], ['ss']],
    [
        ['sa', 'pa', 'pa', 'sb'],
        ['pa', 'pa', 'ss'],
    ],
]

export function cleanSequence(sequence: Move[]) {
    let isClean = false
    let index = 0
    let limit = 1
    //while (!isClean && limit > 0) {
    limit--
    index = 0
    isClean = true
    while (index < sequence.length) {
        const [stupid, better] = find(index)
        if (stupid) {
            sequence.splice(index, stupid.length, ...better)
            isClean = false
        }
        index++
    }
    //}

    function find(index: number): [Move[], Move[]] | [null, null] {
        for (const [stupid, better] of replacer) {
            if (match(stupid, index)) {
                console.log({ stupid, better })
                return [stupid, better]
            }
        }
        return [null, null]
    }

    function match(pattern: Move[], index: number): boolean {
        if (index > sequence.length - pattern.length) return false
        return !pattern.filter((m, i) => m !== sequence[index + i]).length
    }
}

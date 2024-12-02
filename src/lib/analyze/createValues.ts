export function createValues(nb: number): number[] {
    if (nb < 1) return []
    const numbers = Array(nb)
        .fill(1)
        .map(() => Math.random())
    const sorted = numbers.toSorted()
    return numbers.map((n, i) => sorted.indexOf(n))
}

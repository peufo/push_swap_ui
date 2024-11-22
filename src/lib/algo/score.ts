import { move, moveList, moveReverseMap, type Move, type Stack } from '$lib/move'
import type { Algo } from '$lib/algo'

const MAX_CANDIDATES = 5

export const algoScore: Algo = {
  name: 'Score',
  async resolve(values) {
    let limit = values.length * 10
    let state = createState(values)
    while (state.score > 0 && limit--) {
      state = state.candidates[0]
      if (state.score > 0) state.candidates = getNextCandidates(state, 4)
    }
    return state.sequence.slice(1).map(s => s.m as Move)
  },
}

export type State = Stack & {
  deltas: number[]
  deltasRaw: number[]
  distances: number[]
  steps: number[]
  entropies: number[]
  pivot: number | null
  score: number
  scores: {
    entropy: number
    balance: number
    proximity: number
    alignement: number
  }
  sequence: { m: Move | 'init'; score: number }[]
  candidates: State[]
}

export function updateState({
  values,
  cursor,
  sequence,
}: Pick<State, 'values' | 'cursor' | 'sequence'>): State {
  const len = values.length
  const deltasRaw = values.map((v, i) => v - i)
  const deltas = deltasRaw.map(
    (delta) =>
      [delta - len, delta, delta + len].sort(
        (a, b) => Math.abs(a) - Math.abs(b)
      )[0]
  )
  const getStep = (a: number, b: number): number => {
    if (a == b) return 0
    if (a > b) return Math.min(a - b, b - a + len)
    return Math.min(b - a, a - b + len)
  }

  function getEntropie(value: number, index: number): number {
    const indexA = index - 1
    const valueA = value === 0 ? len - 1 : value - 1
    const indexB = index === len - 1 ? 0 : index + 1
    const valueB = value === len - 1 ? 0 : value + 1
    let entropy = 0
    if (index > 0) entropy += Math.abs(valueA - values[indexA])
    if (index < len - 1) entropy += Math.abs(valueB - values[indexB])
    return entropy
  }

  const entropies = values.map(getEntropie)

  const steps = deltas.map((v, i) => {
    if (i == 0) return getStep(deltas[0], deltas.at(-1)!)
    return getStep(deltas[i], deltas[i - 1])
  })

  const entropyA = sumOf(entropies.slice(cursor))
  const entropyB = sumOf(entropies.slice(0, cursor))
  const proximityA = entropyA && getStackProximity(steps.slice(cursor))
  const proximityB = entropyB && getStackProximity(steps.slice(0, cursor))
  let proximity = 0
  if (entropyA && entropyB) proximity = Math.min(proximityA, proximityB)
  else if (proximityA) proximity = proximityA
  else proximity = proximityB

  const distances = values.map((v, i) =>
    i < cursor ? Math.min(i, cursor - i) : Math.min(i - cursor, len - i)
  )

  let pivot = getPivot(values)
  function getPivot(arr: number[]): number | null {
    if (arr.length <= 2) return null
    const base = Math.min(...arr)
    const p = Math.floor(arr.length / 2)
    const dirty = !!arr
      .map((v) => v - base)
      .find((v, i) => (i <= p && v >= p) || (i > p && v < p))
    if (dirty) return p
    const pivotA = getPivot(arr.slice(p))
    if (pivotA) return p + pivotA
    return getPivot(arr.slice(0, p))
  }

  const scores: State['scores'] = {
    entropy: sumOf(entropies),
    balance: Math.abs(entropyA - entropyB),
    proximity,
    alignement: sumOf(deltas),
  }

  return {
    cursor,
    values,
    sequence,
    deltasRaw,
    distances,
    entropies,
    pivot,
    deltas,
    steps,
    scores,
    score: sumOf([
      scores.entropy,
      !scores.entropy && !cursor ? scores.alignement / (len * 10) : 0,
    ]),
    candidates: [],
  }
}


function sortState(a: State, b: State): number {
  if (a.score === b.score) return a.sequence.length - b.sequence.length
  return a.score - b.score
}

export function getNextCandidates(
  parent: State,
  candidateDeep: number
): State[] {
  const len = parent.values.length
  const lastMove = parent.sequence.at(-1)!.m
  const candidates = moveList
    .filter((m) => {
      if (lastMove !== 'init' && m === moveReverseMap[lastMove]) return false
      if (parent.cursor === 0 && m === 'pa') return false
      if (parent.cursor === len - 1 && m === 'pb') return false
      if (
        parent.cursor < 2 &&
        ['sb', 'ss', 'rb', 'rrb', 'rr', 'rrr'].includes(m)
      )
        return false
      if (
        parent.cursor > len - 2 &&
        ['sa', 'ss', 'ra', 'rrb', 'rr', 'rrr'].includes(m)
      )
        return false
      if (lastMove === 'ss' && ['sa', 'sb'].includes(m)) return false
      if (lastMove === 'rr' && ['ra', 'rb'].includes(m)) return false
      return true
    })
    .map((m) => {
      const s = updateState(move(parent, m)) 
      s.sequence.push({m, score: s.score})
      return s
    })
    .sort(sortState)
    .slice(0, MAX_CANDIDATES)
  const winners = candidates.filter((s) => s.score === 0)
  if (winners.length) return winners
  if (candidateDeep == 0) return candidates
  return candidates
    .map((state) => getNextCandidates(state, candidateDeep - 1))
    .flat()
    .sort(sortState)
    .slice(0, MAX_CANDIDATES)
}

export function createState(values: number[]): State {
  const sorted = values.toSorted()
  const state = updateState({
    cursor: 0,
    values: values.map((v) => sorted.indexOf(v)),
    sequence: [],
  })
  state.sequence = [{ m: 'init', score: state.score }]
  state.candidates = getNextCandidates(state, 4)
  return state
}

function sumOf(numbers: number[]): number {
  return numbers.reduce((acc, cur) => acc + cur, 0)
}

function getStackProximity(steps: number[]): number {
  const first = steps.findIndex((v) => v !== 0)
  const last = steps.findLastIndex((v) => v !== 0)
  return Math.min(first, steps.length - 1 - last)
}

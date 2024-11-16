import { move, moveList, moveReverseMap, type Move } from './move'

export type State = {
  cursor: number
  values: number[]
  deltas: number[]
  deltasRaw: number[]
  steps: number[]
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
  const deltasRaw = values.map((v, i) => v - (i - cursor))
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
  const steps = deltas.map((v, i) => {
    if (i == 0) return getStep(deltas[0], deltas.at(-1)!)
    return getStep(deltas[i], deltas[i - 1])
  })

  const entropyA = sumOf(steps.slice(cursor))
  const entropyB = sumOf(steps.slice(0, cursor))
  const proximityA = entropyA && getStackProximity(steps.slice(cursor))
  const proximityB = entropyB && getStackProximity(steps.slice(0, cursor))
  let proximity = 0
  if (entropyA && entropyB) proximity = Math.min(proximityA, proximityB)
  else if (proximityA) proximity = proximityA
  else proximity = proximityB

  const scores: State['scores'] = {
    entropy: sumOf(steps),
    balance: Math.abs(entropyA - entropyB),
    proximity,
    alignement: sumOf(deltasRaw.map((d) => Math.abs(d))),
  }

  return {
    cursor,
    values,
    sequence,
    deltasRaw,
    deltas,
    steps,
    scores,
    score: sumOf([
      1000 * scores.entropy,
      100 * scores.balance,
      10 * scores.proximity,
      scores.alignement,
      scores.entropy ? 0 : cursor,
    ]),
    candidates: [],
  }
}

const MAX_CANDIDATES = 6
function sortState(a: State, b: State): number {
  if (a.score === b.score) return a.sequence.length - b.sequence.length
  return a.score - b.score
}

export function getNextCandidates(
  parent: State,
  candidateDeep: number
): State[] {
  const lastMove = parent.sequence.at(-1)!.m
  const candidates = moveList
    .filter((m) => lastMove === 'init' || m !== moveReverseMap[lastMove])
    .map((m) => move(parent, m))
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
  state.candidates = getNextCandidates(state, 5)
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

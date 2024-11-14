export type State = {
  cursor: number
  values: number[]
  deltas: number[]
  steps: number[]
  score: number
  scores: {
    entropy: number
    balance: number
    proximity: number
    alignement: number
  }
}

export function updateState({
  values,
  cursor,
}: Pick<State, 'values' | 'cursor'>): State {
  const len = values.length
  const deltas = values.map((v, i) => {
    const delta = v - (i - cursor)
    return delta < 0 ? delta + len : delta - len
  })
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
    alignement: deltas.reduce((acc, cur) => acc + Math.abs(cur), 0),
  }
  return {
    cursor,
    values,
    deltas,
    steps,
    scores,
    score: sumOf([
      1000 * scores.entropy,
      100 * scores.balance,
      10 * scores.proximity,
      5 * scores.alignement,
    ]),
  }
}

export function createState(values: number[]): State {
  const sorted = values.toSorted()
  return updateState({
    cursor: 0,
    values: values.map((v) => sorted.indexOf(v)),
  })
}

function sumOf(numbers: number[]): number {
  return numbers.reduce((acc, cur) => acc + cur, 0)
}

function getStackProximity(steps: number[]): number {
  const first = steps.findIndex((v) => v !== 0)
  const last = steps.findLastIndex((v) => v !== 0)
  return Math.min(first, steps.length - 1 - last)
}

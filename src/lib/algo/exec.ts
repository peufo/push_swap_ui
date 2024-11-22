import { sequenceShema } from "$lib/move";
import { writable, get } from "svelte/store";
import type { Algo } from ".";

export const execPath = writable('~/42/push_swap/push_swap')

export const algoExec: Algo = {
  name: 'Executable',
  async resolve(values) {
    const output = await fetch('/', {
      method: 'POST',
      body: JSON.stringify({ execPath: get(execPath), values }),
    }).then((r) => r.text())
    const res = sequenceShema.safeParse(output.split('\n').filter(Boolean))
    if (res.success) {
      return res.data
    } else {
      console.log(res.error)
      return []
    }
  },
}
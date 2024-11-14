import { promisify } from 'node:util'
import child_process from 'node:child_process'
import zod from 'zod'
const exec = promisify(child_process.exec)

export const POST = async ({ request }) => {
  const json = await request.json()
  const { exe, values } = zod
    .object({
      exe: zod.string(),
      values: zod.array(zod.number()),
    })
    .parse(json)
  const res = await exec(`${exe} ${values.join(' ')}`)
  return new Response(res.stdout)
}

import { promisify } from 'node:util'
import child_process from 'node:child_process'
import zod from 'zod'
const exec = promisify(child_process.exec)

export const POST = async ({ request }) => {
  const json = await request.json()
  const { execPath, values } = zod
    .object({
      execPath: zod.string(),
      values: zod.array(zod.number()),
    })
    .parse(json)
  const res = await exec(`${execPath} ${values.join(' ')}`)
  return new Response(res.stdout)
}

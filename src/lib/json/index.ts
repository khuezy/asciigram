export async function parseJson(reader: ReadableStreamDefaultReader<Uint8Array>) {
  let result: string[] = []
  // # ATTN
  while (true) {
    const r = await reader?.read()
    if (r?.done) break
    r && result.push(r?.value.toString())
  }
  const data = JSON.parse(result.join('') || '{}')
  return data
}
import type { RequestEvent } from '../$types'
import {saveImage, deletePost} from '../../db'
import { get} from 'svelte/store'
import {page} from '$app/stores'
import Ascii from 'asciify-image'
import { parseJson } from '../../lib/json'

export async function POST({request, locals}: RequestEvent) {
  const session = await locals.getSession()
  if (!session) {
    return new Response('Unauthorized', {status: 403})
  }
  const data = await parseJson(request.body?.getReader()!)

  const b = Buffer.from(data.image, 'base64')
  Ascii(b, {fit: 'width', width: 43, format: 'array', color: true}, async (err, c) => {
    await saveImage(session.user?.id!, session.user?.name!, session.user?.image!, JSON.stringify(c))
  })
  return new Response('ok', {status: 200})
}

export async function DELETE({request, locals}: RequestEvent) {
  const data = await parseJson(request.body?.getReader()!)
  const session = await locals.getSession()
  if (!session || session.user.id !== data.authorId) {
    return new Response('Unauthorized', {status: 403})
  }

  await deletePost(data.postId, data.authorId)
  return new Response('ok', {status: 200})
}
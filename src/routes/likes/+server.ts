import type { RequestEvent } from "../$types";
import { postLike, removeLike } from "../../db";

import { parseJson } from '../../lib/json'

export async function POST({request, locals}: RequestEvent) {
  const session = await locals.getSession()
  if (!session) {
    return new Response('Unauthorized', {status: 403})
  }
  const data = await parseJson(request.body?.getReader()!)
  await postLike(data.postId, session.user.id)
  return new Response('ok', {status: 200} )
}

export async function DELETE({request, locals}: RequestEvent) {
  const session = await locals.getSession()
  if (!session) {
    return new Response('Unauthorized', {status: 403})
  }
  const data = await parseJson(request.body?.getReader()!)
  await removeLike(data.postId, session.user.id)
  return new Response('ok', {status: 200} )
}
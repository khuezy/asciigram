import type { RequestEvent } from "../$types";
import {postComment} from '../../db'
import { parseJson } from '../../lib/json'

export async function POST({request, locals}: RequestEvent) {
  const session = await locals.getSession()
  if (!session) {
    return new Response('Unauthorized', {status: 403})
  }
  const data = await parseJson(request.body?.getReader()!)
  await postComment(data.comment, data.postId, data.authorId)
  return new Response(JSON.stringify({
    comment: {
      ...data,
      user: session.user
    }
  }), {status: 200, headers: {'Content-Type': 'application/json'}} )
}
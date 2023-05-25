import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { DB_URL } from '$env/static/private'

import { images, imagesRelations } from './models/images';
import { posts, postsRelations } from './models/posts';
import { comments, commentsRelations } from './models/comments';
import { users, usersRelations } from './models/users';
import { likes, likesRelations } from './models/likes';
import { eq, and } from 'drizzle-orm';
 
const connectionString  = `${DB_URL || process.env.DB_URL}?sslmode=require`
const client = postgres(connectionString);
export const db = drizzle(client, {schema: {
  users,
  usersRelations,
  posts,
  postsRelations,
  images,
  imagesRelations,
  comments,
  commentsRelations,
  likes,
  likesRelations
}});


export async function getImages() {
  const res = await db.select().from(images);
  return res
}

export async function getPosts() {
  return db.query.posts.findMany({
    with: {
      images: true,
      comments: {
        with: {
          user: true
        },
        orderBy: (comments, {asc}) => [asc(comments.id)]
      },
      likes: {
        with: {
          user: true
        }
      }
    },
    orderBy: (posts, {desc}) => [desc(posts.time)],
    
  })
}

export async function saveImage(authorId: string, author: string, avatar: string, data: string) {
  return db.transaction<boolean>(async tx => {
    const post = await tx.insert(posts).values({authorId, author, avatar}).returning()
    await tx.insert(images).values({data, postId: post[0].id})
    return true
  })
}

export async function deletePost(postId: number, authorId: string) {
  return db.transaction<boolean>(async tx=> {
    await tx.delete(posts).where( 
      and(
        eq(posts.id, postId),
        eq(posts.authorId, authorId)
      )
    )
    await tx.delete(images).where(
      eq(images.postId, postId)
    )
    return true
  })
}

export async function postComment(comment: string, postId: number, authorId: string) {
  return db.insert(comments).values({comment, authorId, postId}).returning()
}

export async function postLike(postId: number, userId: string) {
  return db.insert(likes).values({postId, userId})
}
export async function removeLike(postId: number, userId: string) {
  return db.delete(likes).where(
    and(
      eq(likes.postId, postId),
      eq(likes.userId, userId)
    )
  )
}
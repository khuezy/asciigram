import fs from 'fs/promises'
import path from 'path'
import Ascii from 'asciify-image'

import type { PageLoad, Actions } from './$types'

import {getImages, getPosts, saveImage} from '../db'



export const actions: Actions = {
  upload: async( { request, route, url}) => {
    const fd = await request.formData()
    const data = Object.fromEntries(fd)
  }
}

export async function load({ params, parent, setHeaders }) {
  // setHeaders({
  //   'cache-control': 's-maxage=3600,must-revalidate'
  // })
  // const session = await parent()
  return {
      images: await getImages(),
      posts: await getPosts()
  };
}
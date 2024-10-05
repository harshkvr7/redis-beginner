'use server'

import client from "@/lib/db"
import { redirect } from 'next/navigation'

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData)

  await client.incr('id');

  const id = await client.get('id');

  const unique = await client.zAdd('books', {
    value: title,
    score: id
  }, { NX: true })

  if (!unique) {
    return { error: 'Book already added' }
  }
  else {
    await client.hSet(`books:${id}`, {
      title,
      rating,
      author,
      blurb
    })
  }

  redirect('/');
}
// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2

import { getDoc, updateDoc, doc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../src/firebase'

const edition = process.env.VITE_EDITION

export default async (request, context) => {
  try {
    const data = {
      date: new Date().toISOString(),
    }
    return new Response(JSON.stringify(data))
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}




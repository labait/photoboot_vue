// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2

import { getDoc, updateDoc, doc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../src/firebase'

const edition = process.env.VITE_EDITION

export default async (request, context) => {
  try {
    if (!edition) {
      return new Response('Missing EDITION environment variable', {
        status: 500,
      })
    }

    const docRef = collection(db, 'items')
    const q = query(
      docRef,
      where('status', '==', 'processed'),
      where('edition', '==', edition)
    )
    const docData = await getDocs(q)
    const data = docData.docs.map(doc => ({...doc.data(), docId: doc.id}))
    
    return new Response(JSON.stringify(data))
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}




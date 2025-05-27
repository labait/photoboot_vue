// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2

import { getDoc, updateDoc, doc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../src/firebase'


export default async (request, context) => {
  try {
    const docRef = collection(db, 'items')
    const q = query(docRef, where('status', '==', 'processed'))
    const docData = await getDocs(q)
    const data = docData.docs.map(doc => doc.data())
    
    return new Response(JSON.stringify(data))
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}




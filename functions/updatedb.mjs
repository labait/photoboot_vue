import { collection, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../src/firebase'

export default async (request, context) => {
  try {
    const itemsRef = collection(db, 'items')
    const snapshot = await getDocs(itemsRef)

    if (snapshot.empty) {
      return new Response(
        JSON.stringify({ updated: 0, message: 'No documents found in items collection' })
      )
    }

    const docs = snapshot.docs
    const chunkSize = 500
    let updated = 0

    for (let i = 0; i < docs.length; i += chunkSize) {
      const batch = writeBatch(db)
      const chunk = docs.slice(i, i + chunkSize)

      for (const itemDoc of chunk) {
        batch.update(itemDoc.ref, { edition: 2025 })
      }

      await batch.commit()
      updated += chunk.length
    }

    return new Response(JSON.stringify({ updated, edition: 2025 }))
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}

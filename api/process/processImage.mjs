// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2

import { getDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../src/firebase'


export default async (request, context) => {
  try {
    const url = new URL(request.url)
    const docId = url.searchParams.get('docId')
    const docRef = doc(db, 'items', docId)
    const docData = await getDoc(docRef)
    const docDataJson = docData.data()
    const imageUrl = docDataJson.image_source
    
    const data = {
      docId: docData.id, 
      docData: docDataJson,
      result: null,
    }

    const response = await fetch(
      'https://api.replicate.com/v1/models/luma/photon/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_REPLICATE_API_TOKEN}`
        },
        body: JSON.stringify({
          input:{
            aspect_ratio: "16:9",
            //character_reference_url: "https://firebasestorage.googleapis.com/v0/b/photobooth-laba-2ca9f.firebasestorage.app/o/images%2F1748260640567%2F1748260640567.png?alt=media&token=7d30873f-0037-4d44-bb43-98953e6120da",
            character_reference_url: imageUrl,
            image_reference_weight: 0.55,
            prompt: "photo of a 6-year-old child, ensuring that their recognizable features remain intact while making them appear younger Maintain the ambiance and objects in the image as closely as possible to the original reference image. no beard or goatee, no white hair.",
            style_reference_weight: 0.85
          }
        })
      }
    );
    
    const result = await response.json();
    data.result = result;
    // update doc with result
    await updateDoc(doc(db, 'items', docId), {
      process_result: result,
    });

    return new Response(JSON.stringify(data))
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}




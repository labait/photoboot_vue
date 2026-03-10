// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2

import { getDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../src/firebase'


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

    /* luma 
    const apiUrl = 'https://api.replicate.com/v1/models/luma/photon/predictions'
    const body = {
      input:{
        aspect_ratio: "16:9",
        //character_reference_url: "https://firebasestorage.googleapis.com/v0/b/photobooth-laba-2ca9f.firebasestorage.app/o/images%2F1748260640567%2F1748260640567.png?alt=media&token=7d30873f-0037-4d44-bb43-98953e6120da",
        character_reference_url: imageUrl,
        image_reference_weight: 0.55,
        prompt: process.env.VITE_PROMPT,
        style_reference_weight: 0.85
      }
    }
    */

    /* flux-2-pro
    const apiUrl = 'https://api.replicate.com/v1/models/black-forest-labs/flux-2-pro/predictions'
    const body = {
      input: {
        prompt: process.env.VITE_PROMPT,
        resolution: "1 MP",
        aspect_ratio: "1:1",
        input_images: [imageUrl],
        output_format: "png",
        output_quality: 80,
        safety_tolerance: 2
      }
    }*/

    /* qwen-image-edit-2511 */
    const apiUrl = 'https://api.replicate.com/v1/models/qwen/qwen-image-edit-2511/predictions'
    const body = {
      "input": {
        "image": [imageUrl],
        "prompt": process.env.VITE_PROMPT,
        "go_fast": true,
        //"aspect_ratio": "3:4",
        "output_format": "png",
        "output_quality": 95
      }
    }

    const response = await fetch(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`
        },
        body: JSON.stringify(body)
      }
    );
    
    const result = await response.json();
    data.result = result;
    // update doc with result
    await updateDoc(doc(db, 'items', docId), {
      status: 'created',
      image_processed: null,
      process_result: result,
    });
    console.log('processResult', result)
    return new Response(JSON.stringify(data))
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}




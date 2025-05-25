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
            "prompt": process.env.VITE_PROMPT,
            "aspect_ratio": "1:1",
            "image_reference_url": imageUrl,
            "image_reference_weight": 1,
            "style_reference_weight": 0.85
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




const processImage = async (url) => {
  try {
    config.value.isLoading = true;
    if (!config.value.currentImage || !config.value.doc) {
      console.error('No image or document available for processing');
      config.value.isLoading = false;
      return false
    }
      

    
    await updateDoc(doc(db, 'items', config.value.doc.docId), {
      process_result: result,
    });
    
    config.value.isLoading = false;

    return result;
  } catch (error) {
    console.error('Error processing image', error);
    config.value.isLoading = false;
    return false;
  }

}
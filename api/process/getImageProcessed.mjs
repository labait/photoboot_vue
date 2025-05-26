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

    const resultUrl = docDataJson.process_result.urls.get
    const response = await fetch(
      resultUrl,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_REPLICATE_API_TOKEN}`
        }
      }
    );

    const result = await response.json();
    data.result = result;

    // update doc with result
    await updateDoc(doc(db, 'items', docId), {
      status: 'processed',
    });

    return new Response(JSON.stringify(result))
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
<script setup>
import { ref, provide } from 'vue';

import { storage, db } from './firebase'
import { ref as storageRef, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore'

import Loading from './components/Loading.vue'

const config = ref({
  debug: false,
  isLoading: false,
  currentImage: null,
  doc: null,
  process_result: null,
})
window.config = config; // for debug purposes

const uploadImage = async (imageDataUrl, imageId) => {
  try {
    config.value.isLoading = true;

    const docRef = await addDoc(collection(db, 'items'), {
      timestamp: serverTimestamp(),
      image_id: imageId,
      status: 'created',
    })


    const imageRef = storageRef(storage, `images/${imageId}/${imageId}.png`)
    await uploadString(imageRef, imageDataUrl, 'data_url')
    config.value.currentImage = imageDataUrl;
    const downloadURL = await getDownloadURL(imageRef)
    await updateDoc(docRef, {
      image_source: downloadURL,
    })
    
    config.value.doc = docRef;

    // call process function
    const processUrl = `/.netlify/functions/processImage?docId=${config.value.doc.id}`;
    console.log('processUrl', processUrl);
    const response = await fetch(processUrl);
    const result = await response.json()
    config.value.process_result = result;

    // update the status to processing
    await updateDoc(docRef, {
      status: 'processing',
    })

    return true;

  } catch (error) {
    console.error('Error uploading image:', error)
    return false;
  }
}


const getResult = async (docId) => {
  const maxChecks = 30;
  const docRef = doc(db, 'items', docId)
  const docData = await getDoc(docRef)
  let checkCount = docData.check_count || 0;  
  
  // call process function
  const getImageProcessedUrl = `/.netlify/functions/getImageProcessed?docId=${docId}`;
  console.log(`getImageProcessedUrl ${docId}, checkCount ${checkCount}`, getImageProcessedUrl);
  const response = await fetch(getImageProcessedUrl);
  const data = await response.json()
  console.log('data', data)

  checkCount = checkCount + 1;
  await updateDoc(docRef, {
    check_count: checkCount,
  })

  if (data.status == "succeeded") {    
    // download image_processed and save to firebase storage
    const imageRef = storageRef(storage, `images/${docId}/processed.png`)
    const response = await fetch(data.output);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);
    const image_processed = await getDownloadURL(imageRef)

    await updateDoc(docRef, {
      status: 'processed',
      process_result: data,
      image_processed: image_processed,
    })
  } else {
    if (checkCount < maxChecks) {
      setTimeout(() => {
        getResult(docId)
      }, 5000)
    } else {
      console.log(`failed to get result after ${maxChecks} checks`)
      await updateDoc(docRef, {
        status: 'failed',
      })
    }
  }
 
  return data;
}


provide('config', config);
provide('uploadImage', uploadImage);
provide('getResult', getResult);

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-black">
    <Loading v-if="config.isLoading" />
    <router-view />
  </div>
</template>
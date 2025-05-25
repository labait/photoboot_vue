<script setup>
import { ref, provide } from 'vue';

import { storage, db } from './firebase'
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import axios from 'axios'

import Loading from './components/Loading.vue'

const config = ref({
  debug: true,
  isLoading: false,
  currentImage: null,
  doc: null,
  process_result: null,
})
window.config = config; // for debug purposes

const saveImage = async (imageDataUrl, filename) => {
  try {
    config.value.isLoading = true;
    const imageRef = storageRef(storage, `images/${filename}`)
    
    // Upload the image (data URL) to Firebase Storage
    await uploadString(imageRef, imageDataUrl, 'data_url')

    // save the image bytes in the currentImage
    config.value.currentImage = imageDataUrl;
    
    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef)
    
    // Save the reference in Firestore
    const docRef = await addDoc(collection(db, 'items'), {
      image_source: downloadURL,
      timestamp: serverTimestamp(),
      filename: filename,
    })
    config.value.doc = docRef;

    
    // call process function
    const processUrl = `/.netlify/functions/process?docId=${config.value.doc.id}`;
    console.log('processUrl', processUrl);
    const response = await fetch(processUrl);
    const result = await response.json()
    config.value.process_result = result;

    return config.value;

  } catch (error) {
    console.error('Error uploading image:', error)
    return false;
  }
}


provide('config', config);
provide('saveImage', saveImage);

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-black">
    <Loading v-if="config.isLoading" />
    <router-view />
  </div>
</template>
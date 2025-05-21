<script setup>
import { ref, provide } from 'vue';

import { storage, db } from './firebase'
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'


const saveImage = async (imageDataUrl) => {
  try {
    // Create a unique filename
    const timestamp = new Date().getTime()
    const filename = `photo_${timestamp}.png`
    const imageRef = storageRef(storage, `images/${filename}`)
    
    // Upload the image (data URL) to Firebase Storage
    await uploadString(imageRef, imageDataUrl, 'data_url')
    
    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef)
    
    // Save the reference in Firestore
    const docRef = await addDoc(collection(db, 'items'), {
      image_from: downloadURL,
      timestamp: serverTimestamp(),
      filename: filename
    })
    

    const result ={
      success: true,
      downloadURL,
      docId: docRef.id,
      filename
    }

    return {
      success: true,
      downloadURL,
      docId: docRef.id,
      filename
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error
    }
  }
}



provide('saveImage', saveImage);

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
    <router-view />
  </div>
</template>
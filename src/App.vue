<script setup>
import { ref, provide } from 'vue';

import { storage, db } from './firebase'
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import axios from 'axios'
import { OpenAI } from 'openai'

import Loading from './components/Loading.vue'

const config = ref({
  isLoading: false,
  currentImage: null,
  docId: null,
  taskId: null,
})

const saveImage = async (imageDataUrl) => {
  try {
    config.value.isLoading = true;
    // Create a unique filename
    const timestamp = new Date().getTime()
    const filename = `photo_${timestamp}.png`
    const imageRef = storageRef(storage, `images/${filename}`)
    
    // Upload the image (data URL) to Firebase Storage
    await uploadString(imageRef, imageDataUrl, 'data_url')

    // save the image bytes in the currentImage
    config.value.currentImage = imageDataUrl;
    
    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef)
    
    // Save the reference in Firestore
    const docRef = await addDoc(collection(db, 'items'), {
      image_from: downloadURL,
      timestamp: serverTimestamp(),
      filename: filename,
    })
    config.value.docId = docRef.id; // save the doc id
    

    const result ={
      success: true,
      downloadURL,
      docId: docRef.id,
      filename
    }

    config.value.isLoading = false;
    processImage();

    return {
      success: true,
      downloadURL,
      docId: docRef.id,
      filename,
      currentImage: config.value.currentImage,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error
    }
  }
}

const processImage = async () => {
  try {
    config.value.isLoading = true;
    
    if (!config.value.currentImage || !config.value.docId) {
      console.error('No image or document ID available for processing');
      config.value.isLoading = false;
      return {
        success: false,
        error: 'No image or document ID available'
      };
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true 
    });
    
    // Get the prompt from environment variables
    const prompt = import.meta.env.VITE_OPEN_AI_PROMPT;
    
    // Convert data URL to Blob and then to File
    const imageDataUrl = config.value.currentImage;
    const blob = await fetch(imageDataUrl).then(res => res.blob());
    const file = new File([blob], 'image.png', { type: 'image/png' });
    
    // Call OpenAI API to process the image
    const response = await openai.images.edit({
      image: file,
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
    
    // Extract task ID from the response (using the ID field or a timestamp if not available)
    const taskId = response.id || `task_${new Date().getTime()}`;
    config.value.taskId = taskId;
    
    // Update the Firestore document with the taskId
    await updateDoc(doc(db, 'items', config.value.docId), {
      task_id: taskId,
      processing_started: serverTimestamp(),
      prompt: prompt
    });
    
    config.value.isLoading = false;
    
    return {
      success: true,
      taskId,
      response
    };
  } catch (error) {
    console.error('Error processing image with OpenAI:', error);
    config.value.isLoading = false;
    return {
      success: false,
      error
    };
  }
}

provide('config', config);
provide('saveImage', saveImage);
provide('processImage', processImage);

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-black">
    <Loading v-if="config.isLoading" />
    <router-view />
  </div>
</template>
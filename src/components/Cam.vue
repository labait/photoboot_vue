<script setup>
import { ref, onMounted, inject } from 'vue';
import Header from './Header.vue';
import polaroid from './Polaroid.vue';

const video = ref(null);
const canvas = ref(null);
const image = ref(null);
const videoDevices = ref([]);
const selectedDevice = ref('');
const isUploading = ref(false);

const saveImage = inject('saveImage');

onMounted(async () => {
  await getVideoDevices();
  if (videoDevices.value.length > 0) {
    selectedDevice.value = videoDevices.value[0].deviceId;
    await startCamera();
  }
});

async function getVideoDevices() {
  try {
    const permission = await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoDevices.value = devices.filter(device => device.kind === 'videoinput');
    console.log(videoDevices.value);
  } catch (error) {
    console.error('Error getting video devices:', error);
  }
}

async function startCamera() {
  if (!selectedDevice.value) return;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedDevice.value ? { exact: selectedDevice.value } : undefined
      }
    });
    
    if (video.value) {
      video.value.srcObject = stream;
      video.value.play();
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

async function changeCamera() {
  if (video.value && video.value.srcObject) {
    const tracks = video.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
  
  await startCamera();
}

async function shot() {
  if (!video.value) return;
  
  // Create canvas if it doesn't exist
  if (!canvas.value) {
    canvas.value = document.createElement('canvas');
  }
  
  // Set canvas dimensions to match video
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  
  // Draw current video frame to canvas
  const ctx = canvas.value.getContext('2d');
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  
  // Get image as data URL
  image.value = canvas.value.toDataURL('image/png');
  
  // Download a local copy
  const link = document.createElement('a');
  link.download = 'photo.png';
  link.href = image.value;
  link.click();
  
  try {
    isUploading.value = true;
    
    const result = await saveImage(image.value);
    
    if (result.success) {
      console.log('Image processed successfully with result:', result);
    } else {
      console.error('Error processing image:', result.error);
    }
    
    isUploading.value = false;
  } catch (error) {
    console.error('Error processing image:', error);
    isUploading.value = false;
  }
}
</script>

<template>
  <Header title="Mettiti in posa" />
  <polaroid class="mb-8">
    <video ref="video" class="cam object-cover"></video>
  </polaroid>
  
  <select v-model="selectedDevice" @change="changeCamera" class="mt-2 p-2 rounded">
    <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
      {{ device.label || `Camera ${videoDevices.indexOf(device) + 1}` }}
    </option>
  </select>

  <button class="btn-primary mt-4" @click="shot" :disabled="isUploading">
    {{ isUploading ? 'Caricamento...' : 'Scatta' }}
  </button>
</template>


<style scoped>
.cam {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
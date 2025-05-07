<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <button 
      @click="handleButtonClick" 
      class="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
    >
      Test Button
    </button>
  </div>
</template>

<script setup>
async function handleButtonClick() {
  // call openai api
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, world!' }],
    }),
  });
  const data = await response.json();
  console.log(data);
}
</script>
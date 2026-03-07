<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['go-to-page']);
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2"
  >
    <button
      type="button"
      :disabled="currentPage <= 1"
      @click="emit('go-to-page', 1)"
      class="cursor-pointer px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
    >
      « Prima
    </button>
    <button
      type="button"
      :disabled="currentPage <= 1"
      @click="emit('go-to-page', currentPage - 1)"
      class="cursor-pointer px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
    >
      ←
    </button>
    <span class="text-white/80">
      {{ currentPage }} / {{ totalPages }}
    </span>
    <button
      type="button"
      :disabled="currentPage >= totalPages"
      @click="emit('go-to-page', currentPage + 1)"
      class="cursor-pointer px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
    >
      →
    </button>
    <button
      type="button"
      :disabled="currentPage >= totalPages"
      @click="emit('go-to-page', totalPages)"
      class="cursor-pointer px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
    >
      Ultima »
    </button>
  </div>
</template>

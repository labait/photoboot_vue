<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const route = useRoute();
const router = useRouter();
const global = inject('global');
const getStorageUrl = inject('getStorageUrl');

const items = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() =>
  Math.ceil(items.value.length / itemsPerPage) || 1
);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return items.value.slice(start, start + itemsPerPage);
});

const goToPage = (page) => {
  const pageNum = Math.max(1, Math.min(page, totalPages.value));
  currentPage.value = pageNum;
  router.push({ path: '/admin', query: { page: pageNum } });
};

const formatTimestamp = (ts) => {
  if (!ts) return '-';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString('it-IT');
};

const getImageUrl = async (urlOrPath) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http')) return urlOrPath;
  try {
    return getStorageUrl ? await getStorageUrl(urlOrPath) : urlOrPath;
  } catch {
    return null;
  }
};

const loadItems = async () => {
  global.value.isLoading = true;
  const snapshot = await getDocs(collection(db, 'items'));
  const rawItems = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  items.value = await Promise.all(
    rawItems.map(async (item) => ({
      ...item,
      image_source_url: await getImageUrl(item.image_source) ?? item.image_source,
      image_processed_url: await getImageUrl(item.image_processed) ?? item.image_processed,
    }))
  );

  items.value.sort((a, b) => {
    const ta = a.timestamp?.toMillis?.() ?? 0;
    const tb = b.timestamp?.toMillis?.() ?? 0;
    return tb - ta;
  });

  global.value.isLoading = false;

  const pageFromUrl = parseInt(route.query.page, 10);
  if (!isNaN(pageFromUrl) && pageFromUrl >= 1 && pageFromUrl <= totalPages.value) {
    currentPage.value = pageFromUrl;
  } else if (route.query.page !== undefined) {
    currentPage.value = 1;
    router.replace({ path: '/admin', query: totalPages.value > 1 ? { page: 1 } : {} });
  } else if (totalPages.value > 1) {
    router.replace({ path: '/admin', query: { page: 1 } });
  }
};

watch(
  () => route.query.page,
  (pageParam) => {
    if (!pageParam || items.value.length === 0) return;
    const pageNum = parseInt(pageParam, 10);
    if (pageNum >= 1 && pageNum <= totalPages.value && pageNum !== currentPage.value) {
      currentPage.value = pageNum;
    }
  }
);

const deleteItem = async (item) => {
  if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

  try {
    await deleteDoc(doc(db, 'items', item.id));

    if (item.image_source && item.image_source.includes('/o/')) {
      try {
        const path = item.image_source
          .split('/o/')[1]
          ?.split('?')[0]
          ?.replace(/%2F/g, '/');
        if (path) {
          const ref = storageRef(storage, path);
          await deleteObject(ref);
        }
      } catch (e) {
        console.warn('Errore cancellazione storage image_source:', e);
      }
    }
    if (item.image_processed && item.image_processed.includes('/o/')) {
      try {
        const path = item.image_processed
          .split('/o/')[1]
          ?.split('?')[0]
          ?.replace(/%2F/g, '/');
        if (path) {
          const ref = storageRef(storage, path);
          await deleteObject(ref);
        }
      } catch (e) {
        console.warn('Errore cancellazione storage image_processed:', e);
      }
    }

    items.value = items.value.filter((i) => i.id !== item.id);
  } catch (err) {
    console.error('Errore eliminazione:', err);
    alert('Errore durante l\'eliminazione');
  }
};

onMounted(loadItems);
</script>

<template>
  <div class="admin w-full py-6">
    <h1 class="text-2xl font-bold text-white mb-6">Admin - Items</h1>

    <div
      v-if="global.isLoading"
      class="text-white/70 py-8"
    >
      Caricamento...
    </div>

    <template v-else>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-white border-collapse">
          <thead>
            <tr class="border-b border-white/20">
              <th class="py-3 px-2 font-medium">id</th>
              <th class="py-3 px-2 font-medium">edition</th>
              <th class="py-3 px-2 font-medium">image_id</th>
              <th class="py-3 px-2 font-medium">image_source</th>
              <th class="py-3 px-2 font-medium">image_processed</th>
              <th class="py-3 px-2 font-medium">timestamp</th>
              <th class="py-3 px-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedItems"
              :key="item.id"
              class="border-b border-white/10 hover:bg-white/5"
            >
              <td class="py-3 px-2">
                <router-link
                  :to="`/detail/${item.id}`"
                  class="text-[#FF7230] hover:underline"
                >
                  {{ item.id }}
                </router-link>
              </td>
              <td class="py-3 px-2">{{ item.edition || '-' }}</td>
              <td class="py-3 px-2">{{ item.image_id || '-' }}</td>
              <td class="py-3 px-2">
                <img
                  v-if="item.image_source_url"
                  :src="item.image_source_url"
                  alt="source"
                  class="w-20 h-20 object-cover rounded"
                />
                <span v-else class="text-white/50">-</span>
              </td>
              <td class="py-3 px-2">
                <img
                  v-if="item.image_processed_url"
                  :src="item.image_processed_url"
                  alt="processed"
                  class="w-20 h-20 object-cover rounded"
                />
                <span v-else class="text-white/50">-</span>
              </td>
              <td class="py-3 px-2">{{ formatTimestamp(item.timestamp) }}</td>
              <td class="py-3 px-2">
                <button
                  type="button"
                  @click="deleteItem(item)"
                  class="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                >
                  delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-2 mt-6"
      >
        <button
          type="button"
          :disabled="currentPage <= 1"
          @click="goToPage(1)"
          class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
        >
          « Prima
        </button>
        <button
          type="button"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
          class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
        >
          ←
        </button>
        <span class="text-white/80">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
        >
          →
        </button>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          @click="goToPage(totalPages)"
          class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
        >
          Ultima »
        </button>
      </div>
    </template>
  </div>
</template>

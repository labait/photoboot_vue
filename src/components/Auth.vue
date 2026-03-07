<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const user = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isAdmin = ref(false);

const ensureAccountExists = async (uid) => {
  const accountRef = doc(db, 'accounts', uid);
  const accountSnap = await getDoc(accountRef);
  if (!accountSnap.exists()) {
    await setDoc(accountRef, {
      uid,
      roles: [],
    });
    isAdmin.value = false;
  } else {
    const data = accountSnap.data();
    isAdmin.value = Array.isArray(data?.roles) && data.roles.includes('admin');
  }
};

const loginWithGoogle = async () => {
  try {
    error.value = null;
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error('Errore login:', err);
    error.value = err.message || 'Errore durante il login';
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Errore logout:', err);
  }
};

let unsubscribe;
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser;
    isLoading.value = false;
    if (firebaseUser) {
      await ensureAccountExists(firebaseUser.uid);
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<template>
  <div class="auth-wrapper flex items-center gap-3">
    <template v-if="isLoading">
      <div class="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
    </template>
    <template v-else-if="user">
      <div class="flex items-center gap-2">
        <img
          referrerpolicy="no-referrer"
          v-if="user.photoURL"
          :src="user.photoURL"
          :alt="user.displayName || 'Avatar'"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
        />
        <div
          v-else
          class="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-sm font-medium"
        >
          {{ (user.displayName || user.email || '?')[0].toUpperCase() }}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-white text-sm font-medium truncate max-w-[120px]">
            {{ user.displayName || user.email }}
          </p>
        </div>
        <router-link
          v-if="isAdmin"
          to="/admin"
          class="cursor-pointer px-2 py-1 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          Admin
        </router-link>
        <button
          type="button"
          @click="logout"
          class="cursor-pointer px-2 py-1 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          Esci
        </button>
      </div>
    </template>
    <template v-else>
      <button
        type="button"
        @click="loginWithGoogle"
        class="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Accedi con Google
      </button>
      <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>
    </template>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 32px;
}
</style>

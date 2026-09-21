<template>
  <ErrorBoundary>
    <div id="app" class="flex flex-col min-h-screen bg-[#fcfcfd] relative selection:bg-orange-500 selection:text-white">
      <!-- Seamless Micro-Icon Pattern Wallpaper Layer -->
      <PatternBackground />

      <AppHeader v-slot="{}" v-if="!hideLayout" />
      <main class="flex-grow relative z-10">
        <router-view />
      </main>
      <AppFooter v-if="!hideLayout" class="relative z-10" />
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { computed, watchEffect, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '@clerk/vue'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabaseClient'
import AppHeader from './components/global/AppHeader.vue'
import AppFooter from './components/global/AppFooter.vue'
import ErrorBoundary from './components/global/ErrorBoundary.vue'
import PatternBackground from './components/global/PatternBackground.vue'

const route = useRoute()
const hideLayout = computed(() => route.path.startsWith('/admin') || route.path.startsWith('/dashboard'))

const authStore = useAuthStore()
const instruments = ref([])

onMounted(async () => {
  try {
    const { data, error } = await supabase.from('instruments').select('*')
    if (data && !error) {
      instruments.value = data
    }
  } catch (err) {
    // Graceful fallback if Supabase client credentials are not configured
  }
})

try {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser()
  watchEffect(() => {
    if (isLoaded.value && isSignedIn.value && clerkUser.value) {
      authStore.syncClerkUser(clerkUser.value)
    }
  })
} catch (e) {
  // Graceful fallback if Clerk plugin is disabled
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}
</style>


<template>
  <ErrorBoundary>
    <div id="app" class="flex flex-col min-h-screen">
      <AppHeader v-slot="{}" v-if="!hideLayout" />
      <main class="flex-grow">
        <router-view />
      </main>
      <AppFooter v-if="!hideLayout" />
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/global/AppHeader.vue'
import AppFooter from './components/global/AppFooter.vue'
import ErrorBoundary from './components/global/ErrorBoundary.vue'

const route = useRoute()
const hideLayout = computed(() => route.path.startsWith('/admin') || route.path.startsWith('/dashboard'))
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

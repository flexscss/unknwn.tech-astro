<template>
  <div class="relative container pb-16 sm:px-4 sasflix">
    <div class="scrollable overflow-y-auto h-[calc(100vh-200px)]">
      <Loader v-if="!isRouterReady" />
      <Suspense>
        <template #default>
          <RouterView v-if="isRouterReady" v-slot="{ Component }">
            <component :is="Component" />
          </RouterView>
        </template>
        <template #fallback>
          <Loader />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createPinia } from 'pinia'
import { onMounted, ref } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import Loader from './components/shared/ui/loader.vue'
import { useApp } from './composables/useApp.ts'
import IndexPage from './pages/index.vue'
import PostPage from './pages/posts/[id].vue'

const isRouterReady = ref(false)
const app = useApp()

onMounted(async () => {
  const pinia = createPinia()
  app.use(pinia)
  app.provide('pinia', pinia)

  const routes = [
    {
      name: 'index',
      path: '/',
      component: IndexPage,
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'posts-id',
      path: '/posts/:id',
      component: PostPage,
      meta: {
        scrollToTop: true
      }
    }
  ]

  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  app.use(router)
  app.provide('router', router)

  await router.isReady()
  isRouterReady.value = true
})
</script>

<style>
/* Text Colors */
.sasflix {
  overflow: hidden;
}
.sasflix .text-text {
  color: #181921;
}
.sasflix .text-border {
  color: #f8fafc;
}
.sasflix .text-accent-primary {
  color: #ff6b00;
}
.sasflix .text-accent-border {
  color: #ffd3b3;
}
.sasflix .text-accent-red {
  color: #ff3b30;
}
.sasflix .text-red {
  color: #FF3B30;
}
.sasflix .text-gray-primary-100 {
  color: #f5f5f5;
}
.sasflix .text-gray-primary-200 {
  color: #c8c8c8;
}
.sasflix .text-gray-primary-300 {
  color: #b3b3b4;
}

/* Background Colors */
.sasflix .bg-text {
  background-color: #181921;
}
.sasflix .bg-border {
  background-color: #f8fafc;
}
.sasflix .bg-accent-primary {
  background-color: #ff6b00;
}
.sasflix .bg-accent-border {
  background-color: #ffd3b3;
}
.sasflix .bg-accent-red {
  background-color: #ff3b30;
}
.sasflix .bg-red {
  background-color: #FF3B30;
}
.sasflix .bg-gray-primary-100 {
  background-color: #f5f5f5;
}
.sasflix .bg-gray-primary-200 {
  background-color: #c8c8c8;
}
.sasflix .bg-gray-primary-300 {
  background-color: #b3b3b4;
}

/* Border Colors */
.sasflix .border-text {
  border-color: #181921;
}
.sasflix .border-border {
  border-color: #f8fafc;
}
.sasflix .border-accent-primary {
  border-color: #ff6b00;
}
.sasflix .border-accent-border {
  border-color: #ffd3b3;
}
.sasflix .border-accent-red {
  border-color: #ff3b30;
}
.sasflix .border-red {
  border-color: #FF3B30;
}
.sasflix .border-gray-primary-100 {
  border-color: #f5f5f5;
}
.sasflix .border-gray-primary-200 {
  border-color: #c8c8c8;
}
.sasflix .border-gray-primary-300 {
  border-color: #b3b3b4;
}

/* Fill Colors */
.sasflix .fill-text {
  fill: #181921;
}
.sasflix .fill-border {
  fill: #f8fafc;
}
.sasflix .fill-accent-primary {
  fill: #ff6b00;
}
.sasflix .fill-accent-border {
  fill: #ffd3b3;
}
.sasflix .fill-accent-red {
  fill: #ff3b30;
}
.sasflix .fill-red {
  fill: #FF3B30;
}
.sasflix .fill-gray-primary-100 {
  fill: #f5f5f5;
}
.sasflix .fill-gray-primary-200 {
  fill: #c8c8c8;
}
.sasflix .fill-gray-primary-300 {
  fill: #b3b3b4;
}

/* Typography */
.sasflix .text-header {
  font-size: 40px;
  letter-spacing: 0px;
}

.sasflix .text-h1 {
  font-size: 28px;
  letter-spacing: -1.45px;
}

.sasflix .text-body {
  font-size: 20px;
  letter-spacing: -1px;
  line-height: 1;
}

.sasflix .text-caption {
  font-size: 14px;
  letter-spacing: -0.08px;
  line-height: 10px;
}
</style>

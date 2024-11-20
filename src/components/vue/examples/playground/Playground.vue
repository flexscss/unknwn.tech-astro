<template>
  <View
    :background="tokyoNightSettings.background"
    :resize-column-color="tokyoNightSettings.selection"
  >
    <template #block-1>
      <div class="h-full">
        <CodeMirror v-model="htmlCode" language="html" :theme="tokyoNight" @change="handleChange" />
      </div>
    </template>
    <template #block-2>
      <div class="h-full">
        <CodeMirror v-model="javascriptCode" language="javascript" :theme="tokyoNight" @change="handleChange" />
      </div>
    </template>
    <template #block-3>
      <div class="h-full">
        <CodeMirror v-model="cssCode" language="css" :theme="tokyoNight" @change="handleChange" />
      </div>
    </template>
    <template #right-block>
      <div class="flex flex-col h-full">
        <div class="flex-auto">
          <iframe :srcdoc="iframeContent" class="w-full h-full" />
        </div>
        <Console class="max-h-[20%] min-h-[20%] h-full" />
      </div>
    </template>
  </View>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CodeMirror from './CodeMirror.vue'
import Console from './Console.vue'
import vueAppSample from './samples/vueApp.ts'
import { tokyoNight, tokyoNightSettings } from './themes/tokyo-night'
import { generateIframeContent } from './utils/iframeContentManager'
import View from './View.vue'

const htmlCode = ref(vueAppSample.htmlCode)
const cssCode = ref(vueAppSample.cssCode)
const javascriptCode = ref(vueAppSample.jcCode)

const iframeContent = ref('')
let debounceTimeout: ReturnType<typeof setTimeout>

const stylesheets = ref([])
const styles = ref('')
function getStyles() {
  stylesheets.value = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
  styles.value = stylesheets.value.map((sheet: HTMLLinkElement | HTMLStyleElement) => sheet.outerHTML).join('\n')
}

function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
  return function (...args: any[]) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

function updateIframeContent() {
  iframeContent.value = generateIframeContent({
    styles: styles.value,
    cssCode: cssCode.value,
    htmlCode: htmlCode.value,
    javascriptCode: javascriptCode.value
  })
}

const updateIframeContentDebounced = debounce(updateIframeContent, 1000)

function handleChange() {
  updateIframeContentDebounced()
}

onMounted(() => {
  getStyles()
  updateIframeContent()
})
</script>

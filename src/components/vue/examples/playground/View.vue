<template>
  <div class="flex" :style="{ background }">
    <div
      class="flex"
      :style="{ width: `calc(${leftColumnWidth}% - ${RESIZE_COLUMN_WIDTH}px)` }"
    >
      <div class="w-full">
        <template v-for="(height, index) in blockHeights" :key="index">
          <div
            :style="{ height: `calc(${height}% - ${RESIZE_COLUMN_WIDTH}px)` }"
            :class="{ 'pointer-events-none': isResizing }"
          >
            <slot :name="`block-${index + 1}`" />
          </div>
          <div
            v-if="index < blockHeights.length - 1"
            class="cursor-ns-resize w-full bg-black relative
						before:block before:w-full before:h-2 before:absolute
						before:top-[-3px] before:z-10"
            :style="{ background: resizeColumnColor, height: `${RESIZE_COLUMN_WIDTH}px` }"
            @mousedown.stop="(event) => startHeightResize(index, event)"
          />
        </template>
      </div>
    </div>
    <div
      class="cursor-ew-resize bg-black relative
			before:block before:w-full before:h-2 before:absolute
			before:top-[-3px] before:z-10"
      :style="{ background: resizeColumnColor, width: `${RESIZE_COLUMN_WIDTH}px` }"
      @mousedown.stop="startWidthResize"
    />
    <div class="h-full flex-auto" :class="{ 'pointer-events-none': isResizing }">
      <slot name="right-block" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  blockHeights?: number[]
  leftColumnWidth?: number
  background?: string
  resizeColumnColor?: string
}>()

const MIN_BLOCK_HEIGHT = 10
const MIN_COLUMN_WIDTH = 20
const RESIZE_COLUMN_WIDTH = 2

const blockHeights = ref(props.blockHeights || [25, 50, 25])
const leftColumnWidth = ref(props.leftColumnWidth || 50)

const isResizing = ref(false)

type ResizeHandler = (e: MouseEvent) => void

function calculatePercentage(delta: number, total: number): number {
  return (delta / total) * 100
}

function createMouseListeners(onMove: ResizeHandler): { onMouseMove: ResizeHandler, onMouseUp: () => void } {
  const onMouseMove = (e: MouseEvent) => onMove(e)
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    isResizing.value = false
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  isResizing.value = true

  return { onMouseMove, onMouseUp }
}

function startHeightResize(index: number, event: MouseEvent) {
  event.preventDefault()
  const initialY = event.clientY
  const initialHeight = blockHeights.value[index]

  function updateBlockHeights(newHeight: number, nextBlockIndex: number) {
    const totalHeight = 100
    const diff = totalHeight - newHeight - blockHeights.value[nextBlockIndex]
      - (index === 0 ? blockHeights.value[2] : blockHeights.value[0])

    const nextBlockNewHeight = blockHeights.value[nextBlockIndex] + diff

    if (newHeight > MIN_BLOCK_HEIGHT && nextBlockNewHeight > MIN_BLOCK_HEIGHT) {
      blockHeights.value[index] = newHeight
      blockHeights.value[nextBlockIndex] = nextBlockNewHeight
    }
  }

  createMouseListeners((e: MouseEvent) => {
    const deltaY = e.clientY - initialY
    const newHeight = initialHeight + calculatePercentage(deltaY, window.innerHeight)
    updateBlockHeights(newHeight, index + 1)
  })
}

function startWidthResize(event: MouseEvent) {
  event.preventDefault()
  const initialX = event.clientX
  const initialWidth = leftColumnWidth.value

  createMouseListeners((e: MouseEvent) => {
    const deltaX = e.clientX - initialX
    const newWidth = initialWidth + calculatePercentage(deltaX, window.innerWidth)
    leftColumnWidth.value = Math.max(newWidth, MIN_COLUMN_WIDTH)
  })
}
</script>

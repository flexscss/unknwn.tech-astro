<template>
  <div class="text-zinc-200 font-mono text-xs p-2 h-full overflow-auto">
    <div class="text-zinc-400 hover:text-zinc-200 mb-1">
      <span class="cursor-pointer select-none" @click="clearLogs">Clear console</span>
    </div>
    <div v-for="(log, index) in logs" :key="index" class="py-1 border-b border-zinc-800">
      <div class="flex gap-2 items-start">
        <span
          class="w-3 h-3 flex items-center justify-center rounded-full text-[8px]"
          :class="{
            'bg-red-500': log.type === 'error',
            'bg-yellow-500 text-black': log.type === 'warn',
            'bg-blue-500': log.type === 'info',
            'bg-zinc-600': log.type === 'log',
          }"
        >
          {{ getLogIcon(log.type) }}
        </span>

        <div class="flex-1">
          <template v-if="isPrimitive(log.data)">
            <span
              :class="{
                'text-emerald-400': typeof log.data === 'string',
                'text-blue-400': typeof log.data === 'number',
                'text-purple-400': typeof log.data === 'boolean',
                'text-zinc-400': log.data === null || typeof log.data === 'undefined',
              }"
            >{{ formatValue(log.data) }}</span>
          </template>

          <template v-else>
            <div class="cursor-pointer select-none" @click="toggleExpand(index)">
              <span class="mr-1">{{ log.expanded ? '↓' : '→' }}</span>
              <span class="text-blue-400">{{ getPreview(log.data) }}</span>
            </div>
            <div v-if="log.expanded" class="ml-4 mt-1">
              <TreeView :data="log.data" />
            </div>
          </template>

          <div v-if="log.type === 'error' && log.stack" class="mt-2 text-red-400 text-sm ml-4 whitespace-pre-wrap">
            {{ log.stack }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import TreeView from './TreeView.vue'

type LogType = 'log' | 'error' | 'warn' | 'info'

interface LogEntry {
  type: LogType
  data: unknown
  stack?: string
  expanded: boolean
}

interface ConsoleMessage {
  type: string
  message?: unknown
  error?: {
    message: string
    stack?: string
  }
}

const logs = ref<LogEntry[]>([])

function getLogIcon(type: LogType): string {
  const icons: Record<LogType, string> = {
    error: '×',
    warn: '!',
    info: 'i',
    log: '>'
  }
  return icons[type]
}

function serializeValue(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeValue(item))
  }

  const result: any = {}
  for (const key in obj) {
    if (key.startsWith('__v_'))
      continue

    try {
      const value = obj[key]
      result[key] = serializeValue(value)
    }
    catch (e: unknown) {
      result[key] = `[Unable to serialize: ${(e as Error).message}]`
    }
  }
  return result
}

function addLog(type: LogType, data: unknown, stack?: string) {
  const serializedData = serializeValue(data)

  logs.value.push({
    type,
    data: serializedData,
    stack,
    expanded: false
  })
}

function clearLogs() {
  logs.value = []
}

function toggleExpand(index: number) {
  logs.value[index].expanded = !logs.value[index].expanded
}

function isPrimitive(value: unknown): boolean {
  return value === null || ['undefined', 'string', 'number', 'boolean'].includes(typeof value)
}

function formatValue(value: unknown): string {
  if (typeof value === 'string')
    return `"${value}"`
  if (value === null)
    return 'null'
  if (typeof value === 'undefined')
    return 'undefined'
  return String(value)
}

function getPreview(value: unknown): string {
  if (Array.isArray(value))
    return `Array(${value.length})`
  if (value instanceof Error)
    return `${value.name}: ${value.message}`
  if (value !== null && typeof value === 'object')
    return `Object {${Object.keys(value).length}}`
  return String(value)
}

onMounted(() => {
  const handleMessage = (event: MessageEvent) => {
    const { data } = event
    if (typeof data !== 'object' || data === null)
      return

    const message = data as ConsoleMessage
    if (message.type === 'log') {
      addLog('log', message.message)
    }
    else if (message.type === 'error' && message.error) {
      addLog('error', message.error.message, message.error.stack)
    }
  }

  window.addEventListener('message', handleMessage)

  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
  })
})
</script>

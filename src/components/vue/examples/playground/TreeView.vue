<template>
  <div class="font-mono text-xs">
    <template v-if="Array.isArray(data)">
      <div v-for="(item, index) in data" :key="index" class="py-0.5">
        <div class="flex items-baseline">
          <div class="flex items-baseline gap-1 min-w-[16px]">
            <span
              v-if="isExpandable(item)"
              class="cursor-pointer select-none"
              @click="toggleItem(index)"
            >
              {{ expanded[index] ? '↓' : '→' }}
            </span>
          </div>
          <span class="text-zinc-500 mr-1">{{ index }}:</span>
          <template v-if="isExpandable(item)">
            <div>
              <div class="cursor-pointer select-none" @click="toggleItem(index)">
                <span class="text-blue-400">{{ getPreview(item) }}</span>
              </div>
              <div v-if="expanded[index]">
                <TreeView :data="item" />
              </div>
            </div>
          </template>
          <template v-else>
            <span
              :class="{
                'text-emerald-400': typeof item === 'string',
                'text-blue-400': typeof item === 'number',
                'text-purple-400': typeof item === 'boolean',
                'text-zinc-400': item === null || typeof item === 'undefined',
              }"
            >{{ formatValue(item) }}</span>
          </template>
        </div>
      </div>
    </template>

    <template v-else-if="isObject(data)">
      <div v-for="key in Object.keys(data)" :key="key" class="py-0.5">
        <div class="flex items-baseline">
          <div class="flex items-baseline gap-1 min-w-[16px]">
            <span
              v-if="isExpandable(getObjectValue(data, key))"
              class="cursor-pointer select-none"
              @click="toggleItem(key)"
            >
              {{ expanded[key] ? '↓' : '→' }}
            </span>
          </div>
          <span class="text-purple-400 mr-1">{{ key }}:</span>
          <template v-if="isExpandable(getObjectValue(data, key))">
            <div>
              <div class="cursor-pointer select-none" @click="toggleItem(key)">
                <span class="text-blue-400">{{ getPreview(getObjectValue(data, key)) }}</span>
              </div>
              <div v-if="expanded[key]">
                <TreeView :data="getObjectValue(data, key)" />
              </div>
            </div>
          </template>
          <template v-else>
            <span
              :class="{
                'text-emerald-400': typeof getObjectValue(data, key) === 'string',
                'text-blue-400': typeof getObjectValue(data, key) === 'number',
                'text-purple-400': typeof getObjectValue(data, key) === 'boolean',
                'text-zinc-400': getObjectValue(data, key) === null || typeof getObjectValue(data, key) === 'undefined',
              }"
            >{{ formatValue(getObjectValue(data, key)) }}</span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ data: unknown }>()

const expanded = ref<Record<string | number, boolean>>({})

function toggleItem(key: string | number): void {
  expanded.value[key] = !expanded.value[key]
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isExpandable(value: unknown): boolean {
  return value !== null && typeof value === 'object'
}

function getObjectValue(obj: Record<string, unknown>, key: string): unknown {
  return obj[key]
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
  if (isObject(value))
    return `Object {${Object.keys(value).length}}`
  return String(value)
}
</script>

<style scoped>
.tree-view {
  font-family: monospace;
}

.tree-item {
  padding: 0.15rem 0;
}

.tree-line {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.expandable {
  cursor: pointer;
  user-select: none;
  display: flex;
  gap: 0.25rem;
}

.nested {
  margin-left: 1.5rem;
}

.key { color: #ba68c8; }
.index { color: #78909c; }
.string { color: #9ccc65; }
.number { color: #64b5f6; }
.boolean { color: #ba68c8; }
.null { color: #78909c; }
</style>

<template>
  <div ref="editorRef" class="code-mirror-wrapper" />
</template>

<script setup lang="ts">
import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import type { Extension } from '@codemirror/state'
import { autocompletion } from '@codemirror/autocomplete'
import { indentWithTab } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { defineProps, onBeforeUnmount, onMounted, ref, watch, withDefaults } from 'vue'
import autocompleteOptionsJavascript from './autocomplete/javascript.ts'
import { tokyoNight } from './themes/tokyo-night'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: string
  readOnly?: boolean
  theme?: Extension
}>(), {
  language: 'javascript',
  readOnly: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const theme = props.theme || tokyoNight

const editorRef = ref<HTMLElement | null>(null)
let view: EditorView | null = null

function customCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from === word.to && !context.explicit))
    return null

  return {
    from: word.from,
    options: [...autocompleteOptionsJavascript]
  }
}

function createEditor(): EditorView | null {
  if (!editorRef.value)
    return null

  const languageExtension
    = props.language === 'html'
      ? html()
      : props.language === 'css'
        ? css()
        : javascript()

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      languageExtension,
      theme,
      autocompletion({ override: [customCompletions] }),
      keymap.of([indentWithTab]),
      EditorView.editable.of(!props.readOnly),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const value = update.state.doc.toString()
          emit('update:modelValue', value)
          emit('change', value)
        }
      })
    ]
  })

  return new EditorView({ state, parent: editorRef.value })
}

onMounted(() => {
  try {
    const editor = createEditor()
    if (editor)
      view = editor
  }
  catch (error) {
    console.error('Failed to initialize CodeMirror:', error)
  }
})

watch(() => props.modelValue, (newValue) => {
  if (view && newValue !== view.state.doc.toString()) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newValue }
    })
  }
})

onBeforeUnmount(() => {
  if (view) {
    view.destroy()
    view = null
  }
})
</script>

<style>
.code-mirror-wrapper {
  height: 100%;
  width: 100%;
}

.cm-editor {
  height: 100%;
  width: 100%;
}

.cm-scroller {
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cm-scroller::-webkit-scrollbar {
  display: none;
}
</style>

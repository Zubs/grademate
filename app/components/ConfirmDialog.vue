<template>
  <dialog
    ref="dialog"
    class="panel m-auto w-full max-w-md bg-surface p-6 text-ink backdrop:bg-black/60"
    :aria-labelledby="titleId"
    @close="settle(false)"
  >
    <h2 :id="titleId" class="heading-6">{{ title }}</h2>
    <p class="body-6 mt-2 text-ink-soft">{{ message }}</p>
    <div class="mt-6 flex flex-wrap justify-end gap-2">
      <button type="button" class="button button-secondary" autofocus @click="dialog?.close()">
        Cancel
      </button>
      <button type="button" class="button button-danger" @click="confirm">
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmLabel: string
}>()

const titleId = useId()
const dialog = ref<HTMLDialogElement | null>(null)
let resolveAnswer: ((confirmed: boolean) => void) | null = null

function settle(confirmed: boolean) {
  resolveAnswer?.(confirmed)
  resolveAnswer = null
}

function confirm() {
  settle(true)
  dialog.value?.close()
}

function ask() {
  dialog.value?.showModal()
  return new Promise<boolean>((resolve) => {
    resolveAnswer = resolve
  })
}

defineExpose({ ask })
</script>

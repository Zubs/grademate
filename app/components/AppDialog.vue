<template>
  <dialog
    ref="dialog"
    class="panel m-auto w-full max-w-md bg-surface p-6 text-ink backdrop:bg-black/60"
    :aria-labelledby="titleId"
    @close="emit('close')"
  >
    <h2 :id="titleId" class="heading-6">{{ title }}</h2>
    <p class="body-6 mt-2 text-ink-soft">{{ description }}</p>
    <div class="mt-4">
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean, title: string, description: string }>()
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const dialog = ref<HTMLDialogElement | null>(null)

watch(() => props.open, (open) => {
  if (open) {
    dialog.value?.showModal()
  } else {
    dialog.value?.close()
  }
})
</script>

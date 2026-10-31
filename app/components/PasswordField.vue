<template>
  <div class="flex flex-col gap-2">
    <label class="field-label" for="password">Password</label>
    <div class="relative">
      <input
        id="password"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        class="field pr-12"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :minlength="minlength"
        :disabled="disabled"
        required
      >
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center rounded-lg px-3 text-ink-soft hover:text-ink"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        @click="visible = !visible"
      >
        <PhEyeSlash v-if="visible" :size="16" aria-hidden="true" />
        <PhEye v-else :size="16" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'

defineProps<{
  autocomplete: string
  placeholder?: string
  minlength?: number
  disabled?: boolean
}>()

const model = defineModel<string>({ required: true })
const visible = ref(false)
</script>

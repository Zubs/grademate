<template>
  <a
    href="#main-content"
    class="button button-primary fixed top-2 left-2 z-[60] -translate-y-24 focus:translate-y-0"
    @click.prevent="moveFocus"
  >
    Skip to content
  </a>
</template>

<script setup lang="ts">
function moveFocus() {
  document.getElementById('main-content')?.focus()
}
</script>

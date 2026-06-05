<template>
  <TheFrame />
  <NuxtPage />
</template>

<script setup lang="ts">
useHead({ titleTemplate: (title) => title ? `${title} — Youri Zermatten` : 'Youri Zermatten' })
</script>

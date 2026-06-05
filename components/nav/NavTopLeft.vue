<template>
  <NuxtLink
    :href="isContact ? '/' : '/contact'"
    class="top-left top-left-y is-clickable type-h1"
    :class="{ 'is-contact': isContact }"
    data-top-left
  >
    <span class="top-left__y">y</span>
    <Transition name="top-left-rest">
      <span v-if="isContact" class="top-left__rest">ouri <span class="top-left__zermatten">zermatten</span></span>
    </Transition>
  </NuxtLink>
</template>

<script setup lang="ts">
const { state } = useFrameState()
const isContact = computed(() => state.value.topLeftMode === 'contact')
</script>

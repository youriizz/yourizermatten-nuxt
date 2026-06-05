<template>
  <div class="frame" data-frame>
    <div
      class="frame__part frame__topLeft"
      data-frame-part="topLeft"
      :class="state.topLeftMode === 'hidden' ? 'is-invisible' : 'is-visible'"
    >
      <NavTopLeft />
    </div>
    <div
      class="frame__part frame__bottomRight"
      data-frame-part="bottomRight"
      :class="state.showBottomRight ? 'is-visible' : 'is-invisible'"
    >
      <NavBottomRight />
    </div>
  </div>
</template>

<script setup lang="ts">
const { state } = useFrameState()
</script>

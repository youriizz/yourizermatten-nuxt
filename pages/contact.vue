<template>
  <main class="page page-contact" data-page-type="contact" @click="onPageClick">
    <div class="contact-text-block" :class="{ 'is-visible': blockVisible }">
      <p class="contact-bio type-p1">{{ contact?.bio }}</p>
      <div class="contact-links type-p2">
        <a v-if="contact?.instagram?.url" class="is-clickable" :href="contact.instagram.url" target="_blank" rel="noopener">
          {{ contact.instagram.label }}
        </a>
        <a v-if="contact?.arena?.url" class="is-clickable" :href="contact.arena.url" target="_blank" rel="noopener">
          {{ contact.arena.label }}
        </a>
        <a v-if="contact?.email?.url" class="is-clickable" :href="contact.email.url">
          {{ contact.email.label }}
        </a>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({ title: 'Contact' })

const { data: contact } = await useAsyncData('contact', () =>
  queryContent('contact').findOne()
)

const blockVisible = ref(false)
const router = useRouter()

onMounted(() => {
  blockVisible.value = true
})

function onPageClick(e: MouseEvent) {
  const target = e.target as Element
  if (target.closest('.contact-text-block')) return
  router.push('/')
}
</script>

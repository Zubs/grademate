<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public
const route = useRoute()
const title = 'GradeMate: track your GPA and plan your target'
const description = 'Track every grade, see your GPA and CGPA, and find out the results you need to reach your target. Free for university students on 4.0, 5.0, and UK scales.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogSiteName: 'GradeMate',
  ogUrl: () => `${siteUrl}${route.path}`,
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
})
</script>

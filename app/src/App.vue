<template>
<main>
  <router-view v-slot="{ Component }">
    <suspense>
      <component :is="Component" />

      <template #fallback>
        Loading...
      </template>
    </suspense>
  </router-view>
</main>
</template>
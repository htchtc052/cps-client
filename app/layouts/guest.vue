<template>
  <main class="flex min-h-screen items-center justify-center bg-muted p-6">
    <div class="w-full max-w-sm space-y-6">
      <p class="text-center text-xl font-bold text-highlighted">
        CuratedPhotoSpace
      </p>

      <UCard>
        <slot />
      </UCard>
    </div>
  </main>
</template>

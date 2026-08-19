<script setup lang="ts">
definePageMeta({ layout: 'public' })
useHead({ title: 'Privacy Policy' })
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <h1 class="text-xl font-semibold">
      Privacy Policy
    </h1>

    <div class="space-y-4 text-sm leading-6 text-muted">
      <p>
        CuratedPhoto is a demo project. This page describes what it stores and
        what happens to it.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        What we store
      </h2>

      <p>
        Your account name, email address and password hash. The photographs you
        upload, together with the previews generated from them. Server logs
        containing IP addresses and request times, kept for operating the
        service.
      </p>

      <p>
        Photographs carry embedded metadata — EXIF — written by the camera. It
        commonly includes the capture time, the camera model and, when the
        camera recorded it, the location of the shot. We keep the original file
        unchanged, so this metadata is preserved as-is.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Who can see it
      </h2>

      <p>
        Your photographs are private by default. A photo becomes reachable to
        anyone holding its link only after you enable sharing for it, and the
        original file served through that link still carries its metadata.
        Disable sharing to revoke the link.
      </p>

      <p>
        The project owner can access stored data for moderation and support. We
        do not sell data and we do not use it for advertising.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Cookies
      </h2>

      <p>
        A session cookie keeps you signed in. There is no analytics or
        advertising tracking.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Deleting your data
      </h2>

      <p>
        Deleted photos go to the trash and are removed permanently when you
        empty it. To delete your account and everything in it,
        <NuxtLink
          to="/contact"
          class="underline"
        >contact the project owner</NuxtLink>.
      </p>

      <p class="pt-2">
        See also our <NuxtLink
          to="/terms"
          class="underline"
        >Terms of Use</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
useHead({ title: 'Terms of Use' })
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <h1 class="text-xl font-semibold">
      Terms of Use
    </h1>

    <div class="space-y-4 text-sm leading-6 text-muted">
      <p>
        CuratedPhoto is a demo project for uploading, curating and sharing
        photographs. It is offered as-is, with no availability or storage
        guarantees, and it may change or shut down without notice.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Your content
      </h2>

      <p>
        You keep ownership of everything you upload. You are responsible for it,
        and you confirm you have the right to upload and share it.
      </p>

      <p>
        Do not upload content that is illegal, infringes someone else's
        copyright, depicts sexual exploitation, harasses or endangers a person,
        or contains malware.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Public links
      </h2>

      <p>
        A photo becomes reachable to anyone with its link only after you enable
        sharing for it. Anyone holding that link can view the photo and download
        the original file, including its embedded metadata. Turning sharing off
        revokes the link, but it cannot recall copies already downloaded.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Moderation
      </h2>

      <p>
        We may remove content, disable public links, block accounts or close
        registration at any time — in particular when we suspect abuse or legal
        risk. We may do this without prior notice.
      </p>

      <h2 class="pt-2 font-medium text-highlighted">
        Liability
      </h2>

      <p>
        To the extent permitted by law, we are not liable for any loss arising
        from use of this service, including loss of uploaded files.
      </p>

      <p>
        To report content that breaks these rules, please
        <NuxtLink
          to="/contact"
          class="underline"
        >contact the project owner</NuxtLink>.
      </p>

      <p class="pt-2">
        See also our <NuxtLink
          to="/privacy"
          class="underline"
        >Privacy Policy</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { createI18nContext, setI18nContext } from '$lib/i18n';

  let { children } = $props();

  const i18n = createI18nContext();
  setI18nContext(i18n);

  onMount(() => {
    void i18n.refineFromGeo();
  });
</script>

<svelte:head>
  <title>{i18n.t.meta.title}</title>
  <meta name="description" content={i18n.t.meta.description} />
</svelte:head>

{@render children()}

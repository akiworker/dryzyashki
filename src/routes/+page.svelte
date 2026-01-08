<script lang="ts">
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Marquee from '$lib/components/Marquee.svelte';
  import Features from '$lib/components/Features.svelte';
  import FishModel from '$lib/components/FishModel.svelte';
  import Team from '$lib/components/Team.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Background from '$lib/components/Background.svelte';
</script>

<LoadingScreen />
<Background />

<div class="page">
  <Header />
  <main>
    <Hero />
    <Marquee />
    <Features />
    <FishModel />
    <Team />
  </main>
  <Footer />
</div>

<style>
  .page { position: relative; z-index: 1; }
</style>

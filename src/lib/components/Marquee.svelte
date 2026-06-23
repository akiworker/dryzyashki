<script lang="ts">
  import { onMount, tick } from 'svelte';

  const games = [
    'CS2',
    'Valorant',
    'Minecraft',
    'GTA V',
    'Dota 2',
    'Rust',
    'Fortnite',
    'Apex',
    'PUBG',
    'Overwatch',
    'Roblox',
    'GAYSEX'
  ];

  let marqueeEl: HTMLDivElement;
  let trackEl: HTMLDivElement;
  let rowEl: HTMLDivElement;

  let copyCount = $state(4);
  let offset = 0;
  let segmentWidth = 0;
  let rafId = 0;
  let lastTime = 0;
  let running = false;

  const SPEED = 80; // px / second

  function normalizeOffset() {
    if (segmentWidth <= 0) return;
    while (offset <= -segmentWidth) offset += segmentWidth;
    while (offset > 0) offset -= segmentWidth;
  }

  async function updateLayout() {
    if (!marqueeEl || !rowEl) return;

    const containerWidth = marqueeEl.clientWidth;
    const width = rowEl.offsetWidth;

    if (width <= 0 || containerWidth <= 0) return;

    const nextCount = Math.max(2, Math.ceil(containerWidth / width) + 1);

    if (nextCount !== copyCount) {
      copyCount = nextCount;
      await tick();
    }

    if (!rowEl) return;

    segmentWidth = rowEl.offsetWidth;
    normalizeOffset();
  }

  function loop(time: number) {
    if (!lastTime) lastTime = time;
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (segmentWidth > 0 && trackEl) {
      offset -= SPEED * delta;
      normalizeOffset();
      trackEl.style.transform = `translate3d(${offset}px, 0, 0)`;
    }

    rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (running || segmentWidth <= 0) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(loop);
  }

  onMount(() => {
    const init = async () => {
      await updateLayout();
      startLoop();
    };

    const ro = new ResizeObserver(() => {
      void updateLayout();
    });

    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    fontsReady.then(() => {
      requestAnimationFrame(() => {
        void init();
        if (marqueeEl) ro.observe(marqueeEl);
        if (rowEl) ro.observe(rowEl);
      });
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      running = false;
    };
  });
</script>

{#snippet rowContent()}
  {#each games as game}
    <span class="item">{game}</span>
    <span class="separator">•</span>
  {/each}
{/snippet}

<div class="marquee" bind:this={marqueeEl}>
  <div class="track" bind:this={trackEl}>
    {#each Array(copyCount) as _, index (index)}
      {#if index === 0}
        <div class="row" bind:this={rowEl}>
          {@render rowContent()}
        </div>
      {:else}
        <div class="row" aria-hidden="true">
          {@render rowContent()}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .marquee {
    overflow: hidden;
    padding: 20px 0;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-left: none;
    border-right: none;
    backdrop-filter: blur(20px);
    margin: 60px 0;
  }

  .track {
    display: flex;
    width: max-content;
    will-change: transform;
    backface-visibility: hidden;
  }

  .row {
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .item {
    font-size: 0.9rem;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
    padding: 0 24px;
  }

  .separator {
    color: var(--text-3);
    opacity: 0.3;
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

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

  let trackEl: HTMLDivElement;
  let rowEl: HTMLDivElement;

  let offset = 0;
  let width = 0;
  let rafId = 0;
  let lastTime = 0;

  const SPEED = 80; // px / second (подкрути под вкус)

  function measure() {
    if (!rowEl) return;
    width = rowEl.getBoundingClientRect().width;
  }

  function loop(time: number) {
    if (!lastTime) lastTime = time;
    const delta = (time - lastTime) / 1000; // секунды
    lastTime = time;

    offset -= SPEED * delta;

    // modulo — никогда не уходим в пустоту
    if (width > 0) {
      offset = offset % width;
    }

    trackEl.style.transform = `translate3d(${offset}px, 0, 0)`;
    rafId = requestAnimationFrame(loop);
  }

  onMount(() => {
    // первичное измерение
    measure();

    // следим за изменением размеров (шрифты, resize)
    const ro = new ResizeObserver(() => {
      measure();
      offset = offset % (width || 1);
    });
    ro.observe(rowEl);

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="marquee">
  <div class="track" bind:this={trackEl}>
    <!-- первая копия -->
    <div class="row" bind:this={rowEl}>
      {#each games as game}
        <span class="item">{game}</span>
        <span class="separator">•</span>
      {/each}
    </div>

    <!-- вторая копия -->
    <div class="row" aria-hidden="true">
      {#each games as game}
        <span class="item">{game}</span>
        <span class="separator">•</span>
      {/each}
    </div>
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

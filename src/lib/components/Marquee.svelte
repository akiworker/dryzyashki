<script lang="ts">
  const games = ['CS2', 'Valorant', 'Minecraft', 'GTA V', 'Dota 2', 'Rust', 'Fortnite', 'Apex', 'PUBG', 'Overwatch', 'Roblox', 'GAYSEX'];
</script>

<div class="marquee">
  <div class="track">
    {#each games as game}
      <span class="item">{game}</span>
      <span class="separator">•</span>
    {/each}
  </div>
  <div class="track" aria-hidden="true">
    {#each games as game}
      <span class="item">{game}</span>
      <span class="separator">•</span>
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
    -webkit-backdrop-filter: blur(20px);
    margin: 60px 0;
    display: flex;
  }
  
  .track {
    display: flex;
    align-items: center;
    white-space: nowrap;
    animation: scroll 30s linear infinite;
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
  
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  
  .marquee:hover .track {
    animation-play-state: paused;
  }
</style>

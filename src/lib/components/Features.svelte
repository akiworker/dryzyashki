<script lang="ts">
  import { onMount } from 'svelte';
  
  const items = [
    { title: 'Общение', desc: 'Обсуждай что угодно — от игр до философии' },
    { title: 'Друзья', desc: 'Находи людей по интересам' },
    { title: 'Игры', desc: 'Собирай команду и играй вместе' }
  ];
  
  let visible = $state(false);
  let el: HTMLElement;
  
  onMount(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) visible = true; }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<section id="features" bind:this={el}>
  <div class="container">
    <h2 class:visible>Что внутри</h2>
    
    <div class="cards" class:visible>
      {#each items as item, i}
        <div class="card" style="--i: {i}">
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  section { padding: 100px 0; }
  
  h2 {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 48px;
    opacity: 0;
    transition: opacity 0.6s;
  }
  h2.visible { opacity: 1; }
  
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .cards.visible .card {
    opacity: 1;
    transform: none;
  }
  
  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 32px 28px;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i) * 0.1s);
  }
  
  .card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    transform: translateY(-4px);
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }
  
  .card p {
    color: var(--text-2);
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  @media (max-width: 800px) {
    .cards { grid-template-columns: 1fr; gap: 12px; }
    .card { padding: 24px 20px; }
  }
</style>

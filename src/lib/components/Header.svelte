<script lang="ts">
  let scrolled = $state(false);
  
  $effect(() => {
    const fn = () => { scrolled = window.scrollY > 20; };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  });
</script>

<header class:scrolled>
  <div class="container">
    <div class="inner" class:scrolled>
      <a href="/" class="logo">
        <img src="/favicon.webp" alt="" />
        dryzyashki
      </a>
      <nav>
        <a href="#features">Возможности</a>
        <a href="#team">Команда</a>
        <a href="https://discord.gg/CP9ajwY3Ww" target="_blank" rel="noopener" class="cta">Discord</a>
      </nav>
    </div>
  </div>
</header>

<style>
  header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 100;
    padding: 12px 0;
  }
  
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    border-radius: 100px;
    transition: all 0.3s;
  }
  
  .inner.scrolled {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 10px 20px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 1.1rem;
    letter-spacing: -0.01em;
  }
  .logo img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
  nav { display: flex; align-items: center; gap: 32px; }
  nav a { 
    color: var(--text-2); 
    font-size: 0.9rem; 
    transition: color 0.2s;
  }
  nav a:hover { color: var(--text); }
  .cta { color: #2997ff !important; }
  .cta:hover { text-decoration: underline; }
  @media (max-width: 600px) {
    nav a:not(.cta) { display: none; }
    nav { gap: 0; }
  }
</style>

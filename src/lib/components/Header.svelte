<script lang="ts">
  import { useI18n } from '$lib/i18n';

  const i18n = useI18n();
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
        <a href="#features">{i18n.t.header.features}</a>
        <a href="#team">{i18n.t.header.team}</a>
        <div class="lang-switch" role="group" aria-label="Language">
          <button
            type="button"
            class:active={i18n.locale === 'ru'}
            onclick={() => i18n.setLocale('ru')}
          >{i18n.t.header.langRu}</button>
          <button
            type="button"
            class:active={i18n.locale === 'en'}
            onclick={() => i18n.setLocale('en')}
          >{i18n.t.header.langEn}</button>
        </div>
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
  nav { display: flex; align-items: center; gap: 20px; }
  nav a { 
    color: var(--text-2); 
    font-size: 0.9rem; 
    transition: color 0.2s;
  }
  nav a:hover { color: var(--text); }
  .cta { color: #2997ff !important; }
  .cta:hover { text-decoration: underline; }

  .lang-switch {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px;
    border-radius: 999px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .lang-switch button {
    min-width: 34px;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-2);
    transition: all 0.2s;
  }

  .lang-switch button.active {
    background: rgba(255,255,255,0.12);
    color: var(--text);
  }

  .lang-switch button:hover:not(.active) {
    color: var(--text);
  }

  @media (max-width: 600px) {
    nav a:not(.cta) { display: none; }
    nav { gap: 12px; }
  }
</style>

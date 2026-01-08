<footer>
  <div class="container">
    <div class="top">
      <div class="brand">
        <div class="logo">
          <img src="/favicon.webp" alt="" />
          <span>dryzyashki</span>
        </div>
        <p class="tagline">Discord сообщество для игр и общения</p>
      </div>
      
      <div class="links">
        <div class="col">
          <h4>Навигация</h4>
          <a href="#features">Возможности</a>
          <a href="#team">Команда</a>
        </div>
        <div class="col">
          <h4>Ссылки</h4>
          <a href="https://discord.gg/CP9ajwY3Ww" target="_blank" rel="noopener">Discord</a>
        </div>
      </div>
    </div>
    <div class="bottom">
      <span>© 2025 dryzyashki</span>
      <span class="made-by">made by <a href="https://github.com/denys-shatin" target="_blank" rel="noopener">shatin</a></span>
    </div>
  </div>
</footer>

<style>
  footer {
    padding: 60px 0 24px;
    border-top: 1px solid var(--border);
    margin-top: 40px;
  }
  
  .top {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 48px;
  }
  
  .brand {
    max-width: 280px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .logo img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  
  .logo span {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  
  .tagline {
    font-size: 0.85rem;
    color: var(--text-2);
    line-height: 1.5;
  }
  
  .links {
    display: flex;
    gap: 80px;
  }
  
  .col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  h4 {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }
  
  .col a {
    font-size: 0.85rem;
    color: var(--text-2);
    transition: color 0.2s;
  }
  .col a:hover { color: var(--text); }
  
  .bottom {
    padding-top: 24px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .bottom span {
    font-size: 0.75rem;
    color: var(--text-3);
  }
  
  .made-by a {
    color: #2997ff;
    transition: opacity 0.2s;
  }
  .made-by a:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 600px) {
    .top { flex-direction: column; }
    .links { gap: 48px; }
  }
</style>

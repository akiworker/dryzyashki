<script lang="ts">
  import { onMount } from 'svelte';
  
  const team = [
    { name: 'Kup11d0n', role: 'Создатель', avatar: '/Ludi/Owner/avatar1.webp', sub: '' },
    { name: 'Zeat', role: 'Админ', avatar: '/Ludi/Admin/avatar1.webp', sub: '' },
    { name: 'Whyheavens', role: 'Админ', avatar: '/Ludi/Admin/avatar2.webp', sub: 'лох' },
    { name: 'M1psek', role: 'Модератор', avatar: '/Ludi/Moder/avatar1.webp', sub: '' },
    { name: 'F1sher', role: 'Хелпер', avatar: '/Ludi/Helper/avatar1.webp', sub: '' },
    { name: 'Zarek', role: 'Хелпер', avatar: '/Ludi/Helper/avatar2.webp', sub: '' },
    { name: 'MishaLeps', role: 'Хелпер', avatar: '/Ludi/Helper/avatar3.webp', sub: '' }
  ];
  
  let visible = $state(false);
  let el: HTMLElement;
  let selectedMember = $state<typeof team[0] | null>(null);
  let closing = $state(false);
  let tomatoes = $state<{id: number, x: number, y: number}[]>([]);
  let splatters = $state<{id: number, x: number, y: number}[]>([]);
  let tomatoId = 0;
  let throwCount = $state(0);
  let showBSOD = $state(false);
  let bsodPercent = $state(0);
  let bsodClosing = $state(false);
  
  function openModal(member: typeof team[0]) {
    selectedMember = member;
    closing = false;
    tomatoes = [];
    splatters = [];
    throwCount = 0;
  }
  
  function closeModal() {
    closing = true;
    setTimeout(() => {
      selectedMember = null;
      closing = false;
      tomatoes = [];
      splatters = [];
      throwCount = 0;
    }, 200);
  }
  
  function throwTomato() {
    const id = tomatoId++;
    throwCount++;
    
    // BSOD Easter egg
    if (throwCount >= 15) {
      showBSOD = true;
      bsodPercent = 0;
      bsodClosing = false;
      
      // Animate percent
      const interval = setInterval(() => {
        bsodPercent += Math.floor(Math.random() * 15) + 5;
        if (bsodPercent >= 100) {
          bsodPercent = 100;
          clearInterval(interval);
        }
      }, 400);
      
      setTimeout(() => {
        bsodClosing = true;
        clearInterval(interval);
        
        setTimeout(() => {
          showBSOD = false;
          bsodClosing = false;
          throwCount = 0;
          bsodPercent = 0;
        }, 500);
      }, 4000);
      return;
    }
    
    // Random position for splatter
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    
    tomatoes = [...tomatoes, { id, x, y }];
    
    setTimeout(() => {
      // Play squash sound
      const audio = new Audio('/tomato-squash.mp3');
      audio.volume = 0.5;
      audio.play();
      
      splatters = [...splatters, { id, x, y }];
      tomatoes = tomatoes.filter(t => t.id !== id);
      
      // Remove splatter after fade
      setTimeout(() => {
        splatters = splatters.filter(s => s.id !== id);
      }, 800);
    }, 350);
  }
  
  onMount(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) visible = true; }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<section id="team" bind:this={el}>
  <div class="container">
    <h2 class:visible>Команда</h2>
    <p class="subtitle" class:visible>Люди, которые делают сервер лучше <span class="hint">(тыкни на аватарку)</span></p>
    
    <div class="grid" class:visible>
      {#each team as member, i}
        <button 
          class="member" 
          style="--i: {i}"
          onclick={() => openModal(member)}
        >
          <img src={member.avatar} alt={member.name} />
          <span class="name">{member.name}</span>
          <span class="role">{member.role}</span>
          {#if member.sub}
            <span class="sub">{member.sub}</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</section>

{#if selectedMember}
  <div 
    class="modal-overlay" 
    class:closing 
    onclick={closeModal}
    onkeydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div 
      class="modal" 
      class:closing 
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
    >
      <button class="close" onclick={closeModal} aria-label="Закрыть">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      
      <div class="avatar-container">
        <img 
          src={selectedMember.avatar} 
          alt={selectedMember.name} 
          class="avatar"
          class:dirty={splatters.length > 0}
        />
        
        {#each splatters as splat (splat.id)}
          <div class="splat" style="left: {splat.x}%; top: {splat.y}%"></div>
        {/each}
        
        {#each tomatoes as tomato (tomato.id)}
          <div class="tomato" style="--tx: {tomato.x}%; --ty: {tomato.y}%"></div>
        {/each}
      </div>
      
      <h3>{selectedMember.name}</h3>
      <span class="role-label">{selectedMember.role}</span>
      
      <button class="action-btn" onclick={throwTomato}>
        Кинуть помидор
      </button>
    </div>
  </div>
{/if}

{#if showBSOD}
  <div class="bsod" class:closing={bsodClosing}>
    <div class="bsod-content">
      <div class="bsod-sad">:(</div>
      <h1>Your PC ran into a problem and needs to restart.</h1>
      <p>We're just collecting some error info, and then we'll restart for you.</p>
      <div class="bsod-progress">
        <span class="percent">{bsodPercent}%</span> complete
      </div>
      <div class="bsod-qr">
        <img src="/qr-code.png" alt="QR" class="qr-img" />
        <div class="bsod-info">
          <p>For more information about this issue and possible fixes, visit</p>
          <p class="bsod-url">https://drz.world/pomidor</p>
          <p class="bsod-code">Stop code: TOMATO_OVERFLOW_XAXAEBATTILOX</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  section { padding: 120px 0; }
  
  h2 {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    opacity: 0;
    transition: opacity 0.6s;
  }
  h2.visible { opacity: 1; }
  
  .subtitle {
    color: var(--text-2);
    font-size: 1.1rem;
    margin-bottom: 56px;
    opacity: 0;
    transition: opacity 0.6s 0.1s;
  }
  .subtitle.visible { opacity: 1; }
  
  .hint {
    font-size: 0.85rem;
    opacity: 0.5;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .grid.visible .member {
    opacity: 1;
    transform: none;
  }
  
  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    padding: 24px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    color: inherit;
  }
  
  .member:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }
  
  .member img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 12px;
    transition: transform 0.3s;
  }
  
  .member:hover img {
    transform: scale(1.05);
  }
  
  .name {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 2px;
  }
  
  .role {
    font-size: 0.85rem;
    color: var(--text-2);
  }
  
  .sub {
    font-size: 0.7rem;
    color: var(--text-3);
    margin-top: 2px;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: overlayIn 0.25s ease;
  }
  
  .modal-overlay.closing {
    animation: overlayOut 0.2s ease forwards;
  }
  
  @keyframes overlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes overlayOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .modal {
    text-align: center;
    position: relative;
    animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 320px;
    width: 90%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 24px;
    padding: 32px 24px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  
  .modal.closing {
    animation: modalOut 0.2s ease forwards;
  }
  
  @keyframes modalIn {
    from { 
      opacity: 0; 
      transform: scale(0.9) translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  @keyframes modalOut {
    from { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
    to { 
      opacity: 0; 
      transform: scale(0.95) translateY(10px); 
    }
  }
  
  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255,255,255,0.1);
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .close:hover { 
    background: rgba(255,255,255,0.25);
    transform: scale(1.05);
  }
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    width: 160px;
    height: 160px;
  }
  
  .avatar {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
    transition: filter 0.3s;
  }
  
  .avatar.dirty {
    filter: brightness(0.85);
  }
  
  .modal h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }
  
  .role-label {
    color: var(--text-2);
    font-size: 0.95rem;
    display: block;
    margin-bottom: 28px;
  }
  
  .action-btn {
    padding: 14px 28px;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 980px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }
  .action-btn:hover { 
    transform: scale(1.03);
    background: rgba(255,255,255,0.9);
  }
  .action-btn:active {
    transform: scale(0.97);
  }
  
  /* Tomato */
  .tomato {
    position: absolute;
    left: var(--tx);
    top: var(--ty);
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
    background: radial-gradient(circle at 35% 35%, #ff6b6b, #dc2626 60%, #991b1b);
    border-radius: 50%;
    box-shadow: inset -3px -3px 8px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.3);
    animation: fly 0.35s cubic-bezier(0.2, 0, 0.3, 1) forwards;
    pointer-events: none;
    z-index: 10;
  }
  
  .tomato::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 2px;
  }
  
  @keyframes fly {
    0% {
      transform: translateY(120px) scale(0.3);
      opacity: 1;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 0;
    }
  }
  
  /* Splat */
  .splat {
    position: absolute;
    width: 45px;
    height: 45px;
    background: radial-gradient(ellipse at center, #dc2626 0%, #b91c1c 40%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: splatAnim 0.8s ease-out forwards;
    pointer-events: none;
  }
  
  @keyframes splatAnim {
    0% { 
      transform: translate(-50%, -50%) scale(0); 
      opacity: 1; 
    }
    20% { 
      transform: translate(-50%, -50%) scale(1.2); 
      opacity: 0.9; 
    }
    100% { 
      transform: translate(-50%, -50%) scale(1.5); 
      opacity: 0; 
    }
  }
  
  /* BSOD */
  .bsod {
    position: fixed;
    inset: 0;
    background: #0078d7;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    animation: bsodSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Segoe UI', sans-serif;
    color: #fff;
  }
  
  @keyframes bsodSlide {
    from { 
      transform: translateY(-100%);
    }
    to { 
      transform: translateY(0);
    }
  }
  
  .bsod.closing {
    animation: bsodOut 0.5s ease forwards;
  }
  
  @keyframes bsodOut {
    from { 
      transform: translateY(0);
    }
    to { 
      transform: translateY(-100%);
    }
  }
  
  .bsod-content {
    max-width: 900px;
  }
  
  .bsod-sad {
    font-size: 8rem;
    font-weight: 200;
    margin-bottom: 20px;
    line-height: 1;
  }
  
  .bsod h1 {
    font-size: 1.8rem;
    font-weight: 300;
    margin-bottom: 16px;
  }
  
  .bsod p {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.6;
  }
  
  .bsod-progress {
    margin: 30px 0;
    font-size: 0.95rem;
  }
  
  .percent {
    font-weight: 400;
  }
  
  .bsod-qr {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-top: 40px;
  }
  
  .qr-img {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }
  
  .bsod-info {
    font-size: 0.75rem;
  }
  
  .bsod-info p {
    font-size: 0.75rem;
    margin-bottom: 4px;
  }
  
  .bsod-url {
    word-break: break-all;
  }
  
  .bsod-code {
    margin-top: 12px !important;
  }
</style>

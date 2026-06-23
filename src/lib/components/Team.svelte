<script lang="ts">
  import { onMount } from 'svelte';
  import { useI18n } from '$lib/i18n';
  
  const i18n = useI18n();

  const team = [
    { name: 'Kup11d0n', roleKey: 'creator' as const, avatar: '/Ludi/Owner/avatar1.webp', subKey: null },
    { name: 'Zeat', roleKey: 'admin' as const, avatar: '/Ludi/Admin/avatar1.webp', subKey: null },
    { name: 'Whyheavens', roleKey: 'admin' as const, avatar: '/Ludi/Admin/avatar2.webp', subKey: 'loh' as const }
  ];
  
  const BSOD_THROW_THRESHOLD = 45;

  let visible = $state(false);
  let el: HTMLElement;
  let selectedMember = $state<typeof team[0] | null>(null);
  let closing = $state(false);
  let throws = $state<{ id: number; x: number; y: number }[]>([]);
  let nextThrowId = 0;
  let throwCount = $state(0);
  let showBSOD = $state(false);
  let bsodPercent = $state(0);
  let bsodClosing = $state(false);
  
  function openModal(member: typeof team[0]) {
    selectedMember = member;
    closing = false;
    throws = [];
    throwCount = 0;
  }
  
  function closeModal() {
    closing = true;
    setTimeout(() => {
      selectedMember = null;
      closing = false;
      throws = [];
      throwCount = 0;
    }, 200);
  }

  function removeThrow(id: number) {
    throws = throws.filter((t) => t.id !== id);
  }

  function autoPlay(node: HTMLVideoElement, id: number) {
    node.play().catch(() => removeThrow(id));
    return {
      destroy() {
        node.pause();
      }
    };
  }
  
  function randomThrowOffset() {
    const spread = 80;
    const baseY = 55;
    return {
      x: Math.round((Math.random() - 0.5) * spread * 2),
      y: Math.round((Math.random() - 0.5) * spread * 2) + baseY
    };
  }

  function throwTomato() {
    throwCount++;
    
    // BSOD Easter egg
    if (throwCount >= BSOD_THROW_THRESHOLD) {
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

    throws = [...throws, { id: nextThrowId++, ...randomThrowOffset() }];
  }
  
  onMount(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) visible = true; }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<svelte:window onkeydown={(e) => selectedMember && e.key === 'Escape' && closeModal()} />

<section id="team" bind:this={el}>
  <div class="container">
    <h2 class:visible>{i18n.t.team.title}</h2>
    <p class="subtitle" class:visible>{i18n.t.team.subtitle} <span class="hint">{i18n.t.team.hint}</span></p>
    
    <div class="grid" class:visible>
      {#each team as member, i}
        <button 
          class="member" 
          style="--i: {i}"
          onclick={() => openModal(member)}
        >
          <img src={member.avatar} alt={member.name} />
          <span class="name">{member.name}</span>
          <span class="role">{i18n.t.team.roles[member.roleKey]}</span>
          {#if member.subKey}
            <span class="sub">{i18n.t.team.subs[member.subKey]}</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</section>

{#if selectedMember}
  <div class="modal-overlay" class:closing role="dialog" aria-modal="true">
    <button type="button" class="modal-backdrop" onclick={closeModal} aria-label={i18n.t.team.close}></button>
    <div class="modal" class:closing>
      <button class="close" onclick={closeModal} aria-label={i18n.t.team.close}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      
      <div class="avatar-container">
        <img 
          src={selectedMember.avatar} 
          alt={selectedMember.name} 
          class="avatar"
        />

        {#each throws as t (t.id)}
          <video
            class="throw-video"
            style="--offset-x: {t.x}px; --offset-y: {t.y}px;"
            src="/tomatothrow.webm"
            playsinline
            preload="auto"
            aria-hidden="true"
            use:autoPlay={t.id}
            onended={() => removeThrow(t.id)}
          ></video>
        {/each}
      </div>
      
      <h3>{selectedMember.name}</h3>
      <span class="role-label">{i18n.t.team.roles[selectedMember.roleKey]}</span>
      
      <button class="action-btn" onclick={throwTomato}>
        {i18n.t.team.throwTomato}
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
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0;
    border: none;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: default;
    pointer-events: auto;
    animation: overlayIn 0.25s ease;
  }

  .modal-overlay.closing .modal-backdrop {
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
    z-index: 1;
    pointer-events: auto;
    overflow: visible;
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
    overflow: visible;
  }
  
  .avatar {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
  }

  .throw-video {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 700px;
    height: 700px;
    transform: translate(calc(-50% + var(--offset-x, 0px)), calc(-50% + var(--offset-y, 0px)));
    object-fit: contain;
    pointer-events: none;
    z-index: 10;
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

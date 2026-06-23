<script lang="ts">
  import { onMount } from 'svelte';
  import { useI18n } from '$lib/i18n';

  const i18n = useI18n();
  let show = $state(false);
  let playing = $state(false);
  let audio: HTMLAudioElement | null = null;
  
  const songs = ['/music3.mp3', '/music1.mp3', '/music2.mp3'];
  let currentSongIndex = 0;

  const splashTexts = [
    'shoutout to loris',
    'inator moy fanat',
    'slava drz'
  ];

  let splashText = $state('');
  
  function pickSplash() {
    splashText = splashTexts[Math.floor(Math.random() * splashTexts.length)] ?? splashTexts[0];
  }
  
  function toggleMusic() {
    if (playing && audio) {
      audio.pause();
      audio = null;
      playing = false;
      currentSongIndex = (currentSongIndex + 1) % songs.length;
    } else {
      audio = new Audio(songs[currentSongIndex]);
      audio.volume = 0.5;
      audio.play();
      playing = true;
      audio.onended = () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playing = false;
        audio = null;
      };
    }
  }
  
  onMount(() => { 
    pickSplash();
    requestAnimationFrame(() => show = true);
    return () => {
      if (audio) audio.pause();
    };
  });
</script>

<section class="hero">
  <div class="container content" class:show>
    <div class="title-wrap">
      <h1 class:rainbow={playing}>dryzyashki</h1>
      {#if splashText}
        <span class="splash" class:slava={splashText === 'slava drz'}>{splashText}</span>
      {/if}
    </div>
    <p class="desc">{i18n.t.hero.descLine1}<br/>{i18n.t.hero.descLine2}</p>
    
    <div class="actions">
      <a href="https://discord.gg/CP9ajwY3Ww" target="_blank" rel="noopener" class="btn-primary">{i18n.t.hero.join}</a>
      <a href="#features" class="btn-secondary">{i18n.t.hero.learnMore}</a>
      <button class="btn-music" class:playing onclick={toggleMusic} aria-label={i18n.t.hero.toggleMusic}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      </button>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
  }
  
  .content {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .content.show { opacity: 1; transform: none; }

  .title-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    overflow: visible;
  }
  
  h1 {
    position: relative;
    z-index: 1;
    font-size: clamp(3.5rem, 12vw, 6rem);
    font-weight: 600;
    letter-spacing: -0.025em;
    margin-bottom: 0;
    line-height: 1.05;
  }

  .splash {
    position: absolute;
    z-index: 2;
    left: 86%;
    top: 6.2em;
    font-family: Arial, Helvetica, sans-serif;
    font-size: clamp(10px, 1.35vw, 14px);
    font-weight: 700;
    font-style: italic;
    line-height: 1;
    white-space: nowrap;
    color: #fff200;
    text-shadow: 1px 1px 0 rgba(58, 58, 0, 0.28);
    transform: rotate(-20deg);
    transform-origin: center center;
    user-select: none;
    pointer-events: none;
    animation: mcSplashPulse 1s ease-in-out infinite;
  }

  .splash.slava {
    left: 94%;
  }

  @keyframes mcSplashPulse {
    0%, 100% {
      transform: rotate(-20deg) scale(0.95);
    }
    50% {
      transform: rotate(-20deg) scale(1.05);
    }
  }
  
  h1.rainbow {
    background: linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff0080, #ff0000);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbow 3s linear infinite;
  }
  
  @keyframes rainbow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  
  .desc {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    color: var(--text-2);
    margin-bottom: 40px;
    font-weight: 400;
    line-height: 1.4;
  }
  
  .actions { 
    display: flex; 
    gap: 16px; 
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .btn-primary {
    padding: 16px 32px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    border-radius: 980px;
    font-weight: 500;
    font-size: 1.05rem;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .btn-primary:hover { 
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.3);
    transform: scale(1.02);
  }
  
  .btn-secondary {
    padding: 16px 32px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    color: #2997ff;
    border-radius: 980px;
    font-size: 1.05rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  .btn-secondary:hover { 
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.1);
  }
  
  @media (max-width: 480px) {
    .splash {
      left: 86%;
      top: 6.2em;
      font-size: 10px;
    }

    .splash.slava {
      left: 94%;
    }

    .actions { flex-direction: column; gap: 12px; }
    .btn-primary, .btn-secondary { width: 100%; }
    .btn-music { align-self: center; }
  }
  
  .btn-music {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    flex-shrink: 0;
  }
  
  .btn-music:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
    transform: scale(1.05);
  }
  
  .btn-music.playing {
    background: rgba(41, 151, 255, 0.15);
    border-color: rgba(41, 151, 255, 0.3);
    color: #2997ff;
  }
  
  .btn-music.playing:hover {
    background: rgba(41, 151, 255, 0.2);
  }
</style>

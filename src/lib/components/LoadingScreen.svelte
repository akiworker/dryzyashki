<script lang="ts">
  import { onMount } from 'svelte';
  
  let visible = $state(true);
  let fadeOut = $state(false);
  
  onMount(() => {
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      fadeOut = true;
      setTimeout(() => { 
        visible = false;
        document.body.style.overflow = '';
      }, 500);
    }, 1000);
  });
</script>

{#if visible}
  <div class="loader" class:fadeOut>
    <div class="ispinner">
      {#each Array(8) as _}
        <div class="ispinner-blade"></div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .loader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  .loader.fadeOut {
    opacity: 0;
    pointer-events: none;
  }
  
  .ispinner {
    position: relative;
    width: 20px;
    height: 20px;
  }
  
  .ispinner .ispinner-blade {
    position: absolute;
    width: 2px;
    height: 5px;
    background: #8e8e93;
    left: 50%;
    top: 50%;
    margin-left: -1px;
    margin-top: -8px;
    border-radius: 1px;
    transform-origin: center 8px;
    animation: blade 1s linear infinite;
  }
  
  .ispinner .ispinner-blade:nth-child(1) { transform: rotate(0deg); animation-delay: -0.875s; }
  .ispinner .ispinner-blade:nth-child(2) { transform: rotate(45deg); animation-delay: -0.75s; }
  .ispinner .ispinner-blade:nth-child(3) { transform: rotate(90deg); animation-delay: -0.625s; }
  .ispinner .ispinner-blade:nth-child(4) { transform: rotate(135deg); animation-delay: -0.5s; }
  .ispinner .ispinner-blade:nth-child(5) { transform: rotate(180deg); animation-delay: -0.375s; }
  .ispinner .ispinner-blade:nth-child(6) { transform: rotate(225deg); animation-delay: -0.25s; }
  .ispinner .ispinner-blade:nth-child(7) { transform: rotate(270deg); animation-delay: -0.125s; }
  .ispinner .ispinner-blade:nth-child(8) { transform: rotate(315deg); animation-delay: 0s; }
  
  @keyframes blade {
    0% { opacity: 1; }
    100% { opacity: 0.15; }
  }
</style>

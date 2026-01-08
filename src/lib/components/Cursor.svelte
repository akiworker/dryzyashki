<script lang="ts">
  import { onMount } from 'svelte';
  
  let cursorX = $state(0);
  let cursorY = $state(0);
  let targetX = $state(0);
  let targetY = $state(0);
  let isHovering = $state(false);
  let isClicking = $state(false);
  let isMiddleClick = $state(false);
  
  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        isMiddleClick = true;
      } else {
        isClicking = true;
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        isMiddleClick = false;
      } else {
        isClicking = false;
      }
    };
    
    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"]');
      isHovering = !!isInteractive;
    };
    
    // Track mouse during middle button drag
    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    
    // Smooth follow animation
    let animationFrame: number;
    const animate = () => {
      const dx = targetX - cursorX;
      const dy = targetY - cursorY;
      
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('mousemove', updateHoverState);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mousemove', updateHoverState);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<div 
  class="cursor" 
  class:hovering={isHovering}
  class:clicking={isClicking}
  class:middle={isMiddleClick}
  style="left: {cursorX}px; top: {cursorY}px;"
>
  <div class="cursor-inner">
    <div class="cursor-glow"></div>
  </div>
</div>

<style>
  .cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }
  
  .cursor-inner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  
  .cursor-inner::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
  
  .cursor-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .cursor.hovering .cursor-inner {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  .cursor.hovering .cursor-inner::before {
    width: 8px;
    height: 8px;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
  }
  
  .cursor.hovering .cursor-glow {
    opacity: 1;
  }
  
  .cursor.clicking .cursor-inner,
  .cursor.middle .cursor-inner {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
  }
  
  .cursor.clicking .cursor-inner::before,
  .cursor.middle .cursor-inner::before {
    width: 4px;
    height: 4px;
  }
  
  @media (hover: none) {
    .cursor {
      display: none;
    }
  }
</style>

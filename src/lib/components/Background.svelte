<div class="bg">
  <div class="glow"></div>
</div>

<style>
  .bg {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }
  
  .glow {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 60%);
  }
</style>

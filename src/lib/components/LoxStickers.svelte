<script lang="ts">
  const stickers = [
    { src: '/lox.webp', top: '7%', side: 'right' as const, offset: '2%', width: 132, rotate: 11 },
    { src: '/lox2.webp', top: '29.5%', side: 'left' as const, offset: '2%', width: 130, rotate: -9 },
    { src: '/lox3.webp', top: '53%', side: 'right' as const, offset: '3%', width: 126, rotate: 7 },
    { src: '/lox4.webp', top: '74%', side: 'left' as const, offset: '2%', width: 120, rotate: -12 }
  ];
</script>

<div class="lox-layer" aria-hidden="true">
  {#each stickers as sticker, index}
    <img
      class="lox"
      src={sticker.src}
      alt=""
      width={sticker.width}
      height={sticker.width}
      loading="lazy"
      decoding="async"
      style:top={sticker.top}
      style:left={sticker.side === 'left' ? sticker.offset : undefined}
      style:right={sticker.side === 'right' ? sticker.offset : undefined}
      style:--w="{sticker.width}px"
      style:--rotate="{sticker.rotate}deg"
      style:--delay="{index * 0.08}s"
    />
  {/each}
</div>

<style>
  .lox-layer {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .lox {
    position: absolute;
    width: var(--w);
    height: auto;
    max-width: min(var(--w), 28vw);
    transform: rotate(var(--rotate));
    opacity: 0.92;
    user-select: none;
    -webkit-user-drag: none;
    filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28));
    animation: loxIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both;
  }

  @keyframes loxIn {
    from {
      opacity: 0;
      transform: rotate(var(--rotate)) scale(0.88) translateY(12px);
    }
    to {
      opacity: 0.92;
      transform: rotate(var(--rotate)) scale(1) translateY(0);
    }
  }

  @media (max-width: 900px) {
    .lox {
      max-width: min(var(--w), 22vw);
      opacity: 0.82;
    }
  }

  @media (max-width: 600px) {
    .lox {
      max-width: 72px;
      opacity: 0.75;
    }

    .lox:nth-child(1) {
      top: 5% !important;
      right: 1% !important;
    }

    .lox:nth-child(2) {
      top: 28% !important;
      left: 1% !important;
    }

    .lox:nth-child(3) {
      top: 51% !important;
      right: 1% !important;
    }

    .lox:nth-child(4) {
      top: 72% !important;
      left: 1% !important;
    }
  }
</style>

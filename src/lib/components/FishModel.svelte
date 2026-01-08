<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
  let container: HTMLDivElement;
  let showModal = $state(false);
  let processing = $state(false);
  let confirmed = $state(false);
  let closing = $state(false);
  
  function openModal() {
    showModal = true;
    processing = false;
    confirmed = false;
    closing = false;
  }
  
  function closeModal() {
    closing = true;
    setTimeout(() => {
      showModal = false;
      closing = false;
      processing = false;
      confirmed = false;
    }, 200);
  }
  
  function confirm() {
    processing = true;
    setTimeout(() => {
      processing = false;
      confirmed = true;
      
      // Play audio
      const audio = new Audio('/idi-nafig.mp3');
      audio.volume = 0.7;
      audio.play();
      
      setTimeout(() => {
        window.close();
        // fallback - close modal after audio finishes (1 sec)
        setTimeout(() => closeModal(), 1000);
      }, 800);
    }, 2000);
  }
  
  onMount(() => {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    
    // Load model
    const loader = new GLTFLoader();
    let model: THREE.Group;
    
    loader.load('/fish.glb', (gltf) => {
      model = gltf.scene;
      
      // Center and scale
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.5 / maxDim;
      
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      
      // Rainbow material
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            metalness: 0.9,
            roughness: 0.1,
          });
        }
      });
      
      scene.add(model);
    });
    
    // Animation
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Rainbow color shift
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const hue = (time * 0.1) % 1;
            child.material.color.setHSL(hue, 1, 0.65);
          }
        });
      }
      
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    
    // Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  });
</script>

<section id="fish">
  <div class="container">
    <h2>Наш талисман</h2>
    <div class="model-wrapper" bind:this={container}></div>
    <div class="buy-section">
      <button class="buy-btn" onclick={openModal}>Купить</button>
      <span class="price">150 TON ≈ $450</span>
    </div>
    
    <div class="socials">
      <p class="socials-text">Наш проект поддерживает</p>
      <div class="socials-icons">
        <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a href="https://pornhub.com" target="_blank" rel="noopener" aria-label="Pornhub">
          <svg width="24" height="24" viewBox="0 0 50 50" fill="currentColor">
            <path d="M 6 5.5253906 L 6 18.248047 L 6 18.25 L 8.5703125 18.25 L 8.5703125 13.449219 L 10.244141 13.449219 C 11.407141 13.449219 12.296156 13.388578 12.910156 13.267578 C 13.361156 13.169578 13.805188 12.968063 14.242188 12.664062 C 14.678187 12.361062 15.039266 11.943156 15.322266 11.410156 C 15.606266 10.877156 15.748047 10.221453 15.748047 9.4394531 C 15.748047 8.4274531 15.501766 7.6028906 15.009766 6.9628906 C 14.517766 6.3228906 13.907687 5.9077969 13.179688 5.7167969 C 12.704687 5.5897969 11.685047 5.5253906 10.123047 5.5253906 L 6 5.5253906 z M 8.5703125 7.6777344 L 9.8105469 7.6777344 C 10.735547 7.6777344 11.352156 7.7056719 11.660156 7.7636719 C 12.076156 7.8386719 12.419406 8.028125 12.691406 8.328125 C 12.964406 8.629125 13.099609 9.0116094 13.099609 9.4746094 C 13.099609 9.8506094 13.003547 10.179891 12.810547 10.462891 C 12.616547 10.746891 12.349813 10.954891 12.007812 11.087891 C 11.665813 11.221891 10.989562 11.287109 9.9765625 11.287109 L 8.5703125 11.287109 L 8.5703125 7.6777344 z M 22.023438 8.8222656 C 21.120438 8.8222656 20.303313 9.022875 19.570312 9.421875 C 18.838313 9.820875 18.273047 10.400203 17.873047 11.158203 C 17.474047 11.916203 17.275391 12.699766 17.275391 13.509766 C 17.275391 14.568766 17.475 15.466078 17.875 16.205078 C 18.275 16.942078 18.857 17.502766 19.625 17.884766 C 20.391 18.266766 21.196016 18.457031 22.041016 18.457031 C 23.407016 18.457031 24.539453 18.000031 25.439453 17.082031 C 26.339453 16.164031 26.789062 15.008281 26.789062 13.613281 C 26.789062 12.231281 26.342172 11.087641 25.451172 10.181641 C 24.560172 9.2756406 23.417437 8.8222656 22.023438 8.8222656 z M 32.960938 8.8222656 C 32.566937 8.8222656 32.21525 8.9201875 31.90625 9.1171875 C 31.59625 9.3141875 31.247375 9.7227969 30.859375 10.341797 L 30.859375 9.03125 L 28.59375 9.03125 L 28.59375 18.248047 L 31.03125 18.248047 L 31.03125 15.400391 C 31.03125 13.832391 31.100328 12.802547 31.236328 12.310547 C 31.372328 11.818547 31.559875 11.479016 31.796875 11.291016 C 32.034875 11.103016 32.322063 11.009766 32.664062 11.009766 C 33.017062 11.009766 33.399547 11.142203 33.810547 11.408203 L 34.566406 9.28125 C 34.051406 8.97525 33.515937 8.8222656 32.960938 8.8222656 z M 40.902344 8.8222656 C 39.681344 8.8222656 38.668281 9.3437656 37.863281 10.384766 L 37.863281 9.03125 L 35.599609 9.03125 L 35.599609 18.248047 L 38.037109 18.248047 L 38.037109 14.074219 C 38.037109 13.044219 38.100609 12.337078 38.224609 11.955078 C 38.348609 11.573078 38.579062 11.267156 38.914062 11.035156 C 39.250063 10.804156 39.629734 10.689453 40.052734 10.689453 C 40.382734 10.689453 40.664437 10.769641 40.898438 10.931641 C 41.133437 11.093641 41.301297 11.321281 41.404297 11.613281 C 41.508297 11.906281 41.5625 12.549922 41.5625 13.544922 L 41.5625 18.248047 L 44 18.248047 L 44 12.521484 C 44 11.809484 43.955187 11.262859 43.867188 10.880859 C 43.777188 10.499859 43.617672 10.156469 43.388672 9.8554688 C 43.159672 9.5544687 42.822953 9.3072813 42.376953 9.1132812 C 41.931953 8.9192812 41.440344 8.8222656 40.902344 8.8222656 z M 22.03125 10.810547 C 22.66825 10.810547 23.201812 11.053062 23.632812 11.539062 C 24.064813 12.025063 24.279297 12.719094 24.279297 13.621094 C 24.279297 14.547094 24.064812 15.254234 23.632812 15.740234 C 23.202812 16.226234 22.66825 16.46875 22.03125 16.46875 C 21.39525 16.46875 20.859781 16.227234 20.425781 15.740234 C 19.990781 15.254234 19.775391 14.554625 19.775391 13.640625 C 19.775391 12.726625 19.990781 12.026062 20.425781 11.539062 C 20.859781 11.053063 21.39525 10.810547 22.03125 10.810547 z M 7.1210938 21 C 5.9510938 21 5 21.951094 5 23.121094 L 5 42.878906 C 5 44.048906 5.9510937 45 7.1210938 45 L 42.878906 45 C 44.048906 45 45 44.048906 45 42.878906 L 45 23.121094 C 45 21.951094 44.048906 21 42.878906 21 L 7.1210938 21 z M 12.126953 26.597656 L 14.294922 26.597656 L 14.294922 30.755859 C 14.994922 29.937859 15.830734 29.529297 16.802734 29.529297 C 17.301734 29.529297 17.752297 29.621641 18.154297 29.806641 C 18.555297 29.992641 18.857547 30.229578 19.060547 30.517578 C 19.263547 30.805578 19.403516 31.124609 19.478516 31.474609 C 19.552516 31.824609 19.589844 32.366563 19.589844 33.101562 L 19.589844 37.910156 L 17.421875 37.910156 L 17.421875 33.580078 C 17.421875 32.721078 17.378875 32.176312 17.296875 31.945312 C 17.214875 31.714312 17.069328 31.528578 16.861328 31.392578 C 16.652328 31.256578 16.391125 31.1875 16.078125 31.1875 C 15.718125 31.1875 15.396281 31.276172 15.113281 31.451172 C 14.830281 31.626172 14.623188 31.889188 14.492188 32.242188 C 14.360188 32.594187 14.294922 33.115688 14.294922 33.804688 L 14.294922 37.908203 L 12.126953 37.908203 L 12.126953 26.597656 z M 31.349609 26.597656 L 33.517578 26.597656 L 33.517578 30.671875 C 34.186578 29.910875 34.978531 29.529297 35.894531 29.529297 C 36.892531 29.529297 37.719047 29.891281 38.373047 30.613281 C 39.027047 31.335281 39.351562 32.373563 39.351562 33.726562 C 39.351562 35.125563 39.019516 36.204937 38.353516 36.960938 C 37.687516 37.716938 36.876781 38.09375 35.925781 38.09375 C 35.456781 38.09375 34.995062 37.976188 34.539062 37.742188 C 34.084063 37.508187 33.692281 37.163078 33.363281 36.705078 L 33.363281 37.908203 L 31.349609 37.908203 L 31.349609 26.597656 z M 21.742188 29.714844 L 23.910156 29.714844 L 23.910156 33.480469 C 23.910156 34.633469 23.949297 35.339609 24.029297 35.599609 C 24.109297 35.859609 24.255797 36.064797 24.466797 36.216797 C 24.677797 36.368797 24.945531 36.443359 25.269531 36.443359 C 25.639531 36.443359 25.972625 36.341672 26.265625 36.138672 C 26.558625 35.935672 26.759188 35.682812 26.867188 35.382812 C 26.975188 35.081812 27.029297 34.344875 27.029297 33.171875 L 27.029297 29.714844 L 29.197266 29.714844 L 29.197266 37.910156 L 27.181641 37.910156 L 27.181641 36.683594 C 26.883641 37.121594 26.492859 37.464797 26.005859 37.716797 C 25.518859 37.968797 25.006797 38.095703 24.466797 38.095703 C 23.915797 38.095703 23.421375 37.974422 22.984375 37.732422 C 22.547375 37.490422 22.230156 37.150891 22.035156 36.712891 C 21.839156 36.275891 21.742187 35.671391 21.742188 34.900391 L 21.742188 29.714844 z M 35.316406 31.1875 C 34.795406 31.1875 34.364531 31.390922 34.019531 31.794922 C 33.674531 32.198922 33.501953 32.812766 33.501953 33.634766 C 33.501953 34.483766 33.635344 35.111578 33.902344 35.517578 C 34.278344 36.093578 34.776438 36.380859 35.398438 36.380859 C 35.877437 36.380859 36.286047 36.176578 36.623047 35.767578 C 36.960047 35.358578 37.128906 34.713984 37.128906 33.833984 C 37.128906 32.897984 36.959141 32.222594 36.619141 31.808594 C 36.279141 31.394594 35.846406 31.1875 35.316406 31.1875 z"/>
          </svg>
        </a>
        <a href="https://discord.gg/CP9ajwY3Ww" target="_blank" rel="noopener" aria-label="Discord">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>

{#if showModal}
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
      {#if confirmed}
        <div class="fuck-you">ИДИ НАХУЙ</div>
      {:else if processing}
        <div class="processing">
          <p>Обработка...</p>
          <div class="ispinner">
            {#each Array(8) as _}
              <div class="ispinner-blade"></div>
            {/each}
          </div>
        </div>
      {:else}
        <h3>Подтвердить покупку?</h3>
        <p class="modal-price">150 TON ≈ $450</p>
        <div class="modal-buttons">
          <button class="confirm-btn" onclick={confirm}>Подтвердить</button>
          <button class="cancel-btn" onclick={closeModal}>Отмена</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  section {
    padding: 80px 0;
  }
  
  h2 {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .model-wrapper {
    width: 100%;
    height: 550px;
    border-radius: 24px;
    overflow: hidden;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.04);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
  }
  
  .buy-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  }
  
  .buy-btn {
    padding: 14px 32px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 980px;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.2s;
  }
  
  .buy-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
  }
  
  .price {
    color: var(--text-2);
    font-size: 0.95rem;
  }
  
  .socials {
    margin-top: 48px;
    text-align: center;
  }
  
  .socials-text {
    color: var(--text-2);
    font-size: 1rem;
    margin-bottom: 16px;
  }
  
  .socials-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  
  .socials-icons a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    color: #fff;
    transition: all 0.2s;
  }
  
  .socials-icons a:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-2px);
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
    max-width: 360px;
    width: 90%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 24px;
    padding: 40px 32px;
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
  
  .modal h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .modal-price {
    color: var(--text-2);
    margin-bottom: 28px;
  }
  
  .modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  
  .confirm-btn, .cancel-btn {
    padding: 12px 24px;
    border-radius: 980px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }
  
  .confirm-btn {
    background: #fff;
    color: #000;
  }
  
  .confirm-btn:hover {
    background: rgba(255,255,255,0.9);
    transform: scale(1.03);
  }
  
  .cancel-btn {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
  
  .cancel-btn:hover {
    background: rgba(255,255,255,0.15);
  }
  
  .fuck-you {
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    animation: shake 0.5s ease;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
  }
  
  .processing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .processing p {
    color: #fff;
    font-size: 1.2rem;
    font-weight: 500;
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

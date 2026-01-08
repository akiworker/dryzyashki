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
      setTimeout(() => {
        window.close();
        // fallback
        setTimeout(() => closeModal(), 500);
      }, 2000);
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

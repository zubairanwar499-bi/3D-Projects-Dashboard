// =====================================================
// scene3d.js — Ultra-Realistic 3D Product Hardware Engine
// Specialized detailed geometries with high-res textures
// Screen wallpapers, keyboards, brand badges, and dials
// Full-bleed canvas, zero clutter, external slicer driven
// =====================================================

class Scene3D {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId) || document.body;
    this.options = options;
    this.products = [];
    this.meshes = [];
    this.hoveredMesh = null;
    this.animFrame = null;
    this.textureCache = {};
    this.textureLoader = (typeof THREE !== 'undefined' && THREE.TextureLoader) ? new THREE.TextureLoader() : null;

    // Read URL options
    this.theme = (getURLParam('theme') || options.theme || 'dark').toLowerCase();
    this.rotate = getURLParam('rotate') !== 'false' && options.rotate !== false;
    this.selectedProductName = (getURLParam('product') || options.product || '').toLowerCase().trim();
    this.selectedBrand = (getURLParam('brand') || options.brand || '').toLowerCase().trim();
    this.selectedCategory = (getURLParam('cat') || options.category || '').toLowerCase().trim();

    this._initScene();
    this._initLights();
    this._initPostSetup();
    this._bindEvents();
  }

  // ── Scene / Camera / Renderer ──────────────────
  _initScene() {
    this.scene = new THREE.Scene();
    const isLight = this.theme === 'light';
    const bgColor = isLight ? 0xf4f5fb : 0x0a0b14;
    this.scene.background = new THREE.Color(bgColor);
    this.scene.fog = new THREE.FogExp2(bgColor, 0.03);

    const w = this.container.clientWidth || window.innerWidth || 600;
    const h = this.container.clientHeight || window.innerHeight || 450;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 150);
    this.camera.position.set(0, 3.5, 9);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = isLight ? 1.1 : 1.35;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    if (typeof THREE.OrbitControls === 'function') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.minDistance = 2.5;
      this.controls.maxDistance = 30;
      this.controls.maxPolarAngle = Math.PI / 2.02;
      this.controls.autoRotate = this.rotate;
      this.controls.autoRotateSpeed = 0.75;
    }

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-9999, -9999);
  }

  // ── Lighting Setup ─────────────────────────────
  _initLights() {
    const isLight = this.theme === 'light';

    this.ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.9 : 0.55);
    this.scene.add(this.ambientLight);

    // Key Light
    const key = new THREE.DirectionalLight(0xffffff, isLight ? 1.3 : 1.6);
    key.position.set(8, 14, 8);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    // Rim Back Light
    const rim = new THREE.DirectionalLight(isLight ? 0x99aaff : 0x6c63ff, isLight ? 0.6 : 1.4);
    rim.position.set(-8, 6, -6);
    this.scene.add(rim);

    // Accent Point
    const accent = new THREE.PointLight(isLight ? 0xffaa66 : 0x00d2ff, 1.2, 20);
    accent.position.set(0, 5, 4);
    this.scene.add(accent);
  }

  // ── Floor and Ambient Environment ──────────────
  _initPostSetup() {
    const isLight = this.theme === 'light';

    // Ground reflector
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe9ecf6 : 0x05060b,
      roughness: 0.75,
      metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle grid
    const grid = new THREE.GridHelper(40, 40, isLight ? 0xc4c8da : 0x222344, isLight ? 0xdcdff0 : 0x121326);
    grid.position.y = -1.19;
    this.scene.add(grid);
    this.grid = grid;
  }

  // ── Texture Loaders with Path Resolution ───────
  _loadTexture(relPath) {
    if (!this.textureLoader) return null;
    if (this.textureCache[relPath]) return this.textureCache[relPath];

    // Detect depth from URL
    const pathname = window.location.pathname.replace(/\\/g, '/');
    let prefix = 'textures/';
    if (pathname.includes('/viz/')) {
      prefix = '../../textures/';
    } else if (pathname.includes('/pages/')) {
      prefix = '../textures/';
    }

    const fullUrl = prefix + relPath;
    const tex = this.textureLoader.load(fullUrl);
    tex.anisotropy = (this.renderer && this.renderer.capabilities) ? this.renderer.capabilities.getMaxAnisotropy() : 4;
    this.textureCache[relPath] = tex;
    return tex;
  }

  _getProductScreenTexture(product) {
    if (!product || !product.id) return null;
    const pid = product.id.toLowerCase();
    const name = product.name.toLowerCase().replace(/ /g, '_');
    const filename = `screen_${pid}_${name}.jpg`;
    return this._loadTexture(filename);
  }

  _getKeyboardTexture() {
    return this._loadTexture('keyboard_layout.jpg');
  }

  _getBrandBadgeTexture(brand) {
    const b = (brand || 'brand').toLowerCase().replace(/ /g, '_');
    const filename = `badge_${b}.jpg`;
    return this._loadTexture(filename);
  }

  // ── Realistic Procedural Model Builders ────────
  buildDetailedModel(product) {
    const cat = (product.category || '').toLowerCase();
    const group = new THREE.Group();

    const brandCol = brandColor(product.brand);
    const bColor = new THREE.Color(brandCol);
    const isApple = (product.brand || '').toLowerCase() === 'apple';

    // Fetch customized texture for this product
    const screenTex = this._getProductScreenTexture(product);

    if (cat.includes('smart') && !cat.includes('watch')) {
      // ══════════════════════════════════════════════
      // 📱 REALISTIC SMARTPHONE (iPhone / Galaxy)
      // ══════════════════════════════════════════════
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isApple ? 0x3a3b40 : 0x1c1e28,
        metalness: 0.85,
        roughness: 0.22
      });

      // Chassis
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.15, 0.11), bodyMat);
      chassis.castShadow = true;
      group.add(chassis);

      // Edge Band (Titanium / Polished Metal)
      const frameMat = new THREE.MeshStandardMaterial({ color: bColor, metalness: 0.95, roughness: 0.1 });
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.07, 2.17, 0.08), frameMat);
      group.add(frame);

      // Textured Screen Display Face (PlaneGeometry with authentic wallpaper)
      const screenMat = new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.45,
        roughness: 0.12,
        metalness: 0.25
      });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 2.06), screenMat);
      screen.position.z = 0.058;
      group.add(screen);

      // Dynamic Island / Camera Punch Hole
      const punchGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16);
      punchGeo.rotateX(Math.PI / 2);
      const punchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const punch = new THREE.Mesh(punchGeo, punchMat);
      punch.position.set(0, 0.92, 0.068);
      group.add(punch);

      // Rear Camera Module
      const bumpMat = new THREE.MeshStandardMaterial({ color: 0x111218, metalness: 0.7, roughness: 0.25 });
      const bump = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.04), bumpMat);
      bump.position.set(0.24, 0.76, -0.07);
      group.add(bump);

      // 3 Camera Lenses
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x050510, emissive: 0x0055aa, emissiveIntensity: 0.4, metalness: 0.95, roughness: 0.05 });
      const lensRingMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.95, roughness: 0.1 });
      const lensPositions = [
        [0.17, 0.85, -0.095],
        [0.31, 0.85, -0.095],
        [0.24, 0.67, -0.095]
      ];
      lensPositions.forEach(pos => {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 20), lensRingMat);
        ring.rotateX(Math.PI / 2);
        ring.position.set(...pos);
        group.add(ring);

        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.035, 20), lensMat);
        lens.rotateX(Math.PI / 2);
        lens.position.set(...pos);
        group.add(lens);
      });

    } else if (cat.includes('tv')) {
      // ══════════════════════════════════════════════
      // 📺 REALISTIC 4K / 8K TELEVISION
      // ══════════════════════════════════════════════
      const w = 3.6;
      const h = 2.05;

      // Ultra-slim panel frame
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.85, roughness: 0.25 });
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.07), frameMat);
      frame.castShadow = true;
      group.add(frame);

      // Textured 4K HDR Display Screen
      const screenMat = new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.42,
        roughness: 0.1,
        metalness: 0.2
      });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.06), screenMat);
      screen.position.z = 0.038;
      group.add(screen);

      // Metallic Feet / Stand
      const standMat = new THREE.MeshStandardMaterial({ color: 0x888894, metalness: 0.95, roughness: 0.15 });
      [-w * 0.35, w * 0.35].forEach(x => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.65), standMat);
        leg.position.set(x, -h / 2 - 0.12, 0);
        leg.castShadow = true;
        group.add(leg);
      });

      // Back Electronics Housing
      const backHousing = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, h * 0.55, 0.1), frameMat);
      backHousing.position.set(0, -0.15, -0.08);
      group.add(backHousing);

    } else if (cat.includes('laptop')) {
      // ══════════════════════════════════════════════
      // 💻 REALISTIC LAPTOP (Open Lid)
      // ══════════════════════════════════════════════
      const caseMat = new THREE.MeshStandardMaterial({ color: 0x6e717c, metalness: 0.8, roughness: 0.2 });

      // Base Body
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 1.55), caseMat);
      base.castShadow = true;
      group.add(base);

      // Keyboard Area with Texture
      const kbTex = this._getKeyboardTexture();
      const kbMat = new THREE.MeshStandardMaterial({
        map: kbTex,
        metalness: 0.2,
        roughness: 0.6
      });
      const kb = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.4), kbMat);
      kb.rotation.x = -Math.PI / 2;
      kb.position.set(0, 0.045, 0.02);
      group.add(kb);

      // Screen Lid (Angled 115 deg)
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, 0.04, -0.75);
      lidGroup.rotation.x = -Math.PI * 0.16;

      const lid = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.45, 0.05), caseMat);
      lid.position.y = 0.72;
      lidGroup.add(lid);

      // Textured Laptop Screen (macOS / Windows 11 wallpaper)
      const scrMat = new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.42,
        metalness: 0.2,
        roughness: 0.1
      });
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.37), scrMat);
      scr.position.set(0, 0.72, 0.028);
      lidGroup.add(scr);

      group.add(lidGroup);

    } else if (cat.includes('headphone')) {
      // ══════════════════════════════════════════════
      // 🎧 REALISTIC HEADPHONES
      // ══════════════════════════════════════════════
      const matMain = new THREE.MeshStandardMaterial({ color: 0x22242c, metalness: 0.75, roughness: 0.25 });
      const matCushion = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.9, metalness: 0.1 });

      // Headband Arc
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.95, 0, 0),
        new THREE.Vector3(0, 1.35, 0),
        new THREE.Vector3(0.95, 0, 0)
      );
      const bandGeo = new THREE.TubeGeometry(curve, 32, 0.07, 12, false);
      group.add(new THREE.Mesh(bandGeo, matMain));

      // Brand Badge Texture on Ear Cups
      const badgeTex = this._getBrandBadgeTexture(product.brand);
      const badgeMat = new THREE.MeshStandardMaterial({
        map: badgeTex,
        metalness: 0.8,
        roughness: 0.25
      });

      // Ear Cups & Cushions
      [-1, 1].forEach(side => {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 28), matMain);
        cup.position.set(side * 0.95, -0.05, 0);
        cup.rotation.z = Math.PI / 2;
        group.add(cup);

        // Circular Brand Cap on outside
        const badgeMesh = new THREE.Mesh(new THREE.CircleGeometry(0.36, 28), badgeMat);
        badgeMesh.position.set(side * (0.95 + side * 0.115), -0.05, 0);
        badgeMesh.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        group.add(badgeMesh);

        // Cushion
        const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.1, 14, 24), matCushion);
        cushion.position.set(side * (0.95 - side * 0.12), -0.05, 0);
        cushion.rotation.y = Math.PI / 2;
        group.add(cushion);
      });

    } else if (cat.includes('watch')) {
      // ══════════════════════════════════════════════
      // ⌚ REALISTIC SMARTWATCH
      // ══════════════════════════════════════════════
      const caseMat = new THREE.MeshStandardMaterial({ color: 0x282930, metalness: 0.85, roughness: 0.2 });
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x1e2029, roughness: 0.85, metalness: 0.05 });

      // Case
      const watchCase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.2, 36), caseMat);
      group.add(watchCase);

      // Textured Watch Face Dial (Activity rings, Chronograph clock)
      const dialMat = new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.2
      });
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.58, 36), dialMat);
      face.rotation.x = -Math.PI / 2;
      face.position.y = 0.106;
      group.add(face);

      // Digital Crown
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), caseMat);
      crown.rotateZ(Math.PI / 2);
      crown.position.set(0.68, 0, 0);
      group.add(crown);

      // Straps
      [-1, 1].forEach(side => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, side * 1.1), strapMat);
        strap.position.set(0, -0.02, side * 0.85);
        group.add(strap);
      });

    } else if (cat.includes('tablet')) {
      // ══════════════════════════════════════════════
      // 📱 REALISTIC TABLET SLATE
      // ══════════════════════════════════════════════
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x5a5d66, metalness: 0.85, roughness: 0.2 });
      const slate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.5, 0.09), bodyMat);
      slate.castShadow = true;
      group.add(slate);

      // Textured Tablet Display
      const scrMat = new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.42,
        metalness: 0.2,
        roughness: 0.1
      });
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 2.42), scrMat);
      scr.position.z = 0.052;
      group.add(scr);
    }

    return group;
  }

  // ── Load & Position Products ───────────────────
  loadProducts(productsList) {
    this._clearScene();
    this.products = productsList || [];

    const n = this.products.length;
    if (n === 0) {
      this._showEmptyState();
      return;
    }

    // Single Product Selected in Slicer -> HERO MODE!
    if (n === 1 || this.selectedProductName) {
      const p = n === 1 ? this.products[0] : (this.products.find(x => x.name.toLowerCase().includes(this.selectedProductName)) || this.products[0]);
      const mesh = this.buildDetailedModel(p);
      mesh.scale.set(1.4, 1.4, 1.4);
      mesh.position.set(0, 0.2, 0);
      mesh.userData = { product: p, isHero: true, baseY: 0.2 };
      this.scene.add(mesh);
      this.meshes.push(mesh);
      this.camera.position.set(0, 2.0, 5.8);
      if (this.controls) this.controls.target.set(0, 0.2, 0);
      this._updateHUD(p);
      this._startAnimation();
      return;
    }

    // Multiple Products -> Clean Gallery Layout
    // Spaced elegantly so they never overlap!
    const cols = Math.min(n, 5);
    const rows = Math.ceil(n / cols);
    const spacingX = 3.6;
    const spacingZ = 3.4;

    this.products.forEach((p, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * spacingX;
      const z = (row - (rows - 1) / 2) * spacingZ;

      const mesh = this.buildDetailedModel(p);
      mesh.position.set(x, 0, z);
      mesh.userData = { product: p, baseY: 0, floatOffset: (i * 0.4) % (Math.PI * 2) };
      this.scene.add(mesh);
      this.meshes.push(mesh);
    });

    const dist = Math.max(7, Math.sqrt(n) * 3.5);
    this.camera.position.set(0, dist * 0.65, dist);
    if (this.controls) this.controls.target.set(0, 0, 0);

    this._startAnimation();
  }

  _clearScene() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.meshes.forEach(m => {
      this.scene.remove(m);
    });
    this.meshes = [];
    this.hoveredMesh = null;
  }

  _showEmptyState() {
    this.container.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#888;font-size:13px">No 3D Models Matching Slicers</div>';
  }

  _updateHUD(product) {
    let hud = document.getElementById('product-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'product-hud';
      hud.style.cssText = `
        position: fixed;
        bottom: 12px;
        left: 14px;
        background: rgba(12, 14, 24, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 8px 12px;
        color: #e6e8f4;
        font-size: 11px;
        backdrop-filter: blur(8px);
        max-width: 260px;
        pointer-events: none;
        z-index: 50;
      `;
      document.body.appendChild(hud);
    }
    const isLight = this.theme === 'light';
    hud.style.background = isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(12, 14, 24, 0.88)';
    hud.style.color = isLight ? '#1a1b26' : '#e6e8f4';
    hud.style.border = isLight ? '1px solid #d4d7e6' : '1px solid rgba(255, 255, 255, 0.12)';

    hud.innerHTML = `
      <div style="font-weight:700;font-size:13px;color:#6c63ff;margin-bottom:3px">${product.name}</div>
      <div style="color:${isLight ? '#555' : '#8c90a8'};margin-bottom:4px">${product.brand} · ${product.category}</div>
      <div style="font-weight:700;color:#2db866">${fmtPKR(product.price || product.basePrice || 0)}</div>
    `;
  }

  // ── Animation Loop ─────────────────────────────
  _startAnimation() {
    const clock = new THREE.Clock();
    const animate = () => {
      this.animFrame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle floating animation
      this.meshes.forEach(m => {
        if (!m.userData.hovered) {
          const off = m.userData.floatOffset || 0;
          m.position.y = (m.userData.baseY || 0) + Math.sin(t * 1.2 + off) * 0.08;
        }
      });

      // Raycasting for hover
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const allChildren = this.meshes.flatMap(m => m.children || [m]);
      const hits = this.raycaster.intersectObjects(allChildren, true);

      let targetRoot = null;
      if (hits.length > 0) {
        let cur = hits[0].object;
        while (cur && !this.meshes.includes(cur)) cur = cur.parent;
        targetRoot = cur;
      }

      if (targetRoot !== this.hoveredMesh) {
        if (this.hoveredMesh) {
          this.hoveredMesh.userData.hovered = false;
          this.hoveredMesh.scale.set(1, 1, 1);
          hideTooltip();
        }
        this.hoveredMesh = targetRoot;
        if (this.hoveredMesh) {
          this.hoveredMesh.userData.hovered = true;
          this.hoveredMesh.scale.set(1.08, 1.08, 1.08);
          const p = this.hoveredMesh.userData.product;
          if (p) {
            const html = `
              <div class="tt-name">${p.name}</div>
              <div class="tt-row"><span class="tt-label">Brand</span><span class="tt-value">${p.brand}</span></div>
              <div class="tt-row"><span class="tt-label">Category</span><span class="tt-value">${p.category}</span></div>
              ${p.processor ? `<div class="tt-row"><span class="tt-label">Chip</span><span class="tt-value">${p.processor}</span></div>` : ''}
              ${p.display ? `<div class="tt-row"><span class="tt-label">Screen</span><span class="tt-value">${p.display}</span></div>` : ''}
              <div class="tt-price">${fmtPKR(p.price || p.basePrice || 0)}</div>
            `;
            showTooltip(html, this._lastMouseX, this._lastMouseY);
          }
        }
      }

      if (this.controls) this.controls.update();
      if (this.renderer) this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  // ── Resize ─────────────────────────────────────
  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth || window.innerWidth || 600;
    const h = this.container.clientHeight || window.innerHeight || 450;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ── Events ─────────────────────────────────────
  _bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    const dom = this.renderer.domElement;
    dom.addEventListener('mousemove', e => {
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this._lastMouseX = e.clientX;
      this._lastMouseY = e.clientY;
    });
    dom.addEventListener('mouseleave', () => {
      this.mouse.set(-9999, -9999);
      hideTooltip();
    });
  }
}

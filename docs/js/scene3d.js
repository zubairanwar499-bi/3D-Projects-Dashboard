// =====================================================
// scene3d.js — Core Three.js 3D Scene Engine
// Handles: scene setup, geometry builders, interaction,
//          tooltip, dark/light mode, category switching
// =====================================================

class Scene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.products  = [];
    this.meshes    = [];
    this.labels    = [];
    this.hoveredMesh = null;
    this.isLight   = false;
    this.animFrame = null;

    this._initScene();
    this._initLights();
    this._initPostSetup();
    this._bindEvents();
  }

  // ── Scene / Camera / Renderer ──────────────────
  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d0d1a);
    this.scene.fog = new THREE.FogExp2(0x0d0d1a, 0.035);

    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    this.camera.position.set(0, 6, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping  = true;
    this.controls.dampingFactor  = 0.08;
    this.controls.minDistance    = 4;
    this.controls.maxDistance    = 40;
    this.controls.maxPolarAngle  = Math.PI / 1.8;
    this.controls.autoRotate     = true;
    this.controls.autoRotateSpeed = 0.6;

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse     = new THREE.Vector2(-9999, -9999);
  }

  _initLights() {
    // Ambient
    this.ambientLight = new THREE.AmbientLight(0x6666ff, 0.4);
    this.scene.add(this.ambientLight);

    // Key light
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(10, 20, 10);
    key.castShadow = true;
    key.shadow.mapSize.width  = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.far     = 80;
    this.scene.add(key);

    // Fill
    const fill = new THREE.DirectionalLight(0x8888ff, 0.5);
    fill.position.set(-10, 5, -5);
    this.scene.add(fill);

    // Rim (accent purple)
    const rim = new THREE.PointLight(0x6c63ff, 2, 30);
    rim.position.set(0, 10, -10);
    this.scene.add(rim);

    // Floor rim
    const floor = new THREE.PointLight(0xff6584, 1.5, 25);
    floor.position.set(5, -3, 5);
    this.scene.add(floor);
  }

  _initPostSetup() {
    // Ground plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({
        color: 0x0a0a20, metalness: 0.1, roughness: 0.9
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid
    const grid = new THREE.GridHelper(60, 60, 0x2a2a55, 0x1a1a35);
    grid.position.y = -1.18;
    this.scene.add(grid);
    this.grid = grid;

    // Particle field
    this._createParticles();
  }

  _createParticles() {
    const count = 320;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 60;
      pos[i*3+1] = Math.random() * 20 - 2;
      pos[i*3+2] = (Math.random() - 0.5) * 60;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x6c63ff, size: 0.12, transparent: true, opacity: 0.5
    }));
    this.scene.add(this.particles);
  }

  // ── Product Geometry Builders ───────────────────
  _buildProductMesh(product, index, total) {
    const cat = product.category;
    let geo, mat;

    // Hue-vary base color from product colors array
    const baseHex = product.colors[0] || "#6c63ff";
    const baseColor = new THREE.Color(baseHex);
    const emitColor = baseColor.clone().multiplyScalar(0.3);

    mat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: emitColor,
      metalness: 0.55,
      roughness: 0.35,
      envMapIntensity: 1.2,
    });

    switch (cat) {
      case "Smartphone": {
        // Thin rounded slab
        geo = new THREE.BoxGeometry(0.7, 1.4, 0.08);
        const m = new THREE.Mesh(geo, mat);
        // Screen face
        const screen = new THREE.Mesh(
          new THREE.BoxGeometry(0.58, 1.22, 0.005),
          new THREE.MeshStandardMaterial({ color: 0x111133, emissive: 0x2233aa, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.1 })
        );
        screen.position.z = 0.043;
        m.add(screen);
        return m;
      }
      case "Laptop": {
        const group = new THREE.Group();
        // Base
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.06, 1.1),
          mat.clone()
        );
        group.add(base);
        // Screen panel
        const screenPanel = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 1.0, 0.06),
          mat.clone()
        );
        screenPanel.position.set(0, 0.53, -0.52);
        screenPanel.rotation.x = -Math.PI * 0.12;
        // Screen
        const screenFace = new THREE.Mesh(
          new THREE.BoxGeometry(1.44, 0.88, 0.005),
          new THREE.MeshStandardMaterial({ color: 0x111133, emissive: 0x1122bb, emissiveIntensity: 0.35, metalness: 0.9, roughness: 0.05 })
        );
        screenFace.position.z = 0.032;
        screenPanel.add(screenFace);
        group.add(screenPanel);
        return group;
      }
      case "TV": {
        const group = new THREE.Group();
        // Panel — scale by display size hint
        const sizeStr = product.display || "55in";
        const sz = parseInt(sizeStr) || 55;
        const scale = 0.025 * sz;
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(scale * 1.78, scale, 0.08),
          mat.clone()
        );
        group.add(panel);
        // Screen
        const scr = new THREE.Mesh(
          new THREE.BoxGeometry(scale * 1.78 - 0.06, scale - 0.04, 0.01),
          new THREE.MeshStandardMaterial({ color: 0x050510, emissive: 0x112244, emissiveIntensity: 0.5, metalness: 0.95, roughness: 0.05 })
        );
        scr.position.z = 0.045;
        panel.add(scr);
        // Stand
        const stand = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.4, 0.06),
          mat.clone()
        );
        stand.position.y = -(scale / 2 + 0.2);
        group.add(stand);
        const base2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.04, 0.2),
          mat.clone()
        );
        base2.position.y = -(scale / 2 + 0.4);
        group.add(base2);
        return group;
      }
      case "Headphones": {
        const group = new THREE.Group();
        // Headband arc
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(-0.55, 0, 0),
          new THREE.Vector3(0, 0.7, 0),
          new THREE.Vector3(0.55, 0, 0)
        );
        const pts   = curve.getPoints(24);
        const bandGeo = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts), 24, 0.04, 8, false
        );
        group.add(new THREE.Mesh(bandGeo, mat.clone()));
        // Ear cups
        [-1, 1].forEach(side => {
          const cup = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.22, 0.14, 18),
            mat.clone()
          );
          cup.position.set(side * 0.55, 0, 0);
          cup.rotation.z = Math.PI / 2;
          const cushion = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.055, 10, 20),
            new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.1, roughness: 0.9 })
          );
          cushion.position.x = side * 0.08;
          cushion.rotation.y = Math.PI / 2;
          cup.add(cushion);
          group.add(cup);
        });
        return group;
      }
      case "Tablet": {
        const group = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 1.5, 0.07),
          mat.clone()
        );
        group.add(body);
        const scr = new THREE.Mesh(
          new THREE.BoxGeometry(0.98, 1.36, 0.005),
          new THREE.MeshStandardMaterial({ color: 0x0a0a20, emissive: 0x1133bb, emissiveIntensity: 0.4, metalness: 0.95, roughness: 0.05 })
        );
        scr.position.z = 0.038;
        group.add(scr);
        return group;
      }
      case "Smartwatch": {
        const group = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.36, 0.36, 0.12, 32),
          mat.clone()
        );
        group.add(body);
        // Screen face
        const face = new THREE.Mesh(
          new THREE.CylinderGeometry(0.30, 0.30, 0.005, 32),
          new THREE.MeshStandardMaterial({ color: 0x050510, emissive: 0x2255ff, emissiveIntensity: 0.6, metalness: 0.95, roughness: 0.05 })
        );
        face.position.y = 0.063;
        group.add(face);
        // Band
        const bandMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(product.colors[0]||"#222"), metalness: 0.1, roughness: 0.9 });
        [-1, 1].forEach(dir => {
          const band = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.12, dir * 0.5),
            bandMat
          );
          band.position.z = dir * 0.43;
          group.add(band);
        });
        return group;
      }
      default:
        geo = new THREE.SphereGeometry(0.5, 16, 16);
        return new THREE.Mesh(geo, mat);
    }
  }

  // ── Load Products ───────────────────────────────
  loadProducts(productsArray) {
    this._clearScene();
    this.products = productsArray;
    const n = productsArray.length;
    if (n === 0) return;

    // Spiral / grid layout
    const cols  = Math.ceil(Math.sqrt(n * 1.5));
    const spacX = 3.2;
    const spacZ = 3.2;

    productsArray.forEach((product, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x   = (col - (cols - 1) / 2) * spacX;
      const z   = (row - Math.floor(n / cols) / 2) * spacZ;

      const mesh = this._buildProductMesh(product, i, n);
      mesh.position.set(x, 0, z);
      mesh.castShadow    = true;
      mesh.receiveShadow = true;
      mesh.userData      = { product, baseY: 0, hovered: false, floatOffset: Math.random() * Math.PI * 2 };
      this.scene.add(mesh);
      this.meshes.push(mesh);

      // CSS2D Label
      this._addLabel(product.name, mesh, x, z);
    });

    // Update badge
    const badge = document.getElementById('count-badge');
    if (badge) badge.textContent = `${n} Products`;

    this._startAnimation();
  }

  _addLabel(text, mesh, x, z) {
    const div = document.createElement('div');
    div.className = 'label3d';
    div.textContent = text;
    const lbl = new THREE.CSS2DObject(div);
    lbl.position.set(0, 1.4, 0);
    mesh.add(lbl);
    this.labels.push(lbl);
  }

  _clearScene() {
    cancelAnimationFrame(this.animFrame);
    this.meshes.forEach(m => {
      this.scene.remove(m);
      if (m.geometry) m.geometry.dispose();
    });
    this.meshes  = [];
    this.labels  = [];
    this.hoveredMesh = null;
  }

  // ── Animation Loop ──────────────────────────────
  _startAnimation() {
    const clock = new THREE.Clock();
    const animate = () => {
      this.animFrame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Float animation per mesh
      this.meshes.forEach(m => {
        const off = m.userData.floatOffset;
        const target = m.userData.hovered ? 0.5 : 0;
        m.position.y  = m.userData.baseY + Math.sin(t * 0.8 + off) * 0.12 + target;
        if (!m.userData.hovered) {
          m.rotation.y += 0.003;
        }
      });

      // Particle drift
      if (this.particles) {
        this.particles.rotation.y = t * 0.015;
      }

      // Raycasting for hover
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.meshes.flatMap(m => (m.isGroup ? m.children : [m])),
        true
      );

      let hit = intersects.length > 0 ? intersects[0] : null;
      let hitParent = hit ? this._findProductMesh(hit.object) : null;

      if (hitParent !== this.hoveredMesh) {
        if (this.hoveredMesh) {
          this.hoveredMesh.userData.hovered = false;
          this._unhighlight(this.hoveredMesh);
        }
        this.hoveredMesh = hitParent;
        if (this.hoveredMesh) {
          this.hoveredMesh.userData.hovered = true;
          this._highlight(this.hoveredMesh);
          this._showTooltip(this.hoveredMesh.userData.product);
        } else {
          this._hideTooltip();
        }
      }

      this.controls.update();
      this.labelRenderer.render(this.scene, this.camera);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  _findProductMesh(obj) {
    // Walk up to find the mesh in this.meshes
    let cur = obj;
    while (cur) {
      if (this.meshes.includes(cur)) return cur;
      cur = cur.parent;
    }
    return null;
  }

  _highlight(mesh) {
    const traverse = (obj) => {
      if (obj.material) {
        if (!obj.material._origEmissive) {
          obj.material._origEmissive = obj.material.emissive.clone();
        }
        obj.material.emissive.setHex(0x6c63ff);
        obj.material.emissiveIntensity = 0.6;
      }
      obj.children.forEach(traverse);
    };
    traverse(mesh);
    document.body.style.cursor = 'pointer';
  }

  _unhighlight(mesh) {
    const traverse = (obj) => {
      if (obj.material && obj.material._origEmissive) {
        obj.material.emissive.copy(obj.material._origEmissive);
        obj.material.emissiveIntensity = 0.3;
        delete obj.material._origEmissive;
      }
      obj.children.forEach(traverse);
    };
    traverse(mesh);
    document.body.style.cursor = 'default';
  }

  // ── Tooltip ─────────────────────────────────────
  _showTooltip(product) {
    const tt = document.getElementById('tooltip');
    if (!tt) return;

    const rows = [];
    if (product.brand)     rows.push(['Brand', product.brand]);
    if (product.processor) rows.push(['Processor', product.processor]);
    if (product.ram)       rows.push(['RAM', product.ram]);
    if (product.storage)   rows.push(['Storage', product.storage]);
    if (product.display)   rows.push(['Display', product.display]);
    if (product.battery)   rows.push(['Battery', product.battery]);
    if (product.os)        rows.push(['OS', product.os]);
    if (product.warranty)  rows.push(['Warranty', product.warranty + ' mo.']);

    tt.innerHTML = `
      <div class="tt-name">${product.name}</div>
      ${rows.map(([k,v]) => `<div class="tt-row"><span class="tt-label">${k}</span><span class="tt-value">${v}</span></div>`).join('')}
      <div class="tt-price">${fmtPrice(product.price)}</div>
    `;
    tt.classList.add('visible');
  }

  _hideTooltip() {
    const tt = document.getElementById('tooltip');
    if (tt) tt.classList.remove('visible');
  }

  // ── Dark / Light Mode ───────────────────────────
  setLightMode(isLight) {
    this.isLight = isLight;
    const bg = isLight ? 0xf0f2ff : 0x0d0d1a;
    const fog = isLight ? 0xf0f2ff : 0x0d0d1a;
    this.scene.background = new THREE.Color(bg);
    this.scene.fog        = new THREE.FogExp2(fog, isLight ? 0.025 : 0.035);
    this.ambientLight.color.setHex(isLight ? 0xffffff : 0x6666ff);
    this.ambientLight.intensity = isLight ? 0.9 : 0.4;
    this.grid.material.opacity = isLight ? 0.15 : 1;
    this.particles.material.color.setHex(isLight ? 0x5a52e8 : 0x6c63ff);
    this.particles.material.opacity = isLight ? 0.3 : 0.5;
  }

  // ── Resize ──────────────────────────────────────
  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

  // ── CSS2DRenderer Setup (called after DOM ready) ─
  initLabelRenderer() {
    this.labelRenderer = new THREE.CSS2DRenderer();
    this.labelRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top      = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.container.appendChild(this.labelRenderer.domElement);
  }

  // ── Events ──────────────────────────────────────
  _bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    this.renderer.domElement.addEventListener('mousemove', e => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
      this.mouse.y = ((e.clientY - rect.top)  / rect.height) * -2 + 1;
      // Move tooltip
      const tt = document.getElementById('tooltip');
      if (tt && tt.classList.contains('visible')) {
        tt.style.left = (e.clientX + 18) + 'px';
        tt.style.top  = (e.clientY - 20) + 'px';
      }
    });
    this.renderer.domElement.addEventListener('mouseleave', () => {
      this.mouse.set(-9999, -9999);
      this._hideTooltip();
    });
    // Stop auto-rotate on drag
    this.renderer.domElement.addEventListener('pointerdown', () => {
      this.controls.autoRotate = false;
    });
    this.renderer.domElement.addEventListener('pointerup', () => {
      setTimeout(() => { this.controls.autoRotate = true; }, 3000);
    });
  }
}

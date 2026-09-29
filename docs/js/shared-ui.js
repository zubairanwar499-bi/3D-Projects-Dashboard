// =====================================================
// shared-ui.js — Dark/Light Mode + Nav for ALL pages
// Include this in every viz page
// =====================================================

// ── Dark / Light Mode ───────────────────────────────
let _lightMode = false;

function initDarkMode() {
  // Check URL param
  const theme = getURLParam('theme');
  if (theme === 'light') { _lightMode = true; applyMode(); }

  // Build toggle button if not already in DOM
  const btn = document.getElementById('mode-toggle');
  if (btn) { btn.addEventListener('click', toggleMode); }
}

function toggleMode() {
  _lightMode = !_lightMode;
  applyMode();
  // Notify parent PBI frame
  try { window.parent.postMessage(JSON.stringify({ type:'theme', light:_lightMode }), '*'); } catch(e){}
}

function applyMode() {
  document.body.classList.toggle('light-mode', _lightMode);
  const icon  = document.getElementById('mode-icon');
  const label = document.getElementById('mode-label');
  if (icon)  icon.textContent  = _lightMode ? '☀️' : '🌙';
  if (label) label.textContent = _lightMode ? 'Light' : 'Dark';

  // Notify any active scene
  if (window._scene3d && window._scene3d.setLightMode) {
    window._scene3d.setLightMode(_lightMode);
  }
}

// ── Shared Nav HTML Builder ──────────────────────────
function buildNav(title, backURL) {
  return `
    <nav id="topbar">
      <a href="${backURL||'../index.html'}" style="text-decoration:none">
        <button class="cat-pill">← Back</button>
      </a>
      <span class="logo">${title}</span>
      <button id="mode-toggle" onclick="toggleMode()" style="margin-left:auto">
        <span class="icon" id="mode-icon">🌙</span>
        <span id="mode-label">Dark</span>
      </button>
    </nav>`;
}

// ── CSS Variables Bridge ─────────────────────────────
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ── Resize Helper ────────────────────────────────────
function onResize(cb) {
  window.addEventListener('resize', cb);
  window.addEventListener('orientationchange', cb);
}

// ── Three.js Helpers ────────────────────────────────
function makeTextSprite(text, opts = {}) {
  const size    = opts.size    || 128;
  const color   = opts.color   || '#e8e8ff';
  const bg      = opts.bg      || 'rgba(20,20,50,0.7)';
  const canvas  = document.createElement('canvas');
  canvas.width  = 512;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = `bold ${size * 0.55}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(opts.width || 2, opts.height || 0.4, 1);
  return sprite;
}

// ── Tooltip Helper ───────────────────────────────────
function setupTooltip() {
  let tt = document.getElementById('tooltip');
  if (!tt) {
    tt = document.createElement('div');
    tt.id = 'tooltip';
    document.body.appendChild(tt);
  }
  return tt;
}

function showTooltip(html, x, y) {
  const tt = document.getElementById('tooltip');
  if (!tt) return;
  tt.innerHTML = html;
  tt.style.left = (x + 14) + 'px';
  tt.style.top  = (y - 10) + 'px';
  tt.classList.add('visible');
}

function hideTooltip() {
  const tt = document.getElementById('tooltip');
  if (tt) tt.classList.remove('visible');
}

// Auto-init on load
window.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  setupTooltip();
});

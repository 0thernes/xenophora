export class HudController {
  constructor(callbacks) {
    this.cb = callbacks;
    this.el = {
      hud: document.getElementById('hud'),
      btnShowHud: document.getElementById('btn-show-hud'),
      regimeCode: document.getElementById('regime-code'),
      regimeSubtitle: document.getElementById('regime-subtitle'),
      statFps: document.getElementById('stat-fps'),
      statSpp: document.getElementById('stat-spp'),
      stat4d: document.getElementById('stat-4d'),
      statFocus: document.getElementById('stat-focus'),
      statMode: document.getElementById('stat-mode'),
      inspector: document.getElementById('inspector'),
      btnDrawer: document.getElementById('btn-drawer'),
      btnCloseInspector: document.getElementById('btn-close-inspector'),
      specimenBtns: [...document.querySelectorAll('.spec-btn')],
      btnRefine: document.getElementById('btn-refine'),
      btnMutate: document.getElementById('btn-mutate'),
      btnOrbit: document.getElementById('btn-orbit'),
      btnAudio: document.getElementById('btn-audio'),
      btnCapture: document.getElementById('btn-capture'),
      btnHide: document.getElementById('btn-hide'),
      btnSeedSpiral: document.getElementById('btn-seed-spiral'),
      btnSeedRing: document.getElementById('btn-seed-ring'),
      pdePreview: document.getElementById('pde-preview'),
      reticle: document.getElementById('inject-reticle'),
      toast: document.getElementById('toast'),
    };

    this.sliders = [
      ['rot4d', 'sl-rot4d', 'val-rot4d', (v) => v.toFixed(2)],
      ['rot4d2', 'sl-rot4d2', 'val-rot4d2', (v) => v.toFixed(2)],
      ['foldGain', 'sl-fold', 'val-fold', (v) => v.toFixed(2)],
      ['morph', 'sl-morph', 'val-morph', (v) => v.toFixed(2)],
      ['slice', 'sl-slice', 'val-slice', (v) => (v <= -0.98 ? 'OFF' : v.toFixed(2))],
      ['c1', 'sl-c1', 'val-c1', (v) => v.toFixed(2)],
      ['c2', 'sl-c2', 'val-c2', (v) => v.toFixed(2)],
      ['relief', 'sl-relief', 'val-relief', (v) => v.toFixed(2)],
      ['glow', 'sl-glow', 'val-glow', (v) => v.toFixed(2)],
      ['filmNm', 'sl-film', 'val-film', (v) => Math.round(v).toString()],
      ['irid', 'sl-irid', 'val-irid', (v) => v.toFixed(2)],
      ['sparkle', 'sl-sparkle', 'val-sparkle', (v) => v.toFixed(2)],
      ['vol', 'sl-vol', 'val-vol', (v) => v.toFixed(2)],
      ['aperture', 'sl-aperture', 'val-aperture', (v) => v.toFixed(3)],
      ['exposure', 'sl-exposure', 'val-exposure', (v) => v.toFixed(2)],
    ];

    this.toastTimer = null;
    this.hudHidden = false;
    this._bindEvents();
  }

  _bindEvents() {
    for (const btn of this.el.specimenBtns) {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.regime);
        this.cb.onSelectRegime(id);
      });
    }

    this.el.btnDrawer.addEventListener('click', () => this.toggleInspector());
    this.el.btnCloseInspector.addEventListener('click', () => this.toggleInspector(false));
    this.el.btnRefine.addEventListener('click', () => this.cb.onToggleRefine());
    this.el.btnMutate.addEventListener('click', () => this.cb.onMutate());
    this.el.btnOrbit.addEventListener('click', () => this.cb.onToggleOrbit());
    this.el.btnAudio.addEventListener('click', () => this.cb.onToggleAudio());
    this.el.btnCapture.addEventListener('click', () => this.cb.onCapture());
    this.el.btnHide.addEventListener('click', () => this.setHudHidden(true));
    this.el.btnShowHud.addEventListener('click', () => this.setHudHidden(false));

    this.el.btnSeedSpiral.addEventListener('click', () => this.cb.onSeedPDE(0));
    this.el.btnSeedRing.addEventListener('click', () => this.cb.onSeedPDE(1));

    // Clicking/dragging directly on the live CGLE PDE monitor injects spiral vortices!
    let pdeDown = false;
    const injectFromPde = (e) => {
      const rect = this.el.pdePreview.getBoundingClientRect();
      const u = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const v = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      this.cb.onDirectPdeInject(u, v);
    };
    this.el.pdePreview.addEventListener('pointerdown', (e) => {
      pdeDown = true;
      injectFromPde(e);
    });
    window.addEventListener('pointermove', (e) => {
      if (pdeDown) injectFromPde(e);
    });
    window.addEventListener('pointerup', () => {
      pdeDown = false;
    });

    for (const [key, slId, valId, fmt] of this.sliders) {
      const sl = document.getElementById(slId);
      const valEl = document.getElementById(valId);
      sl.addEventListener('input', () => {
        const val = parseFloat(sl.value);
        valEl.textContent = fmt(val);
        this.cb.onParamChange(key, val);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const k = e.key.toLowerCase();
      if (k >= '1' && k <= '6') {
        this.cb.onSelectRegime(Number(k) - 1);
      } else if (e.code === 'Space') {
        e.preventDefault();
        this.cb.onToggleRefine();
      } else if (k === 'm') {
        this.cb.onMutate();
      } else if (k === 'c') {
        this.cb.onToggleOrbit();
      } else if (k === 'a') {
        this.cb.onToggleAudio();
      } else if (k === 'p') {
        this.cb.onCapture();
      } else if (k === 'h') {
        this.setHudHidden(!this.hudHidden);
      } else if (k === 'i') {
        this.toggleInspector();
      } else if (k === 'r') {
        this.cb.onResetCamera();
      }
    });
  }

  toggleInspector(force) {
    const collapsed = force !== undefined ? !force : !this.el.inspector.classList.contains('collapsed');
    this.el.inspector.classList.toggle('collapsed', collapsed);
    this.el.btnDrawer.classList.toggle('active', !collapsed);
  }

  setHudHidden(hidden) {
    this.hudHidden = hidden;
    this.el.hud.classList.toggle('hidden', hidden);
    this.el.btnShowHud.classList.toggle('hidden', !hidden);
  }

  syncRegime(regime, params) {
    this.el.regimeCode.textContent = regime.code;
    this.el.regimeSubtitle.textContent = regime.subtitle;
    for (const btn of this.el.specimenBtns) {
      btn.classList.toggle('active', Number(btn.dataset.regime) === regime.id);
    }
    this.syncParams(params);
  }

  syncParams(params) {
    for (const [key, slId, valId, fmt] of this.sliders) {
      const sl = document.getElementById(slId);
      const valEl = document.getElementById(valId);
      const v = params[key];
      if (v !== undefined) {
        sl.value = v;
        valEl.textContent = fmt(v);
      }
    }
  }

  syncModes({ refining, driftEnabled, audioEnabled }) {
    this.el.btnRefine.classList.toggle('refining', refining);
    this.el.btnRefine.textContent = refining ? 'LIVE' : 'REFINE';
    this.el.statMode.textContent = refining ? 'PATH REFINE' : 'LIVE PDE';
    this.el.statMode.classList.toggle('refining', refining);
    this.el.btnOrbit.classList.toggle('active', driftEnabled);
    this.el.btnAudio.classList.toggle('active', audioEnabled);
  }

  updateTelemetry({ fps, spp, rot4d, focusDist }) {
    this.el.statFps.textContent = Math.round(fps);
    this.el.statSpp.textContent = spp;
    this.el.stat4d.textContent = rot4d.toFixed(2);
    this.el.statFocus.textContent = focusDist.toFixed(2);
  }

  pulseReticle(clientX, clientY) {
    const r = this.el.reticle;
    r.style.left = `${clientX}px`;
    r.style.top = `${clientY}px`;
    r.classList.remove('pulse');
    void r.offsetWidth;
    r.classList.add('pulse');
  }

  toast(msg) {
    const t = this.el.toast;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }
}

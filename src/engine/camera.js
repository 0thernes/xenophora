function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function norm3(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export class OrbitalCamera {
  constructor() {
    this.yaw = 0.16;
    this.pitch = 0.08;
    this.dist = 3.15;
    this.target = [0, 0.02, 0];
    this.fov = 46;
    this.focusDist = 2.95;

    this.tYaw = this.yaw;
    this.tPitch = this.pitch;
    this.tDist = this.dist;
    this.tTarget = [...this.target];
    this.tFov = this.fov;
    this.tFocusDist = this.focusDist;

    this.driftEnabled = true;
    this.isDragging = false;
    this.lastMoveTime = 0;
  }

  applyPreset(camPreset, instant = false) {
    this.tYaw = camPreset.yaw;
    this.tPitch = camPreset.pitch;
    this.tDist = camPreset.dist;
    this.tTarget = [...camPreset.target];
    this.tFov = camPreset.fov;
    this.tFocusDist = camPreset.focusDist;

    if (instant) {
      this.yaw = this.tYaw;
      this.pitch = this.tPitch;
      this.dist = this.tDist;
      this.target = [...this.tTarget];
      this.fov = this.tFov;
      this.focusDist = this.tFocusDist;
    }
  }

  orbit(dx, dy) {
    this.tYaw -= dx * 0.0058;
    this.tPitch = clamp(this.tPitch + dy * 0.0052, -1.32, 1.32);
    this.lastMoveTime = performance.now();
  }

  pan(dx, dy) {
    const basis = this.getBasis();
    const scale = this.dist * 0.0014;
    for (let i = 0; i < 3; i++) {
      this.tTarget[i] += (-basis.right[i] * dx + basis.up[i] * dy) * scale;
    }
    this.lastMoveTime = performance.now();
  }

  zoom(deltaY) {
    const factor = Math.exp(deltaY * 0.0011);
    this.tDist = clamp(this.tDist * factor, 0.42, 7.5);
    this.tFocusDist = clamp(this.tDist * 0.92, 0.35, 7.5);
    this.lastMoveTime = performance.now();
  }

  setFocusDistance(d) {
    this.tFocusDist = clamp(d, 0.25, 9.0);
    this.lastMoveTime = performance.now();
  }

  update(dt, paused) {
    let moved = false;

    if (this.driftEnabled && !this.isDragging && !paused) {
      this.tYaw += dt * 0.068;
      moved = true;
    }

    const alpha = 1 - Math.exp(-dt * 9.5);
    const dyaw = this.tYaw - this.yaw;
    const dpitch = this.tPitch - this.pitch;
    const ddist = this.tDist - this.dist;
    const dfov = this.tFov - this.fov;
    const dfoc = this.tFocusDist - this.focusDist;
    const dt0 = this.tTarget[0] - this.target[0];
    const dt1 = this.tTarget[1] - this.target[1];
    const dt2 = this.tTarget[2] - this.target[2];

    const deltaMag =
      Math.abs(dyaw) + Math.abs(dpitch) + Math.abs(ddist) +
      Math.abs(dfov) * 0.01 + Math.abs(dfoc) * 0.1 +
      Math.abs(dt0) + Math.abs(dt1) + Math.abs(dt2);

    if (deltaMag > 1e-4) {
      this.yaw += dyaw * alpha;
      this.pitch += dpitch * alpha;
      this.dist += ddist * alpha;
      this.fov += dfov * alpha;
      this.focusDist += dfoc * alpha;
      this.target[0] += dt0 * alpha;
      this.target[1] += dt1 * alpha;
      this.target[2] += dt2 * alpha;
      moved = true;
    }

    return moved;
  }

  getBasis() {
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);

    const pos = [
      this.target[0] + this.dist * cp * sy,
      this.target[1] + this.dist * sp,
      this.target[2] + this.dist * cp * cy,
    ];

    const fwd = norm3([
      this.target[0] - pos[0],
      this.target[1] - pos[1],
      this.target[2] - pos[2],
    ]);

    const worldUp = [0, 1, 0];
    const right = norm3(cross3(fwd, worldUp));
    const up = norm3(cross3(right, fwd));

    return {
      pos,
      fwd,
      right,
      up,
      fovTan: Math.tan((this.fov * Math.PI) / 360),
    };
  }
}

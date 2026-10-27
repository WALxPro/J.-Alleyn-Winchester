import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { W, C, info } from '../data';
import { RM } from './shared.jsx';

/** WebGL solar system. `selected` is read each frame via ref; onSelect fires on click/tap. */
export default function GalaxyScene({ selected, onSelect, onFail }) {
  const cv = useRef(null), tip = useRef(null), selRef = useRef(selected), cb = useRef(onSelect);
  selRef.current = selected; cb.current = onSelect;

  useEffect(() => {
    const canvas = cv.current, hero = canvas.parentElement;
    let R;
    try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { onFail?.(); return; }
    const mob = innerWidth < 800, S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    R.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 2));
    const col = (c) => new THREE.Color(c), pick = [];
    S.add(new THREE.AmbientLight(0x6a6a9a, 0.5));
    S.add(new THREE.PointLight(0xffc27a, 2.4, 80));
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 48), new THREE.MeshBasicMaterial({ color: 0xffb25a })); S.add(sun);

    const gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const x = gc.getContext('2d'), g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, '#fff3c4ee'); g.addColorStop(0.3, '#ff9b54aa'); g.addColorStop(0.6, '#f27c9e33'); g.addColorStop(1, '#0000');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false })); S.add(glow);

    const sp = new Float32Array((mob ? 700 : 2000) * 3);
    for (let i = 0; i < sp.length; i += 3) { const r = 40 + Math.random() * 60, a = Math.random() * 6.28, b = Math.acos(2 * Math.random() - 1); sp[i] = r * Math.sin(b) * Math.cos(a); sp[i + 1] = r * Math.cos(b); sp[i + 2] = r * Math.sin(b) * Math.sin(a); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.25, color: 0xffffff, transparent: true, opacity: 0.8 })); S.add(stars);

    const planets = W.map((w) => {
      const grp = new THREE.Group(); grp.rotation.x = w.tilt; S.add(grp);
      const b = w.a * 0.82, pts = [];
      for (let i = 0; i <= 128; i++) { const t = (i / 128) * 6.283; pts.push(new THREE.Vector3(Math.cos(t) * w.a, 0, Math.sin(t) * b)); }
      const ol = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col(w.c), transparent: true, opacity: 0.22 })); grp.add(ol);
      const geo = w.top ? new THREE.OctahedronGeometry(w.r, 0) : new THREE.SphereGeometry(w.r, 32, 32);
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col(w.c), roughness: 0.7, emissive: col(w.c), emissiveIntensity: 0.15 }));
      if (w.top) m.scale.y = 1.5;
      if (w.ring) { const rg = new THREE.Mesh(new THREE.RingGeometry(w.r * 1.5, w.r * 2.2, 48), new THREE.MeshBasicMaterial({ color: col(w.c), side: THREE.DoubleSide, transparent: true, opacity: 0.6 })); rg.rotation.x = 1.2; m.add(rg); }
      m.userData = { n: w.n }; grp.add(m); pick.push(m);
      return { w, m, ol, ph: Math.random() * 6.28, b };
    });

    const bn = mob ? 160 : 420;
    const belt = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.08, 0), new THREE.MeshStandardMaterial({ color: 0x8a8298, roughness: 1 }), bn);
    const dm = new THREE.Object3D(), bg = new THREE.Group(); bg.rotation.x = 0.1; S.add(bg);
    for (let i = 0; i < bn; i++) { const a = Math.random() * 6.28, r = 6.3 + Math.random() * 1.1; dm.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.3, Math.sin(a) * r * 0.82); dm.rotation.set(Math.random() * 3, Math.random() * 3, 0); dm.scale.setScalar(0.5 + Math.random() * 1.6); dm.updateMatrix(); belt.setMatrixAt(i, dm.matrix); }
    bg.add(belt); belt.userData = { n: 'belt' }; pick.push(belt);

    const comets = C.map((c, i) => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), new THREE.MeshBasicMaterial({ color: col(c.c) })); h.userData = { n: c.n }; S.add(h); pick.push(h);
      const N = 26, tg = new THREE.BufferGeometry(), cl = new Float32Array(N * 3), cc = col(c.c);
      for (let j = 0; j < N; j++) { const f = 1 - j / N; cl.set([cc.r * f, cc.g * f, cc.b * f], j * 3); }
      tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); tg.setAttribute('color', new THREE.BufferAttribute(cl, 3));
      const tail = new THREE.Line(tg, new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, transparent: true })); tail.frustumCulled = false; S.add(tail);
      return { c, h, tail, N, i, hist: [] };
    });

    let hov = null, mx = 0, my = 0, zoom = 1;
    const rc = new THREE.Raycaster(), mp = new THREE.Vector2();
    const hit = (e) => { const r = canvas.getBoundingClientRect(); mp.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); rc.setFromCamera(mp, cam); const h = rc.intersectObjects(pick)[0]; return h ? h.object.userData.n : null; };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
      hov = hit(e); canvas.style.cursor = hov ? 'pointer' : '';
      const t = tip.current;
      if (hov) { const i = info(hov); t.style.display = 'block'; t.style.left = e.clientX - r.left + 14 + 'px'; t.style.top = e.clientY - r.top + 14 + 'px'; t.textContent = `${i.t} — ${i.sub}`; } else t.style.display = 'none';
    };
    const onDown = (e) => { const n = hit(e); if (n) cb.current(n); };
    canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerdown', onDown);

    const size = () => { const w = hero.clientWidth, h = hero.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; zoom = w / h < 1 ? 1.9 : w / h < 1.3 ? 1.3 : 1; cam.updateProjectionMatrix(); };
    size(); addEventListener('resize', size);

    let raf, t0 = performance.now(), vis = true;
    const iob = new IntersectionObserver(([e]) => (vis = e.isIntersecting)); iob.observe(hero);
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!vis || document.hidden) return;
      const dt = Math.min((now - t0) / 1000, 0.05); t0 = now; const k = RM ? 0.15 : 1, sel = selRef.current;
      const sc = scrollY / innerHeight;
      cam.position.set(mx * 2.2, 6.5 * zoom - my * 1.2, 17 * zoom + sc * 4); cam.lookAt(0, zoom > 1 ? -2 : -1.2, 0);
      sun.scale.setScalar(1 + Math.sin(now / 900) * 0.02); glow.scale.setScalar(9 + Math.sin(now / 1100) * 0.4);
      stars.rotation.y += dt * 0.004 * k; bg.rotation.y += dt * 0.03 * k;
      planets.forEach((p) => {
        const hv = hov === p.w.n || sel === p.w.n;
        if (!hv) p.ph += dt * p.w.sp * k;
        p.m.position.set(Math.cos(p.ph) * p.w.a, 0, Math.sin(p.ph) * p.b); p.m.rotation.y += dt * 0.8 * k;
        const s = p.m.scale.x, ts = hv ? 1.3 : 1; p.m.scale.x = p.m.scale.z = s + (ts - s) * 0.15; if (!p.w.top) p.m.scale.y = p.m.scale.x;
        p.ol.material.opacity += ((hv ? 0.9 : 0.22) - p.ol.material.opacity) * 0.15;
      });
      comets.forEach((o) => {
        const t = (now / 1000) * 0.12 * k + o.i * 1.6, a = 16 + o.i * 1.5, b = 7 + o.i * 0.8;
        const p = new THREE.Vector3(Math.cos(t) * a, 2.5 + Math.sin(t * 1.7 + o.i) * 2.5 - o.i * 0.6, Math.sin(t) * b - 2);
        o.h.position.copy(p); o.h.scale.setScalar(hov === o.c.n || sel === o.c.n ? 1.8 : 1);
        o.hist.unshift(p); if (o.hist.length > o.N) o.hist.pop();
        const pa = o.tail.geometry.attributes.position;
        for (let j = 0; j < o.N; j++) { const q = o.hist[Math.min(j, o.hist.length - 1)]; pa.setXYZ(j, q.x, q.y, q.z); }
        pa.needsUpdate = true;
      });
      R.render(S, cam);
    };
    raf = requestAnimationFrame(loop);

    return () => { // full GPU cleanup
      cancelAnimationFrame(raf); removeEventListener('resize', size); iob.disconnect();
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerdown', onDown);
      S.traverse((o) => { o.geometry?.dispose(); [].concat(o.material || []).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
      R.dispose();
    };
  }, []);

  return (<><canvas id="cv" ref={cv} aria-hidden="true" /><div id="tip" ref={tip} /></>);
}

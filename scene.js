/* ============================================================
   Домова Кухня — three.js hero scene
   Floating jerky-pack labels + drifting spice embers
   + mouse parallax + scroll dolly
   ============================================================ */
(function () {
  if (typeof THREE === "undefined") { console.warn("THREE not loaded"); return; }

  const canvas = document.getElementById("scene");
  const hero = document.getElementById("home");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function res(p) { return (window.__resources && window.__resources[p]) || p; }

  const LABELS = [
    "images/hot_chili.png", "images/papryka.jpg", "images/imbur.png",
    "images/onion_bazilik.png", "images/italy_travy.png", "images/franc_girchytsa.jpg",
    "images/tomamo_zelen.png", "images/clasic_sil.jpg"
  ];

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const root = new THREE.Group();
  scene.add(root);

  let baseCamZ = 9.5; // adjusted on resize for viewport aspect

  /* ---------------- floating pack labels ---------------- */
  const loader = new THREE.TextureLoader();
  const cards = [];
  // spread positions around the viewport (packs float behind/around the headline)
  const layout = [
    { x: -4.2, y: 1.6, z: -0.5, s: 2.5 },
    { x: 4.8, y: 2.0, z: -1.6, s: 2.2 },
    { x: -3.0, y: -2.2, z: 0.6, s: 1.9 },
    { x: 3.6, y: -1.8, z: 0.9, s: 2.0 },
    { x: 0.3, y: 3.0, z: -3.0, s: 1.7 },
    { x: 6.2, y: -0.3, z: -3.4, s: 1.9 },
    { x: -5.6, y: -0.2, z: -3.0, s: 1.7 },
    { x: 1.8, y: -3.1, z: -2.0, s: 1.6 }
  ];

  LABELS.forEach((src, i) => {
    const cfg = layout[i % layout.length];
    loader.load(res(src), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const iw = tex.image.width || 4, ih = tex.image.height || 5;
      const aspect = iw / ih;
      const h = cfg.s, w = h * aspect;
      const geo = new THREE.PlaneGeometry(w, h, 1, 1);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.rotation.set((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.18);
      mesh.userData = {
        baseX: cfg.x, baseY: cfg.y, baseZ: cfg.z,
        phase: Math.random() * Math.PI * 2,
        floatAmp: 0.22 + Math.random() * 0.25,
        floatSpeed: 0.4 + Math.random() * 0.35,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        spin: 0.15 + Math.random() * 0.2
      };
      // pop-in
      mesh.scale.setScalar(0.4);
      root.add(mesh);
      cards.push(mesh);
      window.__dbg = { cards: cards.length, camZ: baseCamZ };
    }, undefined, (err) => { console.error("texture failed", src, err); });
  });

  /* ---------------- spice / ember particles ---------------- */
  const COUNT = reduceMotion ? 140 : 480;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  const seed = new Float32Array(COUNT);
  const range = { x: 22, y: 14, z: 14 };
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * range.x;
    pos[i * 3 + 1] = (Math.random() - 0.5) * range.y;
    pos[i * 3 + 2] = (Math.random() - 0.5) * range.z - 2;
    speed[i] = 0.18 + Math.random() * 0.5;
    seed[i] = Math.random() * Math.PI * 2;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const sprite = makeSpark();
  const pMat = new THREE.PointsMaterial({
    size: 0.16, map: sprite, transparent: true, opacity: 0.9,
    depthWrite: false, blending: THREE.AdditiveBlending, color: 0xff8a3a
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // a second cooler dust layer
  const dustGeo = new THREE.BufferGeometry();
  const dustN = reduceMotion ? 80 : 240;
  const dpos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    dpos[i * 3] = (Math.random() - 0.5) * range.x;
    dpos[i * 3 + 1] = (Math.random() - 0.5) * range.y;
    dpos[i * 3 + 2] = (Math.random() - 0.5) * range.z - 4;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.06, map: sprite, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xfff0d8 });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  function makeSpark() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.3, "rgba(255,220,170,0.9)");
    grd.addColorStop(1, "rgba(255,140,60,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    return t;
  }

  /* ---------------- interaction state ---------------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5);
    mouse.ty = (e.clientY / window.innerHeight - 0.5);
  });

  let scrollT = 0;
  window.addEventListener("scroll", () => {
    const h = window.innerHeight;
    scrollT = Math.min(window.scrollY / h, 1);
  }, { passive: true });

  /* ---------------- resize ---------------- */
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    // pull the camera back on narrow / portrait viewports so packs stay in frame
    baseCamZ = aspect < 1.1 ? 13.5 : aspect < 1.5 ? 10.8 : 9.5;
    camera.position.z = baseCamZ;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------------- render loop ---------------- */
  let running = true;
  const io = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
    if (running) clock.start();
  }, { threshold: 0.01 });
  io.observe(hero);

  const clock = new THREE.Clock();
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;

    // smooth mouse
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // camera parallax + subtle scroll dolly
    camera.position.x = mouse.x * 1.4;
    camera.position.y = -mouse.y * 1.0 + scrollT * 1.5;
    camera.lookAt(scrollT * 1.2, scrollT * 0.4, 0);

    // fade whole hero scene out as you scroll past
    const fade = 1 - scrollT;

    cards.forEach((m) => {
      const u = m.userData;
      m.position.y = u.baseY + Math.sin(t * u.floatSpeed + u.phase) * u.floatAmp;
      m.position.x = u.baseX + Math.cos(t * u.floatSpeed * 0.7 + u.phase) * u.floatAmp * 0.5;
      m.rotation.y += u.rotSpeed * dt;
      m.rotation.z = Math.sin(t * 0.3 + u.phase) * 0.05;
      // pop-in scale + opacity
      const targetScale = 1;
      m.scale.x += (targetScale - m.scale.x) * 0.06;
      m.scale.y += (targetScale - m.scale.y) * 0.06;
      m.scale.z = m.scale.x;
      m.material.opacity += (fade - m.material.opacity) * 0.08;
    });

    // particles rise & wrap
    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speed[i] * dt;
      arr[i * 3] += Math.sin(t * 0.5 + seed[i]) * 0.004;
      if (arr[i * 3 + 1] > range.y / 2) arr[i * 3 + 1] = -range.y / 2;
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = 0.9 * fade;

    const darr = dustGeo.attributes.position.array;
    for (let i = 0; i < dustN; i++) {
      darr[i * 3 + 1] += 0.06 * dt * 60 * 0.016;
      if (darr[i * 3 + 1] > range.y / 2) darr[i * 3 + 1] = -range.y / 2;
    }
    dustGeo.attributes.position.needsUpdate = true;
    dustMat.opacity = 0.4 * fade;

    points.rotation.y = mouse.x * 0.15;
    dust.rotation.y = mouse.x * 0.1;

    renderer.render(scene, camera);
  }
  animate();
})();

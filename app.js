/* ============================================================
   Домова Кухня — app logic
   Products, filters, reveals, counters, tilt, order burst
   ============================================================ */

const VIBER_LINK = "viber://chat?number=%2B380632858905";

// Resolve image paths through the standalone bundle map when present.
function res(p) { return (window.__resources && window.__resources[p]) || p; }

const products = [
  { name: "Гострий Чилі", description: "Насичений гострий смак для тих, хто любить виразний перець.", weight: "45 г · 100 г · 250 г · 500 г", price: "від 46 грн", badge: "Гостре", badgeType: "hot", category: "jerky", image: "images/hot_chili.png" },
  { name: "Пікантна паприка", description: "Тепла паприка, легка пікантність і збалансований аромат спецій.", weight: "45 г · 100 г · 250 г · 500 г", price: "від 46 грн", badge: "Хіт", badgeType: "", category: "jerky", image: "images/papryka.jpg" },
  { name: "Імбир та кунжут", description: "Пряний імбир, кунжутний акцент і делікатний післясмак.", weight: "45 г · 100 г · 200 г · 500 г", price: "від 46 грн", badge: "Новинка", badgeType: "new", category: "jerky", image: "images/imbur.png" },
  { name: "Цибуля та базилік", description: "Ароматна зелень, цибуля і м'який домашній смак.", weight: "45 г · 100 г · 200 г · 500 г", price: "від 46 грн", badge: "Хіт", badgeType: "", category: "jerky", image: "images/onion_bazilik.png" },
  { name: "Італійські трави", description: "Суміш трав із яскравим середземноморським характером.", weight: "45 г · 100 г · 200 г · 500 г", price: "від 46 грн", badge: "Новинка", badgeType: "new", category: "jerky", image: "images/italy_travy.png" },
  { name: "Французька гірчиця", description: "Гірчичний аромат, легка кислинка та щільний м'ясний смак.", weight: "45 г · 100 г · 200 г · 500 г", price: "від 46 грн", badge: "Хіт", badgeType: "", category: "jerky", image: "images/franc_girchytsa.jpg" },
  { name: "Томати та зелень", description: "Томатний відтінок, зелень і приємна пряність без надмірної гостроти.", weight: "45 г · 100 г · 200 г · 500 г", price: "від 46 грн", badge: "Новинка", badgeType: "new", category: "jerky", image: "images/tomamo_zelen.png" },
  { name: "Класичні", description: "Чистий м'ясний смак, помірні спеції та універсальний формат для всіх.", weight: "45 г · 100 г · 250 г · 500 г", price: "від 46 грн", badge: "Хіт", badgeType: "", category: "jerky", image: "images/clasic_sil.jpg" },
  { name: "Свинина пікантна", description: "Пікантна свинина під замовлення від 1 кг. Доступні різні фасування.", weight: "40 г · 100 г · 250 г · 500 г", price: "уточнюйте", badge: "Під замовлення", badgeType: "new", category: "jerky", image: "images/pig_pikantna.jpg" },
  { name: "Ковбаски Хмизок", description: "Сушені м'ясні ковбаски для перекусу, наборів і продажу у фасуванні.", weight: "75 г · 100 г · 250 г · 500 г", price: "уточнюйте", badge: "Інше", badgeType: "", category: "other", image: "images/hmyzok.png" },
  { name: "Баличок аля карпачо", description: "Нарізка у вакуумній упаковці з делікатним м'ясним смаком.", weight: "50 г · 100 г", price: "уточнюйте", badge: "Вакуум", badgeType: "new", category: "other", image: "images/balyk_karpacho.png" },
  { name: "Крафтова пачка", description: "Пакування для джерків у теплій крафтовій стилістиці.", weight: "від 5 пачок", price: "від 106 грн", badge: "Пачка", badgeType: "", category: "packaging", image: "images/kraft_paper.jpg" },
  { name: "Чорна пачка", description: "Стримане преміальне пакування для готової продукції.", weight: "від 5 пачок", price: "від 106 грн", badge: "Пачка", badgeType: "", category: "packaging", image: "images/kraft_black.jpg" },
  { name: "Біла пачка", description: "Світле мінімалістичне пакування для джерків і снеків.", weight: "від 5 пачок", price: "від 106 грн", badge: "Пачка", badgeType: "", category: "packaging", image: "images/kraft_white.jpg" }
];

const priceTabs = [
  { id: "vagovi", label: "Вагові", title: "Джерки вагові", headers: ["Кількість", "Ціна"], rows: [["500 г", "495 грн"], ["1 кг", "970 грн"], ["від 3 кг", "940 грн/кг"], ["від 5 кг", "930 грн/кг"], ["від 10 кг", "920 грн/кг"], ["від 20 кг", "910 грн/кг"], ["від 30 кг", "900 грн/кг"], ["від 50 кг", "880 грн/кг"]] },
  { id: "45", label: "45 г", title: "Фасування 45 г", headers: ["Кількість", "Ціна за шт"], rows: [["мінімум 12 шт", "55 грн"], ["від 25 шт", "52 грн"], ["від 50 шт", "51 грн"], ["від 100 шт", "50 грн"], ["від 200 шт", "49 грн"], ["від 300 шт", "48 грн"], ["від 500 шт", "46 грн"]] },
  { id: "75", label: "75 г", title: "Фасування 75 г", headers: ["Кількість", "Ціна за шт"], rows: [["від 5 шт", "85 грн"], ["від 10 шт", "83 грн"], ["від 20 шт", "82 грн"], ["від 50 шт", "80 грн"], ["від 100 шт", "78 грн"], ["від 200 шт", "76 грн"]] },
  { id: "100", label: "100 г", title: "Фасування 100 г", headers: ["Кількість", "Ціна за шт"], rows: [["від 5 шт", "110 грн"], ["від 10 шт", "109 грн"], ["від 20 шт", "108 грн"], ["від 50 шт", "106 грн"], ["від 100 шт", "103 грн"], ["від 200 шт", "100 грн"]] },
  { id: "200", label: "200 г", title: "Фасування 200 г", headers: ["Кількість", "Ціна за шт"], rows: [["від 5 шт", "215 грн"], ["від 10 шт", "212 грн"], ["від 20 шт", "210 грн"], ["від 50 шт", "206 грн"], ["від 100 шт", "202 грн"], ["від 200 шт", "198 грн"]] },
  { id: "250", label: "250 г", title: "Фасування 250 г", headers: ["Кількість", "Ціна за шт"], rows: [["від 5 шт", "250 грн"], ["від 10 шт", "248 грн"], ["від 20 шт", "246 грн"], ["від 50 шт", "244 грн"], ["від 100 шт", "242 грн"], ["від 200 шт", "240 грн"]] },
  { id: "pack", label: "Пачки", title: "Пачки (крафт / чорна / біла)", headers: ["Кількість", "Ціна за пачку"], rows: [["від 5 пачок", "120 грн"], ["від 10 пачок", "116 грн"], ["від 20 пачок", "114 грн"], ["від 30 пачок", "112 грн"], ["від 50 пачок", "110 грн"], ["від 100 пачок", "106 грн"]] },
  { id: "order", label: "Під замовлення", title: "Під замовлення", headers: ["Товар", "Умови"], rows: [["Свинина пікантна", "від 1 кг, уточнюйте"], ["Ковбаски Хмизок", "75–500 г, уточнюйте"], ["Баличок карпачо", "вакуум, уточнюйте"]] }
];

const productGrid = document.querySelector("#productGrid");
const priceTabsRoot = document.querySelector("#priceTabs");
const pricePanel = document.querySelector("#pricePanel");
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/* ---------- render products ---------- */
function renderProducts(filter = "all") {
  const list = filter === "all" ? products : products.filter(p => p.category === filter);
  productGrid.innerHTML = list.map((p, i) => `
    <article class="product-card reveal-up" data-category="${p.category}" style="transition-delay:${Math.min(i, 8) * 55}ms">
      <span class="glow"></span>
      <div class="product-image">
        <img src="${res(p.image)}" alt="${p.name}" loading="lazy">
        <span class="badge ${p.badgeType}">${p.badge}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-meta"><span>${p.weight}</span></div>
        <div class="product-foot">
          <span class="price">${p.price}</span>
          <button class="btn order-btn" type="button" data-product="${p.name}">Замовити</button>
        </div>
      </div>
    </article>`).join("");
  observeReveals(productGrid.querySelectorAll(".reveal-up"));
  attachTilt(productGrid.querySelectorAll(".product-card"));
}

function renderPricePanel(tab) {
  pricePanel.innerHTML = `
    <article class="price-panel">
      <h3>${tab.title}</h3>
      <table class="price-table">
        <thead><tr>${tab.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${tab.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </article>`;
}

function renderPriceTables() {
  priceTabsRoot.innerHTML = priceTabs.map((t, i) =>
    `<button class="price-tab${i === 0 ? " active" : ""}" type="button" role="tab" data-tab="${t.id}">${t.label}</button>`
  ).join("");
  renderPricePanel(priceTabs[0]);
  priceTabsRoot.querySelectorAll(".price-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      priceTabsRoot.querySelectorAll(".price-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPricePanel(priceTabs.find(t => t.id === btn.dataset.tab));
    });
  });
}

/* ---------- scroll reveals ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

function observeReveals(nodes) { nodes.forEach(n => revealObserver.observe(n)); }

/* ---------- count-up ---------- */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1400; const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });

/* ---------- 3D tilt on cards ---------- */
function attachTilt(cards) {
  if (isMobile) return;
  cards.forEach(card => {
    const glow = card.querySelector(".glow");
    card.addEventListener("pointermove", (ev) => {
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      if (glow) { glow.style.setProperty("--mx", px * 100 + "%"); glow.style.setProperty("--my", py * 100 + "%"); }
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

/* ---------- order: viber + spice burst ---------- */
function orderBurst(x, y) {
  const colors = ["#f47b2a", "#ff5722", "#c74f1d", "#ffb45e", "#7c8a4e", "#fff7ea"];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    const size = 6 + Math.random() * 9;
    p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${colors[i % colors.length]};pointer-events:none;z-index:9999;will-change:transform,opacity;`;
    document.body.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 150;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist - 60;
    p.animate([
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx}px,${dy + 180}px) rotate(${Math.random() * 540}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: "cubic-bezier(0.22,1,0.36,1)" }).onfinish = () => p.remove();
  }
}

function openViber() { if (isMobile) window.location.href = VIBER_LINK; else document.querySelector("#contacts").scrollIntoView({ behavior: "smooth", block: "start" }); }

document.addEventListener("click", (ev) => {
  const orderBtn = ev.target.closest("[data-product]");
  const orderLink = ev.target.closest(".js-order-link");
  if (orderBtn) { orderBurst(ev.clientX, ev.clientY); setTimeout(openViber, 220); }
  if (orderLink) { ev.preventDefault(); orderBurst(ev.clientX, ev.clientY); setTimeout(openViber, 220); }
});

/* ---------- filters ---------- */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

/* ---------- header scroll + mobile nav ---------- */
const header = document.querySelector("#siteHeader");
window.addEventListener("scroll", () => { header.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* ---------- hero headline reveal (run immediately; DOM is ready) ---------- */
function revealHeadline() {
  document.querySelectorAll(".hero h1 .reveal").forEach((el, i) => {
    el.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
      { duration: 900, delay: 180 + i * 130, easing: "cubic-bezier(0.22,1,0.36,1)", fill: "forwards" });
  });
}
revealHeadline();

/* ---------- init ---------- */
renderProducts();
renderPriceTables();
observeReveals(document.querySelectorAll(".reveal-up"));
document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

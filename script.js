const body = document.body;
const canvas = document.getElementById("walkCanvas");
const ctx = canvas.getContext("2d");
const hero = new Image();
hero.src = "assets/interior.png";
const table = new Image();
table.src = "assets/hero-table.png";

const state = {
  width: 0,
  height: 0,
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  scroll: 0,
  target: 0,
  frames: [],
  frameReady: false
};

const menu = {
  south: {
    image: "assets/signature-thali.png",
    items: [
      ["Ghee Roast Dosa", "Fermented batter, podi dust, coconut chutney", "Rs. 169", "520 kcal", "Medium", "12 min", "Filter coffee", "Chef Choice"],
      ["Mini Tiffin Ritual", "Idli, vada, pongal, sambar, kesari", "Rs. 219", "690 kcal", "Mild", "15 min", "Rose milk", "Popular"],
      ["Uttapam Garden", "Onion, tomato, coriander, podi butter", "Rs. 149", "480 kcal", "Medium", "14 min", "Mango lassi", "New"]
    ]
  },
  cafe: {
    image: "assets/hero-table.png",
    items: [
      ["Paneer Melt Toast", "Herbed paneer, cheese, chilli crisp", "Rs. 189", "610 kcal", "Medium", "11 min", "Cold coffee", "Popular"],
      ["Masala Fries Bowl", "Curry leaf dust, house dip, lemon", "Rs. 129", "540 kcal", "Hot", "9 min", "Mint cooler", "Snack Star"],
      ["Veg Club Stack", "Triple layer, fresh veg, cafe sauce", "Rs. 229", "720 kcal", "Mild", "13 min", "Filter coffee", "Chef Choice"]
    ]
  },
  drinks: {
    image: "assets/drinks-dessert.png",
    items: [
      ["Brass Filter Coffee", "Strong decoction, frothy milk, jaggery note", "Rs. 89", "120 kcal", "None", "6 min", "Kesari", "Signature"],
      ["Rose Milk Float", "Chilled rose, basil seed, vanilla crown", "Rs. 129", "240 kcal", "None", "5 min", "Mini vada", "Popular"],
      ["Mango Lassi Cloud", "Mango, yogurt, saffron, pistachio", "Rs. 149", "310 kcal", "None", "7 min", "Dosa", "Seasonal"]
    ]
  },
  dessert: {
    image: "assets/drinks-dessert.png",
    items: [
      ["Kesari Gold", "Ghee, saffron, cashew, warm semolina", "Rs. 109", "330 kcal", "None", "8 min", "Filter coffee", "Chef Choice"],
      ["Payasam Cup", "Slow milk, cardamom, toasted nuts", "Rs. 119", "280 kcal", "None", "9 min", "Thali", "Comfort"],
      ["Cafe Sweet Flight", "Three mini sweets, one bright finish", "Rs. 199", "460 kcal", "None", "10 min", "Rose milk", "Popular"]
    ]
  }
};

const timeline = {
  morning: ["Filter coffee + mini tiffin", "Soft daylight, calm tables", "assets/hero-table.png", "#f8f6f2", "#fff2cf"],
  lunch: ["Signature thali", "Full plates, brighter energy", "assets/signature-thali.png", "#fffaf1", "#f4d28b"],
  evening: ["Rose milk + cafe bites", "Cooler tones, easy conversations", "assets/drinks-dessert.png", "#f4fbf8", "#c8eee4"],
  dinner: ["Dosa flight + sweets", "Golden light, slower finish", "assets/interior.png", "#fff4ec", "#d9b06a"]
};

const specials = [
  ["Ghee Roast Dosa Flight", "3 chutneys / crisp edge / Rs. 189"],
  ["Brass Filter Coffee Ritual", "strong decoction / frothy pour / Rs. 89"],
  ["Magizh Mini Tiffin", "idli / vada / pongal / sweet / Rs. 219"],
  ["Rose Milk Cloud", "basil seed / vanilla crown / Rs. 129"]
];

function resize() {
  state.width = innerWidth;
  state.height = innerHeight;
  state.dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function drawCover(image, x, y, w, h, scale = 1, ox = 0, oy = 0) {
  if (!image.complete || !image.naturalWidth) return;
  const ir = image.naturalWidth / image.naturalHeight;
  const ar = w / h;
  let dw = w * scale;
  let dh = h * scale;
  if (ir > ar) {
    dh = h * scale;
    dw = dh * ir;
  } else {
    dw = w * scale;
    dh = dw / ir;
  }
  ctx.drawImage(image, x + (w - dw) / 2 + ox, y + (h - dh) / 2 + oy, dw, dh);
}

function tryLoadFrames() {
  const attempts = [];
  for (let i = 1; i <= 24; i += 1) {
    const img = new Image();
    const num = String(i).padStart(4, "0");
    img.src = `../../public/frames/${num}.png`;
    attempts.push(img);
  }
  let loaded = 0;
  attempts.forEach(img => {
    img.onload = () => {
      loaded += 1;
      if (loaded > 6) {
        state.frames = attempts;
        state.frameReady = true;
      }
    };
  });
}

function drawCanvas() {
  state.scroll += (state.target - state.scroll) * 0.08;
  const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  const p = Math.min(state.scroll / max, 1);

  ctx.clearRect(0, 0, state.width, state.height);
  ctx.fillStyle = "#f8f6f2";
  ctx.fillRect(0, 0, state.width, state.height);

  if (state.frameReady) {
    const frame = state.frames[Math.min(state.frames.length - 1, Math.floor(p * state.frames.length))];
    drawCover(frame, 0, 0, state.width, state.height, 1.05);
  } else {
    drawCover(hero, 0, 0, state.width, state.height, 1.06 + p * 0.24, -p * 90, p * 28);
    ctx.globalAlpha = Math.max(0, 1 - p * 2.3);
    drawCover(table, state.width * 0.38, state.height * 0.2, state.width * 0.66, state.height * 0.72, 1.12 + p * 0.2, p * 70, 0);
    ctx.globalAlpha = 1;
  }

  const veil = ctx.createLinearGradient(0, 0, state.width, state.height);
  veil.addColorStop(0, `rgba(248,246,242,${0.86 - p * 0.24})`);
  veil.addColorStop(0.55, `rgba(248,246,242,${0.42 + p * 0.12})`);
  veil.addColorStop(1, `rgba(32,31,28,${0.04 + p * 0.1})`);
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, state.width, state.height);

  for (let i = 0; i < 32; i += 1) {
    const x = (Math.sin(i * 89 + p * 9) * 0.5 + 0.5) * state.width;
    const y = ((i * 97 + p * 1200) % state.height);
    ctx.fillStyle = `rgba(200,155,60,${0.08 + (i % 4) * 0.015})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawCanvas);
}

function renderMenu(category) {
  body.dataset.mood = category;
  document.querySelectorAll(".chips button").forEach(btn => btn.classList.toggle("active", btn.dataset.category === category));
  const stage = document.querySelector(".food-stage");
  stage.innerHTML = menu[category].items.map(item => `
    <article class="food-card">
      <span class="badge">${item[7]}</span>
      <img src="${menu[category].image}" alt="${item[0]}">
      <div>
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
        <section class="metrics">
          <span><b>Price</b><em>${item[2]}</em></span>
          <span><b>Calories</b><em>${item[3]}</em></span>
          <span><b>Spice</b><em>${item[4]}</em></span>
          <span><b>Prep</b><em>${item[5]}</em></span>
          <span><b>Pairing</b><em>${item[6]}</em></span>
        </section>
      </div>
    </article>
  `).join("");
}

function setTimeline(key) {
  const data = timeline[key];
  document.querySelectorAll(".time-rail button").forEach(btn => btn.classList.toggle("active", btn.dataset.time === key));
  document.getElementById("timeDish").textContent = data[0];
  document.getElementById("timeMood").textContent = data[1];
  document.querySelector(".time-scene img").src = data[2];
  document.documentElement.style.setProperty("--mood-a", data[3]);
  document.documentElement.style.setProperty("--mood-b", data[4]);
}

function updateScrollEffects() {
  state.target = scrollY;
  const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  const p = scrollY / max;
  document.documentElement.style.setProperty("--cup-y", `${Math.sin(p * 18) * -18}px`);
  document.documentElement.style.setProperty("--cup-r", `${Math.sin(p * 8) * 5}deg`);
  document.documentElement.style.setProperty("--type-shift", `${Math.min(scrollY * 0.08, 80)}px`);
}

function bind() {
  document.querySelectorAll(".chips button").forEach(btn => {
    btn.addEventListener("click", () => renderMenu(btn.dataset.category));
  });

  document.querySelectorAll(".time-rail button").forEach(btn => {
    btn.addEventListener("click", () => setTimeline(btn.dataset.time));
  });

  const modal = document.getElementById("reserveModal");
  document.querySelectorAll("[data-open-reserve]").forEach(btn => {
    btn.addEventListener("click", () => modal.showModal());
  });

  document.querySelector(".sound-dot").addEventListener("click", event => {
    event.currentTarget.classList.toggle("active");
  });

  let index = 0;
  setInterval(() => {
    index = (index + 1) % specials.length;
    const name = document.getElementById("specialName");
    const meta = document.getElementById("specialMeta");
    name.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" });
    meta.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520 });
    name.textContent = specials[index][0];
    meta.textContent = specials[index][1];
  }, 2800);
}

window.addEventListener("resize", resize);
window.addEventListener("scroll", updateScrollEffects, { passive: true });

resize();
tryLoadFrames();
renderMenu("south");
bind();
updateScrollEffects();
setTimeout(() => body.classList.remove("loading"), 2300);
requestAnimationFrame(drawCanvas);

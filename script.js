/* ====== عدّل النصوص هنا فقط (CONFIG) ====== */
const CONFIG = {
  name: "فاطمة",
  sub: "عالم صغير صنعه لكِ أيمن، في يوم ميلادك",
  // img: ضع صورة في assets/ ثم اكتب مثلاً "assets/1.jpg" (اتركها فارغة لتبقى الخلفية ملوّنة)
  memories: [
    { t: "أول ضحكة", txt: "اكتب هنا ذكرى جميلة بينكما", img: "" },
    { t: "موقف لا يُنسى", txt: "اكتب هنا موقفًا ضحكتما فيه كثيرًا", img: "" },
    { t: "لحظة خاصة", txt: "اكتب هنا لحظة لن تنساها أبدًا", img: "" }
  ],
  wishes: [
    "أتمنى لكِ سنة مليئة بالفرح",
    "أتمنى أن تتحقق كل أحلامك",
    "أتمنى لكِ صحة وسلامًا",
    "أتمنى أن تبقي دائمًا مبتسمة",
    "أتمنى أن تكون هذه أجمل سنة في عمرك"
  ],
  heartDone: "كل نجمة هنا تحمل قلبًا يحبك ♥",
  cakeDone: "كل عام وأنتِ بخير! تمنّي أمنية في قلبك ✨",
  letter: "اكتب هنا رسالتك الشخصية لفاطمة. كلمات صادقة وبسيطة تكفي.",
  sign: "أيمن"
};
/* ========================================= */

const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const scenes = [...document.querySelectorAll(".scene")];
let cur = 0, px = .5, py = .5, typing;
addEventListener("pointermove", (e) => { px = e.clientX / innerWidth; py = e.clientY / innerHeight; });

/* ---------- Audio (synthesized, no files) ---------- */
let ac;
const audio = () => ac || (ac = new (window.AudioContext || window.webkitAudioContext)());
function note(f, at = 0, d = .4, type = "sine") {
  const a = audio(), o = a.createOscillator(), g = a.createGain(), t = a.currentTime + at;
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + d);
}
const penta = [523, 587, 659, 784, 880];
const melody = () => [[392, 0], [392, .35], [440, .7], [392, 1.1], [523, 1.5], [494, 1.95]].forEach(([f, t]) => note(f, t, .5, "triangle"));

/* ---------- Fireworks ---------- */
const fx = $("#fx"), fc = fx.getContext("2d");
let sparks = [], fxOn = false;
function burst(x, y) {
  const h = Math.random() * 360;
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * 6.283, s = 1 + Math.random() * 5;
    sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1, c: `hsl(${h + Math.random() * 40},100%,65%)` });
  }
  if (!fxOn) { fxOn = true; fxLoop(); }
}
function fxLoop() {
  fc.clearRect(0, 0, fx.width, fx.height);
  sparks = sparks.filter((p) => p.l > 0);
  for (const p of sparks) {
    p.x += p.vx; p.y += p.vy; p.vy += .05; p.vx *= .985; p.l -= .012;
    fc.globalAlpha = Math.max(p.l, 0); fc.fillStyle = p.c; fc.fillRect(p.x, p.y, 3, 3);
  }
  fc.globalAlpha = 1;
  if (sparks.length) requestAnimationFrame(fxLoop); else fxOn = false;
}
function show(n = 5) {
  if (reduce) return;
  for (let i = 0; i < n; i++) setTimeout(() => burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.15 + Math.random() * .4)), i * 350);
}

/* ---------- Background stars + name made of particles ---------- */
const bg = $("#bg"), bx = bg.getContext("2d");
const nc = $("#name"), nx = nc.getContext("2d");
let stars = [], dots = [], nW = 0, nH = 0, npx = -999, npy = -999;
const dpr = Math.min(devicePixelRatio || 1, 2);

function sizeAll() {
  bg.width = fx.width = innerWidth; bg.height = fx.height = innerHeight;
  stars = Array.from({ length: 110 }, () => ({ x: Math.random() * bg.width, y: Math.random() * bg.height, z: .3 + Math.random() * 1.2, t: Math.random() * 6 }));
  initName();
}
function initName() {
  nW = Math.min(innerWidth - 32, 440); nH = 190;
  nc.width = nW * dpr; nc.height = nH * dpr; nc.style.width = nW + "px"; nc.style.height = nH + "px";
  const o = document.createElement("canvas"); o.width = nW; o.height = nH;
  const ox = o.getContext("2d");
  let fs = 160;
  do { ox.font = `${fs}px Lalezar`; fs -= 6; } while (ox.measureText(CONFIG.name).width > nW * .9 && fs > 20);
  ox.textAlign = "center"; ox.textBaseline = "middle"; ox.fillText(CONFIG.name, nW / 2, nH / 2);
  const d = ox.getImageData(0, 0, nW, nH).data; dots = [];
  for (let y = 0; y < nH; y += 3) for (let x = 0; x < nW; x += 3)
    if (d[(y * nW + x) * 4 + 3] > 128) dots.push({ hx: x, hy: y, x: Math.random() * nW, y: Math.random() * nH, vx: 0, vy: 0, c: `hsl(${330 - x / nW * 140},95%,70%)` });
}
nc.addEventListener("pointermove", (e) => { const r = nc.getBoundingClientRect(); npx = e.clientX - r.left; npy = e.clientY - r.top; });
["pointerleave", "pointerup"].forEach((ev) => nc.addEventListener(ev, () => { npx = npy = -999; }));

function frame(t) {
  bx.clearRect(0, 0, bg.width, bg.height);
  for (const s of stars) {
    bx.fillStyle = `rgba(255,255,255,${.35 + .45 * Math.sin(s.t + t / 900)})`;
    bx.fillRect(s.x + (px - .5) * s.z * 30, s.y + (py - .5) * s.z * 30, s.z * 1.4, s.z * 1.4);
  }
  if (cur === 0 && dots.length) {
    nx.setTransform(dpr, 0, 0, dpr, 0, 0); nx.clearRect(0, 0, nW, nH);
    for (const p of dots) {
      const dx = p.x - npx, dy = p.y - npy, m = Math.hypot(dx, dy) || 1;
      if (m < 60) { const f = (60 - m) / 60 * 3; p.vx += dx / m * f; p.vy += dy / m * f; }
      p.vx += (p.hx - p.x) * .06; p.vy += (p.hy - p.y) * .06; p.vx *= .85; p.vy *= .85; p.x += p.vx; p.y += p.vy;
      nx.fillStyle = p.c; nx.fillRect(p.x, p.y, 2.4, 2.4);
    }
  }
  requestAnimationFrame(frame);
}

/* ---------- Build scenes ---------- */
$("#sub").textContent = CONFIG.sub;
$("#sign").textContent = CONFIG.sign;

CONFIG.memories.forEach((m) => {
  const c = document.createElement("article");
  c.className = "card";
  if (m.img) c.style.backgroundImage = `linear-gradient(transparent 40%,rgba(12,10,31,.9)),url(${m.img})`;
  c.innerHTML = "<h3></h3><p></p>";
  c.children[0].textContent = m.t; c.children[1].textContent = m.txt;
  c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 14 + "deg");
    c.style.setProperty("--rx", -((e.clientY - r.top) / r.height - .5) * 14 + "deg");
  });
  c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
  $("#memories").append(c);
});

const pts = [[30, 28], [70, 28], [86, 52], [50, 88], [14, 52]];
const lit = [];
CONFIG.wishes.forEach((w, i) => {
  const b = document.createElement("button");
  b.className = "hs"; b.textContent = "★"; b.setAttribute("aria-label", "أمنية " + (i + 1));
  b.style.left = pts[i][0] + "%"; b.style.top = pts[i][1] + "%";
  b.onclick = () => {
    if (b.classList.contains("on")) return;
    b.classList.add("on"); lit.push(i); note(penta[lit.length - 1], 0, .6);
    $("#wish").textContent = w;
    const all = lit.length === pts.length;
    $("#lines").innerHTML = `<polyline points="${lit.map((k) => pts[k].join(",")).join(" ")}${all ? " " + pts[lit[0]].join(",") : ""}"/>`;
    if (all) { $("#sky3").classList.add("done"); setTimeout(() => { $("#wish").textContent = CONFIG.heartDone; show(4); melody(); }, 900); }
  };
  $("#sky3").append(b);
});

/* ---------- Cake: blow into the mic, or tap ---------- */
let out = false;
function blow() {
  if (out) return;
  out = true; $("#cake").classList.add("out"); $("#mic").hidden = true;
  $("#cakeMsg").textContent = CONFIG.cakeDone; melody(); show(6);
}
$("#cake").onclick = blow;
$("#cake").onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") blow(); };
$("#mic").onclick = async () => {
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    const a = audio(), an = a.createAnalyser(); an.fftSize = 512;
    a.createMediaStreamSource(s).connect(an);
    const d = new Uint8Array(an.fftSize); let hits = 0;
    $("#cakeMsg").textContent = "انفخي بقوة...";
    (function loop() {
      if (out) { s.getTracks().forEach((t) => t.stop()); return; }
      an.getByteTimeDomainData(d);
      hits = Math.max(...d.map((v) => Math.abs(v - 128))) > 60 ? hits + 1 : 0;
      if (hits >= 5) blow(); else requestAnimationFrame(loop);
    })();
  } catch { $("#cakeMsg").textContent = "اضغطي على الشمعة لإطفائها"; }
};

/* ---------- Navigation + letter ---------- */
const dots_ = $("#dots");
scenes.forEach(() => dots_.append(document.createElement("b")));
function go(n) {
  cur = Math.max(0, Math.min(scenes.length - 1, n));
  scenes.forEach((s, i) => s.classList.toggle("active", i === cur));
  [...dots_.children].forEach((d, i) => d.classList.toggle("on", i === cur));
  $("#prev").disabled = cur === 0; $("#next").disabled = cur === scenes.length - 1;
  if (cur === 4) typeLetter();
}
function typeLetter() {
  clearInterval(typing);
  const el = $("#letter"); let i = 0;
  if (reduce) { el.textContent = CONFIG.letter; return; }
  el.textContent = "";
  typing = setInterval(() => {
    el.textContent = CONFIG.letter.slice(0, ++i);
    if (i >= CONFIG.letter.length) { clearInterval(typing); show(3); }
  }, 45);
}
$("#start").onclick = () => { audio(); note(784, 0, .5); go(1); };
$("#next").onclick = () => go(cur + 1);
$("#prev").onclick = () => go(cur - 1);

addEventListener("resize", sizeAll);
sizeAll(); go(0); requestAnimationFrame(frame);
document.fonts.load("100px Lalezar", CONFIG.name).then(initName).catch(() => {});

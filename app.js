"use strict";

/* ===== Data demo (harga contoh, verifikasi sebelum transaksi nyata) ===== */
const GAMES = [
  { id: "mlbb", name: "Mobile Legends", pub: "MOBA", cur: "Diamond", emoji: "⚔️", logo: "https://cdn.simpleicons.org/mobilelegends/6558F5", c: ["#7c5cff", "#22d3ee"], hot: true,
    fields: [{ k: "uid", l: "User ID", ph: "12345678" }, { k: "zone", l: "Zone ID", ph: "1234" }],
    packs: [["86 Diamond", 22000], ["172 Diamond", 44000], ["257 Diamond", 65000], ["344 Diamond", 87000], ["514 Diamond", 129000], ["706 Diamond", 175000], ["Weekly Diamond Pass", 28000]] },
  { id: "ff", name: "Free Fire", pub: "Battle Royale", cur: "Diamond", emoji: "🔥", logo: "https://cdn.simpleicons.org/garena/EF4444", c: ["#f97316", "#ef4444"], hot: true,
    packs: [["70 Diamond", 10000], ["140 Diamond", 20000], ["355 Diamond", 50000], ["720 Diamond", 100000], ["Membership Mingguan", 29000]] },
  { id: "pubgm", name: "PUBG Mobile", pub: "Battle Royale", cur: "UC", emoji: "🎯", logo: "https://cdn.simpleicons.org/pubg/F59E0B", c: ["#facc15", "#f59e0b"], hot: true,
    packs: [["60 UC", 15000], ["325 UC", 77000], ["660 UC", 152000], ["1800 UC", 380000]] },
  { id: "genshin", name: "Genshin Impact", pub: "RPG", cur: "Genesis Crystal", emoji: "✨", logo: "https://cdn.simpleicons.org/genshinimpact/6558F5", c: ["#38bdf8", "#a78bfa"],
    fields: [{ k: "uid", l: "UID", ph: "8xxxxxxxx" }, { k: "srv", l: "Server", opts: ["Asia", "America", "Europe", "TW/HK/MO"] }],
    packs: [["60 Genesis Crystal", 16000], ["330 Genesis Crystal", 79000], ["1090 Genesis Crystal", 249000], ["Blessing of the Welkin Moon", 79000]] },
  { id: "valo", name: "Valorant", pub: "FPS", cur: "VP", emoji: "🎮", logo: "https://cdn.simpleicons.org/valorant/EF4444", c: ["#fb7185", "#f43f5e"],
    fields: [{ k: "uid", l: "Riot ID", ph: "Nama#TAG" }],
    packs: [["475 VP", 59000], ["1000 VP", 119000], ["2050 VP", 239000], ["3650 VP", 419000]] },
  { id: "cod", name: "Call of Duty Mobile", pub: "FPS", cur: "CP", emoji: "💥", logo: "https://cdn.simpleicons.org/callofduty/16A34A", c: ["#84cc16", "#16a34a"],
    packs: [["53 CP", 10000], ["112 CP", 20000], ["278 CP", 50000], ["580 CP", 100000]] }
];

const PAY = [
  { name: "QRIS", pct: 0.007, flat: 0, note: "Semua e-wallet & m-banking" },
  { name: "DANA", pct: 0.015, flat: 0, note: "Biaya 1,5%" },
  { name: "OVO", pct: 0.015, flat: 0, note: "Biaya 1,5%" },
  { name: "GoPay", pct: 0.015, flat: 0, note: "Biaya 1,5%" },
  { name: "ShopeePay", pct: 0.015, flat: 0, note: "Biaya 1,5%" },
  { name: "Transfer BCA (VA)", pct: 0, flat: 4000, note: "Biaya Rp4.000" }
];

const FAQ = [
  ["Berapa lama prosesnya?", "Pada toko sungguhan, item masuk otomatis setelah pembayaran terkonfirmasi, biasanya dalam hitungan detik sampai beberapa menit."],
  ["Apakah perlu memberi password akun game?", "Tidak. Kami hanya meminta ID akun dan server/zone. Jangan pernah membagikan password."],
  ["Salah memasukkan ID, bagaimana?", "Periksa kembali ID sebelum membayar. Item yang sudah terkirim ke ID yang salah tidak bisa ditarik kembali."],
  ["Apakah ini toko sungguhan?", "Belum. Ini versi demo: pembayaran dan pengiriman item belum terhubung, dan data transaksi hanya tersimpan di browser ini."]
];

/* ===== Helper ===== */
const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
const rupiah = n => "Rp" + Number(n).toLocaleString("id-ID");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fee = (price, m) => Math.round(price * m.pct) + m.flat;

function loadOrders() {
  try { return JSON.parse(localStorage.getItem("topupku_orders") || "[]"); } catch (e) { return []; }
}
function saveOrders(list) {
  try { localStorage.setItem("topupku_orders", JSON.stringify(list.slice(0, 50))); } catch (e) { /* abaikan */ }
}
function findOrder(id) {
  const q = String(id || "").trim().toUpperCase();
  return loadOrders().find(o => o.id === q);
}

/* ===== Tampilan ===== */
const iconStyle = g => `background:linear-gradient(135deg,${g.c[0]},${g.c[1]})`;
const logoHTML = g => g.logo
  ? `<img class="game-logo" src="${g.logo}" alt="Logo ${esc(g.name)}" loading="lazy" onerror="this.remove();this.parentElement.textContent='${g.emoji}'">`
  : g.emoji;
const cardHTML = g => `<a class="card" href="#/game/${g.id}"><div class="ico" style="${iconStyle(g)}">${logoHTML(g)}</div><b>${g.name}</b><small>${g.pub} • ${g.cur}</small></a>`;

function viewHome() {
  app.innerHTML = `
  <section class="hero">
    <span class="chip">✦ TOP UP GAME FAVORIT DALAM SATU TEMPAT</span>
    <h1>Upgrade permainanmu.<br><em>Top up tanpa ribet.</em></h1>
    <p>Pilih game favorit, tentukan nominal, lalu lanjutkan pesanan dengan alur yang simpel dan jelas.</p>
    <div class="search"><input id="q" type="search" placeholder="Cari game..." autocomplete="off"></div>
  </section>
  <div class="wrap">
    <div id="hotWrap"><h2>🔥 Pilihan populer</h2><div class="grid" id="hot"></div></div>
    <h2>Jelajahi semua game</h2>
    <div class="grid" id="all"></div>
    <p class="muted" id="empty" hidden>Game tidak ditemukan.</p>
    <div class="perks">
      <div class="perk">⚡<b>Alur praktis</b><p>Pilih game dan nominal lewat langkah yang mudah diikuti.</p></div>
      <div class="perk">🔐<b>Tanpa password</b><p>Form hanya meminta ID game yang diperlukan.</p></div>
      <div class="perk">🎮<b>Pilihan game</b><p>Temukan beberapa game populer dalam satu katalog.</p></div>
      <div class="perk">🧾<b>Ringkasan transparan</b><p>Harga dan biaya admin ditampilkan sebelum membuat pesanan.</p></div>
    </div>
  </div>`;
  $("#hot").innerHTML = GAMES.filter(g => g.hot).map(cardHTML).join("");
  const all = $("#all"), empty = $("#empty"), hotWrap = $("#hotWrap");
  const draw = q => {
    const list = GAMES.filter(g => g.name.toLowerCase().includes(q));
    all.innerHTML = list.map(cardHTML).join("");
    empty.hidden = list.length > 0;
    hotWrap.hidden = q !== "";
  };
  draw("");
  $("#q").addEventListener("input", e => draw(e.target.value.trim().toLowerCase()));
}

function viewGame(g) {
  const fields = g.fields || [{ k: "uid", l: "User ID", ph: "Masukkan User ID" }];
  const st = { p: null, m: null };
  app.innerHTML = `
  <div class="wrap">
    <a class="back" href="#/">← Kembali</a>
    <div class="ghead"><div class="ico" style="${iconStyle(g)}">${logoHTML(g)}</div><div><h1>${g.name}</h1><small>${g.pub} • Top up ${g.cur}</small></div></div>
    <div class="cols">
      <div class="steps">
        <section class="box"><h3><i>1</i> Masukkan ID Akun</h3>
          <div class="fields">${fields.map(f => `<label>${f.l}${f.opts
            ? `<select id="f_${f.k}">${f.opts.map(o => `<option>${o}</option>`).join("")}</select>`
            : `<input id="f_${f.k}" placeholder="${f.ph}" autocomplete="off" maxlength="40">`}</label>`).join("")}</div>
        </section>
        <section class="box"><h3><i>2</i> Pilih Nominal</h3><div class="packs" id="packs"></div></section>
        <section class="box"><h3><i>3</i> Metode Pembayaran</h3><div class="pays" id="pays"></div></section>
        <section class="box"><h3><i>4</i> Kontak</h3><input id="wa" inputmode="tel" placeholder="No. WhatsApp, contoh 0812xxxxxxx" maxlength="20"></section>
      </div>
      <aside class="sum box"><h3>Ringkasan</h3><div id="sumbody"></div>
        <button class="btn" id="buy" type="button">Beli Sekarang</button>
        <p class="err" id="err"></p>
      </aside>
    </div>
  </div>`;

  const packsEl = $("#packs"), paysEl = $("#pays");
  packsEl.innerHTML = g.packs.map((p, i) => `<button type="button" class="pack" data-i="${i}"><b>${p[0]}</b><span>${rupiah(p[1])}</span></button>`).join("");
  paysEl.innerHTML = PAY.map((m, i) => `<button type="button" class="pay" data-i="${i}"><b>${m.name}</b><span>${m.note}</span></button>`).join("");

  function upd() {
    const p = st.p != null ? g.packs[st.p] : null;
    const m = st.m != null ? PAY[st.m] : null;
    const f = p && m ? fee(p[1], m) : 0;
    $("#sumbody").innerHTML = `
      <div class="row"><span>Game</span><b>${g.name}</b></div>
      <div class="row"><span>Item</span><b>${p ? p[0] : "-"}</b></div>
      <div class="row"><span>Harga</span><b>${p ? rupiah(p[1]) : "-"}</b></div>
      <div class="row"><span>Biaya admin</span><b>${p && m ? rupiah(f) : "-"}</b></div>
      <div class="row tot"><span>Total</span><b>${p && m ? rupiah(p[1] + f) : "-"}</b></div>`;
  }
  const pick = (box, key) => e => {
    const b = e.target.closest("button"); if (!b) return;
    st[key] = +b.dataset.i;
    [...box.children].forEach(c => c.classList.toggle("sel", c === b));
    upd();
  };
  packsEl.onclick = pick(packsEl, "p");
  paysEl.onclick = pick(paysEl, "m");
  upd();

  $("#buy").onclick = () => {
    const err = $("#err"); err.textContent = "";
    const vals = {};
    for (const f of fields) {
      const v = $("#f_" + f.k).value.trim();
      if (!v) { err.textContent = `Isi ${f.l} dulu.`; return; }
      vals[f.l] = v;
    }
    if (st.p == null) { err.textContent = "Pilih nominal dulu."; return; }
    if (st.m == null) { err.textContent = "Pilih metode pembayaran dulu."; return; }
    const wa = $("#wa").value.replace(/\D/g, "");
    if (wa.length < 9 || wa.length > 15) { err.textContent = "Nomor WhatsApp tidak valid."; return; }
    const p = g.packs[st.p], m = PAY[st.m], f = fee(p[1], m);
    const order = {
      id: "TPK" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase(),
      game: g.name, item: p[0], price: p[1], fee: f, total: p[1] + f, pay: m.name,
      fields: vals, wa, at: Date.now(), status: "pending"
    };
    saveOrders([order, ...loadOrders()]);
    location.hash = "#/cek/" + order.id;
  };
}

function invoiceHTML(o) {
  const [label, cls] = o.status === "success" ? ["Berhasil", "ok"] : ["Menunggu Pembayaran", "warn"];
  const rows = Object.entries(o.fields).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("");
  return `<section class="box inv">
    <h3>Invoice ${esc(o.id)} <span class="badge ${cls}">${label}</span></h3>
    <table>
      <tr><td>Tanggal</td><td>${new Date(o.at).toLocaleString("id-ID")}</td></tr>
      <tr><td>Game</td><td>${esc(o.game)}</td></tr>
      ${rows}
      <tr><td>Item</td><td>${esc(o.item)}</td></tr>
      <tr><td>Harga</td><td>${rupiah(o.price)}</td></tr>
      <tr><td>Biaya admin</td><td>${rupiah(o.fee)}</td></tr>
      <tr><td>Metode</td><td>${esc(o.pay)}</td></tr>
      <tr><td>WhatsApp</td><td>${esc(o.wa)}</td></tr>
      <tr><td><b>Total</b></td><td><b>${rupiah(o.total)}</b></td></tr>
    </table>
    ${o.status === "pending"
      ? `<div class="note">Ini mode demo, belum ada pembayaran sungguhan. Tekan tombol di bawah untuk mensimulasikan pembayaran berhasil.</div>
         <button class="btn" id="simpay" type="button">Simulasi: Tandai Sudah Dibayar</button>`
      : `<div class="note">Pembayaran (simulasi) berhasil. Pada toko sungguhan, item dikirim otomatis ke akun game.</div>`}
  </section>`;
}

function viewCek(id) {
  const recent = loadOrders().slice(0, 5);
  const found = id ? findOrder(id) : null;
  app.innerHTML = `
  <div class="wrap">
    <h2>Cek Transaksi</h2>
    <p class="muted">Masukkan nomor invoice. Di versi demo, data hanya ada di perangkat yang sama.</p>
    <form class="cekform" id="cf"><input id="inv" placeholder="Contoh: TPK1A2B3CXY" autocomplete="off" maxlength="30"><button class="btn" type="submit">Cek</button></form>
    <div id="res">${id ? (found ? invoiceHTML(found) : `<div class="box">Invoice <b>${esc(id)}</b> tidak ditemukan di perangkat ini.</div>`) : ""}</div>
    ${recent.length ? `<h2>Transaksi Terakhir</h2><div class="box list">${recent.map(o => `<a href="#/cek/${esc(o.id)}"><span>${esc(o.game)} • ${esc(o.item)}<br><small>${esc(o.id)}</small></span><b>${rupiah(o.total)}</b></a>`).join("")}</div>` : ""}
  </div>`;
  $("#inv").value = id || "";
  $("#cf").onsubmit = e => {
    e.preventDefault();
    const v = $("#inv").value.trim();
    if (v) location.hash = "#/cek/" + encodeURIComponent(v);
  };
  const sim = $("#simpay");
  if (sim && found) sim.onclick = () => {
    const list = loadOrders();
    const o = list.find(x => x.id === found.id);
    if (o) { o.status = "success"; saveOrders(list); }
    viewCek(found.id);
  };
}

function viewFaq() {
  app.innerHTML = `<div class="wrap"><h2>Pertanyaan Umum</h2>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
}

/* ===== Router ===== */
function render() {
  const [r, arg] = location.hash.replace(/^#\/?/, "").split("/");
  const id = arg ? decodeURIComponent(arg) : "";
  const g = r === "game" ? GAMES.find(x => x.id === id) : null;
  if (g) viewGame(g);
  else if (r === "cek") viewCek(id);
  else if (r === "faq") viewFaq();
  else viewHome();
  document.querySelectorAll(".nav nav a").forEach(a => a.classList.toggle("on", a.dataset.r === (r === "game" ? "" : r || "")));
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);
render();
/* inderOS v1.0 — window manager, apps & love */
(() => {
const C = window.CONTENT;
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const store = {
  get(k, d) { try { const v = localStorage.getItem('inderOS.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('inderOS.' + k, JSON.stringify(v)); } catch {} }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rand = a => a[Math.floor(Math.random() * a.length)];

/* ---------------- ICONS (pastel outlined, retro-cute) ---------------- */
const O = '#7a3355', SW = 'stroke="' + O + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const folder = (inner, tab = '#ff9ec4') => `<svg viewBox="0 0 64 64"><path d="M6 16h18l5 5h29v33H6z" fill="${tab}" ${SW}/><rect x="6" y="22" width="52" height="32" rx="3" fill="#fff3e3" ${SW}/>${inner}</svg>`;
const ICONS = {
  love: `<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="40" rx="6" fill="#fff3e3" ${SW}/><rect x="6" y="10" width="52" height="9" rx="4" fill="#ff9ec4" ${SW}/><path d="M32 45s-12-7-12-15a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 15-12 15z" fill="#ff5c9d" ${SW}/><rect x="22" y="50" width="20" height="6" fill="#ffc8dd" ${SW}/></svg>`,
  memories: folder(`<rect x="20" y="27" width="24" height="22" fill="#fff" ${SW} transform="rotate(-6 32 38)"/><circle cx="32" cy="36" r="5" fill="#ffb3d1" stroke="${O}" stroke-width="2"/>`),
  music: `<svg viewBox="0 0 64 64"><rect x="6" y="18" width="52" height="34" rx="6" fill="#ffc8dd" ${SW}/><circle cx="21" cy="35" r="9" fill="#fff3e3" ${SW}/><circle cx="21" cy="35" r="3" fill="${O}"/><rect x="34" y="26" width="18" height="8" rx="2" fill="#bfe3ec" ${SW}/><circle cx="38" cy="43" r="2.5" fill="#ff5c9d"/><circle cx="46" cy="43" r="2.5" fill="#ffd36e"/><path d="M14 18l6-8h24l6 8" fill="none" ${SW}/></svg>`,
  arcade: `<svg viewBox="0 0 64 64"><path d="M10 26a10 10 0 0 1 10-8h24a10 10 0 0 1 10 8l4 18a6 6 0 0 1-10 5l-6-7H22l-6 7a6 6 0 0 1-10-5z" fill="#c9b7ff" ${SW}/><path d="M20 28v10M15 33h10" ${SW}/><circle cx="42" cy="30" r="3" fill="#ff5c9d" ${SW} stroke-width="2"/><circle cx="48" cy="36" r="3" fill="#ffd36e" ${SW} stroke-width="2"/></svg>`,
  letters: `<svg viewBox="0 0 64 64"><rect x="6" y="16" width="52" height="36" rx="4" fill="#fff3e3" ${SW}/><path d="M6 20l26 18 26-18" fill="#ffd6e7" ${SW}/><path d="M32 42s-6-3.5-6-7.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5z" fill="#ff5c9d" stroke="${O}" stroke-width="2"/></svg>`,
  classified: folder(`<rect x="24" y="34" width="16" height="13" rx="2" fill="#ffd36e" ${SW}/><path d="M27 34v-4a5 5 0 0 1 10 0v4" fill="none" ${SW}/>`, '#b9a3ff'),
  dates: `<svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="44" rx="6" fill="#fff3e3" ${SW}/><rect x="8" y="12" width="48" height="12" rx="5" fill="#ff7eb3" ${SW}/><path d="M20 8v8M44 8v8" ${SW}/><path d="M32 50s-9-5-9-11a4.5 4.5 0 0 1 9-1.5 4.5 4.5 0 0 1 9 1.5c0 6-9 11-9 11z" fill="#ff5c9d" stroke="${O}" stroke-width="2.5"/></svg>`,
  notes: `<svg viewBox="0 0 64 64"><path d="M10 8h44v38l-12 12H10z" fill="#fff0a8" ${SW}/><path d="M42 58V46h12" fill="#ffe070" ${SW}/><path d="M18 20h28M18 29h28M18 38h16" ${SW} stroke-width="2.5"/><rect x="24" y="3" width="16" height="9" fill="#ffc8dd" opacity=".9" ${SW} stroke-width="2"/></svg>`,
  surprise: `<svg viewBox="0 0 64 64"><rect x="10" y="28" width="44" height="28" rx="3" fill="#ff9ec4" ${SW}/><rect x="6" y="20" width="52" height="10" rx="3" fill="#ffc8dd" ${SW}/><path d="M32 20v36" stroke="#ffd36e" stroke-width="6"/><path d="M32 20v36" ${SW} stroke-width="1.5"/><path d="M32 20c-4-10-16-10-12-2 2 3 8 2 12 2zM32 20c4-10 16-10 12-2-2 3-8 2-12 2z" fill="#ffd36e" ${SW}/></svg>`,
  terminal: `<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="44" rx="6" fill="#3a1b31" ${SW}/><path d="M16 26l8 6-8 6M28 40h14" stroke="#ff9ec4" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  settings: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="#bfe3ec" ${SW}/><g ${SW}><path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l6 6M44 44l6 6M14 50l6-6M44 20l6-6"/></g><circle cx="32" cy="32" r="8" fill="#fff3e3" ${SW}/></svg>`,
  computer: `<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="36" rx="5" fill="#d9d3e6" ${SW}/><rect x="14" y="14" width="36" height="24" rx="2" fill="#ffd6e7" ${SW}/><path d="M32 30s-5-3-5-6a2.5 2.5 0 0 1 5-1 2.5 2.5 0 0 1 5 1c0 3-5 6-5 6z" fill="#ff5c9d"/><rect x="20" y="48" width="24" height="8" rx="2" fill="#d9d3e6" ${SW}/></svg>`,
  trash: `<svg viewBox="0 0 64 64"><path d="M14 18h36l-4 38H18z" fill="#ffc8dd" ${SW}/><rect x="10" y="12" width="44" height="7" rx="3" fill="#ff9ec4" ${SW}/><path d="M26 28v20M38 28v20" ${SW} stroke-width="2.5"/></svg>`,
  gift: null
};
ICONS.gift = ICONS.surprise;

/* ---------------- APPS REGISTRY ---------------- */
const APPS = [
  { id: 'love', name: 'love.exe', sub: 'reasons i love you', w: 440, h: 380, render: appLove },
  { id: 'memories', name: 'memories', sub: 'photos & moments', w: 560, h: 460, render: appMemories },
  { id: 'music', name: 'our music', sub: 'songs & playlists', w: 380, h: 520, render: appMusic },
  { id: 'arcade', name: 'arcade', sub: 'mini games', w: 460, h: 480, render: appArcade },
  { id: 'letters', name: 'letters', sub: 'open when…', w: 500, h: 460, render: appLetters },
  { id: 'classified', name: 'classified', sub: 'secret folders', w: 440, h: 400, render: appClassified },
  { id: 'dates', name: 'our dates', sub: 'special days', w: 440, h: 480, render: appDates },
  { id: 'notes', name: 'notes', sub: 'little messages', w: 520, h: 420, render: appNotes },
  { id: 'surprise', name: 'surprise.exe', sub: 'random surprises', w: 380, h: 380, render: appSurprise },
  { id: 'terminal', name: 'terminal', sub: 'type secret commands', w: 520, h: 340, render: appTerminal, noPad: true },
  { id: 'settings', name: 'personalize', sub: 'themes & wallpapers', w: 460, h: 470, render: appSettings },
  { id: 'computer', name: 'my computer', sub: 'about inderOS', w: 420, h: 360, render: appAbout },
  { id: 'trash', name: 'recycle bin', sub: 'nothing bad here', w: 380, h: 300, render: appTrash }
];
const APP = Object.fromEntries(APPS.map(a => [a.id, a]));

/* ---------------- BOOT ---------------- */
const bootLines = ['loading heart.sys ...', 'mounting /memories ...', 'calibrating cuddles ...', 'installing butterflies ...', 'starting love.exe ...', 'welcome, inder ♥'];
function boot() {
  const log = $('#bootLog'), fill = $('.boot-fill');
  if (store.get('booted') && sessionStorage.getItem('skipBoot')) return showLogin(true);
  let i = 0;
  const step = () => {
    if (i < bootLines.length) {
      log.innerHTML += `> ${bootLines[i]}<br>`;
      fill.style.width = ((i + 1) / bootLines.length * 100) + '%';
      i++; setTimeout(step, 380 + Math.random() * 250);
    } else setTimeout(() => showLogin(), 500);
  };
  setTimeout(step, 400);
}
function showLogin(instant) {
  const b = $('#boot');
  b.classList.add('fade');
  setTimeout(() => b.classList.add('hidden'), instant ? 0 : 800);
  $('#login').classList.remove('hidden');
  $('#loginBtn').onclick = e => { burst(e.clientX, e.clientY, 18); login(); };
  document.addEventListener('keydown', function k(e) { if (e.key === 'Enter' && !$('#login').classList.contains('hidden')) { document.removeEventListener('keydown', k); login(); } });
}
function login() {
  const l = $('#login'); if (l.classList.contains('fade')) return;
  l.classList.add('fade');
  store.set('booted', true); sessionStorage.setItem('skipBoot', 1);
  setTimeout(() => { l.classList.add('hidden'); startDesktop(); }, 700);
}

/* ---------------- DESKTOP ---------------- */
const settings = Object.assign({ theme: 'pink', wallpaper: 'hearts', floaters: true, sparkles: true, notifs: true, widgets: true }, store.get('settings', {}));
function applySettings() {
  document.body.className = settings.theme === 'pink' ? '' : 'theme-' + settings.theme;
  $('#wallpaper').className = 'wp-' + settings.wallpaper;
  $('#widgets').classList.toggle('hidden', !settings.widgets);
  store.set('settings', settings);
}

function startDesktop() {
  $('#desktop').classList.remove('hidden');
  applySettings();
  renderIcons(); renderWidgets(); startFloaters(); clockTick(); setInterval(clockTick, 1000);
  setupTaskbar(); setupContext(); setupEggs();
  setTimeout(dailyReward, 1200);
  setTimeout(() => notify('💗', 'inderOS', `welcome home, ${C.herName}. everything here was made for you.`), 2600);
  scheduleNotifs();
}

const DESK_IDS = ['computer', 'love', 'memories', 'music', 'arcade', 'letters', 'classified', 'dates', 'notes', 'surprise', 'terminal', 'trash'];
function defaultPos(i) {
  const rows = Math.max(3, Math.floor((innerHeight - 80) / 110));
  return { x: 16 + Math.floor(i / rows) * 104, y: 16 + (i % rows) * 108 };
}
function renderIcons() {
  const wrap = $('#icons'); wrap.innerHTML = '';
  const pos = store.get('iconPos', {});
  DESK_IDS.forEach((id, i) => {
    const a = APP[id], p = pos[id] || defaultPos(i);
    const ic = el('div', 'icon', `${ICONS[id]}<div class="lbl">${a.name}</div>`);
    ic.style.left = p.x + 'px'; ic.style.top = p.y + 'px';
    ic.style.animation = `pop .5s ${i * 0.05}s var(--ease) both`;
    ic.dataset.id = id; ic.title = a.sub;
    wrap.appendChild(ic);
    let sx, sy, ox, oy, moved = false;
    ic.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      document.querySelectorAll('.icon.sel').forEach(x => x.classList.remove('sel'));
      ic.classList.add('sel');
      sx = e.clientX; sy = e.clientY; ox = ic.offsetLeft; oy = ic.offsetTop; moved = false;
      ic.setPointerCapture(e.pointerId);
      const mv = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 5) return;
        moved = true; ic.classList.add('dragging');
        ic.style.left = Math.max(0, Math.min(innerWidth - 96, ox + dx)) + 'px';
        ic.style.top = Math.max(0, Math.min(innerHeight - 160, oy + dy)) + 'px';
      };
      const up = () => {
        ic.removeEventListener('pointermove', mv); ic.removeEventListener('pointerup', up);
        ic.classList.remove('dragging');
        if (moved) {
          // snap to grid
          const x = Math.round((ic.offsetLeft - 16) / 104) * 104 + 16, y = Math.round((ic.offsetTop - 16) / 108) * 108 + 16;
          ic.style.transition = 'left .25s var(--ease), top .25s var(--ease)';
          ic.style.left = Math.max(16, x) + 'px'; ic.style.top = Math.max(16, y) + 'px';
          setTimeout(() => ic.style.transition = '', 300);
          const all = store.get('iconPos', {}); all[id] = { x: Math.max(16, x), y: Math.max(16, y) }; store.set('iconPos', all);
        }
      };
      ic.addEventListener('pointermove', mv); ic.addEventListener('pointerup', up);
    });
    ic.addEventListener('dblclick', () => { ic.classList.remove('bounce'); void ic.offsetWidth; ic.classList.add('bounce'); openApp(id); });
    // single tap on touch devices
    ic.addEventListener('click', e => { if (matchMedia('(pointer:coarse)').matches && !moved) openApp(id); });
  });
  wrap.addEventListener('pointerdown', e => { if (e.target === wrap) document.querySelectorAll('.icon.sel').forEach(x => x.classList.remove('sel')); });
}

function renderWidgets() {
  const w = $('#widgets'); w.innerHTML = '';
  const clock = el('div', 'widget glass w-clock', `<h4>now <span>♥</span></h4><div class="t" id="wTime"></div><div class="d" id="wDate"></div>`);
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const marks = C.dates.map(d => new Date(d.date + 'T00:00')).filter(d => d.getMonth() === m).map(d => d.getDate());
  let cal = 'SMTWTFS'.split('').map(d => `<b>${d}</b>`).join('');
  for (let i = 0; i < first; i++) cal += '<span></span>';
  for (let d = 1; d <= days; d++) cal += `<span class="${d === now.getDate() ? 'today' : ''} ${marks.includes(d) ? 'mark' : ''}">${marks.includes(d) && d !== now.getDate() ? '♥' : d}</span>`;
  const calW = el('div', 'widget glass', `<h4>${now.toLocaleString('en', { month: 'long' }).toLowerCase()} <span>${y}</span></h4><div class="cal">${cal}</div>`);
  const together = Math.floor((now - new Date(C.anniversary + 'T00:00')) / 864e5);
  const count = el('div', 'widget glass w-count', `<h4>us <span>∞</span></h4><div class="n">${together.toLocaleString()} days</div><div class="d" style="font-size:12px;color:var(--ink2)">of you & me, and counting</div>`);
  const mood = el('div', 'widget glass', `<h4>how's my girl today?</h4><div class="w-mood">${['🥰', '😊', '😴', '🥺', '😤'].map(m => `<button data-m="${m}">${m}</button>`).join('')}</div>`);
  const moodReply = { '🥰': 'yay!! that makes me so happy', '😊': 'love that for you ♥', '😴': 'go nap. that is an order.', '🥺': 'come here. letters → "open when you\'re sad"', '😤': 'who do i need to fight' };
  mood.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; burst(e.clientX, e.clientY, 10, [b.dataset.m]); notify(b.dataset.m, 'mood logged', moodReply[b.dataset.m]); });
  [clock, calW, count, mood].forEach((x, i) => { x.style.animationDelay = (0.3 + i * 0.12) + 's'; w.appendChild(x); });
}

function clockTick() {
  const n = new Date();
  const t = n.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  $('#clock').innerHTML = `${t}<br><span style="font-weight:400;font-size:11px">${n.toLocaleDateString('en', { day: 'numeric', month: 'short' }).toLowerCase()}</span>`;
  const wt = $('#wTime'); if (wt) { wt.textContent = t; $('#wDate').textContent = n.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' }).toLowerCase(); }
}

let floatTimer;
function startFloaters() {
  clearInterval(floatTimer);
  const f = $('#floaters');
  floatTimer = setInterval(() => {
    if (!settings.floaters || document.hidden) return;
    const h = el('div', 'floater', rand(['♥', '♡', '❀', '✿', '♥', '✦']));
    const s = 14 + Math.random() * 30;
    h.style.cssText = `left:${Math.random() * 100}%;font-size:${s}px;animation-duration:${8 + Math.random() * 8}s;--r:${(Math.random() - .5) * 120}deg`;
    f.appendChild(h); setTimeout(() => h.remove(), 17000);
  }, 900);
}

/* ---------------- WINDOW MANAGER ---------------- */
const wins = {}; let zTop = 100, cascade = 0;
function openApp(id, opts = {}) {
  const a = APP[id]; if (!a) return;
  if (wins[id]) { const w = wins[id]; if (w.classList.contains('hidden')) restore(id); focus(id); w.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 300 }); return; }
  closeMenus();
  const w = el('div', 'win');
  const W = Math.min(a.w, innerWidth - 20), H = Math.min(a.h, innerHeight - 90);
  const x = Math.max(8, Math.min(innerWidth - W - 8, (innerWidth - W) / 2 - 120 + cascade * 32));
  const y = Math.max(8, Math.min(innerHeight - H - 70, (innerHeight - H) / 2 - 60 + cascade * 28));
  cascade = (cascade + 1) % 6;
  Object.assign(w.style, { left: x + 'px', top: y + 'px', width: W + 'px', height: H + 'px' });
  w.innerHTML = `<div class="titlebar"><span class="ti">${ICONS[id]}</span><span class="tt">${a.name} — ${a.sub}</span>
    <button class="tb-btn" data-a="min" title="minimize">–</button><button class="tb-btn" data-a="max" title="maximize">□</button><button class="tb-btn x" data-a="close" title="close">✕</button></div>
    <div class="menubar"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>L</u>ove</span></div>
    <div class="wbody" ${a.noPad ? 'style="padding:0"' : ''}></div><div class="resize"></div>`;
  $('#windows').appendChild(w); wins[id] = w; w.dataset.id = id;
  a.render($('.wbody', w), w);
  w.addEventListener('pointerdown', () => focus(id));
  w.querySelector('.titlebar').addEventListener('dblclick', e => { if (!e.target.closest('.tb-btn')) toggleMax(id); });
  w.querySelectorAll('.tb-btn').forEach(b => b.onclick = e => { e.stopPropagation(); ({ min: minimize, max: toggleMax, close: closeApp })[b.dataset.a](id); });
  dragify(w, w.querySelector('.titlebar'));
  resizify(w, w.querySelector('.resize'));
  addTask(id); focus(id);
  if (!opts.silent) { const used = store.get('opened', []); if (!used.includes(id)) { used.push(id); store.set('opened', used); if (used.length === DESK_IDS.length - 1) setTimeout(() => notify('🏆', 'achievement unlocked', 'explorer: you opened every app. krish is very proud.'), 800); } }
}
function focus(id) {
  Object.values(wins).forEach(w => w.classList.remove('active'));
  const w = wins[id]; if (!w) return;
  w.style.zIndex = ++zTop; w.classList.add('active');
  document.querySelectorAll('.task').forEach(t => t.classList.toggle('on', t.dataset.id === id));
}
function closeApp(id) {
  const w = wins[id]; if (!w) return;
  w.classList.add('closing'); w._cleanup && w._cleanup();
  setTimeout(() => w.remove(), 280);
  delete wins[id]; const t = document.querySelector(`.task[data-id="${id}"]`); if (t) { t.style.transition = '.25s'; t.style.opacity = 0; t.style.transform = 'scale(.6)'; setTimeout(() => t.remove(), 250); }
}
function minimize(id) {
  const w = wins[id]; w.classList.add('minimizing');
  setTimeout(() => { w.classList.add('hidden'); w.classList.remove('minimizing', 'active'); }, 380);
  const t = document.querySelector(`.task[data-id="${id}"]`); t.classList.add('min'); t.classList.remove('on');
}
function restore(id) {
  const w = wins[id]; w.classList.remove('hidden'); w.style.animation = 'none'; void w.offsetWidth; w.style.animation = '';
  document.querySelector(`.task[data-id="${id}"]`).classList.remove('min');
}
function toggleMax(id) { wins[id].classList.toggle('max'); }
function addTask(id) {
  const t = el('button', 'task', `${ICONS[id]}<span>${APP[id].name}</span>`); t.dataset.id = id;
  t.onclick = () => { const w = wins[id]; if (w.classList.contains('hidden')) { restore(id); focus(id); } else if (w.classList.contains('active')) minimize(id); else focus(id); };
  $('#tasks').appendChild(t);
}
function dragify(w, handle) {
  handle.addEventListener('pointerdown', e => {
    if (e.target.closest('.tb-btn') || w.classList.contains('max')) return;
    const sx = e.clientX - w.offsetLeft, sy = e.clientY - w.offsetTop;
    handle.setPointerCapture(e.pointerId);
    let lx = e.clientX, tilt = 0, raf;
    const mv = ev => {
      w.style.left = Math.max(-w.offsetWidth + 80, Math.min(innerWidth - 80, ev.clientX - sx)) + 'px';
      w.style.top = Math.max(0, Math.min(innerHeight - 100, ev.clientY - sy)) + 'px';
      tilt = Math.max(-4, Math.min(4, (ev.clientX - lx) * 0.4)); lx = ev.clientX;
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => w.style.transform = `rotate(${tilt}deg)`);
    };
    const up = () => {
      handle.removeEventListener('pointermove', mv); handle.removeEventListener('pointerup', up);
      w.style.transition = 'transform .4s var(--ease)'; w.style.transform = ''; setTimeout(() => w.style.transition = '', 400);
    };
    handle.addEventListener('pointermove', mv); handle.addEventListener('pointerup', up);
  });
}
function resizify(w, h) {
  h.addEventListener('pointerdown', e => {
    e.stopPropagation(); h.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY, sw = w.offsetWidth, sh = w.offsetHeight;
    const mv = ev => { w.style.width = Math.max(300, sw + ev.clientX - sx) + 'px'; w.style.height = Math.max(200, sh + ev.clientY - sy) + 'px'; };
    const up = () => { h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); };
    h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up);
  });
}

/* ---------------- TASKBAR / START / NOTIFS ---------------- */
function closeMenus() { ['#startMenu', '#notifCenter', '#ctxMenu'].forEach(s => $(s).classList.add('hidden')); }
function setupTaskbar() {
  const sm = $('#startMenu');
  sm.innerHTML = `<div class="sm-head"><div class="avatar">🌸</div><div><b>${C.herName}</b><span style="font-size:12px;opacity:.9">administrator of my heart</span></div></div>
    <div class="sm-list">${APPS.filter(a => a.id !== 'trash').map(a => `<button class="sm-item" data-id="${a.id}">${ICONS[a.id]}<span><b>${a.name}</b><br><small style="color:var(--ink2)">${a.sub}</small></span></button>`).join('')}</div>
    <div class="sm-foot"><button class="btn-soft" id="smReward">🎁 daily gift</button><button class="btn-soft" id="smOff">⏻ log off</button></div>`;
  sm.addEventListener('click', e => { const b = e.target.closest('.sm-item'); if (b) { openApp(b.dataset.id); closeMenus(); } });
  $('#smReward').onclick = () => { closeMenus(); dailyReward(true); };
  $('#smOff').onclick = () => { closeMenus(); logoff(); };
  $('#startBtn').onclick = e => { e.stopPropagation(); const h = sm.classList.contains('hidden'); closeMenus(); if (h) { sm.classList.remove('hidden'); sm.style.animation = 'none'; void sm.offsetWidth; sm.style.animation = ''; } };
  $('#bellBtn').onclick = e => { e.stopPropagation(); const nc = $('#notifCenter'); const h = nc.classList.contains('hidden'); closeMenus(); if (h) { renderNC(); nc.classList.remove('hidden'); $('#bellDot').classList.remove('on'); } };
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#startMenu,#notifCenter,#ctxMenu,#startBtn,#bellBtn')) closeMenus(); });
}
function logoff() {
  const ov = el('div', 'screen', `<div class="login-card glass"><div class="avatar">😢</div><div class="login-name">leaving already?</div><div class="login-hint">the computer will miss you</div><div class="center"><button class="btn-soft" id="stay">stay ♥</button><button class="btn-pink" id="go">log off</button></div></div>`);
  ov.style.background = 'color-mix(in srgb,var(--wall2) 70%,transparent)'; ov.style.backdropFilter = 'blur(8px)';
  document.body.appendChild(ov);
  $('#stay', ov).onclick = e => { burst(e.clientX, e.clientY, 20); ov.remove(); notify('🥰', 'yay', 'good choice.'); };
  $('#go', ov).onclick = () => { sessionStorage.removeItem('skipBoot'); ov.remove(); location.reload(); };
}
const ncLog = [];
function notify(icon, title, text) {
  ncLog.unshift({ icon, title, text, t: new Date() });
  if (!$('#notifCenter').classList.contains('hidden')) renderNC(); else $('#bellDot').classList.add('on');
  const t = el('div', 'toast glass', `<div class="ic">${icon}</div><div><b>${esc(title)}</b><p>${esc(text)}</p></div>`);
  $('#toasts').appendChild(t);
  const kill = () => { t.classList.add('out'); setTimeout(() => t.remove(), 400); };
  t.onclick = kill; setTimeout(kill, 5200);
}
function renderNC() {
  $('#notifCenter').innerHTML = `<h3>notifications <button class="btn-soft" id="ncClear" style="font-size:11px;padding:3px 8px">clear</button></h3>` +
    (ncLog.length ? ncLog.map((n, i) => `<div class="nc-item" style="animation-delay:${i * .04}s">${n.icon} <b>${esc(n.title)}</b><br>${esc(n.text)}<small>${n.t.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}</small></div>`).join('') : '<div class="nc-item">all caught up ♥</div>');
  $('#ncClear').onclick = () => { ncLog.length = 0; renderNC(); };
}
function scheduleNotifs() {
  const go = () => { if (settings.notifs && !document.hidden) notify('💌', `from ${C.myName}`, rand(C.notifications)); setTimeout(go, 45000 + Math.random() * 60000); };
  setTimeout(go, 30000);
}

/* ---------------- DAILY REWARD ---------------- */
function dailyReward(force) {
  const today = new Date().toDateString(), last = store.get('lastLogin');
  let streak = store.get('streak', 0);
  if (last !== today) {
    const y = new Date(Date.now() - 864e5).toDateString();
    streak = last === y ? streak + 1 : 1; store.set('streak', streak); store.set('lastLogin', today);
  } else if (!force) return;
  const dayNum = Math.floor(Date.now() / 864e5), r = C.daily[dayNum % C.daily.length];
  openApp('reward', { silent: true });
}
APP.reward = { id: 'reward', name: 'daily gift', sub: 'your login reward', w: 360, h: 340, render(b) {
  const dayNum = Math.floor(Date.now() / 864e5), r = C.daily[dayNum % C.daily.length], s = store.get('streak', 1);
  b.innerHTML = `<div class="reward"><div class="app-h">today's gift for you</div><div class="app-sub">come back tomorrow for a new one</div><span class="gift" id="rg">🎁</span><p class="app-sub">tap to open</p></div>`;
  $('#rg', b).onclick = e => {
    e.target.classList.add('open'); confetti(60);
    setTimeout(() => b.innerHTML = `<div class="reward"><div class="big">${r.emoji}</div><p style="font-size:17px;margin:12px 0;font-family:Caveat;font-size:26px;color:var(--p600)">${esc(r.text)}</p><span class="streak">🔥 ${s} day login streak</span></div>`, 600);
  };
} };
ICONS.reward = ICONS.surprise;

/* ---------------- CONTEXT MENU ---------------- */
function setupContext() {
  const m = $('#ctxMenu');
  $('#icons').addEventListener('contextmenu', e => {
    e.preventDefault();
    m.innerHTML = `<button data-c="settings">🎨 personalize</button><button data-c="arrange">✨ arrange icons</button><button data-c="refresh">🔄 refresh (with love)</button><button data-c="terminal">💻 open terminal</button><button data-c="gift">🎁 daily gift</button>`;
    m.style.left = Math.min(e.clientX, innerWidth - 200) + 'px'; m.style.top = Math.min(e.clientY, innerHeight - 200) + 'px';
    m.classList.remove('hidden');
  });
  m.onclick = e => {
    const c = e.target.dataset.c; closeMenus();
    if (c === 'arrange') { store.set('iconPos', {}); renderIcons(); }
    else if (c === 'refresh') { document.querySelectorAll('.icon').forEach((ic, i) => setTimeout(() => { ic.classList.remove('bounce'); void ic.offsetWidth; ic.classList.add('bounce'); }, i * 50)); burst(innerWidth / 2, innerHeight / 2, 24); }
    else if (c === 'gift') dailyReward(true);
    else if (c) openApp(c);
  };
}

/* ---------------- EFFECTS ---------------- */
function burst(x, y, n = 14, chars = ['💗', '💖', '♥', '✨', '💕']) {
  for (let i = 0; i < n; i++) {
    const s = el('div', 'burst', rand(chars)); const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 110;
    s.style.cssText = `left:${x}px;top:${y}px;font-size:${14 + Math.random() * 16}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;--r:${(Math.random() - .5) * 360}deg;color:var(--p500)`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 1100);
  }
}
function confetti(n = 80) {
  const cols = ['#ff7eb3', '#ffc8dd', '#ffd36e', '#bfe3ec', '#c9b7ff', '#fff'];
  for (let i = 0; i < n; i++) {
    const c = el('div', 'confetti'); c.style.cssText = `left:${Math.random() * 100}vw;background:${rand(cols)};animation-duration:${2 + Math.random() * 2.5}s;animation-delay:${Math.random() * .6}s`;
    document.body.appendChild(c); setTimeout(() => c.remove(), 5500);
  }
}
let lastSpark = 0;
document.addEventListener('pointermove', e => {
  if (!settings.sparkles || e.pointerType !== 'mouse') return;
  const now = performance.now(); if (now - lastSpark < 45) return; lastSpark = now;
  const s = el('div', 'spark', rand(['✦', '♥', '·', '✧'])); s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${rand(['#ff7eb3', '#ffb3d1', '#ffd36e'])};--dx:${(Math.random() - .5) * 30}px;--dy:${10 + Math.random() * 25}px`;
  document.body.appendChild(s); setTimeout(() => s.remove(), 900);
});

/* ---------------- EASTER EGGS ---------------- */
function setupEggs() {
  // 1. konami code
  const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']; let ki = 0;
  // 2. typing her name anywhere on the desktop
  let typed = '';
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    ki = e.key === K[ki] ? ki + 1 : (e.key === K[0] ? 1 : 0);
    if (ki === K.length) { ki = 0; confetti(150); notify('🎮', 'cheat code activated', 'infinite love mode: ON. (it was always on.)'); }
    typed = (typed + e.key.toLowerCase()).slice(-12);
    if (typed.endsWith(C.herName.toLowerCase())) { typed = ''; heartRain(); notify('💞', 'you said the magic word', 'it\'s you. it was always you.'); }
  });
  // 3. click the start heart 7 times fast
  let clicks = 0, ct; $('#startBtn span').addEventListener('click', e => { e.stopPropagation(); clicks++; clearTimeout(ct); ct = setTimeout(() => clicks = 0, 1500); burst(e.clientX, e.clientY, 5); if (clicks === 7) { clicks = 0; notify('💓', 'heart overload', 'you found my heartbeat. it speeds up like that every time i see you.'); document.body.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.015)' }, { transform: 'scale(1)' }], { duration: 400, iterations: 3 }); } });
  // 4. clicking the clock
  $('#clock').addEventListener('click', () => notify('⏰', 'time check', rand(['it\'s time to tell you i love you.', 'every minute with you is my favourite minute.', `${C.myName} is thinking about you right now. guaranteed.`])));
  // 5. double click empty desktop = heart burst
  $('#icons').addEventListener('dblclick', e => { if (e.target.id === 'icons') burst(e.clientX, e.clientY, 16); });
  // 6. idle for 2 mins
  let idle; const reset = () => { clearTimeout(idle); idle = setTimeout(() => notify('👀', 'hello?', 'you went quiet. i miss you already.'), 120000); };
  ['pointermove', 'keydown'].forEach(ev => document.addEventListener(ev, reset)); reset();
  // 7. late night
  const h = new Date().getHours(); if (h >= 0 && h < 5) setTimeout(() => notify('🌙', 'it\'s late', 'why are you awake, pretty girl? go sleep (but i love you)'), 6000);
  // 8. secret console message
  console.log('%cinderOS ♥ %cif you\'re reading this, you\'re snooping. i love you anyway.', 'color:#f2559a;font-size:20px;font-weight:bold', 'color:#a8285f');
}
function heartRain() {
  for (let i = 0; i < 40; i++) setTimeout(() => {
    const h = el('div', 'confetti', '💗'); h.style.cssText = `left:${Math.random() * 100}vw;background:none;width:auto;height:auto;font-size:${18 + Math.random() * 20}px;animation-duration:${2.5 + Math.random() * 2}s`;
    document.body.appendChild(h); setTimeout(() => h.remove(), 5000);
  }, i * 60);
}

/* ================= APPS ================= */
function appLove(b) {
  let i = 0;
  b.innerHTML = `<div class="app-h">reasons i love you</div><div class="app-sub">running love.exe … ${C.reasons.length}+ reasons loaded (actual count: infinite)</div>
    <div class="reason anim" id="rs"></div><div class="counter" id="rc"></div>
    <div class="center"><button class="btn-soft" id="rp">← prev</button><button class="btn-pink" id="rn">another one ♥</button><button class="btn-soft" id="rr">🎲 random</button></div>`;
  const show = e => { const r = $('#rs', b); r.classList.remove('anim'); void r.offsetWidth; r.classList.add('anim'); r.textContent = C.reasons[i]; $('#rc', b).textContent = `reason #${i + 1} of ∞`; if (e) burst(e.clientX, e.clientY, 6); };
  $('#rn', b).onclick = e => { i = (i + 1) % C.reasons.length; show(e); };
  $('#rp', b).onclick = e => { i = (i - 1 + C.reasons.length) % C.reasons.length; show(); };
  $('#rr', b).onclick = e => { i = Math.floor(Math.random() * C.reasons.length); show(e); };
  show();
}

function appMemories(b) {
  b.innerHTML = `<div class="app-h">memories</div><div class="app-sub">C:\\inder\\memories — ${C.memories.length} items · click one to open</div><div class="grid-photos"></div>`;
  const g = $('.grid-photos', b);
  C.memories.forEach((m, i) => {
    const p = el('div', 'polaroid', `<div class="ph" style="${m.src ? `background-image:url('${esc(m.src)}')` : `background:linear-gradient(135deg,var(--p100),var(--p300))`}">${m.src ? '' : m.emoji}</div><div class="cap">${esc(m.caption)}</div>`);
    p.style.setProperty('--rot', ((i % 2 ? 1 : -1) * (1 + Math.random() * 3)) + 'deg');
    p.style.animation = `pop .5s ${i * .07}s var(--ease) both`;
    p.onclick = () => {
      const v = el('div', 'viewer', `<div class="polaroid"><div class="ph" style="${m.src ? `background-image:url('${esc(m.src)}')` : 'background:linear-gradient(135deg,var(--p100),var(--p300));font-size:90px'}">${m.src ? '' : m.emoji}</div><div class="cap">${esc(m.caption)}${m.date ? ' · ' + esc(m.date) : ''}</div></div>`);
      v.onclick = () => { v.style.transition = '.25s'; v.style.opacity = 0; setTimeout(() => v.remove(), 250); };
      b.appendChild(v); b.scrollTop = 0;
    };
    g.appendChild(p);
  });
}

function appMusic(b, w) {
  let i = 0, playing = false, fake = 0, timer; const audio = new Audio();
  b.innerHTML = `<div class="player"><div class="vinyl" id="vy"><i>♥</i></div><div style="text-align:center"><b id="mt"></b><div class="app-sub" id="ma" style="margin:0"></div></div>
    <div class="eq" id="eq">${Array.from({ length: 12 }, (_, k) => `<span style="animation-delay:${k * .07}s"></span>`).join('')}</div>
    <div class="prog"><div id="mp"></div></div>
    <div class="ctrls"><button id="mb">⏮</button><button class="big" id="mpl">▶</button><button id="mf">⏭</button></div>
    <div class="tracklist" id="tl"></div></div>`;
  const load = () => {
    const s = C.songs[i]; $('#mt', b).textContent = s.title; $('#ma', b).textContent = s.artist;
    $('#tl', b).innerHTML = C.songs.map((x, k) => `<div class="track ${k === i ? 'cur' : ''}" data-k="${k}"><span>${k === i && playing ? '♫' : '♡'} ${esc(x.title)}</span><span class="cd">${esc(x.artist)}</span></div>`).join('');
    if (load.k === i) return; load.k = i;
    if (s.src) audio.src = s.src; else audio.removeAttribute('src');
    fake = 0; $('#mp', b).style.width = 0;
  };
  const setPlay = p => {
    playing = p; $('#mpl', b).textContent = p ? '⏸' : '▶'; $('#vy', b).classList.toggle('spin', p); $('#eq', b).classList.toggle('on', p);
    clearInterval(timer);
    if (p) { const s = C.songs[i]; if (s.src) audio.play().catch(() => { if (s.link) window.open(s.link, '_blank'); }); else if (s.link) window.open(s.link, '_blank'); timer = setInterval(() => { const pct = audio.duration ? audio.currentTime / audio.duration * 100 : (fake = (fake + .5) % 100); $('#mp', b).style.width = pct + '%'; }, 300); }
    else audio.pause();
    load();
  };
  $('#mpl', b).onclick = () => setPlay(!playing);
  $('#mf', b).onclick = () => { i = (i + 1) % C.songs.length; load(); if (playing) setPlay(true); };
  $('#mb', b).onclick = () => { i = (i - 1 + C.songs.length) % C.songs.length; load(); if (playing) setPlay(true); };
  $('#tl', b).onclick = e => { const t = e.target.closest('.track'); if (t) { i = +t.dataset.k; setPlay(true); } };
  audio.onended = () => $('#mf', b).click();
  w._cleanup = () => { audio.pause(); clearInterval(timer); };
  load();
}

function appArcade(b, w) {
  const menu = () => {
    w._cleanup && w._cleanup();
    b.innerHTML = `<div class="app-h">arcade</div><div class="app-sub">insert coin (a kiss) to play</div><div class="cards">
      <button class="card" data-g="catch"><div class="e">🧺</div><b>catch my heart</b><small>catch the hearts, dodge the 💔</small></button>
      <button class="card" data-g="match"><div class="e">🃏</div><b>memory match</b><small>find all the cute pairs</small></button>
      <button class="card" data-g="quiz"><div class="e">❓</div><b>how well do you know us</b><small>a very hard quiz</small></button></div>`;
    b.onclick = e => { const c = e.target.closest('.card'); if (c) { b.onclick = null; ({ catch: gCatch, match: gMatch, quiz: gQuiz })[c.dataset.g](); } };
  };
  const back = '<button class="btn-soft" id="back" style="margin-bottom:10px">← arcade</button>';
  function gCatch() {
    b.innerHTML = `${back}<div class="hud"><span>score: <b id="sc">0</b></span><span>lives: <b id="lv">♥♥♥</b></span></div><div class="game-area" id="ga"><div class="basket" id="bk">🧺</div></div>`;
    $('#back', b).onclick = menu;
    const ga = $('#ga', b), bk = $('#bk', b); let score = 0, lives = 3, x = 50, drops = [], alive = true, raf, spawnT = 0, last = performance.now();
    const best = store.get('catchBest', 0);
    ga.addEventListener('pointermove', e => { const r = ga.getBoundingClientRect(); x = (e.clientX - r.left) / r.width * 100; });
    const key = e => { if (e.key === 'ArrowLeft') x -= 6; if (e.key === 'ArrowRight') x += 6; }; document.addEventListener('keydown', key);
    const loop = t => {
      if (!alive) return; const dt = Math.min(50, t - last); last = t;
      x = Math.max(5, Math.min(95, x)); bk.style.left = x + '%';
      spawnT -= dt; if (spawnT <= 0) { spawnT = Math.max(350, 900 - score * 12); const bad = Math.random() < .2; const d = el('div', 'drop', bad ? '💔' : rand(['💗', '💖', '💝', '🌸'])); d._x = 5 + Math.random() * 90; d._y = -30; d._v = .12 + Math.random() * .08 + score * .003; d._bad = bad; d.style.left = d._x + '%'; ga.appendChild(d); drops.push(d); }
      const H = ga.clientHeight;
      drops = drops.filter(d => {
        d._y += d._v * dt; d.style.transform = `translateY(${d._y}px)`;
        if (d._y > H - 60 && d._y < H - 20 && Math.abs(d._x - x) < 9) { if (d._bad) { lives--; ga.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 200 }); } else score++; d.remove(); return false; }
        if (d._y > H) { if (!d._bad) lives--; d.remove(); return false; }
        return true;
      });
      $('#sc', b).textContent = score; $('#lv', b).textContent = '♥'.repeat(Math.max(0, lives)) || '—';
      if (lives <= 0) { alive = false; if (score > best) store.set('catchBest', score); ga.insertAdjacentHTML('beforeend', `<div class="viewer"><div style="text-align:center"><div class="app-h">game over</div><p>you caught ${score} hearts${score > best ? ' — new record! 🏆' : ` (best: ${best})`}</p><p class="app-sub">but you caught mine first ♥</p><button class="btn-pink" id="again">play again</button></div></div>`); $('#again', b).onclick = gCatch; return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    w._cleanup = () => { alive = false; cancelAnimationFrame(raf); document.removeEventListener('keydown', key); };
  }
  function gMatch() {
    const em = ['💗', '🌸', '🧸', '🍓', '🌙', '🎀', '🦋', '🍰']; const deck = [...em, ...em].sort(() => Math.random() - .5);
    let open = [], found = 0, moves = 0;
    b.innerHTML = `${back}<div class="hud"><span>moves: <b id="mv">0</b></span><span>pairs: <b id="pr">0</b>/8</span></div><div class="mem-grid">${deck.map((e, k) => `<div class="mcard" data-k="${k}"><div class="in"><div class="f">♥</div><div class="b">${e}</div></div></div>`).join('')}</div>`;
    $('#back', b).onclick = menu;
    $('.mem-grid', b).onclick = e => {
      const c = e.target.closest('.mcard'); if (!c || c.classList.contains('flip') || c.classList.contains('done') || open.length === 2) return;
      c.classList.add('flip'); open.push(c);
      if (open.length === 2) {
        moves++; $('#mv', b).textContent = moves;
        const [a, z] = open;
        if (deck[a.dataset.k] === deck[z.dataset.k]) { setTimeout(() => { a.classList.add('done'); z.classList.add('done'); open = []; found++; $('#pr', b).textContent = found; const r = z.getBoundingClientRect(); burst(r.x + r.width / 2, r.y + r.height / 2, 8); if (found === 8) { confetti(100); notify('🃏', 'memory match', `solved in ${moves} moves! you never forget anything, do you?`); } }, 400); }
        else setTimeout(() => { a.classList.remove('flip'); z.classList.remove('flip'); open = []; }, 800);
      }
    };
  }
  function gQuiz() {
    const Q = [
      ['who said "i love you" first?', ['me (krish)', 'you (inder)', 'we said it together', 'the dog'], 0],
      ['what do i love most about you?', ['your smile', 'your laugh', 'your heart', 'all of the above, obviously'], 3],
      ['how much do i love you?', ['a lot', 'a normal amount', 'more than yesterday, less than tomorrow', 'error: number too large'], 3],
      ['who is the cutest person on earth?', [C.herName, C.herName, C.herName, C.herName], -1]
    ];
    let q = 0, score = 0;
    const show = () => {
      if (q >= Q.length) { b.innerHTML = `${back}<div class="reward"><div class="big">🏆</div><div class="app-h">${score}/${Q.length}</div><p class="app-sub">results: you know us perfectly. (you passed no matter what, this quiz is rigged in your favour)</p></div>`; $('#back', b).onclick = menu; confetti(80); return; }
      const [t, opts, ans] = Q[q];
      b.innerHTML = `${back}<div class="counter">question ${q + 1} / ${Q.length}</div><div class="reason anim" style="min-height:90px;font-size:28px">${esc(t)}</div><div class="cards" style="grid-template-columns:1fr 1fr">${opts.map((o, k) => `<button class="card" data-k="${k}" style="text-align:center">${esc(o)}</button>`).join('')}</div>`;
      $('#back', b).onclick = menu;
      b.querySelectorAll('.card').forEach(c => c.onclick = e => { const ok = ans === -1 || +c.dataset.k === ans; if (ok) { score++; burst(e.clientX, e.clientY, 10); } c.style.background = ok ? 'var(--p200)' : '#eee'; c.style.borderColor = ok ? 'var(--p500)' : '#ccc'; setTimeout(() => { q++; show(); }, 600); });
    };
    show();
  }
  menu();
}

function letterList(b, items, title, sub) {
  b.innerHTML = `<div class="app-h">${title}</div><div class="app-sub">${sub}</div><div class="cards">${items.map((l, k) => `<button class="card envelope" data-k="${k}" style="animation:pop .4s ${k * .06}s var(--ease) both"><div class="e">${l.emoji}</div><b>${esc(l.title)}</b><small>✉ sealed with love</small></button>`).join('')}</div>`;
  b.querySelectorAll('.card').forEach(c => c.onclick = e => {
    const l = items[c.dataset.k]; burst(e.clientX, e.clientY, 8, ['💌', '♥', '✨']);
    b.innerHTML = `<button class="btn-soft" id="lb" style="margin-bottom:12px">← back</button><div class="letter"><b style="font-size:26px">${l.emoji} ${esc(l.title)}</b>\n\n${esc(l.body)}</div>`;
    $('#lb', b).onclick = () => letterList(b, items, title, sub);
  });
}
function appLetters(b) { letterList(b, C.letters, 'letters', 'open when… (no peeking ahead. ok fine, you can peek.)'); }

function appClassified(b) {
  if (sessionStorage.getItem('unlocked')) return letterList(b, C.secrets, 'classified 🔓', 'access granted. top secret. eyes only: inder.');
  b.innerHTML = `<div class="lock-screen"><div class="big">🔒</div><div class="app-h">restricted access</div><div class="app-sub">enter passcode · hint: ${esc(C.classifiedHint)}</div><input class="pin-input" id="pin" maxlength="8" inputmode="numeric" placeholder="••••"><button class="btn-pink" id="pu">unlock</button><p class="app-sub" id="pm" style="margin-top:12px"></p></div>`;
  let tries = 0;
  const go = () => {
    const v = $('#pin', b).value.trim();
    if (v === C.classifiedPin) { sessionStorage.setItem('unlocked', 1); confetti(70); notify('🔓', 'classified', 'access granted. welcome, agent inder.'); appClassified(b); }
    else { tries++; const p = $('#pin', b); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); p.value = ''; $('#pm', b).textContent = ['wrong! (but cute attempt)', 'nope. think harder ♥', 'hint: it\'s our day', `psst… it's ${C.classifiedPin}`][Math.min(tries - 1, 3)]; }
  };
  $('#pu', b).onclick = go; $('#pin', b).onkeydown = e => e.key === 'Enter' && go();
  setTimeout(() => $('#pin', b)?.focus(), 300);
}

function appDates(b) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const items = C.dates.map(d => ({ ...d, dt: new Date(d.date + 'T00:00') })).sort((a, z) => a.dt - z.dt);
  const next = items.find(d => d.dt >= now);
  b.innerHTML = `<div class="app-h">our dates</div><div class="app-sub">every day with you is special, but these ones especially</div>
    ${next ? `<div class="card envelope" style="margin-bottom:16px;text-align:center"><small>next up</small><b style="font-size:18px">${esc(next.title)}</b><div class="w-count"><span class="n">${Math.round((next.dt - now) / 864e5)}</span> days to go</div></div>` : ''}
    <div class="timeline">${items.map((d, k) => { const diff = Math.round((d.dt - now) / 864e5); return `<div class="tl" style="animation-delay:${k * .08}s"><small>${d.dt.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase()}</small><b style="display:block">${esc(d.title)}</b><span class="app-sub">${esc(d.note)}</span><div class="cd">${diff > 0 ? `in ${diff} days ⏳` : diff === 0 ? 'today!! 🎉' : `${-diff} days ago ♥`}</div></div>`; }).join('')}</div>`;
}

function appNotes(b) {
  const cols = ['#fff0a8', '#ffd6e7', '#d6f0ff', '#e3d6ff', '#d9ffd6'];
  let notes = store.get('notes', null) || C.notes.map(t => ({ t, mine: false }));
  const save = () => store.set('notes', notes);
  const render = () => {
    b.innerHTML = `<div class="app-h">notes</div><div class="app-sub">little messages from me — and room for yours too</div><div class="notes-wrap"></div><div style="margin-top:14px"><button class="btn-pink" id="na">+ new note</button></div>`;
    const wrap = $('.notes-wrap', b);
    notes.forEach((n, k) => {
      const s = el('div', 'sticky'); s.style.background = cols[k % cols.length]; s.style.setProperty('--rot', ((k % 3) - 1) * 2.5 + 'deg'); s.style.animation = `pop .4s ${k * .05}s var(--ease) both`;
      if (n.mine) { s.innerHTML = `<button class="del">✕</button><textarea placeholder="write something...">${esc(n.t)}</textarea>`; $('textarea', s).oninput = e => { n.t = e.target.value; save(); }; $('.del', s).onclick = () => { notes.splice(k, 1); save(); render(); }; }
      else s.innerHTML = `${esc(n.t)}<div style="position:absolute;bottom:6px;right:10px;font-size:16px">— ${esc(C.myName)}</div>`;
      wrap.appendChild(s);
    });
    $('#na', b).onclick = () => { notes.push({ t: '', mine: true }); save(); render(); b.querySelectorAll('textarea'); const ts = b.querySelectorAll('textarea'); ts[ts.length - 1]?.focus(); };
  };
  render();
}

function appSurprise(b) {
  b.innerHTML = `<div class="reward"><div class="app-h">surprise.exe</div><div class="app-sub">warning: contains random acts of love</div><span class="gift" id="sg">🎁</span><div class="surprise-out" id="so">click the gift</div></div>`;
  const g = $('#sg', b);
  g.onclick = e => {
    if (g.classList.contains('open')) return;
    g.classList.add('open'); confetti(50);
    setTimeout(() => {
      const o = $('#so', b); o.style.animation = 'none'; void o.offsetWidth; o.style.animation = '';
      o.innerHTML = `<b>${esc(rand(C.surprises))}</b><br><button class="btn-soft" id="sa" style="margin-top:12px">another one</button>`;
      $('#sa', b).onclick = () => { g.classList.remove('open'); g.style.animation = 'pop .5s var(--ease)'; o.textContent = 'click the gift'; };
    }, 650);
  };
}

function appTerminal(b) {
  b.innerHTML = `<div class="term"><div id="out"></div><div class="term-in"><span class="acc">inder@love:~$</span><input id="ti" autocomplete="off" spellcheck="false"></div></div>`;
  const out = $('#out', b), inp = $('#ti', b), term = $('.term', b), hist = []; let hi = 0;
  const print = (t, c = 'ok') => { out.insertAdjacentHTML('beforeend', `<div class="ln ${c}">${t}</div>`); term.scrollTop = term.scrollHeight; };
  const type = (t, c = 'ok') => new Promise(res => { const d = el('div', 'ln ' + c); out.appendChild(d); let k = 0; const iv = setInterval(() => { d.textContent = t.slice(0, ++k); term.scrollTop = term.scrollHeight; if (k >= t.length) { clearInterval(iv); res(); } }, 18); });
  print('inderOS terminal v1.0 — type <span class="acc">help</span> to begin. some commands are secret ♥', 'dim');
  term.onclick = () => inp.focus(); setTimeout(() => inp.focus(), 300);
  const builtin = {
    help: () => print('commands: help, whoami, date, open &lt;app&gt;, ls, cat &lt;file&gt;, theme &lt;pink|peach|lilac|night&gt;, clear, neofetch\nthere are also ' + Object.keys(C.commands).length + ' secret commands. try guessing.'),
    whoami: () => print(`${C.herName} — administrator, owner, and the reason this OS exists.`),
    date: () => print(new Date().toString()),
    clear: () => out.innerHTML = '',
    ls: () => print('love.exe  memories/  music/  letters/  classified/  secret.txt  reasons.txt'),
    neofetch: () => print(`<span class="acc">   ♥♥   ♥♥  </span>  ${C.herName}@inderOS
<span class="acc"> ♥♥♥♥♥ ♥♥♥♥♥</span>  ------------
<span class="acc"> ♥♥♥♥♥♥♥♥♥♥♥</span>  OS: inderOS v1.0
<span class="acc">  ♥♥♥♥♥♥♥♥♥ </span>  Kernel: heart 💗
<span class="acc">    ♥♥♥♥♥   </span>  Uptime: ${Math.floor((Date.now() - new Date(C.anniversary)) / 864e5)} days together
<span class="acc">      ♥     </span>  Memory: full of you`),
    cat: a => print(a === 'secret.txt' ? 'the password to everything is you.' : a === 'reasons.txt' ? C.reasons.map((r, k) => `${k + 1}. ${esc(r)}`).join('\n') : `cat: ${esc(a || '')}: no such file (but there is a cat in my heart)`),
    open: a => { const id = APPS.find(x => x.id === a || x.name.startsWith(a || '~'))?.id; if (id) { print('opening ' + APP[id].name + '…'); openApp(id); } else print('app not found. try: love, memories, music, arcade, letters…', 'dim'); },
    theme: a => { if (['pink', 'peach', 'lilac', 'night'].includes(a)) { settings.theme = a; applySettings(); print('theme set to ' + a + ' ✨'); } else print('usage: theme pink|peach|lilac|night', 'dim'); },
    sudo: () => print('nice try. only krish has root access to your heart. (just kidding, you do.)'),
    exit: () => print('there is no exit. you\'re stuck with me ♥')
  };
  inp.onkeydown = async e => {
    if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); inp.value = hist[hi] || ''; return; }
    if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; return; }
    if (e.key !== 'Enter') return;
    const raw = inp.value.trim(); inp.value = ''; if (!raw) return;
    hist.push(raw); hi = hist.length;
    print(`<span class="acc">inder@love:~$</span> ${esc(raw)}`);
    const [cmd, ...args] = raw.toLowerCase().split(/\s+/), key = raw.toLowerCase().replace(/[\s']/g, '');
    if (builtin[cmd]) builtin[cmd](args.join(' '));
    else if (C.commands[key] || C.commands[cmd]) { inp.disabled = true; await type(C.commands[key] || C.commands[cmd], 'acc'); inp.disabled = false; inp.focus(); const r = inp.getBoundingClientRect(); burst(r.x + 40, r.y, 10); const f = store.get('found', []); if (!f.includes(key)) { f.push(key); store.set('found', f); notify('🔑', 'secret command found', `${f.length}/${Object.keys(C.commands).length} discovered`); } }
    else print(`command not found: ${esc(cmd)}. (hint: try saying how you feel)`, 'dim');
  };
}

function appSettings(b) {
  const themes = [['pink', 'linear-gradient(135deg,#ffd6e7,#ff7eb3)'], ['peach', 'linear-gradient(135deg,#ffe3d3,#ff9a7a)'], ['lilac', 'linear-gradient(135deg,#eadcff,#ad7eff)'], ['night', 'linear-gradient(135deg,#4a1a3c,#1d0a18)']];
  const wps = [['hearts', 'radial-gradient(circle,#fff 0,#ffb3d1 80%)'], ['checker', 'repeating-conic-gradient(#ffd6e7 0 25%,#fff 0 50%) 0 0/16px 16px'], ['sunset', 'linear-gradient(180deg,#fdebd3,#cfe0ea,#f9c4d2)'], ['stars', 'radial-gradient(circle at 50% 120%,#7a2a5c,#1d0a18 70%)']];
  const render = () => {
    b.innerHTML = `<div class="app-h">personalize</div><div class="app-sub">make it yours (it already is)</div>
    <div class="set-row"><h5>theme</h5><div class="swatches">${themes.map(([n, g]) => `<button class="sw ${settings.theme === n ? 'on' : ''}" data-t="${n}" style="background:${g}">${n}</button>`).join('')}</div></div>
    <div class="set-row"><h5>wallpaper</h5><div class="swatches">${wps.map(([n, g]) => `<button class="sw ${settings.wallpaper === n ? 'on' : ''}" data-w="${n}" style="background:${g};${n === 'stars' ? 'color:#fff' : ''}">${n}</button>`).join('')}</div></div>
    <div class="set-row"><h5>desktop</h5>
      <label class="toggle"><input type="checkbox" data-k="widgets" ${settings.widgets ? 'checked' : ''}> show widgets</label>
      <label class="toggle"><input type="checkbox" data-k="floaters" ${settings.floaters ? 'checked' : ''}> floating hearts</label>
      <label class="toggle"><input type="checkbox" data-k="sparkles" ${settings.sparkles ? 'checked' : ''}> cursor sparkle trail</label>
      <label class="toggle"><input type="checkbox" data-k="notifs" ${settings.notifs ? 'checked' : ''}> cute notifications from ${esc(C.myName)}</label>
      <button class="btn-soft" id="ra" style="margin-top:8px">reset icon layout</button></div>`;
    b.querySelectorAll('[data-t]').forEach(x => x.onclick = () => { settings.theme = x.dataset.t; applySettings(); render(); });
    b.querySelectorAll('[data-w]').forEach(x => x.onclick = () => { settings.wallpaper = x.dataset.w; applySettings(); render(); });
    b.querySelectorAll('[data-k]').forEach(x => x.onchange = () => { settings[x.dataset.k] = x.checked; applySettings(); });
    $('#ra', b).onclick = () => { store.set('iconPos', {}); renderIcons(); };
  };
  render();
}

function appAbout(b) {
  const days = Math.floor((Date.now() - new Date(C.anniversary)) / 864e5);
  b.innerHTML = `<div style="text-align:center"><div style="width:90px;margin:0 auto">${ICONS.computer}</div><div class="app-h">inderOS v1.0</div><div class="app-sub">an operating system made with an unreasonable amount of love.</div></div>
  <div class="card" style="font-size:14px;line-height:1.8"><b>registered to:</b> ${esc(C.herName)}<br><b>developer:</b> ${esc(C.myName)}<br><b>processor:</b> one heart @ ∞ GHz<br><b>memory:</b> ${C.memories.length} memories (and counting)<br><b>uptime:</b> ${days} days together<br><b>system status:</b> loved ♥</div>
  <p class="app-sub" style="text-align:center;margin-top:12px">tip: try right-clicking the desktop, or open the terminal.</p>`;
}

function appTrash(b) {
  b.innerHTML = `<div class="lock-screen"><div class="big">🗑️</div><div class="app-h">recycle bin</div><div class="app-sub">items: 0</div><p>i deleted all my bad days. they don't matter anymore — you're here.</p><button class="btn-soft" id="tb" style="margin-top:12px">empty bin</button></div>`;
  $('#tb', b).onclick = e => { burst(e.clientX, e.clientY, 12, ['✨']); notify('🗑️', 'recycle bin', 'already empty. my heart only keeps the good stuff.'); };
}

boot();
})();

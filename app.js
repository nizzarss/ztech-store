const $ = s => document.querySelector(s);
const view = $('#view'), sheet = $('#sheet');
const apkUrl = a => `https://github.com/${STORE.repo}/releases/latest/download/${a.apkFile}`;
const get = id => APPS.find(a => a.id === id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#ig').href = STORE.instagram; $('#mail').href = 'mailto:' + STORE.email;

function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),3200)}

function card(a){return `<a class="card" href="#/app/${a.id}"><img src="${a.icon}" alt="" loading="lazy"><div><h3>${esc(a.name)}</h3><p>${esc(a.short)}</p><span class="chip">${esc(a.category)}</span></div></a>`}

function home(q=''){
  const list = APPS.filter(a => (a.name+' '+a.short+' '+a.category).toLowerCase().includes(q.toLowerCase()));
  const f = APPS[0];
  let h = '';
  if(!q && f) h += `<section class="hero"><img class="bg" src="${f.feature}" alt=""><div class="in"><span class="tag">Unggulan</span><h1>${esc(f.name)}</h1><p>${esc(f.tagline)}. ${esc(f.short)}</p><div class="row"><button class="btn" data-install="${f.id}">Unduh APK</button><a class="btn ghost" href="#/app/${f.id}">Lihat detail</a></div></div></section>`;
  h += `<h2 class="sec">${q?'Hasil pencarian':'Semua aplikasi'}</h2>`;
  h += list.length ? `<div class="grid">${list.map(card).join('')}</div>` : `<p class="empty">Tidak ada aplikasi yang cocok dengan "${esc(q)}".</p>`;
  view.innerHTML = h;
}

function detail(a){
  document.title = a.name + ' | ZTech Store';
  const meta = [['Versi',a.version],['Ukuran',a.size],['Kategori',a.category],['Diperbarui',a.updated]].filter(m=>m[1]);
  view.innerHTML = `
  <a class="back" href="#/">← Semua aplikasi</a>
  <section class="head"><img class="ic" src="${a.icon}" alt=""><div><h1>${esc(a.name)}</h1><div class="dev">${esc(STORE.developer)}</div><div class="row"><button class="btn" data-install="${a.id}">Unduh APK</button><a class="btn line" href="#guide">Cara memasang</a></div></div></section>
  <div class="meta">${meta.map(m=>`<div><b>${esc(m[1])}</b><span>${m[0]}</span></div>`).join('')}</div>
  <div class="shots">${a.screenshots.map(s=>`<img src="${s}" alt="Tangkapan layar ${esc(a.name)}" loading="lazy">`).join('')}</div>
  <div class="box"><h2 class="sec" style="margin:0 0 8px">Tentang aplikasi</h2>${a.description.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
  <div class="box"><h2 class="sec" style="margin:0 0 12px">Fitur</h2><div class="feat">${a.features.map(f=>`<div><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join('')}</div></div>
  <div class="box"><h2 class="sec" style="margin:0 0 8px">Yang baru di ${esc(a.version)}</h2><ul class="l">${a.whatsNew.map(w=>`<li>${esc(w)}</li>`).join('')}</ul></div>
  <div class="box"><h2 class="sec" style="margin:0 0 8px">Keamanan dan privasi</h2>
    <p>Data yang dipakai aplikasi:</p><ul class="l">${a.data.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>
    <p><a href="privacy.html">Baca Kebijakan Privasi lengkap</a></p>
    <p>Sidik jari (SHA-256) kunci penandatangan APK. Cocokkan dengan APK yang kamu unduh:</p><div class="mono">${esc(a.signingSha256)}</div>
    ${a.apkSha256?`<p>SHA-256 file APK:</p><div class="mono">${esc(a.apkSha256)}</div>`:''}
    <p style="font-size:13px">Nama paket: ${esc(a.packageName)}</p></div>
  <div class="box" id="guide"><h2 class="sec" style="margin:0 0 12px">Cara memasang</h2><div class="guides">${a.guides.map(g=>`<a href="${g}" target="_blank"><img src="${g}" alt="Panduan pemasangan" loading="lazy"></a>`).join('')}</div>
    <div class="note"><span>⚠️</span><span>Notifikasi <b>Pindai aplikasi</b> dari Google Play Protect itu wajar untuk aplikasi di luar Play Store. Ketuk Pindai, lalu lanjutkan. Jangan mematikan Play Protect.</span></div></div>`;
}

function route(){
  const h = location.hash;
  if(h.startsWith('#/app/')){const a=get(h.slice(6)); if(a){detail(a); window.scrollTo(0,0); return;}}
  if(h === '#guide'){return}
  document.title='ZTech Store'; home($('#q').value.trim());
}
window.addEventListener('hashchange',route);
$('#q').addEventListener('input',()=>{ if(location.hash.startsWith('#/app/')) location.hash='#/'; else home($('#q').value.trim()); });

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-install]'); if(!b) return;
  const a=get(b.dataset.install);
  sheet.innerHTML=`<div class="sh"><h3>Sebelum memasang ${esc(a.name)}</h3><ol>
    <li><b>Izinkan sumber ini</b> bila Android memintanya.</li>
    <li>Ketuk <b>Pasang</b> pada file yang diunduh.</li>
    <li>Kalau muncul <b>Pindai aplikasi</b> dari Play Protect, ketuk <b>Pindai</b>, lalu lanjutkan.</li></ol>
    <p style="font-size:13px;color:var(--muted);margin-top:10px">Aplikasi dibuat oleh ${esc(STORE.developer)} dan belum ada di Play Store.</p>
    <div class="row"><a class="btn" id="go" href="${apkUrl(a)}" download>Unduh sekarang</a><button class="btn line" id="x">Batal</button></div></div>`;
  sheet.showModal();
  $('#x').onclick=()=>sheet.close();
  $('#go').onclick=()=>{setTimeout(()=>{sheet.close();toast('Unduhan dimulai. Lihat "Cara memasang" jika perlu.')},400)};
});
sheet.addEventListener('click',e=>{if(e.target===sheet)sheet.close()});
route();

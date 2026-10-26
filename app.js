const $ = function(selector) { return document.querySelector(selector); };
const view = $("#view");
const sheet = $("#sheet");
const searchInput = $("#q");
const navLinks = $("#nav-links");
const menuToggle = $("#menu-toggle");
let activeFilter = "all";

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(char) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
  });
}

function getProduct(id) {
  return PRODUCTS.find(function(product) { return product.id === id; });
}

function productTypeLabel(type) {
  return ({app:"Aplikasi Android", web:"Website", tool:"Web tool"})[type] || "Karya digital";
}

function productActionLabel(product) {
  return product.type === "app" ? "Unduh APK" : "Buka karya";
}

function apkUrl(product) {
  return "https://github.com/" + STORE.repo + "/releases/latest/download/" + encodeURIComponent(product.apkFile);
}

function externalLink(url, label, className) {
  if (!url) return "";
  return '<a class="' + (className || "button button-primary") + '" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + label + ' <span aria-hidden="true">↗</span></a>';
}

function productIcon(product, large) {
  const sizeClass = large ? "product-icon product-icon-large" : "product-icon";
  if (product.icon) {
    return '<span class="' + sizeClass + '"><img src="' + escapeHtml(product.icon) + '" alt="" loading="lazy"></span>';
  }
  return '<span class="' + sizeClass + ' product-icon-fallback" aria-hidden="true">' + escapeHtml(product.name.slice(0, 1).toUpperCase()) + '</span>';
}

function productCard(product) {
  return '<a class="product-card" href="#/item/' + encodeURIComponent(product.id) + '">' +
    '<div class="card-top">' + productIcon(product, false) + '<span class="type-pill">' + escapeHtml(productTypeLabel(product.type)) + '</span></div>' +
    '<h3>' + escapeHtml(product.name) + '</h3>' +
    '<p>' + escapeHtml(product.short) + '</p>' +
    '<div class="card-foot"><span>' + escapeHtml(product.category || "Digital") + '</span><span class="card-arrow" aria-hidden="true">↗</span></div>' +
    '</a>';
}

function featuredCard(product) {
  return '<article class="featured-card">' +
    '<div class="featured-copy"><span class="eyebrow">Pilihan katalog</span>' +
    '<h3>' + escapeHtml(product.name) + '</h3><p>' + escapeHtml(product.short) + '</p>' +
    '<a class="button button-light" href="#/item/' + encodeURIComponent(product.id) + '">Lihat karya <span aria-hidden="true">→</span></a></div>' +
    '<div class="featured-product">' + productIcon(product, true) + '<span>' + escapeHtml(productTypeLabel(product.type)) + '</span><b>' + escapeHtml(product.category || "Digital") + '</b></div>' +
    '</article>';
}

function renderHome(query, filter) {
  const q = (query || "").trim().toLowerCase();
  const kind = filter || "all";
  const matches = PRODUCTS.filter(function(product) {
    const searchable = [product.name, product.short, product.category, product.tagline, productTypeLabel(product.type)].join(" ").toLowerCase();
    return searchable.includes(q) && (kind === "all" || product.type === kind);
  });

  const filters = [
    ["all", "Semua karya"],
    ["app", "Aplikasi Android"],
    ["web", "Website"],
    ["tool", "Web tools"]
  ];
  const filterMarkup = filters.map(function(entry) {
    return '<button type="button" class="filter-chip" data-filter="' + entry[0] + '" aria-pressed="' + (kind === entry[0] ? "true" : "false") + '">' + entry[1] + '</button>';
  }).join("");

  const showFeatured = !q && kind === "all" && matches.length > 1;
  const featuredProduct = showFeatured ? (matches.find(function(product) { return product.featured; }) || matches[0]) : null;
  const gridProducts = featuredProduct ? matches.filter(function(product) { return product.id !== featuredProduct.id; }) : matches;

  let gridMarkup = "";
  if (gridProducts.length) {
    gridMarkup = '<div class="product-grid">' + gridProducts.map(productCard).join("") + '</div>';
  } else if (!featuredProduct && matches.length === 0) {
    gridMarkup = '<div class="empty-state"><span class="empty-mark">⌕</span><h3>Belum ada hasil</h3><p>Coba kata kunci atau jenis karya yang berbeda.</p><button class="button button-outline" type="button" id="clear-search">Hapus pencarian</button></div>';
  } else if (featuredProduct && gridProducts.length === 0) {
    gridMarkup = '<p class="catalog-hint">Karya unggulan saat ini adalah satu-satunya item di katalog. Karya lainnya akan tampil di sini saat ditambahkan.</p>';
  }

  view.innerHTML =
    '<section class="intro" aria-labelledby="intro-title">' +
      '<div class="intro-copy"><span class="eyebrow"><span class="status-dot"></span> ETALASE DIGITAL ZTECH</span>' +
      '<h1 id="intro-title">Temukan karya digital.<br><span>Jelajahi dengan mudah.</span></h1>' +
      '<p>Aplikasi Android, website, dan tools buatan ZTech — dikumpulkan dalam satu tempat yang sederhana.</p>' +
      '<div class="intro-actions"><a class="button button-primary" href="#/catalog">Jelajahi katalog <span aria-hidden="true">↓</span></a>' +
      '<a class="button button-quiet" href="' + escapeHtml(STORE.instagram) + '" target="_blank" rel="noopener noreferrer">Ikuti perjalanan <span aria-hidden="true">↗</span></a></div>' +
      '<div class="intro-note"><span class="note-symbol">✳</span><span>Karya baru akan ditambahkan seiring proses pengembangan.</span></div></div>' +
      '<div class="intro-art" aria-hidden="true"><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="art-core"><span>Z</span></div>' +
        '<div class="art-tile tile-app"><span class="tile-symbol">▦</span><b>Apps</b><small>Android</small></div>' +
        '<div class="art-tile tile-web"><span class="tile-symbol">⌘</span><b>Web</b><small>Projects</small></div>' +
        '<div class="art-tile tile-tools"><span class="tile-symbol">✳</span><b>Tools</b><small>Utility</small></div></div>' +
      '<div class="intro-index"><span>01 / EXPLORE</span><span>INDEPENDENT DIGITAL PROJECTS</span></div>' +
    '</section>' +

    '<section class="catalog section-block" id="catalog" aria-labelledby="catalog-title">' +
      '<div class="section-heading"><div><span class="eyebrow">DIREKTORI KARYA</span><h2 id="catalog-title">Jelajahi katalog<span class="heading-period">.</span></h2>' +
      '<p>Temukan karya sesuai yang sedang kamu cari.</p></div><span class="result-count">' + matches.length + ' karya</span></div>' +
      (showFeatured ? featuredCard(featuredProduct) : "") +
      '<div class="catalog-tools"><div class="filter-list" role="group" aria-label="Filter berdasarkan jenis karya">' + filterMarkup + '</div>' +
      '<span class="catalog-type-note">APPS <i>·</i> WEB <i>·</i> TOOLS</span></div>' +
      '<div id="catalog-results">' + gridMarkup + '</div>' +
    '</section>' +

    '<section class="about-block section-block" id="about" aria-labelledby="about-title">' +
      '<div class="about-symbol" aria-hidden="true"><span>Z</span><i></i></div>' +
      '<div class="about-copy"><span class="eyebrow">TENTANG ZTECH</span><h2 id="about-title">Satu etalase.<br><span>Banyak kemungkinan.</span></h2>' +
      '<p>ZTech Store menjadi rumah untuk proyek digital yang dibuat dan dikembangkan secara bertahap. Bukan satu aplikasi saja — setiap karya punya ruang, detail, dan tautan aksesnya sendiri.</p>' +
      '<a class="text-link" href="' + escapeHtml(STORE.instagram) + '" target="_blank" rel="noopener noreferrer">Lihat kabar terbaru di @iniii_nizar <span aria-hidden="true">↗</span></a></div>' +
      '<div class="about-points"><div><span>01</span><b>Aplikasi</b><small>Unduh dan cek detail</small></div><div><span>02</span><b>Website</b><small>Kunjungi karya web</small></div><div><span>03</span><b>Tools</b><small>Utilitas dan eksperimen</small></div></div>' +
    '</section>';
}

function renderParagraphs(paragraphs) {
  return (paragraphs || []).map(function(paragraph) { return '<p>' + escapeHtml(paragraph) + '</p>'; }).join("");
}

function renderBullets(items) {
  if (!items || !items.length) return "";
  return '<ul class="detail-list">' + items.map(function(item) { return '<li>' + escapeHtml(item) + '</li>'; }).join("") + '</ul>';
}

function renderPrivacySections(product) {
  if (!product.privacySections || !product.privacySections.length) return "";
  return '<section class="detail-panel privacy-panel"><span class="eyebrow">INFORMASI PRODUK</span><h2>Privasi aplikasi</h2>' +
    '<p class="panel-lead">Bagian ini khusus untuk ' + escapeHtml(product.name) + ', bukan kebijakan privasi situs ZTech Store.</p>' +
    '<details class="policy-accordion"><summary>Baca kebijakan privasi aplikasi</summary><div class="policy-content">' +
    product.privacySections.map(function(section) {
      return '<section><h3>' + escapeHtml(section.heading) + '</h3>' + renderParagraphs(section.paragraphs) + renderBullets(section.bullets) + '</section>';
    }).join("") + '</div></details></section>';
}

function renderDetail(product) {
  document.title = product.name + " — ZTech Store";
  const metadata = [];
  if (product.version) metadata.push(["Versi", product.version]);
  if (product.size) metadata.push(["Ukuran", product.size]);
  if (product.category) metadata.push(["Kategori", product.category]);
  if (product.updated) metadata.push(["Diperbarui", product.updated]);
  if (product.packageName) metadata.push(["Package ID", product.packageName]);

  const actions = product.type === "app"
    ? '<button class="button button-primary" type="button" data-install="' + escapeHtml(product.id) + '">Unduh APK <span aria-hidden="true">↓</span></button><a class="button button-outline" href="#guide">Cara memasang</a>'
    : externalLink(product.url, "Buka karya", "button button-primary");

  const screenshots = product.screenshots && product.screenshots.length
    ? '<section class="detail-panel screenshot-panel"><div class="panel-heading"><div><span class="eyebrow">TAMPILAN PRODUK</span><h2>Lihat lebih dekat</h2></div><span class="scroll-hint">Geser untuk melihat <span aria-hidden="true">→</span></span></div><div class="screenshots">' +
      product.screenshots.map(function(src, index) { return '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer" aria-label="Buka tangkapan layar ' + (index + 1) + '"><img src="' + escapeHtml(src) + '" alt="Tangkapan layar ' + escapeHtml(product.name) + ' nomor ' + (index + 1) + '" loading="lazy"></a>'; }).join("") +
      '</div></section>' : "";

  const features = product.features && product.features.length
    ? '<section class="detail-panel"><span class="eyebrow">FITUR UTAMA</span><h2>Apa yang bisa dilakukan?</h2><div class="feature-grid">' +
      product.features.map(function(feature, index) { return '<article class="feature-item"><span class="feature-index">' + String(index + 1).padStart(2, "0") + '</span><div><h3>' + escapeHtml(feature[0]) + '</h3><p>' + escapeHtml(feature[1]) + '</p></div></article>'; }).join("") +
      '</div></section>' : "";

  const whatsNew = product.whatsNew && product.whatsNew.length
    ? '<section class="detail-panel"><span class="eyebrow">PEMBARUAN</span><h2>Yang baru</h2>' + renderBullets(product.whatsNew) + '</section>' : "";

  const signature = product.type === "app" && product.signingSha256
    ? '<section class="detail-panel"><span class="eyebrow">INFORMASI UNDUHAN</span><h2>Verifikasi file</h2><p class="panel-lead">Sidik jari sertifikat penandatangan aplikasi. Cocokkan dengan sertifikat APK yang kamu periksa.</p><div class="hash-label">SHA-256 sertifikat</div><code class="hash-value">' + escapeHtml(product.signingSha256) + '</code>' +
      (product.apkSha256 ? '<div class="hash-label">SHA-256 file APK</div><code class="hash-value">' + escapeHtml(product.apkSha256) + '</code>' : "") +
      '<p class="fine-print">Unduh hanya dari tautan resmi yang ditampilkan pada halaman ini.</p></section>' : "";

  const guide = product.type === "app" && product.guides && product.guides.length
    ? '<section class="detail-panel guide-panel" id="guide"><span class="eyebrow">PANDUAN ANDROID</span><h2>Cara memasang APK</h2><p class="panel-lead">Ikuti petunjuk di perangkatmu. Menu dan nama tombol bisa sedikit berbeda tergantung versi Android.</p><div class="guides">' +
      product.guides.map(function(src, index) { return '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer"><img src="' + escapeHtml(src) + '" alt="Panduan pemasangan ' + escapeHtml(product.name) + ' tahap ' + (index + 1) + '" loading="lazy"><span>Lihat gambar ' + (index + 1) + ' ↗</span></a>'; }).join("") +
      '</div><div class="safety-note"><span class="safety-icon" aria-hidden="true">!</span><div><b>Tetap perhatikan keamanan perangkat</b><p>Jika Google Play Protect menampilkan peringatan, baca hasil pemindaiannya dengan teliti. Jangan mematikan perlindungan demi memasang aplikasi yang tidak kamu yakini sumbernya.</p></div></div></section>' : "";

  view.innerHTML =
    '<div class="detail-page">' +
      '<a class="back-link" href="#/catalog"><span aria-hidden="true">←</span> Kembali ke katalog</a>' +
      '<section class="detail-hero"><div class="detail-brand-row">' + productIcon(product, true) + '<div class="detail-title"><span class="type-pill">' + escapeHtml(productTypeLabel(product.type)) + '</span><h1>' + escapeHtml(product.name) + '</h1><p class="detail-tagline">' + escapeHtml(product.tagline || product.short) + '</p><span class="developer-name">Dibuat oleh ' + escapeHtml(STORE.developer) + '</span></div></div>' +
        '<div class="detail-actions">' + actions + '</div></section>' +
      (metadata.length ? '<div class="meta-grid">' + metadata.map(function(item) { return '<div><span>' + escapeHtml(item[0]) + '</span><b>' + escapeHtml(item[1]) + '</b></div>'; }).join("") + '</div>' : "") +
      screenshots +
      '<section class="detail-panel"><span class="eyebrow">TENTANG KARYA</span><h2>Gambaran singkat</h2>' + renderParagraphs(product.description) + '</section>' +
      features + whatsNew + signature + renderPrivacySections(product) + guide +
      '<div class="detail-end"><a href="#/catalog">← Jelajahi karya lainnya</a><span>ZTech Store · Katalog digital</span></div>' +
    '</div>';
  window.scrollTo({top:0, behavior:"smooth"});
}

function showInstallDialog(product) {
  if (!product || product.type !== "app" || !product.apkFile) return;
  const download = apkUrl(product);
  sheet.innerHTML = '<div class="sheet-inner"><button class="sheet-close" id="close-sheet" type="button" aria-label="Tutup">×</button>' +
    '<span class="eyebrow">UNDUH APLIKASI</span><h2 id="sheet-title">Sebelum memasang</h2><p class="sheet-intro">Kamu akan mengunduh ' + escapeHtml(product.name) + ' dari rilis resmi GitHub.</p>' +
    '<ol class="install-steps"><li><span>1</span><div><b>Unduh file APK</b><small>Tunggu hingga unduhan selesai.</small></div></li>' +
    '<li><span>2</span><div><b>Buka file yang diunduh</b><small>Android mungkin meminta izin instalasi untuk browser atau pengelola file.</small></div></li>' +
    '<li><span>3</span><div><b>Periksa sebelum memasang</b><small>Baca setiap peringatan keamanan dan lanjutkan hanya jika kamu yakin sumbernya tepercaya.</small></div></li></ol>' +
    '<div class="sheet-actions"><a class="button button-primary button-full" id="go" href="' + escapeHtml(download) + '">Unduh ' + escapeHtml(product.name) + ' <span aria-hidden="true">↓</span></a><button class="button button-outline button-full" id="cancel-sheet" type="button">Kembali ke halaman</button></div>' +
    '<p class="sheet-footnote">APK ini didistribusikan di luar Google Play Store.</p></div>';
  sheet.showModal();
  $("#close-sheet").addEventListener("click", function() { sheet.close(); });
  $("#cancel-sheet").addEventListener("click", function() { sheet.close(); });
  $("#go").addEventListener("click", function() {
    window.setTimeout(function() { sheet.close(); showToast("Unduhan dimulai. Periksa daftar unduhan perangkatmu."); }, 500);
  });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("on");
  window.setTimeout(function() { toast.classList.remove("on"); }, 3000);
}

function closeMobileMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function route() {
  const hash = window.location.hash;
  if (hash.startsWith("#/item/")) {
    const id = decodeURIComponent(hash.slice(7));
    const product = getProduct(id);
    if (product) {
      renderDetail(product);
      closeMobileMenu();
      return;
    }
  }
  if (hash === "#guide" && document.getElementById("guide")) return;
  renderHome(searchInput.value, activeFilter);
  document.title = "ZTech Store — Karya Digital";
  closeMobileMenu();
  if (hash === "#/catalog" || hash === "#/about") {
    const targetId = hash === "#/about" ? "about" : "catalog";
    window.requestAnimationFrame(function() {
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
    });
  } else {
    window.scrollTo({top:0, behavior:"smooth"});
  }
}

window.addEventListener("hashchange", route);

document.addEventListener("click", function(event) {
  const routeLink = event.target.closest('a[href="#/catalog"], a[href="#/about"]');
  if (routeLink && window.location.hash === routeLink.getAttribute("href")) {
    event.preventDefault();
    const target = document.getElementById(routeLink.getAttribute("href") === "#/about" ? "about" : "catalog");
    if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
    closeMobileMenu();
  }
});

searchInput.addEventListener("input", function() {
  if (window.location.hash.startsWith("#/item/")) window.location.hash = "#/catalog";
  renderHome(searchInput.value, activeFilter);
});

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    searchInput.value = "";
    renderHome("", activeFilter);
  }
  if (event.key === "Enter") {
    window.location.hash = "#/catalog";
    renderHome(searchInput.value, activeFilter);
    const catalog = document.getElementById("catalog");
    if (catalog) catalog.scrollIntoView({behavior:"smooth"});
  }
});

menuToggle.addEventListener("click", function() {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", function(event) {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    activeFilter = filterButton.dataset.filter;
    renderHome(searchInput.value, activeFilter);
    return;
  }
  const installButton = event.target.closest("[data-install]");
  if (installButton) {
    showInstallDialog(getProduct(installButton.dataset.install));
    return;
  }
  if (event.target.closest("#clear-search")) {
    searchInput.value = "";
    activeFilter = "all";
    renderHome("", activeFilter);
  }
  if (event.target.closest("#catalog .product-card") && navLinks.classList.contains("open")) {
    closeMobileMenu();
  }
});

sheet.addEventListener("click", function(event) {
  if (event.target === sheet) sheet.close();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

$("#mail").href = "mailto:" + STORE.email;
route();
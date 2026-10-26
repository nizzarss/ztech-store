const $ = (selector) => document.querySelector(selector);
const view = $("#view");
const sheet = $("#sheet");

let activeFilter = "all";
let activeCategory = "";
let searchQuery = "";
let searchOpen = false;

const TYPE_ITEMS = [
  { key: "app", label: "Aplikasi Android", shortLabel: "Android", icon: "phone" },
  { key: "web", label: "Website", shortLabel: "Website", icon: "globe" },
  { key: "tool", label: "Web tools", shortLabel: "Web tools", icon: "tool" }
];

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function formatCount(value) {
  return String(value).padStart(2, "0");
}

function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function getCurrentProduct() {
  const match = window.location.hash.match(/^#\/item\/(.+)$/);
  if (!match) return null;
  try {
    return getProduct(decodeURIComponent(match[1]));
  } catch (error) {
    return null;
  }
}

function productTypeLabel(type) {
  return ({ app: "Aplikasi Android", web: "Website", tool: "Web tool" })[type] || "Karya digital";
}

function typeCount(type) {
  return PRODUCTS.filter((product) => product.type === type).length;
}

function categoryCount(category) {
  return PRODUCTS.filter((product) => product.category === category).length;
}

function storeDate() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(now).replace(/-/g, ".");
  const weekday = new Intl.DateTimeFormat("id-ID", { weekday: "short" })
    .format(now).replace(".", "").toUpperCase();
  return { date: parts, weekday };
}

function iconSvg(name) {
  const icons = {
    back: '<path d="m15 18-6-6 6-6"></path>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 4 4"></path>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"></path>',
    external: '<path d="M13 5h6v6M19 5l-9 9"></path><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"></path>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2.2"></rect><path d="M10 6h4M11 18h2"></path>',
    globe: '<circle cx="12" cy="12" r="8.5"></circle><path d="M3.8 12h16.4M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17"></path>',
    tool: '<path d="M14 6a5 5 0 0 0-6.5 6.5L3 17l4 4 4.5-4.5A5 5 0 0 0 18 10l-3 3-4-4 3-3Z"></path>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2.5"></rect><path d="M3 8h18M16 14h2"></path>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1.3"></rect><rect x="14" y="4" width="6" height="6" rx="1.3"></rect><rect x="4" y="14" width="6" height="6" rx="1.3"></rect><rect x="14" y="14" width="6" height="6" rx="1.3"></rect>',
    share: '<circle cx="18" cy="5" r="2.5"></circle><circle cx="6" cy="12" r="2.5"></circle><circle cx="18" cy="19" r="2.5"></circle><path d="m8.3 10.8 7.4-4.5M8.3 13.2l7.4 4.5"></path>',
    download: '<path d="M12 3v11m-4-4 4 4 4-4"></path><path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"></path>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"></path><path d="m3 12 9 5 9-5M3 16l9 5 9-5"></path>'
  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[name] || icons.grid) + '</svg>';
}

function productIcon(product, large, circle) {
  const classes = [
    "app-icon",
    large ? "app-icon-large" : "",
    circle ? "app-icon-circle" : ""
  ].filter(Boolean).join(" ");
  if (product.icon) {
    return '<span class="' + classes + '"><img src="' + escapeHtml(product.icon) + '" alt="" loading="lazy"></span>';
  }
  return '<span class="' + classes + ' app-icon-fallback" aria-hidden="true">' +
    escapeHtml((product.name || "Z").slice(0, 1).toUpperCase()) + '</span>';
}

function productPageUrl(product) {
  return window.location.origin + window.location.pathname + window.location.search +
    "#/item/" + encodeURIComponent(product.id);
}

function apkUrl(product) {
  return "https://github.com/" + STORE.repo + "/releases/latest/download/" +
    encodeURIComponent(product.apkFile);
}

function matchesSearch(product, query) {
  const content = [
    product.name, product.short, product.category, product.tagline,
    productTypeLabel(product.type), product.description
  ].flat().join(" ").toLowerCase();
  return content.includes((query || "").trim().toLowerCase());
}

function filteredProducts() {
  return PRODUCTS.filter((product) => {
    const typeMatches = activeFilter === "all" || product.type === activeFilter;
    const categoryMatches = !activeCategory || product.category === activeCategory;
    return typeMatches && categoryMatches && matchesSearch(product, searchQuery);
  });
}

function filterMarkup() {
  const filters = [
    ["all", "Semua"],
    ["app", "Android"],
    ["web", "Website"],
    ["tool", "Web tools"]
  ];
  return filters.map(([key, label]) =>
    '<button class="filter-chip' + (activeFilter === key && !activeCategory ? " selected" : "") +
    '" type="button" data-filter="' + key + '" aria-pressed="' +
    (activeFilter === key && !activeCategory ? "true" : "false") + '">' + label + '</button>'
  ).join("");
}

function renderPopularItems() {
  const products = filteredProducts();
  if (!products.length) {
    return '<div class="empty-state"><h3>Belum ada hasil</h3><p>Coba kata kunci atau kategori lain.</p><button class="button button-outline" type="button" data-reset-filter>Reset pencarian</button></div>';
  }
  if (searchQuery.trim()) {
    return '<div class="search-result-list">' + products.map(productRow).join("") + '</div>';
  }
  return '<div class="popular-grid">' + products.map((product) =>
    '<a class="popular-item" href="#/item/' + encodeURIComponent(product.id) + '">' +
      '<span class="popular-icon">' + productIcon(product, false, false) + '</span>' +
      '<span class="popular-name">' + escapeHtml(product.name) + '</span>' +
      '<span class="popular-type">' + escapeHtml(productTypeLabel(product.type)) + '</span>' +
    '</a>'
  ).join("") + '</div>';
}

function productRow(product) {
  return '<a class="product-row" href="#/item/' + encodeURIComponent(product.id) + '">' +
    productIcon(product, false, false) +
    '<span class="product-row-copy"><strong>' + escapeHtml(product.name) + '</strong>' +
    '<span>' + escapeHtml(product.category || productTypeLabel(product.type)) +
    ' · ' + escapeHtml(productTypeLabel(product.type)) + '</span></span>' +
    '<span class="row-action">Detail ' + iconSvg("arrow") + '</span></a>';
}

function renderHome() {
  document.body.classList.remove("detail-mode", "catalog-mode");
  document.title = "ZTech Store";
  const feature = PRODUCTS.find((product) => product.featured) || PRODUCTS[0];
  const today = storeDate();
  const inventoryRows = TYPE_ITEMS.map((type) =>
    '<button class="inventory-row" type="button" data-filter="' + type.key + '">' +
      '<span>' + escapeHtml(type.shortLabel) + '</span><strong>' +
      formatCount(typeCount(type.key)) + '</strong></button>'
  ).join("");
  const sideStats = [
    { label: "Website", type: "web" },
    { label: "Web tools", type: "tool" }
  ].map((item) =>
    '<button class="vertical-stat" type="button" data-filter="' + item.type + '">' +
      '<strong>' + formatCount(typeCount(item.type)) + '</strong><span>' +
      escapeHtml(item.label) + '</span></button>'
  ).join("");

  view.innerHTML =
    '<section class="home-top raised-panel">' +
      '<div class="title-row"><div class="store-title-block">' +
        '<p class="brand-overline">KATALOG DIGITAL</p><h1>ZTECH STORE</h1>' +
        '<div class="date-stamp"><span>' + today.date + '</span><span>' + today.weekday + '</span></div>' +
      '</div><div class="work-count"><strong>' + formatCount(PRODUCTS.length) +
        '</strong><span>KARYA</span></div></div>' +
      '<nav class="filter-rail" aria-label="Filter katalog">' + filterMarkup() + '</nav>' +
    '</section>' +
    (feature ? '<section class="featured-layout" aria-label="Karya pilihan">' +
      '<a class="feature-orbit" href="#/item/' + encodeURIComponent(feature.id) + '" aria-label="Lihat ' +
        escapeHtml(feature.name) + '">' + productIcon(feature, true, true) + '</a>' +
      '<article class="featured-card raised-panel"><span class="section-kicker">DALAM KATALOG</span>' +
        '<h2>' + escapeHtml(feature.name) + '</h2><p>' + escapeHtml(feature.tagline || feature.short) + '</p>' +
        '<a class="button button-primary" href="#/item/' + encodeURIComponent(feature.id) + '">LIHAT DETAIL ' +
          iconSvg("arrow") + '</a></article></section>' : "") +
    '<section class="inventory-layout" aria-label="Ringkasan katalog">' +
      '<div class="inventory-panel raised-panel"><div class="inventory-heading"><span class="section-kicker">KOLEKSI</span>' +
        '<h2>Yang tersedia</h2></div><div class="inventory-rows">' + inventoryRows + '</div></div>' +
      '<div class="vertical-stats">' + sideStats + '</div></section>' +
    '<section class="popular-section"><div class="section-title-row"><div><h2>Semua karya</h2>' +
      '<p>Aplikasi dan karya digital ZTech.</p></div><a href="#/catalog" class="text-link">Lihat semua ' +
      iconSvg("arrow") + '</a></div>' +
      '<div class="filter-rail home-filter-rail" aria-label="Filter karya">' + filterMarkup() + '</div>' +
      '<div id="home-results">' + renderPopularItems() + '</div></section>';
  updateBottomNav();
  if (searchOpen) {
    const queryInput = document.querySelector("#home-search");
    if (queryInput) queryInput.focus();
  }
}

function getCategoryEntries() {
  const entries = TYPE_ITEMS.map((type) => ({
    kind: "type",
    key: type.key,
    label: type.label,
    count: typeCount(type.key),
    icon: type.icon
  }));
  const productCategories = [...new Set(PRODUCTS.map((product) => product.category).filter(Boolean))];
  productCategories.forEach((category) => {
    entries.push({
      kind: "category",
      key: category,
      label: category,
      count: categoryCount(category),
      icon: category.toLowerCase().includes("keuangan") ? "wallet" : "layers"
    });
  });
  return entries;
}

function categoryTile(entry, index) {
  const isActive = entry.kind === "type"
    ? activeFilter === entry.key && !activeCategory
    : activeCategory === entry.key;
  const activeClass = (isActive || (index === 0 && entry.count > 0 && activeFilter === "all" && !activeCategory))
    ? " featured-category" : "";
  const dataAttribute = entry.kind === "type"
    ? 'data-type="' + escapeHtml(entry.key) + '"'
    : 'data-category="' + escapeHtml(entry.key) + '"';
  return '<button type="button" class="category-card' + activeClass + '" ' + dataAttribute + '>' +
    '<span class="category-symbol">' + iconSvg(entry.icon) + '</span>' +
    '<strong>' + escapeHtml(entry.label) + '</strong>' +
    '<span class="category-count">' + formatCount(entry.count) + ' karya</span></button>';
}

function renderCatalogList() {
  const products = filteredProducts();
  if (!products.length) {
    return '<div class="empty-state"><h3>Belum ada karya di kategori ini</h3><p>Periksa kategori lain atau hapus pencarian.</p>' +
      '<button class="button button-outline" type="button" data-reset-filter>Semua karya</button></div>';
  }
  return '<div class="catalog-list">' + products.map(productRow).join("") + '</div>';
}

function renderCatalog() {
  document.body.classList.remove("detail-mode");
  document.body.classList.add("catalog-mode");
  document.title = "Kategori — ZTech Store";
  const categories = getCategoryEntries();
  view.innerHTML =
    '<section class="catalog-page">' +
      '<div class="catalog-title-row"><h1>Kategori</h1>' +
        '<button type="button" class="round-icon-button" data-search-toggle aria-label="Buka pencarian">' +
          iconSvg("search") + '</button></div>' +
      (searchOpen ? '<label class="catalog-search"><span class="visually-hidden">Cari karya</span>' +
        iconSvg("search") + '<input id="catalog-search" type="search" placeholder="Cari aplikasi atau website" value="' +
        escapeHtml(searchQuery) + '" autocomplete="off"></label>' : "") +
      '<div class="category-grid">' + categories.map(categoryTile).join("") + '</div>' +
      '<section class="catalog-products"><div class="section-title-row">' +
        '<div><h2>Semua karya</h2><p>' + filteredProducts().length + ' hasil dalam katalog.</p></div>' +
        ((activeFilter !== "all" || activeCategory || searchQuery) ?
          '<button class="text-link reset-link" type="button" data-reset-filter>Reset ' + iconSvg("arrow") + '</button>' : "") +
      '</div><div id="catalog-results">' + renderCatalogList() + '</div></section>' +
    '</section>';
  updateBottomNav();
  if (searchOpen) {
    const input = $("#catalog-search");
    if (input) input.focus();
  }
}

function renderParagraphs(paragraphs) {
  if (!paragraphs) return "";
  const list = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
  return list.map((paragraph) => '<p>' + escapeHtml(paragraph) + '</p>').join("");
}

function renderBullets(items) {
  if (!items || !items.length) return "";
  return '<ul class="detail-list">' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>';
}

function renderDetailAccordions(product) {
  const features = product.features && product.features.length
    ? '<details class="content-accordion"><summary>Fitur utama</summary><div class="accordion-body">' +
      '<div class="feature-list">' + product.features.map((feature) =>
        '<div class="feature-item"><strong>' + escapeHtml(feature[0]) + '</strong><p>' +
        escapeHtml(feature[1]) + '</p></div>'
      ).join("") + '</div></div></details>' : "";
  const updates = product.whatsNew && product.whatsNew.length
    ? '<details class="content-accordion"><summary>Pembaruan terbaru</summary><div class="accordion-body">' +
      renderBullets(product.whatsNew) + '</div></details>' : "";
  const guides = product.type === "app" && product.guides && product.guides.length
    ? '<details class="content-accordion" id="guide"><summary>Panduan pemasangan APK</summary><div class="accordion-body">' +
      '<p class="accordion-note">Unduh berkas APK, buka berkas tersebut, lalu ikuti petunjuk Android. Jika muncul peringatan keamanan, baca lebih dahulu dan jangan matikan perlindungan perangkat.</p>' +
      '<div class="guide-grid">' + product.guides.map((src, index) =>
        '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + escapeHtml(src) + '" alt="Panduan pemasangan ' + (index + 1) + '" loading="lazy">' +
        '<span>Lihat panduan ' + (index + 1) + ' ' + iconSvg("external") + '</span></a>'
      ).join("") + '</div></div></details>' : "";
  const signature = product.type === "app" && product.signingSha256
    ? '<details class="content-accordion"><summary>Informasi keamanan APK</summary><div class="accordion-body">' +
      '<p class="accordion-note">Sidik jari sertifikat untuk pemeriksaan tambahan.</p><span class="field-label">SHA-256 sertifikat</span>' +
      '<code class="hash-value">' + escapeHtml(product.signingSha256) + '</code>' +
      (product.apkSha256 ? '<span class="field-label">SHA-256 file APK</span><code class="hash-value">' +
        escapeHtml(product.apkSha256) + '</code>' : "") +
      (product.packageName ? '<p class="accordion-note">Nama paket: ' + escapeHtml(product.packageName) + '</p>' : "") +
      '</div></details>' : "";
  const privacy = product.privacySections && product.privacySections.length
    ? '<details class="content-accordion product-privacy-accordion"><summary>Privasi aplikasi</summary><div class="accordion-body">' +
      '<p class="accordion-note">Kebijakan ini khusus untuk ' + escapeHtml(product.name) +
      '. Privasi situs toko dijelaskan di <a href="privacy.html">kebijakan privasi situs</a>.</p>' +
      product.privacySections.map((section) =>
        '<section class="privacy-subsection"><h3>' + escapeHtml(section.heading) + '</h3>' +
        renderParagraphs(section.paragraphs) + renderBullets(section.bullets) + '</section>'
      ).join("") + '</div></details>' : "";
  return '<div class="detail-accordions">' + features + updates + guides + signature + privacy + '</div>';
}

function renderDetail(product) {
  document.body.classList.add("detail-mode");
  document.body.classList.remove("catalog-mode");
  document.title = product.name + " — ZTech Store";
  const metadata = [];
  if (product.version) metadata.push({ value: product.version, label: "VERSI" });
  if (product.category) metadata.push({ value: product.category, label: "KATEGORI" });
  if (product.updated) metadata.push({ value: product.updated, label: "DIPERBARUI" });
  if (product.size) metadata.push({ value: product.size, label: "UKURAN" });

  const mainAction = product.type === "app"
    ? '<button class="button button-primary" type="button" data-install="' + escapeHtml(product.id) + '">' +
      iconSvg("download") + ' Unduh APK</button>'
    : product.url
      ? '<a class="button button-primary" href="' + escapeHtml(product.url) +
        '" target="_blank" rel="noopener noreferrer">' + iconSvg("external") + ' Buka website</a>'
      : "";
  const screenshots = product.screenshots && product.screenshots.length
    ? '<section class="detail-section"><div class="section-title-row"><div><h2>Pratinjau</h2>' +
      '<p>Lihat tampilan ' + escapeHtml(product.name) + '.</p></div></div>' +
      '<div class="screenshots">' + product.screenshots.map((src, index) =>
        '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer" aria-label="Buka pratinjau ' +
        (index + 1) + '"><img src="' + escapeHtml(src) + '" alt="Tampilan ' + escapeHtml(product.name) +
        '" loading="lazy"></a>'
      ).join("") + '</div></section>' : "";

  view.innerHTML =
    '<section class="detail-page">' +
      '<a class="back-button" href="#/" aria-label="Kembali ke beranda">' + iconSvg("back") + '</a>' +
      '<article class="detail-hero raised-panel">' + productIcon(product, true, false) +
        '<div class="detail-summary"><span class="section-kicker">' + escapeHtml(productTypeLabel(product.type)) + '</span>' +
          '<h1>' + escapeHtml(product.name) + '</h1><p>' + escapeHtml(product.tagline || product.short) + '</p>' +
          '<span class="developer-line">Dibuat oleh ' + escapeHtml(STORE.developer) + '</span>' +
          '<div class="detail-actions">' + mainAction +
            '<button class="button button-outline" type="button" data-share="' + escapeHtml(product.id) + '">' +
              iconSvg("share") + ' Bagikan</button></div>' +
        '</div><p class="detail-availability">Katalog ZTech <span>·</span> ' +
          escapeHtml(productTypeLabel(product.type)) + '</p></article>' +
      (metadata.length ? '<section class="detail-metadata" aria-label="Informasi produk">' +
        metadata.map((item) => '<div><strong>' + escapeHtml(item.value) + '</strong><span>' +
          escapeHtml(item.label) + '</span></div>').join("") + '</section>' : "") +
      screenshots +
      '<section class="about-card raised-panel"><h2>Tentang</h2>' +
        renderParagraphs(product.description || product.short) + '</section>' +
      renderDetailAccordions(product) +
      '<a class="more-products-link" href="#/catalog">Jelajahi karya lainnya ' + iconSvg("arrow") + '</a>' +
    '</section>';
  updateBottomNav();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function shareUrl(data) {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(data.url);
      showToast("Tautan berhasil disalin.");
    } else {
      throw new Error("Clipboard unavailable");
    }
  } catch (error) {
    window.prompt("Salin tautan ini:", data.url);
  }
}

function shareProduct(product) {
  if (!product) return;
  return shareUrl({
    title: product.name + " — ZTech Store",
    text: "Lihat halaman " + product.name + " di ZTech Store.",
    url: productPageUrl(product)
  });
}

function shareStore() {
  return shareUrl({
    title: "ZTech Store",
    text: "Jelajahi aplikasi dan karya digital dari ZTech.",
    url: window.location.origin + window.location.pathname
  });
}

function showInstallDialog(product) {
  if (!product || product.type !== "app" || !product.apkFile) return;
  sheet.innerHTML =
    '<div class="sheet-inner"><button class="sheet-close" id="close-sheet" type="button" aria-label="Tutup">×</button>' +
      '<span class="section-kicker">UNDUH APLIKASI</span><h2 id="sheet-title">' + escapeHtml(product.name) + '</h2>' +
      '<p>APK akan diunduh dari GitHub Releases.</p>' +
      '<div class="install-note"><strong>Sebelum memasang</strong><p>Buka berkas APK setelah terunduh dan ikuti petunjuk Android. Jika muncul peringatan keamanan, baca dengan teliti.</p></div>' +
      '<div class="sheet-actions"><a class="button button-primary" id="go" href="' + escapeHtml(apkUrl(product)) + '">' +
        iconSvg("download") + ' Unduh APK</a><button class="button button-outline" id="share-from-sheet" type="button">' +
        iconSvg("share") + ' Bagikan halaman</button></div>' +
      '<button class="cancel-link" id="cancel-sheet" type="button">Batal</button></div>';
  sheet.showModal();
  $("#close-sheet").addEventListener("click", () => sheet.close());
  $("#cancel-sheet").addEventListener("click", () => sheet.close());
  $("#share-from-sheet").addEventListener("click", () => shareProduct(product));
  $("#go").addEventListener("click", () => {
    window.setTimeout(() => {
      sheet.close();
      showToast("Unduhan dimulai. Periksa folder unduhan.");
    }, 500);
  });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("on");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("on"), 2600);
}

function updateBottomNav() {
  const hash = window.location.hash;
  const isDetail = hash.startsWith("#/item/");
  const isCatalog = hash === "#/catalog";
  document.querySelectorAll("[data-nav]").forEach((button) => {
    const key = button.dataset.nav;
    const selected = (key === "home" && !isDetail && !isCatalog) ||
      (key === "catalog" && (isCatalog || isDetail));
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function route() {
  const hash = window.location.hash;
  const product = getCurrentProduct();
  if (product) {
    renderDetail(product);
    return;
  }
  if (hash === "#/catalog") {
    renderCatalog();
    return;
  }
  if (hash === "#guide" && document.body.classList.contains("detail-mode")) return;
  renderHome();
}

function focusCatalogSearch() {
  searchOpen = true;
  activeFilter = "all";
  activeCategory = "";
  if (window.location.hash !== "#/catalog") window.location.hash = "#/catalog";
  renderCatalog();
  requestAnimationFrame(() => {
    const input = $("#catalog-search");
    if (input) input.focus();
  });
}

window.addEventListener("hashchange", route);

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    activeFilter = filterButton.dataset.filter;
    activeCategory = "";
    if (window.location.hash === "#/catalog") renderCatalog();
    else renderHome();
    return;
  }

  const typeButton = event.target.closest("[data-type]");
  if (typeButton) {
    activeFilter = typeButton.dataset.type;
    activeCategory = "";
    renderCatalog();
    return;
  }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    activeFilter = "all";
    activeCategory = categoryButton.dataset.category;
    renderCatalog();
    return;
  }

  const resetButton = event.target.closest("[data-reset-filter]");
  if (resetButton) {
    activeFilter = "all";
    activeCategory = "";
    searchQuery = "";
    searchOpen = false;
    renderCatalog();
    return;
  }

  const installButton = event.target.closest("[data-install]");
  if (installButton) {
    showInstallDialog(getProduct(installButton.dataset.install));
    return;
  }

  const shareButton = event.target.closest("[data-share]");
  if (shareButton) {
    shareProduct(getProduct(shareButton.dataset.share));
    return;
  }

  const searchToggle = event.target.closest("[data-search-toggle]");
  if (searchToggle) {
    searchOpen = !searchOpen;
    renderCatalog();
    if (searchOpen) requestAnimationFrame(() => $("#catalog-search")?.focus());
    return;
  }

  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    const action = navButton.dataset.nav;
    if (action === "home") {
      searchQuery = "";
      searchOpen = false;
      if (window.location.hash === "#/" || !window.location.hash) renderHome();
      else window.location.hash = "#/";
    } else if (action === "catalog") {
      if (window.location.hash === "#/catalog") renderCatalog();
      else window.location.hash = "#/catalog";
    } else if (action === "share") {
      const product = getCurrentProduct();
      if (product) shareProduct(product);
      else shareStore();
    } else if (action === "search") {
      focusCatalogSearch();
    }
    return;
  }

  const clearSearch = event.target.closest("#clear-search");
  if (clearSearch) {
    searchQuery = "";
    renderHome();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "catalog-search") {
    searchQuery = event.target.value;
    const results = $("#catalog-results");
    if (results) results.innerHTML = renderCatalogList();
    const sectionMeta = document.querySelector(".catalog-products .section-title-row p");
    if (sectionMeta) sectionMeta.textContent = filteredProducts().length + " hasil dalam katalog.";
  }
});

sheet.addEventListener("click", (event) => {
  if (event.target === sheet) sheet.close();
});

route();
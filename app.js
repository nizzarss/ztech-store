const $ = function(selector) { return document.querySelector(selector); };
const view = $("#view");
const sheet = $("#sheet");
const searchInput = $("#q");

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

function productPageUrl(product) {
  return window.location.origin + window.location.pathname + window.location.search + "#/item/" + encodeURIComponent(product.id);
}

function apkUrl(product) {
  return "https://github.com/" + STORE.repo + "/releases/latest/download/" + encodeURIComponent(product.apkFile);
}

function productIcon(product, large) {
  const sizeClass = large ? "product-icon product-icon-large" : "product-icon";
  if (product.icon) {
    return '<span class="' + sizeClass + '"><img src="' + escapeHtml(product.icon) + '" alt=""></span>';
  }
  return '<span class="' + sizeClass + ' product-icon-fallback" aria-hidden="true">' + escapeHtml(product.name.slice(0, 1).toUpperCase()) + '</span>';
}

function productCard(product) {
  return '<a class="product-card" href="#/item/' + encodeURIComponent(product.id) + '">' +
    productIcon(product, false) +
    '<div class="product-card-copy"><span class="type-label">' + escapeHtml(productTypeLabel(product.type)) + '</span>' +
    '<h3>' + escapeHtml(product.name) + '</h3>' +
    '<p>' + escapeHtml(product.short) + '</p>' +
    '<span class="text-link">Lihat detail <span aria-hidden="true">→</span></span></div>' +
    '</a>';
}

function renderHome(query, filter) {
  const q = (query || "").trim().toLowerCase();
  const kind = filter || "all";
  const filters = [
    ["all", "Semua"],
    ["app", "Aplikasi Android"],
    ["web", "Website"],
    ["tool", "Web tools"]
  ];
  const matches = PRODUCTS.filter(function(product) {
    const searchable = [product.name, product.short, product.category, product.tagline, productTypeLabel(product.type)].join(" ").toLowerCase();
    return searchable.includes(q) && (kind === "all" || product.type === kind);
  });
  const filterMarkup = filters.map(function(entry) {
    return '<button type="button" class="filter-chip" data-filter="' + entry[0] + '" aria-pressed="' + (kind === entry[0] ? "true" : "false") + '">' + entry[1] + '</button>';
  }).join("");

  let catalogue;
  if (matches.length) {
    catalogue = '<div class="product-grid">' + matches.map(productCard).join("") + '</div>';
  } else {
    catalogue = '<div class="empty-state"><h3>Karya tidak ditemukan</h3><p>Coba kata kunci yang lain.</p><button type="button" class="button button-outline" id="clear-search">Hapus pencarian</button></div>';
  }

  view.innerHTML =
    '<section class="intro"><div class="intro-copy"><p class="eyebrow">ZTech Store</p>' +
    '<h1>Aplikasi dan karya digital, dalam satu tempat.</h1>' +
    '<p>Jelajahi aplikasi Android, website, dan tools yang dibuat oleh ZTech.</p>' +
    '<a class="button button-primary" href="#/catalog">Jelajahi koleksi <span aria-hidden="true">↓</span></a></div></section>' +
    '<section class="catalog" id="catalog"><div class="section-heading"><div><h2>Koleksi</h2><p>Cari karya yang kamu butuhkan.</p></div></div>' +
    '<div class="catalog-tools"><div class="filter-list" role="group" aria-label="Filter jenis karya">' + filterMarkup + '</div></div>' +
    '<div id="catalog-results">' + catalogue + '</div></section>';
}

function renderParagraphs(paragraphs) {
  return (paragraphs || []).map(function(paragraph) {
    return '<p>' + escapeHtml(paragraph) + '</p>';
  }).join("");
}

function renderBullets(items) {
  if (!items || !items.length) return "";
  return '<ul class="detail-list">' + items.map(function(item) {
    return '<li>' + escapeHtml(item) + '</li>';
  }).join("") + '</ul>';
}

function renderPrivacySections(product) {
  if (!product.privacySections || !product.privacySections.length) return "";
  return '<section class="detail-section"><h2>Privasi aplikasi</h2>' +
    '<p class="muted">Informasi ini khusus untuk ' + escapeHtml(product.name) + '. Privasi situs toko dijelaskan di <a href="privacy.html">halaman kebijakan situs</a>.</p>' +
    '<details class="privacy-accordion"><summary>Baca kebijakan privasi aplikasi</summary><div class="privacy-content">' +
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

  const actions = product.type === "app"
    ? '<button class="button button-primary" type="button" data-install="' + escapeHtml(product.id) + '">Unduh APK ↓</button>' +
      '<button class="button button-outline" type="button" data-share="' + escapeHtml(product.id) + '">Bagikan ↗</button>' +
      '<a class="button button-text" href="#guide">Cara memasang</a>'
    : (product.url ? '<a class="button button-primary" href="' + escapeHtml(product.url) + '" target="_blank" rel="noopener noreferrer">Buka website ↗</a>' +
      '<button class="button button-outline" type="button" data-share="' + escapeHtml(product.id) + '">Bagikan ↗</button>' : "");

  const screenshots = product.screenshots && product.screenshots.length
    ? '<section class="detail-section"><div class="section-heading"><div><h2>Tampilan aplikasi</h2><p>Geser untuk melihat tangkapan layar lainnya.</p></div></div><div class="screenshots">' +
      product.screenshots.map(function(src, index) {
        return '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer" aria-label="Buka tangkapan layar ' + (index + 1) + '"><img src="' + escapeHtml(src) + '" alt="Tampilan ' + escapeHtml(product.name) + '" loading="lazy"></a>';
      }).join("") + '</div></section>' : "";

  const features = product.features && product.features.length
    ? '<section class="detail-section"><h2>Fitur utama</h2><div class="feature-list">' +
      product.features.map(function(feature) {
        return '<div class="feature-item"><h3>' + escapeHtml(feature[0]) + '</h3><p>' + escapeHtml(feature[1]) + '</p></div>';
      }).join("") + '</div></section>' : "";

  const whatsNew = product.whatsNew && product.whatsNew.length
    ? '<section class="detail-section"><h2>Pembaruan terbaru</h2>' + renderBullets(product.whatsNew) + '</section>' : "";

  const signature = product.type === "app" && product.signingSha256
    ? '<details class="detail-section compact-details"><summary>Informasi keamanan APK</summary><div class="detail-section-inner"><p class="muted">Sidik jari sertifikat penandatangan APK, untuk pemeriksaan tambahan.</p><span class="field-label">SHA-256 sertifikat</span><code class="hash-value">' + escapeHtml(product.signingSha256) + '</code>' +
      (product.apkSha256 ? '<span class="field-label">SHA-256 file APK</span><code class="hash-value">' + escapeHtml(product.apkSha256) + '</code>' : "") +
      (product.packageName ? '<p class="muted small-text">Nama paket: ' + escapeHtml(product.packageName) + '</p>' : "") +
      '</div></details>' : "";

  const guide = product.type === "app" && product.guides && product.guides.length
    ? '<section class="detail-section" id="guide"><h2>Cara memasang</h2><p class="muted">Setelah file selesai diunduh, buka file APK dan ikuti petunjuk Android. Jika muncul peringatan keamanan, baca dengan teliti dan jangan mematikan perlindungan perangkat.</p><div class="guides">' +
      product.guides.map(function(src, index) {
        return '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener noreferrer"><img src="' + escapeHtml(src) + '" alt="Panduan pemasangan ' + (index + 1) + '" loading="lazy"><span>Lihat panduan ' + (index + 1) + ' ↗</span></a>';
      }).join("") + '</div></section>' : "";

  view.innerHTML =
    '<div class="detail-page"><a class="back-link" href="#/catalog">← Kembali ke koleksi</a>' +
    '<section class="product-header">' + productIcon(product, true) +
      '<div class="product-heading"><span class="type-label">' + escapeHtml(productTypeLabel(product.type)) + '</span>' +
      '<h1>' + escapeHtml(product.name) + '</h1><p>' + escapeHtml(product.tagline || product.short) + '</p>' +
      '<span class="developer">Dibuat oleh ' + escapeHtml(STORE.developer) + '</span></div>' +
      '<div class="product-actions">' + actions + '</div></section>' +
    (metadata.length ? '<div class="metadata">' + metadata.map(function(item) {
      return '<span><b>' + escapeHtml(item[0]) + ':</b> ' + escapeHtml(item[1]) + '</span>';
    }).join("") + '</div>' : "") +
    '<section class="detail-section about-product"><h2>Tentang aplikasi</h2>' + renderParagraphs(product.description) + '</section>' +
    screenshots + features + whatsNew + signature + renderPrivacySections(product) + guide +
    '<p class="detail-footer"><a href="#/catalog">Lihat karya lainnya →</a></p></div>';
  window.scrollTo({top:0, behavior:"smooth"});
}

async function shareProduct(product) {
  if (!product) return;
  const url = productPageUrl(product);
  const shareData = {
    title: product.name + " — ZTech Store",
    text: "Lihat halaman " + product.name + " di ZTech Store.",
    url: url
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (!error || error.name !== "AbortError") showToast("Halaman belum bisa dibagikan. Coba salin tautannya.");
    }
    return;
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = url;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      const copied = document.execCommand("copy");
      temporaryInput.remove();
      if (!copied) throw new Error("Clipboard unavailable");
    }
    showToast("Tautan halaman berhasil disalin.");
  } catch (error) {
    window.prompt("Salin tautan halaman ini:", url);
  }
}

function showInstallDialog(product) {
  if (!product || product.type !== "app" || !product.apkFile) return;
  sheet.innerHTML =
    '<div class="sheet-inner"><button class="sheet-close" id="close-sheet" type="button" aria-label="Tutup">×</button>' +
    '<h2 id="sheet-title">Unduh ' + escapeHtml(product.name) + '</h2>' +
    '<p>File APK akan diunduh dari GitHub Releases.</p>' +
    '<div class="install-note"><b>Setelah mengunduh</b><p>Buka file APK dan ikuti petunjuk pada perangkat. Jika muncul peringatan keamanan, baca terlebih dahulu dan jangan menonaktifkan perlindungan perangkat.</p></div>' +
    '<div class="sheet-actions"><a class="button button-primary" id="go" href="' + escapeHtml(apkUrl(product)) + '">Unduh APK ↓</a>' +
    '<button class="button button-outline" id="share-from-sheet" type="button">Bagikan halaman ↗</button></div>' +
    '<button class="cancel-link" id="cancel-sheet" type="button">Kembali</button></div>';
  sheet.showModal();
  $("#close-sheet").addEventListener("click", function() { sheet.close(); });
  $("#cancel-sheet").addEventListener("click", function() { sheet.close(); });
  $("#share-from-sheet").addEventListener("click", function() { shareProduct(product); });
  $("#go").addEventListener("click", function() {
    window.setTimeout(function() {
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
  showToast.timer = window.setTimeout(function() { toast.classList.remove("on"); }, 2800);
}

function route() {
  const hash = window.location.hash;
  if (hash.startsWith("#/item/")) {
    const product = getProduct(decodeURIComponent(hash.slice(7)));
    if (product) {
      renderDetail(product);
      return;
    }
  }
  if (hash === "#guide" && document.getElementById("guide")) return;

  renderHome(searchInput.value, window.currentProductFilter || "all");
  document.title = "ZTech Store";
  if (hash === "#/catalog") {
    window.requestAnimationFrame(function() {
      const catalog = $("#catalog");
      if (catalog) catalog.scrollIntoView({behavior:"smooth", block:"start"});
    });
  } else {
    window.scrollTo({top:0, behavior:"smooth"});
  }
}

window.addEventListener("hashchange", route);

searchInput.addEventListener("input", function() {
  if (window.location.hash.startsWith("#/item/")) window.location.hash = "#/catalog";
  renderHome(searchInput.value, window.currentProductFilter || "all");
});

document.addEventListener("click", function(event) {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    window.currentProductFilter = filterButton.dataset.filter;
    renderHome(searchInput.value, window.currentProductFilter);
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
  if (event.target.closest("#clear-search")) {
    searchInput.value = "";
    window.currentProductFilter = "all";
    renderHome("", "all");
  }
  const sameAnchor = event.target.closest('a[href="#/catalog"]');
  if (sameAnchor && window.location.hash === "#/catalog") {
    event.preventDefault();
    const catalog = $("#catalog");
    if (catalog) catalog.scrollIntoView({behavior:"smooth", block:"start"});
  }
});

sheet.addEventListener("click", function(event) {
  if (event.target === sheet) sheet.close();
});

route();
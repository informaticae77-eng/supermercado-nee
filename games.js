/* ==========================================================================
   MÓDULO DE MINIJUEGOS NEE - OVERLAY FLOTANTE EN BODY (V40)
   ========================================================================== */

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1]
};

function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_arcade_progress_v36');
    if (saved) {
        try { studentMinigamesProgress = JSON.parse(saved); } catch(e){}
    }
}

function saveMinigamesProgress() {
    localStorage.setItem('nee_arcade_progress_v36', JSON.stringify(studentMinigamesProgress));
}

function exitArcadeToDashboard() {
    if (typeof renderApp === 'function') renderApp();
    else if (typeof initApp === 'function') initApp();
    else window.location.reload();
}

const CATEGORY_ICONS = {
    'Lácteos': '🥛',
    'Frutas y Verduras': '🍎',
    'Panadería': '🍞',
    'Aseo': '🧼',
    'Limpieza': '🧼',
    'Bebidas': '🧃',
    'Carnes': '🥩',
    'Fiambre': '🧀',
    'Despensa': '🌾'
};

function getCategoryIcon(catName) {
    if (!catName) return '🏷️';
    for (let key in CATEGORY_ICONS) {
        if (String(catName).toLowerCase().includes(key.toLowerCase())) return CATEGORY_ICONS[key];
    }
    return '🏷️';
}

function getDatabaseProducts() {
    let rawList = [];

    const appStateProducts = (typeof APP_STATE !== 'undefined' && APP_STATE && Array.isArray(APP_STATE.products))
        ? APP_STATE.products
        : [];

    if (appStateProducts.length > 0) {
        rawList = appStateProducts;
    } else if (window.APP_STATE && Array.isArray(window.APP_STATE.products) && window.APP_STATE.products.length > 0) {
        rawList = window.APP_STATE.products;
    } else if (window.PRODUCT_STORE && typeof window.PRODUCT_STORE.getProducts === 'function') {
        rawList = window.PRODUCT_STORE.getProducts();
    } else if (window.products && Array.isArray(window.products)) {
        rawList = window.products;
    } else {
        try {
            const local = localStorage.getItem('supermarket_app_state') || localStorage.getItem('APP_STATE');
            if (local) {
                const parsed = JSON.parse(local);
                rawList = Array.isArray(parsed) ? parsed : (parsed.products || []);
            }
        } catch (e) {}
    }

    const processedList = [];

    if (Array.isArray(rawList)) {
        rawList.forEach((item, index) => {
            if (!item) return;

            const nameStr = item.name || item.nombre || item.productName || `Producto ${index + 1}`;
            const categoryStr = item.category || item.categoria || 'Lácteos, Yogures y Huevos';
            const priceNum = parseInt(item.price || item.precio) || 1000;

            let photoSrc =
                item.photoUrl ||
                item.photo ||
                item.image ||
                item.imagen ||
                item.img ||
                item.foto ||
                item.fotoUrl ||
                item.imageUrl ||
                item.image_url ||
                item.urlImagen ||
                item.url_imagen ||
                '';

            photoSrc = String(photoSrc || '').trim();

            if (
                photoSrc &&
                !photoSrc.startsWith('data:image') &&
                !photoSrc.startsWith('http') &&
                !photoSrc.startsWith('/') &&
                !photoSrc.startsWith('blob:') &&
                !photoSrc.startsWith('file:')
            ) {
                if (/^[A-Za-z0-9+/=]+$/.test(photoSrc)) {
                    photoSrc = `data:image/png;base64,${photoSrc}`;
                }
            }

            const emoji = item.iconEmoji || item.emoji || '🛍️';

            processedList.push({
                id: item.id || `prod-${index}`,
                name: String(nameStr).trim(),
                category: String(categoryStr).trim(),
                photoUrl: photoSrc,
                iconEmoji: emoji,
                price: priceNum
            });
        });
    }

    return processedList;
}

function renderProductVisual(product, textSize = "text-7xl") {
    if (product && product.photoUrl) {
        return `
            <img
                src="${product.photoUrl}"
                alt="${String(product.name || 'Producto').replace(/"/g, '"')}"
                class="max-h-full max-w-full object-contain mx-auto"
                onerror="
                    this.style.display='none';
                    if (this.nextElementSibling) this.nextElementSibling.style.display='inline';
                "
            />
            <span class="${textSize} font-black" style="display:none;">${product.iconEmoji || '🛍️'}</span>
        `;
    }

    return `<span class="${textSize} font-black">${product.iconEmoji || '🛍️'}</span>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '"');
}

function getDatabaseMoney(targetPrice) {
    let currencyList = [];

    if (typeof CLP_CURRENCY_ITEMS !== 'undefined' && Array.isArray(CLP_CURRENCY_ITEMS)) {
        currencyList = CLP_CURRENCY_ITEMS;
    } else if (window.CLP_CURRENCY_ITEMS && Array.isArray(window.CLP_CURRENCY_ITEMS)) {
        currencyList = window.CLP_CURRENCY_ITEMS;
    }

    if (currencyList.length > 0) {
        return [...currencyList].sort(() => 0.5 - Math.random()).slice(0, 4).map(c => ({
            value: c.value,
            label: `$${c.value.toLocaleString('es-CL')} CLP`,
            img: c.img,
            type: c.type
        }));
    }

    const p = targetPrice || 1000;
    return [
        { value: p, label: `$${p.toLocaleString('es-CL')} CLP`, icon: "💵" },
        { value: p + 500, label: `$${(p + 500).toLocaleString('es-CL')} CLP`, icon: "💵" },
        { value: Math.max(100, p - 300), label: `$${Math.max(100, p - 300).toLocaleString('es-CL')} CLP`, icon: "🪙" },
        { value: p + 1000, label: `$${(p + 1000).toLocaleString('es-CL')} CLP`, icon: "💵" }
    ].sort(() => 0.5 - Math.random());
}

// --------------------------------------------------------------------------
// INYECTOR DE OVERLAY FLOTANTE (REEMPLAZA EL CAMBIO DE CONTAINER)
// --------------------------------------------------------------------------
function renderGameOverlay(innerHtmlContent) {
    let overlay = document.getElementById('nee-game-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nee-game-modal-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:rgba(2, 6, 23, 0.95); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px; overflow-y:auto;';
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = innerHtmlContent;
    overlay.style.display = 'flex';
}

function closeGameOverlay() {
    const overlay = document.getElementById('nee-game-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
    }
}

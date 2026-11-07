// --------------------------------------------------------------------------
// LECTURA DIRECTA DE IMÁGENES REALES (BASE64) DESDE APP_STATE
// --------------------------------------------------------------------------
function getDatabaseProducts() {
    let rawList = [];

    // Obtener la lista de productos de APP_STATE o window.products
    if (window.APP_STATE && Array.isArray(window.APP_STATE.products) && window.APP_STATE.products.length > 0) {
        rawList = window.APP_STATE.products;
    } else if (window.products && Array.isArray(window.products) && window.products.length > 0) {
        rawList = window.products;
    }

    const validProducts = [];

    rawList.forEach(item => {
        if (!item) return;

        let name = item.name || item.nombre || 'Producto';
        let category = item.category || item.categoria || 'Lácteos, Yogures y Huevos';
        let price = parseInt(item.price || item.precio) || 1000;
        
        // CORRECCIÓN CLAVE: Buscar tanto en .image como en .photo
        let photo = item.image || item.photo || item.photoUrl || item.imagen || item.img || '';
        let emoji = item.iconEmoji || item.emoji || '🛍️';

        validProducts.push({
            name: String(name).trim(),
            category: String(category).trim(),
            photoUrl: photo, // Guardará la cadena data:image/jpeg;base64,...
            iconEmoji: emoji,
            price: price
        });
    });

    return validProducts;
}

// --------------------------------------------------------------------------
// RENDERIZADO DE LA IMAGEN BASE64
// --------------------------------------------------------------------------
function renderProductVisual(product, textSize = "text-7xl") {
    const emoji = product.iconEmoji || '🛍️';
    
    // Si la cadena photoUrl existe y tiene contenido (Base64 o URL)
    if (product.photoUrl && String(product.photoUrl).trim() !== '' && product.photoUrl.length > 10) {
        return `<img src="${product.photoUrl}" alt="${product.name}" class="max-h-full max-w-full object-contain mx-auto" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <span class="${textSize} font-black" style="display:none;">${emoji}</span>`;
    }
    
    return `<span class="${textSize} font-black">${emoji}</span>`;
}

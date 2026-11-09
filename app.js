function compressImageBase64(base64Data, maxWidth = 250, maxHeight = 250, quality = 0.6) {
    return new Promise((resolve, reject) => {
        if (!base64Data || !base64Data.startsWith('data:image')) return resolve(base64Data || '');
        const img = new Image();
        img.onload = () => {
            let width = img.width, height = img.height;
            if (width > height) {
                if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
            } else {
                if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
        img.src = base64Data;
    });
}

function normalizeCurrencyImageMap(rawValue) {
    const normalized = {};
    if (!rawValue || typeof rawValue !== 'object') return normalized;

    const addEntry = (key, value) => {
        if (!key || typeof key !== 'string') return;
        const cleanKey = key.trim();
        if (!cleanKey) return;
        if (!value) return;

        let finalValue = value;
        if (typeof value === 'object') {
            finalValue = value.img || value.image || value.imageUrl || value.url || value.dataUrl || value.src || value.base64 || '';
        }

        if (typeof finalValue === 'string' && finalValue.trim() && (finalValue.startsWith('data:image') || finalValue.startsWith('http://') || finalValue.startsWith('https://'))) {
            normalized[cleanKey] = finalValue;
        }
    };

    if (Array.isArray(rawValue)) {
        rawValue.forEach((entry, index) => {
            if (!entry || typeof entry !== 'object') return;
            const key = entry.id || entry.itemId || entry.currencyId || entry.key || `currency_${index}`;
            addEntry(key, entry.img || entry.image || entry.imageUrl || entry.url || entry.dataUrl || entry.src || entry.base64 || '');
        });
        return normalized;
    }

    Object.entries(rawValue).forEach(([key, value]) => {
        if (key === 'billetes' || key === 'monedas' || key === 'currency' || key === 'currencies') {
            const list = Array.isArray(value) ? value : [];
            list.forEach((entry, index) => {
                if (!entry || typeof entry !== 'object') return;
                const nestedKey = entry.id || entry.itemId || entry.currencyId || entry.key || `currency_${index}`;
                addEntry(nestedKey, entry.img || entry.image || entry.imageUrl || entry.url || entry.dataUrl || entry.src || entry.base64 || '');
            });
            return;
        }

        addEntry(key, value);
    });

    return normalized;
}

function persistCustomCurrencyMap() {
    const safeMap = normalizeCurrencyImageMap(APP_STATE.customCurrencies);
    APP_STATE.customCurrencies = safeMap;

    try { localStorage.setItem('nee_custom_currencies', JSON.stringify(safeMap)); } catch (err) {}

    if (db && typeof firebase !== 'undefined' && firebase.firestore) {
        db.collection('settings').doc('currencies').set(safeMap, { merge: true }).catch(() => {
            try {
                db.collection('settings').doc('currencies').set({ updatedAt: Date.now() }, { merge: true });
            } catch (e) {}
        });
    }

    return safeMap;
}

function uploadCustomCurrencyImage(event, itemId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 300, 300, 0.6).then(compressed => {
            APP_STATE.customCurrencies = { ...APP_STATE.customCurrencies, [itemId]: compressed };
            persistCustomCurrencyMap();
            renderApp();
            alert("✅ Imagen cargada exitosamente.");
        });
    };
    reader.readAsDataURL(file);
}

function resetCustomCurrencyImage(itemId) {
    const updated = { ...APP_STATE.customCurrencies };
    delete updated[itemId];
    APP_STATE.customCurrencies = updated;

    try { localStorage.setItem('nee_custom_currencies', JSON.stringify(APP_STATE.customCurrencies)); } catch (e) {}

    if (db && typeof firebase !== 'undefined' && firebase.firestore) {
        const update = {};
        update[itemId] = firebase.firestore.FieldValue.delete();
        db.collection('settings').doc('currencies').set(update, { merge: true });
    }

    renderApp();
}

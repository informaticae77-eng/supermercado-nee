/* ==========================================================================
   MÓDULO DE MINIJUEGOS NEE - SOLUCIÓN INTEGRADA DE MODAL Y DOM (V45)
   ========================================================================== */

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1]
};

function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_arcade_progress_v45');
    if (saved) {
        try { studentMinigamesProgress = JSON.parse(saved); } catch(e){}
    }
}

function saveMinigamesProgress() {
    localStorage.setItem('nee_arcade_progress_v45', JSON.stringify(studentMinigamesProgress));
}

// Obtiene el contenedor correcto (Prioriza el interior del Modal si existe en index.html)
function getAppContainer() {
    const modalBody = document.getElementById('arcadeModalBody');
    const modalWrapper = document.getElementById('minigamesArcadeModal');

    if (modalWrapper && modalBody) {
        modalWrapper.classList.remove('hidden');
        modalWrapper.style.display = 'flex';
        return modalBody;
    }

    return document.getElementById('appContainer') || 
           document.getElementById('app') || 
           document.querySelector('main') || 
           document.body;
}

function closeMinigamesModal() {
    const modalWrapper = document.getElementById('minigamesArcadeModal');
    if (modalWrapper) {
        modalWrapper.classList.add('hidden');
        modalWrapper.style.display = 'none';
    } else {
        exitArcadeToDashboard();
    }
}

function exitArcadeToDashboard() {
    closeMinigamesModal();
    if (typeof renderApp === 'function') renderApp();
    else if (typeof initApp === 'function') initApp();
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

    if (window.APP_STATE && Array.isArray(window.APP_STATE.products) && window.APP_STATE.products.length > 0) {
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
                item.photo ||
                item.image ||
                item.photoUrl ||
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

function renderProductVisual(product, textSize = "text-6xl") {
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

function renderMinigamesArcadeView() {
    loadMinigamesProgress();

    const container = getAppContainer();
    if (!container) return;

    const currentLvl = studentMinigamesProgress.currentLevel || 1;
    const completedInCurrentLvl = studentMinigamesProgress.completedGames[`level${currentLvl}`] || [];

    const levelsConfig = [
        { id: 1, title: "Comprador Principiante", icon: "🛒", border: "border-cyan-500" },
        { id: 2, title: "Explorador de Góndolas", icon: "🔍", border: "border-emerald-500" },
        { id: 3, title: "As del Vuelto y Cajas", icon: "💵", border: "border-amber-500" },
        { id: 4, title: "Planificador Experto", icon: "📋", border: "border-purple-500" },
        { id: 5, title: "Maestro del Supermercado", icon: "👑", border: "border-rose-500" }
    ];

    const currentLevelInfo = levelsConfig.find(l => l.id === currentLvl) || levelsConfig[0];

    const html = `
    <div class="bg-slate-900 text-slate-100 p-4 sm:p-6 rounded-3xl font-sans select-none space-y-6">
        <header class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-indigo-500/40">
            <div>
                <span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest block w-fit">
                    Adaptado NEE • Mineduc
                </span>
                <h1 class="text-xl font-black text-white mt-1">CENTRO DE DESAFÍOS</h1>
            </div>
            <button onclick="closeMinigamesModal()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700">
                ✕ Cerrar Arcade
            </button>
        </header>

        <section class="bg-slate-950 p-6 rounded-2xl border-2 ${currentLevelInfo.border} flex justify-between items-center">
            <div>
                <span class="bg-amber-500/20 text-amber-300 font-black text-xs px-3 py-1 rounded-full uppercase">Stage ${currentLvl} de 5</span>
                <h2 class="text-2xl font-black text-white uppercase mt-2">${currentLevelInfo.title} ${currentLevelInfo.icon}</h2>
            </div>
        </section>

        <main class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${renderGameCard(currentLvl, 1, "🍎 El Estante Correcto", "OA04: Clasificar con pictogramas de categorías.", "startMinigame1()", "mj1", completedInCurrentLvl)}
        </main>
    </div>
    `;

    container.innerHTML = html;
}

function renderGameCard(level, gameNum, title, description, fnCall, gameKey, completedList) {
    const isCompleted = completedList.includes(gameKey);

    return `
    <div class="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
        <div>
            <h3 class="font-black text-white text-lg">${title}</h3>
            <p class="text-xs text-slate-400 font-bold mt-1">${description}</p>
        </div>
        <button onclick="${fnCall}" 
                class="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border border-indigo-400 active:scale-95">
            ${isCompleted ? '🔄 Rejugar Desafío' : '▶ ¡Iniciar!'}
        </button>
    </div>
    `;
}

let gameState = { startTime: null, errors: 0, currentQuestion: 0, questions: [], key: '' };

function startMinigame1() {
    const catalog = getDatabaseProducts();
    const shuffled = [...catalog].sort(() => 0.5 - Math.random());
    
    gameState = {
        key: 'mj1',
        startTime: Date.now(),
        errors: 0,
        currentQuestion: 0,
        questions: shuffled.slice(0, Math.min(5, shuffled.length))
    };
    
    renderMinigame1Question();
}

function renderMinigame1Question() {
    if (!gameState.questions || gameState.questions.length === 0) return;

    if (gameState.currentQuestion >= gameState.questions.length) {
        return finishMinigame('mj1', 'El Estante Correcto');
    }

    const q = gameState.questions[gameState.currentQuestion];
    const allProducts = getDatabaseProducts();
    const categoriesSet = new Set(allProducts.map(p => p.category));
    ['Lácteos, Yogures y Huevos', 'Frutas y Verduras', 'Panadería y Pastelería', 'Limpieza del Hogar'].forEach(c => categoriesSet.add(c));
    const availableCategories = Array.from(categoriesSet);

    let options = [q.category];
    const otherCats = availableCategories.filter(c => c !== q.category).sort(() => 0.5 - Math.random());
    options.push(...otherCats.slice(0, 3));
    options.sort(() => 0.5 - Math.random());

    const html = `
    <div class="bg-slate-950 text-slate-100 p-6 rounded-3xl border-2 border-indigo-500/60 shadow-2xl space-y-6 text-center select-none">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
            <span class="text-xs font-black text-indigo-400 uppercase">OA04 MINEDUC: Categorización</span>
            <span class="text-xs font-black text-amber-400">Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}</span>
        </div>

        <div class="py-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
            <div class="w-44 h-44 bg-white p-3 rounded-2xl border-4 border-indigo-500/40 shadow-xl flex items-center justify-center overflow-hidden">
                ${renderProductVisual(q)}
            </div>
            <span class="text-lg font-black text-white uppercase px-2">${q.name}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${options.map(catName => `
                <button onclick="checkMinigame1Answer('${escapeHtml(catName)}')" 
                        class="w-full h-14 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg flex items-center justify-center px-4 text-sm border border-indigo-400 gap-2">
                    <span class="text-xl">${getCategoryIcon(catName)}</span>
                    <span>${catName}</span>
                </button>
            `).join('')}
        </div>
        <button onclick="renderMinigamesArcadeView()" class="mt-4 text-xs font-bold text-slate-500 underline block mx-auto">✕ Volver a la lista de desafíos</button>
    </div>`;

    getAppContainer().innerHTML = html;
}

function checkMinigame1Answer(selectedCat) {
    const q = gameState.questions[gameState.currentQuestion];
    if (selectedCat.toLowerCase() === q.category.toLowerCase()) {
        gameState.currentQuestion++;
        renderMinigame1Question();
    } else {
        gameState.errors++;
        alert(`❌ "${q.name}" no pertenece a ${selectedCat}. ¡Inténtalo de nuevo!`);
    }
}

function finishMinigame(key, title) {
    saveMinigamesProgress();
    alert(`🎉 ¡Excelente! Completaste el desafío "${title}"`);
    renderMinigamesArcadeView();
}

// Registro global de funciones
window.renderMinigamesArcadeView = renderMinigamesArcadeView;
window.openMinigamesModal = renderMinigamesArcadeView;
window.closeMinigamesModal = closeMinigamesModal;
window.startMinigame1 = startMinigame1;
window.checkMinigame1Answer = checkMinigame1Answer;

/* ==========================================================================
   MÓDULO DE MINIJUEGOS NEE - CONEXIÓN NATIVA AL CONTENEDOR '#app'
   ========================================================================== */

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1]
};

function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_arcade_progress_v40');
    if (saved) {
        try { studentMinigamesProgress = JSON.parse(saved); } catch(e){}
    }
}

function saveMinigamesProgress() {
    localStorage.setItem('nee_arcade_progress_v40', JSON.stringify(studentMinigamesProgress));
}

// Búsqueda del contenedor real según app.js
function getAppContainer() {
    return document.getElementById('app') || document.getElementById('appContainer') || document.body;
}

function exitArcadeToDashboard() {
    if (typeof renderApp === 'function') {
        renderApp();
    } else if (typeof initApp === 'function') {
        initApp();
    } else {
        window.location.reload();
    }
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
// VISTA PRINCIPAL ARCADE
// --------------------------------------------------------------------------
function renderMinigamesArcadeView() {
    loadMinigamesProgress();

    const container = getAppContainer();
    if (!container) return;

    const currentLvl = studentMinigamesProgress.currentLevel || 1;
    const completedInCurrentLvl = studentMinigamesProgress.completedGames[`level${currentLvl}`] || [];
    const isBossUnlocked = completedInCurrentLvl.length >= 5;

    const levelsConfig = [
        { id: 1, title: "Comprador Principiante", icon: "🛒", border: "border-cyan-500" },
        { id: 2, title: "Explorador de Góndolas", icon: "🔍", border: "border-emerald-500" },
        { id: 3, title: "As del Vuelto y Cajas", icon: "💵", border: "border-amber-500" },
        { id: 4, title: "Planificador Experto", icon: "📋", border: "border-purple-500" },
        { id: 5, title: "Maestro del Supermercado", icon: "👑", border: "border-rose-500" }
    ];

    const currentLevelInfo = levelsConfig.find(l => l.id === currentLvl) || levelsConfig[0];

    const html = `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 font-sans select-none pb-20">
        <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/90 p-4 sm:p-6 rounded-3xl border-2 border-indigo-500/40 shadow-2xl">
            <div class="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
                <button onclick="exitArcadeToDashboard()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 shadow-lg border border-indigo-400">
                    <span>⬅</span> <span>Volver a la Tienda</span>
                </button>
                <div>
                    <span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest block w-fit">
                        Adaptado NEE • Mineduc
                    </span>
                    <h1 class="text-xl sm:text-2xl font-black text-white tracking-wide mt-0.5">CENTRO DE DESAFÍOS</h1>
                </div>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                ${levelsConfig.map(lvl => {
                    const isUnlocked = studentMinigamesProgress.unlockedLevels.includes(lvl.id);
                    const isActive = lvl.id === currentLvl;
                    return `
                    <button onclick="${isUnlocked ? `switchLevel(${lvl.id})` : ''}" 
                            class="px-4 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                                isActive 
                                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg scale-105' 
                                    : isUnlocked 
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700' 
                                        : 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
                            }">
                        <span class="text-base">${lvl.icon}</span>
                        <span>Nivel ${lvl.id}</span>
                        ${!isUnlocked ? '<span class="text-[10px]">🔒</span>' : ''}
                    </button>`;
                }).join('')}
            </div>
        </header>

        <section class="max-w-7xl mx-auto mt-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border-2 ${currentLevelInfo.border} shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="space-y-2 text-center md:text-left">
                <span class="bg-black/60 text-amber-400 border border-amber-500/40 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                    ⚡ Stage ${currentLvl} de 5
                </span>
                <h2 class="text-2xl sm:text-4xl font-black text-white uppercase">${currentLevelInfo.title} ${currentLevelInfo.icon}</h2>
                <p class="text-xs sm:text-sm font-bold text-slate-300 max-w-xl">
                    Selecciona uno de los desafíos pedagógicos para comenzar a jugar.
                </p>
            </div>
            <div class="bg-slate-950/80 p-5 rounded-2xl text-center border border-slate-700 min-w-[170px] w-full md:w-auto">
                <span class="text-[10px] font-black text-indigo-400 block uppercase tracking-widest">PROGRESO DE ETAPA</span>
                <span class="text-3xl sm:text-4xl font-black text-amber-400 mt-1 block">${completedInCurrentLvl.length} / 5</span>
            </div>
        </section>

        <main class="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            ${renderGameCard(currentLvl, 1, "🍎 El Estante Correcto", "OA04: Clasificar con pictogramas de categorías.", "startMinigame1()", "mj1", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 2, "💵 Corta el Billete", "OA07: Seleccionar el billete/moneda del producto.", "startMinigame2()", "mj2", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 3, "🔤 Palabras en Góndola", "OA02: Lectura guiada del nombre del producto.", "startMinigame3()", "mj3", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 4, "🧮 Calculadora del Canasto", "OA09: Suma visual de precios.", "startMinigame4()", "mj4", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 5, "📋 La Lista de Compras", "OA12: Búsqueda operacional por imágenes.", "startMinigame5()", "mj5", completedInCurrentLvl)}
        </main>
    </div>
    `;

    container.innerHTML = html;
}

function renderGameCard(level, gameNum, title, description, fnCall, gameKey, completedList) {
    const isCompleted = completedList.includes(gameKey);
    const isUnlocked = gameNum === 1 || completedList.includes(`mj${gameNum - 1}`);

    return `
    <div class="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border-2 ${isCompleted ? 'border-emerald-500/80 bg-emerald-950/10' : 'border-slate-800'} shadow-xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-center">
            <span class="text-[10px] font-black px-3 py-1 rounded-full ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}">
                ${isCompleted ? '✓ COMPLETADO' : `DESAFÍO ${gameNum}`}
            </span>
            <span class="text-[10px] font-black text-slate-500 tracking-wider">STAGE ${level}</span>
        </div>
        <div>
            <h3 class="font-black text-white text-base sm:text-lg">${title}</h3>
            <p class="text-xs text-slate-400 font-bold mt-1 leading-relaxed">${description}</p>
        </div>
        <button ${isUnlocked ? `onclick="${fnCall}"` : 'disabled'} 
                class="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                    isUnlocked 
                        ? (isCompleted 
                            ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/50 shadow-md active:scale-95' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400 active:scale-95')
                        : 'bg-slate-950/60 text-slate-600 border border-slate-800/40 cursor-not-allowed'
                }">
            ${isUnlocked ? (isCompleted ? '🔄 Rejugar Desafío' : '▶ ¡Iniciar!') : '🔒 Bloqueado'}
        </button>
    </div>
    `;
}

// --------------------------------------------------------------------------
// LÓGICA DE JUEGOS
// --------------------------------------------------------------------------
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
    ['Lácteos, Yogures y Huevos', 'Frutas y Verduras', 'Panadería y Pastelería', 'Limpieza del Hogar', 'Bebidas, Agua y Jugos'].forEach(c => categoriesSet.add(c));
    const availableCategories = Array.from(categoriesSet);

    let options = [q.category];
    const otherCats = availableCategories.filter(c => c !== q.category).sort(() => 0.5 - Math.random());
    options.push(...otherCats.slice(0, 3));
    options.sort(() => 0.5 - Math.random());

    const html = `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex items-center justify-center">
        <div class="max-w-2xl w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/60 shadow-2xl space-y-6 text-center select-none">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-slate-800 pb-4">
                <div class="text-left">
                    <span class="text-[10px] font-black text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full uppercase border border-indigo-500/30">
                        OA04 MINEDUC: Categorización Semántica
                    </span>
                    <h3 class="text-xs font-black text-slate-300 mt-1">Selecciona el estante adecuado utilizando la foto real.</h3>
                </div>
                <span class="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                    Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}
                </span>
            </div>

            <div class="py-4 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                <div class="w-48 h-48 sm:w-56 sm:h-56 bg-white p-4 rounded-3xl border-4 border-indigo-500/40 shadow-xl flex items-center justify-center overflow-hidden">
                    ${renderProductVisual(q)}
                </div>
                <span class="text-xl sm:text-2xl font-black text-white uppercase px-4 tracking-wide block">${q.name}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                ${options.map(catName => `
                    <button onclick="checkMinigame1Answer('${escapeHtml(catName)}')" 
                            class="w-full h-16 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-2xl shadow-lg flex items-center justify-center px-6 text-base border border-indigo-400 gap-3 transition-all">
                        <span class="text-2xl">${getCategoryIcon(catName)}</span>
                        <span>${catName}</span>
                    </button>
                `).join('')}
            </div>
            <button onclick="renderMinigamesArcadeView()" class="mt-4 text-xs font-bold text-slate-500 underline block mx-auto">✕ Salir al Centro de Desafíos</button>
        </div>
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
        alert(`❌ "${q.name}" no va en ${selectedCat}. ¡Inténtalo de nuevo!`);
    }
}

function finishMinigame(key, title) {
    const timeSpent = Math.round((Date.now() - gameState.startTime) / 1000);
    const lvl = studentMinigamesProgress.currentLevel || 1;

    if (!studentMinigamesProgress.completedGames[`level${lvl}`]) {
        studentMinigamesProgress.completedGames[`level${lvl}`] = [];
    }

    if (!studentMinigamesProgress.completedGames[`level${lvl}`].includes(key)) {
        studentMinigamesProgress.completedGames[`level${lvl}`].push(key);
    }

    saveMinigamesProgress();
    alert(`🎉 ¡Excelente!\nCompletaste "${title}"\n⏱️ Tiempo: ${timeSpent}s | ❌ Errores: ${gameState.errors}`);
    renderMinigamesArcadeView();
}

function switchLevel(levelId) {
    studentMinigamesProgress.currentLevel = levelId;
    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

// ALIAS GLOBALES GARANTIZADOS PARA CONECTAR CON INDEX.HTML Y APP.JS
window.renderMinigamesArcadeView = renderMinigamesArcadeView;
window.openMinigamesModal = renderMinigamesArcadeView;
window.openMemoriseModal = renderMinigamesArcadeView;
window.openMemorisModal = renderMinigamesArcadeView;
window.openArcadeModal = renderMinigamesArcadeView;
window.launchMinigames = renderMinigamesArcadeView;
window.startMinigame1 = startMinigame1;
window.checkMinigame1Answer = checkMinigame1Answer;
window.getAppContainer = getAppContainer;

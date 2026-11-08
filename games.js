/* ==========================================================================
   MÓDULO DE MINIJUEGOS NEE - VERSIÓN LISTA PARA REEMPLAZAR
   Compatibilidad: app.js / index.html
   Objetivo: juego infantil, frases claras, botones funcionales
   ========================================================================== */

(() => {
    const MINIGAMES_STORAGE_KEY = 'nee_arcade_progress_v36';

    let studentMinigamesProgress = {
        currentLevel: 1,
        completedGames: {},
        unlockedLevels: [1]
    };

    let gameState = {
        startTime: null,
        errors: 0,
        currentQuestion: 0,
        questions: [],
        key: ''
    };

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

    function safeStorageGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            return false;
        }
    }

    function normalizeProgress(progress) {
        const base = progress || {
            currentLevel: 1,
            completedGames: {},
            unlockedLevels: [1]
        };

        const normalized = {
            currentLevel: Number(base.currentLevel) || 1,
            completedGames: (base.completedGames && typeof base.completedGames === 'object') ? base.completedGames : {},
            unlockedLevels: Array.isArray(base.unlockedLevels) && base.unlockedLevels.length
                ? [...new Set(base.unlockedLevels.map(Number).filter(n => n >= 1 && n <= 5))]
                : [1]
        };

        normalized.currentLevel = Math.min(Math.max(normalized.currentLevel, 1), 5);

        if (!normalized.unlockedLevels.includes(normalized.currentLevel)) {
            normalized.unlockedLevels.push(normalized.currentLevel);
        }

        normalized.unlockedLevels = [...new Set(normalized.unlockedLevels.map(Number).filter(n => n >= 1 && n <= 5))];

        return normalized;
    }

    function loadMinigamesProgress() {
        const saved = safeStorageGet(MINIGAMES_STORAGE_KEY);
        if (!saved) {
            studentMinigamesProgress = normalizeProgress(studentMinigamesProgress);
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            studentMinigamesProgress = normalizeProgress(parsed);
        } catch (e) {
            studentMinigamesProgress = normalizeProgress(studentMinigamesProgress);
        }
    }

    function saveMinigamesProgress() {
        studentMinigamesProgress = normalizeProgress(studentMinigamesProgress);
        safeStorageSet(MINIGAMES_STORAGE_KEY, JSON.stringify(studentMinigamesProgress));
    }

    function exitArcadeToDashboard() {
        if (typeof renderApp === 'function') {
            renderApp();
            return;
        }
        if (typeof initApp === 'function') {
            initApp();
            return;
        }
        window.location.reload();
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function getCategoryIcon(catName) {
        if (!catName) return '🏷️';

        const text = String(catName).toLowerCase();

        for (const key in CATEGORY_ICONS) {
            if (text.includes(key.toLowerCase())) return CATEGORY_ICONS[key];
        }

        return '🏷️';
    }

    function getDatabaseProducts() {
        let rawList = [];

        const appStateRef = (typeof APP_STATE !== 'undefined') ? APP_STATE : (window.APP_STATE || null);

        if (appStateRef && Array.isArray(appStateRef.products) && appStateRef.products.length > 0) {
            rawList = appStateRef.products;
        } else if (window.PRODUCT_STORE && typeof window.PRODUCT_STORE.getProducts === 'function') {
            rawList = window.PRODUCT_STORE.getProducts();
        } else if (window.products && Array.isArray(window.products)) {
            rawList = window.products;
        } else {
            try {
                const local =
                    safeStorageGet('supermarket_app_state') ||
                    safeStorageGet('APP_STATE') ||
                    safeStorageGet('products');

                if (local) {
                    const parsed = JSON.parse(local);
                    rawList = Array.isArray(parsed) ? parsed : (parsed.products || []);
                }
            } catch (e) {
                rawList = [];
            }
        }

        const processedList = [];

        if (!Array.isArray(rawList)) return processedList;

        rawList.forEach((item, index) => {
            if (!item) return;

            const nameStr = item.name || item.nombre || item.productName || `Producto ${index + 1}`;
            const categoryStr = item.category || item.categoria || 'Lácteos, Yogures y Huevos';
            const priceNum = Number(item.price ?? item.precio ?? 1000) || 1000;

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

        return processedList;
    }

    function renderProductVisual(product, textSize = 'text-7xl') {
        if (product && product.photoUrl) {
            return `
                <img
                    src="${escapeHtml(product.photoUrl)}"
                    alt="${escapeHtml(product.name || 'Producto')}"
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

    function getDatabaseMoney(targetPrice) {
        let currencyList = [];

        if (typeof CLP_CURRENCY_ITEMS !== 'undefined' && Array.isArray(CLP_CURRENCY_ITEMS)) {
            currencyList = CLP_CURRENCY_ITEMS;
        } else if (window.CLP_CURRENCY_ITEMS && Array.isArray(window.CLP_CURRENCY_ITEMS)) {
            currencyList = window.CLP_CURRENCY_ITEMS;
        }

        if (currencyList.length > 0) {
            return [...currencyList]
                .sort(() => 0.5 - Math.random())
                .slice(0, 4)
                .map(c => ({
                    value: Number(c.value) || 0,
                    label: `$${Number(c.value || 0).toLocaleString('es-CL')} CLP`,
                    img: c.img || '',
                    type: c.type || 'money',
                    icon: c.icon || '💵'
                }));
        }

        const p = Number(targetPrice) || 1000;

        return [
            { value: p, label: `$${p.toLocaleString('es-CL')} CLP`, icon: '💵' },
            { value: p + 500, label: `$${(p + 500).toLocaleString('es-CL')} CLP`, icon: '💵' },
            { value: Math.max(100, p - 300), label: `$${Math.max(100, p - 300).toLocaleString('es-CL')} CLP`, icon: '🪙' },
            { value: p + 1000, label: `$${(p + 1000).toLocaleString('es-CL')} CLP`, icon: '💵' }
        ].sort(() => 0.5 - Math.random());
    }

    function getLevelsConfig() {
        return [
            { id: 1, title: 'Comprador Principiante', icon: '🛒', border: 'border-cyan-500' },
            { id: 2, title: 'Explorador de Góndolas', icon: '🔍', border: 'border-emerald-500' },
            { id: 3, title: 'As del Vuelto y Cajas', icon: '💵', border: 'border-amber-500' },
            { id: 4, title: 'Planificador Experto', icon: '📋', border: 'border-purple-500' },
            { id: 5, title: 'Maestro del Supermercado', icon: '👑', border: 'border-rose-500' }
        ];
    }

    function renderMinigamesArcadeView() {
        loadMinigamesProgress();

        const mainContainer = document.getElementById('appContainer');
        if (!mainContainer) return;

        const levelsConfig = getLevelsConfig();
        const currentLvl = studentMinigamesProgress.currentLevel || 1;
        const completedInCurrentLvl = studentMinigamesProgress.completedGames[`level${currentLvl}`] || [];
        const isBossUnlocked = completedInCurrentLvl.length >= 5;
        const currentLevelInfo = levelsConfig.find(l => l.id === currentLvl) || levelsConfig[0];

        const html = `
        <div class="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 font-sans select-none pb-20">
            <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/90 p-4 sm:p-6 rounded-3xl border-2 border-indigo-500/40 shadow-2xl">
                <div class="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
                    <button onclick="exitArcadeToDashboard()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2">
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
                                class="px-4 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${isActive
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
                        Selecciona uno de los desafíos para comenzar a jugar.
                    </p>
                </div>
                <div class="bg-slate-950/80 p-5 rounded-2xl text-center border border-slate-700 min-w-[170px] w-full md:w-auto">
                    <span class="text-[10px] font-black text-indigo-400 block uppercase tracking-widest">PROGRESO DE ETAPA</span>
                    <span class="text-3xl sm:text-4xl font-black text-amber-400 mt-1 block">${completedInCurrentLvl.length} / 5</span>
                </div>
            </section>

            <main class="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                ${renderGameCard(currentLvl, 1, '🍎 El Estante Correcto', 'OA04: Clasificar con pictogramas de categorías.', 'mj1', completedInCurrentLvl)}
                ${renderGameCard(currentLvl, 2, '💵 Corta el Billete', 'OA07: Elegir el billete o moneda correcto.', 'mj2', completedInCurrentLvl)}
                ${renderGameCard(currentLvl, 3, '🔤 Palabras en Góndola', 'OA02: Leer el nombre del producto.', 'mj3', completedInCurrentLvl)}
                ${renderGameCard(currentLvl, 4, '🧮 Calculadora del Canasto', 'OA09: Sumar precios visualmente.', 'mj4', completedInCurrentLvl)}
                ${renderGameCard(currentLvl, 5, '📋 La Lista de Compras', 'OA12: Buscar el producto correcto.', 'mj5', completedInCurrentLvl)}

                <div class="bg-gradient-to-br from-purple-950 via-slate-900 to-amber-950 rounded-3xl p-6 border-2 border-amber-500/80 shadow-2xl flex flex-col justify-between space-y-5">
                    <div class="flex justify-between items-start">
                        <span class="text-4xl sm:text-5xl animate-bounce">👑</span>
                        <span class="text-[10px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 uppercase">
                            BOSS EXAM NIVEL ${currentLvl}
                        </span>
                    </div>
                    <div>
                        <h3 class="font-black text-white text-lg sm:text-xl uppercase">🛡️ Desafío del Cajero Central</h3>
                        <p class="text-xs text-amber-200/80 font-bold mt-1">
                            OA15: Prueba integrada para subir al Nivel ${currentLvl < 5 ? currentLvl + 1 : 5}.
                        </p>
                    </div>
                    <button ${isBossUnlocked ? `onclick="startBossExam(${currentLvl})"` : 'disabled'}
                            class="w-full py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider ${isBossUnlocked
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-2 border-amber-300 active:scale-95 shadow-lg'
                                : 'bg-slate-900/80 text-slate-600 cursor-not-allowed border border-slate-800'
                            }">
                        ${isBossUnlocked ? '🔥 ¡ENFRENTAR JEFE FINAL!' : '🔒 Completa los 5 minijuegos'}
                    </button>
                </div>
            </main>
        </div>
        `;

        mainContainer.innerHTML = html;
    }

    function renderGameCard(level, gameNum, title, description, gameKey, completedList) {
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

            <button ${isUnlocked ? `onclick="launchGame('${gameKey}')"` : 'disabled'}
                    class="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${isUnlocked
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

    function buildQuestions(limit = 5) {
        const catalog = getDatabaseProducts();
        if (!catalog.length) return [];

        const shuffled = [...catalog].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(limit, shuffled.length));
    }

    function launchGame(gameKey) {
        if (gameKey === 'mj1') return startMinigame1();
        if (gameKey === 'mj2') return startMinigame2();
        if (gameKey === 'mj3') return startMinigame3();
        if (gameKey === 'mj4') return startMinigame4();
        if (gameKey === 'mj5') return startMinigame5();
    }

    function startMinigame1() {
        gameState = {
            key: 'mj1',
            startTime: Date.now(),
            errors: 0,
            currentQuestion: 0,
            questions: buildQuestions(5)
        };

        renderMinigame1Question();
    }

    function renderMinigame1Question() {
        const appContainer = document.getElementById('appContainer');
        if (!appContainer) return;

        if (!gameState.questions || gameState.questions.length === 0) {
            alert('No hay productos disponibles en el catálogo. Agrega productos para jugar.');
            return;
        }

        if (gameState.currentQuestion >= gameState.questions.length) {
            finishMinigame('mj1', 'El Estante Correcto');
            return;
        }

        const q = gameState.questions[gameState.currentQuestion];
        const allProducts = getDatabaseProducts();

        const categoriesSet = new Set(allProducts.map(p => p.category));
        [
            'Lácteos, Yogures y Huevos',
            'Frutas y Verduras',
            'Panadería y Pastelería',
            'Limpieza del Hogar',
            'Bebidas, Agua y Jugos'
        ].forEach(c => categoriesSet.add(c));

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
                            OA04 MINEDUC: Categorización
                        </span>
                        <h3 class="text-xs font-black text-slate-300 mt-1">Selecciona el estante correcto.</h3>
                    </div>
                    <span class="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                        Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}
                    </span>
                </div>

                <div class="py-4 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                    <div class="w-48 h-48 sm:w-56 sm:h-56 bg-white p-4 rounded-3xl border-4 border-indigo-500/40 shadow-xl flex items-center justify-center overflow-hidden">
                        ${renderProductVisual(q)}
                    </div>
                    <span class="text-xl sm:text-2xl font-black text-white uppercase px-4 tracking-wide block">${escapeHtml(q.name)}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    ${options.map(catName => `
                        <button onclick="checkMinigame1Answer('${escapeHtml(catName)}')"
                                class="w-full h-16 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-2xl shadow-lg flex items-center justify-center px-6 text-base border border-indigo-400 gap-2">
                            <span class="text-2xl">${getCategoryIcon(catName)}</span>
                            <span>${escapeHtml(catName)}</span>
                        </button>
                    `).join('')}
                </div>

                <button onclick="renderMinigamesArcadeView()" class="mt-4 text-xs font-bold text-slate-500 underline block mx-auto">✕ Salir al Centro de Desafíos</button>
            </div>
        </div>`;

        appContainer.innerHTML = html;
    }

    function checkMinigame1Answer(selectedCat) {
        const q = gameState.questions[gameState.currentQuestion];
        if (!q) return;

        if (String(selectedCat).toLowerCase() === String(q.category).toLowerCase()) {
            gameState.currentQuestion++;
            renderMinigame1Question();
        } else {
            gameState.errors++;
            alert(`❌ "${q.name}" no va en ${selectedCat}. ¡Inténtalo de nuevo!`);
        }
    }

    function startMinigame2() {
        gameState = {
            key: 'mj2',
            startTime: Date.now(),
            errors: 0,
            currentQuestion: 0,
            questions: buildQuestions(5)
        };

        renderMinigame2Question();
    }

    function renderMinigame2Question() {
        const appContainer = document.getElementById('appContainer');
        if (!appContainer) return;

        if (!gameState.questions || gameState.questions.length === 0) {
            alert('No hay productos disponibles para este juego.');
            return;
        }

        if (gameState.currentQuestion >= gameState.questions.length) {
            finishMinigame('mj2', 'Corta el Billete');
            return;
        }

        const q = gameState.questions[gameState.currentQuestion];
        const targetPrice = Number(q.price) || 1000;
        const moneyOptions = getDatabaseMoney(targetPrice);

        const html = `
        <div class="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex items-center justify-center">
            <div class="max-w-2xl w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/60 shadow-2xl space-y-6 text-center select-none">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-slate-800 pb-4">
                    <div class="text-left">
                        <span class="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full uppercase border border-emerald-500/30">
                            OA07 MINEDUC: Billetes
                        </span>
                        <h3 class="text-xs font-black text-slate-300 mt-1">Elige el billete o moneda correcto.</h3>
                    </div>
                    <span class="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                        Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}
                    </span>
                </div>

                <div class="py-4 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
                    <div class="w-44 h-44 bg-white p-4 rounded-3xl border-4 border-emerald-500/40 shadow-xl flex items-center justify-center overflow-hidden">
                        ${renderProductVisual(q)}
                    </div>
                    <span class="text-lg font-black text-white uppercase">${escapeHtml(q.name)}</span>

                    <div class="bg-amber-400 text-slate-950 px-6 py-2 rounded-2xl font-black text-xl border-2 border-amber-300 shadow-lg flex items-center gap-2">
                        <span>🏷️ PRECIO:</span>
                        <span>$${targetPrice.toLocaleString('es-CL')} CLP</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    ${moneyOptions.map(m => `
                        <button onclick="checkGenericAnswer(${Number(m.value) || 0}, ${targetPrice}, renderMinigame2Question)"
                                class="p-3 bg-slate-800 hover:bg-slate-700 border-emerald-400 text-white font-black rounded-2xl border-2 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                            ${m.img ? `<img src="${escapeHtml(m.img)}" class="h-16 w-auto object-contain rounded-lg" />` : `<span class="text-3xl">${m.icon || '💵'}</span>`}
                            <span class="font-black text-amber-300 text-base">${escapeHtml(m.label)}</span>
                        </button>
                    `).join('')}
                </div>

                <button onclick="renderMinigamesArcadeView()" class="mt-4 text-xs font-bold text-slate-500 underline block mx-auto">✕ Salir</button>
            </div>
        </div>`;

        appContainer.innerHTML = html;
    }

    function startMinigame3() {
        gameState = {
            key: 'mj3',
            startTime: Date.now(),
            errors: 0,
            currentQuestion: 0,
            questions: buildQuestions(5)
        };

        renderMinigame3Question();
    }

    function renderMinigame3Question() {
        const appContainer = document.getElementById('appContainer');
        if (!appContainer) return;

        if (!gameState.questions || gameState.questions.length === 0) {
            alert('No hay productos disponibles para este juego.');
            return;
        }

        if (gameState.currentQuestion >= gameState.questions.length) {
            finishMinigame('mj3', 'Palabras en Góndola');
            return;
        }

        const q = gameState.questions[gameState.currentQuestion];
        const correctName = q.name;
        const allProducts = getDatabaseProducts();
        const otherNames = allProducts.filter(p => p.name !== correctName).map(p => p.name);
        const options = [correctName, ...otherNames.slice(0, 3)].sort(() => 0.5 - Math.random());

        const html = `
        <div class="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex items-center justify-center">
            <div class="max-w-2xl w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/60 shadow-2xl space-y-6 text-center select-none">
                <div class="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span class="text-[10px] font-black text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full uppercase border border-amber-500/30">
                        OA02 MINEDUC: Lectura
                    </span>
                    <span class="text-xs font-black text-amber-400">Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}</span>
                </div>

                <div class="py-4 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                    <div class="w-44 h-44 bg-white p-4 rounded-3xl border-4 border-amber-500/40 shadow-xl flex items-center justify-center overflow-hidden">
                        ${renderProductVisual(q)}
                    </div>
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest">¿CÓMO SE LLAMA ESTE PRODUCTO?</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${options.map(name => `
                        <button onclick="checkGenericAnswer('${escapeHtml(name)}', '${escapeHtml(correctName)}', renderMinigame3Question)"
                                class="h-14 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl shadow-lg border border-amber-400 text-sm flex items-center justify-center gap-2">
                            <span>🏷️</span> <span>${escapeHtml(name)}</span>
                        </button>
                    `).join('')}
                </div>

                <button onclick="renderMinigamesArcadeView()" class="mt-4 text-xs font-bold text-slate-500 underline block mx-auto">✕ Salir</button>
            </div>
        </div>`;

        appContainer.innerHTML = html;
    }

    function startMinigame4() {
        gameState = {
            key: 'mj4',
            startTime: Date.now(),
            errors: 0,
            currentQuestion: 0,
            questions: buildQuestions(4)
        };

        renderMinigame4Question();
    }

    function renderMinigame4Question() {
        const appContainer = document.getElementById('appContainer');
        if (!appContainer) return;

        if (!gameState.questions || gameState.questions.length === 0) {
            alert('No hay productos disponibles para este juego.');
            return;
        }

        if (gameState.currentQuestion >= gameState.questions.length) {
            finishMinigame('mj4', '*


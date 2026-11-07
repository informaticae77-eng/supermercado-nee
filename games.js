/* ==========================================================================
   MÓDULO INDEPENDIENTE: ARCADE DE MINIJUEGOS NEE (MINEDUC + PRODUCTOS REALES)
   Estructura: 5 Niveles | 5 Minijuegos por Nivel | 1 Jefe Final por Nivel
   ========================================================================== */

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1],
    bossDefeated: {},
    gameMetrics: []
};

function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_arcade_progress_v4');
    if (saved) {
        try { 
            studentMinigamesProgress = JSON.parse(saved); 
        } catch(e) {
            console.error("Error al cargar progreso:", e);
        }
    }
}

function saveMinigamesProgress() {
    localStorage.setItem('nee_arcade_progress_v4', JSON.stringify(studentMinigamesProgress));
}

// --------------------------------------------------------------------------
// PUENTES DE CONEXIÓN CON APP.JS
// --------------------------------------------------------------------------
window.openMemoriseModal = function() { renderMinigamesArcadeView(); };
window.openMinigamesModal = function() { renderMinigamesArcadeView(); };
window.openMemorisModal = function() { renderMinigamesArcadeView(); };

function exitArcadeToDashboard() {
    if (typeof renderApp === 'function') {
        renderApp();
    } else {
        window.location.reload();
    }
}

// --------------------------------------------------------------------------
// EXTRACCIÓN AVANZADA DE PRODUCTOS DEL SUPERMERCADO Y CARRO
// --------------------------------------------------------------------------
function getDatabaseProducts() {
    let rawList = [];

    // Busca productos en todas las ubicaciones posibles de app.js
    if (window.APP_STATE && Array.isArray(window.APP_STATE.products) && window.APP_STATE.products.length > 0) {
        rawList = window.APP_STATE.products;
    } else if (window.products && Array.isArray(window.products) && window.products.length > 0) {
        rawList = window.products;
    } else if (window.APP_DATA && Array.isArray(window.APP_DATA.products) && window.APP_DATA.products.length > 0) {
        rawList = window.APP_DATA.products;
    } else if (window.currentStore && Array.isArray(window.currentStore.products)) {
        rawList = window.currentStore.products;
    }

    const validProducts = [];

    if (rawList && rawList.length > 0) {
        rawList.forEach(item => {
            if (!item) return;
            let name = item.name || item.nombre || item.titulo;
            let category = item.category || item.categoria || item.seccion || 'Lácteos';
            let photo = item.photoUrl || item.photo || item.image || item.img || item.imagen || item.foto;
            let price = item.price || item.precio || 1000;

            if (name) {
                let cleanName = name.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26BF}]/gu, '').trim();
                validProducts.push({ 
                    name: cleanName || name, 
                    category: category.trim(), 
                    photoUrl: photo || 'https://via.placeholder.com/150?text=Producto',
                    price: parseInt(price)
                });
            }
        });
    }

    // Si por algún motivo la tienda no ha cargado productos en memoria, genera catálogo de respaldo del supermercado
    if (validProducts.length === 0) {
        return [
            { name: "Leche Entera 1L", category: "Lácteos", photoUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300", price: 1050 },
            { name: "Manzana Red", category: "Frutas y Verduras", photoUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300", price: 600 },
            { name: "Pan Marraqueta 1Kg", category: "Panadería", photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", price: 1800 },
            { name: "Detergente Multiuso", category: "Aseo", photoUrl: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300", price: 3500 },
            { name: "Jugo de Naranja 1L", category: "Bebidas", photoUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300", price: 1200 }
        ];
    }

    return validProducts;
}

// --------------------------------------------------------------------------
// VISTA PRINCIPAL DEL ARCADE GAMER (RESPONSIVE)
// --------------------------------------------------------------------------
function renderMinigamesArcadeView() {
    loadMinigamesProgress();

    const mainContainer = document.getElementById('appContainer');
    if (!mainContainer) return;

    const currentLvl = studentMinigamesProgress.currentLevel || 1;
    const completedInCurrentLvl = studentMinigamesProgress.completedGames[`level${currentLvl}`] || [];
    const isBossUnlocked = completedInCurrentLvl.length >= 5;

    const levelsConfig = [
        { id: 1, title: "Comprador Principiante", icon: "🛒", border: "border-cyan-500", glow: "shadow-cyan-500/20" },
        { id: 2, title: "Explorador de Góndolas", icon: "🔍", border: "border-emerald-500", glow: "shadow-emerald-500/20" },
        { id: 3, title: "As del Vuelto y Cajas", icon: "💵", border: "border-amber-500", glow: "shadow-amber-500/20" },
        { id: 4, title: "Planificador Experto", icon: "📋", border: "border-purple-500", glow: "shadow-purple-500/20" },
        { id: 5, title: "Maestro del Supermercado", icon: "👑", border: "border-rose-500", glow: "shadow-rose-500/20" }
    ];

    const currentLevelInfo = levelsConfig.find(l => l.id === currentLvl) || levelsConfig[0];

    const html = `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 font-sans select-none pb-20">
        
        <!-- ENCABEZADO -->
        <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/90 p-4 sm:p-6 rounded-3xl border-2 border-indigo-500/40 shadow-2xl backdrop-blur-xl">
            <div class="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
                <button onclick="exitArcadeToDashboard()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 shadow-lg border border-indigo-400">
                    <span>⬅</span> <span>Volver a la Tienda</span>
                </button>
                <div>
                    <span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest block w-fit">
                        Currículo Mineduc NEE
                    </span>
                    <h1 class="text-xl sm:text-2xl font-black text-white tracking-wide mt-0.5">CENTRO DE DESAFÍOS</h1>
                </div>
            </div>

            <!-- NIVELES -->
            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                ${levelsConfig.map(lvl => {
                    const isUnlocked = studentMinigamesProgress.unlockedLevels.includes(lvl.id);
                    const isActive = lvl.id === currentLvl;
                    return `
                    <button onclick="${isUnlocked ? `switchLevel(${lvl.id})` : ''}" 
                            class="px-3.5 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                                isActive 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg scale-105' 
                                    : isUnlocked 
                                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border-slate-700' 
                                        : 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
                            }">
                        <span class="text-base">${lvl.icon}</span>
                        <span>Nivel ${lvl.id}</span>
                        ${!isUnlocked ? '<span class="text-[10px]">🔒</span>' : ''}
                    </button>`;
                }).join('')}
            </div>
        </header>

        <!-- BANNER DE STAGE -->
        <section class="max-w-7xl mx-auto mt-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border-2 ${currentLevelInfo.border} shadow-2xl ${currentLevelInfo.glow} flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="space-y-2 text-center md:text-left">
                <span class="bg-black/60 text-amber-400 border border-amber-500/40 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                    ⚡ Stage ${currentLvl} de 5
                </span>
                <h2 class="text-2xl sm:text-4xl font-black text-white uppercase">${currentLevelInfo.title} ${currentLevelInfo.icon}</h2>
                <p class="text-xs sm:text-sm font-bold text-slate-300 max-w-xl">
                    Utiliza los productos del supermercado y tu carro de compras para superar los desafíos pedagógicos Mineduc.
                </p>
            </div>
            <div class="bg-slate-950/80 p-5 rounded-2xl text-center border border-slate-700 min-w-[170px] w-full md:w-auto">
                <span class="text-[10px] font-black text-indigo-400 block uppercase tracking-widest">DESAFÍOS RESUELTOS</span>
                <span class="text-3xl sm:text-4xl font-black text-amber-400 mt-1 block">${completedInCurrentLvl.length} / 5</span>
            </div>
        </section>

        <!-- PARRILLA DE 5 JUEGOS Y BOSS EXAM -->
        <main class="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            ${renderGameCard(currentLvl, 1, "🍎 El Estante Correcto", "OA04 Mineduc: Categorizar semánticamente productos según su góndola.", "mj1", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 2, "💵 Corta el Billete", "OA07 Mineduc: Reconocer y valorar monedas y billetes CLP.", "mj2", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 3, "🔤 Palabras en Góndola", "OA02 Mineduc: Conciencia fonológica y lectura de etiquetas.", "mj3", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 4, "🧮 Calculadora del Canasto", "OA09 Mineduc: Adición simple y estimación de precios del carro.", "mj4", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 5, "📋 La Lista de Compras", "OA12 Mineduc: Memoria operacional y búsqueda activa.", "mj5", completedInCurrentLvl)}

            <!-- TARJETA BOSS -->
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
                        OA15 Mineduc: Evaluación integrada para desbloquear el Nivel ${currentLvl < 5 ? currentLvl + 1 : 5}.
                    </p>
                </div>
                <button ${isBossUnlocked ? `onclick="startBossExam(${currentLvl})"` : 'disabled'} 
                        class="w-full py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider ${
                            isBossUnlocked 
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
        <button ${isUnlocked ? `onclick="startMinigame1()"` : 'disabled'} 
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
// LÓGICA DEL MINIJUEGO 1: EL ESTANTE CORRECTO (OA04 MINEDUC)
// --------------------------------------------------------------------------
let mj1State = { startTime: null, errors: 0, currentQuestion: 0, questions: [] };

function startMinigame1() {
    mj1State.startTime = Date.now();
    mj1State.errors = 0;
    mj1State.currentQuestion = 0;
    
    const catalog = getDatabaseProducts();
    mj1State.questions = [...catalog].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, catalog.length));
    
    renderMinigame1Question();
}

function renderMinigame1Question() {
    const q = mj1State.questions[mj1State.currentQuestion];
    if (!q) return finishMinigame1();

    const allProducts = getDatabaseProducts();
    const categoriesSet = new Set(allProducts.map(p => p.category));
    ['Lácteos', 'Frutas y Verduras', 'Panadería', 'Aseo', 'Bebidas'].forEach(c => categoriesSet.add(c));
    const availableCategories = Array.from(categoriesSet);

    let options = [q.category];
    const otherCats = availableCategories.filter(c => c !== q.category).sort(() => 0.5 - Math.random());
    options.push(...otherCats.slice(0, 3));
    options.sort(() => 0.5 - Math.random());

    const html = `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex items-center justify-center">
        <div class="max-w-2xl w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/60 shadow-2xl space-y-6 text-center select-none">
            
            <!-- INFORMACIÓN PEDAGÓGICA Y OA MINEDUC -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-slate-800 pb-4">
                <div class="text-left">
                    <span class="text-[10px] font-black text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
                        OA04 MINEDUC: Categorización Semántica
                    </span>
                    <h3 class="text-xs font-black text-slate-300 mt-1">Objetivo: Clasificar adecuadamente productos reales en sus secciones correspondientes.</h3>
                </div>
                <span class="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 whitespace-nowrap">
                    Pregunta ${mj1State.currentQuestion + 1} de ${mj1State.questions.length}
                </span>
            </div>

            <!-- CONTENEDOR CON LA IMAGEN Y NOMBRE REAL DEL PRODUCTO -->
            <div class="py-4 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-inner">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">¿EN QUÉ ESTANTE O SECCIÓN VA ESTE PRODUCTO?</h4>
                
                <div class="w-48 h-48 sm:w-56 sm:h-56 bg-white p-4 rounded-3xl border-4 border-indigo-500/40 shadow-xl flex items-center justify-center overflow-hidden">
                    <img src="${q.photoUrl}" alt="${q.name}" class="max-h-full max-w-full object-contain" onerror="this.src='https://via.placeholder.com/200?text=Producto'" />
                </div>

                <div class="space-y-1">
                    <span class="text-xl sm:text-2xl font-black text-white uppercase px-4 tracking-wide block">${q.name}</span>
                    <span class="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20 inline-block">
                        Precio en Supermercado: $${q.price.toLocaleString('es-CL')} CLP
                    </span>
                </div>
            </div>

            <!-- BOTONES DE RESPUESTA EN ALTO CONTRASTE NEÓN -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                ${options.map(catName => `
                    <button onclick="checkMinigame1Answer('${catName.replace(/'/g, "\\'")}')" 
                            class="w-full h-14 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-2xl shadow-lg flex items-center justify-center px-6 text-sm tracking-wide border border-indigo-400 transition-all">
                        ${catName}
                    </button>
                `).join('')}
            </div>
            
            <button onclick="renderMinigamesArcadeView()" class="mt-4 text-xs font-bold text-slate-500 hover:text-slate-300 underline block mx-auto">
                ✕ Salir al Centro de Desafíos
            </button>
        </div>
    </div>
    `;

    const container = document.getElementById('appContainer');
    if (container) container.innerHTML = html;
}

function checkMinigame1Answer(selectedCat) {
    const q = mj1State.questions[mj1State.currentQuestion];
    if (selectedCat.toLowerCase() === q.category.toLowerCase()) {
        mj1State.currentQuestion++;
        renderMinigame1Question();
    } else {
        mj1State.errors++;
        alert(`❌ ¡Ups! "${q.name}" no va en el estante de ${selectedCat}. ¡Inténtalo de nuevo!`);
    }
}

function finishMinigame1() {
    const timeSpent = Math.round((Date.now() - mj1State.startTime) / 1000);
    const lvl = studentMinigamesProgress.currentLevel || 1;

    if (!studentMinigamesProgress.completedGames[`level${lvl}`]) {
        studentMinigamesProgress.completedGames[`level${lvl}`] = [];
    }

    if (!studentMinigamesProgress.completedGames[`level${lvl}`].includes('mj1')) {
        studentMinigamesProgress.completedGames[`level${lvl}`].push('mj1');
    }

    saveMinigamesProgress();
    alert(`🎉 ¡Excelente Trabajo!\nCompletaste "El Estante Correcto"\n⏱️ Tiempo: ${timeSpent}s | ❌ Errores: ${mj1State.errors}\n⭐ Has avanzado en el OA04 del Mineduc.`);
    renderMinigamesArcadeView();
}

function switchLevel(levelId) {
    studentMinigamesProgress.currentLevel = levelId;
    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

function startBossExam(level) {
    alert(`👑 ¡Felicitaciones! Has completado el Examen Integral del Jefe Final para el Nivel ${level}.`);

    const nextLevel = level + 1;
    if (nextLevel <= 5 && !studentMinigamesProgress.unlockedLevels.includes(nextLevel)) {
        studentMinigamesProgress.unlockedLevels.push(nextLevel);
        studentMinigamesProgress.currentLevel = nextLevel;
    }

    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

/* ==========================================================================
   MINIJUEGOS CURRICULARES MINEDUC - SUITE OFICIAL (games.js)
   ========================================================================== */

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: [],
    bossUnlocked: false,
    gameMetrics: []
};

function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_minigames_progress');
    if (saved) {
        try { studentMinigamesProgress = JSON.parse(saved); } catch(e){}
    }
}

function saveMinigamesProgress() {
    localStorage.setItem('nee_minigames_progress', JSON.stringify(studentMinigamesProgress));
}

/* --------------------------------------------------------------------------
   REEMPLAZO DIRECTO DE LA FUNCIÓN DEL MEMORICE ANTIGUO DE APP.JS
   -------------------------------------------------------------------------- */
window.openMemoriseModal = function() {
    renderMinigamesArcadeView();
};

window.openMemorisModal = function() {
    renderMinigamesArcadeView();
};

/* --------------------------------------------------------------------------
   1. VISTA: ARCADE DE MINIJUEGOS (OPTIMIZADO PARA TABLET)
   -------------------------------------------------------------------------- */
function renderMinigamesArcadeView() {
    loadMinigamesProgress();
    const level = studentMinigamesProgress.currentLevel;
    const completed = studentMinigamesProgress.completedGames;
    const isBossUnlocked = completed.length >= 5;

    const html = `
    <div class="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 select-none">
        <!-- Navegación -->
        <div class="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
            <button onclick="goHome()" class="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black px-6 py-3 rounded-2xl text-sm transition-transform flex items-center gap-2">
                <span class="text-xl">⬅</span> Volver al Panel
            </button>
            <span class="font-black text-slate-800 text-base sm:text-lg">🎮 Centro de Desafíos Mineduc</span>
        </div>

        <!-- Banner Principal -->
        <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border-4 border-purple-300">
            <div>
                <span class="bg-black/30 text-amber-300 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    📍 Currículo Nacional Mineduc
                </span>
                <h2 class="text-3xl sm:text-4xl font-black tracking-tight">Nivel ${level}: Comprador Principiante 🛒</h2>
                <p class="text-sm font-bold text-purple-100 mt-1">Completa los 5 desafíos para desbloquear el Examen del Jefe Final.</p>
            </div>
            <div class="bg-white/20 backdrop-blur-md p-4 rounded-3xl text-center border-2 border-white/40 min-w-[130px]">
                <span class="text-xs font-black text-purple-200 block uppercase tracking-wider">Progreso</span>
                <span class="text-3xl font-black text-white">${completed.length} / 5</span>
            </div>
        </div>

        <!-- Grid de Minijuegos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- MJ1 -->
            <div class="bg-white rounded-3xl p-6 border-4 ${completed.includes('mj1') ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-5xl">🍎</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full ${completed.includes('mj1') ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj1') ? '✓ Completado' : 'MJ 1'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-lg">1. El Estante Correcto</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Categorización semántica con productos del catálogo real.</p>
                </div>
                <button onclick="startMinigame1()" class="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black py-4 rounded-2xl shadow-md text-sm transition-all">
                    ${completed.includes('mj1') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!'}
                </button>
            </div>

            <!-- MJ2 -->
            <div class="bg-white rounded-3xl p-6 border-4 ${completed.includes('mj2') ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-5xl">💵</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full ${completed.includes('mj2') ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj2') ? '✓ Completado' : 'MJ 2'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-lg">2. Corta el Billete</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Valorización y reconocimiento de billetes y monedas CLP.</p>
                </div>
                <button ${completed.includes('mj1') ? 'onclick="startMinigame2()"' : 'disabled'} class="w-full ${completed.includes('mj1') ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-4 rounded-2xl text-sm transition-all">
                    ${completed.includes('mj1') ? (completed.includes('mj2') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- MJ3 -->
            <div class="bg-white rounded-3xl p-6 border-4 ${completed.includes('mj3') ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-5xl">🔤</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full ${completed.includes('mj3') ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj3') ? '✓ Completado' : 'MJ 3'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-lg">3. Palabras en la Góndola</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Conciencia fonológica y lectura inicial.</p>
                </div>
                <button ${completed.includes('mj2') ? 'onclick="startMinigame3()"' : 'disabled'} class="w-full ${completed.includes('mj2') ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-4 rounded-2xl text-sm transition-all">
                    ${completed.includes('mj2') ? (completed.includes('mj3') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- MJ4 -->
            <div class="bg-white rounded-3xl p-6 border-4 ${completed.includes('mj4') ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-5xl">🧮</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full ${completed.includes('mj4') ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj4') ? '✓ Completado' : 'MJ 4'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-lg">4. Calculadora del Canasto</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Adición simple y estimación de montos.</p>
                </div>
                <button ${completed.includes('mj3') ? 'onclick="startMinigame4()"' : 'disabled'} class="w-full ${completed.includes('mj3') ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-4 rounded-2xl text-sm transition-all">
                    ${completed.includes('mj3') ? (completed.includes('mj4') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- MJ5 -->
            <div class="bg-white rounded-3xl p-6 border-4 ${completed.includes('mj5') ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-5xl">📋</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full ${completed.includes('mj5') ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj5') ? '✓ Completado' : 'MJ 5'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-lg">5. La Lista de Compras</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Memoria operacional y selección guiada.</p>
                </div>
                <button ${completed.includes('mj4') ? 'onclick="startMinigame5()"' : 'disabled'} class="w-full ${completed.includes('mj4') ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-4 rounded-2xl text-sm transition-all">
                    ${completed.includes('mj4') ? (completed.includes('mj5') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- JEFE FINAL -->
            <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 border-4 border-amber-300 text-white shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div class="flex justify-between items-start z-10">
                    <span class="text-5xl animate-bounce">👑</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full bg-black/40 text-amber-200 border border-amber-300">
                        EXAMEN FINAL
                    </span>
                </div>
                <div class="z-10">
                    <h4 class="font-black text-xl">🛡️ Desafío del Cajero</h4>
                    <p class="text-xs font-bold text-amber-100 mt-1">Evaluación integral para ascender al Nivel 2.</p>
                </div>
                <button ${isBossUnlocked ? 'onclick="startBossExam()"' : 'disabled'} class="w-full ${isBossUnlocked ? 'bg-slate-900 hover:bg-black text-amber-400 border-2 border-amber-400 active:scale-95' : 'bg-slate-800/80 text-amber-200/50 cursor-not-allowed'} font-black py-4 rounded-2xl text-sm z-10 transition-all">
                    ${isBossUnlocked ? '🔥 ¡ENFRENTAR JEFE FINAL!' : '🔒 Completa los 5 juegos'}
                </button>
            </div>
        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
}

/* --------------------------------------------------------------------------
   2. EXTRACCIÓN DIRECTA DESDE APP_STATE.products (ESTRUCTURA DE TU APP.JS)
   -------------------------------------------------------------------------- */
let mj1State = {
    startTime: null,
    errors: 0,
    currentQuestion: 0,
    questions: []
};

const CATEGORY_THEMES = {
    'Lácteos': { icon: '🥛', color: 'from-blue-500 to-indigo-600' },
    'Frutas y Verduras': { icon: '🍎', color: 'from-emerald-500 to-green-600' },
    'Panadería': { icon: '🍞', color: 'from-amber-500 to-orange-600' },
    'Aseo': { icon: '🧹', color: 'from-cyan-500 to-teal-600' },
    'Limpieza del Hogar': { icon: '🧹', color: 'from-cyan-500 to-teal-600' },
    'Vestuario': { icon: '👕', color: 'from-purple-500 to-indigo-600' },
    'Menaje Hogar': { icon: '🍽️', color: 'from-rose-500 to-pink-600' },
    'Electrodomésticos': { icon: '🔌', color: 'from-slate-600 to-slate-800' },
    'Juguetes y Juegos': { icon: '🧸', color: 'from-yellow-400 to-amber-600' },
    'Bebé y Niño': { icon: '👶', color: 'from-sky-400 to-blue-500' },
    'Mascotas': { icon: '🐶', color: 'from-amber-600 to-yellow-700' }
};

function getAppCatalogProducts() {
    let rawProducts = [];

    // Lee directamente desde la estructura oficial de tu app: APP_STATE.products
    if (window.APP_STATE && Array.isArray(window.APP_STATE.products) && window.APP_STATE.products.length > 0) {
        rawProducts = window.APP_STATE.products;
    } else if (window.APP_DATA && Array.isArray(window.APP_DATA.products)) {
        rawProducts = window.APP_DATA.products;
    }

    // Si la memoria global no se ha iniciado, escanea el localStorage de la app
    if (rawProducts.length === 0) {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            try {
                const parsed = JSON.parse(localStorage.getItem(k));
                if (parsed && parsed.products && Array.isArray(parsed.products)) {
                    rawProducts = parsed.products;
                    break;
                } else if (Array.isArray(parsed) && parsed[0] && (parsed[0].name || parsed[0].nombre)) {
                    rawProducts = parsed;
                    break;
                }
            } catch(e){}
        }
    }

    // Mapeo exacto basado en la estructura de tu app (name, category, photoUrl)
    const catalog = [];
    if (rawProducts && rawProducts.length > 0) {
        rawProducts.forEach(item => {
            if (!item) return;

            let name = item.name || item.nombre;
            let category = item.category || item.categoria || 'Lácteos';
            
            // Extracción exacta según tu app: photoUrl || photo || image
            let image = item.photoUrl || item.photo || item.image || item.img || item.imagen;

            if (name && image) {
                let cleanName = name.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
                catalog.push({
                    name: cleanName || name,
                    category: category.trim(),
                    image: image
                });
            }
        });
    }

    return catalog;
}

function startMinigame1() {
    mj1State.startTime = Date.now();
    mj1State.errors = 0;
    mj1State.currentQuestion = 0;
    
    let catalog = getAppCatalogProducts();

    if (catalog.length === 0) {
        alert("⚠️ No se han encontrado productos. Abre una tienda o refresca la página.");
        return;
    }

    // Baraja los 27 productos reales cargados en tu app
    mj1State.questions = [...catalog].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    renderMinigame1Question();
}

function renderMinigame1Question() {
    const q = mj1State.questions[mj1State.currentQuestion];
    if (!q) return finishMinigame1();

    const catalog = getAppCatalogProducts();
    const availableCategories = Array.from(new Set(catalog.map(item => item.category)));

    if (!availableCategories.includes('Lácteos')) availableCategories.push('Lácteos');
    if (!availableCategories.includes('Frutas y Verduras')) availableCategories.push('Frutas y Verduras');
    if (!availableCategories.includes('Panadería')) availableCategories.push('Panadería');
    if (!availableCategories.includes('Limpieza del Hogar')) availableCategories.push('Limpieza del Hogar');

    let options = [q.category];
    const otherCats = availableCategories.filter(c => c !== q.category).sort(() => 0.5 - Math.random());
    options.push(...otherCats.slice(0, 3));
    options.sort(() => 0.5 - Math.random());

    const html = `
    <div class="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-2xl space-y-6 text-center select-none">
        
        <div class="flex justify-between items-center border-b pb-4">
            <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                MJ1: El Estante Correcto
            </span>
            <span class="text-sm font-black text-slate-500">
                Pregunta ${mj1State.currentQuestion + 1} de ${mj1State.questions.length}
            </span>
        </div>

        <div class="py-6 bg-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center space-y-4 shadow-inner">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">¿EN QUÉ ESTANTE VA ESTE PRODUCTO?</h3>
            
            <!-- FOTO REAL EXTRAÍDA DE APP_STATE.products.photoUrl -->
            <div class="w-56 h-56 sm:w-64 sm:h-64 bg-white p-4 rounded-3xl border-4 border-indigo-200 shadow-lg flex items-center justify-center overflow-hidden">
                <img src="${q.image}" 
                     alt="${q.name}" 
                     class="max-h-full max-w-full object-contain transition-all duration-300 transform hover:scale-105" />
            </div>

            <!-- TÍTULO REAL DEL PRODUCTO -->
            <span class="text-xl sm:text-2xl font-black text-slate-800 uppercase px-4 leading-snug">${q.name}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            ${options.map(catName => {
                const theme = CATEGORY_THEMES[catName] || { icon: '📦', color: 'from-indigo-500 to-purple-600' };
                return `
                <button onclick="checkMinigame1Answer('${catName.replace(/'/g, "\\'")}')" 
                        class="w-full h-20 bg-gradient-to-r ${theme.color} hover:brightness-110 active:scale-95 text-white font-black rounded-2xl shadow-lg border-b-4 border-black/20 flex items-center justify-start px-6 gap-4 text-left transition-transform">
                    <span class="text-3xl sm:text-4xl drop-shadow">${theme.icon}</span>
                    <span class="text-base sm:text-lg font-black tracking-wide">${catName}</span>
                </button>
                `;
            }).join('')}
        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
}

function checkMinigame1Answer(selectedCat) {
    const q = mj1State.questions[mj1State.currentQuestion];

    if (selectedCat.toLowerCase() === q.category.toLowerCase()) {
        mj1State.currentQuestion++;
        renderMinigame1Question();
    } else {
        mj1State.errors++;
        alert(`❌ ¡Ups! "${q.name}" no va en ${selectedCat}. ¡Inténtalo de nuevo!`);
    }
}

function finishMinigame1() {
    const timeSpent = Math.round((Date.now() - mj1State.startTime) / 1000);

    studentMinigamesProgress.gameMetrics.push({
        gameId: 'mj1',
        date: new Date().toISOString(),
        errors: mj1State.errors,
        timeSeconds: timeSpent
    });

    if (!studentMinigamesProgress.completedGames.includes('mj1')) {
        studentMinigamesProgress.completedGames.push('mj1');
    }

    if (typeof currentUser !== 'undefined' && currentUser) {
        currentUser.points = (currentUser.points || 0) + 20;
        if (typeof saveLocalData === 'function') saveLocalData();
    }

    saveMinigamesProgress();
    alert(`🎉 ¡Excelente! Completaste "El Estante Correcto"\n⏱️ Tiempo: ${timeSpent}s | ❌ Errores: ${mj1State.errors}\n⭐ ¡Ganaste +20 Puntos!`);
    renderMinigamesArcadeView();
}

/* --------------------------------------------------------------------------
   3. AUTO-REINYECCIÓN CONTINUA DE BOTONES Y TRANSFORMACIÓN DEL MEMORICE
   -------------------------------------------------------------------------- */
function connectArcadeToStudentDashboard() {
    // 1. Reemplaza el texto del botón Memorice si app.js lo vuelve a dibujar
    const memoriceButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText && (b.innerText.includes('MEMORICE') || b.innerText.includes('Memorise')));
    
    memoriceButtons.forEach(btn => {
        btn.setAttribute('onclick', 'renderMinigamesArcadeView()');
        btn.className = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-2 border-purple-300 text-sm active:scale-95 transition-transform flex items-center gap-2 animate-pulse";
        btn.innerHTML = `<span>🎮</span> <span>DESAFÍOS MINEDUC</span>`;
    });

    // 2. Inyectar botón en la barra navegadora superior
    const topBar = document.querySelector('header .flex.items-center') || document.querySelector('.bg-indigo-600 .flex');
    if (topBar && !document.getElementById('topBarArcadeBtn')) {
        const btnHtml = `
            <button id="topBarArcadeBtn" onclick="renderMinigamesArcadeView()" class="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-4 py-2 rounded-2xl shadow border-2 border-amber-200 text-xs active:scale-95 transition-transform flex items-center gap-1.5 ml-2">
                <span>🎮</span> <span>DESAFÍOS</span>
            </button>
        `;
        topBar.insertAdjacentHTML('beforeend', btnHtml);
    }
}

setInterval(connectArcadeToStudentDashboard, 300);

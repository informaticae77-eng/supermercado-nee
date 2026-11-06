/* ==========================================================================
   MINIJUEGOS CURRICULARES MINEDUC - INTERFAZ TABLET & CATÁLOGO REAL (games.js)
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
   1. VISTA: ARCADE DE MINIJUEGOS (OPTIMIZADO PARA TABLETS)
   -------------------------------------------------------------------------- */
function renderMinigamesArcadeView() {
    loadMinigamesProgress();
    const level = studentMinigamesProgress.currentLevel;
    const completed = studentMinigamesProgress.completedGames;
    const isBossUnlocked = completed.length >= 5;

    const html = `
    <div class="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 select-none">
        <!-- Navegación y Botón Volver -->
        <div class="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
            <button onclick="goHome()" class="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black px-6 py-3 rounded-2xl text-sm transition-transform flex items-center gap-2">
                <span class="text-xl">⬅</span> Volver al Panel
            </button>
            <span class="font-black text-slate-800 text-base sm:text-lg">🎮 Centro de Desafíos Mineduc</span>
        </div>

        <!-- Banner del Nivel -->
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

        <!-- Grid de Minijuegos Adaptativo -->
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
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Categorización semántica con productos e íconos reales del catálogo.</p>
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
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Conciencia fonológica y lectura de etiquetas de productos.</p>
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
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Suma de precios simples y presupuesto.</p>
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
   2. MINIJUEGO 1: EL ESTANTE CORRECTO (PRODUCTOS E ÍCONOS REALES DEL CATÁLOGO)
   -------------------------------------------------------------------------- */
let mj1State = {
    startTime: null,
    errors: 0,
    currentQuestion: 0,
    questions: []
};

// Categorías oficiales con sus íconos para los botones táctiles de respuesta
const APP_CATEGORIES_CONFIG = [
    { id: 'Lácteos', name: 'Lácteos', icon: '🥛', color: 'from-blue-500 to-indigo-600' },
    { id: 'Frutas y Verduras', name: 'Frutas y Verduras', icon: '🍎', color: 'from-emerald-500 to-green-600' },
    { id: 'Panadería', name: 'Panadería', icon: '🍞', color: 'from-amber-500 to-orange-600' },
    { id: 'Aseo', name: 'Aseo', icon: '🧹', color: 'from-cyan-500 to-teal-600' }
];

// Función para obtener productos directamente del catálogo real de app.js
function getCatalogProducts() {
    let rawList = [];

    // Prioridad 1: APP_STATE.products (Estructura real usada por app.js)
    if (window.APP_STATE && Array.isArray(window.APP_STATE.products) && window.APP_STATE.products.length > 0) {
        rawList = window.APP_STATE.products;
    } else if (window.APP_DATA && window.APP_DATA.products && window.APP_DATA.products.length > 0) {
        rawList = window.APP_DATA.products;
    } else if (window.productsCatalog && Array.isArray(window.productsCatalog)) {
        rawList = window.productsCatalog;
    } else if (window.products && Array.isArray(window.products)) {

/* ==========================================================================
   MINIJUEGOS CURRICULARES MINEDUC - ARCADE DIRECTO (games.js)
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
   LANZADOR DIRECTO DE LOS MINIJUEGOS (Garantiza Apertura Directa)
   -------------------------------------------------------------------------- */
function openMinigamesModal() {
    renderMinigamesArcadeView();
    const modal = document.getElementById('minigamesArcadeModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeMinigamesModal() {
    const modal = document.getElementById('minigamesArcadeModal');
    if (modal) {
        modal.classList.add('hidden');
    } else if (typeof goHome === 'function') {
        goHome();
    }
}

/* Compatibilidad directa */
window.openMemoriseModal = function() {
    renderMinigamesArcadeView();
};

window.openMemorisModal = function() {
    renderMinigamesArcadeView();
};

/* --------------------------------------------------------------------------
   1. VISTA PRINCIPAL DEL ARCADE
   -------------------------------------------------------------------------- */
function renderMinigamesArcadeView() {
    loadMinigamesProgress();
    const level = studentMinigamesProgress.currentLevel;
    const completed = studentMinigamesProgress.completedGames;
    const isBossUnlocked = completed.length >= 5;

    const html = `
    <div class="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 select-none">
        <!-- Barra de navegación e interacción -->
        <div class="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
            <button onclick="typeof goHome === 'function' ? goHome() : window.location.reload()" class="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black px-6 py-3 rounded-2xl text-sm transition-transform flex items-center gap-2">
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

        <!-- Grid de Minijuegos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- MJ 1 -->
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

            <!-- MJ 2 -->
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

            <!-- MJ 3 -->
            <div class="bg-white rounded-3xl p-6 border-4 ${completed.includes('mj3') ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-5xl">🔤</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full ${completed.includes('mj3') ? 'bg-emerald-20

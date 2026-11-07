/* ==========================================================================
   MÓDULO INDEPENDIENTE: ARCADE DE MINIJUEGOS NEE (ESTILO GAMER RESPONSIVE)
   Estructura: 5 Niveles | 5 Minijuegos por Nivel | 1 Jefe Final por Nivel
   ========================================================================== */

// Estado global de progreso del estudiante
let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1],
    bossDefeated: {},
    gameMetrics: []
};

function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_arcade_progress_v2');
    if (saved) {
        try { 
            studentMinigamesProgress = JSON.parse(saved); 
        } catch(e) {
            console.error("Error al cargar progreso:", e);
        }
    }
}

function saveMinigamesProgress() {
    localStorage.setItem('nee_arcade_progress_v2', JSON.stringify(studentMinigamesProgress));
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
// VISTA VIBRANTE GAMER (COMPATIBLE CON MÓVILES Y TABLETS)
// --------------------------------------------------------------------------
function renderMinigamesArcadeView() {
    loadMinigamesProgress();

    const mainContainer = document.getElementById('appContainer');
    if (!mainContainer) return;

    const currentLvl = studentMinigamesProgress.currentLevel || 1;
    const completedInCurrentLvl = studentMinigamesProgress.completedGames[`level${currentLvl}`] || [];
    const isBossUnlocked = completedInCurrentLvl.length >= 5;

    const levelsConfig = [
        { id: 1, title: "Comprador Principiante", icon: "🛒", badge: "NIVEL 1", border: "border-cyan-500", glow: "shadow-cyan-500/20" },
        { id: 2, title: "Explorador de Góndolas", icon: "🔍", badge: "NIVEL 2", border: "border-emerald-500", glow: "shadow-emerald-500/20" },
        { id: 3, title: "As del Vuelto y Cajas", icon: "💵", badge: "NIVEL 3", border: "border-amber-500", glow: "shadow-amber-500/20" },
        { id: 4, title: "Planificador Experto", icon: "📋", badge: "NIVEL 4", border: "border-purple-500", glow: "shadow-purple-500/20" },
        { id: 5, title: "Maestro del Supermercado", icon: "👑", badge: "NIVEL 5", border: "border-rose-500", glow: "shadow-rose-500/20" }
    ];

    const currentLevelInfo = levelsConfig.find(l => l.id === currentLvl) || levelsConfig[0];

    const html = `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 font-sans select-none pb-20">
        
        <!-- ENCABEZADO GAMER RESPONSIVE -->
        <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/90 p-4 sm:p-6 rounded-3xl border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <div class="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
                <button onclick="exitArcadeToDashboard()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400">
                    <span>⬅</span> <span>Volver a la Tienda</span>
                </button>
                <div>
                    <span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest block w-fit">
                        Arcade NEE Mineduc
                    </span>
                    <h1 class="text-xl sm:text-2xl font-black text-white tracking-wide mt-0.5">CENTRO DE DESAFÍOS</h1>
                </div>
            </div>

            <!-- BOTONES DE NIVELES SCROLLABLE EN MÓVIL -->
            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                ${levelsConfig.map(lvl => {
                    const isUnlocked = studentMinigamesProgress.unlockedLevels.includes(lvl.id);
                    const isActive = lvl.id === currentLvl;
                    return `
                    <button onclick="${isUnlocked ? `switchLevel(${lvl.id})` : ''}" 
                            class="px-3.5 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                                isActive 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/50 scale-105' 
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

        <!-- BANNER DEL NIVEL ACTUAL EN GAMER NEON -->
        <section class="max-w-7xl mx-auto mt-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border-2 ${currentLevelInfo.border} shadow-2xl ${currentLevelInfo.glow} flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div class="space-y-2 text-center md:text-left z-10">
                <span class="bg-black/60 text-amber-400 border border-amber-500/40 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                    ⚡ Stage ${currentLvl} de 5
                </span>
                <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">${currentLevelInfo.title} ${currentLevelInfo.icon}</h2>
                <p class="text-xs sm:text-sm font-bold text-slate-300 max-w-xl leading-relaxed">
                    Completa los 5 desafíos pedagógicos para desbloquear la batalla final del Boss y avanzar al siguiente nivel.
                </p>
            </div>

            <div class="bg-slate-950/80 p-5 rounded-2xl text-center border border-slate-700 min-w-[170px] w-full md:w-auto z-10">
                <span class="text-[10px] font-black text-indigo-400 block uppercase tracking-widest">PROGRESO DE ETAPA</span>
                <span class="text-3xl sm:text-4xl font-black text-amber-400 mt-1 block">${completedInCurrentLvl.length} / 5</span>
            </div>
        </section>

        <!-- GRID ADAPTABLE A MÓVILES (1 COL), TABLETS (2 COLS) Y COMPUTADORES (3 COLS) -->
        <main class="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            ${renderGameCard(currentLvl, 1, "🍎 El Estante Correcto", "Categorización semántica de productos.", "mj1", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 2, "💵 Corta el Billete", "Reconocimiento y valorización CLP.", "mj2", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 3, "🔤 Palabras en Góndola", "Conciencia fonológica de marcas.", "mj3", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 4, "🧮 Calculadora del Canasto", "Estimación de sumas y compras.", "mj4", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 5, "📋 La Lista de Compras", "Memoria operacional en supermercado.", "mj5", completedInCurrentLvl)}

            <!-- TARJETA DEL JEFE FINAL (BOSS STAGE) -->
            <div class="bg-gradient-to-br from-purple-950 via-slate-900 to-amber-950 rounded-3xl p-6 border-2 border-amber-500/80 shadow-2xl shadow-amber-500/20 flex flex-col justify-between space-y-5 relative overflow-hidden">
                <div class="flex justify-between items-start z-10">
                    <span class="text-4xl sm:text-5xl animate-bounce">👑</span>
                    <span class="text-[10px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 uppercase tracking-widest">
                        BOSS EXAM NIVEL ${currentLvl}
                    </span>
                </div>
                <div class="z-10 space-y-1">
                    <h3 class="font-black text-white text-lg sm:text-xl uppercase">🛡️ Desafío del Cajero Central</h3>
                    <p class="text-xs text-amber-200/80 font-bold leading-relaxed">
                        Evaluación integral de habilidades para subir al Nivel ${currentLvl < 5 ? currentLvl + 1 : 5}.
                    </p>
                </div>
                <button ${isBossUnlocked ? `onclick="startBossExam(${currentLvl})"` : 'disabled'} 
                        class="w-full py-4 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase z-10 transition-all ${
                            isBossUnlocked 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-2 border-amber-300 active:scale-95 shadow-lg shadow-amber-500/40' 
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

// TARJETAS DE MINIJUEGOS CON ESTILO NEÓN ADAPTABLES
function renderGameCard(level, gameNum, title, description, gameKey, completedList) {
    const isCompleted = completedList.includes(gameKey);
    const isUnlocked = gameNum === 1 || completedList.includes(`mj${gameNum - 1}`);

    return `
    <div class="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border-2 ${isCompleted ? 'border-emerald-500/80 shadow-emerald-500/20 bg-emerald-950/10' : 'border-slate-800'} shadow-xl flex flex-col justify-between space-y-4">
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
        <button ${isUnlocked ? `onclick="launchMinigame('${gameKey}', ${level})"` : 'disabled'} 
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

function switchLevel(levelId) {
    studentMinigamesProgress.currentLevel = levelId;
    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

function launchMinigame(gameKey, level) {
    alert(`🎮 Iniciando ${gameKey.toUpperCase()} del Nivel ${level}`);
    
    if (!studentMinigamesProgress.completedGames[`level${level}`]) {
        studentMinigamesProgress.completedGames[`level${level}`] = [];
    }
    
    if (!studentMinigamesProgress.completedGames[`level${level}`].includes(gameKey)) {
        studentMinigamesProgress.completedGames[`level${level}`].push(gameKey);
    }

    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

function startBossExam(level) {
    alert(`👑 ¡Felicidades! Derrotaste al Jefe Final del Nivel ${level}`);

    const nextLevel = level + 1;
    if (nextLevel <= 5 && !studentMinigamesProgress.unlockedLevels.includes(nextLevel)) {
        studentMinigamesProgress.unlockedLevels.push(nextLevel);
        studentMinigamesProgress.currentLevel = nextLevel;
    }

    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

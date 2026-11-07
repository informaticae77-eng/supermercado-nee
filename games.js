/* ==========================================================================
   MÓDULO INDEPENDIENTE: ARCADE DE MINIJUEGOS NEE (MINEDUC)
   Estructura: 5 Niveles | 5 Minijuegos por Nivel | 1 Jefe Final por Nivel
   ========================================================================== */

// Estado global de progreso del estudiante (persistente)
let studentMinigamesProgress = {
    currentLevel: 1, // Niveles del 1 al 5
    completedGames: {}, // Estructura: { level1: ['mj1_1', 'mj1_2', ...], level2: [...] }
    unlockedLevels: [1],
    bossDefeated: {},
    gameMetrics: []
};

// Cargar progreso desde LocalStorage
function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_arcade_progress_v2');
    if (saved) {
        try { 
            studentMinigamesProgress = JSON.parse(saved); 
        } catch(e) {
            console.error("Error al cargar progreso de minijuegos:", e);
        }
    }
}

// Guardar progreso en LocalStorage
function saveMinigamesProgress() {
    localStorage.setItem('nee_arcade_progress_v2', JSON.stringify(studentMinigamesProgress));
}

// --------------------------------------------------------------------------
// PUENTES Y NAVEGACIÓN DE LA VISTA INDEPENDIENTE
// --------------------------------------------------------------------------

// Función invocada por los botones del dashboard (ej: el botón morado/azul)
window.openMinigamesModal = function() { renderMinigamesArcadeView(); };
window.openMemoriseModal = function() { renderMinigamesArcadeView(); };
window.openMemorisModal = function() { renderMinigamesArcadeView(); };

// Volver al Supermercado / Dashboard principal
function exitArcadeToDashboard() {
    if (typeof renderApp === 'function') {
        renderApp(); // Renderiza la vista principal de app.js
    } else {
        window.location.reload();
    }
}

// --------------------------------------------------------------------------
// VISTA PRINCIPAL DEL MÓDULO (PÁGINA COMPLETA DE 5 NIVELES)
// --------------------------------------------------------------------------

function renderMinigamesArcadeView() {
    loadMinigamesProgress();

    const mainContainer = document.getElementById('appContainer');
    if (!mainContainer) return;

    const currentLvl = studentMinigamesProgress.currentLevel || 1;
    const completedInCurrentLvl = studentMinigamesProgress.completedGames[`level${currentLvl}`] || [];
    const isBossUnlocked = completedInCurrentLvl.length >= 5;

    // Configuración de los 5 niveles educativos
    const levelsConfig = [
        { id: 1, title: "Comprador Principiante", icon: "🛒", color: "from-blue-600 to-indigo-600" },
        { id: 2, title: "Explorador de Góndolas", icon: "🔍", color: "from-emerald-600 to-teal-600" },
        { id: 3, title: "As del Vuelto y Cajas", icon: "💵", color: "from-amber-600 to-orange-600" },
        { id: 4, title: "Planificador Experto", icon: "📋", color: "from-purple-600 to-pink-600" },
        { id: 5, title: "Maestro del Supermercado", icon: "👑", color: "from-rose-600 to-red-600" }
    ];

    const currentLevelInfo = levelsConfig.find(l => l.id === currentLvl) || levelsConfig[0];

    const html = `
    <div class="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 select-none">
        
        <!-- BARRA SUPERIOR DE NAVEGACIÓN Y PROGRESO -->
        <header class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/80 p-5 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-md">
            <div class="flex items-center gap-4">
                <button onclick="exitArcadeToDashboard()" class="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center gap-2 border border-slate-600">
                    <span>⬅</span> <span>Volver al Supermercado</span>
                </button>
                <div>
                    <span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                        Módulo Pedagógico Mineduc
                    </span>
                    <h1 class="text-2xl font-black text-white mt-1">Arcade de Autonomía Funcional</h1>
                </div>
            </div>

            <!-- Selector de Niveles (1 al 5) -->
            <div class="flex items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-700">
                ${levelsConfig.map(lvl => {
                    const isUnlocked = studentMinigamesProgress.unlockedLevels.includes(lvl.id);
                    const isActive = lvl.id === currentLvl;
                    return `
                    <button onclick="${isUnlocked ? `switchLevel(${lvl.id})` : ''}" 
                            class="px-3.5 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                                isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                                    : isUnlocked 
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                                        : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                            }">
                        <span>${lvl.icon}</span>
                        <span>Nivel ${lvl.id}</span>
                        ${!isUnlocked ? '<span class="text-[10px]">🔒</span>' : ''}
                    </button>`;
                }).join('')}
            </div>
        </header>

        <!-- BANNER DEL NIVEL ACTUAL -->
        <section class="max-w-6xl mx-auto mt-6 bg-gradient-to-r ${currentLevelInfo.color} p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
                <span class="bg-black/30 text-amber-300 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    Nivel ${currentLvl} de 5
                </span>
                <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">${currentLevelInfo.title} ${currentLevelInfo.icon}</h2>
                <p class="text-sm font-bold text-white/80 mt-1 max-w-xl">
                    Supera los 5 minijuegos de esta etapa para habilitar el Examen del Jefe Final y avanzar al siguiente nivel.
                </p>
            </div>
            <div class="bg-slate-950/40 backdrop-blur-md p-5 rounded-3xl text-center border border-white/20 min-w-[160px]">
                <span class="text-xs font-black text-slate-300 block uppercase tracking-wider">Desafíos Nivel ${currentLvl}</span>
                <span class="text-4xl font-black text-amber-400 mt-1 block">${completedInCurrentLvl.length} / 5</span>
            </div>
        </section>

        <!-- PARRILLA DE 5 MINIJUEGOS + 1 JEFE FINAL -->
        <main class="max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            ${renderGameCard(currentLvl, 1, "🍎 El Estante Correcto", "Categorización semántica con catálogo real.", "mj1", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 2, "💵 Corta el Billete", "Reconocimiento y valorización de billetes CLP.", "mj2", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 3, "🔤 Palabras en Góndola", "Conciencia fonológica de etiquetas.", "mj3", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 4, "🧮 Calculadora del Canasto", "Adición básica y estimación de precios.", "mj4", completedInCurrentLvl)}
            ${renderGameCard(currentLvl, 5, "📋 La Lista de Compras", "Memoria operacional y búsqueda activa.", "mj5", completedInCurrentLvl)}

            <!-- TARJETA DEL JEFE FINAL -->
            <div class="bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 rounded-3xl p-6 border-4 border-amber-400/60 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div class="flex justify-between items-start z-10">
                    <span class="text-5xl animate-bounce">👑</span>
                    <span class="text-xs font-black px-3 py-1.5 rounded-full bg-black/50 text-amber-300 border border-amber-400">
                        JEFE FINAL NIVEL ${currentLvl}
                    </span>
                </div>
                <div class="z-10">
                    <h3 class="font-black text-white text-xl">🛡️ Desafío del Cajero Central</h3>
                    <p class="text-xs font-bold text-amber-100 mt-1">
                        Evaluación integrada de autonomía para desbloquear el Nivel ${currentLvl < 5 ? currentLvl + 1 : 5}.
                    </p>
                </div>
                <button ${isBossUnlocked ? `onclick="startBossExam(${currentLvl})"` : 'disabled'} 
                        class="w-full py-4 rounded-2xl font-black text-sm z-10 transition-all ${
                            isBossUnlocked 
                                ? 'bg-slate-950 hover:bg-black text-amber-300 border-2 border-amber-400 active:scale-95 shadow-xl' 
                                : 'bg-slate-900/80 text-amber-200/40 cursor-not-allowed border border-white/10'
                        }">
                    ${isBossUnlocked ? '🔥 ¡ENFRENTAR JEFE FINAL!' : '🔒 Completa los 5 juegos'}
                </button>
            </div>

        </main>
    </div>
    `;

    mainContainer.innerHTML = html;
}

// Plantilla de renderizado de cada tarjeta de juego
function renderGameCard(level, gameNum, title, description, gameKey, completedList) {
    const isCompleted = completedList.includes(gameKey);
    const isUnlocked = gameNum === 1 || completedList.includes(`mj${gameNum - 1}`);

    return `
    <div class="bg-slate-800/90 rounded-3xl p-6 border-2 ${isCompleted ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-700'} shadow-xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
            <span class="text-xs font-black px-3 py-1 rounded-full ${isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-700 text-slate-300'}">
                ${isCompleted ? '✓ Completado' : `Desafío ${gameNum}`}
            </span>
            <span class="text-xs font-black text-slate-400">Nivel ${level}</span>
        </div>
        <div>
            <h3 class="font-black text-white text-lg">${title}</h3>
            <p class="text-xs text-slate-400 font-bold mt-1">${description}</p>
        </div>
        <button ${isUnlocked ? `onclick="launchMinigame('${gameKey}', ${level})"` : 'disabled'} 
                class="w-full py-3.5 rounded-2xl font-black text-xs transition-all ${
                    isUnlocked 
                        ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-lg' 
                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                }">
            ${isUnlocked ? (isCompleted ? '🔄 Rejugar' : '▶ ¡Iniciar!') : '🔒 Bloqueado'}
        </button>
    </div>
    `;
}

// Cambiar entre Niveles desbloqueados
function switchLevel(levelId) {
    studentMinigamesProgress.currentLevel = levelId;
    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

// Lógica de lanzamiento de minijuegos
function launchMinigame(gameKey, level) {
    alert(`🎮 Iniciando ${gameKey.toUpperCase()} correspondiente al Nivel ${level}`);
    
    // Registrar juego como completado
    if (!studentMinigamesProgress.completedGames[`level${level}`]) {
        studentMinigamesProgress.completedGames[`level${level}`] = [];
    }
    
    if (!studentMinigamesProgress.completedGames[`level${level}`].includes(gameKey)) {
        studentMinigamesProgress.completedGames[`level${level}`].push(gameKey);
    }

    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

// Lógica del Jefe Final para desbloquear el siguiente Nivel
function startBossExam(level) {
    alert(`👑 ¡Has derrotado al Jefe Final del Nivel ${level}!`);

    const nextLevel = level + 1;
    if (nextLevel <= 5 && !studentMinigamesProgress.unlockedLevels.includes(nextLevel)) {
        studentMinigamesProgress.unlockedLevels.push(nextLevel);
        studentMinigamesProgress.currentLevel = nextLevel;
    }

    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

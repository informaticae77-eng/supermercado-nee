/* ==========================================================================
   MINIJUEGOS CURRICULARES MINEDUC & EVALUACIÓN FONOAUDIOLÓGICA (games.js)
   ========================================================================== */

// Estado del progreso de minijuegos del estudiante
let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: [],
    bossUnlocked: false,
    gameMetrics: []
};

// Cargar progreso desde localStorage
function loadMinigamesProgress() {
    const saved = localStorage.getItem('nee_minigames_progress');
    if (saved) {
        studentMinigamesProgress = JSON.parse(saved);
    }
}

// Guardar progreso en localStorage
function saveMinigamesProgress() {
    localStorage.setItem('nee_minigames_progress', JSON.stringify(studentMinigamesProgress));
}

/* --------------------------------------------------------------------------
   1. VISTA: ARCADE DE MINIJUEGOS (PANEL ESTUDIANTE)
   -------------------------------------------------------------------------- */
function renderMinigamesArcadeView() {
    loadMinigamesProgress();
    const level = studentMinigamesProgress.currentLevel;
    const completed = studentMinigamesProgress.completedGames;
    const isBossUnlocked = completed.length >= 5;

    const html = `
    <div class="space-y-6 max-w-5xl mx-auto p-4">
        <!-- Navegación superior -->
        <div class="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
            <button onclick="goHome()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-4 py-2 rounded-2xl text-xs active:scale-95">
                ⬅ Volver al Panel
            </button>
            <span class="font-black text-slate-800 text-sm">🎮 Centro de Desafíos Mineduc</span>
        </div>

        <!-- Header del Nivel -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg flex justify-between items-center border-4 border-purple-300">
            <div>
                <span class="bg-black/30 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                    📍 Currículo Nacional Mineduc
                </span>
                <h2 class="text-2xl sm:text-3xl font-black">Nivel ${level}: Comprador Principiante 🛒</h2>
                <p class="text-xs font-bold text-purple-100 mt-1">Completa los 5 desafíos para desbloquear el Examen del Jefe Final y avanzar de Nivel.</p>
            </div>
            <div class="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-center border-2 border-white/40">
                <span class="text-[10px] font-black text-purple-200 block uppercase">Progreso Nivel</span>
                <span class="text-2xl font-black text-white">${completed.length} / 5</span>
            </div>
        </div>

        <!-- Grid de Minijuegos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <!-- Minijuego 1 -->
            <div class="bg-white rounded-3xl p-5 border-4 ${completed.includes('mj1') ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'} shadow-md flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-4xl">🍎</span>
                    <span class="text-xs font-black px-2.5 py-1 rounded-full ${completed.includes('mj1') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj1') ? '✓ Completado' : 'MJ 1'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-base">1. El Estante Correcto</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Categorización semántica de alimentos y productos.</p>
                </div>
                <button onclick="startMinigame1()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl shadow active:scale-95 text-xs">
                    ${completed.includes('mj1') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!'}
                </button>
            </div>

            <!-- Minijuego 2 -->
            <div class="bg-white rounded-3xl p-5 border-4 ${completed.includes('mj2') ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'} shadow-md flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-4xl">💵</span>
                    <span class="text-xs font-black px-2.5 py-1 rounded-full ${completed.includes('mj2') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj2') ? '✓ Completado' : 'MJ 2'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-base">2. Corta el Billete</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Identificación y valorización de dinero en CLP.</p>
                </div>
                <button ${completed.includes('mj1') ? 'onclick="startMinigame2()"' : 'disabled'} class="w-full ${completed.includes('mj1') ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-3 rounded-2xl text-xs">
                    ${completed.includes('mj1') ? (completed.includes('mj2') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- Minijuego 3 -->
            <div class="bg-white rounded-3xl p-5 border-4 ${completed.includes('mj3') ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'} shadow-md flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-4xl">🔤</span>
                    <span class="text-xs font-black px-2.5 py-1 rounded-full ${completed.includes('mj3') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj3') ? '✓ Completado' : 'MJ 3'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-base">3. Palabras en la Góndola</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Conciencia fonológica y lectura inicial.</p>
                </div>
                <button ${completed.includes('mj2') ? 'onclick="startMinigame3()"' : 'disabled'} class="w-full ${completed.includes('mj2') ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-3 rounded-2xl text-xs">
                    ${completed.includes('mj2') ? (completed.includes('mj3') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- Minijuego 4 -->
            <div class="bg-white rounded-3xl p-5 border-4 ${completed.includes('mj4') ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'} shadow-md flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-4xl">🧮</span>
                    <span class="text-xs font-black px-2.5 py-1 rounded-full ${completed.includes('mj4') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj4') ? '✓ Completado' : 'MJ 4'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-base">4. Calculadora del Canasto</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Adición simple y estimación de montos.</p>
                </div>
                <button ${completed.includes('mj3') ? 'onclick="startMinigame4()"' : 'disabled'} class="w-full ${completed.includes('mj3') ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-3 rounded-2xl text-xs">
                    ${completed.includes('mj3') ? (completed.includes('mj4') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- Minijuego 5 -->
            <div class="bg-white rounded-3xl p-5 border-4 ${completed.includes('mj5') ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'} shadow-md flex flex-col justify-between space-y-4">
                <div class="flex justify-between items-start">
                    <span class="text-4xl">📋</span>
                    <span class="text-xs font-black px-2.5 py-1 rounded-full ${completed.includes('mj5') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                        ${completed.includes('mj5') ? '✓ Completado' : 'MJ 5'}
                    </span>
                </div>
                <div>
                    <h4 class="font-black text-slate-800 text-base">5. La Lista de Compras</h4>
                    <p class="text-xs text-slate-500 font-bold mt-1">OA Mineduc: Seguimiento de instrucciones y memoria funcional.</p>
                </div>
                <button ${completed.includes('mj4') ? 'onclick="startMinigame5()"' : 'disabled'} class="w-full ${completed.includes('mj4') ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-3 rounded-2xl text-xs">
                    ${completed.includes('mj4') ? (completed.includes('mj5') ? '🔄 Jugar de nuevo' : '▶ ¡Iniciar Desafío!') : '🔒 Bloqueado'}
                </button>
            </div>

            <!-- JEFE FINAL (EXAMEN DE NIVEL) -->
            <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 border-4 border-amber-300 text-white shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div class="flex justify-between items-start z-10">
                    <span class="text-4xl animate-bounce">👑</span>
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-black/40 text-amber-200 border border-amber-300">
                        EXAMEN FINAL
                    </span>
                </div>
                <div class="z-10">
                    <h4 class="font-black text-lg">🛡️ Desafío del Cajero</h4>
                    <p class="text-xs font-bold text-amber-100 mt-1">Evaluación integrada de compra, cálculo y pago para pasar al Nivel 2.</p>
                </div>
                <button ${isBossUnlocked ? 'onclick="startBossExam()"' : 'disabled'} class="w-full ${isBossUnlocked ? 'bg-slate-900 hover:bg-black text-amber-400 border-2 border-amber-400' : 'bg-slate-800/80 text-amber-200/50 cursor-not-allowed'} font-black py-3 rounded-2xl shadow text-xs z-10">
                    ${isBossUnlocked ? '🔥 ¡ENFRENTAR JEFE FINAL!' : '🔒 Completa los 5 juegos'}
                </button>
            </div>

        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
}

/* --------------------------------------------------------------------------
   2. MINIJUEGO 1: EL ESTANTE CORRECTO (Con Imágenes del Catálogo Real)
   -------------------------------------------------------------------------- */
let mj1State = {
    startTime: null,
    errors: 0,
    currentQuestion: 0,
    questions: []
};

// Función para obtener productos reales del catálogo global de la aplicación
function getCatalogProducts() {
    if (typeof productsCatalog !== 'undefined' && productsCatalog.length > 0) {
        return productsCatalog;
    } else if (typeof APP_DATA !== 'undefined' && APP_DATA.products) {
        return APP_DATA.products;
    }
    
    // Lista de respaldo con imágenes si no detecta el objeto global inmediatamente
    return [
        { name: 'Leche Entera', category: 'Lácteos', image: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png' },
        { name: 'Yogurt Frutilla', category: 'Lácteos', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
        { name: 'Manzana Roja', category: 'Frutas y Verduras', image: 'https://cdn-icons-png.flaticon.com/512/415/415733.png' },
        { name: 'Plátano', category: 'Frutas y Verduras', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909761.png' },
        { name: 'Detergente Líquido', category: 'Aseo', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553642.png' },
        { name: 'Jabón de Manos', category: 'Aseo', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553659.png' },
        { name: 'Pan Hallulla', category: 'Panadería', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014535.png' }
    ];
}

function startMinigame1() {
    mj1State.startTime = Date.now();
    mj1State.errors = 0;
    mj1State.currentQuestion = 0;
    
    const catalog = getCatalogProducts();
    // Seleccionar 4 productos al azar
    mj1State.questions = [...catalog].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    renderMinigame1Question();
}

function renderMinigame1Question() {
    const q = mj1State.questions[mj1State.currentQuestion];
    if (!q) return finishMinigame1();

    const categories = ['Lácteos', 'Frutas y Verduras', 'Panadería', 'Aseo'];
    const imgSrc = q.image || q.img || 'https://cdn-icons-png.flaticon.com/512/1170/1170576.png';

    const html = `
    <div class="max-w-xl mx-auto bg-white rounded-3xl p-6 border-4 border-indigo-200 shadow-xl space-y-6 text-center">
        <div class="flex justify-between items-center text-xs font-black text-slate-500">
            <span>MJ1: El Estante Correcto</span>
            <span>Pregunta ${mj1State.currentQuestion + 1} de ${mj1State.questions.length}</span>
        </div>

        <div class="py-6 bg-slate-50 rounded-2xl border flex flex-col items-center justify-center space-y-3">
            <span class="text-xs font-black text-slate-400 uppercase tracking-wider">¿EN QUÉ ESTANTE VA ESTE PRODUCTO?</span>
            
            <!-- Imagen real del catálogo -->
            <div class="w-32 h-32 bg-white p-3 rounded-2xl border-2 border-indigo-100 shadow-sm flex items-center justify-center">
                <img src="${imgSrc}" alt="${q.name}" class="max-h-full max-w-full object-contain" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1170/1170576.png'"/>
            </div>

            <span class="text-2xl font-black text-slate-800">${q.name}</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
            ${categories.map(cat => `
                <button onclick="checkMinigame1Answer('${cat}')" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-2 border-indigo-200 font-black py-4 rounded-2xl text-sm active:scale-95 transition-all">
                    📂 ${cat}
                </button>
            `).join('')}
        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
}

function checkMinigame1Answer(selectedCat) {
    const q = mj1State.questions[mj1State.currentQuestion];
    const correctCat = q.category || q.correctCategory || 'Lácteos';

    if (selectedCat === correctCat) {
        mj1State.currentQuestion++;
        renderMinigame1Question();
    } else {
        mj1State.errors++;
        alert(`❌ ¡Ups! ${q.name} no pertenece al estante de ${selectedCat}. ¡Inténtalo de nuevo!`);
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
   3. CONEXIÓN Y AUTO-INYECCIÓN DEL BOTÓN EN EL PANEL DEL ESTUDIANTE
   -------------------------------------------------------------------------- */
function connectArcadeToStudentDashboard() {
    // Transformar el botón del memorice existente
    const memoriceBtn = document.querySelector('button[onclick*="Memorice"]') || 
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('MEMORICE'));

    if (memoriceBtn && !document.getElementById('arcadeMinigamesBtnNav')) {
        memoriceBtn.setAttribute('onclick', 'renderMinigamesArcadeView()');
        memoriceBtn.id = 'arcadeMinigamesBtnNav';
        memoriceBtn.className = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-5 py-3 rounded-2xl shadow-lg border-2 border-purple-300 text-xs active:scale-95 transition-transform flex items-center gap-2 animate-pulse";
        memoriceBtn.innerHTML = `<span>🎮</span> <span>CENTRO DE DESAFÍOS MINEDUC (NIVEL 1)</span>`;
    }

    // Inyectar tarjeta prominente si estamos en la vista de supermercados
    const container = document.getElementById('appContainer');
    if (container && container.innerText.includes('Supermercados Disponibles') && !document.getElementById('arcadeBodyCard')) {
        const cardHTML = `
        <div id="arcadeBodyCard" class="mb-6 max-w-5xl mx-auto">
            <button onclick="renderMinigamesArcadeView()" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-4 px-6 rounded-3xl shadow-lg border-b-4 border-purple-900 text-base active:scale-95 transition-transform flex items-center justify-center gap-3">
                <span class="text-2xl">🎮</span>
                <span>¡Entrar al Centro de Desafíos Mineduc (5 Juegos + Jefe Final)!</span>
            </button>
        </div>
        `;
        const welcomeBanner = container.querySelector('.bg-gradient-to-r') || container.firstChild;
        if (welcomeBanner && welcomeBanner.id !== 'arcadeBodyCard') {
            welcomeBanner.insertAdjacentHTML('afterend', cardHTML);
        }
    }
}

// Escaneo periódico para asegurar disponibilidad del botón
setInterval(connectArcadeToStudentDashboard, 300);

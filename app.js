// ==========================================
// CONFIGURACIÓN DE FIREBASE Y EMAILJS
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyB27AIOvrMwMtidvD7Lbkbp9v--0DLaZyY",
    authDomain: "supermercado-nee.firebaseapp.com",
    projectId: "supermercado-nee",
    storageBucket: "supermercado-nee.firebasestorage.app",
    messagingSenderId: "439038813506",
    appId: "1:439038813506:web:972b1e2a0dc1da8cfad4db",
    measurementId: "G-ZJXT1QTQ6J"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

const EMAILJS_CONFIG = {
    publicKey: "smzqxkKPlFcTigatD",
    serviceId: "service_omucoeg",
    templateId: "template_vyzp71o"
};

if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    teacherActiveTab: 'home', // 'home' | 'catalog' | 'currency'
    teacherPreviewMode: false,
    adminCourseFilter: 'all',
    selectedCategoryFilter: 'all',
    basket: [],
    userPaidAmount: 0,
    courses: [],
    categories: [],
    users: [],
    supermarkets: [],
    products: [],
    evaluations: [],
    customCurrencies: {},
    telemetry: { voiceHelpCount: 0, paymentResetsCount: 0 },
    missionActive: false,
    missionStartTime: null,
    missionTimerInterval: null,
    missionElapsedSeconds: 0,
    foundProductIds: [],
    currentScanningProductId: null
};

let cameraStream = null;
let currencyCameraStream = null;
let aiScannerStream = null;

const CLP_CURRENCY_ITEMS = [
    { id: 'b20k', value: 20000, type: 'bill', name: 'Billete $20.000', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/20000_pesos_chilenos_2010_anverso.jpg/320px-20000_pesos_chilenos_2010_anverso.jpg' },
    { id: 'b10k', value: 10000, type: 'bill', name: 'Billete $10.000', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/10000_pesos_chilenos_2010_anverso.jpg/320px-10000_pesos_chilenos_2010_anverso.jpg' },
    { id: 'b5k',  value: 5000,  type: 'bill', name: 'Billete $5.000',  img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/5000_pesos_chilenos_2009_anverso.jpg/320px-5000_pesos_chilenos_2009_anverso.jpg' },
    { id: 'b2k',  value: 2000,  type: 'bill', name: 'Billete $2.000',  img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2000_pesos_chilenos_2009_anverso.jpg/320px-2000_pesos_chilenos_2009_anverso.jpg' },
    { id: 'b1k',  value: 1000,  type: 'bill', name: 'Billete $1.000',  img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/1000_pesos_chilenos_2011_anverso.jpg/320px-1000_pesos_chilenos_2011_anverso.jpg' },
    { id: 'c500', value: 500,   type: 'coin', name: 'Moneda $500',    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/500_pesos_chilenos_anverso.png/220px-500_pesos_chilenos_anverso.png' },
    { id: 'c100', value: 100,   type: 'coin', name: 'Moneda $100',    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/100_pesos_chilenos_anverso.png/220px-100_pesos_chilenos_anverso.png' },
    { id: 'c50',  value: 50,    type: 'coin', name: 'Moneda $50',     img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/50_pesos_chilenos_anverso.png/220px-10_pesos_chilenos_anverso.png' },
    { id: 'c10',  value: 10,    type: 'coin', name: 'Moneda $10',     img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/10_pesos_chilenos_anverso.png/220px-10_pesos_chilenos_anverso.png' }
];

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
function speakText(text) {
    if (APP_STATE.telemetry) APP_STATE.telemetry.voiceHelpCount++;
    if (!('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/\$/g, ' ').replace(/\bCLP\b/gi, ' ').trim();
        if (!clean) return;
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(clean);
            utterance.lang = 'es-CL';
            utterance.rate = 0.88;
            window.speechSynthesis.speak(utterance);
        }, 50);
    } catch(e) {}
}

function playChimeSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
}

function sendAutomaticCredentialsEmail(user) {
    if (!user || !user.email) return;
    if (typeof emailjs !== 'undefined') {
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                to_email: user.email,
                to_name: user.name,
                user_rut: user.rut,
                user_pin: user.pin,
                app_url: window.location.href
            },
            EMAILJS_CONFIG.publicKey
        ).catch(err => console.error("Error EmailJS:", err));
    }
}

// ==========================================
// RENDERIZADO PRINCIPAL
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin' :
                       (APP_STATE.currentUser.role === 'teacher' ? '👨‍🏫 Educador' : '🎒 Alumno');
        
        if (userInfoHeader) {
            userInfoHeader.innerHTML = `
                <div class="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-xs flex items-center gap-2 shadow-sm">
                    <span class="font-bold text-indigo-900">${APP_STATE.currentUser.name}</span>
                    <span class="bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md text-[10px]">${roleTag}</span>
                </div>
                <button onclick="logout()" class="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-300">Salir</button>
            `;
        }
    } else {
        if (userInfoHeader) userInfoHeader.innerHTML = '';
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderLoginView(container);
        return;
    }

    // Modo prueba del educador/admin simulando ser un alumno
    if (APP_STATE.teacherPreviewMode) {
        if (headerBasketBtn) headerBasketBtn.classList.remove('hidden');
        renderStudentPreviewWrapper(container);
        updateBasketBadge();
        return;
    }

    if (APP_STATE.currentUser.role === 'admin' || APP_STATE.currentUser.role === 'teacher') {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderTeacherDashboard(container);
    } else {
        if (headerBasketBtn) headerBasketBtn.classList.remove('hidden');
        if (APP_STATE.selectedSupermarketId) {
            renderSupermarketView(container, APP_STATE.selectedSupermarketId);
        } else {
            renderHomeView(container);
        }
    }
    updateBasketBadge();
}

function renderLoginView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white border-4 border-slate-300 rounded-3xl p-6 shadow-xl space-y-6">
            <div class="text-center space-y-2">
                <div class="text-5xl">🔐</div>
                <h2 class="text-2xl font-black text-slate-800">Iniciar Sesión</h2>
                <p class="text-xs font-semibold text-slate-500">Ingresa tu RUT (o Usuario) y tu PIN</p>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">RUT o Usuario:</label>
                    <input type="text" id="loginUser" placeholder="Ej: 12345678-9" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 font-bold">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Clave / PIN:</label>
                    <input type="password" id="loginPin" placeholder="••••" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-center text-xl tracking-widest font-black">
                </div>
                <p id="loginError" class="text-xs font-bold text-rose-600 hidden text-center">RUT o clave incorrecta.</p>
                <button onclick="handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow active:scale-95 text-lg">Ingresar</button>
            </div>
        </div>
    `;
}

function handleLogin() {
    const userVal = document.getElementById('loginUser').value.trim().toLowerCase();
    const pinVal = document.getElementById('loginPin').value.trim();

    const user = (APP_STATE.users || []).find(u => 
        (u.rut && u.rut.toLowerCase() === userVal) || 
        (u.username && u.username.toLowerCase() === userVal)
    );

    if (user && user.pin === pinVal) {
        APP_STATE.currentUser = user;
        localStorage.setItem('nee_active_user', JSON.stringify(user));
        speakText(`Bienvenido ${user.name}`);
        renderApp();
    } else {
        const err = document.getElementById('loginError');
        if (err) err.classList.remove('hidden');
    }
}

function logout() {
    APP_STATE.currentUser = null;
    APP_STATE.selectedSupermarketId = null;
    APP_STATE.teacherPreviewMode = false;
    localStorage.removeItem('nee_active_user');
    renderApp();
}

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

// ==========================================
// WRAPPER DE MODO PRUEBA ALUMNO (EDUCADOR)
// ==========================================
function renderStudentPreviewWrapper(container) {
    const previewBanner = `
        <div class="bg-amber-400 border-4 border-amber-600 text-slate-900 p-3.5 rounded-2xl shadow-lg mb-6 flex justify-between items-center flex-wrap gap-2">
            <div class="flex items-center gap-2">
                <span class="text-2xl">🕹️</span>
                <div>
                    <h3 class="font-black text-sm tracking-tight">MODO PRUEBA: VISTA DEL ESTUDIANTE</h3>
                    <p class="text-[11px] font-bold text-slate-800">Estás probando la tienda tal como interactúan los alumnos.</p>
                </div>
            </div>
            <button onclick="toggleStudentPreview(false)" class="bg-slate-900 hover:bg-black text-white font-black text-xs px-4 py-2 rounded-xl border-b-2 border-slate-950 shadow active:scale-95">
                ← Volver al Panel
            </button>
        </div>
    `;

    const subContainer = document.createElement('div');
    if (APP_STATE.selectedSupermarketId) {
        renderSupermarketView(subContainer, APP_STATE.selectedSupermarketId);
    } else {
        renderHomeView(subContainer);
    }

    container.innerHTML = previewBanner;
    container.appendChild(subContainer);
}

function toggleStudentPreview(status) {
    APP_STATE.teacherPreviewMode = status;
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

// ==========================================
// DASHBOARD DEL EDUCADOR Y ADMINISTRADOR (CON PESTAÑAS)
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderApp();
}

function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';

    container.innerHTML = `
        <div class="space-y-6">
            <!-- ENCABEZADO Y MENÚ DE PESTAÑAS -->
            <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl space-y-4 border-b-4 border-indigo-700">
                <div class="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 class="text-2xl font-black flex items-center gap-2">
                            <i class="fa-solid fa-chalkboard-user text-amber-400"></i>
                            <span>Panel de Gestión y Métrica Pedagógica</span>
                        </h2>
                        <p class="text-xs text-indigo-200 mt-1">Supervisión, edición de catálogo y personalización adaptativa.</p>
                    </div>

                    <!-- BOTÓN VISTA DE JUEGO DEL ALUMNO -->
                    <button onclick="toggleStudentPreview(true)" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-lg border-b-4 border-amber-600 flex items-center gap-2 active:scale-95 transition-transform">
                        <span>🕹️</span>
                        <span>Ver Juego (Vista Alumno)</span>
                    </button>
                </div>

                <!-- MENÚ DE NAVEGACIÓN PRINCIPAL (PESTAÑAS) -->
                <div class="flex flex-wrap gap-2 pt-2 border-t border-indigo-800">
                    <button onclick="setTeacherTab('home')" class="px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'home' ? 'bg-white text-indigo-950 shadow-md scale-105' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}">
                        <span>📊</span><span>Inicio & Telemetría</span>
                    </button>
                    <button onclick="setTeacherTab('catalog')" class="px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'catalog' ? 'bg-white text-indigo-950 shadow-md scale-105' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}">
                        <span>🏪</span><span>Supermercados y Catálogo</span>
                    </button>
                    <button onclick="setTeacherTab('currency')" class="px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'currency' ? 'bg-white text-indigo-950 shadow-md scale-105' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}">
                        <span>💵</span><span>Billetes y Monedas (CLP)</span>
                    </button>
                    ${APP_STATE.currentUser.role === 'admin' ? `
                        <button onclick="setTeacherTab('users')" class="px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-indigo-950 shadow-md scale-105' : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'}">
                            <span>👑</span><span>Gestión de Usuarios</span>
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- CONTENIDO DE LAS PESTAÑAS -->
            <div id="teacherTabContent">
                ${activeTab === 'home' ? renderTeacherHomeTab() : ''}
                ${activeTab === 'catalog' ? renderTeacherCatalogTab() : ''}
                ${activeTab === 'currency' ? renderTeacherCurrencyTab() : ''}
                ${activeTab === 'users' && APP_STATE.currentUser.role === 'admin' ? renderAdminUsersTab() : ''}
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 1: INICIO, TELEMETRÍA E HISTORIAL
// ------------------------------------------
function renderTeacherHomeTab() {
    const totalEvals = (APP_STATE.evaluations || []).length;
    const avgTime = totalEvals > 0 ? Math.round(APP_STATE.evaluations.reduce((a, e) => a + (e.timeSeconds || 0), 0) / totalEvals) : 0;
    const totalVoiceHelp = APP_STATE.telemetry ? APP_STATE.telemetry.voiceHelpCount || 0 : 0;

    return `
        <div class="space-y-6">
            <!-- TARJETAS DE MÉTRICA Y TELEMETRÍA AUTOMATIZADA -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-3xl border-4 border-indigo-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Compras Realizadas</span>
                        <span class="text-2xl font-black text-indigo-950">${totalEvals}</span>
                    </div>
                    <div class="bg-indigo-100 text-indigo-600 p-3 rounded-2xl text-xl">🛍️</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Promedio de Búsqueda</span>
                        <span class="text-2xl font-black text-emerald-700">${Math.floor(avgTime / 60)}m ${avgTime % 60}s</span>
                    </div>
                    <div class="bg-emerald-100 text-emerald-600 p-3 rounded-2xl text-xl">⏱️</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-amber-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Alumnos Registrados</span>
                        <span class="text-2xl font-black text-amber-900">${(APP_STATE.users || []).filter(u => u.role === 'student').length}</span>
                    </div>
                    <div class="bg-amber-100 text-amber-600 p-3 rounded-2xl text-xl">🎒</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-sky-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Usos Lectura por Voz</span>
                        <span class="text-2xl font-black text-sky-800">${totalVoiceHelp}</span>
                    </div>
                    <div class="bg-sky-100 text-sky-600 p-3 rounded-2xl text-xl">🔊</div>
                </div>
            </div>

            <!-- HISTORIAL DE COMPRAS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <i class="fa-solid fa-clock-rotate-left text-indigo-600"></i>
                        <span>Historial de Compras de los Estudiantes</span>
                    </h3>
                    <span class="bg-indigo-100 text-indigo-900 text-xs font-extrabold px-3 py-1 rounded-xl">
                        ${(APP_STATE.evaluations || []).length} Registros
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-black">
                                <th class="py-2.5 px-3">Fecha</th>
                                <th class="py-2.5 px-3">Alumno</th>
                                <th class="py-2.5 px-3">Supermercado</th>
                                <th class="py-2.5 px-3 text-center">Productos</th>
                                <th class="py-2.5 px-3">Total ($)</th>
                                <th class="py-2.5 px-3 text-center">Tiempo</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-bold">
                            ${(APP_STATE.evaluations || []).length === 0 ? `
                                <tr>
                                    <td colspan="6" class="py-8 text-center text-slate-400 italic">Aún no hay compras registradas por los estudiantes.</td>
                                </tr>
                            ` : (APP_STATE.evaluations || []).map(e => `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-3 text-slate-500">${e.date || 'Reciente'}</td>
                                    <td class="py-3 px-3 font-black text-indigo-950">${e.studentName || 'Alumno'}</td>
                                    <td class="py-3 px-3">${e.supermarketName || 'Supermercado'}</td>
                                    <td class="py-3 px-3 text-center bg-slate-100 rounded-lg">${e.itemCount || 1}</td>
                                    <td class="py-3 px-3 font-black text-emerald-700">$${(e.totalCLP || 0).toLocaleString('es-CL')}</td>
                                    <td class="py-3 px-3 text-center font-mono">${Math.floor((e.timeSeconds || 0) / 60)}m ${(e.timeSeconds || 0) % 60}s</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 2: MÓDULO DE SUPERMERCADOS, PRODUCTOS Y CATEGORÍAS
// ------------------------------------------
function renderTeacherCatalogTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- MÓDULO SUPERMERCADOS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-emerald-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <i class="fa-solid fa-store text-emerald-600"></i>
                        <span>Gestión de Supermercados</span>
                    </h3>
                    <button onclick="openSupermarketModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow border-b-2 border-emerald-800 active:scale-95">
                        + Crear Supermercado
                    </button>
                </div>

                <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
                    ${(APP_STATE.supermarkets || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay supermercados creados.</p>
                    ` : (APP_STATE.supermarkets || []).map(s => `
                        <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center text-xs font-bold">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">${s.icon || '🏪'}</span>
                                <div>
                                    <h4 class="font-black text-slate-800 text-sm">${s.name}</h4>
                                    <p class="text-[11px] text-slate-500">${s.description || 'Sin descripción'}</p>
                                </div>
                            </div>
                            <button onclick="openSupermarketModal('${s.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-extrabold">
                                ✏️ Editar
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- MÓDULO PRODUCTOS Y CATEGORÍAS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <i class="fa-solid fa-boxes-stacked text-amber-600"></i>
                        <span>Catálogo de Productos</span>
                    </h3>
                    <div class="flex gap-2">
                        <button onclick="openCategoryModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3 py-2 rounded-xl shadow active:scale-95">
                            + Nueva Categoría
                        </button>
                        <button onclick="openProductModal()" class="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3 py-2 rounded-xl shadow border-b-2 border-amber-700 active:scale-95">
                            + Nuevo Producto
                        </button>
                    </div>
                </div>

                <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
                    ${(APP_STATE.products || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay productos ingresados.</p>
                    ` : (APP_STATE.products || []).map(p => `
                        <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center text-xs font-bold">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">${p.iconEmoji || '📦'}</span>
                                <div>
                                    <h4 class="font-black text-slate-800 text-sm">${p.name}</h4>
                                    <span class="text-emerald-700 font-black">$${(p.price || 0).toLocaleString('es-CL')}</span>
                                    <span class="text-slate-400 font-normal">| ${p.category || 'General'}</span>
                                </div>
                            </div>
                            <button onclick="openProductModal('${p.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-extrabold">
                                ✏️ Editar
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 3: BILLETES Y MONEDAS CLP
// ------------------------------------------
function renderTeacherCurrencyTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <i class="fa-solid fa-money-bill-wave text-amber-600"></i>
                    <span>Personalizar Fotos de Billetes y Monedas (CLP)</span>
                </h3>
                <p class="text-xs text-slate-500 font-bold mt-1">Sube fotografías de los billetes y monedas reales utilizados en las actividades dinámicas.</p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                ${CLP_CURRENCY_ITEMS.map(item => `
                    <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-3xl flex flex-col items-center text-center space-y-3">
                        <span class="text-xs font-black text-slate-800">${item.name}</span>
                        <div class="w-full h-24 bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                            <img src="${APP_STATE.customCurrencies[item.id] || item.img}" class="w-full h-full object-contain">
                        </div>
                        <button onclick="openCurrencyEditModal('${item.id}', '${item.name}')" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-3 py-1.5 rounded-xl text-xs w-full border-b-2 border-amber-600 active:scale-95 shadow">
                            📷 Cambiar Foto
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 4: GESTIÓN DE USUARIOS (SÓLO ADMIN)
// ------------------------------------------
function renderAdminUsersTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-school text-indigo-600"></i> Cursos</h3>
                    <button onclick="addNewCoursePrompt()" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Curso</button>
                </div>
                <div class="space-y-2">
                    ${(APP_STATE.courses || []).map(c => `
                        <div class="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-sm font-bold">
                            <span>${c.name}</span>
                            <button onclick="deleteCourse('${c.id}')" class="text-rose-600 text-xs">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-chalkboard-user text-indigo-600"></i> Educadores</h3>
                    <button onclick="openCreateUserModal('teacher')" class="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Educador</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${renderUserRoleList('teacher')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-children text-indigo-600"></i> Alumnos</h3>
                    <button onclick="openCreateUserModal('student')" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Alumno</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${renderUserRoleList('student')}
                </div>
            </div>
        </div>
    `;
}

function renderUserRoleList(role) {
    let users = (APP_STATE.users || []).filter(u => u.role === role);
    if (APP_STATE.adminCourseFilter !== 'all') {
        users = users.filter(u => u.courseId === APP_STATE.adminCourseFilter || (u.courseIds && u.courseIds.includes(APP_STATE.adminCourseFilter)));
    }
    if (users.length === 0) return `<p class="text-xs text-slate-400 italic">No hay registros.</p>`;

    return users.map(u => `
        <div class="p-3 bg-slate-50 border rounded-xl space-y-2 text-xs">
            <div class="flex justify-between items-center font-black">
                <span class="text-indigo-950">${u.name}</span>
                <div class="space-x-1">
                    <button onclick="openEditUserModal('${u.id}')" class="text-amber-600">✏️</button>
                    <button onclick="deleteUser('${u.id}')" class="text-rose-600">✕</button>
                </div>
            </div>
            <div class="text-[11px] text-slate-600">
                <div>RUT: <b>${u.rut || 'N/A'}</b> | Clave: <code class="bg-slate-200 px-1 font-bold">${u.pin}</code></div>
                <div>📧 ${u.email || 'Sin correo'}</div>
            </div>
            <div class="flex gap-1 pt-1">
                <button onclick="resetUserPassword('${u.id}')" class="bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded w-full">🔄 Reset Clave</button>
                <button onclick="sendAutomaticCredentialsEmail(APP_STATE.users.find(x=>x.id==='${u.id}'))" class="bg-sky-100 text-sky-900 font-bold px-2 py-1 rounded w-full">✉️ Correo</button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// VISTA DE LA TIENDA DE ESTUDIANTES
// ==========================================
function renderHomeView(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800">¡Bienvenido a Comprar! 🛍️</h2>
                <p class="text-slate-600 font-medium">Elige un supermercado para comenzar tu compra.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${(APP_STATE.supermarkets || []).map(sup => `
                    <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-lg hover:shadow-2xl cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-transform">
                        <div class="bg-amber-400 p-4 rounded-3xl text-5xl">${sup.icon || '🛒'}</div>
                        <h3 class="text-2xl font-black text-slate-800">${sup.name}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = id;
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => s.id === supId);
    let products = (APP_STATE.products || []).filter(p => p.supermarketId === supId);

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-slate-300">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs">← Volver</button>
                <h2 class="text-2xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${products.map(prod => `
                    <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                        <div class="flex items-center space-x-4">
                            <span class="text-4xl">${prod.iconEmoji || '📦'}</span>
                            <div>
                                <h3 class="text-lg font-black text-slate-800">${prod.name}</h3>
                                <div class="text-2xl font-black text-emerald-700">$${(prod.price || 0).toLocaleString('es-CL')}</div>
                            </div>
                        </div>
                        <button onclick="addToBasket('${prod.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow border-b-4 border-emerald-900 active:scale-95">Añadir al Canasto</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// CONTROLADORES DE MODALES Y ACCIONES
// ==========================================
function updateCategoryDropdowns(selectedName = null) {
    const catSelect = document.getElementById('modalProdCategory');
    if (!catSelect) return;
    const list = APP_STATE.categories || [];
    catSelect.innerHTML = list.length === 0 
        ? `<option value="General">🏷️ General</option>` 
        : list.map(c => `<option value="${c.name}" ${selectedName === c.name ? 'selected' : ''}>${c.icon || '🏷️'} ${c.name}</option>`).join('');
}

function filterAdminByCourse(cId) {
    APP_STATE.adminCourseFilter = cId;
    renderApp();
}

function addNewCoursePrompt() {
    const name = prompt("Nombre del nuevo curso:");
    if (!name || !db) return;
    const newId = 'c-' + Date.now();
    db.collection('courses').doc(newId).set({ id: newId, name });
}

function deleteCourse(id) {
    if (confirm("¿Eliminar este curso?") && db) db.collection('courses').doc(id).delete();
}

function openCreateUserModal(role) {
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = '';
        document.getElementById('modalUserRole').value = role;
        document.getElementById('modalName').value = '';
        document.getElementById('modalRut').value = '';
        document.getElementById('modalEmail').value = '';
        el.classList.remove('hidden');
    }
}

function openEditUserModal(userId) {
    const user = (APP_STATE.users || []).find(u => u.id === userId);
    if (!user) return;
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = user.id;
        document.getElementById('modalUserRole').value = user.role;
        document.getElementById('modalName').value = user.name || '';
        document.getElementById('modalRut').value = user.rut || '';
        document.getElementById('modalEmail').value = user.email || '';
        el.classList.remove('hidden');
    }
}

function closeUserModal() {
    const el = document.getElementById('userModal');
    if (el) el.classList.add('hidden');
}

function saveUserFromModal() {
    const userId = document.getElementById('modalUserId').value;
    const role = document.getElementById('modalUserRole').value;
    const name = document.getElementById('modalName').value.trim();
    const rut = document.getElementById('modalRut').value.trim();
    const email = document.getElementById('modalEmail').value.trim();

    if (!name || !rut || !db) return alert("Completa al menos el nombre y RUT.");

    const id = userId || ('u-' + Date.now());
    const pin = rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';

    db.collection('users').doc(id).set({
        id, role, name, rut, username: rut, email, pin, mustChangePassword: false
    }, { merge: true }).then(() => {
        closeUserModal();
        alert("✅ Usuario guardado.");
    });
}

function deleteUser(id) {
    if (confirm("¿Eliminar usuario del sistema?") && db) db.collection('users').doc(id).delete();
}

function resetUserPassword(userId) {
    const user = (APP_STATE.users || []).find(u => u.id === userId);
    if (!user || !db) return;
    const initialPin = user.rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';
    db.collection('users').doc(userId).update({ pin: initialPin }).then(() => {
        alert(`🔒 Clave de ${user.name} reiniciada a: ${initialPin}`);
    });
}

function openCategoryModal(catId = null) {
    const el = document.getElementById('categoryModal');
    if (el) {
        document.getElementById('modalCatId').value = catId || '';
        document.getElementById('modalCatName').value = '';
        document.getElementById('modalCatIcon').value = '🏷️';
        el.classList.remove('hidden');
    }
}

function closeCategoryModal() {
    const el = document.getElementById('categoryModal');
    if (el) el.classList.add('hidden');
}

function saveCategoryFromModal() {
    const catId = document.getElementById('modalCatId').value;
    const name = document.getElementById('modalCatName').value.trim();
    const icon = document.getElementById('modalCatIcon').value.trim() || '🏷️';

    if (!name || !db) return alert("Ingresa un nombre de categoría.");
    const id = catId || ('cat-' + Date.now());

    db.collection('categories').doc(id).set({ id, name, icon }).then(() => {
        closeCategoryModal();
        updateCategoryDropdowns(name);
        alert(`✅ Categoría "${name}" guardada.`);
    });
}

function selectCategoryIconEmoji(emoji) {
    const el = document.getElementById('modalCatIcon');
    if (el) el.value = emoji;
}

function openSupermarketModal(supId = null) {
    const el = document.getElementById('supermarketModal');
    if (el) {
        document.getElementById('modalSupId').value = supId || '';
        document.getElementById('modalSupName').value = '';
        document.getElementById('modalSupIcon').value = '🏪';
        document.getElementById('modalSupDesc').value = '';
        el.classList.remove('hidden');
    }
}

function closeSupermarketModal() {
    const el = document.getElementById('supermarketModal');
    if (el) el.classList.add('hidden');
}

function saveSupermarketFromModal() {
    const supId = document.getElementById('modalSupId').value;
    const name = document.getElementById('modalSupName').value.trim();
    const icon = document.getElementById('modalSupIcon').value.trim() || '🏪';
    const description = document.getElementById('modalSupDesc').value.trim();

    if (!name || !db) return alert("Ingresa el nombre del supermercado.");
    const id = supId || ('sup-' + Date.now());

    db.collection('supermarkets').doc(id).set({ id, name, icon, description }).then(() => {
        closeSupermarketModal();
        alert("✅ Supermercado guardado.");
    });
}

function openProductModal(prodId = null) {
    const supSelect = document.getElementById('modalProdSupermarket');
    if (supSelect) supSelect.innerHTML = (APP_STATE.supermarkets || []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    updateCategoryDropdowns();

    const titleEl = document.getElementById('prodModalTitle');
    const idInput = document.getElementById('modalProdId');
    const nameInput = document.getElementById('modalProdName');
    const priceInput = document.getElementById('modalProdPrice');
    const emojiInput = document.getElementById('modalProdEmoji');
    const repInput = document.getElementById('modalProdReplicateAll');

    if (prodId) {
        const p = (APP_STATE.products || []).find(item => item.id === prodId);
        if (p) {
            if (titleEl) titleEl.textContent = 'Editar Producto';
            if (idInput) idInput.value = p.id;
            if (nameInput) nameInput.value = p.name || '';
            if (priceInput) priceInput.value = p.price || '';
            if (emojiInput) emojiInput.value = p.iconEmoji || '📦';
            if (supSelect) supSelect.value = p.supermarketId;
            if (repInput) { repInput.checked = false; repInput.disabled = true; }
        }
    } else {
        if (titleEl) titleEl.textContent = 'Crear Producto';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '';
        if (emojiInput) emojiInput.value = '📦';
        if (repInput) { repInput.checked = false; repInput.disabled = false; }
    }

    const el = document.getElementById('productModal');
    if (el) el.classList.remove('hidden');
}

function closeProductModal() {
    const el = document.getElementById('productModal');
    if (el) el.classList.add('hidden');
}

function saveProductFromModal() {
    const prodId = document.getElementById('modalProdId')?.value;
    const supSelect = document.getElementById('modalProdSupermarket');
    if (!supSelect || !supSelect.value) return alert("Crea un supermercado primero.");

    const supId = supSelect.value;
    const name = document.getElementById('modalProdName').value.trim();
    const category = document.getElementById('modalProdCategory').value;
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const iconEmoji = document.getElementById('modalProdEmoji').value.trim() || '📦';
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;

    if (!name || isNaN(price) || !db) return alert("Completa nombre y precio.");

    if (replicateAll) {
        if (!APP_STATE.supermarkets || APP_STATE.supermarkets.length === 0) {
            return alert("No hay supermercados creados para replicar.");
        }

        const batch = db.batch();
        const now = Date.now();

        APP_STATE.supermarkets.forEach((sup, idx) => {
            const newId = 'prod-' + now + '-' + idx;
            const ref = db.collection('products').doc(newId);
            batch.set(ref, {
                id: newId,
                supermarketId: sup.id,
                name: name,
                category: category,
                price: price,
                iconEmoji: iconEmoji
            });
        });

        batch.commit().then(() => {
            closeProductModal();
            alert(`✅ Producto replicado con éxito en los ${APP_STATE.supermarkets.length} supermercados.`);
        }).catch(err => alert("Error al replicar producto: " + err.message));

    } else {
        const id = prodId || ('prod-' + Date.now());
        db.collection('products').doc(id).set({
            id: id,
            supermarketId: supId,
            name: name,
            category: category,
            price: price,
            iconEmoji: iconEmoji
        }, { merge: true }).then(() => {
            closeProductModal();
            alert("✅ Producto guardado en la Nube.");
        }).catch(err => alert("Error al guardar producto: " + err.message));
    }
}

function openCurrencyEditModal(id, name) {
    document.getElementById('modalCurrencyId').value = id;
    document.getElementById('currencyModalTitle').textContent = `Foto de ${name}`;
    const el = document.getElementById('currencyEditModal');
    if (el) el.classList.remove('hidden');
}

function closeCurrencyEditModal() {
    const el = document.getElementById('currencyEditModal');
    if (el) el.classList.add('hidden');
}

function openBasketModal() {
    const el = document.getElementById('basketModal');
    if (el) el.classList.remove('hidden');
}

function closeBasketModal() {
    const el = document.getElementById('basketModal');
    if (el) el.classList.add('hidden');
}

function updateBasketBadge() {
    const badge = document.getElementById('basketBadge');
    if (badge) badge.textContent = (APP_STATE.basket || []).length;
}

function addToBasket(prodId) {
    const prod = (APP_STATE.products || []).find(p => p.id === prodId);
    if (!prod) return;
    APP_STATE.basket.push({ productId: prodId, quantity: 1 });
    playChimeSound();
    updateBasketBadge();
    speakText(`Añadido ${prod.name}`);
}

// ==========================================
// ESCUCHADORES EN TIEMPO REAL
// ==========================================
function initFirebaseListeners() {
    const storedUser = localStorage.getItem('nee_active_user');
    if (storedUser) {
        try { APP_STATE.currentUser = JSON.parse(storedUser); } catch(e) {}
    }

    if (!db) return;

    db.collection('courses').onSnapshot(s => { APP_STATE.courses = s.docs.map(d => d.data()); renderApp(); });
    db.collection('categories').onSnapshot(s => { APP_STATE.categories = s.docs.map(d => d.data()); updateCategoryDropdowns(); renderApp(); });
    db.collection('users').onSnapshot(s => { 
        APP_STATE.users = s.docs.map(d => d.data()); 
        if (APP_STATE.currentUser) {
            const updated = APP_STATE.users.find(u => u.id === APP_STATE.currentUser.id);
            if (updated) APP_STATE.currentUser = updated;
        }
        renderApp(); 
    });
    db.collection('supermarkets').onSnapshot(s => { APP_STATE.supermarkets = s.docs.map(d => d.data()); renderApp(); });
    db.collection('products').onSnapshot(s => { APP_STATE.products = s.docs.map(d => d.data()); renderApp(); });
    db.collection('evaluations').onSnapshot(s => { APP_STATE.evaluations = s.docs.map(d => d.data()); renderApp(); });
    db.collection('currencies').onSnapshot(s => {
        const map = {};
        s.docs.forEach(doc => { map[doc.id] = doc.data().photoUrl; });
        APP_STATE.customCurrencies = map;
        renderApp();
    });
}

// Inicialización de la app
initFirebaseListeners();
renderApp();

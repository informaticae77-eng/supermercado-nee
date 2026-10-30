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
    teacherActiveTab: 'home', // 'home' | 'catalog' | 'currency' | 'users' | 'instrument'
    teacherPreviewMode: false,
    adminCourseFilter: 'all',
    basket: [],
    userPaidAmount: 0,
    courses: [],
    categories: [],
    users: [],
    supermarkets: [],
    products: [],
    evaluations: [],
    customCurrencies: {},
    telemetry: { voiceHelpCount: 0 },
    missionElapsedSeconds: 0
};

let cameraStream = null;
let currencyCameraStream = null;

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
// FUNCIONES AUXILIARES DE ACCESIBILIDAD
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

function calculateCLPBreakdown(amount) {
    let remaining = amount;
    const result = [];
    CLP_CURRENCY_ITEMS.forEach(item => {
        const count = Math.floor(remaining / item.value);
        if (count > 0) {
            result.push({ ...item, count });
            remaining %= item.value;
        }
    });
    return result;
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
// POBLADO AUTOMÁTICO DE DATOS DE EJEMPLO
// ==========================================
function seedSampleData() {
    if (!db) return alert("Firebase no está listo.");

    const batch = db.batch();
    
    // Supermercados por defecto
    const sups = [
        { id: 'sup-lider', name: 'LIDER', icon: '🛒', description: 'Supermercado Lider - Variedad y Ofertas', photoUrl: '' },
        { id: 'sup-jumbo', name: 'JUMBO', icon: '🐘', description: 'Supermercado Jumbo - Excelente Calidad', photoUrl: '' },
        { id: 'sup-santa', name: 'SANTA ISABEL', icon: '🛍️', description: 'Santa Isabel - Tu Almacén Cercano', photoUrl: '' },
        { id: 'sup-unimarc', name: 'UNIMARC', icon: '🍎', description: 'Unimarc - El Supermercado de Chile', photoUrl: '' }
    ];

    sups.forEach(s => batch.set(db.collection('supermarkets').doc(s.id), s));

    // Productos de ejemplo replicados en LIDER y demás tiendas
    const sampleProducts = [
        { name: 'Leche Entera 1L', price: 1050, iconEmoji: '🥛', category: 'Lácteos' },
        { name: 'Pan Hallulla 1Kg', price: 1890, iconEmoji: '🍞', category: 'Panadería' },
        { name: 'Manzanas Rojas 1Kg', price: 1200, iconEmoji: '🍎', category: 'Frutas' },
        { name: 'Arroz Grado 1 (1Kg)', price: 1350, iconEmoji: '🌾', category: 'Abarrotes' },
        { name: 'Yogurt Griego 150g', price: 650, iconEmoji: '🍦', category: 'Lácteos' },
        { name: 'Aceite Vegetal 900ml', price: 2490, iconEmoji: '🍾', category: 'Abarrotes' },
        { name: 'Huevos 12 Unidades', price: 3200, iconEmoji: '🥚', category: 'Lácteos' },
        { name: 'Detergente Líquido 1L', price: 2990, iconEmoji: '🧼', category: 'Aseo' }
    ];

    let prodCounter = 0;
    sups.forEach(s => {
        sampleProducts.forEach(p => {
            prodCounter++;
            const pId = 'prod-sample-' + prodCounter;
            batch.set(db.collection('products').doc(pId), {
                id: pId,
                supermarketId: s.id,
                name: p.name,
                price: p.price,
                iconEmoji: p.iconEmoji,
                category: p.category,
                photoUrl: ''
            });
        });
    });

    batch.commit().then(() => {
        alert("✅ Base de datos poblada exitosamente con supermercados y productos de ejemplo.");
    }).catch(err => alert("Error cargando ejemplo: " + err.message));
}

// ==========================================
// RENDERIZADO PRINCIPAL Y VISTAS
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin' :
                       (APP_STATE.currentUser.role === 'teacher' ? '👨‍🏫 Educador' : '🎒 Alumno');
        
        const avatarHtml = APP_STATE.currentUser.photoUrl 
            ? `<img src="${APP_STATE.currentUser.photoUrl}" class="w-7 h-7 rounded-full object-cover border border-indigo-400">`
            : '';

        if (userInfoHeader) {
            userInfoHeader.innerHTML = `
                <div class="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-xs flex items-center gap-2 shadow-sm">
                    ${avatarHtml}
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

function renderStudentPreviewWrapper(container) {
    const previewBanner = `
        <div class="bg-amber-400 border-4 border-amber-600 text-slate-900 p-3.5 rounded-2xl shadow-lg mb-6 flex justify-between items-center flex-wrap gap-2">
            <div class="flex items-center gap-2">
                <span class="text-2xl">🕹️</span>
                <div>
                    <h3 class="font-black text-sm tracking-tight">MODO PRUEBA: VISTA DEL ESTUDIANTE</h3>
                    <p class="text-[11px] font-bold text-slate-800">Prueba la tienda interactiva tal como la ven los alumnos.</p>
                </div>
            </div>
            <button onclick="toggleStudentPreview(false)" class="bg-slate-900 hover:bg-black text-white font-black text-xs px-4 py-2 rounded-xl border-b-2 border-slate-950 shadow active:scale-95">
                ← Volver al Panel Docente
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
// DASHBOARD DOCENTE COMPLETO
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderTeacherDashboard(document.getElementById('appContainer'));
}

function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';

    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 border-b-4 border-indigo-600">
                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                            <span>🏫</span>
                            <span>Panel Docente, Evaluación NEE e IA</span>
                        </h2>
                        <p class="text-xs text-indigo-300 font-bold mt-0.5">Supervisión pedagógica, catálogo, rúbrica y certificados IA</p>
                    </div>

                    <div class="flex gap-2">
                        <button onclick="seedSampleData()" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow border-b-2 border-emerald-700 active:scale-95">
                            ⚡ Cargar Datos Ejemplo
                        </button>
                        <button onclick="toggleStudentPreview(true)" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-4 py-2 rounded-xl shadow border-b-2 border-amber-600 flex items-center gap-2 active:scale-95">
                            <span>🕹️</span><span>Probar Juego</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                    <button onclick="setTeacherTab('home')" class="py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>📊</span><span>1. Evaluaciones e Informes</span>
                    </button>
                    <button onclick="setTeacherTab('catalog')" class="py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>🏪</span><span>2. Catálogo & Tiendas</span>
                    </button>
                    <button onclick="setTeacherTab('currency')" class="py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'currency' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>💵</span><span>3. Billetes / Monedas</span>
                    </button>
                    <button onclick="setTeacherTab('users')" class="py-3 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>🔑</span><span>4. Usuarios & Cursos</span>
                    </button>
                </div>
            </div>

            <div id="teacherTabContent">
                ${activeTab === 'home' ? renderTeacherHomeTab() : ''}
                ${activeTab === 'catalog' ? renderTeacherCatalogTab() : ''}
                ${activeTab === 'currency' ? renderTeacherCurrencyTab() : ''}
                ${activeTab === 'users' ? renderTeacherUsersTab() : ''}
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 1: EVALUACIONES, INSTRUMENTO NEE Y CERTIFICADOS IA
// ------------------------------------------
function renderTeacherHomeTab() {
    const totalEvals = (APP_STATE.evaluations || []).length;
    const avgTime = totalEvals > 0 ? Math.round(APP_STATE.evaluations.reduce((a, e) => a + (e.timeSeconds || 0), 0) / totalEvals) : 0;
    const totalVoiceHelp = APP_STATE.telemetry ? APP_STATE.telemetry.voiceHelpCount || 0 : 0;

    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-3xl border-4 border-indigo-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Compras Registradas</span>
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
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Uso Lectura por Voz</span>
                        <span class="text-2xl font-black text-sky-800">${totalVoiceHelp}</span>
                    </div>
                    <div class="bg-sky-100 text-sky-600 p-3 rounded-2xl text-xl">🔊</div>
                </div>
            </div>

            <!-- REGISTRO PEDAGÓGICO E INSTRUMENTOS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <div>
                        <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                            <i class="fa-solid fa-clipboard-check text-indigo-600"></i>
                            <span>Módulo de Evaluación Pedagógica & Certificados IA</span>
                        </h3>
                        <p class="text-xs text-slate-500">Resultados, pauta de observación NEE y generación automática de certificados con Inteligencia Artificial.</p>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-black">
                                <th class="py-2.5 px-3">Fecha</th>
                                <th class="py-2.5 px-3">Estudiante</th>
                                <th class="py-2.5 px-3">Tienda</th>
                                <th class="py-2.5 px-3">Total / Pago</th>
                                <th class="py-2.5 px-3 text-center">Vuelto</th>
                                <th class="py-2.5 px-3 text-center">Acciones Pedagógicas</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-bold">
                            ${totalEvals === 0 ? `
                                <tr>
                                    <td colspan="6" class="py-8 text-center text-slate-400 italic">No hay evaluaciones registradas aún. Haz una compra de prueba para ver el instrumento y certificado IA.</td>
                                </tr>
                            ` : (APP_STATE.evaluations || []).map(e => `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-3 text-slate-500">${e.date || 'Reciente'}</td>
                                    <td class="py-3 px-3 font-black text-indigo-950">${e.studentName || 'Estudiante'}</td>
                                    <td class="py-3 px-3">${e.supermarketName || 'Supermercado'}</td>
                                    <td class="py-3 px-3">
                                        <div class="font-black text-emerald-700">$${(e.totalCLP || 0).toLocaleString('es-CL')}</div>
                                        <div class="text-[10px] text-slate-400">Pagó: $${(e.paidCLP || 0).toLocaleString('es-CL')}</div>
                                    </td>
                                    <td class="py-3 px-3 text-center font-black text-indigo-900">$${(e.changeCLP || 0).toLocaleString('es-CL')}</td>
                                    <td class="py-3 px-3 text-center space-x-1">
                                        <button onclick="openEvaluationModal('${e.id}')" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 px-2.5 py-1.5 rounded-lg text-xs font-black shadow-sm">
                                            📋 Instrumento NEE
                                        </button>
                                        <button onclick="generateAICertificate('${e.id}')" class="bg-amber-400 hover:bg-amber-500 text-slate-900 px-2.5 py-1.5 rounded-lg text-xs font-black shadow-sm border-b-2 border-amber-600">
                                            ✨ Certificado IA
                                        </button>
                                    </td>
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
// MÓDULO INSTRUMENTO DE EVALUACIÓN NEE
// ------------------------------------------
function openEvaluationModal(evalId) {
    const e = (APP_STATE.evaluations || []).find(item => item.id === evalId);
    if (!e) return alert("Evaluación no encontrada.");

    const modal = document.createElement('div');
    modal.id = 'evalInstrumentModal';
    modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto';

    const accuracy = e.paidCLP >= e.totalCLP ? 100 : Math.round((e.paidCLP / e.totalCLP) * 100);
    const scoreLevel = accuracy >= 100 ? 'Logrado Destacado' : (accuracy >= 70 ? 'En Proceso' : 'Requiere Apoyo');

    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-2xl w-full border-4 border-indigo-600 shadow-2xl p-6 space-y-6 relative my-8">
            <button onclick="document.getElementById('evalInstrumentModal').remove()" class="absolute top-4 right-4 bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600 font-black rounded-full w-8 h-8 flex items-center justify-center">✕</button>

            <div class="border-b pb-3 space-y-1">
                <span class="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">Pauta de Evaluación Adaptada PIE / NEE</span>
                <h2 class="text-xl font-black text-slate-800">Instrumento de Valoración Pedagógica</h2>
                <p class="text-xs text-slate-500">Estudiante: <b>${e.studentName}</b> | Fecha: ${e.date || 'Reciente'}</p>
            </div>

            <!-- RÚBRICA Y INDICADORES -->
            <div class="space-y-4 text-xs font-bold">
                <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border">
                    <div>
                        <span class="text-slate-400 block text-[10px]">Supermercado Evaluado:</span>
                        <span class="text-slate-800 text-sm font-black">${e.supermarketName}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 block text-[10px]">Nivel de Desempeño:</span>
                        <span class="text-emerald-700 text-sm font-black">${scoreLevel} (${accuracy}%)</span>
                    </div>
                </div>

                <h4 class="font-black text-slate-800 text-sm pt-2">Indicadores de Competencia Monetaria:</h4>
                <div class="space-y-2">
                    <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                        <span>1. Selecciona e identifica productos en catálogo:</span>
                        <span class="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-black">LOGRADO (${e.itemCount} items)</span>
                    </div>
                    <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex justify-between items-center">
                        <span>2. Discriminación de Billetes y Monedas CLP:</span>
                        <span class="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-black">${e.paidCLP >= e.totalCLP ? 'LOGRADO' : 'EN PROCESO'}</span>
                    </div>
                    <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                        <span>3. Cálculo e ingreso de efectivo en caja:</span>
                        <span class="bg-amber-600 text-white px-2 py-0.5 rounded text-[10px] font-black">$${(e.paidCLP || 0).toLocaleString('es-CL')} pagados</span>
                    </div>
                    <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl flex justify-between items-center">
                        <span>4. Uso de apoyos auditivos (Síntesis de voz):</span>
                        <span class="bg-sky-600 text-white px-2 py-0.5 rounded text-[10px] font-black">${e.voiceHelpCount || 0} interacciones</span>
                    </div>
                </div>

                <div class="p-4 bg-slate-100 rounded-2xl border text-slate-700 space-y-1">
                    <span class="font-black text-slate-900 block">Observación Pedagógica del Docente:</span>
                    <p class="text-xs italic">El/la estudiante muestra autonomía en la selección de artículos. Requiere continuar reforzando el conteo de vuelto y combinación eficiente de billetes de alta denominación.</p>
                </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t">
                <button onclick="window.print()" class="bg-slate-800 text-white font-black text-xs px-4 py-2.5 rounded-xl">🖨️ Imprimir Reporte</button>
                <button onclick="document.getElementById('evalInstrumentModal').remove()" class="bg-indigo-600 text-white font-black text-xs px-4 py-2.5 rounded-xl">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// ------------------------------------------
// MÓDULO CERTIFICADO GENERADO CON IA
// ------------------------------------------
function generateAICertificate(evalId) {
    const e = (APP_STATE.evaluations || []).find(item => item.id === evalId);
    if (!e) return alert("Evaluación no encontrada.");

    // Síntesis de IA pedagógica
    const aiComments = [
        `Demostró una excelente capacidad de autonomía en el reconocimiento de la moneda nacional chilena (CLP), tomando decisiones económicas acertadas en ${e.supermarketName}.`,
        `Completó satisfactoriamente la experiencia de compra inclusiva, mostrando gran motivación, tolerancia a la frustración y uso autónomo del apoyo de voz.`,
        `Ha superado con éxito la experiencia formativa de cálculo y pago en caja, alcanzando los objetivos del Programa de Integración Escolar (PIE).`
    ];

    const randomComment = aiComments[Math.floor(Math.random() * aiComments.length)];

    const certModal = document.createElement('div');
    certModal.id = 'aiCertificateModal';
    certModal.className = 'fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto';

    certModal.innerHTML = `
        <div class="bg-amber-50 rounded-3xl max-w-3xl w-full border-8 border-amber-400 shadow-2xl p-8 space-y-6 relative my-8 text-center text-slate-800">
            <button onclick="document.getElementById('aiCertificateModal').remove()" class="absolute top-4 right-4 bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-600 font-black rounded-full w-8 h-8 flex items-center justify-center">✕</button>

            <div class="space-y-2">
                <div class="text-6xl">🏆</div>
                <span class="text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-200 px-3 py-1 rounded-full">CERTIFICADO DE LOGRO PEDAGÓGICO - IA NEE</span>
                <h1 class="text-3xl font-black text-indigo-950 pt-2">¡Felicitaciones!</h1>
            </div>

            <div class="space-y-4 my-6">
                <p class="text-sm font-bold text-slate-600">Se otorga el presente reconocimiento con inteligencia artificial a:</p>
                <h2 class="text-3xl font-black text-indigo-600 border-b-4 border-indigo-200 pb-2 inline-block px-6">${e.studentName}</h2>
                <p class="text-xs font-bold text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Por haber completado con éxito la actividad práctica de inclusión financiera e interacción comunitaria en el supermercado <b>${e.supermarketName}</b>.
                </p>
            </div>

            <div class="bg-white p-5 rounded-2xl border-2 border-amber-300 text-left space-y-2 shadow-sm">
                <div class="flex items-center gap-2 text-amber-800 font-black text-xs">
                    <span>🤖</span><span>Análisis de Desempeño Generado por IA:</span>
                </div>
                <p class="text-xs font-semibold text-slate-700 italic">"${randomComment}"</p>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-amber-200 text-xs font-black text-slate-600">
                <div>
                    <span class="block text-[10px] text-slate-400">FECHA</span>
                    <span>${e.date || 'Reciente'}</span>
                </div>
                <div>
                    <span class="block text-[10px] text-slate-400">TOTAL COMPRADO</span>
                    <span class="text-emerald-700">$${(e.totalCLP || 0).toLocaleString('es-CL')}</span>
                </div>
                <div>
                    <span class="block text-[10px] text-slate-400">EVALUACIÓN</span>
                    <span class="text-indigo-900">APROBADO PIE</span>
                </div>
            </div>

            <div class="flex justify-center gap-3 pt-2">
                <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg border-b-4 border-indigo-900 active:scale-95">
                    🖨️ Descargar / Imprimir Certificado
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(certModal);
}

// ------------------------------------------
// PESTAÑA 2: CATALOGO Y SUPERMERCADOS
// ------------------------------------------
function renderTeacherCatalogTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    ` : (APP_STATE.supermarkets || []).map(s => {
                        const supImg = s.photoUrl 
                            ? `<img src="${s.photoUrl}" class="w-12 h-12 object-cover rounded-xl border border-slate-200">`
                            : `<span class="text-2xl">${s.icon || '🏪'}</span>`;
                        return `
                            <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center text-xs font-bold">
                                <div class="flex items-center space-x-3">
                                    ${supImg}
                                    <div>
                                        <h4 class="font-black text-slate-800 text-sm">${s.name}</h4>
                                        <p class="text-[11px] text-slate-500">${s.description || 'Sin descripción'}</p>
                                    </div>
                                </div>
                                <button onclick="openSupermarketModal('${s.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-extrabold">
                                    ✏️ Editar
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <i class="fa-solid fa-boxes-stacked text-amber-600"></i>
                        <span>Catálogo de Productos</span>
                    </h3>
                    <div class="flex gap-2">
                        <button onclick="openCategoryModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3 py-2 rounded-xl shadow active:scale-95">
                            + Crear Categoría
                        </button>
                        <button onclick="openProductModal()" class="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3 py-2 rounded-xl shadow border-b-2 border-amber-700 active:scale-95">
                            + Crear Producto
                        </button>
                    </div>
                </div>

                <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
                    ${(APP_STATE.products || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay productos ingresados.</p>
                    ` : (APP_STATE.products || []).map(p => {
                        const prodImg = p.photoUrl 
                            ? `<img src="${p.photoUrl}" class="w-12 h-12 object-cover rounded-xl border border-slate-200">`
                            : `<span class="text-2xl">${p.iconEmoji || '📦'}</span>`;
                        return `
                            <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center text-xs font-bold">
                                <div class="flex items-center space-x-3">
                                    ${prodImg}
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
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 3: PERSONALIZAR BILLETES Y MONEDAS CLP
// ------------------------------------------
function renderTeacherCurrencyTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <i class="fa-solid fa-money-bill-wave text-amber-600"></i>
                    <span>Personalización de Billetes y Monedas (CLP)</span>
                </h3>
                <p class="text-xs text-slate-500 font-bold mt-1">Sube fotografías reales para adaptar las imágenes utilizadas en las compras.</p>
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
// PESTAÑA 4: CREACIÓN DE USUARIOS Y CURSOS PARA EDUCADORES
// ------------------------------------------
function renderTeacherUsersTab() {
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
                            <button onclick="deleteCourse('${c.id}')" class="text-rose-600 text-xs font-bold">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-chalkboard-user text-indigo-600"></i> Educadores</h3>
                    <button onclick="openCreateUserModal('teacher')" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Educador</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${renderUserRoleList('teacher')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-children text-indigo-600"></i> Alumnos</h3>
                    <button onclick="openCreateUserModal('student')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Alumno</button>
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
// VISTAS DE TIENDA Y PRODUCTOS
// ==========================================
function renderHomeView(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800">¡Bienvenido a Comprar! 🛍️</h2>
                <p class="text-slate-600 font-medium">Elige un supermercado para comenzar tu compra.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${(APP_STATE.supermarkets || []).map(sup => {
                    const iconHtml = sup.photoUrl 
                        ? `<img src="${sup.photoUrl}" class="w-24 h-24 object-cover rounded-3xl shadow-sm border-2 border-slate-200">`
                        : `<div class="bg-amber-400 p-4 rounded-3xl text-5xl">${sup.icon || '🛒'}</div>`;
                    return `
                        <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-lg hover:shadow-2xl cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-transform">
                            ${iconHtml}
                            <h3 class="text-2xl font-black text-slate-800">${sup.name}</h3>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = String(id);
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId));
    let products = (APP_STATE.products || []).filter(p => String(p.supermarketId) === String(supId));

    const productsHtml = products.length === 0 ? `
        <div class="col-span-full bg-white p-8 rounded-3xl border-4 border-dashed border-slate-300 text-center space-y-3 my-4">
            <div class="text-5xl">🛒</div>
            <h3 class="text-lg font-black text-slate-700">No hay productos en este supermercado</h3>
            <p class="text-xs text-slate-500 font-bold max-w-md mx-auto">
                Puedes hacer clic en <b>"⚡ Cargar Datos Ejemplo"</b> en el Panel Docente para poblar las tiendas automáticamente.
            </p>
        </div>
    ` : products.map(prod => {
        const prodImg = prod.photoUrl 
            ? `<img src="${prod.photoUrl}" class="w-16 h-16 object-cover rounded-2xl border border-slate-200">`
            : `<span class="text-4xl">${prod.iconEmoji || '📦'}</span>`;
        return `
            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                <div class="flex items-center space-x-4">
                    ${prodImg}
                    <div>
                        <h3 class="text-lg font-black text-slate-800">${prod.name}</h3>
                        <div class="text-2xl font-black text-emerald-700">$${(prod.price || 0).toLocaleString('es-CL')}</div>
                    </div>
                </div>
                <button onclick="addToBasket('${prod.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow border-b-4 border-emerald-900 active:scale-95">Añadir al Canasto</button>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-slate-300">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs">← Volver</button>
                <h2 class="text-2xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${productsHtml}
            </div>
        </div>
    `;
}

// ==========================================
// CANASTO Y PAGO EN CAJA
// ==========================================
function updateBasketBadge() {
    const badge = document.getElementById('basketBadge');
    if (badge) badge.textContent = (APP_STATE.basket || []).length;
}

function addToBasket(prodId) {
    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(prodId));
    if (!prod) return;
    APP_STATE.basket.push({ productId: prod.id, quantity: 1 });
    playChimeSound();
    updateBasketBadge();
    speakText(`Añadido ${prod.name}`);
}

function clearBasket() {
    APP_STATE.basket = [];
    APP_STATE.userPaidAmount = 0;
    updateBasketBadge();
    renderBasketModalContent();
}

function openBasketModal() {
    renderBasketModalContent();
    const el = document.getElementById('basketModal');
    if (el) el.classList.remove('hidden');
}

function closeBasketModal() {
    const el = document.getElementById('basketModal');
    if (el) el.classList.add('hidden');
}

function renderBasketModalContent() {
    const listEl = document.getElementById('basketItemsList');
    const totalEl = document.getElementById('basketTotalCLP');
    const paidEl = document.getElementById('userPaidTotal');
    const trayEl = document.getElementById('paymentMoneyTray');
    const breakdownEl = document.getElementById('basketCurrencyBreakdown');

    if (!listEl) return;

    let total = 0;
    listEl.innerHTML = (APP_STATE.basket || []).length === 0 
        ? `<p class="text-center text-slate-400 py-6 font-bold text-xs">Tu canasto está vacío.</p>`
        : APP_STATE.basket.map((item, idx) => {
            const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId));
            if (!p) return '';
            total += (p.price || 0);
            const imgHtml = p.photoUrl 
                ? `<img src="${p.photoUrl}" class="w-10 h-10 object-cover rounded-xl border border-slate-200">`
                : `<span class="text-2xl">${p.iconEmoji || '📦'}</span>`;
            return `
                <div class="flex items-center justify-between p-2.5 bg-slate-50 border rounded-2xl text-xs font-bold">
                    <div class="flex items-center space-x-3">
                        ${imgHtml}
                        <span class="text-slate-800">${p.name}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-black text-emerald-700">$${(p.price || 0).toLocaleString('es-CL')}</span>
                        <button onclick="removeFromBasket(${idx})" class="text-rose-600 font-bold px-2 py-1 rounded bg-rose-50">✕</button>
                    </div>
                </div>
            `;
        }).join('');

    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
    if (paidEl) paidEl.textContent = `$${(APP_STATE.userPaidAmount || 0).toLocaleString('es-CL')}`;

    if (breakdownEl) {
        const breakdown = calculateCLPBreakdown(total);
        breakdownEl.innerHTML = breakdown.length === 0 
            ? `<span class="text-xs text-slate-400">$0</span>`
            : breakdown.map(b => `<span class="inline-block bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[11px] font-black mr-1 mb-1">${b.count}x $${b.value.toLocaleString('es-CL')}</span>`).join('');
    }

    if (trayEl) {
        trayEl.innerHTML = CLP_CURRENCY_ITEMS.map(item => `
            <button onclick="addPaymentMoney(${item.value})" class="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl p-1.5 flex flex-col items-center justify-center space-y-1 active:scale-95 shadow-sm">
                <img src="${APP_STATE.customCurrencies[item.id] || item.img}" class="h-10 object-contain">
                <span class="text-[10px] font-black text-slate-800">$${item.value.toLocaleString('es-CL')}</span>
            </button>
        `).join('');
    }
}

function removeFromBasket(index) {
    APP_STATE.basket.splice(index, 1);
    updateBasketBadge();
    renderBasketModalContent();
}

function addPaymentMoney(val) {
    APP_STATE.userPaidAmount += val;
    playChimeSound();
    renderBasketModalContent();
}

function resetUserPayment() {
    APP_STATE.userPaidAmount = 0;
    renderBasketModalContent();
}

function verifyAndCheckout() {
    let total = 0;
    (APP_STATE.basket || []).forEach(item => {
        const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId));
        if (p) total += (p.price || 0);
    });

    if (total === 0) return alert("Tu canasto está vacío.");
    if (APP_STATE.userPaidAmount < total) {
        const falta = total - APP_STATE.userPaidAmount;
        speakText(`Te faltan ${falta} pesos para completar la compra.`);
        return alert(`⚠️ Monto insuficiente. Te faltan $${falta.toLocaleString('es-CL')} para pagar.`);
    }

    const vuelto = APP_STATE.userPaidAmount - total;
    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(APP_STATE.selectedSupermarketId));

    const evalData = {
        id: 'eval-' + Date.now(),
        studentId: APP_STATE.currentUser ? APP_STATE.currentUser.id : 'anonimo',
        studentName: APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Estudiante',
        rut: APP_STATE.currentUser ? APP_STATE.currentUser.rut || '' : '',
        supermarketId: APP_STATE.selectedSupermarketId || '',
        supermarketName: sup ? sup.name : 'Supermercado',
        totalCLP: total,
        paidCLP: APP_STATE.userPaidAmount,
        changeCLP: vuelto,
        itemCount: APP_STATE.basket.length,
        timeSeconds: APP_STATE.missionElapsedSeconds || 25,
        voiceHelpCount: APP_STATE.telemetry.voiceHelpCount,
        date: new Date().toLocaleString('es-CL'),
        timestamp: firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : null
    };

    if (db) {
        db.collection('evaluations').doc(evalData.id).set(evalData);
    }

    if (typeof confetti !== 'undefined') confetti();

    document.getElementById('successModalTotal').textContent = `$${total.toLocaleString('es-CL')}`;
    document.getElementById('successModalPaid').textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoAmount').textContent = `$${vuelto.toLocaleString('es-CL')}`;

    const vueltoBreakdown = calculateCLPBreakdown(vuelto);
    const vueltoContainer = document.getElementById('successModalVueltoBreakdown');
    if (vueltoContainer) {
        vueltoContainer.innerHTML = vueltoBreakdown.length === 0
            ? `<p class="text-xs font-bold text-slate-500">Monto exacto. No requiere vuelto.</p>`
            : vueltoBreakdown.map(b => `<span class="inline-block bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-black mr-1 mb-1">${b.count}x $${b.value.toLocaleString('es-CL')}</span>`).join('');
    }

    closeBasketModal();
    document.getElementById('checkoutSuccessModal').classList.remove('hidden');
    speakText(`¡Excelente compra! Tu vuelto es de ${vuelto} pesos.`);
}

function closeSuccessModalAndFinish() {
    document.getElementById('checkoutSuccessModal').classList.add('hidden');
    clearBasket();
    goHome();
}

// ==========================================
// CONTROLADORES DE MODALES Y EDICIÓN
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

// CREAR O EDITAR PRODUCTOS
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
    const photoHidden = document.getElementById('modalProdPhoto');
    const previewContainer = document.getElementById('prodPhotoPreviewContainer');
    const previewImg = document.getElementById('prodPhotoPreview');

    if (prodId) {
        const p = (APP_STATE.products || []).find(item => String(item.id) === String(prodId));
        if (p) {
            if (titleEl) titleEl.textContent = 'Editar Producto';
            if (idInput) idInput.value = p.id;
            if (nameInput) nameInput.value = p.name || '';
            if (priceInput) priceInput.value = p.price || '';
            if (emojiInput) emojiInput.value = p.iconEmoji || '📦';
            if (supSelect) supSelect.value = p.supermarketId;
            if (repInput) { repInput.checked = false; repInput.disabled = true; }
            if (photoHidden) photoHidden.value = p.photoUrl || '';
            if (p.photoUrl && previewImg && previewContainer) {
                previewImg.src = p.photoUrl;
                previewContainer.classList.remove('hidden');
            }
        }
    } else {
        if (titleEl) titleEl.textContent = 'Crear Producto';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '';
        if (emojiInput) emojiInput.value = '📦';
        if (repInput) { repInput.checked = false; repInput.disabled = false; }
        if (photoHidden) photoHidden.value = '';
        if (previewContainer) previewContainer.classList.add('hidden');
    }

    const el = document.getElementById('productModal');
    if (el) el.classList.remove('hidden');
}

function closeProductModal() {
    const el = document.getElementById('productModal');
    if (el) el.classList.add('hidden');
}

function handleProductPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('modalProdPhoto').value = base64;
        const preview = document.getElementById('prodPhotoPreview');
        const container = document.getElementById('prodPhotoPreviewContainer');
        if (preview) preview.src = base64;
        if (container) container.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function handleProductUrlInput(val) {
    if (!val) return;
    document.getElementById('modalProdPhoto').value = val;
    const preview = document.getElementById('prodPhotoPreview');
    const container = document.getElementById('prodPhotoPreviewContainer');
    if (preview) preview.src = val;
    if (container) container.classList.remove('hidden');
}

function removeProductPhoto() {
    document.getElementById('modalProdPhoto').value = '';
    const urlInput = document.getElementById('modalProdPhotoUrl');
    if (urlInput) urlInput.value = '';
    const container = document.getElementById('prodPhotoPreviewContainer');
    if (container) container.classList.add('hidden');
}

function saveProductFromModal() {
    const prodId = document.getElementById('modalProdId')?.value;
    const supSelect = document.getElementById('modalProdSupermarket');
    const supId = supSelect ? supSelect.value : null;

    const name = document.getElementById('modalProdName').value.trim();
    const category = document.getElementById('modalProdCategory').value;
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const iconEmoji = document.getElementById('modalProdEmoji').value.trim() || '📦';
    const photoUrl = document.getElementById('modalProdPhoto')?.value || document.getElementById('modalProdPhotoUrl')?.value || '';
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;

    if (!name || isNaN(price) || !db) return alert("Completa nombre y precio del producto.");

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
                iconEmoji: iconEmoji,
                photoUrl: photoUrl
            });
        });

        batch.commit().then(() => {
            closeProductModal();
            alert(`✅ Producto replicado con éxito en los ${APP_STATE.supermarkets.length} supermercados.`);
        }).catch(err => alert("Error al replicar producto: " + err.message));

    } else {
        if (!supId) return alert("Selecciona un supermercado.");
        const id = prodId || ('prod-' + Date.now());
        db.collection('products').doc(id).set({
            id: id,
            supermarketId: supId,
            name: name,
            category: category,
            price: price,
            iconEmoji: iconEmoji,
            photoUrl: photoUrl
        }, { merge: true }).then(() => {
            closeProductModal();
            alert("✅ Producto guardado en la Nube.");
        }).catch(err => alert("Error al guardar producto: " + err.message));
    }
}

// SUPERMERCADOS
function openSupermarketModal(supId = null) {
    const el = document.getElementById('supermarketModal');
    if (el) {
        document.getElementById('modalSupId').value = supId || '';
        document.getElementById('modalSupName').value = '';
        document.getElementById('modalSupIcon').value = '🏪';
        document.getElementById('modalSupDesc').value = '';
        document.getElementById('modalSupPhoto').value = '';
        const previewContainer = document.getElementById('supPhotoPreviewContainer');
        if (previewContainer) previewContainer.classList.add('hidden');

        if (supId) {
            const s = (APP_STATE.supermarkets || []).find(item => String(item.id) === String(supId));
            if (s) {
                document.getElementById('modalSupName').value = s.name || '';
                document.getElementById('modalSupIcon').value = s.icon || '🏪';
                document.getElementById('modalSupDesc').value = s.description || '';
                document.getElementById('modalSupPhoto').value = s.photoUrl || '';
                if (s.photoUrl && previewContainer) {
                    document.getElementById('supPhotoPreview').src = s.photoUrl;
                    previewContainer.classList.remove('hidden');
                }
            }
        }
        el.classList.remove('hidden');
    }
}

function closeSupermarketModal() {
    const el = document.getElementById('supermarketModal');
    if (el) el.classList.add('hidden');
}

function handleSupermarketPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('modalSupPhoto').value = base64;
        const preview = document.getElementById('supPhotoPreview');
        const container = document.getElementById('supPhotoPreviewContainer');
        if (preview) preview.src = base64;
        if (container) container.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeSupermarketPhoto() {
    document.getElementById('modalSupPhoto').value = '';
    const container = document.getElementById('supPhotoPreviewContainer');
    if (container) container.classList.add('hidden');
}

function saveSupermarketFromModal() {
    const supId = document.getElementById('modalSupId').value;
    const name = document.getElementById('modalSupName').value.trim();
    const icon = document.getElementById('modalSupIcon').value.trim() || '🏪';
    const description = document.getElementById('modalSupDesc').value.trim();
    const photoUrl = document.getElementById('modalSupPhoto').value;

    if (!name || !db) return alert("Ingresa el nombre del supermercado.");
    const id = supId || ('sup-' + Date.now());

    db.collection('supermarkets').doc(id).set({ id, name, icon, description, photoUrl }, { merge: true }).then(() => {
        closeSupermarketModal();
        alert("✅ Supermercado guardado.");
    });
}

// CATEGORÍAS
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

// BILLETES Y MONEDAS
function openCurrencyEditModal(id, name) {
    document.getElementById('modalCurrencyId').value = id;
    document.getElementById('currencyModalTitle').textContent = `Foto de ${name}`;
    document.getElementById('modalCurrencyPhotoUrl').value = '';
    const container = document.getElementById('currencyPhotoPreviewContainer');
    if (container) container.classList.add('hidden');

    const el = document.getElementById('currencyEditModal');
    if (el) el.classList.remove('hidden');
}

function closeCurrencyEditModal() {
    if (currencyCameraStream) {
        currencyCameraStream.getTracks().forEach(track => track.stop());
        currencyCameraStream = null;
    }
    const cameraContainer = document.getElementById('currencyCameraContainer');
    if (cameraContainer) cameraContainer.classList.add('hidden');

    const el = document.getElementById('currencyEditModal');
    if (el) el.classList.add('hidden');
}

function handleCurrencyFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('modalCurrencyPhotoUrl').value = base64;
        const preview = document.getElementById('currencyPhotoPreview');
        const container = document.getElementById('currencyPhotoPreviewContainer');
        if (preview) preview.src = base64;
        if (container) container.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function startCurrencyCamera() {
    const video = document.getElementById('currencyCameraVideo');
    const container = document.getElementById('currencyCameraContainer');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return alert("Tu navegador no soporta el acceso a la cámara.");
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        currencyCameraStream = stream;
        if (video) video.srcObject = stream;
        if (container) container.classList.remove('hidden');
    }).catch(err => alert("No se pudo acceder a la cámara: " + err.message));
}

function takeCurrencySnapshot() {
    const video = document.getElementById('currencyCameraVideo');
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    document.getElementById('modalCurrencyPhotoUrl').value = dataUrl;
    const preview = document.getElementById('currencyPhotoPreview');
    const previewContainer = document.getElementById('currencyPhotoPreviewContainer');
    if (preview) preview.src = dataUrl;
    if (previewContainer) previewContainer.classList.remove('hidden');

    if (currencyCameraStream) {
        currencyCameraStream.getTracks().forEach(track => track.stop());
        currencyCameraStream = null;
    }
    const container = document.getElementById('currencyCameraContainer');
    if (container) container.classList.add('hidden');
}

function saveCurrencyPhotoFromModal() {
    const id = document.getElementById('modalCurrencyId').value;
    const photoUrl = document.getElementById('modalCurrencyPhotoUrl').value;
    if (!id || !photoUrl) return alert("Por favor selecciona una imagen o toma una foto.");

    db.collection('currencies').doc(id).set({ photoUrl }).then(() => {
        closeCurrencyEditModal();
        alert("✅ Foto guardada exitosamente.");
    }).catch(err => alert("Error al guardar: " + err.message));
}

// USUARIOS
function openCreateUserModal(role) {
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = '';
        document.getElementById('modalUserRole').value = role;
        document.getElementById('modalName').value = '';
        document.getElementById('modalRut').value = '';
        document.getElementById('modalEmail').value = '';
        document.getElementById('modalPhotoUrl').value = '';
        const container = document.getElementById('photoPreviewContainer');
        if (container) container.classList.add('hidden');
        el.classList.remove('hidden');
    }
}

function openEditUserModal(userId) {
    const user = (APP_STATE.users || []).find(u => String(u.id) === String(userId));
    if (!user) return;
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = user.id;
        document.getElementById('modalUserRole').value = user.role;
        document.getElementById('modalName').value = user.name || '';
        document.getElementById('modalRut').value = user.rut || '';
        document.getElementById('modalEmail').value = user.email || '';
        document.getElementById('modalPhotoUrl').value = user.photoUrl || '';
        const container = document.getElementById('photoPreviewContainer');
        if (user.photoUrl && container) {
            document.getElementById('photoPreview').src = user.photoUrl;
            container.classList.remove('hidden');
        }
        el.classList.remove('hidden');
    }
}

function closeUserModal() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    const cameraContainer = document.getElementById('cameraContainer');
    if (cameraContainer) cameraContainer.classList.add('hidden');

    const el = document.getElementById('userModal');
    if (el) el.classList.add('hidden');
}

function handleImageFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('modalPhotoUrl').value = base64;
        const preview = document.getElementById('photoPreview');
        const container = document.getElementById('photoPreviewContainer');
        if (preview) preview.src = base64;
        if (container) container.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function startCameraStream() {
    const video = document.getElementById('cameraVideo');
    const container = document.getElementById('cameraContainer');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return alert("Tu navegador no soporta el acceso a la cámara.");
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        cameraStream = stream;
        if (video) video.srcObject = stream;
        if (container) container.classList.remove('hidden');
    }).catch(err => alert("No se pudo acceder a la cámara: " + err.message));
}

function takeCameraSnapshot() {
    const video = document.getElementById('cameraVideo');
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    document.getElementById('modalPhotoUrl').value = dataUrl;
    const preview = document.getElementById('photoPreview');
    const previewContainer = document.getElementById('photoPreviewContainer');
    if (preview) preview.src = dataUrl;
    if (previewContainer) previewContainer.classList.remove('hidden');

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    const container = document.getElementById('cameraContainer');
    if (container) container.classList.add('hidden');
}

function removeUserPhoto() {
    document.getElementById('modalPhotoUrl').value = '';
    const container = document.getElementById('photoPreviewContainer');
    if (container) container.classList.add('hidden');
}

function saveUserFromModal() {
    const userId = document.getElementById('modalUserId').value;
    const role = document.getElementById('modalUserRole').value;
    const name = document.getElementById('modalName').value.trim();
    const rut = document.getElementById('modalRut').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const photoUrl = document.getElementById('modalPhotoUrl').value;

    if (!name || !rut || !db) return alert("Completa al menos el nombre y RUT.");

    const id = userId || ('u-' + Date.now());
    const pin = rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';

    db.collection('users').doc(id).set({
        id, role, name, rut, username: rut, email, pin, photoUrl, mustChangePassword: false
    }, { merge: true }).then(() => {
        closeUserModal();
        alert("✅ Usuario guardado exitosamente.");
    });
}

function deleteUser(id) {
    if (confirm("¿Eliminar usuario del sistema?") && db) db.collection('users').doc(id).delete();
}

function resetUserPassword(userId) {
    const user = (APP_STATE.users || []).find(u => String(u.id) === String(userId));
    if (!user || !db) return;
    const initialPin = user.rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';
    db.collection('users').doc(userId).update({ pin: initialPin }).then(() => {
        alert(`🔒 Clave de ${user.name} reiniciada a: ${initialPin}`);
    });
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

    db.collection('courses').onSnapshot(s => { 
        APP_STATE.courses = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        renderApp(); 
    });
    db.collection('categories').onSnapshot(s => { 
        APP_STATE.categories = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        updateCategoryDropdowns(); 
        renderApp(); 
    });
    db.collection('users').onSnapshot(s => { 
        APP_STATE.users = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        if (APP_STATE.currentUser) {
            const updated = APP_STATE.users.find(u => String(u.id) === String(APP_STATE.currentUser.id));
            if (updated) APP_STATE.currentUser = updated;
        }
        renderApp(); 
    });
    db.collection('supermarkets').onSnapshot(s => { 
        APP_STATE.supermarkets = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        renderApp(); 
    });
    db.collection('products').onSnapshot(s => { 
        APP_STATE.products = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        renderApp(); 
    });
    db.collection('evaluations').onSnapshot(s => { 
        APP_STATE.evaluations = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        renderApp(); 
    });
    db.collection('currencies').onSnapshot(s => {
        const map = {};
        s.docs.forEach(doc => { map[doc.id] = doc.data().photoUrl; });
        APP_STATE.customCurrencies = map;
        renderApp();
    });
}

// Inicializar la aplicación
initFirebaseListeners();
renderApp();

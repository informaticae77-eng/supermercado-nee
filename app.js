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
// DATOS POR DEFECTO
// ==========================================
const DEFAULT_SUPERMARKETS = [
    { id: 'sup-lider', name: 'LIDER', icon: '🛒', description: 'Supermercado Lider - Variedad y Ofertas', photoUrl: '' },
    { id: 'sup-jumbo', name: 'JUMBO', icon: '🐘', description: 'Supermercado Jumbo - Excelente Calidad', photoUrl: '' },
    { id: 'sup-santa', name: 'SANTA ISABEL', icon: '🛍️', description: 'Santa Isabel - Tu Almacén Cercano', photoUrl: '' },
    { id: 'sup-unimarc', name: 'UNIMARC', icon: '🍎', description: 'Unimarc - El Supermercado de Chile', photoUrl: '' }
];

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Lácteos', icon: '🥛' },
    { id: 'cat-2', name: 'Panadería', icon: '🍞' },
    { id: 'cat-3', name: 'Frutas y Verduras', icon: '🍎' },
    { id: 'cat-4', name: 'Abarrotes', icon: '🌾' },
    { id: 'cat-5', name: 'Aseo y Limpieza', icon: '🧼' },
    { id: 'cat-6', name: 'Bebidas', icon: '🧃' }
];

const DEFAULT_SETTINGS = {
    schoolName: "Escuela Especial & Programa de Integración Escolar PIE",
    schoolSubHeader: "Unidad de Evaluación Psicopedagógica y Autonomía Funcional",
    schoolLogo: "",
    footerText: "Documento oficial generado con soporte de Inteligencia Artificial pedagógica.",
    directorName: "Dirección Académica / Equipo PIE"
};

// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    teacherActiveTab: 'home',
    teacherPreviewMode: false,
    basket: [],
    userPaidAmount: 0,
    courses: [],
    categories: [...DEFAULT_CATEGORIES],
    users: [],
    supermarkets: [...DEFAULT_SUPERMARKETS],
    products: [],
    evaluations: [],
    customCurrencies: {},
    settings: { ...DEFAULT_SETTINGS },
    telemetry: { voiceHelpCount: 0 }
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
// COMPRESOR AUTOMÁTICO DE IMÁGENES
// ==========================================
function compressImageBase64(base64Data, maxWidth = 400, maxHeight = 400, quality = 0.75) {
    return new Promise((resolve) => {
        if (!base64Data || !base64Data.startsWith('data:image')) {
            return resolve(base64Data || '');
        }
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(base64Data);
        img.src = base64Data;
    });
}

// ==========================================
// RENDERIZADO PRINCIPAL DE LA APLICACIÓN
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin General' :
                       (APP_STATE.currentUser.role === 'teacher' ? '👨‍🏫 Educador PIE' : '🎒 Alumno');
        
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
                <h2 class="text-2xl font-black text-slate-800">Acceso Institucional</h2>
                <p class="text-xs font-semibold text-slate-500">Ingresa tu RUT o Usuario y tu PIN</p>
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
                <button onclick="handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow active:scale-95 text-lg">Ingresar al Sistema</button>
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

function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderTeacherDashboard(document.getElementById('appContainer'));
}

// ==========================================
// PANEL DOCENTE Y DE ADMINISTRACIÓN CENTRAL
// ==========================================
function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';

    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 border-b-4 border-indigo-600">
                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                            <span>🏫</span>
                            <span>${isAdmin ? 'Panel de Administración General & PIE' : 'Panel Docente & Evaluación NEE'}</span>
                        </h2>
                        <p class="text-xs text-indigo-300 font-bold mt-0.5">Gestión integral de aprendizaje práctico, informes con IA y configuración institucional.</p>
                    </div>

                    <div class="flex gap-2">
                        <button onclick="toggleStudentPreview(true)" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-4 py-2 rounded-xl shadow border-b-2 border-amber-600 flex items-center gap-2 active:scale-95">
                            <span>🕹️</span><span>Probar Juego</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                    <button onclick="setTeacherTab('home')" class="py-3 px-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>📊</span><span>1. Evaluaciones IA</span>
                    </button>
                    <button onclick="setTeacherTab('catalog')" class="py-3 px-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>🏪</span><span>2. Catálogo Tiendas</span>
                    </button>
                    <button onclick="setTeacherTab('currency')" class="py-3 px-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'currency' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>💵</span><span>3. Monedas & Fotos</span>
                    </button>
                    <button onclick="setTeacherTab('users')" class="py-3 px-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>🔑</span><span>4. Gestión Usuarios</span>
                    </button>
                    <button onclick="setTeacherTab('settings')" class="py-3 px-2 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>⚙️</span><span>5. Plantilla & Logo</span>
                    </button>
                </div>
            </div>

            <div id="teacherTabContent">
                ${activeTab === 'home' ? renderTeacherHomeTab() : ''}
                ${activeTab === 'catalog' ? renderTeacherCatalogTab() : ''}
                ${activeTab === 'currency' ? renderTeacherCurrencyTab() : ''}
                ${activeTab === 'users' ? renderTeacherUsersTab() : ''}
                ${activeTab === 'settings' ? renderTeacherSettingsTab() : ''}
            </div>
        </div>
    `;
}

// ------------------------------------------
// PESTAÑA 1: EVALUACIONES E INFORMES CON IA
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
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Evaluaciones Totales</span>
                        <span class="text-2xl font-black text-indigo-950">${totalEvals}</span>
                    </div>
                    <div class="bg-indigo-100 text-indigo-600 p-3 rounded-2xl text-xl">🛍️</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Tiempo Promedio</span>
                        <span class="text-2xl font-black text-emerald-700">${Math.floor(avgTime / 60)}m ${avgTime % 60}s</span>
                    </div>
                    <div class="bg-emerald-100 text-emerald-600 p-3 rounded-2xl text-xl">⏱️</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-amber-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Alumnos Activos</span>
                        <span class="text-2xl font-black text-amber-900">${(APP_STATE.users || []).filter(u => u.role === 'student').length}</span>
                    </div>
                    <div class="bg-amber-100 text-amber-600 p-3 rounded-2xl text-xl">🎒</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-sky-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Apoyos Auditivos</span>
                        <span class="text-2xl font-black text-sky-800">${totalVoiceHelp}</span>
                    </div>
                    <div class="bg-sky-100 text-sky-600 p-3 rounded-2xl text-xl">🔊</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <div>
                        <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                            <span>✨</span>
                            <span>Módulo de Evaluación Pedagógica e Informes Psicopedagógicos con IA</span>
                        </h3>
                        <p class="text-xs text-slate-500 font-bold">Generación automática de diagnósticos cuantitativos y cualitativos con formato institucional en PDF.</p>
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
                                <th class="py-2.5 px-3 text-center">Acciones Profesionales</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-bold">
                            ${totalEvals === 0 ? `
                                <tr>
                                    <td colspan="6" class="py-8 text-center text-slate-400 italic">No hay registros de compras. Realiza una prueba con un alumno para generar los informes.</td>
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
                                        <button onclick="generateAIPedagogicalReport('${e.id}')" class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black px-3 py-1.5 rounded-xl shadow-md text-xs active:scale-95">
                                            ✨ Generar Informe IA & PDF
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
// GENERADOR Y MOSTRADOR DE INFORME IA CON MEMBRETE PDF
// ------------------------------------------
function generateAIPedagogicalReport(evalId) {
    const ev = (APP_STATE.evaluations || []).find(x => String(x.id) === String(evalId));
    if (!ev) return alert("No se encontró la evaluación seleccionada.");

    const st = APP_STATE.settings || DEFAULT_SETTINGS;

    // Lógica diagnóstica de la Inteligencia Artificial Pedagógica
    const timeSec = ev.timeSeconds || 30;
    const voiceCount = ev.voiceHelpCount || 0;
    const paid = ev.paidCLP || 0;
    const total = ev.totalCLP || 0;
    const change = ev.changeCLP || 0;

    let nivelAutonomia = "Alto / Independiente";
    if (timeSec > 90 || voiceCount > 3) nivelAutonomia = "Requiere Apoyos Puntuales";
    if (timeSec > 180 || paid < total) nivelAutonomia = "Etapa de Consolidación / Guiado";

    let analisisRazonamiento = paid >= total 
        ? `El/La estudiante logró discriminar correctamente la nominación de billetes/monedas para cubrir el monto total ($${total.toLocaleString('es-CL')}). Administró de forma precisa un pago por $${paid.toLocaleString('es-CL')} obteniendo un vuelto exacto de $${change.toLocaleString('es-CL')}.`
        : `Presentó dificultades para completar la suma requerida. Se recomienda reforzar el cálculo acumulativo de denominaciones monetarias.`;

    let recomendacionesIA = [
        "Fomentar ejercicios cotidianos de verificación de vuelto y cálculo mental simple.",
        "Trabajar estimación de costos en contexto real utilizando apoyos visuales y pictóricos.",
        "Mantener la mediación del recurso sintetizador de voz como herramienta adaptativa de apoyo lectura-comprensión."
    ];

    const reportHtml = `
        <div id="printableReport" class="bg-white p-8 max-w-4xl mx-auto border border-slate-300 shadow-2xl rounded-2xl font-sans text-slate-800 space-y-6">
            <!-- MEMBRETE INSTITUCIONAL CONFIGURADO POR EL ADMIN -->
            <div class="flex justify-between items-center border-b-4 border-indigo-600 pb-4">
                <div class="space-y-1">
                    <h1 class="text-xl font-black text-indigo-950 uppercase tracking-tight">${st.schoolName || DEFAULT_SETTINGS.schoolName}</h1>
                    <p class="text-xs font-bold text-indigo-700">${st.schoolSubHeader || DEFAULT_SETTINGS.schoolSubHeader}</p>
                    <span class="inline-block bg-indigo-100 text-indigo-900 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">Informe Psicopedagógico de Autonomía Funcional</span>
                </div>
                ${st.schoolLogo ? `<img src="${st.schoolLogo}" class="h-20 max-w-[150px] object-contain rounded-lg border border-slate-200 p-1">` : `<div class="bg-indigo-50 border-2 border-indigo-200 p-3 rounded-2xl text-center"><span class="text-3xl">🏫</span><p class="text-[9px] font-black text-indigo-900 mt-1">SELLO PIE</p></div>`}
            </div>

            <!-- FICHA DEL ESTUDIANTE -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-xs font-bold">
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">Estudiante:</span>
                    <span class="text-slate-900 font-black text-sm">${ev.studentName}</span>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">RUT / Identificador:</span>
                    <span class="text-slate-900">${ev.rut || 'N/A'}</span>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">Fecha de Evaluación:</span>
                    <span class="text-slate-900">${ev.date || 'Reciente'}</span>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px] uppercase">Supermercado:</span>
                    <span class="text-indigo-900 font-black">${ev.supermarketName}</span>
                </div>
            </div>

            <!-- INDICADORES CUANTITATIVOS DEL DESEMPEÑO -->
            <div>
                <h3 class="font-black text-xs text-indigo-950 uppercase border-b pb-1 mb-3">1. Registros Cuantitativos de Ejecución</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span class="text-[10px] text-emerald-800 uppercase font-black">Costo Total Compra</span>
                        <div class="text-base font-black text-emerald-700">$${(ev.totalCLP || 0).toLocaleString('es-CL')}</div>
                    </div>
                    <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <span class="text-[10px] text-indigo-800 uppercase font-black">Monto Entregado</span>
                        <div class="text-base font-black text-indigo-900">$${(ev.paidCLP || 0).toLocaleString('es-CL')}</div>
                    </div>
                    <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <span class="text-[10px] text-amber-900 uppercase font-black">Vuelto Recibido</span>
                        <div class="text-base font-black text-amber-800">$${(ev.changeCLP || 0).toLocaleString('es-CL')}</div>
                    </div>
                    <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                        <span class="text-[10px] text-sky-900 uppercase font-black">Tiempo de Búsqueda</span>
                        <div class="text-base font-black text-sky-800">${timeSec} seg</div>
                    </div>
                </div>
            </div>

            <!-- DIAGNÓSTICO Y ANÁLISIS CUALITATIVO CON IA -->
            <div class="space-y-4">
                <h3 class="font-black text-xs text-indigo-950 uppercase border-b pb-1">2. Análises Diagnóstico cualitativo (Procesamiento IA Pedagógica)</h3>
                
                <div class="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl text-xs space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="bg-indigo-600 text-white font-black text-[10px] px-2 py-0.5 rounded">NIVEL DE AUTONOMÍA ALCANZADO</span>
                        <span class="font-black text-indigo-950">${nivelAutonomia}</span>
                    </div>
                    <p class="text-slate-700 leading-relaxed font-semibold">${analisisRazonamiento}</p>
                </div>

                <div>
                    <h4 class="font-black text-xs text-slate-700 uppercase mb-2">3. Sugerencias e Intervenciones Pedagógicas Recomendadas:</h4>
                    <ul class="list-disc list-inside text-xs font-semibold text-slate-700 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        ${recomendacionesIA.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- PIE DE PÁGINA Y FIRMAS INSTITUCIONALES -->
            <div class="pt-8 border-t border-slate-300 space-y-6">
                <div class="flex justify-between items-end text-center text-xs font-bold text-slate-600 pt-6">
                    <div class="border-t border-slate-400 w-48 pt-1">
                        <p class="font-black text-slate-800">${APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Educador PIE'}</p>
                        <p class="text-[10px] text-slate-400">Educador / Especialista Evaluador</p>
                    </div>
                    <div class="border-t border-slate-400 w-48 pt-1">
                        <p class="font-black text-slate-800">${st.directorName || 'Dirección Académica'}</p>
                        <p class="text-[10px] text-slate-400">Firma y Sello Institucional</p>
                    </div>
                </div>

                <div class="text-center text-[10px] text-slate-400 font-semibold border-t pt-2">
                    ${st.footerText || DEFAULT_SETTINGS.footerText}
                </div>
            </div>
        </div>
    `;

    const reportModal = document.getElementById('aiReportModal');
    const container = document.getElementById('aiReportContainer');

    if (container && reportModal) {
        container.innerHTML = reportHtml;
        window.currentReportEvalId = evalId;
        reportModal.classList.remove('hidden');
    }
}

function closeAIReportModal() {
    const reportModal = document.getElementById('aiReportModal');
    if (reportModal) reportModal.classList.add('hidden');
}

function printCurrentReport() {
    const reportContent = document.getElementById('printableReport')?.outerHTML;
    if (!reportContent) return;

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Informe Pedagógico NEE - PDF</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    @media print {
                        body { padding: 0; margin: 0; }
                        #printableReport { border: none !important; box-shadow: none !important; width: 100% !important; max-width: 100% !important; }
                    }
                </style>
            </head>
            <body class="bg-white p-6">
                ${reportContent}
                <script>
                    setTimeout(() => { window.print(); window.close(); }, 750);
                </script>
            </body>
        </html>
    `);
    win.document.close();
}

function sendReportByEmail() {
    const ev = (APP_STATE.evaluations || []).find(x => String(x.id) === String(window.currentReportEvalId));
    if (!ev) return alert("Selecciona primero un informe válido.");

    const destEmail = prompt("Ingresa el correo electrónico del apoderado o docente destinatario:");
    if (!destEmail) return;

    if (typeof emailjs !== 'undefined') {
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                to_email: destEmail,
                to_name: ev.studentName,
                user_rut: ev.rut || 'N/A',
                user_pin: 'Informe Pedagógico Disponible',
                app_url: window.location.href
            },
            EMAILJS_CONFIG.publicKey
        ).then(() => {
            alert("📧 Informe enviado con éxito a: " + destEmail);
        }).catch(err => alert("Error enviando correo: " + err.message));
    }
}

// ------------------------------------------
// PESTAÑA 4: GESTIÓN CENTRALIZADA DE USUARIOS, CURSOS Y ADMINISTRADORES
// ------------------------------------------
function renderTeacherUsersTab() {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';

    return `
        <div class="space-y-6">
            <!-- SECCIÓN 1: CURSOS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <div>
                        <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                            <span>🏫</span>
                            <span>Gestión de Cursos e Itinerarios</span>
                        </h3>
                        <p class="text-xs text-slate-500 font-bold">Organiza los niveles educativos de los alumnos.</p>
                    </div>
                    <button onclick="addNewCoursePrompt()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow active:scale-95">
                        + Crear Nuevo Curso
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    ${(APP_STATE.courses || []).length === 0 ? `
                        <p class="col-span-full text-xs text-slate-400 italic text-center py-2">No hay cursos registrados. Haz clic en '+ Crear Nuevo Curso'.</p>
                    ` : (APP_STATE.courses || []).map(c => `
                        <div class="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center font-bold text-xs">
                            <span class="text-slate-800 font-black">${c.name}</span>
                            <button onclick="deleteCourse('${c.id}')" class="text-rose-600 hover:text-rose-800 font-black px-2 py-1 rounded-lg bg-rose-50">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- SECCIÓN 2: ADMINISTRADORES GENERALES, EDUCADORES Y ALUMNOS -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- ADMINISTRADORES GENERALES -->
                <div class="bg-white p-5 rounded-3xl border-4 border-purple-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                            <span>🔑</span> Administradores General
                        </h3>
                        ${isAdmin ? `<button onclick="openCreateUserModal('admin')" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Admin</button>` : `<span class="text-[10px] font-black text-slate-400">Protegido</span>`}
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                        ${renderUserRoleList('admin')}
                    </div>
                </div>

                <!-- EDUCADORES / DOCENTES PIE -->
                <div class="bg-white p-5 rounded-3xl border-4 border-indigo-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                            <span>👨‍🏫</span> Educadores PIE
                        </h3>
                        ${isAdmin ? `<button onclick="openCreateUserModal('teacher')" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Educador</button>` : `<span class="text-[10px] font-black text-slate-400">Protegido</span>`}
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                        ${renderUserRoleList('teacher')}
                    </div>
                </div>

                <!-- ALUMNOS / ESTUDIANTES -->
                <div class="bg-white p-5 rounded-3xl border-4 border-emerald-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                            <span>🎒</span> Estudiantes
                        </h3>
                        <button onclick="openCreateUserModal('student')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Alumno</button>
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                        ${renderUserRoleList('student')}
                    </div>
                </div>

            </div>
        </div>
    `;
}

function renderUserRoleList(role) {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const users = (APP_STATE.users || []).filter(u => u.role === role);
    if (users.length === 0) return `<p class="text-xs text-slate-400 italic py-4 text-center">No hay registros cargados.</p>`;

    return users.map(u => `
        <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-xs font-bold">
            <div class="flex justify-between items-center">
                <span class="text-indigo-950 font-black">${u.name}</span>
                <div class="space-x-1">
                    ${(isAdmin || role === 'student') ? `
                        <button onclick="openEditUserModal('${u.id}')" class="text-amber-600 hover:text-amber-800 font-extrabold">✏️</button>
                        <button onclick="deleteUser('${u.id}')" class="text-rose-600 hover:text-rose-800 font-extrabold">✕</button>
                    ` : ''}
                </div>
            </div>
            <div class="text-[11px] text-slate-600">
                <div>RUT: <b>${u.rut || 'N/A'}</b> | Clave/PIN: <code class="bg-slate-200 px-1 py-0.5 rounded text-indigo-900 font-black">${u.pin}</code></div>
                <div>📧 ${u.email || 'Sin correo'}</div>
            </div>
            ${(isAdmin || role === 'student') ? `
                <div class="flex gap-1 pt-1">
                    <button onclick="resetUserPassword('${u.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black px-2 py-1 rounded-xl text-[10px] w-full">🔄 Reset Clave</button>
                    <button onclick="sendAutomaticCredentialsEmail(APP_STATE.users.find(x=>x.id==='${u.id}'))" class="bg-sky-100 hover:bg-sky-200 text-sky-900 font-black px-2 py-1 rounded-xl text-[10px] w-full">✉️ Correo</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function addNewCoursePrompt() {
    const courseName = prompt("Ingresa el nombre del nuevo curso (Ej: 1° Básico A, Taller Laboral 2):");
    if (!courseName || !courseName.trim() || !db) return;

    const id = 'course-' + Date.now();
    db.collection('courses').doc(id).set({
        id: id,
        name: courseName.trim()
    }).then(() => {
        alert(`✅ Curso "${courseName}" creado exitosamente.`);
    }).catch(err => alert("Error al guardar curso: " + err.message));
}

function deleteCourse(courseId) {
    if (confirm("¿Eliminar este curso del sistema?") && db) {
        db.collection('courses').doc(courseId).delete();
    }
}

// ------------------------------------------
// PESTAÑA 5: CONFIGURACIÓN DE PLANTILLA E INSTITUCIÓN
// ------------------------------------------
function renderTeacherSettingsTab() {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;

    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-4xl mx-auto">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>⚙️</span>
                    <span>Diseñador de Plantilla Institucional de Informes (PDF)</span>
                </h3>
                <p class="text-xs text-slate-500 font-bold mt-1">Configura el membrete, logo y firmas institucionales para los informes en PDF emitidos por los educadores.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Nombre de la Escuela / Institución:</label>
                        <input type="text" id="settingSchoolName" value="${st.schoolName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Subtítulo o Unidad (Ej: Programa PIE):</label>
                        <input type="text" id="settingSubHeader" value="${st.schoolSubHeader || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Firma / Nombre Dirección Académica:</label>
                        <input type="text" id="settingDirectorName" value="${st.directorName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Pie de Página Oficial PDF:</label>
                        <textarea id="settingFooterText" rows="2" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-indigo-500">${st.footerText || ''}</textarea>
                    </div>
                </div>

                <div class="space-y-4 flex flex-col justify-between">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Logo Institucional Escolar (Cargar Imagen):</label>
                        <input type="file" accept="image/*" onchange="handleSchoolLogoUpload(event)" class="w-full text-xs font-bold text-slate-600 border border-slate-300 p-2 rounded-xl">
                        <input type="hidden" id="settingSchoolLogo" value="${st.schoolLogo || ''}">
                    </div>

                    <div class="border-2 border-dashed border-indigo-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 bg-indigo-50/50">
                        <span class="text-xs font-black text-indigo-900">Vista Previa del Logo</span>
                        <div id="schoolLogoPreviewContainer" class="w-full h-28 flex items-center justify-center">
                            ${st.schoolLogo ? `<img src="${st.schoolLogo}" class="h-full object-contain">` : `<span class="text-xs text-slate-400 font-bold">Sin logo seleccionado</span>`}
                        </div>
                    </div>

                    <button onclick="saveInstitutionalSettings()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-lg border-b-4 border-emerald-900 active:scale-95 text-xs uppercase">
                        💾 Guardar Configuración de Plantilla PDF
                    </button>
                </div>
            </div>
        </div>
    `;
}

function handleSchoolLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 300, 300).then(compressed => {
            document.getElementById('settingSchoolLogo').value = compressed;
            const container = document.getElementById('schoolLogoPreviewContainer');
            if (container) container.innerHTML = `<img src="${compressed}" class="h-full object-contain">`;
        });
    };
    reader.readAsDataURL(file);
}

function saveInstitutionalSettings() {
    if (!db) return alert("Firebase no está preparado.");

    const settingsData = {
        schoolName: document.getElementById('settingSchoolName').value.trim(),
        schoolSubHeader: document.getElementById('settingSubHeader').value.trim(),
        directorName: document.getElementById('settingDirectorName').value.trim(),
        footerText: document.getElementById('settingFooterText').value.trim(),
        schoolLogo: document.getElementById('settingSchoolLogo').value
    };

    db.collection('settings').doc('institutional').set(settingsData, { merge: true }).then(() => {
        APP_STATE.settings = settingsData;
        alert("✅ Configuración e insignia de la escuela guardadas exitosamente.");
    }).catch(err => alert("Error guardando plantilla: " + err.message));
}

// ------------------------------------------
// PESTAÑAS SECUNDARIAS (CATÁLOGO Y CURRENCY)
// ------------------------------------------
function renderTeacherCatalogTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-3xl border-4 border-emerald-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <span>🏪</span> <span>Gestión de Supermercados</span>
                    </h3>
                    <button onclick="openSupermarketModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow border-b-2 border-emerald-800 active:scale-95">
                        + Crear Supermercado
                    </button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
                    ${(APP_STATE.supermarkets || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay supermercados creados.</p>
                    ` : (APP_STATE.supermarkets || []).map(s => {
                        const supImgUrl = s.photoUrl || s.photo || s.imageUrl || s.logoUrl || '';
                        const supImg = supImgUrl 
                            ? `<img src="${supImgUrl}" class="w-12 h-12 object-cover rounded-xl border border-slate-200">`
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
                        <span>📦</span> <span>Catálogo de Productos (${(APP_STATE.products || []).length})</span>
                    </h3>
                    <div class="flex gap-1.5 flex-wrap">
                        <button onclick="deleteAllProducts()" class="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-2.5 py-2 rounded-xl shadow active:scale-95">
                            🗑️ Eliminar Todos
                        </button>
                        <button onclick="openCategoryModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-2.5 py-2 rounded-xl shadow active:scale-95">
                            + Categoría
                        </button>
                        <button onclick="openProductModal()" class="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-2.5 py-2 rounded-xl shadow border-b-2 border-amber-700 active:scale-95">
                            + Crear Producto
                        </button>
                    </div>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
                    ${(APP_STATE.products || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay productos ingresados aún en el catálogo.</p>
                    ` : (APP_STATE.products || []).map(p => {
                        const prodImg = p.photoUrl 
                            ? `<img src="${p.photoUrl}" class="w-12 h-12 object-cover rounded-xl border border-slate-200">`
                            : `<span class="text-2xl">${p.iconEmoji || '📦'}</span>`;
                        
                        const isAll = p.isAll || p.supermarketId === 'ALL' || p.supermarketName === 'TODOS';
                        const supTag = isAll ? 'TODOS' : (p.supermarketName || p.supermarketId || 'General');

                        return `
                            <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center text-xs font-bold">
                                <div class="flex items-center space-x-3">
                                    ${prodImg}
                                    <div>
                                        <h4 class="font-black text-slate-800 text-sm">${p.name || 'Producto'}</h4>
                                        <span class="text-emerald-700 font-black">$${(p.price || 0).toLocaleString('es-CL')}</span>
                                        <span class="text-indigo-900 font-bold"> [${supTag}]</span>
                                        <span class="text-slate-400 font-normal"> - ${p.category || 'General'}</span>
                                    </div>
                                </div>
                                <div class="space-x-1">
                                    <button onclick="openProductModal('${p.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1.5 rounded-xl border border-amber-300 font-extrabold">✏️</button>
                                    <button onclick="deleteProduct('${p.id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-900 px-2.5 py-1.5 rounded-xl border border-rose-300 font-extrabold">✕</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderTeacherCurrencyTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>💵</span> <span>Personalización de Billetes y Monedas (CLP)</span>
                </h3>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                ${CLP_CURRENCY_ITEMS.map(item => `
                    <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-3xl flex flex-col items-center text-center space-y-3">
                        <span class="text-xs font-black text-slate-800">${item.name}</span>
                        <div class="w-full h-24 bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                            <img src="${APP_STATE.customCurrencies[item.id] || item.img}" class="w-full h-full object-contain">
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// MÓDULO ESTUDIANTE Y COMPRAS
// ==========================================
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

function renderHomeView(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800">¡Bienvenido a Comprar! 🛍️</h2>
                <p class="text-slate-600 font-medium">Elige un supermercado para comenzar tu compra.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${(APP_STATE.supermarkets || []).map(sup => {
                    const supImgUrl = sup.photoUrl || sup.photo || sup.imageUrl || sup.logoUrl || '';
                    const iconHtml = supImgUrl 
                        ? `<img src="${supImgUrl}" class="w-24 h-24 object-cover rounded-3xl shadow-md border-2 border-slate-200">`
                        : `<div class="bg-amber-400 p-4 rounded-3xl text-5xl flex items-center justify-center w-24 h-24 shadow-sm">${sup.icon || '🛒'}</div>`;
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

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => 
        String(s.id).toLowerCase() === String(supId).toLowerCase() ||
        String(s.name).toLowerCase() === String(supId).toLowerCase()
    );

    const targetId = sup ? String(sup.id).toLowerCase() : String(supId).toLowerCase();
    const targetName = sup ? String(sup.name).toLowerCase() : String(supId).toLowerCase();

    let rawProducts = (APP_STATE.products || []).filter(p => {
        if (!p) return false;
        if (p.isAll === true || p.supermarketId === 'ALL' || p.supermarketName === 'TODOS') return true;
        const pSupId = String(p.supermarketId || p.supermarket || '').toLowerCase();
        const pSupName = String(p.supermarketName || p.tienda || '').toLowerCase();
        return (pSupId === targetId || pSupId === targetName || pSupName === targetId || pSupName === targetName);
    });

    const uniqueProducts = [];
    const seen = new Set();
    rawProducts.forEach(p => {
        const key = `${(p.name || '').trim().toLowerCase()}_${p.price}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueProducts.push(p);
        }
    });

    const supImgUrl = sup ? (sup.photoUrl || sup.photo || sup.imageUrl || sup.logoUrl || '') : '';
    const supIconHtml = supImgUrl 
        ? `<img src="${supImgUrl}" class="w-12 h-12 object-cover rounded-2xl border border-slate-200 shadow-sm">`
        : `<span class="text-3xl">${sup ? (sup.icon || '🏪') : '🏪'}</span>`;

    const productsHtml = uniqueProducts.length === 0 ? `
        <div class="col-span-full text-center py-12 bg-white rounded-3xl border-4 border-slate-200 shadow-sm">
            <span class="text-5xl">📦</span>
            <h3 class="text-lg font-black text-slate-700 mt-2">No hay productos disponibles</h3>
            <p class="text-xs font-bold text-slate-400">El catálogo está vacío o no hay productos en esta tienda.</p>
        </div>
    ` : uniqueProducts.map(prod => {
        const prodImg = prod.photoUrl 
            ? `<img src="${prod.photoUrl}" class="w-16 h-16 object-cover rounded-2xl border border-slate-200 shadow-sm">`
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
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs">← Volver</button>
                <div class="flex items-center gap-3">
                    ${supIconHtml}
                    <h2 class="text-2xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
                </div>
                <div></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${productsHtml}
            </div>
        </div>
    `;
}

function updateBasketBadge() {
    const badge = document.getElementById('basketBadge');
    if (badge) badge.textContent = (APP_STATE.basket || []).length;
}

function addToBasket(prodId) {
    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(prodId));
    if (!prod) return;
    APP_STATE.basket.push({ productId: prod.id, quantity: 1 });
    updateBasketBadge();
}

// ==========================================
// GESTIÓN DE MODALES DE USUARIOS (ADMIN, TEACHER, STUDENT)
// ==========================================
function openCreateUserModal(role) {
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = '';
        document.getElementById('modalUserRole').value = role;
        document.getElementById('modalName').value = '';
        document.getElementById('modalRut').value = '';
        document.getElementById('modalEmail').value = '';
        document.getElementById('modalPhotoUrl').value = '';
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
    const photoUrl = document.getElementById('modalPhotoUrl').value;

    if (!name || !rut || !db) return alert("Completa el nombre y RUT.");

    const id = userId || ('u-' + Date.now());
    const pin = rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';

    db.collection('users').doc(id).set({
        id, role, name, rut, username: rut, email, pin
    }, { merge: true }).then(() => {
        closeUserModal();
        alert("✅ Usuario guardado exitosamente.");
    });
}

function deleteUser(id) {
    if (confirm("¿Eliminar este usuario del sistema?") && db) {
        db.collection('users').doc(id).delete();
    }
}

function resetUserPassword(userId) {
    const user = (APP_STATE.users || []).find(u => String(u.id) === String(userId));
    if (!user || !db) return;

    const initialPin = user.rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';
    db.collection('users').doc(userId).update({ pin: initialPin }).then(() => {
        alert(`🔒 Clave de ${user.name} reiniciada a: ${initialPin}`);
    });
}

function sendAutomaticCredentialsEmail(user) {
    if (!user || !user.email) return alert("El usuario no tiene un correo registrado.");
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
        ).then(() => alert("✉️ Credenciales enviadas por correo a: " + user.email));
    }
}

// ==========================================
// CONTROLADORES DE MODALES DE PRODUCTOS Y CATEGORÍAS
// ==========================================
function updateCategoryDropdowns(selectedName = null) {
    const catSelect = document.getElementById('modalProdCategory');
    if (!catSelect) return;
    const list = (APP_STATE.categories && APP_STATE.categories.length > 0) ? APP_STATE.categories : DEFAULT_CATEGORIES;
    catSelect.innerHTML = list.map(c => `<option value="${c.name}" ${selectedName === c.name ? 'selected' : ''}>${c.icon || '🏷️'} ${c.name}</option>`).join('');
}

function openProductModal(prodId = null) {
    const supSelect = document.getElementById('modalProdSupermarket');
    if (supSelect) supSelect.innerHTML = (APP_STATE.supermarkets || []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    updateCategoryDropdowns();

    const titleEl = document.getElementById('prodModalTitle');
    const idInput = document.getElementById('modalProdId');
    const nameInput = document.getElementById('modalProdName');
    const priceInput = document.getElementById('modalProdPrice');
    const repInput = document.getElementById('modalProdReplicateAll');

    if (prodId) {
        const p = (APP_STATE.products || []).find(item => String(item.id) === String(prodId));
        if (p) {
            if (titleEl) titleEl.textContent = 'Editar Producto';
            if (idInput) idInput.value = p.id;
            if (nameInput) nameInput.value = p.name || '';
            if (priceInput) priceInput.value = p.price || '';
            if (repInput) repInput.checked = (p.isAll || p.supermarketId === 'ALL');
        }
    } else {
        if (titleEl) titleEl.textContent = 'Crear Producto';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '';
        if (repInput) repInput.checked = false;
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
    const supId = supSelect ? supSelect.value : null;

    const name = document.getElementById('modalProdName').value.trim();
    const categorySelect = document.getElementById('modalProdCategory');
    const category = categorySelect ? categorySelect.value : 'General';
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;

    if (!name || isNaN(price) || !db) return alert("Ingresa un nombre y precio válidos.");

    const id = prodId ? prodId : ('prod-' + Date.now());

    db.collection('products').doc(id).set({
        id: id,
        name: name,
        category: category,
        price: price,
        isAll: replicateAll,
        supermarketId: replicateAll ? 'ALL' : supId,
        supermarketName: replicateAll ? 'TODOS' : ((APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId))?.name || 'Supermercado')
    }, { merge: true }).then(() => {
        closeProductModal();
        alert(`✅ Producto "${name}" guardado.`);
    });
}

async function deleteAllProducts() {
    if (!confirm("⚠️ ¿Estás seguro de que deseas eliminar TODOS los productos del catálogo?")) return;

    try {
        if (!db) return;
        const snapshot = await db.collection('products').get();
        const docs = [...snapshot.docs];
        while (docs.length > 0) {
            const chunk = docs.splice(0, 400);
            const batch = db.batch();
            chunk.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }
        APP_STATE.products = [];
        renderApp();
        alert("🗑️ ¡Productos eliminados con éxito!");
    } catch (err) {
        alert("Error: " + err.message);
    }
}

function deleteProduct(prodId) {
    if (confirm("¿Eliminar este producto?") && db) {
        db.collection('products').doc(prodId).delete();
    }
}

function openSupermarketModal(supId = null) {
    const el = document.getElementById('supermarketModal');
    if (el) {
        document.getElementById('modalSupId').value = supId || '';
        document.getElementById('modalSupName').value = '';
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
    if (!name || !db) return alert("Ingresa el nombre.");
    const id = supId || ('sup-' + Date.now());
    db.collection('supermarkets').doc(id).set({ id, name, icon: '🏪', description: 'Supermercado' }, { merge: true }).then(() => {
        closeSupermarketModal();
        alert("✅ Supermercado guardado.");
    });
}

function openCategoryModal() {
    const el = document.getElementById('categoryModal');
    if (el) el.classList.remove('hidden');
}
function closeCategoryModal() {
    const el = document.getElementById('categoryModal');
    if (el) el.classList.add('hidden');
}

function saveCategoryFromModal() {
    const catId = document.getElementById('modalCatId').value;
    const name = document.getElementById('modalCatName').value.trim();
    if (!name || !db) return alert("Ingresa nombre de categoría.");
    const id = catId || ('cat-' + Date.now());
    db.collection('categories').doc(id).set({ id, name, icon: '🏷️' }).then(() => {
        closeCategoryModal();
        updateCategoryDropdowns(name);
        alert(`✅ Categoría "${name}" guardada.`);
    });
}

// ==========================================
// ESCUCHADORES FIRESTORE EN TIEMPO REAL
// ==========================================
function initFirebaseListeners() {
    const storedUser = localStorage.getItem('nee_active_user');
    if (storedUser) {
        try { APP_STATE.currentUser = JSON.parse(storedUser); } catch(e) {}
    }

    if (!db) return;

    db.collection('users').onSnapshot(s => { 
        APP_STATE.users = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        renderApp(); 
    });

    db.collection('courses').onSnapshot(s => { 
        APP_STATE.courses = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        renderApp(); 
    });

    db.collection('categories').onSnapshot(s => { 
        const firebaseCats = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        APP_STATE.categories = firebaseCats.length > 0 ? firebaseCats : [...DEFAULT_CATEGORIES];
        updateCategoryDropdowns(); 
        renderApp(); 
    });

    db.collection('supermarkets').onSnapshot(s => { 
        const firebaseSups = s.docs.map(d => ({ id: d.id, ...d.data() })); 
        APP_STATE.supermarkets = firebaseSups.length > 0 ? firebaseSups : [...DEFAULT_SUPERMARKETS];
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

    db.collection('settings').doc('institutional').onSnapshot(doc => {
        if (doc.exists) {
            APP_STATE.settings = { ...DEFAULT_SETTINGS, ...doc.data() };
        }
    });
}

// Inicialización de la aplicación
initFirebaseListeners();
renderApp();

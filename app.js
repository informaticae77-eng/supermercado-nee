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
// ESTADO GLOBAL
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
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
    pdfTemplate: {
        institutionName: "Escuela Especial NEE Chile",
        headerTitle: "INFORME DE EVALUACIÓN PEDAGÓGICA Y COGNITIVA",
        footerText: "Documento oficial del Equipo Multidisciplinario PIE",
        primaryColor: "#3730a3",
        logoUrl: ""
    },
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

function getUserCourseIds(user) {
    if (!user) return [];
    if (Array.isArray(user.courseIds) && user.courseIds.length > 0) return user.courseIds;
    if (user.courseId) return [user.courseId];
    return [];
}

function getCategoryIcon(catName) {
    if (!catName) return '🏷️';
    const catObj = (APP_STATE.categories || []).find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (catObj && catObj.icon) return catObj.icon;
    return '🏷️';
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
// CICLO PRINCIPAL DE RENDERIZADO
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

    if (APP_STATE.currentUser.role === 'admin') {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderAdminDashboard(container);
    } else if (APP_STATE.currentUser.role === 'teacher') {
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
    localStorage.removeItem('nee_active_user');
    renderApp();
}

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

// ==========================================
// VISTAS DE PANELES
// ==========================================
function renderAdminDashboard(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 class="text-2xl font-black">👑 Panel de Administración</h2>
                    <p class="text-xs text-indigo-200 mt-1">Gestión completa de Cursos, Educadores, Alumnos y Claves.</p>
                </div>
                <div class="bg-indigo-800 px-3 py-1.5 rounded-xl border border-indigo-700 flex items-center gap-2">
                    <label class="text-xs font-bold uppercase text-indigo-200">Filtrar por Curso:</label>
                    <select id="adminCourseFilter" onchange="filterAdminByCourse(this.value)" class="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-lg">
                        <option value="all" ${APP_STATE.adminCourseFilter === 'all' ? 'selected' : ''}>Todos los Cursos</option>
                        ${(APP_STATE.courses || []).map(c => `<option value="${c.id}" ${APP_STATE.adminCourseFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
            </div>

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

function renderTeacherDashboard(container) {
    const totalEvals = (APP_STATE.evaluations || []).length;
    const avgTime = totalEvals > 0 ? Math.round(APP_STATE.evaluations.reduce((a, e) => a + (e.timeSeconds || 0), 0) / totalEvals) : 0;

    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4 border-b-4 border-indigo-700">
                <div>
                    <h2 class="text-2xl font-black flex items-center gap-2">
                        <i class="fa-solid fa-chart-line text-amber-400"></i>
                        <span>Centro de Evaluación y Métrica NEE</span>
                    </h2>
                    <p class="text-xs text-indigo-200 mt-1">Monitoreo pedagógico y gestión del catálogo.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="openTeacherCourseModal()" class="bg-indigo-700 hover:bg-indigo-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 border border-indigo-500">Mis Cursos</button>
                    <button onclick="openCreateUserModal('student')" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-3.5 py-2 rounded-xl shadow">+ Crear Alumno</button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-2xl border-2 border-indigo-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-slate-500 uppercase block">Compras Registradas</span>
                        <span class="text-2xl font-black text-indigo-950">${totalEvals}</span>
                    </div>
                    <div class="bg-indigo-100 text-indigo-600 p-3 rounded-xl text-xl">🛍️</div>
                </div>
                <div class="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-slate-500 uppercase block">Promedio Búsqueda</span>
                        <span class="text-2xl font-black text-emerald-700">${Math.floor(avgTime / 60)}m ${avgTime % 60}s</span>
                    </div>
                    <div class="bg-emerald-100 text-emerald-600 p-3 rounded-xl text-xl">⏱️</div>
                </div>
                <div class="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-slate-500 uppercase block">Alumnos Activos</span>
                        <span class="text-2xl font-black text-amber-900">${(APP_STATE.users || []).filter(u => u.role === 'student').length}</span>
                    </div>
                    <div class="bg-amber-100 text-amber-600 p-3 rounded-xl text-xl">🎒</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-5 rounded-3xl border-4 border-emerald-200 shadow space-y-3">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm">🏪 Supermercados Creados</h3>
                        <button onclick="openSupermarketModal()" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Crear</button>
                    </div>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${(APP_STATE.supermarkets || []).map(s => `
                            <div class="p-2 bg-slate-50 border rounded-xl flex justify-between items-center text-xs font-bold">
                                <span>${s.icon || '🏪'} ${s.name}</span>
                                <button onclick="openSupermarketModal('${s.id}')" class="text-amber-600">✏️ Editar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-amber-200 shadow space-y-3">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm">🍎 Productos y Categorías</h3>
                        <div class="flex gap-2">
                            <button onclick="openCategoryModal()" class="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Categoría</button>
                            <button onclick="openProductModal()" class="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Producto</button>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${(APP_STATE.products || []).map(p => `
                            <div class="p-2 bg-slate-50 border rounded-xl flex justify-between items-center text-xs font-bold">
                                <span>${p.iconEmoji || '📦'} ${p.name} ($${p.price})</span>
                                <button onclick="openProductModal('${p.id}')" class="text-amber-600">✏️ Editar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderHomeView(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800">¡Bienvenido a Comprar! 🛍️</h2>
                <p class="text-slate-600 font-medium">Elige un supermercado para comenzar tu compra.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${(APP_STATE.supermarkets || []).map(sup => `
                    <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-lg hover:shadow-2xl cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95">
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
                <button onclick="goHome()" class="bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl">← Volver</button>
                <h2 class="text-2xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${products.map(prod => `
                    <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                        <div class="flex items-center space-x-4">
                            <span class="text-4xl">${prod.iconEmoji || '📦'}</span>
                            <div>
                                <h3 class="text-lg font-black text-slate-800">${prod.name}</h3>
                                <div class="text-2xl font-black text-emerald-700">$${prod.price.toLocaleString('es-CL')}</div>
                            </div>
                        </div>
                        <button onclick="addToBasket('${prod.id}')" class="bg-emerald-600 text-white font-black py-3 rounded-xl shadow border-b-4 border-emerald-800">Añadir al Canasto</button>
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
    renderAdminDashboard(document.getElementById('appContainer'));
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
        closeSupermarket

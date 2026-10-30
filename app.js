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
// DATOS DE RESPALDO (SOLO PARA BOTÓN DE EJEMPLO)
// ==========================================
const DEFAULT_SUPERMARKETS = [
    { id: 'sup-lider', name: 'LIDER', icon: '🛒', description: 'Supermercado Lider - Variedad y Ofertas', photoUrl: '' },
    { id: 'sup-jumbo', name: 'JUMBO', icon: '🐘', description: 'Supermercado Jumbo - Excelente Calidad', photoUrl: '' },
    { id: 'sup-santa', name: 'SANTA ISABEL', icon: '🛍️', description: 'Santa Isabel - Tu Almacén Cercano', photoUrl: '' },
    { id: 'sup-unimarc', name: 'UNIMARC', icon: '🍎', description: 'Unimarc - El Supermercado de Chile', photoUrl: '' }
];

const DEFAULT_PRODUCTS = [
    { id: 'p-lider-1', supermarketId: 'sup-lider', supermarketName: 'LIDER', name: 'Leche Entera 1L', price: 1050, iconEmoji: '🥛', category: 'Lácteos', photoUrl: '', isAll: false },
    { id: 'p-lider-2', supermarketId: 'sup-lider', supermarketName: 'LIDER', name: 'Pan Hallulla 1Kg', price: 1890, iconEmoji: '🍞', category: 'Panadería', photoUrl: '', isAll: false },
    { id: 'p-lider-3', supermarketId: 'sup-lider', supermarketName: 'LIDER', name: 'Manzanas Rojas 1Kg', price: 1200, iconEmoji: '🍎', category: 'Frutas', photoUrl: '', isAll: false },
    { id: 'p-lider-4', supermarketId: 'sup-lider', supermarketName: 'LIDER', name: 'Arroz Grado 1 (1Kg)', price: 1350, iconEmoji: '🌾', category: 'Abarrotes', photoUrl: '', isAll: false }
];

// ==========================================
// COMPRESOR AUTOMÁTICO DE IMÁGENES
// ==========================================
function compressImageBase64(base64Data, maxWidth = 300, maxHeight = 300, quality = 0.7) {
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
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    teacherActiveTab: 'home',
    teacherPreviewMode: false,
    adminCourseFilter: 'all',
    basket: [],
    userPaidAmount: 0,
    courses: [],
    categories: [],
    users: [],
    supermarkets: [...DEFAULT_SUPERMARKETS],
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

function seedSampleData() {
    if (!db) return alert("Firebase no está listo.");

    const batch = db.batch();
    DEFAULT_SUPERMARKETS.forEach(s => batch.set(db.collection('supermarkets').doc(s.id), s));
    DEFAULT_PRODUCTS.forEach(p => batch.set(db.collection('products').doc(p.id), p));

    batch.commit().then(() => {
        alert("✅ Base de datos cargada con datos de ejemplo.");
    }).catch(err => alert("Error cargando ejemplo: " + err.message));
}

// ==========================================
// ELIMINACIÓN DEFINITIVA EN FIREBASE
// ==========================================
async function deleteAllProducts() {
    if (!confirm("⚠️ ¿Estás seguro de que deseas eliminar TODOS los productos del catálogo?")) return;

    try {
        if (db) {
            const snapshot = await db.collection('products').get();
            if (!snapshot.empty) {
                const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
                await Promise.all(deletePromises);
            }
        }
        APP_STATE.products = [];
        renderApp();
        alert("🗑️ Todos los productos han sido eliminados correctamente de Firebase.");
    } catch (err) {
        console.error("Error al eliminar productos:", err);
        alert("❌ Error al eliminar en Firebase: " + err.message);
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
// PANEL DOCENTE
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
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-bold">
                            ${totalEvals === 0 ? `
                                <tr>
                                    <td colspan="5" class="py-8 text-center text-slate-400 italic">No hay evaluaciones registradas aún.</td>
                                </tr>
                            ` : (APP_STATE.evaluations || []).map(e => `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-3 text-slate-500">${e.date || 'Reciente'}</td>
                                    <td class="py-3 px-3 font-black text-indigo-950">${e.studentName || 'Estudiante'}</td>
                                    <td class="py-3 px-3">${e.supermarketName || 'Supermercado'}</td>
                                    <td class="py-3 px-3">
                                        <div class="font-black text-emerald-700">$${(e.totalCLP || 0).toLocaleString('es-CL')}</div>
                                    </td>
                                    <td class="py-3 px-3 text-center font-black text-indigo-900">$${(e.changeCLP || 0).toLocaleString('es-CL')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

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
                        <i class="fa-solid fa-boxes-stacked text-amber-600"></i>
                        <span>Catálogo de Productos (${(APP_STATE.products || []).length})</span>
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
                    <i class="fa-solid fa-money-bill-wave text-amber-600"></i>
                    <span>Personalización de Billetes y Monedas (CLP)</span>
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

function renderTeacherUsersTab() {
    return `<div class="p-4 bg-white rounded-3xl border-2 font-bold text-slate-700">Gestión de Usuarios</div>`;
}

// ==========================================
// VISTA DEL ESTUDIANTE CON DEDUPLICACIÓN
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

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => 
        String(s.id).toLowerCase() === String(supId).toLowerCase() ||
        String(s.name).toLowerCase() === String(supId).toLowerCase()
    );

    const targetId = sup ? String(sup.id).toLowerCase() : String(supId).toLowerCase();
    const targetName = sup ? String(sup.name).toLowerCase() : String(supId).toLowerCase();

    // 1. Filtrar productos pertenecientes a la tienda o aplicables a "TODOS"
    let rawProducts = (APP_STATE.products || []).filter(p => {
        if (!p) return false;
        if (p.isAll === true || p.supermarketId === 'ALL' || p.supermarketName === 'TODOS') {
            return true;
        }
        const pSupId = String(p.supermarketId || p.supermarket || '').toLowerCase();
        const pSupName = String(p.supermarketName || p.tienda || '').toLowerCase();

        return (pSupId === targetId || pSupId === targetName || pSupName === targetId || pSupName === targetName);
    });

    // 2. DEDUPLICACIÓN EN TIEMPO REAL POR NOMBRE Y PRECIO
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

// ==========================================
// CANASTO
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
}

function openBasketModal() {
    const el = document.getElementById('basketModal');
    if (el) el.classList.remove('hidden');
}

function closeBasketModal() {
    const el = document.getElementById('basketModal');
    if (el) el.classList.add('hidden');
}

// ==========================================
// CONTROLADORES DE MODALES
// ==========================================
function openProductModal(prodId = null) {
    const supSelect = document.getElementById('modalProdSupermarket');
    if (supSelect) supSelect.innerHTML = (APP_STATE.supermarkets || []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    const titleEl = document.getElementById('prodModalTitle');
    const idInput = document.getElementById('modalProdId');
    const nameInput = document.getElementById('modalProdName');
    const priceInput = document.getElementById('modalProdPrice');
    const emojiInput = document.getElementById('modalProdEmoji');
    const repInput = document.getElementById('modalProdReplicateAll');
    const photoHidden = document.getElementById('modalProdPhoto');

    if (prodId) {
        const p = (APP_STATE.products || []).find(item => String(item.id) === String(prodId));
        if (p) {
            if (titleEl) titleEl.textContent = 'Editar Producto';
            if (idInput) idInput.value = p.id;
            if (nameInput) nameInput.value = p.name || '';
            if (priceInput) priceInput.value = p.price || '';
            if (emojiInput) emojiInput.value = p.iconEmoji || '📦';
            if (repInput) repInput.checked = (p.isAll || p.supermarketId === 'ALL');
            if (photoHidden) photoHidden.value = p.photoUrl || '';
        }
    } else {
        if (titleEl) titleEl.textContent = 'Crear Producto';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '';
        if (emojiInput) emojiInput.value = '📦';
        if (repInput) repInput.checked = false;
        if (photoHidden) photoHidden.value = '';
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
    const category = document.getElementById('modalProdCategory')?.value || 'General';
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const iconEmoji = document.getElementById('modalProdEmoji').value.trim() || '📦';
    const photoUrl = document.getElementById('modalProdPhoto')?.value || '';
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;

    if (!name || isNaN(price) || !db) return alert("Ingresa un nombre y precio válidos.");

    // Un único ID de documento para evitar clonación masiva
    const id = prodId ? prodId : ('prod-' + Date.now());

    const productData = {
        id: id,
        name: name,
        category: category,
        price: price,
        iconEmoji: iconEmoji,
        photoUrl: photoUrl,
        isAll: replicateAll,
        supermarketId: replicateAll ? 'ALL' : supId,
        supermarketName: replicateAll ? 'TODOS' : ((APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId))?.name || 'Supermercado')
    };

    db.collection('products').doc(id).set(productData, { merge: true }).then(() => {
        closeProductModal();
        alert(`✅ Producto "${name}" guardado exitosamente.`);
    }).catch(err => alert("Error al guardar en Firebase: " + err.message));
}

function deleteProduct(prodId) {
    if (confirm("¿Eliminar este producto del catálogo?") && db) {
        db.collection('products').doc(prodId).delete().then(() => alert("Producto eliminado."));
    }
}

// SUPERMERCADOS
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
    if (!name || !db) return alert("Ingresa el nombre del supermercado.");
    const id = supId || ('sup-' + Date.now());

    db.collection('supermarkets').doc(id).set({ id, name, icon: '🏪', description: 'Supermercado' }, { merge: true }).then(() => {
        closeSupermarketModal();
        alert("✅ Supermercado guardado.");
    });
}

// CATEGORÍAS
function openCategoryModal() {
    const el = document.getElementById('categoryModal');
    if (el) el.classList.remove('hidden');
}
function closeCategoryModal() {
    const el = document.getElementById('categoryModal');
    if (el) el.classList.add('hidden');
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

    db.collection('users').onSnapshot(s => { 
        APP_STATE.users = s.docs.map(d => ({ id: d.id, ...d.data() })); 
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
}

// Inicializar la aplicación
initFirebaseListeners();
renderApp();

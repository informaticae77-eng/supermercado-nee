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
    try { firebase.initializeApp(firebaseConfig); } catch(e) {}
}
const db = (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

const EMAILJS_CONFIG = {
    publicKey: "smzqxkKPlFcTigatD",
    serviceId: "service_omucoeg",
    templateId: "template_vyzp71o"
};

if (typeof emailjs !== 'undefined') {
    try { emailjs.init(EMAILJS_CONFIG.publicKey); } catch(e) {}
}

// ==========================================
// DATA URIS DE SVG DE BILLETES Y MONEDAS CHILENAS
// ==========================================
function makeSvgDataUrl(svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

const SVG_B20K_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#e67e22"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#f39c12" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$20.000</text></svg>`;
const SVG_B10K_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#2980b9"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#5499c7" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$10.000</text></svg>`;
const SVG_B5K_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#c0392b"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#ec7063" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$5.000</text></svg>`;
const SVG_B2K_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#8e44ad"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#bb8fce" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$2.000</text></svg>`;
const SVG_B1K_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#27ae60"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#58d68d" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$1.000</text></svg>`;
const SVG_C500_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f39c12"/><circle cx="50" cy="50" r="34" fill="#bdc3c7"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#2c3e50" text-anchor="middle">$500</text></svg>`;
const SVG_C100_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f1c40f"/><circle cx="50" cy="50" r="36" fill="#f39c12"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">$100</text></svg>`;
const SVG_C50_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><polygon points="50,4 82,18 96,50 82,82 50,96 18,18" fill="#bdc3c7"/><circle cx="50" cy="50" r="32" fill="#ecf0f1"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#2c3e50" text-anchor="middle">$50</text></svg>`;
const SVG_C10_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#d35400"/><circle cx="50" cy="50" r="36" fill="#e67e22"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">$10</text></svg>`;

const CLP_CURRENCY_ITEMS = [
    { id: 'b20k', value: 20000, type: 'bill', name: 'Billete $20.000', img: makeSvgDataUrl(SVG_B20K_RAW) },
    { id: 'b10k', value: 10000, type: 'bill', name: 'Billete $10.000', img: makeSvgDataUrl(SVG_B10K_RAW) },
    { id: 'b5k',  value: 5000,  type: 'bill', name: 'Billete $5.000',  img: makeSvgDataUrl(SVG_B5K_RAW) },
    { id: 'b2k',  value: 2000,  type: 'bill', name: 'Billete $2.000',  img: makeSvgDataUrl(SVG_B2K_RAW) },
    { id: 'b1k',  value: 1000,  type: 'bill', name: 'Billete $1.000',  img: makeSvgDataUrl(SVG_B1K_RAW) },
    { id: 'c500', value: 500,   type: 'coin', name: 'Moneda $500',    img: makeSvgDataUrl(SVG_C500_RAW) },
    { id: 'c100', value: 100,   type: 'coin', name: 'Moneda $100',    img: makeSvgDataUrl(SVG_C100_RAW) },
    { id: 'c50',  value: 50,    type: 'coin', name: 'Moneda $50',     img: makeSvgDataUrl(SVG_C50_RAW) },
    { id: 'c10',  value: 10,    type: 'coin', name: 'Moneda $10',     img: makeSvgDataUrl(SVG_C10_RAW) }
];

const DEFAULT_SUPERMARKETS = [
    { id: 'sup-lider', name: 'LIDER', icon: '🛒' },
    { id: 'sup-jumbo', name: 'JUMBO', icon: '🐘' },
    { id: 'sup-santa', name: 'SANTA ISABEL', icon: '🛍️' },
    { id: 'sup-unimarc', name: 'UNIMARC', icon: '🍎' }
];

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Frutas y Verduras', icon: '🍎' },
    { id: 'cat-2', name: 'Lácteos y Bebidas', icon: '🥛' },
    { id: 'cat-3', name: 'Abarrotes y Pan', icon: '🍞' }
];

const DEFAULT_PRODUCTS = [
    { id: 'prod-manzana', name: 'Kilo de Manzanas', price: 1500, iconEmoji: '🍎', aiClass: 'apple', category: 'Frutas y Verduras', isAll: true },
    { id: 'prod-platano', name: 'Kilo de Plátanos', price: 1200, iconEmoji: '🍌', aiClass: 'banana', category: 'Frutas y Verduras', isAll: true },
    { id: 'prod-bebida', name: 'Botella de Bebida', price: 1800, iconEmoji: '🍾', aiClass: 'bottle', category: 'Lácteos y Bebidas', isAll: true },
    { id: 'prod-pan', name: 'Caja de Cereal / Pan', price: 2200, iconEmoji: '🥣', aiClass: 'bowl', category: 'Abarrotes y Pan', isAll: true }
];

const DEFAULT_SETTINGS = {
    schoolName: "Escuela Especial & Programa PIE",
    schoolSubHeader: "Unidad de Autonomía Funcional Gamificada",
    schoolLogo: "",
    directorName: "Equipo PIE"
};

const DEFAULT_ADMIN = {
    id: 'u-admin-default',
    name: 'Sergio Pinto',
    rut: '12345678-9',
    username: '12345678-9',
    pin: '1234',
    role: 'admin',
    email: 'admin@escuela.cl'
};

const AI_CLASS_TRANSLATIONS = {
    'apple': 'Manzana / Fruta 🍎',
    'banana': 'Plátano 🍌',
    'bottle': 'Botella / Bebida 🍾',
    'cup': 'Vaso / Taza 🥤',
    'bowl': 'Bowl / Cereal 🥣',
    'book': 'Caja / Cuaderno 📚'
};

// ==========================================
// ESTADO GLOBAL
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    teacherActiveTab: 'home',
    teacherPreviewMode: false,
    targetMissionList: [], 
    foundMissionItems: [], 
    basket: [],            
    userPaidAmount: 0,
    userPaidItems: [],
    courses: [],
    categories: [...DEFAULT_CATEGORIES],
    users: [DEFAULT_ADMIN],
    supermarkets: [...DEFAULT_SUPERMARKETS],
    products: [...DEFAULT_PRODUCTS],
    evaluations: [],
    customCurrencies: {},
    settings: { ...DEFAULT_SETTINGS },
    telemetry: {
        voiceHelpCount: 0,
        aiRecognitionsCount: 0,
        incorrectAttempts: 0
    },
    missionStartTime: null,
    cocoModel: null,
    isDetectingAI: false,
    webcamStream: null
};

// ==========================================
// UTILIDADES DE AUDIO, VOZ E IMAGEN
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

function compressImageBase64(base64Data, maxWidth = 300, maxHeight = 300, quality = 0.75) {
    return new Promise((resolve) => {
        if (!base64Data || !base64Data.startsWith('data:image')) return resolve(base64Data || '');
        const img = new Image();
        img.onload = () => {
            let width = img.width, height = img.height;
            if (width > height) {
                if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
            } else {
                if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(base64Data);
        img.src = base64Data;
    });
}

function calculateCLPBreakdown(amount) {
    if (!amount || amount <= 0) return [];
    let remaining = amount < 10 ? 10 : amount;
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

function getPricePictogramsHtml(amount) {
    if (amount === undefined || amount === null) return '';
    const breakdown = calculateCLPBreakdown(amount);
    if (breakdown.length === 0) return '';
    
    return `<div class="flex flex-wrap items-center gap-1.5 mt-1.5 font-bold">` +
        breakdown.map(b => {
            const imgSrc = APP_STATE.customCurrencies[b.id] || b.img;
            return `<div class="inline-flex items-center gap-1 bg-amber-50 border-2 border-amber-300 rounded-xl px-2 py-1 shadow-sm" title="${b.name}">
                <img src="${imgSrc}" class="h-7 object-contain">
                <span class="text-xs font-black text-amber-950">${b.count > 1 ? b.count + 'x' : ''}</span>
            </div>`;
        }).join('') +
    `</div>`;
}

// ==========================================
// RENDERIZADO PRINCIPAL DE LA VISTA
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const headerMissionBtn = document.getElementById('headerMissionBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin General' :
                       (APP_STATE.currentUser.role === 'teacher' ? '👨‍🏫 Educador PIE' : '🎒 SuperCazador');
        
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
        if (headerMissionBtn) headerMissionBtn.classList.add('hidden');
        renderLoginView(container);
        return;
    }

    if (APP_STATE.teacherPreviewMode) {
        if (headerBasketBtn) headerBasketBtn.classList.remove('hidden');
        if (headerMissionBtn) headerMissionBtn.classList.remove('hidden');
        renderStudentPreviewWrapper(container);
        updateBadges();
        return;
    }

    if (APP_STATE.currentUser.role === 'admin' || APP_STATE.currentUser.role === 'teacher') {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        if (headerMissionBtn) headerMissionBtn.classList.add('hidden');
        renderTeacherDashboard(container);
    } else {
        if (headerBasketBtn) headerBasketBtn.classList.remove('hidden');
        if (headerMissionBtn) headerMissionBtn.classList.remove('hidden');
        if (APP_STATE.selectedSupermarketId) {
            renderSupermarketView(container, APP_STATE.selectedSupermarketId);
        } else {
            renderHomeView(container);
        }
    }
    updateBadges();
}

function renderLoginView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white border-4 border-slate-300 rounded-3xl p-6 shadow-xl space-y-6">
            <div class="text-center space-y-2">
                <div class="text-5xl">🎯</div>
                <h2 class="text-2xl font-black text-slate-800">Acceso SuperCazadores PIE</h2>
                <p class="text-xs font-semibold text-slate-500">Ingresa tu RUT y PIN para comenzar la Misión</p>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">RUT o Usuario:</label>
                    <input type="text" id="loginUser" value="12345678-9" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Clave / PIN:</label>
                    <input type="password" id="loginPin" value="1234" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-center text-xl tracking-widest font-black">
                </div>
                <p id="loginError" class="text-xs font-bold text-rose-600 hidden text-center">RUT o clave incorrecta.</p>
                <button onclick="handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow text-lg">Ingresar</button>
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
        speakText(`¡Hola ${user.name}! Elige un supermercado para iniciar tu misión.`);
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
// VISTA GAMIFICADA DEL ESTUDIANTE
// ==========================================
function renderHomeView(container) {
    container.innerHTML = `
        <div class="space-y-6">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800">¡Selecciona tu Supermercado! 🛍️</h2>
                <p class="text-slate-600 font-bold text-xs sm:text-sm">Escoge el lugar donde realizarás tu misión de búsqueda con la cámara IA.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${(APP_STATE.supermarkets || []).map(sup => `
                    <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-lg hover:shadow-2xl cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-transform">
                        <div class="bg-amber-400 p-4 rounded-3xl text-5xl flex items-center justify-center w-24 h-24 shadow-sm">${sup.icon || '🛒'}</div>
                        <h3 class="text-2xl font-black text-slate-800">${sup.name}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = String(id);
    APP_STATE.missionStartTime = Date.now();
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId));
    
    let products = (APP_STATE.products || []).filter(p => {
        if (p.isAll) return true;
        return String(p.supermarketId) === String(supId);
    });

    if (products.length === 0) products = APP_STATE.products || [];

    const productsHtml = products.length === 0 ? `
        <div class="col-span-full text-center py-12 bg-white rounded-3xl border-4 border-slate-200">
            <span class="text-5xl">📦</span>
            <h3 class="text-lg font-black text-slate-700 mt-2">No hay productos disponibles</h3>
        </div>
    ` : products.map(prod => {
        const isTarget = APP_STATE.targetMissionList.some(item => item.id === prod.id);
        const isFound = APP_STATE.foundMissionItems.some(item => item.id === prod.id);

        let buttonStateHtml = '';
        if (isFound) {
            buttonStateHtml = `<span class="bg-emerald-100 text-emerald-800 font-black px-4 py-2 rounded-xl text-xs">✅ Encontrado con IA</span>`;
        } else if (isTarget) {
            buttonStateHtml = `<button onclick="toggleMissionTarget('${prod.id}')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow">🎯 En Lista de Búsqueda</button>`;
        } else {
            buttonStateHtml = `<button onclick="toggleMissionTarget('${prod.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow">+ Agregar a mi Lista</button>`;
        }

        return `
            <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                <div class="flex items-start space-x-4">
                    <span class="text-5xl bg-slate-100 p-3 rounded-2xl">${prod.iconEmoji || '📦'}</span>
                    <div class="space-y-1 w-full">
                        <h3 class="text-lg font-black text-slate-800">${prod.name}</h3>
                        <div class="text-2xl font-black text-emerald-700">$${(prod.price || 0).toLocaleString('es-CL')}</div>
                        ${getPricePictogramsHtml(prod.price || 0)}
                        <span class="inline-block bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">IA: ${AI_CLASS_TRANSLATIONS[prod.aiClass] || prod.aiClass}</span>
                    </div>
                </div>
                <div class="flex justify-between items-center gap-2 pt-2 border-t">
                    <button onclick="speakText('${prod.name}, precio ${prod.price} pesos')" class="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold p-2.5 rounded-xl text-lg">🔊</button>
                    ${buttonStateHtml}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm flex-wrap gap-2">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs">← Volver a Tiendas</button>
                <div class="flex items-center gap-2">
                    <span class="text-3xl">${sup ? (sup.icon || '🏪') : '🏪'}</span>
                    <h2 class="text-xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
                </div>
                <button onclick="openGameMissionModal()" class="bg-amber-400 hover:bg-amber-500 font-black text-slate-900 px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow">
                    <span>🎯 Misión: (${APP_STATE.foundMissionItems.length}/${APP_STATE.targetMissionList.length})</span>
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${productsHtml}
            </div>
        </div>
    `;
}

function toggleMissionTarget(prodId) {
    const prod = (APP_STATE.products || []).find(p => p.id === prodId);
    if (!prod) return;

    const index = APP_STATE.targetMissionList.findIndex(p => p.id === prodId);
    if (index >= 0) {
        APP_STATE.targetMissionList.splice(index, 1);
        speakText(`Quitaste ${prod.name} de tu lista`);
    } else {
        APP_STATE.targetMissionList.push(prod);
        playChimeSound();
        speakText(`Agregaste ${prod.name} a tu misión de búsqueda`);
    }
    updateBadges();
    renderApp();
}

function updateBadges() {
    const mBadge = document.getElementById('missionBadge');
    const bBadge = document.getElementById('basketBadge');
    if (mBadge) mBadge.textContent = `${APP_STATE.foundMissionItems.length}/${APP_STATE.targetMissionList.length}`;
    if (bBadge) bBadge.textContent = (APP_STATE.basket || []).length;
}

// ==========================================
// ESCÁNER VISUAL DE IA (TENSORFLOW COCO-SSD)
// ==========================================
function openGameMissionModal() {
    renderMissionModalContent();
    const modal = document.getElementById('gameMissionModal');
    if (modal) modal.classList.remove('hidden');
}

function closeGameMissionModal() {
    const modal = document.getElementById('gameMissionModal');
    if (modal) modal.classList.add('hidden');
}

function renderMissionModalContent() {
    const grid = document.getElementById('missionItemsGrid');
    const progressText = document.getElementById('missionProgressText');
    if (!grid) return;

    if (APP_STATE.targetMissionList.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-slate-400 py-6 font-bold text-xs">Aún no has agregado productos a tu lista. Selecciona los productos que saldrás a buscar.</p>`;
    } else {
        grid.innerHTML = APP_STATE.targetMissionList.map(prod => {
            const isFound = APP_STATE.foundMissionItems.some(item => item.id === prod.id);
            return `
                <div class="p-3 ${isFound ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'} border-2 rounded-2xl flex items-center justify-between font-bold text-xs">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${prod.iconEmoji || '📦'}</span>
                        <div>
                            <span class="text-slate-800 font-black block">${prod.name}</span>
                            <span class="text-emerald-700 font-black">$${(prod.price || 0).toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                    <span>${isFound ? '✅ Encontrado' : '🔍 Buscando...'}</span>
                </div>
            `;
        }).join('');
    }

    if (progressText) {
        progressText.textContent = `${APP_STATE.foundMissionItems.length} / ${APP_STATE.targetMissionList.length} Encontrados`;
    }
}

async function startVisualAIScannerGame() {
    closeGameMissionModal();
    const modal = document.getElementById('visualAIScannerModal');
    if (modal) modal.classList.remove('hidden');

    const statusEl = document.getElementById('aiLoadingStatus');
    const feedbackText = document.getElementById('aiFeedbackText');
    const currentTargetEl = document.getElementById('currentTargetProductName');

    const nextTarget = APP_STATE.targetMissionList.find(item => !APP_STATE.foundMissionItems.some(f => f.id === item.id));
    if (currentTargetEl) {
        currentTargetEl.textContent = nextTarget ? nextTarget.name : "¡Todos los productos encontrados!";
    }

    try {
        const video = document.getElementById('aiWebcam');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            APP_STATE.webcamStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            video.srcObject = APP_STATE.webcamStream;
        }
    } catch(err) {
        if (feedbackText) feedbackText.innerHTML = `<span class="text-rose-400">No se pudo acceder a la cámara. Usa la opción manual.</span>`;
    }

    if (!APP_STATE.cocoModel && typeof cocoSsd !== 'undefined') {
        try {
            APP_STATE.cocoModel = await cocoSsd.load();
        } catch(e) {}
    }

    if (statusEl) statusEl.classList.add('hidden');
    document.getElementById('manualMatchBtn')?.classList.remove('hidden');

    APP_STATE.isDetectingAI = true;
    detectObjectsLoop();
}

function closeVisualAIScannerModal() {
    APP_STATE.isDetectingAI = false;
    if (APP_STATE.webcamStream) {
        APP_STATE.webcamStream.getTracks().forEach(track => track.stop());
    }
    const modal = document.getElementById('visualAIScannerModal');
    if (modal) modal.classList.add('hidden');
}

async function detectObjectsLoop() {
    if (!APP_STATE.isDetectingAI) return;

    const video = document.getElementById('aiWebcam');
    if (APP_STATE.cocoModel && video && video.readyState === 4) {
        try {
            const predictions = await APP_STATE.cocoModel.detect(video);
            if (predictions && predictions.length > 0) {
                const topPrediction = predictions.find(p => p.score > 0.55);
                if (topPrediction) {
                    processAIPrediction(topPrediction.class);
                }
            }
        } catch(e) {}
    }

    if (APP_STATE.isDetectingAI) {
        setTimeout(() => requestAnimationFrame(detectObjectsLoop), 1200);
    }
}

function processAIPrediction(detectedClass) {
    const feedbackText = document.getElementById('aiFeedbackText');
    const currentTarget = APP_STATE.targetMissionList.find(item => !APP_STATE.foundMissionItems.some(f => f.id === item.id));

    if (!currentTarget) {
        if (feedbackText) feedbackText.innerHTML = `<span class="text-emerald-400 font-black">🎉 ¡Felicidades! Completaste la lista.</span>`;
        return;
    }

    APP_STATE.telemetry.aiRecognitionsCount++;

    if (detectedClass === currentTarget.aiClass || (detectedClass === 'apple' && currentTarget.aiClass === 'apple')) {
        playChimeSound();
        if (typeof confetti !== 'undefined') confetti();

        APP_STATE.foundMissionItems.push(currentTarget);
        APP_STATE.basket.push({ productId: currentTarget.id, quantity: 1 });

        speakText(`¡Excelente! Encontraste ${currentTarget.name}. Se ha añadido a tu canasto.`);

        if (feedbackText) {
            feedbackText.innerHTML = `
                <div class="text-emerald-400 font-black">
                    <span>✨ ¡RECONOCIMIENTO EXITOSO!</span>
                    <p class="text-white font-bold">${currentTarget.name} guardado en el canasto.</p>
                </div>
            `;
        }

        updateBadges();

        if (APP_STATE.foundMissionItems.length >= APP_STATE.targetMissionList.length) {
            setTimeout(() => {
                closeVisualAIScannerModal();
                openBasketModal();
            }, 1800);
        }
    } else {
        APP_STATE.telemetry.incorrectAttempts++;
        const detectedNameInSpanish = AI_CLASS_TRANSLATIONS[detectedClass] || detectedClass;

        speakText(`Veo un ${detectedNameInSpanish}. Buena observación, pero en tu lista estamos buscando ${currentTarget.name}. ¡Sigue explorando!`);

        if (feedbackText) {
            feedbackText.innerHTML = `
                <div class="text-amber-300 font-extrabold">
                    <span>🔍 Observación IA: Detectado (${detectedNameInSpanish})</span>
                    <p class="text-slate-300 text-[11px]">Buscamos: <b>${currentTarget.name}</b>. ¡Sigue buscando!</p>
                </div>
            `;
        }
    }
}

function manualAssistIdentify() {
    const currentTarget = APP_STATE.targetMissionList.find(item => !APP_STATE.foundMissionItems.some(f => f.id === item.id));
    if (currentTarget) {
        processAIPrediction(currentTarget.aiClass);
    }
}

function renderStudentPreviewWrapper(container) {
    const previewBanner = `
        <div class="bg-amber-400 border-4 border-amber-600 text-slate-900 p-3.5 rounded-2xl shadow-lg mb-6 flex justify-between items-center flex-wrap gap-2">
            <div class="flex items-center gap-2">
                <span class="text-2xl">🕹️</span>
                <div>
                    <h3 class="font-black text-sm tracking-tight">MODO PRUEBA: VISTA DEL ESTUDIANTE</h3>
                    <p class="text-[11px] font-bold text-slate-800">Prueba la tienda gamificada con la IA visual en tiempo real.</p>
                </div>
            </div>
            <button onclick="toggleStudentPreview(false)" class="bg-slate-900 hover:bg-black text-white font-black text-xs px-4 py-2 rounded-xl border-b-2 border-slate-950 shadow">
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
// CAJA DE PAGO Y VUELTO CON MONEDA CHILENA
// ==========================================
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
            const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId)) || { name: 'Producto', price: 1500 };
            total += (p.price || 0);
            return `
                <div class="flex items-center justify-between p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${p.iconEmoji || '📦'}</span>
                        <div>
                            <span class="text-slate-800 font-black text-sm block">${p.name}</span>
                            ${getPricePictogramsHtml(p.price || 0)}
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-black text-emerald-700 text-base">$${(p.price || 0).toLocaleString('es-CL')}</span>
                        <button onclick="removeFromBasket(${idx})" class="text-rose-600 font-black px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-xs">✕</button>
                    </div>
                </div>
            `;
        }).join('');

    if (totalEl) {
        totalEl.innerHTML = `
            <div>$${total.toLocaleString('es-CL')}</div>
            ${getPricePictogramsHtml(total)}
        `;
    }
    if (paidEl) paidEl.textContent = `$${(APP_STATE.userPaidAmount || 0).toLocaleString('es-CL')}`;

    if (breakdownEl) {
        if (!APP_STATE.userPaidItems || APP_STATE.userPaidItems.length === 0) {
            breakdownEl.innerHTML = `<span class="text-xs text-slate-400 font-bold italic">Selecciona billetes y monedas para pagar tu compra.</span>`;
        } else {
            const counts = {};
            APP_STATE.userPaidItems.forEach(item => { counts[item.id] = (counts[item.id] || 0) + 1; });

            breakdownEl.innerHTML = Object.keys(counts).map(id => {
                const item = CLP_CURRENCY_ITEMS.find(c => c.id === id);
                if (!item) return '';
                const count = counts[id];
                const imgSrc = APP_STATE.customCurrencies[id] || item.img;
                return `<div class="inline-flex items-center gap-1.5 bg-white border-2 border-amber-400 rounded-xl px-2 py-1 shadow-sm">
                    <img src="${imgSrc}" class="h-8 object-contain">
                    <span class="text-xs font-black text-amber-950">${count > 1 ? count + 'x' : ''}</span>
                </div>`;
            }).join('');
        }
    }

    if (trayEl) {
        trayEl.innerHTML = CLP_CURRENCY_ITEMS.map(item => {
            const imgSrc = APP_STATE.customCurrencies[item.id] || item.img;
            return `
                <button onclick="addPaymentMoney('${item.id}')" class="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-2 flex flex-col items-center justify-center space-y-1 active:scale-95 shadow">
                    <img src="${imgSrc}" class="h-9 object-contain">
                    <span class="text-[10px] font-black text-slate-800">$${item.value.toLocaleString('es-CL')}</span>
                </button>
            `;
        }).join('');
    }
}

function addPaymentMoney(itemId) {
    const item = CLP_CURRENCY_ITEMS.find(c => c.id === itemId);
    if (!item) return;

    if (!APP_STATE.userPaidItems) APP_STATE.userPaidItems = [];
    APP_STATE.userPaidItems.push(item);
    APP_STATE.userPaidAmount += item.value;

    playChimeSound();
    speakText(`Entregaste ${item.value} pesos`);
    renderBasketModalContent();
}

function resetUserPayment() {
    APP_STATE.userPaidAmount = 0;
    APP_STATE.userPaidItems = [];
    speakText("Pago reiniciado");
    renderBasketModalContent();
}

function removeFromBasket(idx) {
    APP_STATE.basket.splice(idx, 1);
    updateBadges();
    renderBasketModalContent();
}

function verifyAndCheckout() {
    let total = 0;
    (APP_STATE.basket || []).forEach(item => {
        const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId)) || { price: 1500 };
        total += (p.price || 0);
    });

    if (total === 0) return alert("Tu canasto está vacío.");
    if (APP_STATE.userPaidAmount < total) {
        const falta = total - APP_STATE.userPaidAmount;
        speakText(`Te faltan ${falta} pesos para completar la compra.`);
        return alert(`⚠️ Monto insuficiente. Te faltan $${falta.toLocaleString('es-CL')} para pagar.`);
    }

    const vuelto = APP_STATE.userPaidAmount - total;
    const elapsedSeconds = APP_STATE.missionStartTime ? Math.round((Date.now() - APP_STATE.missionStartTime) / 1000) : 30;

    const evalData = {
        id: 'eval-' + Date.now(),
        studentId: APP_STATE.currentUser ? APP_STATE.currentUser.id : 'anonimo',
        studentName: APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Estudiante',
        rut: APP_STATE.currentUser ? APP_STATE.currentUser.rut || '' : '',
        totalCLP: total,
        paidCLP: APP_STATE.userPaidAmount,
        changeCLP: vuelto,
        itemCount: APP_STATE.basket.length,
        timeSeconds: elapsedSeconds,
        aiRecognitionsCount: APP_STATE.telemetry.aiRecognitionsCount,
        incorrectAttempts: APP_STATE.telemetry.incorrectAttempts,
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

    const vueltoContainer = document.getElementById('successModalVueltoBreakdown');
    if (vueltoContainer) {
        vueltoContainer.innerHTML = getPricePictogramsHtml(vuelto) || `<p class="text-xs font-bold text-slate-500">Monto exacto. No requiere vuelto.</p>`;
    }

    closeBasketModal();
    document.getElementById('checkoutSuccessModal').classList.remove('hidden');
    speakText(`¡Misión completada! Tu vuelto es de ${vuelto} pesos.`);
}

function closeSuccessModalAndFinish() {
    document.getElementById('checkoutSuccessModal').classList.add('hidden');
    APP_STATE.basket = [];
    APP_STATE.targetMissionList = [];
    APP_STATE.foundMissionItems = [];
    APP_STATE.userPaidAmount = 0;
    APP_STATE.userPaidItems = [];
    updateBadges();
    goHome();
}

// ==========================================
// PANEL DOCENTE Y GESTIÓN DE PESTAÑAS (5 PESTAÑAS)
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderTeacherDashboard(document.getElementById('appContainer'));
}

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
                            <span>${isAdmin ? 'Panel General & Evaluación PIE' : 'Panel Docente NEE Gamificado'}</span>
                        </h2>
                        <p class="text-xs text-indigo-300 font-bold mt-0.5">Gestión completa pedagógica, usuarios, fotos de monedas e informes con IA.</p>
                    </div>
                    <button onclick="toggleStudentPreview(true)" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-4 py-2 rounded-xl shadow flex items-center gap-2 active:scale-95">
                        <span>🕹️</span><span>Probar Juego</span>
                    </button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                    <button onclick="setTeacherTab('home')" class="py-3 px-2 rounded-2xl font-black text-xs ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300'}">📊 1. Evaluaciones IA</button>
                    <button onclick="setTeacherTab('catalog')" class="py-3 px-2 rounded-2xl font-black text-xs ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300'}">🏪 2. Catálogo & IA</button>
                    <button onclick="setTeacherTab('currency')" class="py-3 px-2 rounded-2xl font-black text-xs ${activeTab === 'currency' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300'}">💵 3. Monedas & Fotos</button>
                    <button onclick="setTeacherTab('users')" class="py-3 px-2 rounded-2xl font-black text-xs ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300'}">🔑 4. Usuarios & Cursos</button>
                    <button onclick="setTeacherTab('settings')" class="py-3 px-2 rounded-2xl font-black text-xs ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300'}">⚙️ 5. Plantilla PDF</button>
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

// PESTAÑA 1: EVALUACIONES E INFORMES
function renderTeacherHomeTab() {
    const totalEvals = (APP_STATE.evaluations || []).length;

    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md space-y-4">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                    <span>✨</span> <span>Informes Psicopedagógicos con IA & Visión Computacional</span>
                </h3>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-black">
                            <th class="py-2.5 px-3">Fecha</th>
                            <th class="py-2.5 px-3">Estudiante</th>
                            <th class="py-2.5 px-3">Tiempo Misión</th>
                            <th class="py-2.5 px-3 text-center">Detecciones IA</th>
                            <th class="py-2.5 px-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-bold">
                        ${totalEvals === 0 ? `
                            <tr><td colspan="5" class="py-8 text-center text-slate-400 italic">No hay evaluaciones aún. Completa una misión en el juego.</td></tr>
                        ` : (APP_STATE.evaluations || []).map(e => `
                            <tr class="hover:bg-slate-50">
                                <td class="py-3 px-3 text-slate-500">${e.date || 'Reciente'}</td>
                                <td class="py-3 px-3 font-black text-indigo-950">${e.studentName || 'Estudiante'}</td>
                                <td class="py-3 px-3 font-black text-slate-700">${e.timeSeconds || 30}s</td>
                                <td class="py-3 px-3 text-center font-black text-emerald-700">${e.aiRecognitionsCount || 1} Correctas</td>
                                <td class="py-3 px-3 text-center">
                                    <button onclick="generateAIPedagogicalReport('${e.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow-sm">
                                        ✨ Ver Informe Gamificado IA
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateAIPedagogicalReport(evalId) {
    const ev = (APP_STATE.evaluations || []).find(x => String(x.id) === String(evalId));
    if (!ev) return alert("Evaluación no encontrada.");

    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const timeSec = ev.timeSeconds || 30;
    const correctCount = ev.aiRecognitionsCount || 1;
    const incorrectCount = ev.incorrectAttempts || 0;

    let nivelAutonomia = "Alto / Autonomía Gamificada Destacada";
    if (incorrectCount > 2) nivelAutonomia = "Discriminación Visual en Desarrollo (Con Apoyo)";

    const reportHtml = `
        <div id="printableReport" class="bg-white p-8 max-w-4xl mx-auto border border-slate-300 shadow-2xl rounded-2xl font-sans text-slate-800 space-y-6">
            <div class="flex justify-between items-center border-b-4 border-indigo-600 pb-4">
                <div>
                    <h1 class="text-xl font-black text-indigo-950 uppercase">${st.schoolName}</h1>
                    <p class="text-xs font-bold text-indigo-700">${st.schoolSubHeader}</p>
                </div>
                ${st.schoolLogo ? `<img src="${st.schoolLogo}" class="h-16 object-contain">` : `<span class="text-3xl">🎯</span>`}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border text-xs font-bold">
                <div><span class="text-slate-400 block text-[10px] uppercase">Estudiante:</span> ${ev.studentName}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">RUT:</span> ${ev.rut || 'N/A'}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">Fecha:</span> ${ev.date || 'Reciente'}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">Tiempo Misión:</span> ${timeSec} segundos</div>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-3 bg-emerald-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-emerald-800">Detecciones IA Exitosas</span><div class="text-base font-black text-emerald-700">${correctCount}</div></div>
                <div class="p-3 bg-amber-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-amber-900">Enfoques Alternativos</span><div class="text-base font-black text-amber-800">${incorrectCount}</div></div>
                <div class="p-3 bg-indigo-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-indigo-900">Lecturas por Voz</span><div class="text-base font-black text-indigo-800">${ev.voiceHelpCount || 0}</div></div>
            </div>

            <div class="p-4 bg-indigo-50 border rounded-2xl text-xs space-y-2">
                <div class="font-black text-indigo-950">Observación Psicopedagógica PIE:</div>
                <p class="text-slate-700 font-semibold">El estudiante completó la misión gamificada identificando productos mediante la cámara con Inteligencia Artificial. Demuestra <b>${nivelAutonomia}</b> en la discriminación de objetos del entorno y manejo funcional del dinero ($${(ev.totalCLP || 0).toLocaleString('es-CL')}).</p>
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
                <title>Informe Pedagógico PDF</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white p-6">
                ${reportContent}
                <script>setTimeout(() => { window.print(); window.close(); }, 750);</script>
            </body>
        </html>
    `);
    win.document.close();
}

function sendReportByEmail() {
    const ev = (APP_STATE.evaluations || []).find(x => String(x.id) === String(window.currentReportEvalId));
    if (!ev) return alert("Selecciona un informe válido.");
    const destEmail = prompt("Ingresa el correo del apoderado:");
    if (!destEmail) return;

    if (typeof emailjs !== 'undefined') {
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            to_email: destEmail,
            to_name: ev.studentName,
            user_rut: ev.rut || 'N/A',
            user_pin: 'Informe Gamificado Disponible',
            app_url: window.location.href
        }, EMAILJS_CONFIG.publicKey).then(() => alert("📧 Informe enviado con éxito.")).catch(e => alert("Error: " + e.message));
    }
}

// PESTAÑA 2: CATÁLOGO DE TIENDAS Y PRODUCTOS
function renderTeacherCatalogTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-3xl border-4 border-emerald-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>🏪</span> <span>Supermercados</span>
                    </h3>
                    <button onclick="openSupermarketModal()" class="bg-emerald-600 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Tienda</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.supermarkets || []).map(s => `
                        <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold">
                            <span class="font-black text-slate-800">${s.icon || '🏪'} ${s.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-indigo-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>🏷️</span> <span>Categorías (${(APP_STATE.categories || []).length})</span>
                    </h3>
                    <button onclick="openCategoryModal()" class="bg-indigo-600 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Categoría</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.categories || []).map(c => `
                        <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold">
                            <span class="font-black text-slate-800">${c.icon || '🏷️'} ${c.name}</span>
                            <button onclick="deleteCategory('${c.id}')" class="text-rose-600 font-bold px-2 py-1 rounded-lg bg-rose-50 text-[10px]">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>📦</span> <span>Productos IA (${(APP_STATE.products || []).length})</span>
                    </h3>
                    <button onclick="openProductModal()" class="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow">+ Producto</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.products || []).map(p => `
                        <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold">
                            <div>
                                <span class="font-black text-slate-800">${p.iconEmoji || '📦'} ${p.name}</span>
                                <span class="text-emerald-700 font-black block">$${(p.price || 0).toLocaleString('es-CL')}</span>
                                <span class="text-[10px] text-indigo-700 font-black uppercase">IA: ${p.aiClass}</span>
                            </div>
                            <button onclick="deleteProduct('${p.id}')" class="bg-rose-100 text-rose-900 px-2 py-1 rounded-xl text-[10px]">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// PESTAÑA 3: CARGA DE IMÁGENES Y FOTOS DE BILLETES
function renderTeacherCurrencyTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>💵</span> <span>Fotos Personalizadas de Billetes y Monedas Chilenas</span>
                </h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                ${CLP_CURRENCY_ITEMS.map(item => {
                    const currentImg = APP_STATE.customCurrencies[item.id] || item.img;
                    const isCustom = !!APP_STATE.customCurrencies[item.id];
                    return `
                        <div class="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl flex flex-col items-center text-center space-y-3 shadow-sm">
                            <span class="text-xs font-black text-slate-800">${item.name}</span>
                            <div class="h-24 w-full flex items-center justify-center p-1 bg-white rounded-2xl border">
                                <img src="${currentImg}" class="max-h-full max-w-full object-contain">
                            </div>
                            <div class="w-full space-y-1">
                                <label class="block bg-indigo-600 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer shadow text-center">
                                    📁 Cambiar Foto
                                    <input type="file" accept="image/*" class="hidden" onchange="uploadCustomCurrencyImage(event, '${item.id}')">
                                </label>
                                ${isCustom ? `
                                    <button onclick="resetCustomCurrencyImage('${item.id}')" class="w-full bg-slate-200 text-slate-700 font-bold py-1 rounded-xl text-[9px]">
                                        🔄 Restablecer
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function uploadCustomCurrencyImage(event, itemId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 400, 400).then(compressed => {
            APP_STATE.customCurrencies[itemId] = compressed;
            if (db) {
                db.collection('settings').doc('currencies').set({ [itemId]: compressed }, { merge: true });
            }
            try { localStorage.setItem('nee_custom_currencies', JSON.stringify(APP_STATE.customCurrencies)); } catch(err) {}
            renderApp();
            alert("✅ Imagen de moneda/billete actualizada.");
        });
    };
    reader.readAsDataURL(file);
}

function resetCustomCurrencyImage(itemId) {
    delete APP_STATE.customCurrencies[itemId];
    if (db) {
        const update = {};
        update[itemId] = firebase.firestore.FieldValue.delete();
        db.collection('settings').doc('currencies').update(update);
    }
    try { localStorage.setItem('nee_custom_currencies', JSON.stringify(APP_STATE.customCurrencies)); } catch(e) {}
    renderApp();
}

// PESTAÑA 4: GESTIÓN DE USUARIOS Y CURSOS
function renderTeacherUsersTab() {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';

    return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <span>🏫</span> <span>Cursos Registrados</span>
                    </h3>
                    <button onclick="addNewCoursePrompt()" class="bg-emerald-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow">+ Crear Curso</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    ${(APP_STATE.courses || []).length === 0 ? `
                        <p class="col-span-full text-xs text-slate-400 italic text-center py-2">No hay cursos creados.</p>
                    ` : (APP_STATE.courses || []).map(c => `
                        <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center font-bold text-xs">
                            <span class="text-slate-800 font-black">${c.name}</span>
                            <button onclick="deleteCourse('${c.id}')" class="text-rose-600 font-black px-2 py-1 rounded-lg bg-rose-50">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white p-5 rounded-3xl border-4 border-purple-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🔑 Admin General</h3>
                        ${isAdmin ? `<button onclick="openCreateUserModal('admin')" class="bg-purple-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Admin</button>` : ''}
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">${renderUserRoleList('admin')}</div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-indigo-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">👨‍🏫 Educadores PIE</h3>
                        ${isAdmin ? `<button onclick="openCreateUserModal('teacher')" class="bg-indigo-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Educador</button>` : ''}
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">${renderUserRoleList('teacher')}</div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-emerald-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🎒 Estudiantes</h3>
                        <button onclick="openCreateUserModal('student')" class="bg-emerald-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Alumno</button>
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">${renderUserRoleList('student')}</div>
                </div>
            </div>
        </div>
    `;
}

function renderUserRoleList(role) {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const users = (APP_STATE.users || []).filter(u => u.role === role);
    if (users.length === 0) return `<p class="text-xs text-slate-400 italic py-4 text-center">No hay usuarios registrados.</p>`;

    return users.map(u => `
        <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-xs font-bold">
            <div class="flex justify-between items-center">
                <span class="text-indigo-950 font-black">${u.name}</span>
                <div class="space-x-1">
                    ${(isAdmin || role === 'student') ? `
                        <button onclick="openEditUserModal('${u.id}')" class="text-amber-600 font-extrabold">✏️</button>
                        <button onclick="deleteUser('${u.id}')" class="text-rose-600 font-extrabold">✕</button>
                    ` : ''}
                </div>
            </div>
            <div class="text-[11px] text-slate-600">
                <div>RUT: <b>${u.rut || 'N/A'}</b> | Clave: <code class="bg-slate-200 px-1 py-0.5 rounded text-indigo-900 font-black">${u.pin}</code></div>
                <div>📧 ${u.email || 'Sin correo'}</div>
            </div>
        </div>
    `).join('');
}

// PESTAÑA 5: PLANTILLA Y LOGO INSTITUCIONAL
function renderTeacherSettingsTab() {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-4xl mx-auto">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>⚙️</span> <span>Diseñador de Plantilla PDF de Informes</span>
                </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Nombre Colegio / Escuela:</label>
                        <input type="text" id="settingSchoolName" value="${st.schoolName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Unidad / Programa PIE:</label>
                        <input type="text" id="settingSubHeader" value="${st.schoolSubHeader || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Firma Director / Equipo:</label>
                        <input type="text" id="settingDirectorName" value="${st.directorName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                </div>
                <div class="space-y-4 flex flex-col justify-between">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Logo Institucional (Imagen):</label>
                        <input type="file" accept="image/*" onchange="handleSchoolLogoUpload(event)" class="w-full text-xs font-bold text-slate-600 border border-slate-300 p-2 rounded-xl">
                        <input type="hidden" id="settingSchoolLogo" value="${st.schoolLogo || ''}">
                    </div>
                    <button onclick="saveInstitutionalSettings()" class="w-full bg-emerald-600 text-white font-black py-3 rounded-xl text-xs uppercase shadow">
                        💾 Guardar Plantilla
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
        });
    };
    reader.readAsDataURL(file);
}

function saveInstitutionalSettings() {
    const settingsData = {
        schoolName: document.getElementById('settingSchoolName').value.trim(),
        schoolSubHeader: document.getElementById('settingSubHeader').value.trim(),
        directorName: document.getElementById('settingDirectorName').value.trim(),
        schoolLogo: document.getElementById('settingSchoolLogo').value
    };

    if (db) {
        db.collection('settings').doc('institutional').set(settingsData, { merge: true }).then(() => {
            APP_STATE.settings = settingsData;
            alert("✅ Configuración de plantilla guardada.");
        });
    }
}

// ==========================================
// MODALES Y OPERACIONES DE EDICIÓN
// ==========================================
function updateCategoryDropdowns() {
    const catSelect = document.getElementById('modalProdCategory');
    if (!catSelect) return;
    const list = (APP_STATE.categories && APP_STATE.categories.length > 0) ? APP_STATE.categories : DEFAULT_CATEGORIES;
    catSelect.innerHTML = list.map(c => `<option value="${c.name}">${c.icon || '🏷️'} ${c.name}</option>`).join('');
}

function openProductModal() {
    const supSelect = document.getElementById('modalProdSupermarket');
    if (supSelect) supSelect.innerHTML = (APP_STATE.supermarkets || []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    updateCategoryDropdowns();
    const el = document.getElementById('productModal');
    if (el) el.classList.remove('hidden');
}

function closeProductModal() {
    const el = document.getElementById('productModal');
    if (el) el.classList.add('hidden');
}

function saveProductFromModal() {
    const name = document.getElementById('modalProdName').value.trim();
    const aiClass = document.getElementById('modalProdAIClass').value;
    const supSelect = document.getElementById('modalProdSupermarket');
    const supId = supSelect ? supSelect.value : null;
    const categorySelect = document.getElementById('modalProdCategory');
    const category = categorySelect ? categorySelect.value : 'General';
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;

    if (!name || isNaN(price) || !db) return alert("Ingresa un nombre y precio válidos.");

    const id = 'prod-' + Date.now();
    const emojis = { 'apple': '🍎', 'banana': '🍌', 'bottle': '🍾', 'cup': '🥤', 'bowl': '🥣', 'book': '📚' };

    db.collection('products').doc(id).set({
        id, name, price, aiClass,
        iconEmoji: emojis[aiClass] || '📦',
        category: category,
        isAll: replicateAll,
        supermarketId: replicateAll ? 'ALL' : supId
    }, { merge: true }).then(() => {
        closeProductModal();
        alert(`✅ Producto "${name}" guardado.`);
    });
}

function deleteProduct(prodId) {
    if (confirm("¿Eliminar este producto?") && db) {
        db.collection('products').doc(prodId).delete();
    }
}

function openSupermarketModal() {
    const el = document.getElementById('supermarketModal');
    if (el) el.classList.remove('hidden');
}
function closeSupermarketModal() {
    const el = document.getElementById('supermarketModal');
    if (el) el.classList.add('hidden');
}

function saveSupermarketFromModal() {
    const name = document.getElementById('modalSupName').value.trim();
    if (!name || !db) return alert("Ingresa nombre de la tienda.");
    const id = 'sup-' + Date.now();
    db.collection('supermarkets').doc(id).set({ id, name, icon: '🏪' }).then(() => {
        closeSupermarketModal();
        alert("✅ Tienda guardada.");
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
    const name = document.getElementById('modalCatName').value.trim();
    const icon = document.getElementById('modalCatIcon').value;
    if (!name || !db) return alert("Ingresa nombre de categoría.");
    const id = 'cat-' + Date.now();
    db.collection('categories').doc(id).set({ id, name, icon: icon || '🏷️' }).then(() => {
        closeCategoryModal();
        alert(`✅ Categoría "${icon} ${name}" creada.`);
    });
}

function deleteCategory(catId) {
    if (confirm("¿Eliminar esta categoría?") && db) {
        db.collection('categories').doc(catId).delete();
    }
}

function openCreateUserModal(role) {
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = '';
        document.getElementById('modalUserRole').value = role;
        document.getElementById('modalName').value = '';
        document.getElementById('modalRut').value = '';
        document.getElementById('modalEmail').value = '';
        document.getElementById('userModalTitle').textContent = `Crear nuevo ${role === 'admin' ? 'Administrador' : (role === 'teacher' ? 'Educador PIE' : 'Alumno')}`;
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
        document.getElementById('userModalTitle').textContent = `Editar Usuario (${user.name})`;
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

    if (!name || !rut || !db) return alert("Completa el nombre y RUT.");

    const id = userId || ('u-' + Date.now());
    const pin = rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';

    db.collection('users').doc(id).set({ id, role, name, rut, username: rut, email, pin }, { merge: true }).then(() => {
        closeUserModal();
        alert("✅ Usuario guardado.");
    });
}

function deleteUser(id) {
    if (confirm("¿Eliminar este usuario?") && db) {
        db.collection('users').doc(id).delete();
    }
}

function addNewCoursePrompt() {
    const courseName = prompt("Nombre del nuevo curso:");
    if (!courseName || !courseName.trim() || !db) return;
    const id = 'course-' + Date.now();
    db.collection('courses').doc(id).set({ id, name: courseName.trim() });
}

function deleteCourse(courseId) {
    if (confirm("¿Eliminar este curso?") && db) {
        db.collection('courses').doc(courseId).delete();
    }
}

// ==========================================
// ESCUCHADORES EN TIEMPO REAL CON FIRESTORE
// ==========================================
function initFirebaseListeners() {
    try {
        const storedUser = localStorage.getItem('nee_active_user');
        if (storedUser) APP_STATE.currentUser = JSON.parse(storedUser);
        const storedCurrencies = localStorage.getItem('nee_custom_currencies');
        if (storedCurrencies) APP_STATE.customCurrencies = JSON.parse(storedCurrencies);
    } catch(e) {}

    if (!db) { renderApp(); return; }

    const listenCol = (name, callback) => {
        try {
            db.collection(name).onSnapshot(s => {
                const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
                callback(data);
                renderApp();
            }, err => renderApp());
        } catch(e) { renderApp(); }
    };

    listenCol('users', data => { APP_STATE.users = (data && data.length > 0) ? data : [DEFAULT_ADMIN]; });
    listenCol('courses', data => { APP_STATE.courses = data || []; });
    listenCol('categories', data => { APP_STATE.categories = (data && data.length > 0) ? data : [...DEFAULT_CATEGORIES]; });
    listenCol('supermarkets', data => { APP_STATE.supermarkets = (data && data.length > 0) ? data : [...DEFAULT_SUPERMARKETS]; });
    listenCol('products', data => { APP_STATE.products = (data && data.length > 0) ? data : [...DEFAULT_PRODUCTS]; });
    listenCol('evaluations', data => { APP_STATE.evaluations = data || []; });

    try {
        db.collection('settings').doc('institutional').onSnapshot(doc => {
            if (doc.exists) APP_STATE.settings = { ...DEFAULT_SETTINGS, ...doc.data() };
            renderApp();
        });

        db.collection('settings').doc('currencies').onSnapshot(doc => {
            if (doc.exists) APP_STATE.customCurrencies = { ...APP_STATE.customCurrencies, ...doc.data() };
            renderApp();
        });
    } catch(e) { renderApp(); }
}

function mainInit() {
    initFirebaseListeners();
    renderApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainInit);
} else {
    mainInit();
}

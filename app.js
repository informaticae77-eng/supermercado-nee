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
// TEMÁTICAS ESTACIONALES Y CONFIGURACIÓN
// ==========================================
const SEASONAL_THEMES = {
    standard: {
        id: 'standard',
        name: 'Estándar / Institucional 🏫',
        bgColor: 'bg-slate-100',
        bannerBg: 'bg-indigo-600',
        bannerText: ' text-white ',
        titleMsg: '¡Bienvenido a Comprar! 🛍️',
        greetingMsg: 'Selecciona una tienda para comenzar tu misión.',
        emoji: '🛍️'
    },
    navidad: {
        id: 'navidad',
        name: 'Especial Navidad 🎄✨',
        bgColor: 'bg-red-50',
        bannerBg: 'bg-gradient-to-r from-red-600 via-emerald-600 to-red-700',
        bannerText: ' text-yellow-200 ',
        titleMsg: '¡Especial de Navidad en la Escuela! 🎄🎁',
        greetingMsg: '¡Encuentra los regalos y la cena navideña!',
        emoji: '🎅'
    },
    verano: {
        id: 'verano',
        name: 'Modo Verano & Vacaciones ☀️🏖️',
        bgColor: 'bg-amber-50',
        bannerBg: 'bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400',
        bannerText: ' text-slate-900 ',
        titleMsg: '¡Modo Verano Activo! ☀️🌊',
        greetingMsg: '¡Prepara tu canasto con helados, frutas y bebidas!',
        emoji: '🍦'
    },
    fiestas_patrias: {
        id: 'fiestas_patrias',
        name: 'Fiestas Patrias Chile 🇨🇱🎈',
        bgColor: 'bg-blue-50',
        bannerBg: 'bg-gradient-to-r from-blue-700 via-white to-red-600',
        bannerText: ' text-slate-900 font-black ',
        titleMsg: '¡Viva Chile! Fiestas Patrias 🇨🇱🎈',
        greetingMsg: '¡A comprar las empanadas y la carne para el asado!',
        emoji: '🥟'
    }
};

const TEAM_NAME_PRESETS = [
    "Equipo Multidisciplinario",
    "Programa de Integración Escolar (PIE)",
    "Equipo de Apoyo Pedagógico",
    "Equipo de Inclusión Escolar",
    "Unidad de Autonomía Funcional",
    "Equipo Psicopedagógico"
];

const DEFAULT_SETTINGS = {
    schoolName: "Escuela Especial Adaptativa",
    schoolSubHeader: "Unidad de Autonomía Funcional",
    teamName: "Equipo Multidisciplinario",
    schoolLogo: "",
    mascotUrl: "",
    activeTheme: "standard",
    directorName: "Equipo Multidisciplinario"
};

// ==========================================
// DATA URIS DE SVG DE BILLETES Y MONEDAS CHILENAS
// ==========================================
function makeSvgDataUrl(svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

const SVG_B20K_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#e67e22"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#f39c12" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$20.000</text><text x="100" y="75" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#fdebd0" text-anchor="middle">PESOS CHILENOS</text></svg>`;
const SVG_B10K_RAW = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#2980b9"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#5499c7" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$10.000</text><text x="100" y="75" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#d4e6f1" text-anchor="middle">PESOS CHILENOS</text></svg>`;
const SVG_B5K_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#c0392b"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#ec7063" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$5.000</text><text x="100" y="75" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#fadbd8" text-anchor="middle">PESOS CHILENOS</text></svg>`;
const SVG_B2K_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#8e44ad"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#bb8fce" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$2.000</text><text x="100" y="75" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#ebdef0" text-anchor="middle">PESOS CHILENOS</text></svg>`;
const SVG_B1K_RAW  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#27ae60"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#58d68d" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$1.000</text><text x="100" y="75" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#d4efdf" text-anchor="middle">PESOS CHILENOS</text></svg>`;
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

const PRESET_CATEGORIES = [
    { name: "Frutas y Verduras", icon: "🍎" },
    { name: "Carnes, Pescados y Mariscos", icon: "🥩" },
    { name: "Lácteos, Yogures y Huevos", icon: "🥛" },
    { name: "Fiambrería, Quesos y Platos Preparados", icon: "🧀" },
    { name: "Congelados", icon: "🧊" },
    { name: "Despensa / Abarrotes", icon: "🌾" },
    { name: "Panadería y Pastelería", icon: "🍞" },
    { name: "Snacks, Galletas y Confitería", icon: "🍿" },
    { name: "Bebidas, Agua y Jugos", icon: "🧃" },
    { name: "Cuidado Personal / Higiene", icon: "🧴" },
    { name: "Limpieza del Hogar", icon: "🧼" },
    { name: "Mascotas", icon: "🐶" },
    { name: "Bebé y Niño", icon: "👶" },
    { name: "Juguetes y Juegos", icon: "🧸" },
    { name: "Electrodomésticos", icon: "🔌" },
    { name: "Menaje Hogar", icon: "🍽️" },
    { name: "Vestuario", icon: "👕" }
];

// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    selectedCategoryFilter: 'ALL',
    teacherActiveTab: 'home',
    teacherPreviewMode: false,
    basket: [],
    userPaidAmount: 0,
    userPaidItems: [],
    courses: [],
    categories: [],
    users: [],
    supermarkets: [],
    products: [],
    evaluations: [],
    customCurrencies: {},
    settings: { ...DEFAULT_SETTINGS },
    telemetry: { voiceHelpCount: 0 },
    missionStartTime: null,
    html5QrcodeScanner: null,
    
    // ESTADO DE MISIÓN Y ESCANEO CON CÁMARA
    activeMission: null,          
    classroomMode: 'PREP',        
    listValidated: false,         
    scannedItemsInStore: {},      
    classroomErrorsCount: 0,      
    priceAdjustmentsCount: 0,     
    pendingScanProduct: null,     
    currentTargetScanProduct: null, // Producto que el estudiante debe escanear
    invalidBasketItems: []        
};

// ==========================================
// UTILIDADES DE AUDIO Y VOZ
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

function playChimeSound(isError = false) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = isError ? 'sawtooth' : 'sine';
        
        if (isError) {
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        } else {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        }
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.35);
    } catch(e) {}
}

function compressImageBase64(base64Data, maxWidth = 300, maxHeight = 300, quality = 0.7) {
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
                <img src="${imgSrc}" class="h-8 object-contain">
                <span class="text-xs font-black text-amber-950">${b.count > 1 ? b.count + 'x' : ''}</span>
            </div>`;
        }).join('') +
    `</div>`;
}

// ==========================================
// RENDERIZADO PRINCIPAL
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    const headerSubTitle = document.getElementById('headerSubTitle');
    if (!container) return;

    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) 
        ? APP_STATE.settings.teamName 
        : 'Equipo Multidisciplinario';

    if (headerSubTitle) headerSubTitle.textContent = teamLabel;

    if (APP_STATE.currentUser) {
        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin General' :
                       (APP_STATE.currentUser.role === 'teacher' ? `👨‍🏫 ${teamLabel}` : '🎒 Alumno');
        
        if (userInfoHeader) {
            userInfoHeader.innerHTML = `
                <div class="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-xs flex items-center gap-2 shadow-sm">
                    <span class="font-bold text-indigo-900">${APP_STATE.currentUser.name}</span>
                    <span class="bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md text-[10px]">${roleTag}</span>
                    ${APP_STATE.currentUser.role === 'student' ? `<span class="bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">⭐ ${APP_STATE.currentUser.points || 0} pts</span>` : ''}
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
                <p class="text-xs font-semibold text-slate-500">Ingresa tu RUT y PIN</p>
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
    APP_STATE.classroomMode = 'PREP';
    APP_STATE.listValidated = false;
    APP_STATE.classroomErrorsCount = 0;
    APP_STATE.invalidBasketItems = [];
    localStorage.removeItem('nee_active_user');
    renderApp();
}

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    APP_STATE.selectedCategoryFilter = 'ALL';
    renderApp();
}

// ==========================================
// VISTA ESTUDIANTE Y ELECCIÓN DE SUPERMERCADO
// ==========================================
function renderHomeView(container) {
    const activeThemeKey = APP_STATE.settings.activeTheme || 'standard';
    const theme = SEASONAL_THEMES[activeThemeKey] || SEASONAL_THEMES.standard;
    const mascot = APP_STATE.settings.mascotUrl;
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

    let studentMissionBanner = '';
    if (APP_STATE.activeMission && APP_STATE.activeMission.active && APP_STATE.activeMission.itemIds) {
        const itemCount = APP_STATE.activeMission.itemIds.length;
        const currentScore = Math.max(20, 100 - (APP_STATE.classroomErrorsCount * 20));
        
        studentMissionBanner = `
            <div class="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-amber-300 space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl sm:text-5xl">🎯</span>
                        <div>
                            <span class="bg-slate-900 text-amber-300 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-block mb-1">
                                🔴 ¡TIENES UNA MISIÓN ACTIVA!
                            </span>
                            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">${APP_STATE.activeMission.title}</h3>
                            <p class="text-xs font-extrabold text-slate-950">Asignada por tu ${teamLabel} • ${itemCount} productos en tu hoja impresa</p>
                        </div>
                    </div>
                    <div class="bg-slate-900 text-amber-300 font-black px-4 py-2 rounded-2xl text-center border-2 border-amber-400 shadow-md">
                        <span class="text-[10px] text-white block uppercase">Puntuación Actual:</span>
                        <span class="text-xl text-amber-400">${currentScore}%</span>
                    </div>
                </div>
                <div class="p-3 bg-white/90 rounded-2xl border border-amber-600 text-slate-900 text-xs font-black flex items-center gap-2">
                    <span>👇</span> <span><b>Elige a continuación el supermercado en el que deseas entrar para realizar tu lista:</b></span>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="space-y-6">
            ${studentMissionBanner}

            <div class="${theme.bannerBg} p-6 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden border-4 border-white/30">
                <div class="space-y-2 z-10">
                    <h2 class="text-2xl sm:text-4xl font-black ${theme.bannerText}">${theme.titleMsg}</h2>
                    <p class="text-sm font-bold text-white/90">${theme.greetingMsg}</p>
                </div>
                ${mascot ? `
                    <div class="z-10 flex flex-col items-center bg-white/20 p-2 rounded-2xl backdrop-blur-sm border border-white/40">
                        <img src="${mascot}" class="w-20 h-20 sm:w-28 sm:h-28 object-contain animate-bounce">
                        <span class="text-[10px] font-black text-white uppercase bg-black/40 px-2 py-0.5 rounded-md mt-1">Mascota del Colegio</span>
                    </div>
                ` : `<div class="text-6xl sm:text-8xl z-10 opacity-90">${theme.emoji}</div>`}
            </div>

            <div class="space-y-3">
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span>🏪</span> <span>Supermercados Disponibles (Toca uno para entrar):</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${(APP_STATE.supermarkets || []).length === 0 ? `
                        <div class="col-span-full text-center py-12 bg-white rounded-3xl border-4 border-slate-200 shadow-sm">
                            <span class="text-6xl">🏪</span>
                            <h3 class="text-xl font-black text-slate-700 mt-2">No hay supermercados disponibles.</h3>
                        </div>
                    ` : (APP_STATE.supermarkets || []).map(sup => {
                        const supLogo = sup.photoUrl || sup.photo || sup.logoUrl || '';
                        const logoHtml = supLogo 
                            ? `<img src="${supLogo}" class="w-28 h-28 object-contain rounded-3xl p-2 bg-white border-4 border-slate-200 shadow-sm">`
                            : `<div class="bg-amber-400 p-4 rounded-3xl text-6xl flex items-center justify-center w-28 h-28 shadow-sm">${sup.icon || '🛒'}</div>`;
                        return `
                            <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-xl hover:shadow-2xl cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-all hover:border-indigo-500">
                                ${logoHtml}
                                <h3 class="text-2xl font-black text-slate-800">${sup.name}</h3>
                                <button class="w-full bg-indigo-600 text-white font-black py-3 rounded-2xl shadow-lg text-lg border-b-4 border-indigo-900 flex items-center justify-center gap-2">
                                    <span>🚀</span> <span>¡Entrar a ${sup.name}!</span>
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = String(id);
    APP_STATE.selectedCategoryFilter = 'ALL';
    APP_STATE.missionStartTime = Date.now();

    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(id));
    const supName = sup ? sup.name : 'Supermercado';

    speakText(`Entraste a ${supName}. Agrega los productos de tu lista y comprueba al terminar.`);
    renderApp();
}

function setCategoryFilter(catName) {
    APP_STATE.selectedCategoryFilter = catName;
    playChimeSound();
    const labelToSpeak = (catName === 'ALL') ? 'Todos los productos' : catName;
    speakText(`Categoría ${labelToSpeak}`);
    renderApp();
}

// ==========================================
// VERIFICACIÓN DE LISTA EN SALA Y EVALUACIÓN DE ERRORES
// ==========================================
function validateStudentList() {
    if (!APP_STATE.activeMission || !APP_STATE.activeMission.itemIds) {
        return alert("No hay una misión activa en este momento.");
    }

    const targetMissionIds = APP_STATE.activeMission.itemIds.map(id => String(id));
    const basketProductIds = (APP_STATE.basket || []).map(b => String(b.productId));

    const missingItems = targetMissionIds.filter(id => !basketProductIds.includes(id));
    const extraItems = basketProductIds.filter(id => !targetMissionIds.includes(id));

    if (missingItems.length > 0 || extraItems.length > 0) {
        APP_STATE.classroomErrorsCount++;
        playChimeSound(true);
        
        const currentScore = Math.max(20, 100 - (APP_STATE.classroomErrorsCount * 20));
        APP_STATE.invalidBasketItems = extraItems;

        let extraNames = extraItems.map(id => {
            const p = (APP_STATE.products || []).find(x => String(x.id) === String(id));
            return p ? p.name : 'Producto';
        }).join(', ');

        const alertMsg = `⚠️ Te equivocaste. Vuelve a revisar tu lista impresa.\n\n` +
            (missingItems.length > 0 ? `• Te falta(n) ${missingItems.length} producto(s) por agregar.\n` : '') +
            (extraItems.length > 0 ? `• Agregaste este producto que NO está en la lista: ${extraNames}.\n` : '') +
            `\n👉 Presiona el botón rojo "🗑️ QUITAR ESTE PRODUCTO" que está marcado en la tarjeta para corregir tu lista.\n\nPuntuación actual: ${currentScore}%`;

        speakText(`Te equivocaste. Agregaste ${extraNames || 'un producto'} que no corresponde. Toca el botón rojo quitar en su tarjeta para eliminarlo.`);
        alert(alertMsg);
        renderApp();
    } else {
        APP_STATE.invalidBasketItems = [];
        APP_STATE.listValidated = true;
        playChimeSound(false);
        if (typeof confetti !== 'undefined') confetti();
        speakText("¡Excelente! Tu lista está perfecta y 100% correcta. Presiona sigamos con la misión para ir al supermercado.");
        renderApp();
    }
}

function removeFromBasketByProductId(prodId) {
    const index = (APP_STATE.basket || []).findIndex(b => String(b.productId) === String(prodId));
    if (index !== -1) {
        const prod = (APP_STATE.products || []).find(p => String(p.id) === String(prodId));
        APP_STATE.basket.splice(index, 1);
        APP_STATE.invalidBasketItems = (APP_STATE.invalidBasketItems || []).filter(id => String(id) !== String(prodId));
        updateBasketBadge();
        playChimeSound();
        if (prod) speakText(`Quitaste ${prod.name} de tu lista`);
        renderApp();
    }
}

function enterTerrenoStoreMode() {
    APP_STATE.classroomMode = 'TERRENO';
    APP_STATE.scannedItemsInStore = {};
    speakText("¡Genial! Ahora estás en el supermercado real. Escanea los productos de la góndola o verifica sus precios en la repisa.");
    playChimeSound();
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => 
        String(s.id).toLowerCase() === String(supId).toLowerCase() ||
        String(s.name).toLowerCase() === String(supId).toLowerCase()
    );

    const currentScore = Math.max(20, 100 - (APP_STATE.classroomErrorsCount * 20));

    let classroomValidationBanner = '';
    if (APP_STATE.activeMission && APP_STATE.activeMission.active) {
        if (APP_STATE.classroomMode === 'PREP') {
            if (APP_STATE.listValidated) {
                classroomValidationBanner = `
                    <div class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-2xl border-4 border-emerald-300 space-y-4">
                        <div class="flex items-center gap-4">
                            <span class="text-5xl">🎉</span>
                            <div>
                                <span class="bg-white text-emerald-900 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-block mb-1">
                                    ¡COMPROBACIÓN EXITOSA!
                                </span>
                                <h3 class="text-2xl font-black text-white">¡Sigamos con la misión! 🚀</h3>
                                <p class="text-sm font-bold text-emerald-100">Ahora tienes que ir al supermercado a escanear los productos y revisar si los precios coinciden con los precios que tenemos en la aplicación.</p>
                            </div>
                        </div>
                        <button onclick="enterTerrenoStoreMode()" class="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-2xl shadow-2xl border-b-4 border-amber-600 active:scale-95 flex items-center justify-center gap-2">
                            <span>🏪</span> <span>IR AL SUPERMERCADO A ESCANEAR GÓNDOLA</span>
                        </button>
                    </div>
                `;
            } else {
                classroomValidationBanner = `
                    <div class="bg-indigo-50 border-4 border-indigo-300 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">📋</span>
                            <div>
                                <h3 class="text-base font-black text-indigo-950">Ficha Activa: "${APP_STATE.activeMission.title}"</h3>
                                <p class="text-xs font-bold text-slate-600">Revisa tu hoja impresa, añade los productos al canasto y presiona comprobar. Si te equivocas, puedes quitar el producto presionando el botón rojo.</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 w-full sm:w-auto">
                            <div class="bg-indigo-600 text-white font-black px-3 py-2 rounded-xl text-center text-xs">
                                <span>Puntaje:</span> <span class="text-amber-300 font-black text-sm">${currentScore}%</span>
                            </div>
                            <button onclick="validateStudentList()" class="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-base px-5 py-3 rounded-2xl shadow border-b-4 border-amber-600 active:scale-95 flex items-center justify-center gap-2">
                                <span>🔍</span> <span>¡Comprobar si mi lista está correcta!</span>
                            </button>
                        </div>
                    </div>
                `;
            }
        } else {
            classroomValidationBanner = `
                <div class="bg-emerald-600 text-white p-4 rounded-3xl shadow-md border-4 border-emerald-808 flex justify-between items-center text-xs font-bold">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🏪</span>
                        <span>MODO TERRENO: Escanea los productos. El sistema reconocerá si es el producto correcto y ajustará el precio.</span>
                    </div>
                    <span class="bg-amber-400 text-slate-900 font-black px-3 py-1 rounded-xl text-xs">⭐ ${currentScore}% Logro</span>
                </div>
            `;
        }
    }

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

    const currentFilter = APP_STATE.selectedCategoryFilter || 'ALL';
    const filteredProducts = currentFilter === 'ALL' 
        ? uniqueProducts 
        : uniqueProducts.filter(p => (p.category || '').toLowerCase() === currentFilter.toLowerCase());

    const supLogo = sup ? (sup.photoUrl || sup.photo || sup.logoUrl || '') : '';
    const supIconHtml = supLogo 
        ? `<img src="${supLogo}" class="w-14 h-14 object-contain rounded-2xl border-2 border-slate-200 shadow-sm p-1 bg-white">`
        : `<span class="text-4xl">${sup ? (sup.icon || '🏪') : '🏪'}</span>`;

    const categoryList = [{ name: 'ALL', label: 'Todos los Productos', icon: '🛒' }];
    PRESET_CATEGORIES.forEach(c => categoryList.push({ name: c.name, label: c.name, icon: c.icon }));

    const mascot = APP_STATE.settings.mascotUrl;

    const productsHtml = filteredProducts.length === 0 ? `
        <div class="col-span-full text-center py-16 bg-white rounded-3xl border-4 border-slate-200 shadow-sm">
            <span class="text-6xl">📦</span>
            <h3 class="text-xl font-black text-slate-700 mt-2">No hay productos en esta categoría</h3>
            <button onclick="setCategoryFilter('ALL')" class="mt-4 bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl text-sm">Ver todos los productos</button>
        </div>
    ` : filteredProducts.map(prod => {
        const imgUrl = prod.photoUrl || prod.photo || prod.image || '';
        const prodImg = imgUrl 
            ? `<img src="${imgUrl}" class="w-24 h-24 object-cover rounded-2xl border-2 border-slate-200 shadow-sm">`
            : `<span class="text-6xl">${prod.iconEmoji || '📦'}</span>`;
            
        const pricePictograms = getPricePictogramsHtml(prod.price || 0);
        const isScannedInTerreno = APP_STATE.scannedItemsInStore[prod.id];
        
        const basketIndex = (APP_STATE.basket || []).findIndex(b => String(b.productId) === String(prod.id));
        const isInBasket = basketIndex !== -1;
        const isExtraItem = (APP_STATE.invalidBasketItems || []).includes(String(prod.id));

        let cardStyle = 'border-slate-200 bg-white';
        if (isExtraItem) {
            cardStyle = 'border-4 border-rose-500 bg-rose-50 shadow-2xl animate-pulse ring-4 ring-rose-300';
        } else if (isInBasket) {
            cardStyle = 'border-4 border-indigo-500 bg-indigo-50/30';
        } else if (isScannedInTerreno) {
            cardStyle = 'border-4 border-emerald-500 bg-emerald-50/20';
        }

        return `
            <div class="p-5 rounded-3xl border-4 ${cardStyle} shadow-lg flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all">
                <div class="flex items-start space-x-4">
                    ${prodImg}
                    <div class="space-y-1 w-full">
                        <div class="flex justify-between items-start">
                            <h3 class="text-xl font-black text-slate-800 leading-tight">${prod.name}</h3>
                            ${isInBasket ? `
                                <button onclick="removeFromBasketByProductId('${prod.id}')" class="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow border border-rose-800 flex items-center gap-1 active:scale-95">
                                    <span>🗑️</span> <span>Quitar</span>
                                </button>
                            ` : ''}
                        </div>
                        <div class="text-3xl font-black text-emerald-700">$${(prod.price || 0).toLocaleString('es-CL')}</div>
                        ${pricePictograms}
                        <span class="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-extrabold mt-1 border">${prod.category || 'General'}</span>
                    </div>
                </div>
                <div class="flex gap-2 pt-2 border-t">
                    <button onclick="speakText('${prod.name}, precio ${prod.price} pesos')" class="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold p-3.5 rounded-2xl shadow-sm text-2xl active:scale-95">🔊</button>
                    ${APP_STATE.classroomMode === 'TERRENO' ? `
                        <button onclick="verifyTerrenoProduct('${prod.id}')" class="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3.5 rounded-2xl shadow border-b-4 border-amber-600 active:scale-95 text-base flex items-center justify-center gap-1.5">
                            <span>📷</span> <span>Escanear / Verificar Góndola</span>
                        </button>
                    ` : `
                        ${isInBasket ? `
                            <button onclick="removeFromBasketByProductId('${prod.id}')" class="w-full ${isExtraItem ? 'bg-rose-600 hover:bg-rose-700 animate-bounce' : 'bg-rose-500 hover:bg-rose-600'} text-white font-black py-3.5 rounded-2xl shadow-lg border-b-4 border-rose-900 active:scale-95 text-sm flex items-center justify-center gap-2">
                                <span>🗑️</span> <span>QUITAR ESTE PRODUCTO</span>
                            </button>
                        ` : `
                            <button onclick="addToBasket('${prod.id}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow border-b-4 border-emerald-900 active:scale-95 text-lg">🛒 Añadir al Canasto</button>
                        `}
                    `}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-6">
            ${classroomValidationBanner}

            <div class="flex items-center justify-between bg-white p-4 rounded-3xl border-4 border-slate-300 shadow-md">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-4 py-3 rounded-2xl text-xs sm:text-sm active:scale-95">← Volver a Tiendas</button>
                <div class="flex items-center gap-3">
                    ${supIconHtml}
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
                </div>
                ${mascot ? `<img src="${mascot}" class="h-12 w-12 object-contain hidden sm:block">` : ''}
            </div>

            <div class="space-y-2">
                <label class="text-xs font-black text-slate-600 uppercase tracking-wider block px-1">📁 Categorías disponibles:</label>
                <div class="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                    ${categoryList.map(c => {
                        const active = (currentFilter.toLowerCase() === c.name.toLowerCase());
                        return `
                            <button onclick="setCategoryFilter('${c.name}')" class="flex-shrink-0 px-4 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow flex items-center gap-2 active:scale-95 ${active ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 scale-105' : 'bg-white text-slate-800 border-2 border-slate-200 hover:bg-slate-100'}">
                                <span class="text-lg">${c.icon}</span>
                                <span>${c.label}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${productsHtml}
            </div>
        </div>
    `;
}

// ==========================================
// VERIFICACIÓN CON CÁMARA Y AJUSTE DE PRECIO EN GÓNDOLA
// ==========================================
function verifyTerrenoProduct(productId) {
    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(productId));
    if (!prod) return;

    APP_STATE.currentTargetScanProduct = prod.id;
    speakText(`Apunta la cámara al producto ${prod.name} para verificarlo.`);
    openScannerModal(prod.id);
}

function openScannerModal(targetProductId = null) {
    if (targetProductId) {
        APP_STATE.currentTargetScanProduct = targetProductId;
    }
    const modal = document.getElementById('scannerModal');
    if (modal) modal.classList.remove('hidden');

    // Tiempo de espera breve para asegurar que el modal y su contenedor en el DOM estén visibles
    setTimeout(() => {
        startCameraScanner();
    }, 250);
}

function closeScannerModal() {
    const modal = document.getElementById('scannerModal');
    if (modal) modal.classList.add('hidden');
    stopCameraScanner();
}

function startCameraScanner() {
    const placeholder = document.getElementById('scannerPlaceholder');
    const laser = document.getElementById('laserLine');
    if (placeholder) placeholder.classList.add('hidden');
    if (laser) laser.classList.remove('hidden');

    if (typeof Html5Qrcode !== 'undefined') {
        if (APP_STATE.html5QrcodeScanner) {
            APP_STATE.html5QrcodeScanner.stop().catch(() => {}).then(() => initHtml5Qrcode());
        } else {
            initHtml5Qrcode();
        }
    } else {
        simulateAIScan();
    }
}

function initHtml5Qrcode() {
    try {
        APP_STATE.html5QrcodeScanner = new Html5Qrcode("qrScannerReader");
        APP_STATE.html5QrcodeScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
                onProductScanned(decodedText);
            },
            (err) => {}
        ).catch(err => {
            console.warn("Cámara no iniciada:", err);
            const placeholder = document.getElementById('scannerPlaceholder');
            if (placeholder) {
                placeholder.classList.remove('hidden');
                placeholder.innerHTML = `<p class="text-amber-600 font-bold text-xs p-2">Si la cámara no enciende por permisos, presiona el botón "Simular Escaneo" para avanzar la prueba.</p>`;
            }
        });
    } catch(e) {
        simulateAIScan();
    }
}

function stopCameraScanner() {
    const laser = document.getElementById('laserLine');
    const placeholder = document.getElementById('scannerPlaceholder');
    if (laser) laser.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');

    if (APP_STATE.html5QrcodeScanner) {
        try {
            APP_STATE.html5QrcodeScanner.stop().catch(() => {});
        } catch(e) {}
    }
}

function onProductScanned(scannedCode) {
    const cleanCode = String(scannedCode).trim().toLowerCase();
    
    // Buscar si el código escaneado coincide con algún producto
    const foundProduct = (APP_STATE.products || []).find(p => 
        String(p.id).toLowerCase() === cleanCode ||
        String(p.code || '').toLowerCase() === cleanCode ||
        String(p.name || '').toLowerCase() === cleanCode
    );

    const targetId = APP_STATE.currentTargetScanProduct;
    const targetProduct = targetId ? (APP_STATE.products || []).find(p => String(p.id) === String(targetId)) : null;

    if (targetProduct) {
        // VALIDACIÓN POR CÁMARA DE PRODUCTO CORRECTO VS ERRORES
        if (foundProduct && String(foundProduct.id) === String(targetProduct.id)) {
            playChimeSound(false);
            closeScannerModal();
            speakText(`¡Excelente! La cámara ha reconocido ${targetProduct.name}. Ahora revisa el precio en la repisa.`);
            openShelfPriceConfirmation(targetProduct.id);
        } else {
            playChimeSound(true);
            const scannedName = foundProduct ? foundProduct.name : 'otro producto no registrado';
            const msg = `¡Atención! Este no es el producto. La cámara detectó ${scannedName}, pero estás buscando ${targetProduct.name}.`;
            speakText(msg);
            alert(`⚠️ ¡PRODUCTO INCORRECTO EN GÓNDOLA!\n\nLa cámara de la app detectó: "${scannedName}".\n\nEn tu lista estás buscando: "${targetProduct.name}".\n\nApunta la cámara al producto correcto para verificarlo.`);
        }
    } else {
        closeScannerModal();
        if (foundProduct) {
            playChimeSound(false);
            speakText(`Producto detectado: ${foundProduct.name}.`);
            openShelfPriceConfirmation(foundProduct.id);
        } else {
            playChimeSound(true);
            speakText("Nuevo producto detectado.");
            promptAssignProductToBarcode(scannedCode);
        }
    }
}

function simulateAIScan() {
    const targetId = APP_STATE.currentTargetScanProduct;
    const targetProduct = targetId ? (APP_STATE.products || []).find(p => String(p.id) === String(targetId)) : null;

    if (targetProduct) {
        onProductScanned(targetProduct.code || targetProduct.id);
    } else {
        const fakeBarcodes = ['780123456789', '780999888777', '780555444333'];
        const chosenCode = fakeBarcodes[Math.floor(Math.random() * fakeBarcodes.length)];
        onProductScanned(chosenCode);
    }
}

function openShelfPriceConfirmation(productId) {
    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(productId));
    if (!prod) return;

    APP_STATE.pendingScanProduct = prod;
    document.getElementById('shelfPriceProdName').textContent = prod.name;
    document.getElementById('shelfPriceOriginalLabel').textContent = `$${(prod.price || 0).toLocaleString('es-CL')}`;

    const basePrice = prod.price || 800;
    const suggestedPrices = [basePrice, 1500, basePrice + 300, Math.max(500, basePrice - 200)];

    const btnContainer = document.getElementById('shelfPriceButtonsContainer');
    if (btnContainer) {
        btnContainer.innerHTML = suggestedPrices.map(p => `
            <button onclick="applyShelfPriceChoice(${p})" class="p-3 bg-amber-50 border-2 border-amber-300 hover:bg-amber-500 hover:text-slate-900 rounded-2xl font-black text-sm active:scale-95 shadow">
                $${p.toLocaleString('es-CL')} ${p !== basePrice ? '⚠️ (Cambió en Góndola)' : '✓ (Igual)'}
            </button>
        `).join('');
    }

    document.getElementById('shelfPriceModal').classList.remove('hidden');
}

function applyShelfPriceChoice(newPrice) {
    const prod = APP_STATE.pendingScanProduct;
    if (!prod) return;

    const oldPrice = prod.price || 0;
    APP_STATE.scannedItemsInStore[prod.id] = true;

    if (newPrice !== oldPrice) {
        APP_STATE.priceAdjustmentsCount++;
        const bItem = APP_STATE.basket.find(b => String(b.productId) === String(prod.id));
        if (bItem) bItem.actualPrice = newPrice;
        prod.price = newPrice;

        const msg = `El valor de ${prod.name} es diferente al que tenemos en la aplicación. Se cambiará al valor del supermercado de ${newPrice} pesos para pagar el monto real.`;
        speakText(msg);

        alert(`🔔 ¡CAMBIO DE PRECIO EN GÓNDOLA!\n\nEl producto "${prod.name}" en la app salía a $${oldPrice.toLocaleString('es-CL')}.\nEn el supermercado real sale a $${newPrice.toLocaleString('es-CL')}.\n\nSe ha configurado automáticamente para cobrar el valor exacto del supermercado en la caja de pago.`);
    } else {
        speakText(`¡Excelente! El precio de ${prod.name} coincide a ${newPrice} pesos.`);
    }

    document.getElementById('shelfPriceModal').classList.add('hidden');
    playChimeSound();
    renderApp();
}

function applyCustomShelfPrice() {
    const val = parseInt(document.getElementById('shelfPriceCustomInput').value);
    if (!isNaN(val) && val > 0) {
        applyShelfPriceChoice(val);
    }
}

function promptAssignProductToBarcode(barcode) {
    const resContainer = document.getElementById('scannerResultContainer');
    if (!resContainer) return;

    const availableProducts = (APP_STATE.products || []);

    resContainer.className = "p-4 bg-amber-50 border-4 border-amber-400 rounded-2xl text-left space-y-3";
    resContainer.innerHTML = `
        <div class="text-amber-900 font-black text-xs uppercase flex items-center gap-1.5">
            <span>✨</span> <span>¡Código Nuevo Escaneado (${barcode})!</span>
        </div>
        <p class="text-xs font-extrabold text-slate-800">¿Qué producto es este envase? Toca para vincularlo:</p>
        <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            ${availableProducts.length === 0 ? `<p class="col-span-full text-xs font-bold text-slate-500">No hay productos en el catálogo para vincular.</p>` : availableProducts.map(p => `
                <button onclick="bindBarcodeToProduct('${barcode}', '${p.id}')" class="p-2.5 bg-white border-2 border-amber-300 hover:border-indigo-600 rounded-xl flex items-center justify-between text-left active:scale-95 shadow-sm">
                    <div>
                        <span class="font-black text-slate-800 text-xs block">${p.name}</span>
                        <span class="text-emerald-700 font-black text-xs">$${(p.price || 0).toLocaleString('es-CL')}</span>
                    </div>
                    <span class="text-xl">🛒</span>
                </button>
            `).join('')}
        </div>
    `;

    resContainer.classList.remove('hidden');
}

function bindBarcodeToProduct(barcode, productId) {
    let targetProduct = (APP_STATE.products || []).find(p => p.id === productId);
    
    if (!targetProduct) {
        targetProduct = { id: productId, name: 'Producto', price: 1500, code: barcode };
    } else {
        targetProduct.code = barcode;
    }

    if (db) {
        db.collection('products').doc(targetProduct.id).set({ code: barcode }, { merge: true });
    }

    playChimeSound();
    speakText(`¡Excelente! Ahora este código es ${targetProduct.name}.`);
    closeScannerModal();
    openShelfPriceConfirmation(targetProduct.id);
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
// CANASTO Y CAJA DE PAGO ADAPTATIVA
// ==========================================
function updateBasketBadge() {
    const badge = document.getElementById('basketBadge');
    if (badge) badge.textContent = (APP_STATE.basket || []).length;
}

function addToBasket(prodId) {
    let prod = (APP_STATE.products || []).find(p => String(p.id) === String(prodId));
    if (!prod) prod = { id: prodId, name: 'Producto Escaneado', price: 2000 };
    
    const existing = APP_STATE.basket.find(b => String(b.productId) === String(prod.id));
    if (!existing) {
        APP_STATE.basket.push({ productId: prod.id, quantity: 1, actualPrice: prod.price });
        playChimeSound();
        updateBasketBadge();
        speakText(`Añadido ${prod.name}`);
    } else {
        speakText(`${prod.name} ya está en tu canasto`);
    }
    renderApp();
}

function removeFromBasket(index) {
    APP_STATE.basket.splice(index, 1);
    updateBasketBadge();
    renderBasketModalContent();
    renderApp();
}

function clearBasket() {
    APP_STATE.basket = [];
    APP_STATE.userPaidAmount = 0;
    APP_STATE.userPaidItems = [];
    APP_STATE.invalidBasketItems = [];
    updateBasketBadge();
    renderBasketModalContent();
    renderApp();
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
            const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId)) || { name: 'Producto', price: 2000 };
            const itemPrice = item.actualPrice || p.price || 0;
            total += itemPrice;
            const imgUrl = p.photoUrl || p.photo || p.image || '';
            const imgHtml = imgUrl 
                ? `<img src="${imgUrl}" class="w-10 h-10 object-cover rounded-xl border border-slate-200">`
                : `<span class="text-2xl">${p.iconEmoji || '📦'}</span>`;
            return `
                <div class="flex items-center justify-between p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold">
                    <div class="flex items-center space-x-3">
                        ${imgHtml}
                        <div>
                            <span class="text-slate-800 font-black text-sm block">${p.name}</span>
                            ${getPricePictogramsHtml(itemPrice)}
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-black text-emerald-700 text-base">$${itemPrice.toLocaleString('es-CL')}</span>
                        <button onclick="removeFromBasket(${idx})" class="text-rose-600 font-black px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-xs">✕ Quitar</button>
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
            breakdownEl.innerHTML = `<span class="text-xs text-slate-400 font-bold italic">Toca abajo los billetes y monedas para pagar.</span>`;
        } else {
            const counts = {};
            APP_STATE.userPaidItems.forEach(item => { counts[item.id] = (counts[item.id] || 0) + 1; });

            breakdownEl.innerHTML = Object.keys(counts).map(id => {
                const item = CLP_CURRENCY_ITEMS.find(c => c.id === id);
                if (!item) return '';
                const count = counts[id];
                const imgSrc = APP_STATE.customCurrencies[id] || item.img;
                return `<div class="inline-flex items-center gap-1.5 bg-white border-2 border-amber-400 rounded-xl px-2.5 py-1 shadow-sm">
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
                <button onclick="addPaymentMoney('${item.id}')" class="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-2 flex flex-col items-center justify-center space-y-1 active:scale-95 shadow transition-all">
                    <img src="${imgSrc}" class="h-10 object-contain">
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

function verifyAndCheckout() {
    let total = 0;
    (APP_STATE.basket || []).forEach(item => {
        const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId)) || { price: 2000 };
        total += (item.actualPrice || p.price || 0);
    });

    if (total === 0) return alert("Tu canasto está vacío.");
    if (APP_STATE.userPaidAmount < total) {
        const falta = total - APP_STATE.userPaidAmount;
        speakText(`Te faltan ${falta} pesos para completar la compra.`);
        return alert(`⚠️ Monto insuficiente. Te faltan $${falta.toLocaleString('es-CL')} para pagar.`);
    }

    const vuelto = APP_STATE.userPaidAmount - total;
    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(APP_STATE.selectedSupermarketId));
    const elapsedSeconds = APP_STATE.missionStartTime ? Math.round((Date.now() - APP_STATE.missionStartTime) / 1000) : 25;

    const errors = APP_STATE.classroomErrorsCount || 0;
    const pointsEarned = Math.max(20, 100 - (errors * 20));
    
    let medal = "🥇 Medalla de Oro (100% Perfecto)";
    let feedback = "¡Increíble! Lograste completar tu lista a la primera sin errores.";

    if (errors === 1) {
        medal = "🥈 Medalla de Plata (80% Gran trabajo)";
        feedback = "¡Muy bien! Tuviste solo 1 intento fallido.";
    } else if (errors === 2) {
        medal = "🥉 Medalla de Bronce (60% Buen esfuerzo)";
        feedback = "¡Bien hecho! Sigue practicando para ganar la medalla de oro.";
    } else if (errors >= 3) {
        medal = "🌟 Estrella de Participación (" + pointsEarned + "%)";
        feedback = "¡Completaste tu compra! Cada intento te hace aprender.";
    }

    if (APP_STATE.currentUser) {
        APP_STATE.currentUser.points = (APP_STATE.currentUser.points || 0) + pointsEarned;
        localStorage.setItem('nee_active_user', JSON.stringify(APP_STATE.currentUser));
        if (db && APP_STATE.currentUser.id) {
            db.collection('users').doc(APP_STATE.currentUser.id).set({ points: APP_STATE.currentUser.points }, { merge: true });
        }
    }

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
        timeSeconds: elapsedSeconds,
        classroomErrorsCount: errors,
        pointsEarned: pointsEarned,
        priceAdjustmentsCount: APP_STATE.priceAdjustmentsCount,
        voiceHelpCount: APP_STATE.telemetry.voiceHelpCount,
        date: new Date().toLocaleString('es-CL'),
        timestamp: firebase.firestore ? firebase.firestore.FieldValue.serverTimestamp() : null
    };

    if (db) {
        db.collection('evaluations').doc(evalData.id).set(evalData);
    }

    if (typeof confetti !== 'undefined') confetti();

    document.getElementById('gamificationPointsBadge').textContent = `+${pointsEarned} PUNTOS`;
    document.getElementById('gamificationMedalIcon').textContent = medal;
    document.getElementById('gamificationFeedbackText').textContent = feedback;

    document.getElementById('successModalTotal').textContent = `$${total.toLocaleString('es-CL')}`;
    document.getElementById('successModalPaid').textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoAmount').textContent = `$${vuelto.toLocaleString('es-CL')}`;

    const vueltoContainer = document.getElementById('successModalVueltoBreakdown');
    if (vueltoContainer) {
        vueltoContainer.innerHTML = getPricePictogramsHtml(vuelto) || `<p class="text-xs font-bold text-slate-500">Monto exacto. No requiere vuelto.</p>`;
    }

    closeBasketModal();
    document.getElementById('checkoutSuccessModal').classList.remove('hidden');
    speakText(`¡Excelente compra! Ganaste ${pointsEarned} puntos. Tu vuelto es de ${vuelto} pesos.`);
}

function closeSuccessModalAndFinish() {
    document.getElementById('checkoutSuccessModal').classList.add('hidden');
    clearBasket();
    APP_STATE.classroomMode = 'PREP';
    APP_STATE.listValidated = false;
    APP_STATE.classroomErrorsCount = 0;
    goHome();
}

// ==========================================
// VISUALIZADOR DE LA FICHA DE MISIÓN PARA EL PROFESOR
// ==========================================
function openViewMissionModal() {
    if (!APP_STATE.activeMission || !APP_STATE.activeMission.itemIds) {
        return alert("No hay una misión activa creada.");
    }

    const container = document.getElementById('viewMissionContent');
    const modal = document.getElementById('viewMissionModal');
    if (!container || !modal) return;

    const selectedProds = (APP_STATE.products || []).filter(p => APP_STATE.activeMission.itemIds.includes(String(p.id)));
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const teamLabel = st.teamName || 'Equipo Multidisciplinario';

    container.innerHTML = `
        <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-1">
            <h4 class="text-lg font-black text-indigo-950">${APP_STATE.activeMission.title}</h4>
            <p class="text-xs font-bold text-slate-600">Ficha creada por el ${teamLabel} (${selectedProds.length} productos asignados)</p>
        </div>

        <div class="space-y-3">
            <h5 class="text-xs font-black text-slate-500 uppercase">Productos incluidos en la lista impresa:</h5>
            ${selectedProds.map(p => {
                const imgUrl = p.photoUrl || p.photo || p.image || '';
                const imgHtml = imgUrl 
                    ? `<img src="${imgUrl}" class="w-14 h-14 object-cover rounded-xl border">`
                    : `<span class="text-3xl">📦</span>`;
                return `
                    <div class="flex items-center justify-between p-3 bg-slate-50 border-2 rounded-2xl">
                        <div class="flex items-center gap-3">
                            ${imgHtml}
                            <div>
                                <span class="text-sm font-black text-slate-800 block">${p.name}</span>
                                <span class="text-xs font-black text-emerald-700">Precio Ref: $${(p.price || 0).toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                        <div>${getPricePictogramsHtml(p.price || 0)}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeViewMissionModal() {
    const modal = document.getElementById('viewMissionModal');
    if (modal) modal.classList.add('hidden');
}

function printCurrentMissionSheetFromViewer() {
    if (!APP_STATE.activeMission || !APP_STATE.activeMission.itemIds) return;
    const selectedProds = (APP_STATE.products || []).filter(p => APP_STATE.activeMission.itemIds.includes(String(p.id)));
    const title = APP_STATE.activeMission.title || 'Misión de Compra';
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const teamLabel = st.teamName || 'Equipo Multidisciplinario';

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Ficha de Misión Adaptativa</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white p-8 font-sans text-slate-800">
                <div class="max-w-2xl mx-auto border-4 border-indigo-600 p-6 rounded-3xl space-y-6">
                    <div class="flex justify-between items-center border-b-2 pb-4">
                        <div>
                            <h1 class="text-2xl font-black text-indigo-950">${st.schoolName}</h1>
                            <p class="text-xs font-bold text-indigo-600">Ficha de Apoyo Pedagógico (${teamLabel})</p>
                        </div>
                        <span class="text-4xl">📋</span>
                    </div>

                    <div class="bg-indigo-50 p-4 rounded-2xl border text-center space-y-1">
                        <h2 class="text-xl font-black text-indigo-900">${title}</h2>
                        <p class="text-xs font-bold text-slate-600">Instrucción: Busca y añade estos productos en la aplicación. Luego comprueba si tu lista está correcta.</p>
                    </div>

                    <div class="space-y-4">
                        ${selectedProds.map(p => {
                            const imgUrl = p.photoUrl || p.photo || p.image || '';
                            const imgHtml = imgUrl 
                                ? `<img src="${imgUrl}" class="w-16 h-16 object-cover rounded-xl border">`
                                : `<span class="text-4xl">📦</span>`;
                            return `
                                <div class="flex items-center justify-between p-4 bg-slate-50 border-2 rounded-2xl">
                                    <div class="flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-lg border-2 border-slate-400 bg-white"></div>
                                        ${imgHtml}
                                        <div>
                                            <span class="text-base font-black text-slate-800 block">${p.name}</span>
                                            <span class="text-xs font-black text-emerald-700">Precio estimado: $${(p.price || 0).toLocaleString('es-CL')}</span>
                                        </div>
                                    </div>
                                    <div>${getPricePictogramsHtml(p.price || 0)}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="pt-6 border-t text-center text-xs font-bold text-slate-400">
                        Programa de Autonomía Funcional • ${teamLabel}
                    </div>
                </div>
                <script>setTimeout(() => { window.print(); window.close(); }, 750);</script>
            </body>
        </html>
    `);
    win.document.close();
}

// ==========================================
// PANEL DOCENTE Y ACTIVACIÓN/DESACTIVACIÓN DE MISIÓN
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderTeacherDashboard(document.getElementById('appContainer'));
}

function openMissionModal() {
    const listEl = document.getElementById('missionProductsSelectList');
    if (!listEl) return;

    listEl.innerHTML = (APP_STATE.products || []).map(p => `
        <label class="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50">
            <input type="checkbox" value="${p.id}" class="missionProdCheckbox w-4 h-4 text-indigo-600 rounded">
            <div>
                <span class="font-black text-slate-800 block text-xs">${p.name}</span>
                <span class="text-emerald-700 font-bold text-[11px]">$${(p.price || 0).toLocaleString('es-CL')}</span>
            </div>
        </label>
    `).join('');

    document.getElementById('missionModal').classList.remove('hidden');
}

function closeMissionModal() {
    document.getElementById('missionModal').classList.add('hidden');
}

function activateMissionForStudents() {
    const checked = Array.from(document.querySelectorAll('.missionProdCheckbox:checked')).map(cb => cb.value);
    if (checked.length === 0) return alert("Selecciona al menos un producto para la misión.");

    const title = document.getElementById('missionTitleInput').value.trim() || 'Misión de Compra';
    const missionObj = {
        id: 'mission-' + Date.now(),
        title: title,
        itemIds: checked,
        active: true
    };

    APP_STATE.activeMission = missionObj;
    APP_STATE.classroomErrorsCount = 0;
    APP_STATE.listValidated = false;
    APP_STATE.invalidBasketItems = [];

    if (db) {
        db.collection('settings').doc('activeMission').set(missionObj);
    }

    closeMissionModal();
    alert(`✅ Misión "${title}" ACTIVADA por el docente.`);
    renderApp();
}

function cancelActiveMission() {
    if (confirm("¿Deseas DESACTIVAR la misión activa en sala para todos los alumnos?")) {
        APP_STATE.activeMission = null;
        APP_STATE.classroomMode = 'PREP';
        APP_STATE.listValidated = false;
        APP_STATE.classroomErrorsCount = 0;
        APP_STATE.invalidBasketItems = [];
        if (db) {
            db.collection('settings').doc('activeMission').delete();
        }
        alert("⏹️ Misión desactivada por el educador.");
        renderApp();
    }
}

function printCurrentMissionSheet() {
    const checked = Array.from(document.querySelectorAll('.missionProdCheckbox:checked')).map(cb => cb.value);
    if (checked.length === 0) return alert("Selecciona al menos un producto para imprimir.");

    const selectedProds = (APP_STATE.products || []).filter(p => checked.includes(String(p.id)));
    const title = document.getElementById('missionTitleInput').value.trim() || 'Misión de Compra';
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const teamLabel = st.teamName || 'Equipo Multidisciplinario';

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Ficha de Misión Adaptativa</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white p-8 font-sans text-slate-800">
                <div class="max-w-2xl mx-auto border-4 border-indigo-600 p-6 rounded-3xl space-y-6">
                    <div class="flex justify-between items-center border-b-2 pb-4">
                        <div>
                            <h1 class="text-2xl font-black text-indigo-950">${st.schoolName}</h1>
                            <p class="text-xs font-bold text-indigo-600">Ficha de Apoyo Pedagógico (${teamLabel})</p>
                        </div>
                        <span class="text-4xl">📋</span>
                    </div>

                    <div class="bg-indigo-50 p-4 rounded-2xl border text-center space-y-1">
                        <h2 class="text-xl font-black text-indigo-900">${title}</h2>
                        <p class="text-xs font-bold text-slate-600">Instrucción: Busca y añade estos productos en la aplicación. Luego presiona comprobar si tu lista está correcta.</p>
                    </div>

                    <div class="space-y-4">
                        ${selectedProds.map(p => {
                            const imgUrl = p.photoUrl || p.photo || p.image || '';
                            const imgHtml = imgUrl 
                                ? `<img src="${imgUrl}" class="w-16 h-16 object-cover rounded-xl border">`
                                : `<span class="text-4xl">📦</span>`;
                            return `
                                <div class="flex items-center justify-between p-4 bg-slate-50 border-2 rounded-2xl">
                                    <div class="flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-lg border-2 border-slate-400 bg-white"></div>
                                        ${imgHtml}
                                        <div>
                                            <span class="text-base font-black text-slate-800 block">${p.name}</span>
                                            <span class="text-xs font-black text-emerald-700">Precio estimado: $${(p.price || 0).toLocaleString('es-CL')}</span>
                                        </div>
                                    </div>
                                    <div>${getPricePictogramsHtml(p.price || 0)}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="pt-6 border-t text-center text-xs font-bold text-slate-400">
                        Programa de Autonomía Funcional • ${teamLabel}
                    </div>
                </div>
                <script>setTimeout(() => { window.print(); window.close(); }, 750);</script>
            </body>
        </html>
    `);
    win.document.close();
}

function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

    let activeMissionAlertBanner = '';
    if (APP_STATE.activeMission && APP_STATE.activeMission.active && APP_STATE.activeMission.itemIds) {
        activeMissionAlertBanner = `
            <div class="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg border-4 border-emerald-808 flex justify-between items-center flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🔴</span>
                    <div>
                        <h4 class="font-black text-sm uppercase">MISIÓN EN CURSO ACTIVADA POR EL EDUCADOR: "${APP_STATE.activeMission.title}"</h4>
                        <p class="text-[11px] font-bold text-emerald-100">${APP_STATE.activeMission.itemIds.length} productos asignados a las tablets de los alumnos.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="openViewMissionModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow border border-indigo-300 active:scale-95 flex items-center gap-1.5">
                        <span>👁️</span> <span>Ver Lista de Misión</span>
                    </button>
                    <button onclick="cancelActiveMission()" class="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow border border-rose-300 active:scale-95 flex items-center gap-1.5">
                        <span>⏹️</span> <span>Desactivar Misión</span>
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="space-y-6">
            ${activeMissionAlertBanner}

            <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 border-b-4 border-indigo-600">
                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                            <span>🏫</span>
                            <span>${isAdmin ? `Panel de Administración General & ${teamLabel}` : `Panel Docente (${teamLabel})`}</span>
                        </h2>
                        <p class="text-xs text-indigo-300 font-bold mt-0.5">Gestión pedagógica, catálogo, usuarios e informes con IA.</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="openMissionModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow border-b-2 border-indigo-900 flex items-center gap-2 active:scale-95">
                            <span>📋</span><span>Crear / Activar Misión</span>
                        </button>
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
                        <span>⚙️</span><span>5. Equipo & Temas</span>
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
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Alumnos Registrados</span>
                        <span class="text-2xl font-black text-amber-900">${(APP_STATE.users || []).filter(u => u.role === 'student').length}</span>
                    </div>
                    <div class="bg-amber-100 text-amber-600 p-3 rounded-2xl text-xl">🎒</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-sky-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Lecturas por Voz</span>
                        <span class="text-2xl font-black text-sky-800">${totalVoiceHelp}</span>
                    </div>
                    <div class="bg-sky-100 text-sky-600 p-3 rounded-2xl text-xl">🔊</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md space-y-4">
                <div class="border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <span>✨</span> <span>Histórico de Evaluaciones e Informes Psicopedagógicos</span>
                    </h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-black">
                                <th class="py-2.5 px-3">Fecha</th>
                                <th class="py-2.5 px-3">Estudiante</th>
                                <th class="py-2.5 px-3">Tienda</th>
                                <th class="py-2.5 px-3">Total / Pago</th>
                                <th class="py-2.5 px-3 text-center">Intentos / Errores</th>
                                <th class="py-2.5 px-3 text-center">Logro</th>
                                <th class="py-2.5 px-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-bold">
                            ${totalEvals === 0 ? `
                                <tr>
                                    <td colspan="7" class="py-8 text-center text-slate-400 italic">No hay evaluaciones registradas. Realiza una compra para generar informes.</td>
                                </tr>
                            ` : (APP_STATE.evaluations || []).map(e => `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-3 text-slate-500">${e.date || 'Reciente'}</td>
                                    <td class="py-3 px-3 font-black text-indigo-950">${e.studentName || 'Estudiante'}</td>
                                    <td class="py-3 px-3">${e.supermarketName || 'Supermercado'}</td>
                                    <td class="py-3 px-3">
                                        <div class="font-black text-emerald-700">$${(e.totalCLP || 0).toLocaleString('es-CL')}</div>
                                    </td>
                                    <td class="py-3 px-3 text-center text-rose-600 font-black">${e.classroomErrorsCount || 0} error(es)</td>
                                    <td class="py-3 px-3 text-center font-black text-amber-600">⭐ ${e.pointsEarned || 100}%</td>
                                    <td class="py-3 px-3 text-center">
                                        <button onclick="generateAIPedagogicalReport('${e.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow-sm">
                                            ✨ Generar Informe IA
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

function generateAIPedagogicalReport(evalId) {
    const ev = (APP_STATE.evaluations || []).find(x => String(x.id) === String(evalId));
    if (!ev) return alert("Evaluación no encontrada.");

    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const teamLabel = st.teamName || 'Equipo Multidisciplinario';
    const paid = ev.paidCLP || 0;
    const total = ev.totalCLP || 0;
    const change = ev.changeCLP || 0;
    const classroomErrors = ev.classroomErrorsCount || 0;
    const priceAdjustments = ev.priceAdjustmentsCount || 0;

    let nivelAutonomia = "Alto / Independiente (100% de logro)";
    if (classroomErrors === 1) nivelAutonomia = "Adecuado / Con 1 Apoyo Puntual (80% de logro)";
    if (classroomErrors === 2) nivelAutonomia = "En Proceso de Autonomía (60% de logro)";
    if (classroomErrors >= 3) nivelAutonomia = "Requiere Acompañamiento Intensivo (40% de logro)";

    const reportHtml = `
        <div id="printableReport" class="bg-white p-8 max-w-4xl mx-auto border border-slate-300 shadow-2xl rounded-2xl font-sans text-slate-800 space-y-6">
            <div class="flex justify-between items-center border-b-4 border-indigo-600 pb-4">
                <div>
                    <h1 class="text-xl font-black text-indigo-950 uppercase">${st.schoolName}</h1>
                    <p class="text-xs font-bold text-indigo-700">${st.schoolSubHeader} • ${teamLabel}</p>
                </div>
                ${st.schoolLogo ? `<img src="${st.schoolLogo}" class="h-16 object-contain">` : `<span class="text-3xl">🏫</span>`}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border text-xs font-bold">
                <div><span class="text-slate-400 block text-[10px] uppercase">Estudiante:</span> ${ev.studentName}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">RUT:</span> ${ev.rut || 'N/A'}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">Fecha:</span> ${ev.date || 'Reciente'}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">Tienda:</span> ${ev.supermarketName}</div>
            </div>

            <div class="grid grid-cols-4 gap-3 text-center">
                <div class="p-3 bg-emerald-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-emerald-800">Total Compra</span><div class="text-base font-black text-emerald-700">$${total.toLocaleString('es-CL')}</div></div>
                <div class="p-3 bg-indigo-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-indigo-800">Pagó</span><div class="text-base font-black text-indigo-900">$${paid.toLocaleString('es-CL')}</div></div>
                <div class="p-3 bg-amber-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-amber-900">Vuelto</span><div class="text-base font-black text-amber-800">$${change.toLocaleString('es-CL')}</div></div>
                <div class="p-3 bg-sky-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-sky-900">Porcentaje Logro</span><div class="text-base font-black text-amber-600">⭐ ${ev.pointsEarned || 100}%</div></div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs font-bold">
                <div class="p-3 bg-slate-50 rounded-xl border">
                    <span class="text-slate-500 block text-[10px] uppercase">Intentos Fallidos / Errores en Lista:</span>
                    <span class="text-base font-black ${classroomErrors > 0 ? 'text-rose-600' : 'text-emerald-600'}">${classroomErrors} error(es) detectado(s)</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border">
                    <span class="text-slate-500 block text-[10px] uppercase">Diferencia de Precios en Góndola:</span>
                    <span class="text-base font-black text-indigo-900">${priceAdjustments} cambio(s) de precio corregidos</span>
                </div>
            </div>

            <div class="p-4 bg-indigo-50 border rounded-2xl text-xs space-y-2">
                <div class="font-black text-indigo-950">Diagnóstico de Autonomía Funcional: ${nivelAutonomia}</div>
                <p class="text-slate-700">El estudiante seleccionó su supermercado de preferencia, organizó su canasto según la lista impresa, realizó la comprobación interactiva de la lista y reconoció el pago con moneda nacional.</p>
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
            user_pin: 'Informe Pedagógico Disponible',
            app_url: window.location.href
        }, EMAILJS_CONFIG.publicKey).then(() => alert("📧 Informe enviado con éxito.")).catch(e => alert("Error: " + e.message));
    }
}

// ==========================================
// CATÁLOGO DOCENTE
// ==========================================
function renderTeacherCatalogTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-3xl border-4 border-emerald-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>🏪</span> <span>Supermercados (${(APP_STATE.supermarkets || []).length})</span>
                    </h3>
                    <button onclick="openSupermarketModal()" class="bg-emerald-600 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Tienda</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.supermarkets || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay supermercados creados.</p>
                    ` : (APP_STATE.supermarkets || []).map(s => {
                        const logo = s.photoUrl || s.photo || s.logoUrl || '';
                        const imgHtml = logo 
                            ? `<img src="${logo}" class="w-8 h-8 object-contain rounded-lg border bg-white p-0.5">`
                            : `<span class="text-base">${s.icon || '🏪'}</span>`;
                        return `
                            <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold">
                                <div class="flex items-center gap-2">
                                    ${imgHtml}
                                    <span class="font-black text-slate-800">${s.name}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <button onclick="openSupermarketModal('${s.id}')" class="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-[10px]">✏️ Editar</button>
                                    <button onclick="deleteSupermarket('${s.id}')" class="bg-rose-100 text-rose-900 px-2 py-1 rounded-xl text-[10px]">✕</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
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
                    ${(APP_STATE.categories || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay categorías creadas.</p>
                    ` : (APP_STATE.categories || []).map(c => `
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
                        <span>📦</span> <span>Productos (${(APP_STATE.products || []).length})</span>
                    </h3>
                    <button onclick="openProductModal()" class="bg-amber-500 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Producto</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.products || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay productos en el catálogo.</p>
                    ` : (APP_STATE.products || []).map(p => {
                        const isAll = p.isAll === true || p.supermarketId === 'ALL' || p.supermarketName === 'TODOS';
                        let supBadge = isAll 
                            ? `<span class="inline-block bg-sky-100 text-sky-900 text-[10px] font-black px-2 py-0.5 rounded-md my-0.5">🌐 Todos los supermercados</span>`
                            : `<span class="inline-block bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md my-0.5">🏪 Solo en: ${(APP_STATE.supermarkets || []).find(s => String(s.id) === String(p.supermarketId))?.name || 'Supermercado'}</span>`;

                        const imgUrl = p.photoUrl || p.photo || p.image || '';
                        const photoThumb = imgUrl 
                            ? `<img src="${imgUrl}" class="w-10 h-10 object-cover rounded-xl border border-slate-300">`
                            : `<div class="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-lg">📦</div>`;

                        return `
                            <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold gap-2">
                                <div class="flex items-center gap-2">
                                    ${photoThumb}
                                    <div>
                                        <span class="font-black text-slate-800 block">${p.name}</span>
                                        <span class="bg-indigo-100 text-indigo-900 text-[9px] font-black px-1.5 py-0.5 rounded">ID: ${p.code || p.id}</span>
                                        <span class="text-emerald-700 font-black inline-block ml-1">$${(p.price || 0).toLocaleString('es-CL')}</span>
                                        <div>${supBadge}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <button onclick="openProductModal('${p.id}')" class="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-[10px]">✏️ Editar</button>
                                    <button onclick="deleteProduct('${p.id}')" class="bg-rose-100 text-rose-900 px-2 py-1 rounded-xl text-[10px]">✕</button>
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
                    <span>💵</span> <span>Billetes y Monedas Chilenas (CLP)</span>
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
                                    📁 Cambiar Imagen
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
            alert("✅ Imagen cargada exitosamente.");
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

function renderTeacherUsersTab() {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

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
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">👨‍🏫 Educadores (${teamLabel})</h3>
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
                ${role === 'student' ? `<div class="text-amber-700 font-black mt-1">⭐ Puntos: ${u.points || 0} pts</div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderTeacherSettingsTab() {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const currentTeamName = st.teamName || 'Equipo Multidisciplinario';

    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-4xl mx-auto">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>⚙️</span> <span>Configuración de Equipo, Plantilla y Temáticas</span>
                </h3>
            </div>

            <div class="p-5 bg-indigo-50 border-4 border-indigo-300 rounded-3xl space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">👥</span>
                    <div>
                        <h4 class="font-black text-slate-800 text-sm uppercase">Nombre del Equipo Profesional</h4>
                        <p class="text-xs text-slate-600 font-bold">Selecciona una sugerencia o escribe el nombre exacto:</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <select onchange="selectPresetTeamName(this.value)" class="w-full px-3 py-2.5 rounded-xl border-2 border-indigo-300 font-black text-xs bg-white text-indigo-950">
                            <option value="">-- Seleccionar Opciones --</option>
                            ${TEAM_NAME_PRESETS.map(preset => `
                                <option value="${preset}" ${currentTeamName === preset ? 'selected' : ''}>${preset}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <input type="text" id="settingTeamName" value="${currentTeamName}" placeholder="Ej: Equipo Multidisciplinario" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Nombre Colegio / Escuela:</label>
                        <input type="text" id="settingSchoolName" value="${st.schoolName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Subtítulo / Unidad:</label>
                        <input type="text" id="settingSubHeader" value="${st.schoolSubHeader || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Firma / Encargado:</label>
                        <input type="text" id="settingDirectorName" value="${st.directorName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">🎨 Temática Estacional:</label>
                        <select id="settingActiveTheme" class="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-300 font-black text-xs bg-indigo-50 text-indigo-900">
                            ${Object.keys(SEASONAL_THEMES).map(key => `
                                <option value="${key}" ${st.activeTheme === key ? 'selected' : ''}>${SEASONAL_THEMES[key].name}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Logo Institucional:</label>
                        <input type="file" accept="image/*" onchange="handleSchoolLogoUpload(event)" class="w-full text-xs font-bold text-slate-600 border p-2 rounded-xl">
                        <input type="hidden" id="settingSchoolLogo" value="${st.schoolLogo || ''}">
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">🐶 Mascota de la Escuela:</label>
                        <input type="file" accept="image/*" onchange="handleSchoolMascotUpload(event)" class="w-full text-xs font-bold text-slate-600 border p-2 rounded-xl">
                        <input type="hidden" id="settingMascotUrl" value="${st.mascotUrl || ''}">
                    </div>

                    <button onclick="saveInstitutionalSettings()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-xs uppercase shadow-lg border-b-4 border-emerald-900 active:scale-95">
                        💾 Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    `;
}

function selectPresetTeamName(val) {
    if (val) {
        const input = document.getElementById('settingTeamName');
        if (input) input.value = val;
    }
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

function handleSchoolMascotUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 300, 300).then(compressed => {
            document.getElementById('settingMascotUrl').value = compressed;
        });
    };
    reader.readAsDataURL(file);
}

function saveInstitutionalSettings() {
    const teamNameVal = document.getElementById('settingTeamName').value.trim() || 'Equipo Multidisciplinario';
    
    const settingsData = {
        schoolName: document.getElementById('settingSchoolName').value.trim(),
        schoolSubHeader: document.getElementById('settingSubHeader').value.trim(),
        teamName: teamNameVal,
        directorName: document.getElementById('settingDirectorName').value.trim(),
        activeTheme: document.getElementById('settingActiveTheme').value,
        schoolLogo: document.getElementById('settingSchoolLogo').value,
        mascotUrl: document.getElementById('settingMascotUrl').value
    };

    if (db) {
        db.collection('settings').doc('institutional').set(settingsData, { merge: true }).then(() => {
            APP_STATE.settings = { ...APP_STATE.settings, ...settingsData };
            renderApp();
            alert(`✅ Configuración guardada exitosamente.`);
        });
    }
}

// ==========================================
// GESTIÓN DE SUPERMERCADOS, PRODUCTOS Y USUARIOS
// ==========================================
function handleSupermarketLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 300, 300).then(compressed => {
            document.getElementById('modalSupLogo').value = compressed;
        });
    };
    reader.readAsDataURL(file);
}

function openSupermarketModal(supId = null) {
    const el = document.getElementById('supermarketModal');
    if (!el) return;

    if (supId) {
        const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId));
        if (sup) {
            document.getElementById('modalSupId').value = sup.id;
            document.getElementById('modalSupName').value = sup.name || '';
            document.getElementById('modalSupLogo').value = sup.photoUrl || sup.photo || sup.logoUrl || '';
        }
    } else {
        document.getElementById('modalSupId').value = '';
        document.getElementById('modalSupName').value = '';
        document.getElementById('modalSupLogo').value = '';
    }

    el.classList.remove('hidden');
}

function closeSupermarketModal() {
    document.getElementById('supermarketModal').classList.add('hidden');
}

function saveSupermarketFromModal() {
    const idInput = document.getElementById('modalSupId')?.value;
    const name = document.getElementById('modalSupName').value.trim();
    const photoUrl = document.getElementById('modalSupLogo').value;

    if (!name) return alert("Ingresa el nombre del supermercado.");
    if (!db) return alert("Error de conexión a Firebase.");

    const id = idInput ? idInput : ('sup-' + Date.now());

    db.collection('supermarkets').doc(id).set({
        id: id,
        name: name,
        photoUrl: photoUrl || '',
        icon: '🏪',
        description: 'Supermercado'
    }, { merge: true }).then(() => {
        closeSupermarketModal();
        alert(`✅ Supermercado "${name}" guardado.`);
    });
}

function deleteSupermarket(supId) {
    if (confirm("¿Eliminar este supermercado?") && db) {
        db.collection('supermarkets').doc(supId).delete();
    }
}

function getNextProductCode() {
    const products = APP_STATE.products || [];
    if (products.length === 0) return '1001';
    let maxCode = 1000;
    products.forEach(p => {
        if (p.code) {
            const num = parseInt(String(p.code).replace(/\D/g, ''), 10);
            if (!isNaN(num) && num >= maxCode && num < 999999) maxCode = num;
        }
    });
    return String(maxCode + 1);
}

function updateCategoryDropdowns(selectedName = null) {
    const catSelect = document.getElementById('modalProdCategory');
    if (!catSelect) return;
    const list = APP_STATE.categories || [];
    catSelect.innerHTML = list.map(c => `<option value="${c.name}" ${selectedName === c.name ? 'selected' : ''}>${c.icon || '🏷️'} ${c.name}</option>`).join('');
}

function handleProductPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 300, 300, 0.7).then(compressed => {
            document.getElementById('modalProdPhoto').value = compressed;
        });
    };
    reader.readAsDataURL(file);
}

function openProductModal(prodId = null) {
    const supSelect = document.getElementById('modalProdSupermarket');
    if (supSelect) {
        supSelect.innerHTML = (APP_STATE.supermarkets || []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }

    if (prodId) {
        const p = (APP_STATE.products || []).find(x => String(x.id) === String(prodId));
        if (p) {
            document.getElementById('modalProdId').value = p.id;
            document.getElementById('modalProdName').value = p.name || '';
            document.getElementById('modalProdCode').value = p.code || p.id || '';
            document.getElementById('modalProdPrice').value = p.price || 0;
            document.getElementById('modalProdPhoto').value = p.photoUrl || p.photo || p.image || '';
            document.getElementById('modalProdReplicateAll').checked = !!p.isAll;
            if (supSelect && p.supermarketId) supSelect.value = p.supermarketId;
            updateCategoryDropdowns(p.category);
        }
    } else {
        document.getElementById('modalProdId').value = '';
        document.getElementById('modalProdName').value = '';
        document.getElementById('modalProdCode').value = getNextProductCode();
        document.getElementById('modalProdPrice').value = '';
        document.getElementById('modalProdPhoto').value = '';
        document.getElementById('modalProdReplicateAll').checked = false;
        updateCategoryDropdowns();
    }

    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

function saveProductFromModal() {
    const prodId = document.getElementById('modalProdId')?.value;
    const supSelect = document.getElementById('modalProdSupermarket');
    const supId = supSelect ? supSelect.value : null;

    const name = document.getElementById('modalProdName').value.trim();
    const code = document.getElementById('modalProdCode').value.trim();
    const categorySelect = document.getElementById('modalProdCategory');
    const category = categorySelect ? categorySelect.value : 'General';
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;
    const photoUrl = document.getElementById('modalProdPhoto')?.value || '';

    if (!name || isNaN(price)) return alert("Por favor ingresa un nombre y precio válidos.");
    if (!db) return alert("Error de conexión.");

    const id = prodId ? prodId : ('prod-' + Date.now());

    db.collection('products').doc(id).set({
        id: id,
        code: code || getNextProductCode(),
        name: name,
        category: category,
        price: price,
        photoUrl: photoUrl,
        photo: photoUrl,
        isAll: replicateAll,
        supermarketId: replicateAll ? 'ALL' : supId,
        supermarketName: replicateAll ? 'TODOS' : ((APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId))?.name || 'Supermercado')
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

function openCategoryModal() {
    const el = document.getElementById('categoryModal');
    const iconSelect = document.getElementById('modalCatIcon');
    if (iconSelect) {
        iconSelect.innerHTML = PRESET_CATEGORIES.map(c => 
            `<option value="${c.icon}">${c.icon} ${c.name}</option>`
        ).join('');
    }
    if (el) el.classList.remove('hidden');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.add('hidden');
}

function saveCategoryFromModal() {
    const name = document.getElementById('modalCatName').value.trim();
    const icon = document.getElementById('modalCatIcon').value;
    if (!name || !db) return alert("Ingresa el nombre de la categoría.");
    const id = 'cat-' + Date.now();
    db.collection('categories').doc(id).set({ id, name, icon: icon || '🏷️' }).then(() => {
        closeCategoryModal();
        updateCategoryDropdowns(name);
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
        el.classList.remove('hidden');
    }
}

function closeUserModal() {
    document.getElementById('userModal').classList.add('hidden');
}

function saveUserFromModal() {
    const userId = document.getElementById('modalUserId').value;
    const role = document.getElementById('modalUserRole').value;
    const name = document.getElementById('modalName').value.trim();
    const rut = document.getElementById('modalRut').value.trim();
    const email = document.getElementById('modalEmail').value.trim();

    if (!name || !rut || !db) return alert("Completa nombre y RUT.");

    const id = userId || ('u-' + Date.now());
    const pin = rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';

    db.collection('users').doc(id).set({ id, role, name, rut, username: rut, email, pin, points: 0 }, { merge: true }).then(() => {
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
// ESCUCHADORES FIRESTORE (TIEMPO REAL)
// ==========================================
function initFirebaseListeners() {
    try {
        const storedUser = localStorage.getItem('nee_active_user');
        if (storedUser) APP_STATE.currentUser = JSON.parse(storedUser);
        const storedCurrencies = localStorage.getItem('nee_custom_currencies');
        if (storedCurrencies) APP_STATE.customCurrencies = JSON.parse(storedCurrencies);
    } catch(e) {}

    if (!db) {
        renderApp();
        return;
    }

    const listenCol = (name, callback) => {
        try {
            db.collection(name).onSnapshot(
                s => {
                    const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
                    callback(data);
                    renderApp();
                },
                () => renderApp()
            );
        } catch(e) { renderApp(); }
    };

    listenCol('users', data => { APP_STATE.users = data || []; });
    listenCol('courses', data => { APP_STATE.courses = data || []; });
    listenCol('categories', data => {
        APP_STATE.categories = data || [];
        updateCategoryDropdowns();
    });
    listenCol('supermarkets', data => { APP_STATE.supermarkets = data || []; });
    listenCol('products', data => { APP_STATE.products = data || []; });
    listenCol('evaluations', data => { APP_STATE.evaluations = data || []; });

    try {
        db.collection('settings').doc('activeMission').onSnapshot(
            doc => {
                if (doc.exists && doc.data() && doc.data().active) {
                    APP_STATE.activeMission = doc.data();
                } else {
                    APP_STATE.activeMission = null;
                }
                renderApp();
            },
            () => renderApp()
        );

        db.collection('settings').doc('institutional').onSnapshot(
            doc => {
                if (doc.exists) APP_STATE.settings = { ...DEFAULT_SETTINGS, ...doc.data() };
                renderApp();
            },
            () => renderApp()
        );

        db.collection('settings').doc('currencies').onSnapshot(
            doc => {
                if (doc.exists) APP_STATE.customCurrencies = { ...APP_STATE.customCurrencies, ...doc.data() };
                renderApp();
            },
            () => renderApp()
        );
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

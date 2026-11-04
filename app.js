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
    try { firebase.initializeApp(firebaseConfig); } catch(e) { console.error("Firebase init error:", e); }
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
// 8 TEMÁTICAS ESTACIONALES CON AMBIENTACIÓN
// ==========================================
const SEASONAL_THEMES = {
    standard: {
        id: 'standard',
        name: 'Estándar / Institucional 🏫',
        bgColor: 'bg-slate-100',
        bannerBg: 'bg-indigo-600',
        headerBg: 'bg-indigo-600',
        bannerText: ' text-white ',
        titleMsg: '¡Bienvenido a Comprar! 🛍️',
        greetingMsg: 'Selecciona una tienda para comenzar tu misión.',
        emoji: '🛍️'
    },
    halloween: {
        id: 'halloween',
        name: 'Halloween & Noche de Brujas 🎃🕸️',
        bgColor: 'bg-slate-900',
        bannerBg: 'bg-gradient-to-r from-purple-900 via-orange-600 to-slate-900',
        headerBg: 'bg-purple-950 border-orange-500',
        bannerText: ' text-amber-300 ',
        titleMsg: '¡Especial de Halloween! 🎃👻',
        greetingMsg: '¡Busca dulces y pociones en el supermercado embrujado!',
        emoji: '🎃'
    },
    navidad: {
        id: 'navidad',
        name: 'Especial Navidad 🎄✨',
        bgColor: 'bg-red-50',
        bannerBg: 'bg-gradient-to-r from-red-600 via-emerald-600 to-red-700',
        headerBg: 'bg-red-700 border-emerald-500',
        bannerText: ' text-yellow-200 ',
        titleMsg: '¡Especial de Navidad en la Escuela! 🎄🎁',
        greetingMsg: '¡Encuentra los regalos y la cena navideña!',
        emoji: '🎅'
    },
    semana_santa: {
        id: 'semana_santa',
        name: 'Semana Santa / Conejito 🐰🥚',
        bgColor: 'bg-emerald-50',
        bannerBg: 'bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500',
        headerBg: 'bg-teal-700 border-purple-400',
        bannerText: ' text-white ',
        titleMsg: '¡Pascua de Resurrección! 🐰🥚',
        greetingMsg: '¡Encuentra los huevitos de chocolate en las góndolas!',
        emoji: '🐰'
    },
    fiestas_patrias: {
        id: 'fiestas_patrias',
        name: 'Fiestas Patrias Chile 🇨🇱🎈',
        bgColor: 'bg-blue-50',
        bannerBg: 'bg-gradient-to-r from-blue-700 via-white to-red-600',
        headerBg: 'bg-blue-800 border-red-600',
        bannerText: ' text-slate-900 font-black ',
        titleMsg: '¡Viva Chile! Fiestas Patrias 🇨🇱🎈',
        greetingMsg: '¡A comprar las empanadas y la carne para el asado!',
        emoji: '🥟'
    },
    mes_nino: {
        id: 'mes_nino',
        name: 'Mes del Niño & Juventud 🎈🧸',
        bgColor: 'bg-pink-50',
        bannerBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400',
        headerBg: 'bg-pink-600 border-purple-500',
        bannerText: ' text-white ',
        titleMsg: '¡Feliz Mes del Niño! 🎈🧸',
        greetingMsg: '¡Día de juegos, juguetes y sorpresas en el supermercado!',
        emoji: '🎈'
    },
    verano: {
        id: 'verano',
        name: 'Modo Verano & Vacaciones ☀️🏖️',
        bgColor: 'bg-amber-50',
        bannerBg: 'bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400',
        headerBg: 'bg-orange-500 border-amber-300',
        bannerText: ' text-slate-900 ',
        titleMsg: '¡Modo Verano Activo! ☀️🌊',
        greetingMsg: '¡Prepara tu canasto con helados, frutas y bebidas!',
        emoji: '🍦'
    },
    invierno: {
        id: 'invierno',
        name: 'Vacaciones de Invierno ❄️☕',
        bgColor: 'bg-sky-50',
        bannerBg: 'bg-gradient-to-r from-sky-600 via-indigo-700 to-blue-900',
        headerBg: 'bg-indigo-800 border-sky-400',
        bannerText: ' text-sky-100 ',
        titleMsg: '¡Vacaciones de Invierno! ❄️🏔️',
        greetingMsg: '¡Busca chocolates calientes y sopitas calientitas!',
        emoji: '❄️'
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
    corporeoUrl: "",
    activeTheme: "halloween",
    directorName: "Equipo Multidisciplinario",
    rewardPointsThreshold: 250,
    rewardMessage: "¡Excelente trabajo! Muestra esta pantalla a tu profesor para recibir tu premio físico."
};

const DEFAULT_AI_CONFIG = {
    mode: 'strict',
    sensitivity: 'medium',
    cameraFacing: 'environment'
};

const LEVEL_TITLES = [
    "Nivel 0: Explorador Inicial 🎒",
    "Nivel 1: Comprador Principiante 🛒",
    "Nivel 2: Experto en Góndolas 🏪",
    "Nivel 3: Máster de Supermercado 🏆"
];

// ==========================================
// MONEDAS Y BILLETES EN SVG (CLP CHILE)
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
    { name: "Mascotas", icon: "🐶" }
];

// ==========================================
// ESTADO GLOBAL
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
    users: [
        { id: 'u-docente', role: 'teacher', name: 'Profesor / Educador', rut: '12345678-9', pin: '1234', email: 'docente@escuela.cl' },
        { id: 'u-alumno', role: 'student', name: 'Estudiante Ejemplo', rut: '98765432-1', pin: '1234', points: 50, level: 1, xp: 50 }
    ],
    supermarkets: [
        { id: 'sup-1', name: 'Supermercado Central', icon: '🏪', photoUrl: '', description: 'Tienda Principal' }
    ],
    products: [
        { id: 'prod-1', name: 'Leche Entera 1L', category: 'Lácteos, Yogures y Huevos', price: 1050, isAll: true, iconEmoji: '🥛' },
        { id: 'prod-2', name: 'Pan Hallulla 1Kg', category: 'Panadería y Pastelería', price: 1990, isAll: true, iconEmoji: '🍞' },
        { id: 'prod-3', name: 'Manzana Fuji (1Kg)', category: 'Frutas y Verduras', price: 1200, isAll: true, iconEmoji: '🍎' }
    ],
    evaluations: [],
    customCurrencies: {},
    settings: { ...DEFAULT_SETTINGS },
    aiConfig: { ...DEFAULT_AI_CONFIG },
    telemetry: { voiceHelpCount: 0 },
    missionStartTime: null,
    
    cameraStream: null,
    adminTestStream: null,
    isAiAnalyzing: false,
    currentTargetScanProduct: null,
    
    activeMission: null,          
    classroomMode: 'PREP',        
    listValidated: false,         
    scannedItemsInStore: {},      
    classroomErrorsCount: 0,      
    priceAdjustmentsCount: 0,     
    pendingScanProduct: null,     
    invalidBasketItems: [],

    memorise: {
        cards: [],
        flippedCards: [],
        matchedPairsCount: 0,
        movesCount: 0,
        totalPairsNeeded: 3,
        isBusy: false
    }
};

let isPhotoProcessing = false;

// ==========================================
// RENDERIZADO DE PERSONAJES ANIMADOS Y AVATAR
// ==========================================
function getAvatarHtml(type = 'mascot', customSpeechText = '') {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const customImg = (type === 'mascot') ? st.mascotUrl : st.corporeoUrl;

    let avatarImgHtml = '';
    if (customImg) {
        avatarImgHtml = `<img src="${customImg}" class="w-16 h-16 sm:w-20 sm:h-20 object-contain animate-avatar-float drop-shadow-md">`;
    } else {
        if (type === 'mascot') {
            avatarImgHtml = `
                <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-indigo-500 to-amber-400 rounded-3xl p-2 border-4 border-white shadow-xl animate-avatar-float flex items-center justify-center">
                    <span class="text-3xl sm:text-4xl">🛒🤖</span>
                    <span class="absolute -top-1 -right-1 bg-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-full text-slate-900 border">Mascota</span>
                </div>
            `;
        } else {
            avatarImgHtml = `
                <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl p-2 border-4 border-white shadow-xl animate-avatar-float flex items-center justify-center">
                    <span class="text-3xl sm:text-4xl animate-wave">🐻</span>
                    <span class="absolute -top-1 -right-1 bg-purple-300 text-[9px] font-black px-1.5 py-0.5 rounded-full text-purple-950 border">Corpóreo</span>
                </div>
            `;
        }
    }

    if (!customSpeechText) return avatarImgHtml;

    return `
        <div class="flex items-center gap-3 my-2">
            ${avatarImgHtml}
            <div class="relative bg-white border-4 border-indigo-400 p-3 rounded-2xl shadow-lg text-xs font-black text-slate-800 max-w-sm">
                <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-indigo-400 border-b-8 border-b-transparent"></div>
                ${customSpeechText}
            </div>
        </div>
    `;
}

// ==========================================
// RENDERIZADO DE CAPAS Y ANIMACIONES ESTACIONALES
// ==========================================
function renderThemeOverlay() {
    const container = document.getElementById('themeOverlayContainer');
    if (!container) return;

    const activeKey = (APP_STATE.settings && APP_STATE.settings.activeTheme) || 'standard';

    if (activeKey === 'halloween') {
        container.innerHTML = `
            <!-- Bruja Voladora cruzando el cielo de la app -->
            <div class="absolute top-8 left-0 animate-witch z-50 text-5xl sm:text-6xl drop-shadow-xl pointer-events-none">
                🧙‍♀️🧹
            </div>

            <!-- Arañas Caminando bajando por hilos de seda -->
            <div class="absolute top-0 left-8 animate-spider-crawl text-3xl sm:text-4xl">
                <div class="w-0.5 h-32 bg-slate-600/40 mx-auto"></div>
                <div class="-mt-1">🕷️</div>
            </div>
            <div class="absolute top-0 right-16 animate-spider-crawl-fast text-4xl sm:text-5xl">
                <div class="w-0.5 h-44 bg-slate-600/40 mx-auto"></div>
                <div class="-mt-1">🕷️</div>
            </div>

            <!-- Zombie Caminante en la esquina inferior izquierda -->
            <div class="absolute bottom-3 left-4 animate-zombie z-40 flex items-center gap-2">
                <div class="text-6xl sm:text-7xl">🧟‍♂️</div>
                <div class="bg-purple-900 text-amber-300 border-2 border-purple-400 text-[10px] font-black px-2 py-1 rounded-xl shadow-lg">
                    ¡Cuidado en la góndola! 🎃
                </div>
            </div>

            <!-- Olla y Caldero de Pociones Hirviendo -->
            <div class="absolute bottom-2 right-4 z-40 flex flex-col items-center">
                <div class="flex gap-2 mb-[-12px] relative z-10">
                    <span class="text-base font-bold bubble-1">🟢</span>
                    <span class="text-xs font-bold bubble-2">🟣</span>
                    <span class="text-sm font-bold bubble-3">✨</span>
                </div>
                <div class="text-6xl sm:text-7xl animate-cauldron">🫕</div>
            </div>

            <!-- Murciélagos y Fantasmas -->
            <div class="absolute top-1/4 right-8 text-3xl animate-bounce">🦇</div>
            <div class="absolute top-1/2 left-6 text-3xl animate-pulse">👻</div>
        `;
    } else if (activeKey === 'navidad' || activeKey === 'invierno') {
        const snowCount = 15;
        let snowHtml = '';
        for (let i = 0; i < snowCount; i++) {
            const leftPos = Math.floor(Math.random() * 95);
            const duration = (3.5 + Math.random() * 4).toFixed(1);
            const delay = (Math.random() * 5).toFixed(1);
            const size = (14 + Math.random() * 18).toFixed(0);
            snowHtml += `<span class="animate-snowflake" style="left: ${leftPos}vw; animation-duration: ${duration}s; animation-delay: ${delay}s; font-size: ${size}px;">❄️</span>`;
        }

        const iconCorner = activeKey === 'navidad' ? '🎅' : '☕';
        const iconOther = activeKey === 'navidad' ? '🎄' : '❄️';

        container.innerHTML = `
            ${snowHtml}
            <div class="absolute top-2 left-2 text-4xl sm:text-5xl animate-bounce">${iconOther}</div>
            <div class="absolute bottom-3 right-3 text-5xl sm:text-6xl">${iconCorner}</div>
        `;
    } else if (activeKey === 'semana_santa') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-4xl animate-bounce">🐰</div>
            <div class="absolute bottom-2 right-2 text-4xl sm:text-5xl flex gap-1">
                <span>🥚</span><span>🍫</span>
            </div>
        `;
    } else if (activeKey === 'fiestas_patrias') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-5xl animate-spider-crawl">🪁</div>
            <div class="absolute bottom-2 right-2 text-5xl">🇨🇱</div>
        `;
    } else if (activeKey === 'mes_nino') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-5xl animate-bounce">🎈</div>
            <div class="absolute bottom-2 right-2 text-5xl">🧸</div>
        `;
    } else if (activeKey === 'verano') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-6xl animate-spin" style="animation-duration: 15s;">☀️</div>
            <div class="absolute bottom-2 right-2 text-5xl">🍦</div>
        `;
    } else {
        container.innerHTML = '';
    }
}

// ==========================================
// AUDIO Y SINTESIS DE VOZ
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

function compressImageBase64(base64Data, maxWidth = 250, maxHeight = 250, quality = 0.6) {
    return new Promise((resolve, reject) => {
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
        img.onerror = (err) => reject(err);
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
// SISTEMA DE PUNTOS Y RECOMPENSAS
// ==========================================
function awardPointsAndXp(pointsToAdd, sourceLabel = "Actividad") {
    if (!APP_STATE.currentUser || APP_STATE.currentUser.role !== 'student') return;

    const user = APP_STATE.currentUser;
    user.points = (user.points || 0) + pointsToAdd;
    user.xp = (user.xp || 0) + pointsToAdd;

    const oldLevel = user.level || 0;
    const newLevel = Math.floor(user.xp / 100);

    if (newLevel > oldLevel) {
        user.level = newLevel;
        user.points += 10;
        if (typeof confetti !== 'undefined') confetti({ particleCount: 100, spread: 70 });
        speakText(`¡Felicitaciones! Avanzaste al Nivel ${newLevel}. Ganaste 10 puntos extra.`);
        alert(`🎉 ¡SUBISTE DE NIVEL!\n\nAhora eres: ${LEVEL_TITLES[Math.min(newLevel, LEVEL_TITLES.length - 1)]}\n\n🎁 Premio por subir de nivel: +10 PUNTOS EXTRA`);
    } else {
        speakText(`¡Ganaste ${pointsToAdd} puntos en ${sourceLabel}!`);
    }

    localStorage.setItem('nee_active_user', JSON.stringify(user));
    if (db && user.id) {
        db.collection('users').doc(user.id).set({
            points: user.points,
            xp: user.xp,
            level: user.level || 0
        }, { merge: true });
    }

    const targetThreshold = (APP_STATE.settings && APP_STATE.settings.rewardPointsThreshold) || 250;
    if (user.points >= targetThreshold) {
        triggerPhysicalRewardModal(targetThreshold);
    }

    renderApp();
}

function triggerPhysicalRewardModal(threshold) {
    playChimeSound(false);
    if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 90 });

    const msg = (APP_STATE.settings && APP_STATE.settings.rewardMessage) 
        ? APP_STATE.settings.rewardMessage 
        : "¡Excelente trabajo! Muestra esta pantalla a tu profesor para recibir tu premio físico.";

    document.getElementById('rewardScoreDisplay').textContent = `${APP_STATE.currentUser.points} / ${threshold} PTS`;
    document.getElementById('rewardMessageDisplay').textContent = msg;

    speakText(`¡Sensacional! Alcanzaste la meta de ${threshold} puntos. Muestra la pantalla a tu profesor para recibir tu premio.`);
    document.getElementById('physicalRewardModal').classList.remove('hidden');
}

function confirmPhysicalRewardClaim() {
    document.getElementById('physicalRewardModal').classList.add('hidden');
    renderApp();
}

// ==========================================
// MINIJUEGO MEMORICE CON AVATAR
// ==========================================
function openMemoriseModal() {
    startMemoriseGame();
    document.getElementById('memoriseGameModal').classList.remove('hidden');
}

function closeMemoriseModal() {
    document.getElementById('memoriseGameModal').classList.add('hidden');
}

function startMemoriseGame() {
    const userLevel = (APP_STATE.currentUser && APP_STATE.currentUser.level) || 0;
    let totalPairsNeeded = 3;
    if (userLevel === 1) totalPairsNeeded = 4;
    if (userLevel >= 2) totalPairsNeeded = 6;

    let availableProducts = [...(APP_STATE.products || [])];
    if (availableProducts.length < totalPairsNeeded) {
        const fallbacks = [
            { id: 'fb1', name: 'Leche', photoUrl: '', iconEmoji: '🥛' },
            { id: 'fb2', name: 'Pan', photoUrl: '', iconEmoji: '🍞' },
            { id: 'fb3', name: 'Manzana', photoUrl: '', iconEmoji: '🍎' },
            { id: 'fb4', name: 'Jugo', photoUrl: '', iconEmoji: '🧃' },
            { id: 'fb5', name: 'Queso', photoUrl: '', iconEmoji: '🧀' },
            { id: 'fb6', name: 'Galletas', photoUrl: '', iconEmoji: '🍿' }
        ];
        availableProducts = availableProducts.concat(fallbacks);
    }

    const selectedProds = availableProducts.sort(() => 0.5 - Math.random()).slice(0, totalPairsNeeded);

    let deck = [];
    selectedProds.forEach((prod, index) => {
        deck.push({ cardId: `card-${index}-a`, productId: prod.id, name: prod.name, photoUrl: prod.photoUrl || prod.photo || prod.image || '', iconEmoji: prod.iconEmoji || '📦', isFlipped: false, isMatched: false });
        deck.push({ cardId: `card-${index}-b`, productId: prod.id, name: prod.name, photoUrl: prod.photoUrl || prod.photo || prod.image || '', iconEmoji: prod.iconEmoji || '📦', isFlipped: false, isMatched: false });
    });

    deck.sort(() => 0.5 - Math.random());

    APP_STATE.memorise = {
        cards: deck,
        flippedCards: [],
        matchedPairsCount: 0,
        movesCount: 0,
        totalPairsNeeded: totalPairsNeeded,
        isBusy: false
    };

    const speechBox = document.getElementById('memoriseAvatarSpeechBox');
    if (speechBox) {
        speechBox.innerHTML = getAvatarHtml('mascot', `¡Hola! Encuentra las <b>${totalPairsNeeded} parejas</b> de productos iguales para ganar +15 Puntos.`);
    }

    speakText(`Minijuego de Memorice. Encuentra las ${totalPairsNeeded} parejas de productos.`);
    renderMemoriseBoard();
}

function renderMemoriseBoard() {
    const boardEl = document.getElementById('memoriseBoard');
    const levelTag = document.getElementById('memoriseLevelTag');
    const movesTag = document.getElementById('memoriseMovesTag');

    if (!boardEl) return;

    const userLevel = (APP_STATE.currentUser && APP_STATE.currentUser.level) || 0;
    if (levelTag) levelTag.textContent = `${LEVEL_TITLES[Math.min(userLevel, LEVEL_TITLES.length - 1)]} (${APP_STATE.memorise.matchedPairsCount}/${APP_STATE.memorise.totalPairsNeeded} parejas)`;
    if (movesTag) movesTag.textContent = `Movimientos: ${APP_STATE.memorise.movesCount}`;

    boardEl.innerHTML = APP_STATE.memorise.cards.map((card, idx) => {
        const isVisible = card.isFlipped || card.isMatched;
        const imgHtml = card.photoUrl 
            ? `<img src="${card.photoUrl}" class="w-14 h-14 object-cover rounded-xl border">`
            : `<span class="text-4xl">${card.iconEmoji}</span>`;

        return `
            <div onclick="handleMemoriseCardClick(${idx})" class="h-28 bg-white border-4 ${card.isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-purple-300'} rounded-2xl shadow-md cursor-pointer flex flex-col items-center justify-center p-2 transition-all active:scale-95">
                ${isVisible ? `
                    <div class="flex flex-col items-center space-y-1 animate-fade-in">
                        ${imgHtml}
                        <span class="text-[10px] font-black text-slate-800 text-center leading-tight line-clamp-1">${card.name}</span>
                    </div>
                ` : `
                    <div class="text-3xl">❓</div>
                    <span class="text-[9px] font-bold text-purple-600 mt-1 uppercase">Tocar</span>
                `}
            </div>
        `;
    }).join('');
}

function handleMemoriseCardClick(cardIndex) {
    const mem = APP_STATE.memorise;
    if (mem.isBusy) return;

    const card = mem.cards[cardIndex];
    if (card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    mem.flippedCards.push({ card, cardIndex });
    playChimeSound();
    speakText(card.name);

    renderMemoriseBoard();

    if (mem.flippedCards.length === 2) {
        mem.movesCount++;
        mem.isBusy = true;
        const [first, second] = mem.flippedCards;

        if (first.card.productId === second.card.productId) {
            first.card.isMatched = true;
            second.card.isMatched = true;
            mem.matchedPairsCount++;
            mem.flippedCards = [];
            mem.isBusy = false;

            playChimeSound(false);
            speakText(`¡Excelente! Encontraste el par de ${first.card.name}`);

            const speechBox = document.getElementById('memoriseAvatarSpeechBox');
            if (speechBox) {
                speechBox.innerHTML = getAvatarHtml('corporeo', `¡Sensacional! Encontraste el par de <b>${first.card.name}</b>.`);
            }

            renderMemoriseBoard();

            if (mem.matchedPairsCount === mem.totalPairsNeeded) {
                setTimeout(() => {
                    if (typeof confetti !== 'undefined') confetti();
                    const pointsGained = 15;
                    speakText(`¡Completaste el Memorice! Ganaste ${pointsGained} puntos.`);
                    alert(`🎉 ¡FELICITACIONES!\n\nCompletaste el minijuego y ganaste +${pointsGained} puntos!`);
                    awardPointsAndXp(pointsGained, "Minijuego Memorice");
                    closeMemoriseModal();
                }, 500);
            }
        } else {
            setTimeout(() => {
                first.card.isFlipped = false;
                second.card.isFlipped = false;
                mem.flippedCards = [];
                mem.isBusy = false;
                renderMemoriseBoard();
            }, 1000);
        }
    }
}

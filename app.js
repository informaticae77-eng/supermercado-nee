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

            <!-- Olla y Caldero Negro Antiguo de Bruja Hirviendo con Poción -->
            <div class="absolute bottom-3 right-4 z-40 flex flex-col items-center pointer-events-auto">
                <div class="relative group cursor-pointer" onclick="speakText('¡Olla mágica de bruja activada!')">
                    <!-- Burbujas y Humo Mágico Ascendente -->
                    <div class="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
                        <span class="text-emerald-400 font-bold text-sm bubble-1">🫧</span>
                        <span class="text-purple-300 font-bold text-base bubble-2">✨</span>
                        <span class="text-emerald-300 font-bold text-xs bubble-3">🟢</span>
                    </div>

                    <!-- Sombrero Antiguo de Bruja encima de la olla -->
                    <div class="absolute -top-6 left-1 text-3xl transform -rotate-12 z-20 pointer-events-none filter drop-shadow">
                        🧙‍♀️
                    </div>

                    <!-- SVG Vectorial de la Olla/Caldero Negro de Hierro -->
                    <div class="animate-cauldron">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-2xl hover:scale-110 transition-transform">
                            <defs>
                                <radialGradient id="ironGradHW" cx="35%" cy="30%" r="70%">
                                    <stop offset="0%" stop-color="#4e4e50"/>
                                    <stop offset="45%" stop-color="#1c1c1e"/>
                                    <stop offset="85%" stop-color="#0a0a0c"/>
                                    <stop offset="100%" stop-color="#000000"/>
                                </radialGradient>
                                <linearGradient id="potionGradHW" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#10b981"/>
                                    <stop offset="50%" stop-color="#a855f7"/>
                                    <stop offset="100%" stop-color="#22c55e"/>
                                </linearGradient>
                                <radialGradient id="shadowGradHW" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stop-color="rgba(0,0,0,0.6)"/>
                                    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
                                </radialGradient>
                            </defs>
                            <!-- Sombra base -->
                            <ellipse cx="60" cy="110" rx="42" ry="8" fill="url(#shadowGradHW)"/>
                            <!-- Patas de hierro fundido -->
                            <path d="M 28 88 L 18 110 L 32 106 Z" fill="#0c0c0e" stroke="#000" stroke-width="1.5"/>
                            <path d="M 92 88 L 102 110 L 88 106 Z" fill="#0c0c0e" stroke="#000" stroke-width="1.5"/>
                            <path d="M 60 92 L 60 114 L 68 112 Z" fill="#050507"/>
                            <!-- Cuerpo esférico principal -->
                            <ellipse cx="60" cy="68" rx="44" ry="36" fill="url(#ironGradHW)" stroke="#18181b" stroke-width="2"/>
                            <!-- Remaches metálicos -->
                            <circle cx="30" cy="68" r="1.5" fill="#666"/>
                            <circle cx="90" cy="68" r="1.5" fill="#666"/>
                            <circle cx="60" cy="90" r="1.5" fill="#555"/>
                            <!-- Asas metálicas laterales -->
                            <path d="M 16 56 C 4 56, 4 72, 16 72" fill="none" stroke="#27272a" stroke-width="5" stroke-linecap="round"/>
                            <path d="M 104 56 C 116 56, 116 72, 104 72" fill="none" stroke="#27272a" stroke-width="5" stroke-linecap="round"/>
                            <ellipse cx="16" cy="64" rx="3" ry="5" fill="none" stroke="#52525b" stroke-width="2"/>
                            <ellipse cx="104" cy="64" rx="3" ry="5" fill="none" stroke="#52525b" stroke-width="2"/>
                            <!-- Borde de la olla -->
                            <ellipse cx="60" cy="42" rx="42" ry="11" fill="#18181b" stroke="#09090b" stroke-width="2"/>
                            <ellipse cx="60" cy="42" rx="36" ry="8" fill="#09090b"/>
                            <!-- Poción mágica verde/morada -->
                            <ellipse cx="60" cy="42" rx="34" ry="7" fill="url(#potionGradHW)"/>
                            <!-- Burbujas en la superficie -->
                            <circle cx="48" cy="41" r="3.5" fill="#a7f3d0" opacity="0.9"/>
                            <circle cx="70" cy="42" r="4.5" fill="#e9d5ff" opacity="0.85"/>
                            <circle cx="60" cy="44" r="2.5" fill="#6ee7b7" opacity="0.95"/>
                        </svg>
                    </div>
                </div>
                <span class="bg-purple-950/90 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-500/50 mt-0.5 shadow-lg backdrop-blur">
                    Olla Mágica
                </span>
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
                    alert(`🎉 ¡FELICITACIONES!\n\nCompletaste el minijuego de Memorice en ${mem.movesCount} movimientos.\n\n⭐ Ganaste +${pointsGained} Puntos`);
                    awardPointsAndXp(pointsGained, "Minijuego Memorice");
                    closeMemoriseModal();
                }, 600);
            }
        } else {
            setTimeout(() => {
                first.card.isFlipped = false;
                second.card.isFlipped = false;
                mem.flippedCards = [];
                mem.isBusy = false;
                renderMemoriseBoard();
            }, 1200);
        }
    }
}

// ==========================================
// RENDERIZADO PRINCIPAL
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    const headerSubTitle = document.getElementById('headerSubTitle');
    const appHeaderBar = document.getElementById('appHeaderBar');
    if (!container) return;

    renderThemeOverlay();

    const activeThemeKey = (APP_STATE.settings && APP_STATE.settings.activeTheme) || 'halloween';
    const theme = SEASONAL_THEMES[activeThemeKey] || SEASONAL_THEMES.standard;

    if (appHeaderBar) appHeaderBar.className = `${theme.headerBg} text-white shadow-lg border-b-4 sticky top-0 z-30 transition-colors duration-500`;

    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';
    if (headerSubTitle) headerSubTitle.textContent = teamLabel;

    if (APP_STATE.currentUser) {
        const userLevel = APP_STATE.currentUser.level || 0;
        const levelTitle = LEVEL_TITLES[Math.min(userLevel, LEVEL_TITLES.length - 1)];

        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin' :
                       (APP_STATE.currentUser.role === 'teacher' ? `👨‍🏫 ${teamLabel}` : `🎒 ${levelTitle}`);
        
        if (userInfoHeader) {
            userInfoHeader.innerHTML = `
                <div class="bg-white/90 text-slate-900 border px-3 py-1 rounded-xl text-xs flex items-center gap-2 shadow-sm font-bold">
                    <span>${APP_STATE.currentUser.name}</span>
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
                <p class="text-xs font-semibold text-slate-500">Ingresa tu RUT y PIN para ingresar</p>
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
                <button onclick="handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow text-lg active:scale-95">Ingresar</button>
            </div>
            <div class="bg-indigo-50 border p-3 rounded-2xl text-[11px] font-bold text-indigo-900 space-y-1">
                <div class="font-black uppercase">💡 Accesos Rápidos de Prueba:</div>
                <div>• Docente / Educador: RUT <code>12345678-9</code> | PIN <code>1234</code></div>
                <div>• Estudiante Alumno: RUT <code>98765432-1</code> | PIN <code>1234</code></div>
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
    stopAiCameraStream();
    stopAdminTestCameraStream();
    localStorage.removeItem('nee_active_user');
    renderApp();
}

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    APP_STATE.selectedCategoryFilter = 'ALL';
    renderApp();
}

// ==========================================
// VISTA HOME ESTUDIANTE CON PERSONAJES ANIMADOS
// ==========================================
function renderHomeView(container) {
    const activeThemeKey = APP_STATE.settings.activeTheme || 'halloween';
    const theme = SEASONAL_THEMES[activeThemeKey] || SEASONAL_THEMES.standard;
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

    const userLevel = (APP_STATE.currentUser && APP_STATE.currentUser.level) || 0;
    const userPoints = (APP_STATE.currentUser && APP_STATE.currentUser.points) || 0;
    const rewardTarget = (APP_STATE.settings && APP_STATE.settings.rewardPointsThreshold) || 250;

    let studentMissionBanner = '';
    if (APP_STATE.activeMission && APP_STATE.activeMission.active && APP_STATE.activeMission.itemIds) {
        const itemCount = APP_STATE.activeMission.itemIds.length;
        const currentScore = Math.max(10, 100 - (APP_STATE.classroomErrorsCount * 15));
        
        studentMissionBanner = `
            <div class="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-amber-300 space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl sm:text-5xl">🎯</span>
                        <div>
                            <span class="bg-slate-900 text-amber-300 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-block mb-1">
                                🔴 ¡MISIÓN EN AULA ACTIVA!
                            </span>
                            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">${APP_STATE.activeMission.title}</h3>
                            <p class="text-xs font-extrabold text-slate-950">Asignada por tu ${teamLabel} • ${itemCount} productos en tu hoja impresa</p>
                        </div>
                    </div>
                    <div class="bg-slate-900 text-amber-300 font-black px-4 py-2 rounded-2xl text-center border-2 border-amber-400 shadow-md">
                        <span class="text-[10px] text-white block uppercase">Puntuación Misión:</span>
                        <span class="text-xl text-amber-400">${currentScore}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="space-y-6">
            ${studentMissionBanner}

            <div class="bg-white p-5 rounded-3xl border-4 border-purple-300 shadow-lg space-y-3">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="text-3xl">🏆</span>
                        <div>
                            <h3 class="font-black text-indigo-950 text-base">${LEVEL_TITLES[Math.min(userLevel, LEVEL_TITLES.length - 1)]}</h3>
                            <p class="text-xs font-bold text-slate-500">Puntos acumulados: <b class="text-amber-600">${userPoints} pts</b> de ${rewardTarget} pts para el premio</p>
                        </div>
                    </div>
                    <button onclick="openMemoriseModal()" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-5 py-3 rounded-2xl shadow-lg border-b-4 border-purple-900 text-xs active:scale-95 flex items-center gap-2">
                        <span>🧠</span> <span>JUGAR MINIJUEGO MEMORICE (+15 PTS)</span>
                    </button>
                </div>

                <div class="w-full bg-slate-200 h-4 rounded-full overflow-hidden border">
                    <div class="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-500" style="width: ${Math.min(100, (userPoints / rewardTarget) * 100)}%"></div>
                </div>
            </div>

            <div class="${theme.bannerBg} p-6 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden border-4 border-white/30">
                <div class="space-y-2 z-10 max-w-xl">
                    <h2 class="text-2xl sm:text-4xl font-black ${theme.bannerText}">${theme.titleMsg}</h2>
                    <p class="text-sm font-bold text-white/90">${theme.greetingMsg}</p>
                    
                    ${getAvatarHtml('mascot', `¡Hola <b>${APP_STATE.currentUser?.name || ''}</b>! Selecciona una tienda para comenzar tu misión.`)}
                </div>

                <div class="z-10 hidden sm:flex flex-col items-center">
                    ${getAvatarHtml('corporeo')}
                </div>
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
        
        const currentScore = Math.max(10, 100 - (APP_STATE.classroomErrorsCount * 15));
        APP_STATE.invalidBasketItems = extraItems;

        let extraNames = extraItems.map(id => {
            const p = (APP_STATE.products || []).find(x => String(x.id) === String(id));
            return p ? p.name : 'Producto';
        }).join(', ');

        const alertMsg = `⚠️ Te equivocaste. Vuelve a revisar tu lista impresa.\n\n` +
            (missingItems.length > 0 ? `• Te falta(n) ${missingItems.length} producto(s) por agregar.\n` : '') +
            (extraItems.length > 0 ? `• Agregaste este producto que NO está en la lista: ${extraNames}.\n` : '') +
            `\n👉 Presiona el botón rojo "🗑️ QUITAR ESTE PRODUCTO" para corregir tu lista.\n\nPuntuación actual: ${currentScore}%`;

        speakText(`Este no es el producto que estamos buscando. Te equivocaste, inténtalo nuevamente.`);
        alert(alertMsg);
        renderApp();
    } else {
        APP_STATE.invalidBasketItems = [];
        APP_STATE.listValidated = true;
        playChimeSound(false);
        if (typeof confetti !== 'undefined') confetti();
        
        awardPointsAndXp(20, "Comprobación de Lista");
        speakText("¡Excelente! Tu lista está perfecta. Ganaste 20 puntos. Sigamos con la misión para ir al supermercado real.");
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
    speakText("¡Genial! Ahora estás en el supermercado real. Apunta la cámara al envase o etiqueta del producto para verificar su nombre y precio.");
    playChimeSound();
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => 
        String(s.id).toLowerCase() === String(supId).toLowerCase() ||
        String(s.name).toLowerCase() === String(supId).toLowerCase()
    );

    const currentScore = Math.max(10, 100 - (APP_STATE.classroomErrorsCount * 15));

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
                                    ¡COMPROBACIÓN EXITOSA! (+20 PTS GANADOS)
                                </span>
                                <h3 class="text-2xl font-black text-white">¡Sigamos con la misión! 🚀</h3>
                                <p class="text-sm font-bold text-emerald-100">Ahora ve a la repisa del supermercado, apunta la cámara al producto o etiqueta y la IA leerá el nombre y su precio real.</p>
                            </div>
                        </div>
                        <button onclick="enterTerrenoStoreMode()" class="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg py-4 rounded-2xl shadow-2xl border-b-4 border-amber-600 active:scale-95 flex items-center justify-center gap-2">
                            <span>🏪</span> <span>IR AL SUPERMERCADO Y ESCANEAR CON CÁMARA</span>
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
                                <p class="text-xs font-bold text-slate-600">Revisa tu hoja impresa, añade los productos al canasto y presiona comprobar.</p>
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
                <div class="bg-emerald-600 text-white p-4 rounded-3xl shadow-md border-4 border-emerald-800 flex justify-between items-center text-xs font-bold">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🤖📷</span>
                        <span>MODO VISIÓN OCR: Apunta la cámara directamente al nombre y precio del producto en la góndola.</span>
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
                        <button onclick="startAiVisualRecognition('${prod.id}')" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-3.5 rounded-2xl shadow border-b-4 border-indigo-900 active:scale-95 text-base flex items-center justify-center gap-2">
                            <span>🤖📷</span> <span>Escanear Nombre y Precio</span>
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
                <div>${getAvatarHtml('mascot')}</div>
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
// ESCÁNER OCR CON IA
// ==========================================
function startAiVisualRecognition(productId) {
    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(productId));
    if (!prod) return;

    APP_STATE.currentTargetScanProduct = prod.id;
    speakText(`Apunta la cámara al nombre o etiqueta de ${prod.name} y toma la foto.`);

    const modal = document.getElementById('scannerModal');
    const targetLabel = document.getElementById('aiScannerTargetTitle');
    if (targetLabel) targetLabel.textContent = prod.name;
    if (modal) modal.classList.remove('hidden');

    initAiCameraStream();
}

async function initAiCameraStream() {
    stopAiCameraStream();

    const videoEl = document.getElementById('aiCameraVideo');
    if (!videoEl) return;

    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('autoplay', 'true');
    videoEl.muted = true;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("⚠️ Tu navegador móvil no admite cámara directa.");
        return;
    }

    const facingChoice = (APP_STATE.aiConfig && APP_STATE.aiConfig.cameraFacing) || 'environment';
    const constraintsList = [
        { video: { facingMode: { ideal: facingChoice } }, audio: false },
        { video: { facingMode: "environment" }, audio: false },
        { video: { facingMode: "user" }, audio: false },
        { video: true, audio: false }
    ];

    let stream = null;
    for (const constraints of constraintsList) {
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (stream) break;
        } catch (e) {}
    }

    if (!stream) {
        alert("⚠️ No se pudo acceder a la cámara. Revisa los permisos en tu navegador.");
        return;
    }

    APP_STATE.cameraStream = stream;
    videoEl.srcObject = stream;

    try { await videoEl.play(); } catch (err) {}
}

function stopAiCameraStream() {
    if (APP_STATE.cameraStream) {
        APP_STATE.cameraStream.getTracks().forEach(track => track.stop());
        APP_STATE.cameraStream = null;
    }
}

function closeScannerModal() {
    const modal = document.getElementById('scannerModal');
    if (modal) modal.classList.add('hidden');
    stopAiCameraStream();
}

async function captureAndAnalyzeImageWithAI() {
    if (APP_STATE.isAiAnalyzing) return;
    APP_STATE.isAiAnalyzing = true;

    const videoEl = document.getElementById('aiCameraVideo');
    const canvasEl = document.getElementById('aiCameraCanvas');
    const statusBox = document.getElementById('aiScanStatusBox');

    const targetId = APP_STATE.currentTargetScanProduct;
    const targetProduct = (APP_STATE.products || []).find(p => String(p.id) === String(targetId));

    if (!targetProduct) {
        alert("No hay un producto seleccionado.");
        APP_STATE.isAiAnalyzing = false;
        return;
    }

    if (statusBox) {
        statusBox.innerHTML = `
            <div class="flex items-center justify-center gap-2 text-indigo-700 font-black animate-pulse py-1">
                <span class="text-2xl animate-spin">🔍</span>
                <span>Analizando nombre y precio en la etiqueta...</span>
            </div>
        `;
    }

    if (!canvasEl || !videoEl || videoEl.readyState < 2) {
        alert("La cámara aún no carga el marco. Espera un segundo e intenta de nuevo.");
        APP_STATE.isAiAnalyzing = false;
        return;
    }

    const ctx = canvasEl.getContext('2d');
    canvasEl.width = videoEl.videoWidth || 640;
    canvasEl.height = videoEl.videoHeight || 480;
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    const photoDataUrl = canvasEl.toDataURL('image/jpeg', 0.8);

    try {
        if (typeof Tesseract === 'undefined') {
            alert("⚠️ Falta incluir la librería Tesseract.js en el index.html");
            APP_STATE.isAiAnalyzing = false;
            return;
        }

        const result = await Tesseract.recognize(canvasEl, 'spa');
        const detectedText = (result.data.text || '').toLowerCase();

        const expectedName = targetProduct.name.toLowerCase().trim();
        const keywords = expectedName.split(' ').filter(word => word.length > 2);
        const nameMatches = keywords.filter(kw => detectedText.includes(kw));
        const isNameCorrect = nameMatches.length > 0;

        if (isNameCorrect) {
            const priceRegex = /\$?\s*([0-9]{1,3}(?:\.[0-9]{3})+|[0-9]{3,6})/g;
            const priceMatches = [...detectedText.matchAll(priceRegex)];
            let scannedPrice = targetProduct.price || 0;

            if (priceMatches.length > 0) {
                const rawPriceStr = priceMatches[0][1].replace(/\./g, '');
                const parsedPrice = parseInt(rawPriceStr, 10);
                if (!isNaN(parsedPrice) && parsedPrice >= 100 && parsedPrice <= 200000) {
                    scannedPrice = parsedPrice;
                }
            }

            if (scannedPrice !== targetProduct.price) {
                APP_STATE.priceAdjustmentsCount++;
                targetProduct.price = scannedPrice;
            }

            const basketItem = (APP_STATE.basket || []).find(b => String(b.productId) === String(targetProduct.id));
            if (basketItem) {
                basketItem.actualPrice = scannedPrice;
            } else {
                APP_STATE.basket.push({ productId: targetProduct.id, quantity: 1, actualPrice: scannedPrice });
            }

            APP_STATE.scannedItemsInStore[targetProduct.id] = true;
            playChimeSound(false);
            closeScannerModal();

            speakText(`¡Excelente! Confirmaste ${targetProduct.name} a un precio de ${scannedPrice} pesos. Agregado al total.`);
            openShelfPriceConfirmation(targetProduct.id, photoDataUrl);

        } else {
            APP_STATE.classroomErrorsCount++;
            playChimeSound(true);

            const currentScore = Math.max(10, 100 - (APP_STATE.classroomErrorsCount * 15));
            const readSnippet = detectedText.length > 0 ? detectedText.substring(0, 35).replace(/\n/g, ' ') : 'Texto no legible';

            speakText(`Eso no es ${targetProduct.name}. Enfoca claramente la etiqueta o el envase.`);

            if (statusBox) {
                statusBox.innerHTML = `
                    <div class="p-3 bg-rose-100 border-2 border-rose-400 rounded-2xl text-rose-950 font-bold text-xs space-y-1 text-center">
                        <div class="font-black text-rose-700 text-sm">❌ PRODUCTO NO RECONOCIDO</div>
                        <div>Leído en cámara: <b>"${readSnippet}"</b></div>
                        <div class="text-indigo-900">Se buscaba: <b>${targetProduct.name}</b></div>
                    </div>
                `;
            }

            alert(`❌ PRODUCTO INCORRECTO\n\nTexto detectado: "${readSnippet}"\nNo coincide con: "${targetProduct.name}"\n\nPuntuación actual: ${currentScore}%`);
        }
    } catch (err) {
        console.error("Error en OCR:", err);
        alert("Ocurrió un problema al leer la imagen. Intenta enfocar con mejor luz.");
    }

    APP_STATE.isAiAnalyzing = false;
}

function openShelfPriceConfirmation(productId, photoDataUrl = null) {
    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(productId));
    if (!prod) return;

    APP_STATE.pendingScanProduct = prod;
    document.getElementById('shelfPriceProdName').textContent = prod.name;
    document.getElementById('shelfPriceOriginalLabel').textContent = `$${(prod.price || 0).toLocaleString('es-CL')}`;

    const previewImg = document.getElementById('shelfCapturedPhotoPreview');
    if (previewImg && photoDataUrl) {
        previewImg.src = photoDataUrl;
        previewImg.classList.remove('hidden');
    }

    const basePrice = prod.price || 800;
    const suggestedPrices = [basePrice, 1500, basePrice + 300, Math.max(500, basePrice - 200)];

    const btnContainer = document.getElementById('shelfPriceButtonsContainer');
    if (btnContainer) {
        btnContainer.innerHTML = suggestedPrices.map(p => `
            <button onclick="applyShelfPriceChoice(${p})" class="p-3 bg-amber-50 border-2 border-amber-300 hover:bg-amber-500 hover:text-slate-900 rounded-2xl font-black text-xs active:scale-95 shadow">
                $${p.toLocaleString('es-CL')} ${p !== basePrice ? '⚠️ (Nuevo Precio)' : '✓ (Igual)'}
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
        prod.price = newPrice;
        const bItem = APP_STATE.basket.find(b => String(b.productId) === String(prod.id));
        if (bItem) bItem.actualPrice = newPrice;

        speakText(`Actualizaste el valor de ${prod.name} en la góndola a ${newPrice} pesos.`);
        alert(`🔔 ¡PRECIO ACTUALIZADO!\n\nEl precio de "${prod.name}" cambió a $${newPrice.toLocaleString('es-CL')}.`);
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
        document.getElementById('shelfPriceCustomInput').value = '';
    } else {
        alert("Ingresa un número de precio válido.");
    }
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
// CANASTO Y PAGO EN CAJA
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

    const totalErrors = APP_STATE.classroomErrorsCount || 0;
    const pointsEarned = Math.max(10, 100 - (totalErrors * 15));
    
    let medal = "🥇 Medalla de Oro (100% Perfecto)";
    let feedback = "¡Increíble! Lograste completar tu compra sin cometer errores.";

    if (pointsEarned >= 80 && pointsEarned < 100) {
        medal = `🥈 Medalla de Plata (${pointsEarned}% Gran trabajo)`;
        feedback = "¡Muy bien! Tuviste solo 1 o 2 desaciertos.";
    } else if (pointsEarned >= 50 && pointsEarned < 80) {
        medal = `🥉 Medalla de Bronce (${pointsEarned}% Buen esfuerzo)`;
        feedback = "¡Bien hecho! Sigue practicando para mejorar tu puntuación.";
    } else if (pointsEarned < 50) {
        medal = `🌟 Estrella de Participación (${pointsEarned}%)`;
        feedback = "¡Completaste tu compra! Recuerda fijarte muy bien en los productos de tu lista.";
    }

    awardPointsAndXp(pointsEarned, "Compra en Caja");

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
        classroomErrorsCount: totalErrors,
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
    speakText(`¡Excelente compra! Ganaste una puntuación de ${pointsEarned} por ciento. Tu vuelto es de ${vuelto} pesos.`);
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
// IMPRESIÓN Y MISIÓN
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

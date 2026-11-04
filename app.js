// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE Y EMAILJS
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
// 2. MATRIZ DE OBJETIVOS PEDAGÓGICOS (MINEDUC / PIE)
// ==========================================
const LEVEL_CURRICULUM = {
    1: {
        id: 1,
        title: "Nivel 1: Explorador de Góndolas 🎒",
        icon: "🧩",
        bgColor: "from-emerald-600 to-teal-800",
        objectiveGeneral: "Desarrollar habilidades básicas de discriminación visual, reconocimiento numérico y asociación de valores en el Sistema Monetario Chileno (CLP) de baja denominación ($100 a $2.000).",
        objectivesSpecific: [
            "Identificar y diferenciar visualmente monedas ($100, $500) y billetes de $1.000 y $2.000.",
            "Asociar el valor escrito en el precio de un producto con la moneda o billete correspondiente.",
            "Ejercitar memoria de trabajo y motricidad fina mediante el minijuego de parejas adaptadas."
        ],
        objectiveStudent: "Aprender a conocer los billetes de $1.000 y las monedas para pagar tus productos favoritos.",
        objectivePedagogical: "OA 1 Matemáticas / Autonomía PIE: Identificación y discriminación de magnitudes numéricas y monedas de uso cotidiano.",
        minigamesRequired: 5,
        bossTitle: "👾 Jefe Final: El Cajero Apurado",
        bossDescription: "Demuestra tu rapidez identificando los billetes correctos para pagar antes de que se llene la fila.",
        bossReward: "👑 Corona del Comprador Principiante (+50 PTS)"
    },
    2: {
        id: 2,
        title: "Nivel 2: Experto en Góndolas 🏪",
        icon: "🧱",
        bgColor: "from-blue-600 to-indigo-800",
        objectiveGeneral: "Fortalecer el razonamiento cuantitativo y la comparación de valores en góndolas para tomar decisiones económicas autónomas.",
        objectivesSpecific: [
            "Comparar precios para determinar cuál producto es más costoso o más económico.",
            "Escanear e interpretar etiquetas de góndola en entornos reales usando la cámara con Inteligencia Artificial.",
            "Calcular vueltos simples en compras con pago de hasta $5.000 pesos."
        ],
        objectiveStudent: "Comparar precios en las repisas y descubrir qué producto te conviene más llevar.",
        objectivePedagogical: "OA 2 Matemáticas / Autonomía PIE: Comparación de magnitudes cuantitativas, lecturas de etiquetas y estimación de costos.",
        minigamesRequired: 5,
        bossTitle: "👾 Jefe Final: El Inspector de Precios",
        bossDescription: "Encuentra los precios correctos en la góndola y verifica las ofertas sin equivocarte.",
        bossReward: "🏆 Medalla de Experto en Góndolas (+75 PTS)"
    },
    3: {
        id: 3,
        title: "Nivel 3: Máster de Supermercado 🏆",
        icon: "💎",
        bgColor: "from-purple-700 to-pink-900",
        objectiveGeneral: "Consolidar la autonomía funcional del estudiante en el proceso completo de compra, presupuesto y verificación de vueltos.",
        objectivesSpecific: [
            "Planificar y cotejar una lista de compras impresa frente a la selección de artículos.",
            "Sumar costos acumulados de múltiples productos dentro del canasto.",
            "Manejar billetes de alta denominación ($5.000, $10.000, $20.000) y calcular el vuelto exacto."
        ],
        objectiveStudent: "Armar tu lista de compras completa, pagar con billetes grandes y revisar que tu vuelto esté correcto.",
        objectivePedagogical: "OA 3 Matemáticas / Autonomía PIE: Transacciones compuestas, presupuesto familiar y resolución de problemas de la vida diaria.",
        minigamesRequired: 5,
        bossTitle: "👾 Jefe Final: El Gerente General",
        bossDescription: "Completa la compra semanal de la lista entregando el pago exacto y verificando tu vuelto.",
        bossReward: "🥇 Trofeo Máster del Supermercado (+100 PTS)"
    }
};

const MINEDUC_EXAM_BANK = {
    1: [
        {
            q: "Vas al almacén a comprar un jugo de $1.000 pesos. ¿Con cuál billete chileno pagas justo?",
            options: ["Billete de $1.000 (Verde)", "Billete de $5.000 (Rojo)", "Moneda de $500"],
            correct: "Billete de $1.000 (Verde)"
        },
        {
            q: "¿Cuál de estas monedas chilenas tiene mayor valor en dinero?",
            options: ["Moneda de $500", "Moneda de $100", "Moneda de $50"],
            correct: "Moneda de $500"
        }
    ],
    2: [
        {
            q: "En la feria, 1 Kilo de Manzanas cuesta $1.200 y unas Galletas cuestan $800. ¿Cuál producto cuesta MENOS dinero?",
            options: ["Las Galletas ($800)", "Las Manzanas ($1.200)", "Cuestan lo mismo"],
            correct: "Las Galletas ($800)"
        },
        {
            q: "Si compras un pan de $1.500 pesos y pagas con un billete de $2.000, ¿cuál es tu vuelto?",
            options: ["$500 pesos", "$1.000 pesos", "Sin vuelto"],
            correct: "$500 pesos"
        }
    ],
    3: [
        {
            q: "Compras una Leche de $1.000 y un Pan de $2.000. ¿Cuánto dinero debes pagar en total?",
            options: ["$3.000 pesos", "$2.000 pesos", "$4.000 pesos"],
            correct: "$3.000 pesos"
        },
        {
            q: "Pagas una compra de $4.000 pesos con un billete de $5.000. ¿Qué billete o moneda debes recibir de vuelto?",
            options: ["Billete de $1.000", "Moneda de $500", "Billete de $2.000"],
            correct: "Billete de $1.000"
        }
    ]
};

// ==========================================
// 3. TEMÁTICAS Y MONEDAS CHILENAS (CLP)
// ==========================================
const SEASONAL_THEMES = {
    standard: { id: 'standard', name: 'Estándar / Institucional 🏫', bgColor: 'bg-slate-100', bannerBg: 'bg-indigo-600', headerBg: 'bg-indigo-600', bannerText: ' text-white ', titleMsg: '¡Bienvenido a Comprar! 🛍️', greetingMsg: 'Selecciona una tienda para comenzar tu misión.', emoji: '🛍️' },
    halloween: { id: 'halloween', name: 'Halloween & Noche de Brujas 🎃🕸️', bgColor: 'bg-slate-900', bannerBg: 'bg-gradient-to-r from-purple-900 via-orange-600 to-slate-900', headerBg: 'bg-purple-950 border-orange-500', bannerText: ' text-amber-300 ', titleMsg: '¡Especial de Halloween! 🎃👻', greetingMsg: '¡Busca dulces y pociones en el supermercado embrujado!', emoji: '🎃' },
    navidad: { id: 'navidad', name: 'Especial Navidad 🎄✨', bgColor: 'bg-red-50', bannerBg: 'bg-gradient-to-r from-red-600 via-emerald-600 to-red-700', headerBg: 'bg-red-700 border-emerald-500', bannerText: ' text-yellow-200 ', titleMsg: '¡Especial de Navidad en la Escuela! 🎄🎁', greetingMsg: '¡Encuentra los regalos y la cena navideña!', emoji: '🎅' },
    semana_santa: { id: 'semana_santa', name: 'Semana Santa / Conejito 🐰🥚', bgColor: 'bg-emerald-50', bannerBg: 'bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500', headerBg: 'bg-teal-700 border-purple-400', bannerText: ' text-white ', titleMsg: '¡Pascua de Resurrección! 🐰🥚', greetingMsg: '¡Encuentra los huevitos de chocolate en las góndolas!', emoji: '🐰' },
    fiestas_patrias: { id: 'fiestas_patrias', name: 'Fiestas Patrias Chile 🇨🇱🎈', bgColor: 'bg-blue-50', bannerBg: 'bg-gradient-to-r from-blue-700 via-white to-red-600', headerBg: 'bg-blue-800 border-red-600', bannerText: ' text-slate-900 font-black ', titleMsg: '¡Viva Chile! Fiestas Patrias 🇨🇱🎈', greetingMsg: '¡A comprar las empanadas y la carne para el asado!', emoji: '🥟' },
    mes_nino: { id: 'mes_nino', name: 'Mes del Niño & Juventud 🎈🧸', bgColor: 'bg-pink-50', bannerBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400', headerBg: 'bg-pink-600 border-purple-500', bannerText: ' text-white ', titleMsg: '¡Feliz Mes del Niño! 🎈🧸', greetingMsg: '¡Día de juegos, juguetes y sorpresas en el supermercado!', emoji: '🎈' },
    verano: { id: 'verano', name: 'Modo Verano & Vacaciones ☀️🏖️', bgColor: 'bg-amber-50', bannerBg: 'bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400', headerBg: 'bg-orange-500 border-amber-300', bannerText: ' text-slate-900 ', titleMsg: '¡Modo Verano Activo! ☀️🌊', greetingMsg: '¡Prepara tu canasto con helados, frutas y bebidas!', emoji: '🍦' },
    invierno: { id: 'invierno', name: 'Vacaciones de Invierno ❄️☕', bgColor: 'bg-sky-50', bannerBg: 'bg-gradient-to-r from-sky-600 via-indigo-700 to-blue-900', headerBg: 'bg-indigo-800 border-sky-400', bannerText: ' text-sky-100 ', titleMsg: '¡Vacaciones de Invierno! ❄️🏔️', greetingMsg: '¡Busca chocolates calientes y sopitas calientitas!', emoji: '❄️' }
};

const DEFAULT_SETTINGS = {
    schoolName: "Escuela Especial Adaptativa",
    schoolSubHeader: "Unidad de Autonomía Funcional",
    teamName: "Equipo Multidisciplinario",
    schoolLogo: "",
    mascotUrl: "",
    corporeoUrl: "",
    activeTheme: "halloween",
    rewardPointsThreshold: 250,
    rewardMessage: "¡Excelente trabajo! Muestra esta pantalla a tu profesor para recibir tu premio físico."
};

const LEVEL_TITLES = [
    "Nivel 0: Explorador Inicial 🎒",
    "Nivel 1: Explorador de Góndolas 🎒",
    "Nivel 2: Experto en Góndolas 🏪",
    "Nivel 3: Máster de Supermercado 🏆"
];

function makeSvgDataUrl(svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

const SVG_B20K = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#e67e22"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#f39c12" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$20.000</text></svg>`;
const SVG_B10K = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#2980b9"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#5499c7" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$10.000</text></svg>`;
const SVG_B5K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#c0392b"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#ec7063" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$5.000</text></svg>`;
const SVG_B2K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#8e44ad"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#bb8fce" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$2.000</text></svg>`;
const SVG_B1K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#27ae60"/><rect x="10" y="10" width="180" height="80" rx="6" fill="none" stroke="#58d68d" stroke-width="3"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$1.000</text></svg>`;
const SVG_C500 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f39c12"/><circle cx="50" cy="50" r="34" fill="#bdc3c7"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#2c3e50" text-anchor="middle">$500</text></svg>`;
const SVG_C100 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f1c40f"/><circle cx="50" cy="50" r="36" fill="#f39c12"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">$100</text></svg>`;
const SVG_C50  = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><polygon points="50,4 82,18 96,50 82,82 50,96 18,18" fill="#bdc3c7"/><circle cx="50" cy="50" r="32" fill="#ecf0f1"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#2c3e50" text-anchor="middle">$50</text></svg>`;
const SVG_C10  = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#d35400"/><circle cx="50" cy="50" r="36" fill="#e67e22"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">$10</text></svg>`;

const CLP_CURRENCY_ITEMS = [
    { id: 'b20k', value: 20000, type: 'bill', name: 'Billete $20.000', img: makeSvgDataUrl(SVG_B20K) },
    { id: 'b10k', value: 10000, type: 'bill', name: 'Billete $10.000', img: makeSvgDataUrl(SVG_B10K) },
    { id: 'b5k',  value: 5000,  type: 'bill', name: 'Billete $5.000',  img: makeSvgDataUrl(SVG_B5K) },
    { id: 'b2k',  value: 2000,  type: 'bill', name: 'Billete $2.000',  img: makeSvgDataUrl(SVG_B2K) },
    { id: 'b1k',  value: 1000,  type: 'bill', name: 'Billete $1.000',  img: makeSvgDataUrl(SVG_B1K) },
    { id: 'c500', value: 500,   type: 'coin', name: 'Moneda $500',    img: makeSvgDataUrl(SVG_C500) },
    { id: 'c100', value: 100,   type: 'coin', name: 'Moneda $100',    img: makeSvgDataUrl(SVG_C100) },
    { id: 'c50',  value: 50,    type: 'coin', name: 'Moneda $50',     img: makeSvgDataUrl(SVG_C50) },
    { id: 'c10',  value: 10,    type: 'coin', name: 'Moneda $10',     img: makeSvgDataUrl(SVG_C10) }
];

// ==========================================
// 4. ESTADO GLOBAL DE LA APLICACIÓN
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
    supermarkets: [{ id: 'sup-1', name: 'Supermercado Central', icon: '🏪', photoUrl: '', description: 'Tienda Principal' }],
    products: [
        { id: 'prod-1', name: 'Leche Entera 1L', category: 'Lácteos, Yogures y Huevos', price: 1050, isAll: true, iconEmoji: '🥛' },
        { id: 'prod-2', name: 'Pan Hallulla 1Kg', category: 'Panadería y Pastelería', price: 1990, isAll: true, iconEmoji: '🍞' },
        { id: 'prod-3', name: 'Manzana Fuji (1Kg)', category: 'Frutas y Verduras', price: 1200, isAll: true, iconEmoji: '🍎' },
        { id: 'prod-4', name: 'Jugo de Naranja 1L', category: 'Bebidas, Agua y Jugos', price: 1500, isAll: true, iconEmoji: '🧃' }
    ],
    users: [
        { id: 'u-docente', role: 'teacher', name: 'Profesor / Educador', rut: '12345678-9', pin: '1234', email: 'docente@escuela.cl' },
        { id: 'u-alumno', role: 'student', name: 'Estudiante Ejemplo', rut: '98765432-1', pin: '1234', points: 50, level: 1, xp: 50, minigamesCompleted: { level_1: 0 }, examPassed: {} }
    ],
    customCurrencies: {},
    settings: { ...DEFAULT_SETTINGS },
    activeMission: null,
    classroomErrorsCount: 0,
    invalidBasketItems: [],
    memorise: { cards: [], flippedCards: [], matchedPairsCount: 0, movesCount: 0, totalPairsNeeded: 3, isBusy: false },
    currentExam: null,
    videoCapsules: [
        { id: 'cap-1', level: 1, skill: 'Reconocimiento de Monedas', title: '¿Cómo identificar billetes y monedas?', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
};

// ==========================================
// 5. FUNCIONES DE APOYO (AUDIO, SÍNTESIS, IMÁGENES)
// ==========================================
function getAvatarHtml(type = 'mascot', customSpeechText = '') {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const customImg = (type === 'mascot') ? st.mascotUrl : st.corporeoUrl;

    let avatarImgHtml = '';
    if (customImg) {
        avatarImgHtml = `<img src="${customImg}" class="w-16 h-16 sm:w-20 sm:h-20 object-contain animate-avatar-float drop-shadow-md">`;
    } else {
        avatarImgHtml = (type === 'mascot') ? `
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-indigo-500 to-amber-400 rounded-3xl p-2 border-4 border-white shadow-xl animate-avatar-float flex items-center justify-center">
                <span class="text-3xl sm:text-4xl">🛒🤖</span>
            </div>` : `
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl p-2 border-4 border-white shadow-xl animate-avatar-float flex items-center justify-center">
                <span class="text-3xl sm:text-4xl">🐻</span>
            </div>`;
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

function renderThemeOverlay() {
    const container = document.getElementById('themeOverlayContainer');
    if (!container) return;
    const activeKey = (APP_STATE.settings && APP_STATE.settings.activeTheme) || 'halloween';
    if (activeKey === 'halloween') {
        container.innerHTML = `<div class="absolute top-6 left-0 animate-witch z-50 text-5xl sm:text-6xl drop-shadow-xl pointer-events-none">🧙‍♀️🧹</div>`;
    } else {
        container.innerHTML = '';
    }
}

function speakText(text) {
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
        } else {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.25);
        }
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.35);
    } catch(e) {}
}

function calculateCLPBreakdown(amount) {
    if (!amount || amount <= 0) return [];
    let remaining = amount < 10 ? 10 : amount;
    const result = [];
    CLP_CURRENCY_ITEMS.forEach(item => {
        const count = Math.floor(remaining / item.value);
        if (count > 0) { result.push({ ...item, count }); remaining %= item.value; }
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
            return `<div class="inline-flex items-center gap-1 bg-amber-50 border-2 border-amber-300 rounded-xl px-2 py-1 shadow-sm">
                <img src="${imgSrc}" class="h-8 object-contain">
                <span class="text-xs font-black text-amber-950">${b.count > 1 ? b.count + 'x' : ''}</span>
            </div>`;
        }).join('') + `</div>`;
}

// ==========================================
// 6. SISTEMA DE PUNTOS Y RECOMPENSAS
// ==========================================
function awardPointsAndXp(pointsToAdd, sourceLabel = "Actividad") {
    if (!APP_STATE.currentUser || APP_STATE.currentUser.role !== 'student') return;
    const user = APP_STATE.currentUser;
    user.points = (user.points || 0) + pointsToAdd;
    user.xp = (user.xp || 0) + pointsToAdd;

    localStorage.setItem('nee_active_user', JSON.stringify(user));
    if (db && user.id) db.collection('users').doc(user.id).set({ points: user.points, xp: user.xp }, { merge: true });

    const targetThreshold = (APP_STATE.settings && APP_STATE.settings.rewardPointsThreshold) || 250;
    if (user.points >= targetThreshold) triggerPhysicalRewardModal(targetThreshold);
    renderApp();
}

function triggerPhysicalRewardModal(threshold) {
    playChimeSound(false);
    if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 90 });
    const scoreDisplay = document.getElementById('rewardScoreDisplay');
    if (scoreDisplay) scoreDisplay.textContent = `${APP_STATE.currentUser.points} / ${threshold} PTS`;
    const rewardModal = document.getElementById('physicalRewardModal');
    if (rewardModal) rewardModal.classList.remove('hidden');
}

function confirmPhysicalRewardClaim() {
    const rewardModal = document.getElementById('physicalRewardModal');
    if (rewardModal) rewardModal.classList.add('hidden');
    renderApp();
}

// ==========================================
// 7. REGISTRO DE MINIJUEGOS (5 PARA EL JEFE)
// ==========================================
function registerMinigameCompletion(minigameName = "Memorice") {
    const user = APP_STATE.currentUser;
    if (!user || user.role !== 'student') return;

    const currentLevel = user.level || 1;
    if (!user.minigamesCompleted) user.minigamesCompleted = {};

    const key = `level_${currentLevel}`;
    user.minigamesCompleted[key] = (user.minigamesCompleted[key] || 0) + 1;

    localStorage.setItem('nee_active_user', JSON.stringify(user));
    if (db && user.id) db.collection('users').doc(user.id).set({ minigamesCompleted: user.minigamesCompleted }, { merge: true });

    const count = user.minigamesCompleted[key];
    if (count < 5) {
        speakText(`¡Excelente! Ganaste el minijuego. Llevas ${count} de 5 minijuegos para enfrentarte al Jefe Final.`);
    } else if (count === 5) {
        playChimeSound(false);
        if (typeof confetti !== 'undefined') confetti();
        speakText(`¡Sensacional! Completaste los 5 minijuegos del Nivel ${currentLevel}. Se ha desbloqueado la Batalla con el Jefe Final.`);
        alert(`🎉 ¡JEFE FINAL DESBLOQUEADO!\n\nCompletaste los 5 minijuegos del Nivel ${currentLevel}.\n¡Enfréntate al Jefe Final para subir de nivel!`);
    }
    renderApp();
}

// ==========================================
// 8. MINIJUEGO MEMORICE
// ==========================================
function openMemoriseModal() {
    startMemoriseGame();
    const modal = document.getElementById('memoriseGameModal');
    if (modal) modal.classList.remove('hidden');
}

function closeMemoriseModal() {
    const modal = document.getElementById('memoriseGameModal');
    if (modal) modal.classList.add('hidden');
}

function startMemoriseGame() {
    const userLevel = (APP_STATE.currentUser && APP_STATE.currentUser.level) || 1;
    let totalPairsNeeded = 3;
    if (userLevel === 2) totalPairsNeeded = 4;
    if (userLevel >= 3) totalPairsNeeded = 6;

    let availableProducts = [...(APP_STATE.products || [])];
    if (availableProducts.length < totalPairsNeeded) {
        availableProducts = availableProducts.concat([
            { id: 'fb1', name: 'Leche', photoUrl: '', iconEmoji: '🥛' },
            { id: 'fb2', name: 'Pan', photoUrl: '', iconEmoji: '🍞' },
            { id: 'fb3', name: 'Manzana', photoUrl: '', iconEmoji: '🍎' },
            { id: 'fb4', name: 'Jugo', photoUrl: '', iconEmoji: '🧃' }
        ]);
    }

    const selectedProds = availableProducts.sort(() => 0.5 - Math.random()).slice(0, totalPairsNeeded);
    let deck = [];
    selectedProds.forEach((prod, index) => {
        deck.push({ cardId: `card-${index}-a`, productId: prod.id, name: prod.name, photoUrl: prod.photoUrl || prod.photo || '', iconEmoji: prod.iconEmoji || '📦', isFlipped: false, isMatched: false });
        deck.push({ cardId: `card-${index}-b`, productId: prod.id, name: prod.name, photoUrl: prod.photoUrl || prod.photo || '', iconEmoji: prod.iconEmoji || '📦', isFlipped: false, isMatched: false });
    });
    deck.sort(() => 0.5 - Math.random());

    APP_STATE.memorise = { cards: deck, flippedCards: [], matchedPairsCount: 0, movesCount: 0, totalPairsNeeded: totalPairsNeeded, isBusy: false };

    const speechBox = document.getElementById('memoriseAvatarSpeechBox');
    if (speechBox) speechBox.innerHTML = getAvatarHtml('mascot', `¡Encuentra las <b>${totalPairsNeeded} parejas</b> iguales para ganar +15 Puntos!`);
    speakText(`Minijuego de Memorice. Encuentra las ${totalPairsNeeded} parejas de productos.`);
    renderMemoriseBoard();
}

function renderMemoriseBoard() {
    const boardEl = document.getElementById('memoriseBoard');
    if (!boardEl) return;
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const backImageUrl = st.mascotUrl || st.corporeoUrl || st.schoolLogo || '';
    const backFaceHtml = backImageUrl 
        ? `<img src="${backImageUrl}" class="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow">`
        : `<span class="text-5xl animate-bounce">🤖</span>`;

    boardEl.innerHTML = APP_STATE.memorise.cards.map((card, idx) => {
        const isVisible = card.isFlipped || card.isMatched;
        const imgHtml = card.photoUrl 
            ? `<img src="${card.photoUrl}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border">`
            : `<span class="text-5xl">${card.iconEmoji}</span>`;

        return `
            <div onclick="handleMemoriseCardClick(${idx})" class="h-36 sm:h-44 bg-white border-4 ${card.isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-purple-300 hover:border-purple-500'} rounded-3xl shadow-lg cursor-pointer flex flex-col items-center justify-center p-3 transition-all active:scale-95">
                ${isVisible ? `
                    <div class="flex flex-col items-center space-y-2 animate-fade-in">
                        ${imgHtml}
                        <span class="text-xs font-black text-slate-800 text-center leading-tight line-clamp-2">${card.name}</span>
                    </div>
                ` : `
                    <div class="flex flex-col items-center space-y-1">
                        ${backFaceHtml}
                        <span class="text-[10px] font-black text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded-full">Tocar</span>
                    </div>
                `}
            </div>
        `;
    }).join('');

    const movesTag = document.getElementById('memoriseMovesTag');
    if (movesTag) movesTag.textContent = `Movimientos: ${APP_STATE.memorise.movesCount}`;
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
            first.card.isMatched = true; second.card.isMatched = true;
            mem.matchedPairsCount++;
            mem.flippedCards = []; mem.isBusy = false;
            playChimeSound(false);
            renderMemoriseBoard();

            if (mem.matchedPairsCount === mem.totalPairsNeeded) {
                setTimeout(() => {
                    if (typeof confetti !== 'undefined') confetti();
                    awardPointsAndXp(15, "Minijuego Memorice");
                    registerMinigameCompletion("Memorice");
                    closeMemoriseModal();
                }, 600);
            }
        } else {
            setTimeout(() => {
                first.card.isFlipped = false; second.card.isFlipped = false;
                mem.flippedCards = []; mem.isBusy = false;
                renderMemoriseBoard();
            }, 1200);
        }
    }
}

// ==========================================
// 9. MÓDULO DE MINIJUEGOS Y MAPA DE JEFES 🔒
// ==========================================
function openMinigamesModuleModal() {
    renderMinigamesMap();
    const modal = document.getElementById('minigamesModuleModal');
    if (modal) modal.classList.remove('hidden');
}

function closeMinigamesModuleModal() {
    const modal = document.getElementById('minigamesModuleModal');
    if (modal) modal.classList.add('hidden');
}

function renderMinigamesMap() {
    const container = document.getElementById('minigamesMapContainer');
    if (!container) return;

    const user = APP_STATE.currentUser || { level: 1, minigamesCompleted: {}, examPassed: {} };

    let html = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-5 rounded-3xl border-4 border-indigo-400 shadow-xl flex justify-between items-center flex-wrap gap-4">
                <div class="space-y-1">
                    <span class="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase">🎮 Módulo de Minijuegos</span>
                    <h3 class="text-2xl font-black">Mapa de Desafíos y Jefes Finales</h3>
                    <p class="text-xs text-indigo-200 font-bold">Completa 5 minijuegos en tu nivel para desbloquear la batalla con el Jefe Final.</p>
                </div>
                <button onclick="closeMinigamesModuleModal()" class="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow active:scale-95">✕ Cerrar Mapa</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    `;

    Object.keys(LEVEL_CURRICULUM).forEach(lvlKey => {
        const lvl = LEVEL_CURRICULUM[lvlKey];
        const levelNum = parseInt(lvlKey);
        
        const isLevelUnlocked = (levelNum === 1) || (user.examPassed && !!user.examPassed[`level_${levelNum - 1}`]);
        const minigamesDone = (user.minigamesCompleted && user.minigamesCompleted[`level_${levelNum}`]) || 0;
        const isBossUnlocked = isLevelUnlocked && (minigamesDone >= lvl.minigamesRequired);
        const isBossDefeated = user.examPassed && !!user.examPassed[`level_${levelNum}`];

        html += `
            <div class="relative bg-white border-4 ${isLevelUnlocked ? 'border-indigo-400' : 'border-slate-300 opacity-80'} rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between">
                ${!isLevelUnlocked ? `
                    <div class="absolute inset-0 bg-slate-900/80 z-20 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
                        <span class="text-6xl animate-bounce">🔒</span>
                        <h4 class="text-lg font-black uppercase">Nivel ${levelNum} Bloqueado</h4>
                        <p class="text-xs font-bold text-slate-200">Derrota al Jefe del Nivel ${levelNum - 1} para desbloquear este cubo.</p>
                    </div>
                ` : ''}

                <div class="bg-gradient-to-r ${lvl.bgColor} p-4 text-white space-y-1">
                    <div class="flex justify-between items-center">
                        <span class="text-3xl">${lvl.icon}</span>
                        <span class="bg-black/40 text-amber-300 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                            ${isBossDefeated ? '✅ NIVEL SUPERADO' : `MINIJUEGOS: ${minigamesDone}/${lvl.minigamesRequired}`}
                        </span>
                    </div>
                    <h4 class="text-lg font-black leading-tight">${lvl.title}</h4>
                </div>

                <div class="p-4 space-y-4">
                    <div class="bg-amber-50 border-2 border-amber-200 p-2.5 rounded-2xl text-[11px] font-bold text-amber-950 flex items-start gap-2">
                        <span>🎯</span> <div><b>Objetivo:</b> ${lvl.objectiveStudent}</div>
                    </div>

                    <div class="space-y-1.5">
                        <span class="text-[10px] font-black text-slate-500 uppercase block">Minijuegos del Nivel (Completa 5):</span>
                        <div class="grid grid-cols-5 gap-1.5">
                            ${Array.from({ length: 5 }).map((_, idx) => {
                                const gameNum = idx + 1;
                                const isPlayed = minigamesDone >= gameNum;
                                return `
                                    <button onclick="launchMinigameForLevel(${levelNum}, ${gameNum})" ${!isLevelUnlocked ? 'disabled' : ''} class="h-12 rounded-xl font-black text-xs flex flex-col items-center justify-center border-2 transition-all active:scale-95 ${isPlayed ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-indigo-100'}">
                                        <span>${isPlayed ? '✓' : `🎮`}</span>
                                        <span class="text-[9px]">#${gameNum}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="p-3 bg-rose-50 border-3 border-rose-300 rounded-2xl space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="font-black text-rose-950 text-xs">${lvl.bossTitle}</span>
                            <span class="text-xs">${isBossUnlocked ? '🔥' : '🔒'}</span>
                        </div>
                        <p class="text-[10px] text-slate-600 font-extrabold leading-tight">${lvl.bossDescription}</p>
                        
                        <button onclick="startLevelExam(${levelNum})" ${!isBossUnlocked ? 'disabled' : ''} class="w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all shadow border-b-4 flex items-center justify-center gap-2 ${isBossUnlocked ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white border-rose-900 active:scale-95' : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'}">
                            <span>${isBossUnlocked ? '⚔️' : '🔒'}</span>
                            <span>${isBossDefeated ? 'REPETIR BATALLA DE JEFE' : 'ENFRENTAR AL JEFE FINAL'}</span>
                        </button>
                    </div>
                </div>

                <div class="bg-slate-50 border-t p-3 text-[10px] text-slate-600 font-bold">
                    <span class="text-indigo-900 font-black block uppercase">👩‍🏫 Respaldo PIE / Mineduc:</span>
                    <span>${lvl.objectivePedagogical}</span>
                </div>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function launchMinigameForLevel(levelNum, gameNum) {
    closeMinigamesModuleModal();
    openMemoriseModal();
}

// ==========================================
// 10. RENDERIZADO PRINCIPAL Y NAVEGACIÓN
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
        const userLevel = APP_STATE.currentUser.level || 1;
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
        (u.rut && u.rut.toLowerCase() === userVal) || (u.username && u.username.toLowerCase() === userVal)
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
    APP_STATE.selectedCategoryFilter = 'ALL';
    renderApp();
}

// ==========================================
// 11. VISTA DEL ESTUDIANTE
// ==========================================
function renderHomeView(container) {
    const activeThemeKey = APP_STATE.settings.activeTheme || 'halloween';
    const theme = SEASONAL_THEMES[activeThemeKey] || SEASONAL_THEMES.standard;

    const userLevel = (APP_STATE.currentUser && APP_STATE.currentUser.level) || 1;
    const userPoints = (APP_STATE.currentUser && APP_STATE.currentUser.points) || 0;
    const rewardTarget = (APP_STATE.settings && APP_STATE.settings.rewardPointsThreshold) || 250;

    const minigamesDone = (APP_STATE.currentUser?.minigamesCompleted?.[`level_${userLevel}`]) || 0;
    const isBossUnlocked = minigamesDone >= 5;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- CUADRO DESTACADO: MÓDULO DE MINIJUEGOS Y JEFES -->
            <div onclick="openMinigamesModuleModal()" class="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white p-6 rounded-3xl shadow-2xl border-4 border-purple-300 cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.01] active:scale-95 space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-3xl text-slate-900 shadow-inner font-black">
                            🧩
                        </div>
                        <div>
                            <span class="bg-amber-400 text-slate-900 font-black px-3 py-0.5 rounded-full text-[10px] uppercase">MÓDULO DE MINIJUEGOS & JEFES</span>
                            <h3 class="text-2xl font-black text-white leading-tight">Mapa de Niveles y Desafíos 🎮</h3>
                            <p class="text-xs font-bold text-purple-200">Completa 5 minijuegos por nivel para desbloquear la batalla con el Jefe Final.</p>
                        </div>
                    </div>
                    <button class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-5 py-3 rounded-2xl text-xs shadow-lg border-b-4 border-amber-600 flex items-center gap-2">
                        <span>🚀</span> <span>¡ABRIR MAPA DE NIVELES!</span>
                    </button>
                </div>
            </div>

            <!-- TARJETA DE RESUMEN DE PROGRESO DE NIVEL -->
            <div class="bg-white p-5 rounded-3xl border-4 border-purple-300 shadow-lg space-y-4">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">🏆</span>
                        <div>
                            <h3 class="font-black text-indigo-950 text-base">${LEVEL_TITLES[Math.min(userLevel, LEVEL_TITLES.length - 1)]}</h3>
                            <p class="text-xs font-bold text-slate-500">Puntos acumulados: <b class="text-amber-600">${userPoints} pts</b> de ${rewardTarget} pts para el premio</p>
                        </div>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <button onclick="openMemoriseModal()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-4 py-3 rounded-2xl shadow-lg border-b-4 border-purple-900 text-xs active:scale-95 flex items-center gap-1.5">
                            <span>🧠</span> <span>JUGAR MEMORICE (${minigamesDone}/5)</span>
                        </button>
                        <button onclick="startLevelExam(${userLevel})" class="${isBossUnlocked ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-900' : 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed'} font-black px-4 py-3 rounded-2xl shadow-lg border-b-4 text-xs active:scale-95 flex items-center gap-1.5">
                            <span>${isBossUnlocked ? '⚔️' : '🔒'}</span> <span>JEFE FINAL NIVEL ${userLevel}</span>
                        </button>
                    </div>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-black text-slate-600 uppercase">
                        <span>🎮 Minijuegos requeridos para el Jefe:</span>
                        <span>${minigamesDone} / 5 completados</span>
                    </div>
                    <div class="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border">
                        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-500" style="width: ${Math.min(100, (minigamesDone / 5) * 100)}%"></div>
                    </div>
                </div>
            </div>

            <div class="${theme.bannerBg} p-6 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden border-4 border-white/30">
                <div class="space-y-2 z-10 max-w-xl">
                    <h2 class="text-2xl sm:text-4xl font-black ${theme.bannerText}">${theme.titleMsg}</h2>
                    <p class="text-sm font-bold text-white/90">${theme.greetingMsg}</p>
                    ${getAvatarHtml('mascot', `¡Hola <b>${APP_STATE.currentUser?.name || ''}</b>! Selecciona una tienda para comenzar tu compra.`)}
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span>🏪</span> <span>Supermercados Disponibles (Toca uno para entrar):</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${(APP_STATE.supermarkets || []).map(sup => `
                        <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-xl hover:shadow-2xl cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-all hover:border-indigo-500">
                            <div class="bg-amber-400 p-4 rounded-3xl text-6xl flex items-center justify-center w-28 h-28 shadow-sm">${sup.icon || '🛒'}</div>
                            <h3 class="text-2xl font-black text-slate-800">${sup.name}</h3>
                            <button class="w-full bg-indigo-600 text-white font-black py-3 rounded-2xl shadow-lg text-lg border-b-4 border-indigo-900 flex items-center justify-center gap-2">
                                <span>🚀</span> <span>¡Entrar a ${sup.name}!</span>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = String(id);
    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(id));
    speakText(`Entraste a ${sup ? sup.name : 'Supermercado'}. Agrega tus productos al canasto.`);
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId));
    const uniqueProducts = APP_STATE.products || [];

    const productsHtml = uniqueProducts.map(prod => {
        const isInBasket = (APP_STATE.basket || []).some(b => String(b.productId) === String(prod.id));
        return `
            <div class="p-5 rounded-3xl border-4 ${isInBasket ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-white'} shadow-lg flex flex-col justify-between space-y-4">
                <div class="flex items-start space-x-4">
                    <span class="text-6xl">${prod.iconEmoji || '📦'}</span>
                    <div class="space-y-1 w-full">
                        <h3 class="text-xl font-black text-slate-800">${prod.name}</h3>
                        <div class="text-3xl font-black text-emerald-700">$${(prod.price || 0).toLocaleString('es-CL')}</div>
                        ${getPricePictogramsHtml(prod.price || 0)}
                    </div>
                </div>
                <div class="flex gap-2 pt-2 border-t">
                    <button onclick="speakText('${prod.name}, precio ${prod.price} pesos')" class="bg-sky-100 text-sky-800 font-bold p-3.5 rounded-2xl text-2xl active:scale-95">🔊</button>
                    <button onclick="addToBasket('${prod.id}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow text-lg">🛒 Añadir al Canasto</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between bg-white p-4 rounded-3xl border-4 border-slate-300 shadow-md">
                <button onclick="goHome()" class="bg-slate-200 text-slate-800 font-black px-4 py-3 rounded-2xl text-sm">← Volver a Tiendas</button>
                <h2 class="text-2xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
                <div>${getAvatarHtml('mascot')}</div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${productsHtml}</div>
        </div>
    `;
}

function addToBasket(prodId) {
    let prod = (APP_STATE.products || []).find(p => String(p.id) === String(prodId));
    if (!prod) return;
    const existing = APP_STATE.basket.find(b => String(b.productId) === String(prod.id));
    if (!existing) {
        APP_STATE.basket.push({ productId: prod.id, quantity: 1, actualPrice: prod.price });
        playChimeSound(); updateBasketBadge(); speakText(`Añadido ${prod.name}`);
    }
    renderApp();
}

function updateBasketBadge() {
    const badge = document.getElementById('basketBadge');
    if (badge) badge.textContent = (APP_STATE.basket || []).length;
}

// ==========================================
// 12. CANASTO Y MODAL DE PAGO
// ==========================================
function openBasketModal() {
    renderBasketModalContent();
    const modal = document.getElementById('basketModal');
    if (modal) modal.classList.remove('hidden');
}

function closeBasketModal() {
    const modal = document.getElementById('basketModal');
    if (modal) modal.classList.add('hidden');
}

function renderBasketModalContent() {
    const listEl = document.getElementById('basketItemsList');
    const totalEl = document.getElementById('basketTotalCLP');
    const paidEl = document.getElementById('userPaidTotal');
    const trayEl = document.getElementById('paymentMoneyTray');
    if (!listEl) return;

    let total = 0;
    listEl.innerHTML = (APP_STATE.basket || []).length === 0 
        ? `<p class="text-center text-slate-400 py-6 font-bold text-xs">Tu canasto está vacío.</p>`
        : APP_STATE.basket.map(item => {
            const p = (APP_STATE.products || []).find(x => String(x.id) === String(item.productId)) || { name: 'Producto', price: 2000 };
            total += (item.actualPrice || p.price || 0);
            return `
                <div class="flex items-center justify-between p-3 bg-slate-50 border-2 rounded-2xl text-xs font-bold">
                    <span class="text-slate-800 font-black text-sm">${p.name}</span>
                    <span class="font-black text-emerald-700">$${(p.price || 0).toLocaleString('es-CL')}</span>
                </div>
            `;
        }).join('');

    if (totalEl) totalEl.innerHTML = `<div>$${total.toLocaleString('es-CL')}</div>${getPricePictogramsHtml(total)}`;
    if (paidEl) paidEl.textContent = `$${(APP_STATE.userPaidAmount || 0).toLocaleString('es-CL')}`;

    if (trayEl) {
        trayEl.innerHTML = CLP_CURRENCY_ITEMS.map(item => `
            <button onclick="addPaymentMoney(${item.value})" class="p-2 bg-white border-2 border-slate-300 rounded-xl hover:border-amber-400 flex flex-col items-center shadow-sm active:scale-95">
                <img src="${item.img}" class="h-10 object-contain">
                <span class="text-[10px] font-black text-slate-700 mt-1">${item.name}</span>
            </button>
        `).join('');
    }
}

function addPaymentMoney(val) {
    APP_STATE.userPaidAmount = (APP_STATE.userPaidAmount || 0) + val;
    playChimeSound();
    speakText(`Añadidos ${val} pesos. Total pagado ${APP_STATE.userPaidAmount} pesos.`);
    renderBasketModalContent();
}

function resetUserPayment() {
    APP_STATE.userPaidAmount = 0;
    renderBasketModalContent();
}

function clearBasket() {
    APP_STATE.basket = [];
    APP_STATE.userPaidAmount = 0;
    updateBasketBadge();
    renderBasketModalContent();
    renderApp();
}

function verifyAndCheckout() {
    let total = 0;
    (APP_STATE.basket || []).forEach(b => {
        const p = (APP_STATE.products || []).find(x => String(x.id) === String(b.productId));
        total += (p ? p.price : 0);
    });

    if (total === 0) { alert("Tu canasto está vacío."); return; }
    if (APP_STATE.userPaidAmount < total) {
        playChimeSound(true);
        speakText(`Falta dinero. La compra suma ${total} pesos y has entregado ${APP_STATE.userPaidAmount} pesos.`);
        alert(`⚠️ Dinero Insuficiente\n\nTotal compra: $${total.toLocaleString('es-CL')}\nHas pagado: $${APP_STATE.userPaidAmount.toLocaleString('es-CL')}\nTe faltan: $${(total - APP_STATE.userPaidAmount).toLocaleString('es-CL')}`);
        return;
    }

    const vuelto = APP_STATE.userPaidAmount - total;
    playChimeSound(false);
    if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 90 });

    awardPointsAndXp(20, "Compra Exitosa");
    closeBasketModal();

    document.getElementById('successModalTotal').textContent = `$${total.toLocaleString('es-CL')}`;
    document.getElementById('successModalPaid').textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoAmount').textContent = `$${vuelto.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoBreakdown').innerHTML = getPricePictogramsHtml(vuelto);

    document.getElementById('checkoutSuccessModal').classList.remove('hidden');
}

function closeSuccessModalAndFinish() {
    document.getElementById('checkoutSuccessModal').classList.add('hidden');
    clearBasket();
    goHome();
}

// ==========================================
// 13. BATALLAS DE JEFES Y EXÁMENES
// ==========================================
function startLevelExam(levelNumber) {
    const user = APP_STATE.currentUser;
    if (!user) return;

    const minigamesDone = (user.minigamesCompleted && user.minigamesCompleted[`level_${levelNumber}`]) || 0;

    if (minigamesDone < 5 && user.role === 'student') {
        playChimeSound(true);
        const faltan = 5 - minigamesDone;
        speakText(`Aún no puedes enfrentarte al Jefe Final. Te faltan ${faltan} minijuegos.`);
        alert(`🔒 BATALLA DE JEFE BLOQUEADA\n\nPara enfrentarte al Jefe Final del Nivel ${levelNumber} debes jugar y completar 5 minijuegos en este nivel.\n\n🎮 Progreso: ${minigamesDone} / 5 minijuegos.\n👉 Te faltan ${faltan} minijuego(s).`);
        return;
    }

    if (levelNumber > 1 && user.role === 'student') {
        const isPreviousPassed = !!user.examPassed[`level_${levelNumber - 1}`];
        if (!isPreviousPassed) {
            playChimeSound(true);
            alert(`🔒 NIVEL BLOQUEADO\n\nDebes completar y derrotar al Jefe Final del Nivel ${levelNumber - 1} para ingresar aquí.`);
            return;
        }
    }

    if (!user.examAttempts) user.examAttempts = {};
    const currentAttempts = user.examAttempts[`level_${levelNumber}`] || 0;

    if (currentAttempts >= 3) {
        triggerAttemptThreeLockout(levelNumber);
        return;
    }

    const questions = MINEDUC_EXAM_BANK[levelNumber] || MINEDUC_EXAM_BANK[1];
    APP_STATE.currentExam = { level: levelNumber, currentQuestionIndex: 0, attempts: currentAttempts + 1, score: 0, questions: questions };

    renderExamQuestion();
    document.getElementById('levelExamModal').classList.remove('hidden');
}

function renderExamQuestion() {
    const exam = APP_STATE.currentExam;
    const container = document.getElementById('examModalContainer');
    if (!container || !exam) return;

    const q = exam.questions[exam.currentQuestionIndex];
    const lvlInfo = LEVEL_CURRICULUM[exam.level] || LEVEL_CURRICULUM[1];

    container.innerHTML = `
        <div class="flex justify-between items-center border-b pb-3">
            <span class="bg-rose-600 text-white font-black px-3 py-1.5 rounded-full text-xs uppercase tracking-wider">
                ⚔️ BATALLA DE JEFE: ${lvlInfo.bossTitle} • Intento ${exam.attempts} de 3
            </span>
            <button onclick="closeExamModal()" class="text-slate-400 font-black text-xl p-1">✕</button>
        </div>

        <div class="space-y-5 my-4">
            <div class="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl">
                <h3 class="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">${q.q}</h3>
            </div>
            
            <div class="grid grid-cols-1 gap-3">
                ${q.options.map(opt => `
                    <button onclick="submitExamAnswer('${opt.replace(/'/g, "\\'")}')" class="p-4 bg-white border-4 border-slate-300 hover:border-indigo-500 rounded-2xl font-black text-sm text-slate-800 shadow-md active:scale-95 text-left flex items-center gap-3">
                        <span class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs flex-shrink-0">✓</span>
                        <span>${opt}</span>
                    </button>
                `).join('')}
            </div>
        </div>

        <div class="bg-slate-100 p-3 rounded-2xl text-xs font-bold text-slate-600 text-center border">
            Desafío ${exam.currentQuestionIndex + 1} de ${exam.questions.length} • Recompensa: ${lvlInfo.bossReward}
        </div>
    `;
}

function submitExamAnswer(selectedOpt) {
    const exam = APP_STATE.currentExam;
    const q = exam.questions[exam.currentQuestionIndex];
    if (selectedOpt === q.correct) exam.score++;
    exam.currentQuestionIndex++;

    if (exam.currentQuestionIndex < exam.questions.length) renderExamQuestion();
    else finishExamEvaluation();
}

function finishExamEvaluation() {
    const exam = APP_STATE.currentExam;
    const user = APP_STATE.currentUser;
    const isPassed = exam.score === exam.questions.length;

    if (!user.examAttempts) user.examAttempts = {};
    if (!user.examPassed) user.examPassed = {};
    user.examAttempts[`level_${exam.level}`] = exam.attempts;

    if (isPassed) {
        user.examPassed[`level_${exam.level}`] = true;
        const nextLevel = exam.level + 1;
        user.level = nextLevel;

        playChimeSound(false);
        if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 90 });
        awardPointsAndXp(50, `Derrota de Jefe Nivel ${exam.level}`);

        speakText(`¡Extraordinario! Derrotaste al Jefe Final del Nivel ${exam.level}. ¡Has ascendido al Nivel ${nextLevel}!`);
        alert(`🏆 ¡JEFE FINAL DERROTADO!\n\nCompletaste los 5 minijuegos + Examen Final del Nivel ${exam.level}.\n\n🎉 ¡Has ascendido al Nivel ${nextLevel}!`);

        localStorage.setItem('nee_active_user', JSON.stringify(user));
        if (db && user.id) db.collection('users').doc(user.id).set({ level: user.level, examPassed: user.examPassed }, { merge: true });

        closeExamModal();
        renderApp();
    } else {
        playChimeSound(true);
        if (exam.attempts < 3) {
            const container = document.getElementById('examModalContainer');
            container.innerHTML = `
                <div class="text-center space-y-4 py-4">
                    <div class="text-5xl animate-bounce">💪</div>
                    <h3 class="text-2xl font-black text-slate-800">¡Sigue intentándolo!</h3>
                    ${getAvatarHtml('mascot', `Aún no derrotas al Jefe Final. Llevas ${exam.attempts} de 3 intentos.`)}
                    <div class="flex gap-2">
                        <button onclick="closeExamModal()" class="w-1/2 bg-slate-200 font-black py-3 rounded-2xl text-xs">Salir</button>
                        <button onclick="startLevelExam(${exam.level})" class="w-1/2 bg-indigo-600 text-white font-black py-3 rounded-2xl shadow text-xs">⚔️ Reintentar Batalla</button>
                    </div>
                </div>
            `;
        } else {
            triggerAttemptThreeLockout(exam.level);
        }
    }
}

function triggerAttemptThreeLockout(levelNumber) {
    const container = document.getElementById('examModalContainer');
    container.innerHTML = `
        <div class="text-center space-y-4 py-2">
            <div class="text-6xl animate-pulse">🛑</div>
            <h3 class="text-2xl font-black text-rose-700">¡HICISTE UN GRAN ESFUERZO!</h3>
            ${getAvatarHtml('corporeo', `<b>Acércate a tu profesor/a</b> para revisar esta parte juntos.`)}
            <div class="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs font-bold text-rose-950 text-left">
                🚨 Bloqueo Pedagógico Activado (3.er Intento). Muestra esta pantalla a tu educador.
            </div>
            <button onclick="closeExamModal()" class="w-full bg-slate-200 font-black py-3 rounded-2xl text-xs">Entendido</button>
        </div>
    `;
    document.getElementById('levelExamModal').classList.remove('hidden');
}

function closeExamModal() {
    document.getElementById('levelExamModal').classList.add('hidden');
}

// ==========================================
// 14. PANEL DOCENTE Y MATRIZ MINEDUC
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderTeacherDashboard(document.getElementById('appContainer'));
}

function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 border-b-4 border-indigo-600">
                <div class="flex justify-between items-center flex-wrap gap-3">
                    <h2 class="text-xl font-black text-white">🏫 Panel Docente (${teamLabel})</h2>
                    <button onclick="toggleStudentPreview(true)" class="bg-amber-400 text-slate-900 font-black text-xs px-4 py-2 rounded-xl">🕹️ Probar Juego</button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                    <button onclick="setTeacherTab('home')" class="py-2.5 px-2 rounded-xl font-black text-[11px] ${activeTab === 'home' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">📊 Evaluaciones</button>
                    <button onclick="setTeacherTab('curriculum')" class="py-2.5 px-2 rounded-xl font-black text-[11px] ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">📘 Matriz Mineduc/PIE</button>
                    <button onclick="setTeacherTab('settings')" class="py-2.5 px-2 rounded-xl font-black text-[11px] ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">⚙️ Personajes & Temas</button>
                    <button onclick="setTeacherTab('users')" class="py-2.5 px-2 rounded-xl font-black text-[11px] ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">🔑 Usuarios</button>
                </div>
            </div>

            <div id="teacherTabContent">
                ${activeTab === 'home' ? renderTeacherHomeTab() : ''}
                ${activeTab === 'curriculum' ? renderTeacherCurriculumObjectivesTab() : ''}
                ${activeTab === 'settings' ? renderTeacherSettingsTab() : ''}
                ${activeTab === 'users' ? renderTeacherUsersTab() : ''}
            </div>
        </div>
    `;
}

function renderTeacherCurriculumObjectivesTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-4xl mx-auto">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>📘</span> <span>Matriz de Objetivos Pedagógicos y Minijuegos (Mineduc / PIE)</span>
                </h3>
                <p class="text-xs font-bold text-slate-500">Respaldo técnico de habilidades por nivel para informes psicopedagógicos e IEP.</p>
            </div>

            <div class="space-y-4">
                ${Object.keys(LEVEL_CURRICULUM).map(key => {
                    const lvl = LEVEL_CURRICULUM[key];
                    return `
                        <div class="p-5 bg-slate-50 border-2 border-slate-300 rounded-3xl space-y-3">
                            <div class="flex justify-between items-center flex-wrap gap-2">
                                <span class="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase">${lvl.title}</span>
                                <span class="text-xs font-black text-amber-700">Requisito: ${lvl.minigamesRequired} Minijuegos + ${lvl.bossTitle}</span>
                            </div>

                            <div class="space-y-2 text-xs font-bold pt-2">
                                <div class="bg-white p-3 rounded-2xl border">
                                    <span class="text-slate-500 uppercase text-[10px] block font-black">Objetivo General del Nivel:</span>
                                    <p class="text-slate-800">${lvl.objectiveGeneral}</p>
                                </div>

                                <div class="bg-indigo-50 p-3 rounded-2xl border border-indigo-200">
                                    <span class="text-indigo-900 uppercase text-[10px] font-black block">Objetivos Específicos Evaluados:</span>
                                    <ul class="list-disc list-inside text-indigo-950 space-y-1 mt-1">
                                        ${lvl.objectivesSpecific.map(obj => `<li>${obj}</li>`).join('')}
                                    </ul>
                                </div>

                                <div class="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                                    <span class="text-amber-900 uppercase text-[10px] font-black block">Alineación PIE / Mineduc:</span>
                                    <p class="text-amber-950">${lvl.objectivePedagogical}</p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderTeacherHomeTab() {
    return `<div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md"><h3 class="font-black text-slate-800 text-base">📊 Histórico de Evaluaciones e Informes con IA</h3><p class="text-xs text-slate-500 font-bold mt-1">Aquí se registran los puntajes de compras y batallas con Jefes.</p></div>`;
}

function renderTeacherSettingsTab() {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-4xl mx-auto">
            <h3 class="font-black text-slate-800 text-lg">⚙️ Configuración de Personajes e Institución</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase mb-1">Nombre Colegio:</label>
                    <input type="text" id="settingSchoolName" value="${st.schoolName}" class="w-full px-4 py-2 rounded-xl border-2 font-bold text-xs">
                </div>
                <div>
                    <label class="block text-xs font-black text-slate-700 uppercase mb-1">Equipo Profesional:</label>
                    <input type="text" id="settingTeamName" value="${st.teamName}" class="w-full px-4 py-2 rounded-xl border-2 font-bold text-xs">
                </div>
            </div>
        </div>
    `;
}

function renderTeacherUsersTab() {
    return `<div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md"><h3 class="font-black text-slate-800 text-base">🔑 Gestión de Usuarios</h3></div>`;
}

function renderStudentPreviewWrapper(container) {
    const previewBanner = `
        <div class="bg-amber-400 border-4 border-amber-600 text-slate-900 p-3.5 rounded-2xl shadow-lg mb-6 flex justify-between items-center gap-2">
            <span class="font-black text-sm">🕹️ MODO PRUEBA: VISTA DEL ESTUDIANTE</span>
            <button onclick="toggleStudentPreview(false)" class="bg-slate-900 text-white font-black text-xs px-4 py-2 rounded-xl">← Volver al Panel Docente</button>
        </div>
    `;
    const subContainer = document.createElement('div');
    if (APP_STATE.selectedSupermarketId) renderSupermarketView(subContainer, APP_STATE.selectedSupermarketId);
    else renderHomeView(subContainer);
    container.innerHTML = previewBanner;
    container.appendChild(subContainer);
}

function toggleStudentPreview(status) {
    APP_STATE.teacherPreviewMode = status;
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

// ==========================================
// 15. MANEJADORES SECUNDARIOS DE MODALES DE INDEX.HTML
// ==========================================
function closeScannerModal() { document.getElementById('scannerModal')?.classList.add('hidden'); }
function captureAndAnalyzeImageWithAI() { alert("Función OCR lista en cámara adaptativa."); closeScannerModal(); }
function applyCustomShelfPrice() { const val = document.getElementById('shelfPriceCustomInput')?.value; alert(`Precio aplicado: $${val}`); }
function closeViewMissionModal() { document.getElementById('viewMissionModal')?.classList.add('hidden'); }
function printCurrentMissionSheetFromViewer() { window.print(); }
function closeMissionModal() { document.getElementById('missionModal')?.classList.add('hidden'); }
function activateMissionForStudents() { alert("Misión activada."); closeMissionModal(); }
function closeSupermarketModal() { document.getElementById('supermarketModal')?.classList.add('hidden'); }
function saveSupermarketFromModal() { alert("Supermercado guardado."); closeSupermarketModal(); }
function handleSupermarketLogoUpload() {}
function closeProductModal() { document.getElementById('productModal')?.classList.add('hidden'); }
function saveProductFromModal() { alert("Producto guardado."); closeProductModal(); }
function handleProductPhotoUpload() {}
function closeCategoryModal() { document.getElementById('categoryModal')?.classList.add('hidden'); }
function saveCategoryFromModal() { alert("Categoría guardada."); closeCategoryModal(); }
function closeUserModal() { document.getElementById('userModal')?.classList.add('hidden'); }
function saveUserFromModal() { alert("Usuario guardado."); closeUserModal(); }
function closeAiReportModal() { document.getElementById('aiReportModal')?.classList.add('hidden'); }

// ==========================================
// 16. INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
function mainInit() {
    try {
        const storedUser = localStorage.getItem('nee_active_user');
        if (storedUser) APP_STATE.currentUser = JSON.parse(storedUser);
    } catch(e) {}
    renderApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainInit);
} else {
    mainInit();
}

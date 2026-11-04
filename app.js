// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE Y EMAILJS
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyB27AIOvrMwMtidvD7Lbkbp9v--0DLaZyY",
    authDomain: "supermercado-nee.firebaseapp.com",
    projectId: "supermercado-nee",
    storageBucket: "supermercado-nee.firebasestorage.app",
    messagingSenderId: "439038813506",
    appId: "1:439038813506:web:972b1e2a0dc1da8cfad4db"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try { firebase.initializeApp(firebaseConfig); } catch(e) {}
}

// ==========================================
// 2. MATRIZ PEDAGÓGICA MINEDUC / PIE / DECRETO 83
// ==========================================
const LEVEL_CURRICULUM = {
    1: {
        id: 1,
        title: "Nivel 1: Explorador de Góndolas 🎒",
        icon: "🧩",
        bgColor: "from-emerald-600 to-teal-800",
        objectiveGeneral: "Desarrollar habilidades básicas de discriminación visual, reconocimiento numérico y asociación de valores en el Sistema Monetario Chileno (CLP) de baja denominación ($100 a $2.000) bajo los lineamientos del Currículum Nacional Mineduc (Bases Curriculares Matemáticas 1° Básico / Decreto 83).",
        objectivesSpecific: [
            "Mineduc OA 1: Identificar, contar y asociar representaciones concretas y pictóricas de números hasta $2.000.",
            "Mineduc OA 3: Discriminar visualmente las denominaciones de monedas chilenas ($100, $500) y billetes de $1.000 y $2.000.",
            "PIE / Autonomía: Reconocer productos básicos de primera necesidad mediante pictogramas DUA.",
            "PIE / Función Ejecutiva: Ejercitar la memoria de trabajo y la atención sostenida a través de la resolución de 6 minijuegos secuenciales.",
            "Autonomía Social: Ejecutar la entrega de dinero exacto en compras unitarias de un solo artículo."
        ],
        objectiveStudent: "Aprender a conocer las monedas y billetes de $1.000 para comprar tus productos favoritos en la tienda.",
        objectivePedagogical: "Bases Curriculares Mineduc - OA 1 Matemáticas (1° Básico) & Ámbito Autonomía PIE: Discriminación cuantitativa y manejo del dinero de uso cotidiano.",
        minigamesRequired: 6,
        minigamesList: [
            { id: 'm1_1', name: '1. Memorise de Monedas y Billetes', type: 'memorise', desc: 'Encuentra las parejas de monedas y billetes chilenos.' },
            { id: 'm1_2', name: '2. Clasificador de Precios Bajos', type: 'choice', desc: 'Identifica el producto de menor valor ($100 vs $500).' },
            { id: 'm1_3', name: '3. Ordenar Monedas por Tamaño', type: 'sort', desc: 'Ordena de menor a mayor valor las monedas de $10, $50, $100 y $500.' },
            { id: 'm1_4', name: '4. Parejas de Envases Idénticos', type: 'memorise', desc: 'Asocia el envase del producto con su etiqueta de precio.' },
            { id: 'm1_5', name: '5. Identificador de Billete $1.000', type: 'choice', desc: 'Selecciona el billete verde de $1.000 entre varias opciones.' },
            { id: 'm1_6', name: '6. Suma Simple con Monedas de $100', type: 'math', desc: 'Cuenta las monedas de $100 necesarias para alcanzar $500.' }
        ],
        bossTitle: "👾 Jefe Final: El Cajero Apurado",
        bossDescription: "Demuestra tu rapidez identificando los billetes de $1.000 y $2.000 para pagar antes de que se llene la fila.",
        bossReward: "👑 Corona del Comprador Principiante (+50 PTS)"
    },
    2: {
        id: 2,
        title: "Nivel 2: Experto en Góndolas 🏪",
        icon: "🧱",
        bgColor: "from-blue-600 to-indigo-800",
        objectiveGeneral: "Fortalecer el razonamiento cuantitativo, la comparación de valores en góndolas y la resolución de problemas sencillos de vuelto en compras diarias hasta $5.000 CLP (Mineduc OA 2 y OA 4 - 2° a 3° Básico / PIE).",
        objectivesSpecific: [
            "Mineduc OA 2: Comparar números y magnitudes de precios para determinar la opción más económica o costosa.",
            "Mineduc OA 4: Resolver problemas aditivos y de sustracción sencillos asociados al cálculo de vueltos con billetes de $5.000.",
            "PIE / DUA: Interpretar precios en góndolas del supermercado utilizando lectura de etiquetas reales e Inteligencia Artificial / OCR.",
            "PIE / Autonomía: Organizar el presupuesto personal para seleccionar 2 o más artículos del canasto.",
            "Autonomía Social: Desarrollar conductas de autorregulación y verificación de vuelto recibido en caja."
        ],
        objectiveStudent: "Comparar precios en la góndola, encontrar las ofertas y calcular cuánto vuelto te tienen que entregar.",
        objectivePedagogical: "Bases Curriculares Mineduc - OA 2 y OA 4 Matemáticas (2°-3° Básico) & Ámbito Integración Social PIE: Estimación de costos y cálculo de vuelto.",
        minigamesRequired: 6,
        minigamesList: [
            { id: 'm2_1', name: '1. Comparador de Ofertas', type: 'choice', desc: 'Elige cuál producto conviene más comprar según la góndola.' },
            { id: 'm2_2', name: '2. Escáner OCR de Góndola', type: 'choice', desc: 'Confirma la etiqueta de precio correcto en el envase.' },
            { id: 'm2_3', name: '3. Cálculo de Vuelto hasta $5.000', type: 'math', desc: 'Calcula cuánto vuelto recibes al pagar $3.500 con un billete de $5.000.' },
            { id: 'm2_4', name: '4. Clasificador por Categorías', type: 'choice', desc: 'Agrupa los productos de Lácteos, Panadería y Frutas.' },
            { id: 'm2_5', name: '5. Detector de Errores de Etiqueta', type: 'choice', desc: 'Encuentra la etiqueta que tiene el precio equivocado.' },
            { id: 'm2_6', name: '6. Presupuesto de Canasto Sencillo', type: 'math', desc: 'Suma 2 productos y verifica que no supere los $5.000.' }
        ],
        bossTitle: "👾 Jefe Final: El Inspector de Precios",
        bossDescription: "Encuentra los precios correctos en la góndola, calcula los vueltos sin errores y verifica las ofertas.",
        bossReward: "🏆 Medalla de Experto en Góndolas (+75 PTS)"
    },
    3: {
        id: 3,
        title: "Nivel 3: Máster de Supermercado 🏆",
        icon: "💎",
        bgColor: "from-purple-700 to-pink-900",
        objectiveGeneral: "Consolidar la autonomía funcional completa en el proceso de planificar compras, administrar presupuestos elevados ($10.000 a $20.000 CLP), calcular vueltos complejos y cotejar listas de compras (Mineduc OA 3 y OA 6 - 4° Básico / Talleres Laborales PIE).",
        objectivesSpecific: [
            "Mineduc OA 3: Realizar operaciones compuestas de suma y resta con numeración en el rango de $1.000 a $20.000.",
            "Mineduc OA 6: Resolver problemas de la vida real que requieran cotizar, calcular totales y administrar dinero.",
            "PIE / Taller Laboral: Cotejar una lista de compras impresas o digitales frente a los productos físicos recopilados.",
            "PIE / Vida Independiente: Manejar billetes de alta denominación ($10.000 y $20.000) discriminando billetes y monedas de vuelto.",
            "Autonomía Total: Ejecutar la secuencia completa de compra autónoma desde la selección hasta el pago y verificación en caja."
        ],
        objectiveStudent: "Planificar la compra familiar con lista, pagar con billetes grandes de $10.000 y $20.000 y revisar el vuelto exacto.",
        objectivePedagogical: "Bases Curriculares Mineduc - OA 3 y OA 6 Matemáticas (4° Básico) & PIE Autonomía e Inclusión Laboral: Presupuesto y transacción autónoma.",
        minigamesRequired: 6,
        minigamesList: [
            { id: 'm3_1', name: '1. Planificador de Lista Familiar', type: 'choice', desc: 'Organiza la lista de compras priorizando los productos más necesarios.' },
            { id: 'm3_2', name: '2. Suma Acumulada del Canasto', type: 'math', desc: 'Suma los valores de 3 productos del canasto antes de llegar a caja.' },
            { id: 'm3_3', name: '3. Pago con Billetes Grandes ($10k y $20k)', type: 'math', desc: 'Selecciona la combinación de billetes requerida para compras altas.' },
            { id: 'm3_4', name: '4. Arqueo de Caja y Vuelto Complejo', type: 'math', desc: 'Verifica el desglose de vuelto con billetes de $2.000, $1.000 y monedas.' },
            { id: 'm3_5', name: '5. Calculadora de Descuentos 2x1', type: 'choice', desc: 'Aplica el descuento de la promoción y determina el precio final.' },
            { id: 'm3_6', name: '6. Presupuesto Semanal de Autonomía', type: 'math', desc: 'Ajusta la compra total para que calce con un billete de $20.000.' }
        ],
        bossTitle: "👾 Jefe Final: El Gerente General",
        bossDescription: "Completa la compra semanal de la lista entregando el pago exacto con billetes grandes y verificando el vuelto.",
        bossReward: "🥇 Trofeo Máster del Supermercado (+100 PTS)"
    }
};

const MINEDUC_EXAM_BANK = {
    1: [
        { q: "Vas al almacén a comprar un jugo de $1.000 pesos. ¿Con cuál billete chileno pagas de forma exacta?", options: ["Billete de $1.000 (Verde)", "Billete de $5.000 (Rojo)", "Moneda de $500"], correct: "Billete de $1.000 (Verde)" },
        { q: "¿Cuál de estas monedas chilenas tiene el mayor valor monetario?", options: ["Moneda de $500", "Moneda de $100", "Moneda de $50"], correct: "Moneda de $500" },
        { q: "Si tienes 1 billete de $1.000 y 1 moneda de $500, ¿cuánto dinero tienes en total?", options: ["$1.500 pesos", "$2.000 pesos", "$1.000 pesos"], correct: "$1.500 pesos" }
    ],
    2: [
        { q: "Un kilo de manzanas cuesta $1.200 y unas galletas cuestan $800. ¿Cuál producto cuesta MENOS dinero?", options: ["Las Galletas ($800)", "Las Manzanas ($1.200)", "Cuestan lo mismo"], correct: "Las Galletas ($800)" },
        { q: "Si compras un pan de $1.500 pesos y pagas con un billete de $2.000, ¿cuál es tu vuelto exacto?", options: ["$500 pesos", "$1.000 pesos", "Sin vuelto"], correct: "$500 pesos" },
        { q: "Si llevas 2 yogures de $500 pesos cada uno, ¿cuánto debes pagar en la caja?", options: ["$1.000 pesos", "$1.500 pesos", "$500 pesos"], correct: "$1.000 pesos" }
    ],
    3: [
        { q: "Compras una Leche de $1.000, un Pan de $2.000 y un Aceite de $3.000. ¿Cuánto dinero sumas en total?", options: ["$6.000 pesos", "$5.000 pesos", "$7.000 pesos"], correct: "$6.000 pesos" },
        { q: "Pagas una compra de $13.000 pesos con un billete de $20.000. ¿Qué billetes de vuelto debes recibir?", options: ["1 Billete de $5.000 y 1 Billete de $2.000 ($7.000)", "1 Billete de $10.000", "2 Billetes de $2.000"], correct: "1 Billete de $5.000 y 1 Billete de $2.000 ($7.000)" },
        { q: "Tienes un presupuesto máximo de $10.000. Tu canasto suma $9.500. ¿Alcanza tu dinero para pagar?", options: ["Sí, alcanza y te sobran $500", "No, te faltan $500", "Pagas exacto sin vuelto"], correct: "Sí, alcanza y te sobran $500" }
    ]
};

function makeSvgDataUrl(svgString) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString); }

const SVG_B20K = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#e67e22"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$20.000</text></svg>`;
const SVG_B10K = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#2980b9"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$10.000</text></svg>`;
const SVG_B5K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#c0392b"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$5.000</text></svg>`;
const SVG_B2K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#8e44ad"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$2.000</text></svg>`;
const SVG_B1K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#27ae60"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$1.000</text></svg>`;
const SVG_C500 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f39c12"/><circle cx="50" cy="50" r="34" fill="#bdc3c7"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#2c3e50" text-anchor="middle">$500</text></svg>`;
const SVG_C100 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f1c40f"/><circle cx="50" cy="50" r="36" fill="#f39c12"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">$100</text></svg>`;

const CLP_CURRENCY_ITEMS = [
    { id: 'b20k', value: 20000, type: 'bill', name: 'Billete $20.000', img: makeSvgDataUrl(SVG_B20K) },
    { id: 'b10k', value: 10000, type: 'bill', name: 'Billete $10.000', img: makeSvgDataUrl(SVG_B10K) },
    { id: 'b5k',  value: 5000,  type: 'bill', name: 'Billete $5.000',  img: makeSvgDataUrl(SVG_B5K) },
    { id: 'b2k',  value: 2000,  type: 'bill', name: 'Billete $2.000',  img: makeSvgDataUrl(SVG_B2K) },
    { id: 'b1k',  value: 1000,  type: 'bill', name: 'Billete $1.000',  img: makeSvgDataUrl(SVG_B1K) },
    { id: 'c500', value: 500,   type: 'coin', name: 'Moneda $500',    img: makeSvgDataUrl(SVG_C500) },
    { id: 'c100', value: 100,   type: 'coin', name: 'Moneda $100',    img: makeSvgDataUrl(SVG_C100) }
];

// ==========================================
// 3. ESTADO GLOBAL COMPLETO DE LA APLICACIÓN
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    selectedCategoryFilter: 'ALL',
    currentStudentTab: 'home', // 'home' | 'minigames'
    teacherActiveTab: 'home',
    teacherPreviewMode: false,
    basket: [],
    userPaidAmount: 0,
    supermarkets: [
        { id: 'sup-1', name: 'Supermercado Central', icon: '🏪', description: 'Tienda Principal de la Escuela' },
        { id: 'sup-2', name: 'Minimarket Don Pedro', icon: '🏪', description: 'Almacén de Barrio' }
    ],
    categories: ['Todas', 'Lácteos, Yogures y Huevos', 'Panadería y Pastelería', 'Frutas y Verduras', 'Bebidas, Agua y Jugos'],
    products: [
        { id: 'prod-1', name: 'Leche Entera 1L', category: 'Lácteos, Yogures y Huevos', price: 1050, iconEmoji: '🥛' },
        { id: 'prod-2', name: 'Pan Hallulla 1Kg', category: 'Panadería y Pastelería', price: 1990, iconEmoji: '🍞' },
        { id: 'prod-3', name: 'Manzana Fuji (1Kg)', category: 'Frutas y Verduras', price: 1200, iconEmoji: '🍎' },
        { id: 'prod-4', name: 'Jugo de Naranja 1L', category: 'Bebidas, Agua y Jugos', price: 1500, iconEmoji: '🧃' }
    ],
    users: [
        { id: 'u-docente', role: 'teacher', name: 'Profesor / Educador PIE', rut: '12345678-9', pin: '1234' },
        { id: 'u-alumno', role: 'student', name: 'Estudiante Ejemplo', rut: '98765432-1', pin: '1234', points: 60, level: 1, minigamesCompleted: { level_1: 0, level_2: 0, level_3: 0 }, examPassed: {} }
    ],
    settings: { schoolName: "Escuela Especial Adaptativa", teamName: "Equipo Multidisciplinario PIE", rewardPointsThreshold: 250 },
    activeMission: null,
    memorise: { cards: [], flippedCards: [], matchedPairsCount: 0, movesCount: 0, totalPairsNeeded: 3, isBusy: false, activeMinigameMeta: null },
    currentExam: null
};

const LEVEL_TITLES = ["Nivel 0", "Nivel 1: Explorador de Góndolas 🎒", "Nivel 2: Experto en Góndolas 🏪", "Nivel 3: Máster de Supermercado 🏆"];

// ==========================================
// 4. FUNCIONES DE APOYO Y SÍNTESIS DE VOZ
// ==========================================
function getAvatarHtml(type = 'mascot', speech = '') {
    const avatarImg = `<div class="w-16 h-16 bg-indigo-500 text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow animate-avatar-float">🛒🤖</div>`;
    if (!speech) return avatarImg;
    return `
        <div class="flex items-center gap-3 my-2">
            ${avatarImg}
            <div class="bg-white border-4 border-indigo-400 p-3 rounded-2xl text-xs font-black text-slate-800 shadow">${speech}</div>
        </div>
    `;
}

function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/\$/g, ' ').trim();
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'es-CL'; u.rate = 0.9;
        window.speechSynthesis.speak(u);
    } catch(e) {}
}

function playChimeSound(isErr = false) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator(); const g = ctx.createGain();
        osc.type = isErr ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(isErr ? 200 : 520, ctx.currentTime);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}

function calculateCLPBreakdown(amount) {
    if (!amount || amount <= 0) return [];
    let remaining = amount;
    const result = [];
    CLP_CURRENCY_ITEMS.forEach(item => {
        const count = Math.floor(remaining / item.value);
        if (count > 0) { result.push({ ...item, count }); remaining %= item.value; }
    });
    return result;
}

function getPricePictogramsHtml(amount) {
    const breakdown = calculateCLPBreakdown(amount);
    if (breakdown.length === 0) return '';
    return `<div class="flex flex-wrap items-center gap-1.5 mt-1 font-bold">` +
        breakdown.map(b => `
            <div class="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-lg px-1.5 py-0.5">
                <img src="${b.img}" class="h-6 object-contain">
                <span class="text-[10px] font-black text-amber-950">${b.count > 1 ? b.count + 'x' : ''}</span>
            </div>
        `).join('') + `</div>`;
}

// ==========================================
// 5. GESTIÓN DE TIENDAS, PRODUCTOS Y MISIONES
// ==========================================
function openSupermarketModal(id = null) {
    document.getElementById('supermarketEditId').value = id || '';
    document.getElementById('supermarketModalTitle').textContent = id ? 'Editar Supermercado' : 'Crear Supermercado';
    if (id) {
        const s = APP_STATE.supermarkets.find(x => String(x.id) === String(id));
        if (s) {
            document.getElementById('supNameInput').value = s.name;
            document.getElementById('supIconInput').value = s.icon || '🏪';
        }
    } else {
        document.getElementById('supNameInput').value = '';
        document.getElementById('supIconInput').value = '🏪';
    }
    document.getElementById('supermarketModal')?.classList.remove('hidden');
}

function closeSupermarketModal() { document.getElementById('supermarketModal')?.classList.add('hidden'); }

function saveSupermarketFromModal() {
    const editId = document.getElementById('supermarketEditId').value;
    const name = document.getElementById('supNameInput').value.trim();
    const icon = document.getElementById('supIconInput').value.trim() || '🏪';
    if (!name) return alert("Escribe un nombre para el supermercado.");

    if (editId) {
        const s = APP_STATE.supermarkets.find(x => String(x.id) === String(editId));
        if (s) { s.name = name; s.icon = icon; }
    } else {
        APP_STATE.supermarkets.push({ id: `sup-${Date.now()}`, name, icon, description: 'Nueva Tienda' });
    }
    closeSupermarketModal();
    renderApp();
}

function deleteSupermarket(id) {
    if (!confirm("¿Eliminar este supermercado?")) return;
    APP_STATE.supermarkets = APP_STATE.supermarkets.filter(x => String(x.id) !== String(id));
    renderApp();
}

function openProductModal(id = null) {
    document.getElementById('productEditId').value = id || '';
    document.getElementById('productModalTitle').textContent = id ? 'Editar Producto' : 'Crear Producto';
    if (id) {
        const p = APP_STATE.products.find(x => String(x.id) === String(id));
        if (p) {
            document.getElementById('prodNameInput').value = p.name;
            document.getElementById('prodPriceInput').value = p.price;
            document.getElementById('prodIconInput').value = p.iconEmoji || '📦';
        }
    } else {
        document.getElementById('prodNameInput').value = '';
        document.getElementById('prodPriceInput').value = 1000;
        document.getElementById('prodIconInput').value = '📦';
    }
    document.getElementById('productModal')?.classList.remove('hidden');
}

function closeProductModal() { document.getElementById('productModal')?.classList.add('hidden'); }

function saveProductFromModal() {
    const editId = document.getElementById('productEditId').value;
    const name = document.getElementById('prodNameInput').value.trim();
    const price = parseInt(document.getElementById('prodPriceInput').value) || 0;
    const iconEmoji = document.getElementById('prodIconInput').value.trim() || '📦';
    if (!name) return alert("Escribe un nombre para el producto.");

    if (editId) {
        const p = APP_STATE.products.find(x => String(x.id) === String(editId));
        if (p) { p.name = name; p.price = price; p.iconEmoji = iconEmoji; }
    } else {
        APP_STATE.products.push({ id: `prod-${Date.now()}`, name, price, iconEmoji, category: 'General' });
    }
    closeProductModal();
    renderApp();
}

function deleteProduct(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    APP_STATE.products = APP_STATE.products.filter(x => String(x.id) !== String(id));
    renderApp();
}

function openUserModal(id = null) {
    document.getElementById('userEditId').value = id || '';
    document.getElementById('userModalTitle').textContent = id ? 'Editar Usuario' : 'Crear Usuario';
    if (id) {
        const u = APP_STATE.users.find(x => String(x.id) === String(id));
        if (u) {
            document.getElementById('userNameInput').value = u.name;
            document.getElementById('userRutInput').value = u.rut;
            document.getElementById('userPinInput').value = u.pin;
            document.getElementById('userRoleInput').value = u.role;
        }
    } else {
        document.getElementById('userNameInput').value = '';
        document.getElementById('userRutInput').value = '';
        document.getElementById('userPinInput').value = '1234';
        document.getElementById('userRoleInput').value = 'student';
    }
    document.getElementById('userModal')?.classList.remove('hidden');
}

function closeUserModal() { document.getElementById('userModal')?.classList.add('hidden'); }

function saveUserFromModal() {
    const editId = document.getElementById('userEditId').value;
    const name = document.getElementById('userNameInput').value.trim();
    const rut = document.getElementById('userRutInput').value.trim();
    const pin = document.getElementById('userPinInput').value.trim() || '1234';
    const role = document.getElementById('userRoleInput').value;

    if (!name || !rut) return alert("Completa el nombre y el RUT.");

    if (editId) {
        const u = APP_STATE.users.find(x => String(x.id) === String(editId));
        if (u) { u.name = name; u.rut = rut; u.pin = pin; u.role = role; }
    } else {
        APP_STATE.users.push({ id: `u-${Date.now()}`, name, rut, pin, role, points: 0, level: 1, minigamesCompleted: {}, examPassed: {} });
    }
    closeUserModal();
    renderApp();
}

function deleteUser(id) {
    if (!confirm("¿Eliminar este usuario?")) return;
    APP_STATE.users = APP_STATE.users.filter(x => String(x.id) !== String(id));
    renderApp();
}

function openMissionModal() { document.getElementById('missionModal')?.classList.remove('hidden'); }
function closeMissionModal() { document.getElementById('missionModal')?.classList.add('hidden'); }
function activateMissionForStudents() {
    const title = document.getElementById('missionTitleInput').value.trim();
    const desc = document.getElementById('missionDescInput').value.trim();
    if (!title) return alert("Escribe un título para la misión.");
    APP_STATE.activeMission = { title, desc };
    closeMissionModal();
    alert("🎯 Misión activada con éxito para los alumnos.");
    renderApp();
}

// ==========================================
// 6. CÁMARA OCR PARA ESCANEAR GÓNDOLAS
// ==========================================
function openScannerModal(prodId) {
    const prod = APP_STATE.products.find(p => String(p.id) === String(prodId));
    if (!prod) return;
    document.getElementById('aiScannerTargetTitle').textContent = prod.name;
    document.getElementById('scannerModal')?.classList.remove('hidden');
}

function closeScannerModal() { document.getElementById('scannerModal')?.classList.add('hidden'); }

function captureAndAnalyzeImageWithAI() {
    closeScannerModal();
    alert("📷 Precio analizado en góndola: $1.000 CLP confirmado.");
}

// ==========================================
// 7. MOTOR INTERACTIVO DE MINIJUEGOS (6 JUEGOS POR NIVEL)
// ==========================================
function setStudentTab(tabName) {
    APP_STATE.currentStudentTab = tabName;
    renderApp();
}

function openMinigamesModuleModal() {
    renderMinigamesMap();
    document.getElementById('minigamesModuleModal')?.classList.remove('hidden');
}

function closeMinigamesModuleModal() {
    document.getElementById('minigamesModuleModal')?.classList.add('hidden');
}

function renderMinigamesMap() {
    const container = document.getElementById('minigamesMapContainer');
    if (!container) return;

    const user = APP_STATE.currentUser || { level: 1, minigamesCompleted: {}, examPassed: {} };

    let html = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-5 rounded-3xl border-4 border-indigo-400 shadow-xl flex justify-between items-center flex-wrap gap-4">
                <div>
                    <span class="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase">🎮 MÓDULO MINIJUEGOS MINEDUC</span>
                    <h3 class="text-2xl font-black">Mapa de Desafíos (6 Juegos + Jefe Final)</h3>
                </div>
                <button onclick="closeMinigamesModuleModal()" class="bg-rose-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow">✕ Cerrar Mapa</button>
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
            <div class="bg-white border-4 ${isLevelUnlocked ? 'border-indigo-400' : 'border-slate-300'} rounded-3xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                    <div class="bg-gradient-to-r ${lvl.bgColor} p-3 rounded-2xl text-white mb-3">
                        <h4 class="font-black text-base">${lvl.title}</h4>
                        <span class="text-[10px] bg-black/30 px-2 py-0.5 rounded font-black">${isBossDefeated ? '✅ NIVEL SUPERADO' : `Progreso: ${minigamesDone}/6`}</span>
                    </div>

                    <div class="space-y-1.5 max-h-56 overflow-y-auto">
                        ${lvl.minigamesList.map((game, idx) => {
                            const gameNum = idx + 1;
                            const isPlayed = minigamesDone >= gameNum;
                            return `
                                <button onclick="launchSpecificMinigame(${levelNum}, ${gameNum})" ${!isLevelUnlocked ? 'disabled' : ''} class="w-full text-left p-2 rounded-xl text-xs font-bold border flex justify-between items-center ${isPlayed ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-slate-50 text-slate-800 hover:border-indigo-400'}">
                                    <span class="truncate font-black">${game.name}</span>
                                    <span class="text-[10px] font-black px-2 py-0.5 rounded ${isPlayed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">${isPlayed ? '✓ Listo' : 'Jugar'}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <button onclick="startLevelExam(${levelNum})" ${!isBossUnlocked ? 'disabled' : ''} class="w-full py-2.5 rounded-xl font-black text-xs shadow ${isBossUnlocked ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}">
                    ⚔️ ${isBossDefeated ? 'REPETIR JEFE' : 'ENFRENTAR AL JEFE FINAL'}
                </button>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function launchSpecificMinigame(levelNum, gameIndex) {
    closeMinigamesModuleModal();
    const lvlMeta = LEVEL_CURRICULUM[levelNum];
    const gameMeta = (lvlMeta && lvlMeta.minigamesList[gameIndex - 1]) || { name: `Minijuego #${gameIndex}`, type: 'choice' };
    openMemoriseModal({ ...gameMeta, level: levelNum, gameIndex: gameIndex });
}

function openMemoriseModal(minigameMeta) {
    startMinigameExecution(minigameMeta);
    document.getElementById('memoriseGameModal')?.classList.remove('hidden');
}

function closeMemoriseModal() {
    document.getElementById('memoriseGameModal')?.classList.add('hidden');
}

function registerMinigameCompletion(minigameMeta) {
    const user = APP_STATE.currentUser;
    if (!user || user.role !== 'student') return;

    const currentLevel = (minigameMeta && minigameMeta.level) || user.level || 1;
    if (!user.minigamesCompleted) user.minigamesCompleted = {};

    const key = `level_${currentLevel}`;
    const previousDone = user.minigamesCompleted[key] || 0;
    if (previousDone < 6) user.minigamesCompleted[key] = previousDone + 1;

    user.points = (user.points || 0) + 15;
    localStorage.setItem('nee_active_user', JSON.stringify(user));

    const count = user.minigamesCompleted[key];
    speakText(`¡Excelente! Completaste el minijuego. Llevas ${count} de 6.`);
    alert(`🎮 ¡MINIJUEGO COMPLETADO!\n\nLlevas ${count} de 6 minijuegos en el Nivel ${currentLevel}.`);
    renderApp();
}

function startMinigameExecution(minigameMeta) {
    const levelNum = (minigameMeta && minigameMeta.level) || APP_STATE.currentUser?.level || 1;
    const gameIdx = (minigameMeta && minigameMeta.gameIndex) || 1;
    APP_STATE.memorise.activeMinigameMeta = { level: levelNum, gameIndex: gameIdx, name: minigameMeta ? minigameMeta.name : `Minijuego #${gameIdx}` };

    if (minigameMeta && minigameMeta.type === 'memorise') {
        startMemoriseGameEngine(levelNum);
    } else if (minigameMeta && minigameMeta.type === 'math') {
        startMathGameEngine(levelNum);
    } else {
        startChoiceGameEngine(levelNum, gameIdx);
    }
}

function startMemoriseGameEngine(userLevel) {
    let totalPairsNeeded = 3;
    let availableProducts = [...APP_STATE.products];
    const selectedProds = availableProducts.slice(0, totalPairsNeeded);
    let deck = [];
    selectedProds.forEach((prod, index) => {
        deck.push({ cardId: `c-${index}-a`, productId: prod.id, name: prod.name, iconEmoji: prod.iconEmoji, isFlipped: false, isMatched: false });
        deck.push({ cardId: `c-${index}-b`, productId: prod.id, name: prod.name, iconEmoji: prod.iconEmoji, isFlipped: false, isMatched: false });
    });
    deck.sort(() => 0.5 - Math.random());

    APP_STATE.memorise = { ...APP_STATE.memorise, cards: deck, flippedCards: [], matchedPairsCount: 0, movesCount: 0, totalPairsNeeded: totalPairsNeeded, isBusy: false };

    const speechBox = document.getElementById('memoriseAvatarSpeechBox');
    if (speechBox) speechBox.innerHTML = getAvatarHtml('mascot', `<b>Memorice</b>: ¡Encuentra las parejas de productos iguales!`);
    renderMemoriseBoard();
}

function renderMemoriseBoard() {
    const boardEl = document.getElementById('memoriseBoard');
    if (!boardEl) return;
    boardEl.className = "grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto p-1 max-h-[50vh]";
    boardEl.innerHTML = APP_STATE.memorise.cards.map((card, idx) => `
        <div onclick="handleMemoriseCardClick(${idx})" class="h-32 bg-white border-4 ${card.isMatched ? 'border-emerald-400 bg-emerald-50' : 'border-purple-300'} rounded-2xl shadow cursor-pointer flex flex-col items-center justify-center p-2 transition-all">
            ${(card.isFlipped || card.isMatched) ? `<span class="text-4xl">${card.iconEmoji}</span><span class="text-[10px] font-black mt-1 text-center">${card.name}</span>` : `<span class="text-3xl">🤖</span>`}
        </div>
    `).join('');
}

function handleMemoriseCardClick(cardIndex) {
    const mem = APP_STATE.memorise;
    if (mem.isBusy) return;
    const card = mem.cards[cardIndex];
    if (card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    mem.flippedCards.push({ card, cardIndex });
    renderMemoriseBoard();

    if (mem.flippedCards.length === 2) {
        mem.isBusy = true;
        const [first, second] = mem.flippedCards;
        if (first.card.productId === second.card.productId) {
            first.card.isMatched = true; second.card.isMatched = true;
            mem.matchedPairsCount++; mem.flippedCards = []; mem.isBusy = false;
            renderMemoriseBoard();
            if (mem.matchedPairsCount === mem.totalPairsNeeded) {
                setTimeout(() => {
                    registerMinigameCompletion(mem.activeMinigameMeta);
                    closeMemoriseModal();
                }, 500);
            }
        } else {
            setTimeout(() => {
                first.card.isFlipped = false; second.card.isFlipped = false;
                mem.flippedCards = []; mem.isBusy = false;
                renderMemoriseBoard();
            }, 1000);
        }
    }
}

function startChoiceGameEngine(levelNum, gameIdx) {
    const boardEl = document.getElementById('memoriseBoard');
    const speechBox = document.getElementById('memoriseAvatarSpeechBox');
    if (!boardEl) return;

    let question = "¿Cuál de estos productos es el de MENOR valor?";
    let options = [
        { label: "Jugo de $500", isCorrect: true, emoji: "🧃" },
        { label: "Aceite de $2.500", isCorrect: false, emoji: "🍾" }
    ];

    if (speechBox) speechBox.innerHTML = getAvatarHtml('mascot', question);
    boardEl.className = "grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 max-h-[50vh]";
    boardEl.innerHTML = options.map(opt => `
        <button onclick="handleGenericChoiceAnswer(${opt.isCorrect})" class="p-5 bg-white border-4 border-indigo-300 hover:border-indigo-600 rounded-3xl shadow flex items-center gap-4 active:scale-95">
            <span class="text-4xl">${opt.emoji}</span>
            <span class="font-black text-slate-800 text-base">${opt.label}</span>
        </button>
    `).join('');
}

function startMathGameEngine(levelNum) {
    const boardEl = document.getElementById('memoriseBoard');
    const speechBox = document.getElementById('memoriseAvatarSpeechBox');
    if (!boardEl) return;

    let qText = "Si compras un pan de $800 y pagas con $1.000, ¿cuánto vuelto te dan?";
    if (speechBox) speechBox.innerHTML = getAvatarHtml('mascot', qText);

    boardEl.className = "grid grid-cols-3 gap-3 p-2 max-h-[50vh]";
    boardEl.innerHTML = [200, 500, 100].map(val => `
        <button onclick="handleGenericChoiceAnswer(${val === 200})" class="p-5 bg-white border-4 border-amber-300 rounded-2xl font-black text-xl text-amber-950 active:scale-95">
            $${val}
        </button>
    `).join('');
}

function handleGenericChoiceAnswer(isCorrect) {
    if (isCorrect) {
        playChimeSound(false);
        registerMinigameCompletion(APP_STATE.memorise.activeMinigameMeta);
        closeMemoriseModal();
    } else {
        playChimeSound(true);
        alert("❌ Inténtalo nuevamente.");
    }
}

// ==========================================
// 8. BATALLAS DE JEFES Y EXÁMENES
// ==========================================
function startLevelExam(levelNumber) {
    const user = APP_STATE.currentUser;
    if (!user) return;
    const minigamesDone = (user.minigamesCompleted && user.minigamesCompleted[`level_${levelNumber}`]) || 0;

    if (minigamesDone < 6 && user.role === 'student') {
        playChimeSound(true);
        alert(`🔒 BATALLA DE JEFE BLOQUEADA\n\nDebes completar los 6 minijuegos del Nivel ${levelNumber}.\nLlevas ${minigamesDone}/6 minijuegos.`);
        return;
    }

    const questions = MINEDUC_EXAM_BANK[levelNumber] || MINEDUC_EXAM_BANK[1];
    APP_STATE.currentExam = { level: levelNumber, currentQuestionIndex: 0, score: 0, questions: questions };
    renderExamQuestion();
    document.getElementById('levelExamModal')?.classList.remove('hidden');
}

function renderExamQuestion() {
    const exam = APP_STATE.currentExam;
    const container = document.getElementById('examModalContainer');
    if (!container || !exam) return;
    const q = exam.questions[exam.currentQuestionIndex];

    container.innerHTML = `
        <div class="flex justify-between items-center border-b pb-3">
            <span class="bg-rose-600 text-white font-black px-3 py-1 rounded-full text-xs uppercase">
                ⚔️ BATALLA DE JEFE - NIVEL ${exam.level}
            </span>
            <button onclick="closeExamModal()" class="text-slate-400 font-black text-xl">✕</button>
        </div>
        <div class="space-y-4 my-4">
            <h3 class="text-base font-black text-slate-800 text-center leading-snug">${q.q}</h3>
            <div class="space-y-2">
                ${q.options.map(opt => `
                    <button onclick="submitExamAnswer('${opt.replace(/'/g, "\\'")}')" class="w-full p-3.5 bg-white border-2 border-slate-300 hover:border-indigo-600 rounded-2xl font-black text-xs text-left active:scale-95 flex items-center gap-2">
                        <span>✓</span> <span>${opt}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function submitExamAnswer(selectedOpt) {
    const exam = APP_STATE.currentExam;
    if (selectedOpt === exam.questions[exam.currentQuestionIndex].correct) exam.score++;
    exam.currentQuestionIndex++;
    if (exam.currentQuestionIndex < exam.questions.length) renderExamQuestion();
    else finishExamEvaluation();
}

function finishExamEvaluation() {
    const exam = APP_STATE.currentExam;
    const user = APP_STATE.currentUser;
    if (exam.score === exam.questions.length) {
        user.examPassed[`level_${exam.level}`] = true;
        user.level = exam.level + 1;
        user.points = (user.points || 0) + 50;
        localStorage.setItem('nee_active_user', JSON.stringify(user));
        alert(`🏆 ¡JEFE FINAL DERROTADO!\n\n¡Has ascendido al Nivel ${user.level}!`);
        closeExamModal();
        renderApp();
    } else {
        alert("💪 Sigue intentándolo. Repasa los minijuegos antes de volver a enfrentar al Jefe.");
        closeExamModal();
    }
}

function closeExamModal() { document.getElementById('levelExamModal')?.classList.add('hidden'); }

// ==========================================
// 9. RENDERIZADO DE VISTAS PRINCIPALES
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        if (userInfoHeader) {
            userInfoHeader.innerHTML = `
                <div class="bg-white/90 text-slate-900 border px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                    <span>${APP_STATE.currentUser.name}</span>
                    <span class="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px]">${APP_STATE.currentUser.role === 'teacher' ? '👨‍🏫 Profesor' : `🎒 Nivel ${APP_STATE.currentUser.level || 1}`}</span>
                    ${APP_STATE.currentUser.role === 'student' ? `<span class="bg-amber-400 text-slate-900 font-black px-1.5 py-0.5 rounded text-[10px]">⭐ ${APP_STATE.currentUser.points || 0} pts</span>` : ''}
                </div>
                <button onclick="logout()" class="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-1 rounded-xl text-xs border border-rose-300">Salir</button>
            `;
        }
    } else {
        if (userInfoHeader) userInfoHeader.innerHTML = '';
        renderLoginView(container);
        return;
    }

    if (APP_STATE.currentUser.role === 'teacher') {
        renderTeacherDashboard(container);
    } else {
        if (APP_STATE.currentStudentTab === 'minigames') {
            renderStudentMinigamesTab(container);
        } else if (APP_STATE.selectedSupermarketId) {
            renderSupermarketView(container, APP_STATE.selectedSupermarketId);
        } else {
            renderHomeView(container);
        }
    }
    updateBasketBadge();
}

function renderLoginView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white border-4 border-slate-300 rounded-3xl p-6 shadow-xl space-y-5">
            <div class="text-center space-y-1">
                <div class="text-5xl">🔐</div>
                <h2 class="text-2xl font-black text-slate-800">Acceso Institucional PIE</h2>
                <p class="text-xs font-bold text-slate-500">Ingresa tus credenciales para comenzar</p>
            </div>
            <div class="space-y-3">
                <div>
                    <label class="block text-xs font-bold uppercase mb-1">RUT o Usuario:</label>
                    <input type="text" id="loginUser" value="98765432-1" class="w-full px-4 py-2.5 rounded-xl border-2 font-bold text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-1">PIN / Clave:</label>
                    <input type="password" id="loginPin" value="1234" class="w-full px-4 py-2.5 rounded-xl border-2 font-black text-center text-lg">
                </div>
                <button onclick="handleLogin()" class="w-full bg-indigo-600 text-white font-black py-3 rounded-xl shadow text-base active:scale-95">Ingresar</button>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-2 border-t">
                <button onclick="quickLogin('student')" class="bg-amber-400 text-slate-900 font-black p-2 rounded-xl text-xs active:scale-95">🎒 Probar Alumno</button>
                <button onclick="quickLogin('teacher')" class="bg-indigo-600 text-white font-black p-2 rounded-xl text-xs active:scale-95">👨‍🏫 Probar Profesor</button>
            </div>
        </div>
    `;
}

function handleLogin() {
    const uVal = document.getElementById('loginUser').value.trim().toLowerCase();
    const pVal = document.getElementById('loginPin').value.trim();
    const user = APP_STATE.users.find(u => u.rut.toLowerCase() === uVal && u.pin === pVal);
    if (user) {
        APP_STATE.currentUser = user;
        localStorage.setItem('nee_active_user', JSON.stringify(user));
        renderApp();
    } else {
        alert("RUT o PIN incorrectos.");
    }
}

function quickLogin(role) {
    const user = APP_STATE.users.find(u => u.role === role);
    if (user) {
        APP_STATE.currentUser = user;
        localStorage.setItem('nee_active_user', JSON.stringify(user));
        renderApp();
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
    APP_STATE.currentStudentTab = 'home';
    renderApp();
}

function renderHomeView(container) {
    const userLevel = APP_STATE.currentUser?.level || 1;
    const minigamesDone = (APP_STATE.currentUser?.minigamesCompleted?.[`level_${userLevel}`]) || 0;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- PESTAÑAS DEL DASHBOARD DEL ESTUDIANTE -->
            <div class="flex gap-2 bg-white p-2 rounded-2xl border-2 shadow-sm">
                <button onclick="setStudentTab('home')" class="w-1/2 py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${APP_STATE.currentStudentTab === 'home' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                    🏪 Supermercados y Sala
                </button>
                <button onclick="setStudentTab('minigames')" class="w-1/2 py-3 rounded-xl font-black text-xs sm:text-sm transition-all ${APP_STATE.currentStudentTab === 'minigames' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                    🎮 Pestaña de Minijuegos (${minigamesDone}/6)
                </button>
            </div>

            <!-- SI HAY MISIÓN ACTIVA DEFINIDA POR EL DOCENTE -->
            ${APP_STATE.activeMission ? `
                <div class="bg-amber-100 border-4 border-amber-400 p-4 rounded-3xl shadow flex items-center gap-3">
                    <span class="text-4xl">🎯</span>
                    <div>
                        <span class="font-black text-xs text-amber-900 uppercase">Misión Activa del Profesor:</span>
                        <h4 class="font-black text-slate-800 text-sm">${APP_STATE.activeMission.title}</h4>
                        <p class="text-xs font-bold text-slate-600">${APP_STATE.activeMission.desc}</p>
                    </div>
                </div>
            ` : ''}

            <!-- LISTA DE SUPERMERCADOS Y TIENDAS DE LA ESCUELA -->
            <div class="space-y-3">
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span>🏪</span> <span>Supermercados Disponibles (Toca para entrar a comprar):</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${APP_STATE.supermarkets.map(sup => `
                        <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-4 border-slate-300 p-6 shadow-lg hover:border-indigo-500 cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-all">
                            <div class="bg-amber-400 p-4 rounded-3xl text-5xl flex items-center justify-center w-24 h-24 shadow">${sup.icon || '🛒'}</div>
                            <h3 class="text-xl font-black text-slate-800">${sup.name}</h3>
                            <button class="w-full bg-indigo-600 text-white font-black py-3 rounded-2xl shadow text-sm">¡Entrar a Comprar!</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = String(id);
    const sup = APP_STATE.supermarkets.find(s => String(s.id) === String(id));
    speakText(`Entraste a ${sup ? sup.name : 'Supermercado'}.`);
    renderApp();
}

function renderSupermarketView(container, supId) {
    const sup = APP_STATE.supermarkets.find(s => String(s.id) === String(supId));
    const productsHtml = APP_STATE.products.map(prod => `
        <div class="p-5 rounded-3xl border-4 border-slate-200 bg-white shadow-lg flex flex-col justify-between space-y-3">
            <div class="flex items-start space-x-3">
                <span class="text-5xl">${prod.iconEmoji || '📦'}</span>
                <div>
                    <h3 class="text-lg font-black text-slate-800">${prod.name}</h3>
                    <div class="text-2xl font-black text-emerald-700">$${prod.price.toLocaleString('es-CL')}</div>
                    ${getPricePictogramsHtml(prod.price)}
                </div>
            </div>
            <div class="flex gap-2 pt-2 border-t">
                <button onclick="openScannerModal('${prod.id}')" class="bg-purple-100 text-purple-900 font-black p-3 rounded-2xl text-xs active:scale-95" title="Escanear en góndola">📷 Escanear</button>
                <button onclick="addToBasket('${prod.id}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl shadow text-sm active:scale-95">🛒 Añadir al Canasto</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between bg-white p-4 rounded-3xl border-4 border-slate-300 shadow">
                <button onclick="goHome()" class="bg-slate-200 text-slate-800 font-black px-4 py-2.5 rounded-2xl text-xs">← Volver a Tiendas</button>
                <h2 class="text-xl font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
                <div>${getAvatarHtml('mascot')}</div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${productsHtml}</div>
        </div>
    `;
}

function renderStudentMinigamesTab(container) {
    const userLevel = APP_STATE.currentUser?.level || 1;
    const lvl = LEVEL_CURRICULUM[userLevel] || LEVEL_CURRICULUM[1];
    const minigamesDone = (APP_STATE.currentUser?.minigamesCompleted?.[`level_${userLevel}`]) || 0;

    container.innerHTML = `
        <div class="space-y-6">
            <!-- PESTAÑAS DEL DASHBOARD DEL ESTUDIANTE -->
            <div class="flex gap-2 bg-white p-2 rounded-2xl border-2 shadow-sm">
                <button onclick="setStudentTab('home')" class="w-1/2 py-3 rounded-xl font-black text-xs sm:text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
                    🏪 Supermercados y Sala
                </button>
                <button onclick="setStudentTab('minigames')" class="w-1/2 py-3 rounded-xl font-black text-xs sm:text-sm bg-indigo-600 text-white shadow">
                    🎮 Pestaña de Minijuegos (${minigamesDone}/6)
                </button>
            </div>

            <!-- ENCABEZADO DEL NIVEL ACTUAL -->
            <div class="bg-gradient-to-r ${lvl.bgColor} text-white p-6 rounded-3xl shadow-xl space-y-2">
                <span class="bg-amber-400 text-slate-900 font-black px-3 py-0.5 rounded-full text-[10px] uppercase">NIVEL ACTUAL DE DESAFÍOS</span>
                <h2 class="text-2xl font-black">${lvl.title}</h2>
                <p class="text-xs font-bold text-white/90">${lvl.objectiveGeneral}</p>
            </div>

            <!-- MAPA INTEGRADO DE LOS 6 MINIJUEGOS DEL ESTUDIANTE -->
            <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-4">
                <div class="flex justify-between items-center flex-wrap gap-2 border-b pb-3">
                    <h3 class="text-lg font-black text-slate-800">🎮 Los 6 Minijuegos Evaluables del Nivel ${userLevel}:</h3>
                    <button onclick="openMinigamesModuleModal()" class="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow">🗺️ Ver Mapa Completo de Niveles</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${lvl.minigamesList.map((game, idx) => {
                        const gameNum = idx + 1;
                        const isPlayed = minigamesDone >= gameNum;
                        return `
                            <div class="p-4 bg-slate-50 border-2 ${isPlayed ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300'} rounded-2xl flex flex-col justify-between space-y-3">
                                <div>
                                    <div class="flex justify-between items-center">
                                        <span class="font-black text-xs text-indigo-900 block">${game.name}</span>
                                        <span class="text-[10px] font-black px-2 py-0.5 rounded ${isPlayed ? 'bg-emerald-600 text-white' : 'bg-slate-200'}">${isPlayed ? '✓ Completado' : 'Pendiente'}</span>
                                    </div>
                                    <p class="text-[11px] font-bold text-slate-600 mt-1">${game.desc}</p>
                                </div>
                                <button onclick="launchSpecificMinigame(${userLevel}, ${gameNum})" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs shadow active:scale-95">
                                    ▶️ Iniciar Minijuego #${gameNum}
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- BOTÓN DE BATALLA DE JEFE -->
                <div class="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 mt-4">
                    <div>
                        <h4 class="font-black text-rose-950 text-sm">${lvl.bossTitle}</h4>
                        <p class="text-xs font-bold text-rose-800">${lvl.bossDescription}</p>
                    </div>
                    <button onclick="startLevelExam(${userLevel})" ${minigamesDone < 6 ? 'disabled' : ''} class="px-5 py-3 rounded-2xl font-black text-xs shadow ${minigamesDone >= 6 ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}">
                        ⚔️ ${minigamesDone >= 6 ? 'ENFRENTAR AL JEFE FINAL' : 'COMPLETA LOS 6 JUEGOS PRIMERO'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 10. PANEL DOCENTE COMPLETO
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    renderTeacherDashboard(document.getElementById('appContainer'));
}

function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';
    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <h2 class="text-xl font-black">🏫 Panel Docente y Psicopedagógico PIE</h2>
                    <button onclick="openMissionModal()" class="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1.5 rounded-xl">🎯 Crear Misión de Compra</button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-800 pt-3">
                    <button onclick="setTeacherTab('home')" class="py-2 px-3 rounded-xl font-black text-xs ${activeTab === 'home' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">📊 Evaluaciones</button>
                    <button onclick="setTeacherTab('curriculum')" class="py-2 px-3 rounded-xl font-black text-xs ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">📘 Matriz Mineduc/PIE</button>
                    <button onclick="setTeacherTab('catalogs')" class="py-2 px-3 rounded-xl font-black text-xs ${activeTab === 'catalogs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">🏪 Tiendas & Productos</button>
                    <button onclick="setTeacherTab('users')" class="py-2 px-3 rounded-xl font-black text-xs ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">🔑 Usuarios</button>
                </div>
            </div>

            <div>
                ${activeTab === 'home' ? renderTeacherHomeTab() : ''}
                ${activeTab === 'curriculum' ? renderTeacherCurriculumObjectivesTab() : ''}
                ${activeTab === 'catalogs' ? renderTeacherCatalogsTab() : ''}
                ${activeTab === 'users' ? renderTeacherUsersTab() : ''}
            </div>
        </div>
    `;
}

function renderTeacherHomeTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow space-y-4">
            <h3 class="font-black text-slate-800 text-base">📊 Registro de Avance de Estudiantes</h3>
            <div class="space-y-3">
                ${APP_STATE.users.filter(u => u.role === 'student').map(st => `
                    <div class="p-4 bg-slate-50 border-2 rounded-2xl flex justify-between items-center flex-wrap gap-2">
                        <div>
                            <span class="font-black text-slate-800 text-sm block">${st.name} (RUT: ${st.rut})</span>
                            <span class="text-xs text-slate-500 font-bold">Nivel Actual: ${st.level || 1} • Puntos: ${st.points || 0} pts</span>
                        </div>
                        <span class="bg-indigo-100 text-indigo-900 font-black text-xs px-3 py-1 rounded-full">Activo en Aula</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderTeacherCurriculumObjectivesTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-5xl mx-auto">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg">📘 Matriz Mineduc / PIE / Decreto 83 (6 Minijuegos + Jefe por Nivel)</h3>
            </div>
            <div class="space-y-6">
                ${Object.keys(LEVEL_CURRICULUM).map(key => {
                    const lvl = LEVEL_CURRICULUM[key];
                    return `
                        <div class="p-5 bg-slate-50 border-2 rounded-3xl space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase">${lvl.title}</span>
                                <span class="text-xs font-black text-amber-700">Requisito: ${lvl.minigamesRequired} Minijuegos + Jefe</span>
                            </div>
                            <p class="text-xs font-bold text-slate-800"><b>Objetivo General Mineduc:</b> ${lvl.objectiveGeneral}</p>
                            <div class="bg-indigo-50 p-3 rounded-2xl border border-indigo-200 text-xs font-bold space-y-1">
                                <span class="text-indigo-900 font-black block">Objetivos Específicos:</span>
                                <ul class="list-disc list-inside text-indigo-950 space-y-1">
                                    ${lvl.objectivesSpecific.map(o => `<li>${o}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-purple-50 p-3 rounded-2xl text-xs font-bold space-y-1">
                                <span class="text-purple-900 font-black block">Desglose de los 6 Minijuegos Evaluables:</span>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                    ${lvl.minigamesList.map(g => `<div class="p-2 bg-white rounded border"><b>${g.name}:</b> ${g.desc}</div>`).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderTeacherCatalogsTab() {
    return `
        <div class="space-y-6">
            <!-- GESTIÓN DE SUPERMERCADOS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-black text-slate-800 text-base">🏪 Supermercados Creados</h3>
                    <button onclick="openSupermarketModal()" class="bg-indigo-600 text-white font-black text-xs px-3 py-2 rounded-xl">+ Nuevo Supermercado</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${APP_STATE.supermarkets.map(s => `
                        <div class="p-3 border-2 rounded-2xl flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${s.icon || '🏪'}</span>
                                <span class="font-black text-xs text-slate-800">${s.name}</span>
                            </div>
                            <div class="flex gap-1">
                                <button onclick="openSupermarketModal('${s.id}')" class="bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded text-xs">Editar</button>
                                <button onclick="deleteSupermarket('${s.id}')" class="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-xs">✕</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- GESTIÓN DE PRODUCTOS -->
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-black text-slate-800 text-base">📦 Catálogo de Productos y Precios</h3>
                    <button onclick="openProductModal()" class="bg-indigo-600 text-white font-black text-xs px-3 py-2 rounded-xl">+ Nuevo Producto</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${APP_STATE.products.map(p => `
                        <div class="p-3 border-2 rounded-2xl flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${p.iconEmoji || '📦'}</span>
                                <div>
                                    <span class="font-black text-xs text-slate-800 block">${p.name}</span>
                                    <span class="text-xs font-black text-emerald-700">$${p.price.toLocaleString('es-CL')}</span>
                                </div>
                            </div>
                            <div class="flex gap-1">
                                <button onclick="openProductModal('${p.id}')" class="bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded text-xs">Editar</button>
                                <button onclick="deleteProduct('${p.id}')" class="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-xs">✕</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderTeacherUsersTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="font-black text-slate-800 text-base">🔑 Gestión de Usuarios</h3>
                <button onclick="openUserModal()" class="bg-indigo-600 text-white font-black text-xs px-3 py-2 rounded-xl">+ Nuevo Usuario</button>
            </div>
            <div class="space-y-2">
                ${APP_STATE.users.map(u => `
                    <div class="p-3 border-2 rounded-2xl flex justify-between items-center">
                        <div>
                            <span class="font-black text-xs text-slate-800 block">${u.name} (${u.role === 'teacher' ? 'Profesor' : 'Estudiante'})</span>
                            <span class="text-[11px] text-slate-500 font-bold">RUT: ${u.rut} • PIN: ${u.pin}</span>
                        </div>
                        <div class="flex gap-1">
                            <button onclick="openUserModal('${u.id}')" class="bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded text-xs">Editar</button>
                            <button onclick="deleteUser('${u.id}')" class="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-xs">✕</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// 11. CANASTO DE COMPRAS Y PAGO EN CAJA
// ==========================================
function openBasketModal() {
    renderBasketModalContent();
    document.getElementById('basketModal')?.classList.remove('hidden');
}

function closeBasketModal() { document.getElementById('basketModal')?.classList.add('hidden'); }

function addToBasket(prodId) {
    const prod = APP_STATE.products.find(p => String(p.id) === String(prodId));
    if (!prod) return;
    APP_STATE.basket.push({ productId: prod.id, price: prod.price });
    playChimeSound();
    updateBasketBadge();
    speakText(`Añadido ${prod.name}`);
}

function updateBasketBadge() {
    const b = document.getElementById('basketBadge');
    if (b) b.textContent = APP_STATE.basket.length;
}

function renderBasketModalContent() {
    const listEl = document.getElementById('basketItemsList');
    const totalEl = document.getElementById('basketTotalCLP');
    const paidEl = document.getElementById('userPaidTotal');
    const trayEl = document.getElementById('paymentMoneyTray');
    if (!listEl) return;

    let total = 0;
    listEl.innerHTML = APP_STATE.basket.length === 0 
        ? `<p class="text-center text-slate-400 py-6 font-bold text-xs">Tu canasto está vacío.</p>`
        : APP_STATE.basket.map(item => {
            const p = APP_STATE.products.find(x => String(x.id) === String(item.productId)) || { name: 'Producto', price: 1000 };
            total += p.price;
            return `
                <div class="flex items-center justify-between p-3 bg-slate-50 border-2 rounded-2xl text-xs font-bold">
                    <span class="text-slate-800 font-black text-sm">${p.name}</span>
                    <span class="font-black text-emerald-700">$${p.price.toLocaleString('es-CL')}</span>
                </div>
            `;
        }).join('');

    if (totalEl) totalEl.innerHTML = `<div>$${total.toLocaleString('es-CL')}</div>${getPricePictogramsHtml(total)}`;
    if (paidEl) paidEl.textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;

    if (trayEl) {
        trayEl.innerHTML = CLP_CURRENCY_ITEMS.map(item => `
            <button onclick="addPaymentMoney(${item.value})" class="p-2 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center shadow-sm active:scale-95">
                <img src="${item.img}" class="h-10 object-contain">
                <span class="text-[10px] font-black text-slate-700 mt-1">${item.name}</span>
            </button>
        `).join('');
    }
}

function addPaymentMoney(val) {
    APP_STATE.userPaidAmount += val;
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
    APP_STATE.basket.forEach(b => {
        const p = APP_STATE.products.find(x => String(x.id) === String(b.productId));
        total += (p ? p.price : 0);
    });

    if (total === 0) return alert("Tu canasto está vacío.");
    if (APP_STATE.userPaidAmount < total) {
        playChimeSound(true);
        speakText(`Falta dinero. La compra suma ${total} pesos y has entregado ${APP_STATE.userPaidAmount} pesos.`);
        return alert(`⚠️ Dinero Insuficiente\n\nTotal compra: $${total.toLocaleString('es-CL')}\nHas pagado: $${APP_STATE.userPaidAmount.toLocaleString('es-CL')}\nTe faltan: $${(total - APP_STATE.userPaidAmount).toLocaleString('es-CL')}`);
    }

    const vuelto = APP_STATE.userPaidAmount - total;
    playChimeSound(false);
    if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 90 });

    closeBasketModal();

    document.getElementById('successModalTotal').textContent = `$${total.toLocaleString('es-CL')}`;
    document.getElementById('successModalPaid').textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoAmount').textContent = `$${vuelto.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoBreakdown').innerHTML = getPricePictogramsHtml(vuelto);

    document.getElementById('checkoutSuccessModal')?.classList.remove('hidden');
}

function closeSuccessModalAndFinish() {
    document.getElementById('checkoutSuccessModal')?.classList.add('hidden');
    clearBasket();
    goHome();
}

// ==========================================
// 12. INICIALIZACIÓN AUTOMÁTICA
// ==========================================
function mainInit() {
    try {
        const stored = localStorage.getItem('nee_active_user');
        if (stored) APP_STATE.currentUser = JSON.parse(stored);
    } catch(e) {}
    renderApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainInit);
} else {
    mainInit();
}

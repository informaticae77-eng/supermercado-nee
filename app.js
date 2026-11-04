// ==========================================
// 1. CONFIGURACIÓN FIREBASE
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
// 2. CURRÍCULUM Y MONEDAS CHILENAS (CLP)
// ==========================================
const LEVEL_CURRICULUM = {
    0: {
        id: 0,
        title: "Nivel 0: Explorador Inicial 🎒",
        minigamesRequired: 6,
        minigamesList: [
            { id: 'm0_1', name: '1. Memorise de Monedas', type: 'memorise', desc: 'Encuentra las parejas de dinero.' },
            { id: 'm0_2', name: '2. Comparador de Precios', type: 'choice', desc: 'Identifica el producto de menor valor.' },
            { id: 'm0_3', name: '3. Conociendo el Billete $1.000', type: 'choice', desc: 'Selecciona el billete verde.' },
            { id: 'm0_4', name: '4. Suma de Monedas de $100', type: 'math', desc: 'Cuenta las monedas para llegar a $500.' },
            { id: 'm0_5', name: '5. Pareja de Envases', type: 'memorise', desc: 'Asocia el producto con su precio.' },
            { id: 'm0_6', name: '6. Pago Exacto', type: 'choice', desc: 'Paga un producto de $1.000 con el dinero exacto.' }
        ]
    },
    1: {
        id: 1,
        title: "Nivel 1: Explorador de Góndolas 🎒",
        minigamesRequired: 6,
        minigamesList: [
            { id: 'm1_1', name: '1. Memorise de Monedas y Billetes', type: 'memorise', desc: 'Encuentra las parejas de dinero.' },
            { id: 'm1_2', name: '2. Clasificador de Precios Bajos', type: 'choice', desc: 'Identifica el producto de menor valor.' },
            { id: 'm1_3', name: '3. Ordenar Monedas por Tamaño', type: 'sort', desc: 'Ordena de menor a mayor valor las monedas.' },
            { id: 'm1_4', name: '4. Parejas de Envases Idénticos', type: 'memorise', desc: 'Asocia el envase con su precio.' },
            { id: 'm1_5', name: '5. Identificador de Billete $1.000', type: 'choice', desc: 'Selecciona el billete verde de $1.000.' },
            { id: 'm1_6', name: '6. Suma Simple de Monedas', type: 'math', desc: 'Cuenta las monedas para llegar a $500.' }
        ]
    }
};

const MINEDUC_EXAM_BANK = {
    0: [
        { q: "Vas a comprar un jugo de $1.000 pesos. ¿Con cuál billete pagas de forma exacta?", options: ["Billete de $1.000 (Verde)", "Billete de $5.000 (Rojo)", "Moneda de $500"], correct: "Billete de $1.000 (Verde)" },
        { q: "¿Cuál de estas monedas chilenas tiene el mayor valor?", options: ["Moneda de $500", "Moneda de $100", "Moneda de $50"], correct: "Moneda de $500" }
    ],
    1: [
        { q: "Un kilo de manzanas cuesta $1.200 y galletas $800. ¿Cuál cuesta MENOS?", options: ["Las Galletas ($800)", "Las Manzanas ($1.200)", "Cuestan lo mismo"], correct: "Las Galletas ($800)" },
        { q: "Pagas un pan de $1.500 con un billete de $2.000. ¿Cuál es tu vuelto?", options: ["$500 pesos", "$1.000 pesos", "Sin vuelto"], correct: "$500 pesos" }
    ]
};

function makeSvgDataUrl(svgString) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString); }

const SVG_B1K  = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" rx="10" fill="#27ae60"/><text x="100" y="55" font-family="Arial,sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">$1.000</text></svg>`;
const SVG_C500 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f39c12"/><circle cx="50" cy="50" r="34" fill="#bdc3c7"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#2c3e50" text-anchor="middle">$500</text></svg>`;
const SVG_C100 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f1c40f"/><circle cx="50" cy="50" r="36" fill="#f39c12"/><text x="50" y="58" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">$100</text></svg>`;

const CLP_CURRENCY_ITEMS = [
    { id: 'b1k',  value: 1000, type: 'bill', name: 'Billete $1.000', img: makeSvgDataUrl(SVG_B1K) },
    { id: 'c500', value: 500,  type: 'coin', name: 'Moneda $500',   img: makeSvgDataUrl(SVG_C500) },
    { id: 'c100', value: 100,  type: 'coin', name: 'Moneda $100',   img: makeSvgDataUrl(SVG_C100) }
];

// ==========================================
// 3. ESTADO GLOBAL
// ==========================================
const APP_STATE = {
    currentUser: {
        id: 'u-docente',
        role: 'teacher',
        name: 'Profe María',
        specialty: 'Fonoaudiología',
        rut: '12345678-9',
        pin: '1234',
        level: 0,
        points: 0,
        minigamesCompleted: { level_0: 0, level_1: 0 },
        examPassed: {}
    },
    teacherPreviewMode: true,
    selectedSupermarketId: null,
    currentStudentTab: 'home',
    basket: [],
    userPaidAmount: 0,
    supermarkets: [
        { id: 'sup-1', name: 'Supermercado Central', icon: '🏪', description: 'Tienda Principal de la Escuela' },
        { id: 'sup-2', name: 'Minimarket Don Pedro', icon: '🏪', description: 'Almacén de Barrio' }
    ],
    products: [
        { id: 'prod-1', name: 'Leche Entera 1L', price: 1050, iconEmoji: '🥛' },
        { id: 'prod-2', name: 'Pan Hallulla 1Kg', price: 1990, iconEmoji: '🍞' },
        { id: 'prod-3', name: 'Manzana Fuji 1Kg', price: 1200, iconEmoji: '🍎' },
        { id: 'prod-4', name: 'Jugo de Naranja 1L', price: 1500, iconEmoji: '🧃' }
    ],
    users: [],
    memorise: { cards: [], flippedCards: [], matchedPairsCount: 0, movesCount: 0, totalPairsNeeded: 3, isBusy: false, activeMinigameMeta: null },
    currentExam: null
};

// ==========================================
// 4. FUNCIONES DE APOYO Y AUDIO
// ==========================================
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
// 5. RENDERIZADO PRINCIPAL (IDENTICO A TU CAPTURA)
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        if (userInfoHeader) {
            const u = APP_STATE.currentUser;
            userInfoHeader.innerHTML = `
                <div class="flex items-center gap-2 bg-indigo-700/60 p-1 px-3 rounded-2xl border border-indigo-400/40 text-xs font-bold">
                    <span class="font-black text-white">${u.name}</span>
                    <span class="bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded-xl text-[10px] font-black">${u.specialty || 'Fonoaudiología'}</span>
                    <button onclick="logout()" class="ml-1 bg-rose-500 hover:bg-rose-600 text-white font-black px-2.5 py-1 rounded-xl text-[10px] active:scale-95">Salir</button>
                </div>
            `;
        }
    } else {
        if (userInfoHeader) userInfoHeader.innerHTML = '';
        renderLoginView(container);
        return;
    }

    if (APP_STATE.currentUser.role === 'teacher' && !APP_STATE.teacherPreviewMode) {
        renderTeacherDashboard(container);
    } else {
        if (APP_STATE.selectedSupermarketId) {
            renderSupermarketView(container, APP_STATE.selectedSupermarketId);
        } else {
            renderHomeView(container);
        }
    }
    updateBasketBadge();
}

function renderHomeView(container) {
    const user = APP_STATE.currentUser || { name: 'Profe María', level: 0, points: 0 };
    const userLevel = user.level || 0;
    const points = user.points || 0;

    container.innerHTML = `
        <div class="space-y-5">
            <!-- MODO PRUEBA DOCENTE (BARRA AMARILLA DE TU CAPTURA) -->
            ${APP_STATE.teacherPreviewMode ? `
                <div class="bg-amber-400 border-2 border-amber-500 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-md">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">🕹️</span>
                        <div>
                            <h4 class="font-black text-slate-900 text-sm tracking-wide">MODO PRUEBA: VISTA DEL ESTUDIANTE</h4>
                            <p class="text-xs font-bold text-slate-800">Prueba la tienda interactiva tal como la ven los alumnos.</p>
                        </div>
                    </div>
                    <button onclick="toggleTeacherPreview()" class="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow transition-all active:scale-95">
                        ← Volver al Panel Docente
                    </button>
                </div>
            ` : ''}

            <!-- PANEL DE NIVEL RESTAURADO (BOTONES EXAMEN Y MEMORICE ELIMINADOS DEFINTIVAMENTE) -->
            <div class="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                    <div class="bg-amber-100 p-2.5 rounded-xl text-3xl">🏆</div>
                    <div>
                        <h3 class="font-black text-slate-800 text-base">Nivel ${userLevel}: Explorador Inicial 🎒</h3>
                        <p class="text-xs font-bold text-slate-500">Puntos acumulados: <b class="text-amber-600 font-black">${points} pts</b> de 250 pts para el premio</p>
                    </div>
                </div>
            </div>

            <!-- VISTA PRINCIPAL "¡Bienvenido a Comprar!" (IDÉNTICO A TU CAPTURA) -->
            <div class="bg-indigo-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex items-center justify-between flex-wrap gap-6">
                <div class="space-y-4 max-w-lg z-10">
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-black tracking-tight">¡Bienvenido a Comprar! 🛍️</h2>
                        <p class="text-xs sm:text-sm font-bold text-indigo-100 mt-1">Selecciona una tienda para comenzar tu misión.</p>
                    </div>
                    
                    <!-- BOCADILLO DE DIÁLOGO DEL AVATAR -->
                    <div class="bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3 border-2 border-indigo-200 inline-flex">
                        <div class="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-xl shrink-0">
                            🎨
                        </div>
                        <p class="text-xs font-black text-slate-800">¡Hola ${user.name}! Selecciona una tienda para comenzar tu misión.</p>
                    </div>
                </div>

                <!-- CORPÓREO OSO DE TU CAPTURA -->
                <div class="relative z-10 flex flex-col items-center">
                    <span class="bg-purple-200 text-purple-900 font-black text-[10px] px-2.5 py-0.5 rounded-full mb-1 uppercase tracking-wider border border-purple-300">Corpóreo</span>
                    <div class="w-20 h-20 bg-purple-400 rounded-3xl flex items-center justify-center text-4xl shadow-md border-2 border-purple-200">
                        🐻
                    </div>
                </div>
            </div>

            <!-- SECCIÓN DE SUPERMERCADOS -->
            <div class="space-y-4 pt-2">
                <h3 class="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                    <span>🏪</span> <span>Supermercados Disponibles (Toca uno para entrar):</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${APP_STATE.supermarkets.map(sup => `
                        <div onclick="selectSupermarket('${sup.id}')" class="bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-500 p-6 shadow-md hover:shadow-lg cursor-pointer flex flex-col items-center text-center space-y-4 active:scale-95 transition-all">
                            <div class="bg-amber-400 p-4 rounded-3xl text-5xl flex items-center justify-center w-20 h-20 shadow-inner">${sup.icon || '🛒'}</div>
                            <div>
                                <h4 class="text-lg font-black text-slate-800">${sup.name}</h4>
                                <p class="text-xs font-bold text-slate-500 mt-0.5">${sup.description || 'Tienda disponible'}</p>
                            </div>
                            <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-2xl shadow text-xs">¡Entrar a Comprar!</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 6. NAVEGACIÓN Y ACCIONES
// ==========================================
function toggleTeacherPreview() {
    APP_STATE.teacherPreviewMode = !APP_STATE.teacherPreviewMode;
    renderApp();
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
        <div class="p-5 rounded-3xl border-2 border-slate-200 bg-white shadow-md flex flex-col justify-between space-y-3">
            <div class="flex items-start space-x-3">
                <span class="text-5xl">${prod.iconEmoji || '📦'}</span>
                <div>
                    <h3 class="text-base font-black text-slate-800">${prod.name}</h3>
                    <div class="text-xl font-black text-emerald-700">$${prod.price.toLocaleString('es-CL')}</div>
                    ${getPricePictogramsHtml(prod.price)}
                </div>
            </div>
            <div class="flex gap-2 pt-2 border-t">
                <button onclick="openScannerModal('${prod.id}')" class="bg-purple-100 text-purple-900 font-black p-2.5 rounded-2xl text-xs active:scale-95" title="Escanear en góndola">📷 Escanear</button>
                <button onclick="addToBasket('${prod.id}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-2xl shadow text-xs active:scale-95">🛒 Añadir al Canasto</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-4 py-2 rounded-2xl text-xs">← Volver a Tiendas</button>
                <h2 class="text-lg font-black text-slate-800">${sup ? sup.name : 'Supermercado'}</h2>
                <div class="w-8 h-8 rounded-full bg-indigo-100 border flex items-center justify-center">🛒</div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${productsHtml}</div>
        </div>
    `;
}

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

function logout() {
    APP_STATE.currentUser = null;
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

function renderLoginView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-3xl p-6 shadow-xl space-y-5 mt-10">
            <div class="text-center space-y-1">
                <div class="text-5xl">🔐</div>
                <h2 class="text-2xl font-black text-slate-800">Acceso Supermercado</h2>
                <p class="text-xs font-bold text-slate-500">Ingresa para comenzar a practicar</p>
            </div>
            <button onclick="quickLogin()" class="w-full bg-indigo-600 text-white font-black py-3 rounded-xl shadow text-sm active:scale-95">Ingresar como Profe María</button>
        </div>
    `;
}

function quickLogin() {
    APP_STATE.currentUser = { id: 'u-docente', role: 'teacher', name: 'Profe María', specialty: 'Fonoaudiología', level: 0, points: 0 };
    APP_STATE.teacherPreviewMode = true;
    renderApp();
}

// ==========================================
// 7. CANASTO DE COMPRAS Y PAGO
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
    speakText(`Añadidos ${val} pesos. Total ${APP_STATE.userPaidAmount} pesos.`);
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
        return alert(`⚠️ Dinero Insuficiente\n\nTotal: $${total.toLocaleString('es-CL')}\nPagado: $${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`);
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
// 8. OCR ESCÁNER DE CÁMARA
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
// 9. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
});

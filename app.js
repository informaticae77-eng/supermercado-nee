/* ==========================================================================
   SUPERMERCADO ADAPTATIVO NEE - CÓDIGO PRINCIPAL COMPLETO (v2.0 - AntiCaché)
   ========================================================================== */

// STATE MANAGEMENT
let currentUser = null; // Usuario autenticado
let activeMission = null; // Misión pedagógica activa
let currentSupermarket = null; // Supermercado seleccionado
let currentBasket = []; // Productos en el canasto
let userPaidAmount = 0; // Monto pagado por el alumno
let userPaidBreakdown = []; // Desglose de billetes/monedas entregados
let currentOCRProduct = null; // Producto siendo escaneado

// BASE DE DATOS LOCAL EN MEMORIA (Estado Inicial / Fallback)
let dbStores = [
    { id: 'sup1', name: 'Supermercado Central', logo: '🛒' },
    { id: 'sup2', name: 'Donde Juanito', logo: '🏪' }
];

let dbCategories = [
    { id: 'cat1', name: 'Lácteos y Quesos', icon: '🥛' },
    { id: 'cat2', name: 'Frutas y Verduras', icon: '🍎' },
    { id: 'cat3', name: 'Panadería y Pastelería', icon: '🍞' },
    { id: 'cat4', name: 'Abarrotes y Despensa', icon: '🌾' },
    { id: 'cat5', name: 'Aseo y Limpieza', icon: '🧹' }
];

let dbProducts = [
    { id: 'p1', name: 'Leche Entera 1L', categoryId: 'cat1', price: 1050, supermarketId: 'sup1', photo: '' },
    { id: 'p2', name: 'Pan Hallulla 1Kg', categoryId: 'cat3', price: 1890, supermarketId: 'sup1', photo: '' },
    { id: 'p3', name: 'Manzana Roja 1Kg', categoryId: 'cat2', price: 1200, supermarketId: 'sup1', photo: '' },
    { id: 'p4', name: 'Arroz Grado 1 1Kg', categoryId: 'cat4', price: 1450, supermarketId: 'sup1', photo: '' },
    { id: 'p5', name: 'Detergente Líquido 1L', categoryId: 'cat5', price: 2990, supermarketId: 'sup1', photo: '' }
];

let dbUsers = [
    { id: 'u1', name: 'Profesor Guía', rut: 'docente', role: 'teacher', points: 0 },
    { id: 'u2', name: 'Estudiante Demo', rut: '1234', role: 'student', points: 475 }
];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadLocalData();
    renderLoginView();
}

function loadLocalData() {
    const localUsers = localStorage.getItem('nee_users');
    if (localUsers) dbUsers = JSON.parse(localUsers);

    const localProds = localStorage.getItem('nee_products');
    if (localProds) dbProducts = JSON.parse(localProds);

    const localStores = localStorage.getItem('nee_stores');
    if (localStores) dbStores = JSON.parse(localStores);

    const localMission = localStorage.getItem('nee_active_mission');
    if (localMission) activeMission = JSON.parse(localMission);
}

function saveLocalData() {
    localStorage.setItem('nee_users', JSON.stringify(dbUsers));
    localStorage.setItem('nee_products', JSON.stringify(dbProducts));
    localStorage.setItem('nee_stores', JSON.stringify(dbStores));
    if (activeMission) localStorage.setItem('nee_active_mission', JSON.stringify(activeMission));
}

// VISTA Y NAVEGACIÓN
function goHome() {
    if (!currentUser) {
        renderLoginView();
    } else if (currentUser.role === 'teacher') {
        renderTeacherDashboard();
    } else {
        renderStudentDashboard();
    }
}

function renderLoginView() {
    currentUser = null;
    document.getElementById('userInfoHeader').innerHTML = '';
    document.getElementById('headerBasketBtn').classList.add('hidden');

    const html = `
    <div class="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 border-4 border-indigo-200 text-center space-y-6">
        <div class="text-6xl animate-bounce">🛒</div>
        <div>
            <h2 class="text-2xl font-black text-slate-800">¡Bienvenido al Supermercado!</h2>
            <p class="text-xs font-bold text-slate-500 mt-1">Ingresa tu RUT o usuario para comenzar</p>
        </div>
        <div class="space-y-4 text-left">
            <div>
                <label class="block text-xs font-black text-slate-700 uppercase mb-1">Tu RUT o Usuario:</label>
                <input type="text" id="loginRutInput" placeholder="Ej: 1234 o docente" class="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 font-bold text-sm focus:outline-none focus:border-indigo-600">
            </div>
            <button onclick="handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-indigo-900 text-base active:scale-95 transition-transform">
                🚀 INGRESAR
            </button>
        </div>
        <div class="pt-4 border-t text-xs font-bold text-slate-400">
            Unidad de Autonomía Funcional NEE
        </div>
    </div>
    `;
    document.getElementById('appContainer').innerHTML = html;
}

function handleLogin() {
    const input = document.getElementById('loginRutInput').value.trim().toLowerCase();
    if (!input) return alert('Por favor ingresa tu RUT o usuario');

    const found = dbUsers.find(u => u.rut.toLowerCase() === input || u.name.toLowerCase().includes(input));
    if (found) {
        currentUser = found;
        updateHeaderUser();
        goHome();
    } else {
        alert('Usuario no encontrado. Revisa el RUT ingresado.');
    }
}

function logout() {
    currentUser = null;
    currentBasket = [];
    renderLoginView();
}

function updateHeaderUser() {
    if (!currentUser) return;
    const infoContainer = document.getElementById('userInfoHeader');
    infoContainer.innerHTML = `
        <div class="text-right hidden sm:block">
            <p class="text-xs font-black leading-none">${currentUser.name}</p>
            <p class="text-[10px] text-indigo-200 font-bold">${currentUser.role === 'teacher' ? 'Docente' : 'Estudiante'}</p>
        </div>
        <button onclick="logout()" class="bg-indigo-800 hover:bg-indigo-900 text-white p-2 rounded-xl text-xs font-black" title="Cerrar Sesión">
            🚪 Salir
        </button>
    `;
    if (currentUser.role === 'student') {
        document.getElementById('headerBasketBtn').classList.remove('hidden');
    } else {
        document.getElementById('headerBasketBtn').classList.add('hidden');
    }
}

/* ==========================================================================
   PANEL DEL ESTUDIANTE (SIN BOTÓN MEMORICE)
   ========================================================================== */
function renderStudentDashboard() {
    const student = currentUser;
    const mission = activeMission;
    
    // Puntos y gamificación
    const points = student ? (student.points || 0) : 0;
    const targetPoints = 250;
    const progressPercent = Math.min(100, Math.round((points / targetPoints) * 100));
    
    let html = `
    <div class="space-y-5 max-w-6xl mx-auto">
        <!-- 1. BLOQUE DE MISIÓN EN AULA ACTIVA -->
        ${mission ? `
        <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-md flex justify-between items-center border-4 border-amber-300">
            <div>
                <span class="bg-black/30 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                    🔴 ¡MISIÓN EN AULA ACTIVA!
                </span>
                <h2 class="text-2xl sm:text-3xl font-black">${mission.title}</h2>
                <p class="text-xs font-bold text-amber-100 mt-1">Asignada por tu Fonoaudiología • ${mission.products ? mission.products.length : 1} productos en tu hoja impresa</p>
            </div>
            <div class="bg-slate-900/90 p-4 rounded-2xl text-center border-2 border-amber-400/50 min-w-[140px]">
                <span class="text-[10px] font-black text-amber-300 block uppercase tracking-wider">PUNTUACIÓN MISIÓN:</span>
                <span class="text-2xl font-black text-white">100%</span>
            </div>
        </div>
        ` : ''}

        <!-- 2. BARRA DE NIVEL Y PROGRESO (SIN BOTÓN DE MEMORICE A LA DERECHA) -->
        <div class="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🏆</span>
                    <div>
                        <h3 class="font-black text-slate-800 text-sm sm:text-base">Nivel 1: Comprador Principiante 🛒</h3>
                        <p class="text-xs font-bold text-slate-500">Puntos acumulados: <b class="text-amber-600">${points} pts</b> de ${targetPoints} pts para el premio</p>
                    </div>
                </div>
            </div>
            
            <div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden border p-0.5">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000" style="width: ${progressPercent}%"></div>
            </div>
        </div>

        <!-- 3. SECCIÓN DE BIENVENIDA CON CORPÓREO -->
        <div class="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex justify-between items-center min-h-[140px]">
            <div class="space-y-3 max-w-xl z-10">
                <h2 class="text-3xl font-black tracking-tight">¡Bienvenido a Comprar! 🛍️</h2>
                <p class="text-xs font-bold text-indigo-100">Selecciona una tienda para comenzar tu misión.</p>
                
                <div class="bg-white text-slate-900 p-3 rounded-2xl font-black text-xs shadow-md border-2 border-indigo-300 inline-block">
                    ¡Hola ${student ? student.name : ''}! Selecciona una tienda para comenzar tu misión.
                </div>
            </div>

            <!-- Corpóreo de Oso -->
            <div class="relative z-10 flex flex-col items-center">
                <div class="bg-white/20 backdrop-blur-md p-3 rounded-3xl border-2 border-white/40 text-center shadow-lg">
                    <span class="text-[9px] bg-purple-900 text-purple-200 font-black px-2 py-0.5 rounded-full block mb-1 uppercase">Corpóreo</span>
                    <div class="text-5xl animate-bounce">🐻</div>
                </div>
            </div>
        </div>

        <!-- 4. GRILLA DE SUPERMERCADOS DISPONIBLES -->
        <div class="space-y-3">
            <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                <span>🏪</span> <span>Supermercados Disponibles (Toca uno para entrar):</span>
            </h3>
            <div id="studentSupermarketsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Se puebla dinámicamente -->
            </div>
        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
    renderStudentSupermarkets();
}

function renderStudentSupermarkets() {
    const grid = document.getElementById('studentSupermarketsGrid');
    if (!grid) return;

    if (dbStores.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-slate-500 font-bold py-8">No hay supermercados disponibles.</p>`;
        return;
    }

    grid.innerHTML = dbStores.map(store => `
        <div onclick="selectSupermarket('${store.id}')" class="bg-white rounded-3xl p-6 border-4 border-slate-200 hover:border-indigo-500 shadow-md hover:shadow-xl transition-all cursor-pointer text-center space-y-3 group active:scale-95">
            <div class="text-6xl group-hover:scale-110 transition-transform">${store.logo || '🏪'}</div>
            <h4 class="font-black text-slate-800 text-lg">${store.name}</h4>
            <span class="inline-block bg-indigo-50 text-indigo-700 font-black text-xs px-3 py-1 rounded-full border border-indigo-200">
                Entrar a Comprar ➔
            </span>
        </div>
    `).join('');
}

function selectSupermarket(storeId) {
    currentSupermarket = dbStores.find(s => s.id === storeId);
    renderSupermarketProductsView();
}

function renderSupermarketProductsView() {
    if (!currentSupermarket) return goHome();

    const prods = dbProducts.filter(p => p.supermarketId === currentSupermarket.id || !p.supermarketId);

    const html = `
    <div class="space-y-6 max-w-5xl mx-auto">
        <div class="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div class="flex items-center gap-3">
                <button onclick="goHome()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-3 py-2 rounded-2xl text-xs active:scale-95">
                    ⬅ Volver
                </button>
                <div class="text-2xl">${currentSupermarket.logo || '🏪'}</div>
                <div>
                    <h2 class="font-black text-slate-800 text-base sm:text-lg">${currentSupermarket.name}</h2>
                    <p class="text-[11px] font-bold text-slate-400">Góndola de Productos</p>
                </div>
            </div>
            <button onclick="openBasketModal()" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-4 py-2 rounded-2xl shadow border-b-4 border-amber-600 text-xs active:scale-95">
                🧺 Canasto (${currentBasket.length})
            </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            ${prods.map(prod => {
                const inBasket = currentBasket.find(b => b.id === prod.id);
                return `
                <div class="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-md flex flex-col justify-between text-center space-y-3">
                    <div class="relative bg-slate-50 rounded-2xl p-3 h-32 flex items-center justify-center border">
                        ${prod.photo ? `<img src="${prod.photo}" class="max-h-full max-w-full object-contain rounded-xl">` : `<span class="text-4xl">📦</span>`}
                    </div>
                    <div>
                        <h4 class="font-black text-slate-800 text-xs line-clamp-2 h-8">${prod.name}</h4>
                        <p class="font-black text-emerald-700 text-sm mt-1">$${prod.price.toLocaleString('es-CL')}</p>
                    </div>
                    <div class="space-y-1.5 pt-1">
                        <button onclick="startOCRScannerForProduct('${prod.id}')" class="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black py-2 rounded-xl text-[11px] border border-indigo-200 active:scale-95 flex items-center justify-center gap-1">
                            📷 Escanear Precio
                        </button>
                        <button onclick="addToBasket('${prod.id}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs shadow border-b-2 border-emerald-900 active:scale-95">
                            ${inBasket ? `✓ En Canasto (${inBasket.qty})` : '+ Agregar'}
                        </button>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
}

/* ==========================================================================
   CANASTO Y PAGO
   ========================================================================== */
function addToBasket(prodId, customPrice = null) {
    const prod = dbProducts.find(p => p.id === prodId);
    if (!prod) return;

    const existing = currentBasket.find(b => b.id === prodId);
    const finalPrice = customPrice !== null ? customPrice : prod.price;

    if (existing) {
        existing.qty += 1;
        existing.price = finalPrice;
    } else {
        currentBasket.push({ ...prod, qty: 1, price: finalPrice });
    }

    updateBasketBadge();
    if (currentSupermarket) renderSupermarketProductsView();
}

function updateBasketBadge() {
    const totalItems = currentBasket.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('basketBadge').innerText = totalItems;
}

function openBasketModal() {
    renderBasketModalContent();
    document.getElementById('basketModal').classList.remove('hidden');
}

function closeBasketModal() {
    document.getElementById('basketModal').classList.add('hidden');
}

function renderBasketModalContent() {
    const container = document.getElementById('basketItemsList');
    const totalCLP = document.getElementById('basketTotalCLP');
    
    if (currentBasket.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-400 font-bold py-6 text-xs">Tu canasto está vacío 🧺</p>`;
        totalCLP.innerText = '$0';
        renderMoneyTray();
        return;
    }

    let total = 0;
    container.innerHTML = currentBasket.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
        <div class="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border">
            <div>
                <p class="font-black text-slate-800 text-xs">${item.name}</p>
                <p class="text-[11px] font-bold text-slate-500">$${item.price.toLocaleString('es-CL')} x ${item.qty} = <span class="text-emerald-700 font-black">$${itemTotal.toLocaleString('es-CL')}</span></p>
            </div>
            <div class="flex items-center gap-1">
                <button onclick="changeQty('${item.id}', -1)" class="bg-slate-200 text-slate-800 w-7 h-7 rounded-lg font-black text-xs active:scale-95">-</button>
                <span class="font-black text-xs px-2">${item.qty}</span>
                <button onclick="changeQty('${item.id}', 1)" class="bg-slate-200 text-slate-800 w-7 h-7 rounded-lg font-black text-xs active:scale-95">+</button>
            </div>
        </div>
        `;
    }).join('');

    totalCLP.innerText = `$${total.toLocaleString('es-CL')}`;
    renderMoneyTray();
}

function changeQty(prodId, delta) {
    const item = currentBasket.find(b => b.id === prodId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        currentBasket = currentBasket.filter(b => b.id !== prodId);
    }

    updateBasketBadge();
    renderBasketModalContent();
}

function clearBasket() {
    currentBasket = [];
    userPaidAmount = 0;
    userPaidBreakdown = [];
    updateBasketBadge();
    renderBasketModalContent();
}

function renderMoneyTray() {
    const container = document.getElementById('paymentMoneyTray');
    const breakdownContainer = document.getElementById('basketCurrencyBreakdown');
    const paidTotalDisplay = document.getElementById('userPaidTotal');

    paidTotalDisplay.innerText = `$${userPaidAmount.toLocaleString('es-CL')}`;

    breakdownContainer.innerHTML = userPaidBreakdown.length > 0 
        ? userPaidBreakdown.map(m => `<span class="bg-amber-200 text-amber-950 font-black text-[10px] px-2 py-1 rounded-lg">$${m.toLocaleString('es-CL')}</span>`).join('')
        : `<span class="text-[10px] text-amber-700 font-bold italic">Aún no entregas dinero</span>`;

    const denominations = [20000, 10000, 5000, 2000, 1000, 500, 100, 50, 10];

    container.innerHTML = denominations.map(val => `
        <button onclick="addPaymentMoney(${val})" class="bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 rounded-xl py-2 font-black text-slate-900 text-xs shadow-sm active:scale-95">
            +$${val >= 1000 ? (val/1000) + 'k' : val}
        </button>
    `).join('');
}

function addPaymentMoney(val) {
    userPaidAmount += val;
    userPaidBreakdown.push(val);
    renderMoneyTray();
}

function resetUserPayment() {
    userPaidAmount = 0;
    userPaidBreakdown = [];
    renderMoneyTray();
}

function verifyAndCheckout() {
    const total = currentBasket.reduce((acc, i) => acc + (i.price * i.qty), 0);

    if (total === 0) return alert('El canasto está vacío');
    if (userPaidAmount < total) return alert(`Te falta dinero. El total es $${total.toLocaleString('es-CL')} y has entregado $${userPaidAmount.toLocaleString('es-CL')}`);

    const vuelto = userPaidAmount - total;
    
    if (currentUser) {
        currentUser.points = (currentUser.points || 0) + 100;
        saveLocalData();
    }

    closeBasketModal();
    openCheckoutSuccessModal(total, userPaidAmount, vuelto);
}

function openCheckoutSuccessModal(total, paid, vuelto) {
    document.getElementById('successModalTotal').innerText = `$${total.toLocaleString('es-CL')}`;
    document.getElementById('successModalPaid').innerText = `$${paid.toLocaleString('es-CL')}`;
    document.getElementById('successModalVueltoAmount').innerText = `$${vuelto.toLocaleString('es-CL')}`;

    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    document.getElementById('checkoutSuccessModal').classList.remove('hidden');
}

function closeSuccessModalAndFinish() {
    document.getElementById('checkoutSuccessModal').classList.add('hidden');
    clearBasket();
    goHome();
}

/* ==========================================================================
   OCR / CÁMARA
   ========================================================================== */
function startOCRScannerForProduct(prodId) {
    currentOCRProduct = dbProducts.find(p => p.id === prodId);
    if (!currentOCRProduct) return;

    document.getElementById('aiScannerTargetTitle').innerText = currentOCRProduct.name;
    document.getElementById('scannerModal').classList.remove('hidden');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            const video = document.getElementById('aiCameraVideo');
            video.srcObject = stream;
        })
        .catch(err => {
            console.error(err);
            document.getElementById('aiScanStatusBox').innerText = "No se pudo acceder a la cámara. Puedes ingresar el precio manualmente.";
        });
}

function closeScannerModal() {
    const video = document.getElementById('aiCameraVideo');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    document.getElementById('scannerModal').classList.add('hidden');
}

function captureAndAnalyzeImageWithAI() {
    const video = document.getElementById('aiCameraVideo');
    const canvas = document.getElementById('aiCameraCanvas');
    const statusBox = document.getElementById('aiScanStatusBox');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    statusBox.innerText = "🔍 Analizando imagen con Tesseract OCR...";

    if (typeof Tesseract !== 'undefined') {
        Tesseract.recognize(canvas, 'spa', { logger: m => console.log(m) })
            .then(({ data: { text } }) => {
                closeScannerModal();
                openShelfPriceModal(text);
            })
            .catch(err => {
                console.error(err);
                closeScannerModal();
                openShelfPriceModal("");
            });
    } else {
        closeScannerModal();
        openShelfPriceModal("");
    }
}

function openShelfPriceModal(ocrText) {
    const prod = currentOCRProduct;
    if (!prod) return;

    document.getElementById('shelfPriceProdName').innerText = prod.name;
    document.getElementById('shelfPriceOriginalLabel').innerText = `$${prod.price.toLocaleString('es-CL')}`;

    const container = document.getElementById('shelfPriceButtonsContainer');
    const optionPrices = [prod.price, Math.round(prod.price * 0.9), Math.round(prod.price * 1.1), 990];

    container.innerHTML = optionPrices.map(p => `
        <button onclick="confirmShelfPriceSelection(${p})" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-black p-3 rounded-2xl text-xs active:scale-95">
            $${p.toLocaleString('es-CL')}
        </button>
    `).join('');

    document.getElementById('shelfPriceModal').classList.remove('hidden');
}

function confirmShelfPriceSelection(price) {
    document.getElementById('shelfPriceModal').classList.add('hidden');
    if (currentOCRProduct) {
        addToBasket(currentOCRProduct.id, price);
    }
}

function applyCustomShelfPrice() {
    const input = document.getElementById('shelfPriceCustomInput').value;
    const price = parseInt(input, 10);
    if (!isNaN(price) && price > 0) {
        confirmShelfPriceSelection(price);
    } else {
        alert('Por favor ingresa un precio válido');
    }
}

/* ==========================================================================
   PREMIO FÍSICO Y OTROS MODALES
   ========================================================================== */
function openPhysicalRewardModal() {
    const student = currentUser;
    document.getElementById('rewardScoreDisplay').innerText = `${student.points || 0} / 250 PTS`;
    document.getElementById('physicalRewardModal').classList.remove('hidden');
}

function confirmPhysicalRewardClaim() {
    document.getElementById('physicalRewardModal').classList.add('hidden');
}

function openViewMissionModal() {
    const container = document.getElementById('viewMissionContent');
    if (!activeMission) {
        container.innerHTML = `<p class="text-center text-slate-500 font-bold">No hay ninguna misión activa en este momento.</p>`;
    } else {
        container.innerHTML = `
            <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2">
                <h4 class="font-black text-indigo-900 text-base">${activeMission.title}</h4>
                <p class="text-xs font-bold text-indigo-700">Productos requeridos:</p>
                <ul class="list-disc list-inside text-xs font-bold text-slate-700 space-y-1">
                    ${activeMission.products ? activeMission.products.map(p => `<li>${p.name} ($${p.price.toLocaleString('es-CL')})</li>`).join('') : '<li>Producto de Misión</li>'}
                </ul>
            </div>
        `;
    }
    document.getElementById('viewMissionModal').classList.remove('hidden');
}

function closeViewMissionModal() {
    document.getElementById('viewMissionModal').classList.add('hidden');
}

/* ==========================================================================
   PANEL DOCENTE (PANEL DE PROFESORES)
   ========================================================================== */
function renderTeacherDashboard() {
    const html = `
    <div class="space-y-6 max-w-5xl mx-auto">
        <div class="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center">
            <div>
                <span class="bg-indigo-500/30 text-indigo-300 font-black text-xs px-3 py-1 rounded-full uppercase">Panel Pedagógico</span>
                <h2 class="text-2xl font-black mt-1">Gestión del Supermercado</h2>
            </div>
            <button onclick="openMissionModal()" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow border-b-4 border-emerald-700 active:scale-95">
                ➕ Crear Misión
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-3xl border-2 border-slate-200 space-y-3">
                <h3 class="font-black text-slate-800 text-base flex items-center gap-2"><span>👧👦</span> <span>Alumnos y Puntos</span></h3>
                <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                    ${dbUsers.filter(u => u.role === 'student').map(s => `
                        <div class="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border">
                            <div>
                                <p class="font-black text-slate-800 text-xs">${s.name}</p>
                                <p class="text-[10px] font-bold text-slate-400">RUT: ${s.rut}</p>
                            </div>
                            <span class="bg-amber-100 text-amber-900 font-black text-xs px-2.5 py-1 rounded-full border border-amber-300">
                                ${s.points || 0} PTS
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-2 border-slate-200 space-y-3">
                <h3 class="font-black text-slate-800 text-base flex items-center gap-2"><span>⚙️</span> <span>Administración</span></h3>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="openProductModal()" class="bg-amber-50 hover:bg-amber-100 text-amber-900 font-black p-3 rounded-2xl border border-amber-200 text-xs active:scale-95">
                        📦 Nuevo Producto
                    </button>
                    <button onclick="openSupermarketModal()" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black p-3 rounded-2xl border border-emerald-200 text-xs active:scale-95">
                        🏪 Nuevo Supermercado
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById('appContainer').innerHTML = html;
}

function openMissionModal() {
    const listContainer = document.getElementById('missionProductsSelectList');
    listContainer.innerHTML = dbProducts.map(p => `
        <label class="flex items-center gap-2 p-2 bg-white rounded-xl border cursor-pointer hover:bg-slate-50">
            <input type="checkbox" value="${p.id}" class="mission-prod-checkbox w-4 h-4 text-indigo-600 rounded">
            <span class="text-xs font-bold text-slate-800">${p.name} ($${p.price})</span>
        </label>
    `).join('');

    document.getElementById('missionModal').classList.remove('hidden');
}

function closeMissionModal() {
    document.getElementById('missionModal').classList.add('hidden');
}

function activateMissionForStudents() {
    const title = document.getElementById('missionTitleInput').value.trim();
    const checked = Array.from(document.querySelectorAll('.mission-prod-checkbox:checked')).map(cb => cb.value);

    if (!title || checked.length === 0) return alert('Por favor ingresa un título y selecciona al menos un producto.');

    const selectedProds = dbProducts.filter(p => checked.includes(p.id));

    activeMission = {
        title: title,
        products: selectedProds
    };

    saveLocalData();
    closeMissionModal();
    alert('¡Misión activada con éxito para todos los estudiantes!');
}

function openProductModal() {
    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

function openSupermarketModal() {
    document.getElementById('supermarketModal').classList.remove('hidden');
}

function closeSupermarketModal() {
    document.getElementById('supermarketModal').classList.add('hidden');
}

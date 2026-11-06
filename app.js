/* ==========================================================================
   SISTEMA DE SUPERMERCADO NEE - CORE APP LOGIC (app.js)
   ========================================================================== */

let APP_STATE = {
    currentUser: null,
    currentStore: null,
    products: [],
    cart: [],
    assignedTask: [],
    users: [
        { id: 'usr_st1', name: 'Juan Pérez', role: 'student', points: 120 },
        { id: 'usr_tc1', name: 'María Gonzalez', role: 'teacher' }
    ],
    stores: [
        { id: 'st_1', name: 'Supermercado Central', emoji: '🛒' }
    ]
};

window.APP_STATE = APP_STATE;

// Carga Inicial al Iniciar la Página
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadLocalStoreData();
    renderApp();
}

function loadLocalStoreData() {
    const savedProducts = localStorage.getItem('nee_products');
    if (savedProducts) {
        try { APP_STATE.products = JSON.parse(savedProducts); } catch(e){}
    } else {
        // Productos Base Predeterminados con photoUrl
        APP_STATE.products = [
            { id: 'p1', name: 'Leche Entera 1L', price: 1050, category: 'Lácteos', photoUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
            { id: 'p2', name: 'Manzana Roja 1kg', price: 1200, category: 'Frutas y Verduras', photoUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
            { id: 'p3', name: 'Pan Marraqueta', price: 1500, category: 'Panadería', photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
            { id: 'p4', name: 'Detergente Líquido', price: 4500, category: 'Aseo', photoUrl: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=400' }
        ];
    }

    const savedUser = localStorage.getItem('nee_current_user');
    if (savedUser) {
        try { APP_STATE.currentUser = JSON.parse(savedUser); } catch(e){}
    } else {
        APP_STATE.currentUser = APP_STATE.users[0];
    }
}

function saveLocalData() {
    localStorage.setItem('nee_products', JSON.stringify(APP_STATE.products));
    if (APP_STATE.currentUser) {
        localStorage.setItem('nee_current_user', JSON.stringify(APP_STATE.currentUser));
    }
}

function renderApp() {
    const container = document.getElementById('appContainer');
    if (!container) return;

    if (!APP_STATE.currentUser) {
        container.innerHTML = renderLoginView();
    } else if (APP_STATE.currentUser.role === 'teacher') {
        container.innerHTML = renderTeacherDashboard();
    } else {
        container.innerHTML = renderStudentDashboard();
    }
}

function renderLoginView() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 to-purple-700 select-none">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <span class="text-6xl block">🏪</span>
            <h1 class="text-2xl font-black text-slate-800">Supermercado Adaptativo NEE</h1>
            <p class="text-xs font-bold text-slate-500">Selecciona tu perfil para ingresar</p>
            <div class="space-y-3">
                <button onclick="loginAs('student')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg text-sm active:scale-95 transition-all">
                    👨‍🎓 Entrar como Estudiante
                </button>
                <button onclick="loginAs('teacher')" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg text-sm active:scale-95 transition-all">
                    👩‍🏫 Entrar como Profesor
                </button>
            </div>
        </div>
    </div>
    `;
}

function loginAs(role) {
    if (role === 'student') APP_STATE.currentUser = APP_STATE.users[0];
    else APP_STATE.currentUser = APP_STATE.users[1];
    saveLocalData();
    renderApp();
}

function logout() {
    APP_STATE.currentUser = null;
    localStorage.removeItem('nee_current_user');
    renderApp();
}

function renderStudentDashboard() {
    const user = APP_STATE.currentUser;
    return `
    <div class="max-w-5xl mx-auto p-4 space-y-6">
        <!-- Barra de Header -->
        <div class="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm flex justify-between items-center">
            <div class="flex items-center gap-3">
                <span class="text-3xl">👨‍🎓</span>
                <div>
                    <h2 class="font-black text-slate-800 text-base">${user.name}</h2>
                    <span class="text-xs font-bold text-amber-600">⭐ ${user.points || 0} Puntos acumulados</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="openAccessibilityModal()" class="bg-slate-100 hover:bg-slate-200 p-2.5 rounded-2xl text-base">♿</button>
                <button onclick="logout()" class="bg-red-50 hover:bg-red-100 text-red-600 font-black px-4 py-2 rounded-2xl text-xs">Salir</button>
            </div>
        </div>

        <!-- Banner con acceso directo a Minijuegos -->
        <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border-4 border-purple-300">
            <div>
                <span class="bg-black/30 text-amber-300 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    🎮 Centro de Aprendizaje
                </span>
                <h3 class="text-2xl sm:text-3xl font-black">Minijuegos Curriculares</h3>
                <p class="text-xs text-purple-100 mt-1 font-bold">Desarrolla tus habilidades de compra y cálculo con los desafíos Mineduc.</p>
            </div>
            <div>
                <button onclick="openMinigamesModal()" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-6 py-4 rounded-2xl shadow-lg border-b-4 border-purple-900 text-sm active:scale-95 flex items-center gap-2">
                    <span>🎮</span> <span>JUGAR MINIJUEGOS (+15 PTS)</span>
                </button>
            </div>
        </div>

        <!-- Catálogo de Productos -->
        <div class="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <h3 class="font-black text-slate-800 text-lg">🛒 Catálogo de Compras</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${APP_STATE.products.map(p => `
                    <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between items-center text-center space-y-2">
                        <img src="${p.photoUrl}" alt="${p.name}" class="w-28 h-28 object-contain rounded-xl bg-white p-2 border">
                        <span class="font-black text-slate-800 text-xs">${p.name}</span>
                        <span class="font-black text-emerald-600 text-sm">$${p.price.toLocaleString('es-CL')}</span>
                        <button onclick="addToCart('${p.id}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 rounded-xl text-xs active:scale-95">
                            + Agregar
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    `;
}

function renderTeacherDashboard() {
    return `
    <div class="max-w-5xl mx-auto p-4 space-y-6">
        <div class="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm flex justify-between items-center">
            <div class="flex items-center gap-3">
                <span class="text-3xl">👩‍🏫</span>
                <div>
                    <h2 class="font-black text-slate-800 text-base">Panel de Evaluación Docente</h2>
                    <span class="text-xs font-bold text-slate-500">Gestión NEE y Reportes Mineduc</span>
                </div>
            </div>
            <button onclick="logout()" class="bg-red-50 hover:bg-red-100 text-red-600 font-black px-4 py-2 rounded-2xl text-xs">Salir</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onclick="openManageStoresModal()" class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm text-left hover:border-indigo-500 transition-all">
                <span class="text-3xl block mb-2">🏪</span>
                <h4 class="font-black text-slate-800 text-sm">Gestionar Tiendas</h4>
                <p class="text-xs text-slate-500 mt-1">Edita tiendas y catálogo de productos.</p>
            </button>
            <button onclick="openManageUsersModal()" class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm text-left hover:border-indigo-500 transition-all">
                <span class="text-3xl block mb-2">👥</span>
                <h4 class="font-black text-slate-800 text-sm">Estudiantes</h4>
                <p class="text-xs text-slate-500 mt-1">Administra perfiles y asignaciones.</p>
            </button>
            <button onclick="openMinigamesModal()" class="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm text-left hover:border-indigo-500 transition-all">
                <span class="text-3xl block mb-2">🎮</span>
                <h4 class="font-black text-slate-800 text-sm">Arcade Mineduc</h4>
                <p class="text-xs text-slate-500 mt-1">Revisa el panel de minijuegos.</p>
            </button>
        </div>
    </div>
    `;
}

function addToCart(productId) {
    const prod = APP_STATE.products.find(p => p.id === productId);
    if (prod) {
        APP_STATE.cart.push(prod);
        alert(`✅ Se agregó "${prod.name}" al carro.`);
    }
}

// Funciones de control de modales auxiliares
function openManageStoresModal() { document.getElementById('manageStoresModal')?.classList.remove('hidden'); }
function closeManageStoresModal() { document.getElementById('manageStoresModal')?.classList.add('hidden'); }
function openManageUsersModal() { document.getElementById('manageUsersModal')?.classList.remove('hidden'); }
function closeManageUsersModal() { document.getElementById('manageUsersModal')?.classList.add('hidden'); }
function openAccessibilityModal() { document.getElementById('accessibilityModal')?.classList.remove('hidden'); }
function closeAccessibilityModal() { document.getElementById('accessibilityModal')?.classList.add('hidden'); }
function closeOCRModal() { document.getElementById('ocrModal')?.classList.add('hidden'); }
function closeStoreEditModal() { document.getElementById('storeEditModal')?.classList.add('hidden'); }
function closeProductEditModal() { document.getElementById('productEditModal')?.classList.add('hidden'); }
function closeAssignTaskModal() { document.getElementById('assignTaskModal')?.classList.add('hidden'); }
function closeChangeCalculatorModal() { document.getElementById('changeCalculatorModal')?.classList.add('hidden'); }
function closePictogramSupportModal() { document.getElementById('pictogramSupportModal')?.classList.add('hidden'); }
function closePurchaseHistoryModal() { document.getElementById('purchaseHistoryModal')?.classList.add('hidden'); }
function closeUserModal() { document.getElementById('userEditModal')?.classList.add('hidden'); }
function closeAIReportModal() { document.getElementById('aiReportModal')?.classList.add('hidden'); }

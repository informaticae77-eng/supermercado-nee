import { db } from './config.js';
import { APP_STATE, speakText } from './state.js';
import { renderAdminDashboard } from './modules/users.js';
import { updateCategoryDropdowns } from './modules/products.js';

function initFirebaseListeners() {
    const storedUser = localStorage.getItem('nee_active_user');
    if (storedUser) {
        try { APP_STATE.currentUser = JSON.parse(storedUser); } catch(e) {}
    }

    db.collection('courses').onSnapshot(s => { APP_STATE.courses = s.docs.map(d => d.data()); renderApp(); });
    db.collection('categories').onSnapshot(s => { 
        APP_STATE.categories = s.docs.map(d => d.data()); 
        updateCategoryDropdowns(); 
        renderApp(); 
    });
    db.collection('users').onSnapshot(s => { APP_STATE.users = s.docs.map(d => d.data()); renderApp(); });
    db.collection('supermarkets').onSnapshot(s => { APP_STATE.supermarkets = s.docs.map(d => d.data()); renderApp(); });
    db.collection('products').onSnapshot(s => { APP_STATE.products = s.docs.map(d => d.data()); renderApp(); });
    db.collection('evaluations').onSnapshot(s => { APP_STATE.evaluations = s.docs.map(d => d.data()); renderApp(); });
}

function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (!container) return;

    if (APP_STATE.currentUser) {
        userInfoHeader.innerHTML = `
            <div class="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-xs flex items-center gap-2">
                <span class="font-bold text-indigo-900">${APP_STATE.currentUser.name}</span>
                <span class="bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md text-[10px]">${APP_STATE.currentUser.role}</span>
            </div>
            <button onclick="window.logout()" class="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs">Salir</button>
        `;
    } else {
        userInfoHeader.innerHTML = '';
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderLoginView(container);
        return;
    }

    if (APP_STATE.currentUser.role === 'admin') {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderAdminDashboard(container);
    } else {
        container.innerHTML = `<div class="p-6 bg-white rounded-3xl border-2 font-bold text-center">Bienvenido(a) ${APP_STATE.currentUser.name}</div>`;
    }
}

function renderLoginView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white border-4 border-slate-300 rounded-3xl p-6 shadow-xl space-y-4">
            <div class="text-center space-y-1">
                <div class="text-4xl">🔐</div>
                <h2 class="text-2xl font-black text-slate-800">Acceso al Sistema</h2>
            </div>
            <div class="space-y-3">
                <input type="text" id="loginUser" placeholder="RUT (ej: 12345678-9)" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold">
                <input type="password" id="loginPin" placeholder="Clave / PIN" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-center text-xl tracking-widest font-black">
                <p id="loginError" class="text-xs font-bold text-rose-600 hidden text-center">Datos incorrectos.</p>
                <button onclick="window.handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl text-lg shadow">Ingresar</button>
            </div>
        </div>
    `;
}

window.handleLogin = () => {
    const userVal = document.getElementById('loginUser').value.trim().toLowerCase();
    const pinVal = document.getElementById('loginPin').value.trim();
    const user = APP_STATE.users.find(u => (u.rut && u.rut.toLowerCase() === userVal) || (u.username && u.username.toLowerCase() === userVal));
    if (user && user.pin === pinVal) {
        APP_STATE.currentUser = user;
        localStorage.setItem('nee_active_user', JSON.stringify(user));
        speakText(`Bienvenido ${user.name}`);
        renderApp();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
};

window.logout = () => {
    APP_STATE.currentUser = null;
    localStorage.removeItem('nee_active_user');
    renderApp();
};

window.goHome = () => { renderApp(); };

initFirebaseListeners();

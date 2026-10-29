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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const EMAILJS_CONFIG = {
    publicKey: "smzqxkKPlFcTigatD",
    serviceId: "service_omucoeg",
    templateId: "template_vyzp71o"
};

if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const APP_STATE = {
    currentUser: null,
    selectedSupermarketId: null,
    adminCourseFilter: 'all',
    selectedCategoryFilter: 'all',
    basket: [],
    userPaidAmount: 0,
    courses: [],
    categories: [],
    users: [],
    supermarkets: [],
    products: [],
    evaluations: [],
    customCurrencies: {},
    pdfTemplate: {
        institutionName: "Escuela Especial NEE Chile",
        headerTitle: "INFORME DE EVALUACIÓN PEDAGÓGICA Y COGNITIVA",
        footerText: "Documento oficial del Equipo Multidisciplinario PIE",
        primaryColor: "#3730a3",
        logoUrl: ""
    },
    telemetry: {
        voiceHelpCount: 0,
        paymentResetsCount: 0
    },
    missionActive: false,
    missionStartTime: null,
    missionTimerInterval: null,
    missionElapsedSeconds: 0,
    foundProductIds: [],
    currentScanningProductId: null
};

let cameraStream = null;
let currencyCameraStream = null;
let aiScannerStream = null;

// ==========================================
// CONTROLADORES DE ERRORES DE CARGA DE IMÁGENES
// ==========================================
function handleImageError(imgEl, emoji) {
    if (!imgEl) return;
    const fallbackEmoji = emoji || '🛒';
    imgEl.outerHTML = `<span class="text-5xl">${fallbackEmoji}</span>`;
}

function handleProductImageError(imgEl, emoji) {
    if (!imgEl) return;
    const fallbackEmoji = emoji || '📦';
    if (imgEl.parentElement) {
        imgEl.parentElement.innerHTML = `<div class="bg-amber-100 p-4 rounded-2xl text-4xl border-2 border-amber-300 flex items-center justify-center shrink-0">${fallbackEmoji}</div>`;
    }
}

function handleBasketItemImageError(imgEl, emoji) {
    if (!imgEl) return;
    const fallbackEmoji = emoji || '📦';
    if (imgEl.parentElement) {
        imgEl.parentElement.innerHTML = `<span class="text-2xl">${fallbackEmoji}</span>`;
    }
}

function getUserCourseIds(user) {
    if (!user) return [];
    if (Array.isArray(user.courseIds) && user.courseIds.length > 0) return user.courseIds;
    if (user.courseId) return [user.courseId];
    return [];
}

function getCategoryIcon(catName) {
    if (!catName) return '🏷️';
    const catObj = (APP_STATE.categories || []).find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (catObj && catObj.icon) return catObj.icon;
    
    const lower = catName.toLowerCase();
    if (lower.includes('limpieza')) return '🧹';
    if (lower.includes('lácteo') || lower.includes('lacteo')) return '🥛';
    if (lower.includes('panader')) return '🥖';
    if (lower.includes('fruta') || lower.includes('verdura')) return '🍎';
    if (lower.includes('bebida') || lower.includes('jugo')) return '🧃';
    if (lower.includes('snack') || lower.includes('dulce')) return '🍪';
    if (lower.includes('despensa') || lower.includes('abarrote')) return '🥫';
    return '🏷️';
}

// ==========================================
// MONEDAS Y BILLETES CHILENOS (CLP)
// ==========================================
const CLP_CURRENCY_ITEMS = [
    { id: 'b20k', value: 20000, type: 'bill', name: 'Billete $20.000', color: '#E65100', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/20000_pesos_chilenos_2010_anverso.jpg/320px-20000_pesos_chilenos_2010_anverso.jpg' },
    { id: 'b10k', value: 10000, type: 'bill', name: 'Billete $10.000', color: '#0D47A1', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/10000_pesos_chilenos_2010_anverso.jpg/320px-10000_pesos_chilenos_2010_anverso.jpg' },
    { id: 'b5k',  value: 5000,  type: 'bill', name: 'Billete $5.000',  color: '#C62828', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/5000_pesos_chilenos_2009_anverso.jpg/320px-5000_pesos_chilenos_2009_anverso.jpg' },
    { id: 'b2k',  value: 2000,  type: 'bill', name: 'Billete $2.000',  color: '#6A1B9A', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2000_pesos_chilenos_2009_anverso.jpg/320px-2000_pesos_chilenos_2009_anverso.jpg' },
    { id: 'b1k',  value: 1000,  type: 'bill', name: 'Billete $1.000',  color: '#2E7D32', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/1000_pesos_chilenos_2011_anverso.jpg/320px-1000_pesos_chilenos_2011_anverso.jpg' },
    { id: 'c500', value: 500,   type: 'coin', name: 'Moneda $500',    color: '#D97706', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/500_pesos_chilenos_anverso.png/220px-500_pesos_chilenos_anverso.png' },
    { id: 'c100', value: 100,   type: 'coin', name: 'Moneda $100',    color: '#F59E0B', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/100_pesos_chilenos_anverso.png/220px-100_pesos_chilenos_anverso.png' },
    { id: 'c50',  value: 50,    type: 'coin', name: 'Moneda $50',     color: '#EAB308', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/50_pesos_chilenos_anverso.png/220px-10_pesos_chilenos_anverso.png' },
    { id: 'c10',  value: 10,    type: 'coin', name: 'Moneda $10',     color: '#D97706', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/10_pesos_chilenos_anverso.png/220px-10_pesos_chilenos_anverso.png' }
];

const DEFAULT_COURSES = [
    { id: 'c-1', name: '1° Básico NEE' },
    { id: 'c-2', name: 'Taller Laboral A' }
];

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Lácteos', icon: '🥛' },
    { id: 'cat-2', name: 'Limpieza', icon: '🧹' },
    { id: 'cat-3', name: 'Frutas y Verduras', icon: '🍎' },
    { id: 'cat-4', name: 'Panadería', icon: '🥖' },
    { id: 'cat-5', name: 'Snacks y Dulces', icon: '🍪' },
    { id: 'cat-6', name: 'Despensa', icon: '🥫' }
];

const DEFAULT_USERS = [
    { id: 'u-admin', username: '11111111-1', rut: '11111111-1', pin: '1234', name: 'Administrador General', role: 'admin', email: 'admin@escuela.cl', photoUrl: '', mustChangePassword: false },
    { id: 'u-edu1', username: '12345678-9', rut: '12345678-9', pin: '1234', name: 'Profe María', role: 'teacher', courseIds: ['c-1', 'c-2'], email: 'maria.profe@escuela.cl', photoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ProfeMaria', mustChangePassword: false },
    { id: 'u-alum1', username: '23456789-0', rut: '23456789-0', pin: '2345', name: 'Juanito Pérez', role: 'student', courseId: 'c-1', email: 'apoderado.juanito@escuela.cl', photoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Juanito', mustChangePassword: false }
];

const DEFAULT_SUPERMARKETS = [
    { id: 'sup-lider', name: 'Super Lider', themeColor: 'bg-sky-600', textColor: 'text-sky-600', borderColor: 'border-sky-500', icon: '🛒', photoUrl: '', description: 'Gran variedad de alimentos' },
    { id: 'sup-jumbo', name: 'Jumbo Frut', themeColor: 'bg-emerald-600', textColor: 'text-emerald-600', borderColor: 'border-emerald-500', icon: '🍏', photoUrl: '', description: 'Frutas y verduras frescas' },
    { id: 'sup-unimarc', name: 'Unimarcito', themeColor: 'bg-rose-600', textColor: 'text-rose-600', borderColor: 'border-rose-500', icon: '🍓', photoUrl: '', description: 'Compras diarias' },
    { id: 'sup-barrio', name: 'Almacén del Barrio', themeColor: 'bg-amber-600', textColor: 'text-amber-600', borderColor: 'border-amber-500', icon: '🏪', photoUrl: '', description: 'Negocio cercano' }
];

const DEFAULT_PRODUCTS = [
    { id: 'prod-1', supermarketId: 'sup-lider', name: 'Caja de Leche Entera Soprole', category: 'Lácteos', price: 1100, iconEmoji: '🥛', photoUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
    { id: 'prod-2', supermarketId: 'sup-lider', name: 'Cloro Gel Multiuso', category: 'Limpieza', price: 1800, iconEmoji: '🧹', photoUrl: '' },
    { id: 'prod-3', supermarketId: 'sup-lider', name: 'Kilo de Manzanas', category: 'Frutas y Verduras', price: 1500, iconEmoji: '🍎', photoUrl: '' },
    { id: 'prod-4', supermarketId: 'sup-lider', name: 'Pan Marraqueta (1 Kg)', category: 'Panadería', price: 2000, iconEmoji: '🥖', photoUrl: '' },
    { id: 'prod-5', supermarketId: 'sup-jumbo', name: 'Detergente Líquido', category: 'Limpieza', price: 4500, iconEmoji: '🧼', photoUrl: '' },
    { id: 'prod-6', supermarketId: 'sup-jumbo', name: 'Queso Mantecoso 250g', category: 'Lácteos', price: 2500, iconEmoji: '🧀', photoUrl: '' },
    { id: 'prod-7', supermarketId: 'sup-unimarc', name: 'Yogurt Frutilla Soprole', category: 'Lácteos', price: 450, iconEmoji: '🍓', photoUrl: '' },
    { id: 'prod-8', supermarketId: 'sup-unimarc', name: 'Paquete de Galletas', category: 'Snacks y Dulces', price: 800, iconEmoji: '🍪', photoUrl: '' }
];

// ==========================================
// ESCUCHADORES DE FIRESTORE EN TIEMPO REAL
// ==========================================
function initFirebaseListeners() {
    const storedUser = localStorage.getItem('nee_active_user');
    if (storedUser) {
        try { APP_STATE.currentUser = JSON.parse(storedUser); } catch(e) {}
    }

    db.collection('courses').onSnapshot(snapshot => {
        if (snapshot.empty) {
            DEFAULT_COURSES.forEach(c => db.collection('courses').doc(c.id).set(c));
        } else {
            APP_STATE.courses = snapshot.docs.map(doc => doc.data());
            renderApp();
        }
    });

    db.collection('categories').onSnapshot(snapshot => {
        if (snapshot.empty) {
            DEFAULT_CATEGORIES.forEach(c => db.collection('categories').doc(c.id).set(c));
        } else {
            APP_STATE.categories = snapshot.docs.map(doc => doc.data());
            renderApp();
        }
    });

    db.collection('users').onSnapshot(snapshot => {
        if (snapshot.empty) {
            DEFAULT_USERS.forEach(u => db.collection('users').doc(u.id).set(u));
        } else {
            APP_STATE.users = snapshot.docs.map(doc => doc.data());
            if (APP_STATE.currentUser) {
                const updatedCur = APP_STATE.users.find(u => u.id === APP_STATE.currentUser.id);
                if (updatedCur) APP_STATE.currentUser = updatedCur;
            }
            renderApp();
        }
    });

    db.collection('supermarkets').onSnapshot(snapshot => {
        if (snapshot.empty) {
            DEFAULT_SUPERMARKETS.forEach(s => db.collection('supermarkets').doc(s.id).set(s));
        } else {
            APP_STATE.supermarkets = snapshot.docs.map(doc => doc.data());
            renderApp();
        }
    });

    db.collection('products').onSnapshot(snapshot => {
        if (snapshot.empty) {
            DEFAULT_PRODUCTS.forEach(p => db.collection('products').doc(p.id).set(p));
        } else {
            APP_STATE.products = snapshot.docs.map(doc => doc.data());
            renderApp();
        }
    });

    db.collection('evaluations').onSnapshot(snapshot => {
        APP_STATE.evaluations = snapshot.docs.map(doc => doc.data());
        renderApp();
    });

    db.collection('currencies').onSnapshot(snapshot => {
        const map = {};
        snapshot.docs.forEach(doc => { map[doc.id] = doc.data().photoUrl; });
        APP_STATE.customCurrencies = map;
        renderApp();
    });

    db.collection('settings').doc('pdfReport').onSnapshot(doc => {
        if (doc.exists) {
            APP_STATE.pdfTemplate = doc.data();
        } else {
            APP_STATE.pdfTemplate = {
                institutionName: "Escuela Especial NEE Chile",
                headerTitle: "INFORME DE EVALUACIÓN PEDAGÓGICA Y COGNITIVA",
                footerText: "Documento oficial del Equipo Multidisciplinario PIE",
                primaryColor: "#3730a3",
                logoUrl: ""
            };
        }
        renderApp();
    });
}

function sendAutomaticCredentialsEmail(user) {
    if (!user || !user.email) return;

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);

        const params = {
            to_email: user.email,
            email: user.email,
            reply_to: user.email,
            to_name: user.name,
            user_rut: user.rut,
            user_pin: user.pin,
            app_url: "https://informaticae77-eng.github.io/supermercado-nee/"
        };

        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            params,
            EMAILJS_CONFIG.publicKey
        ).catch(err => console.error("Error EmailJS:", err));
    }
}

// ==========================================
// FUNCIONES DE SÍNTESIS DE VOZ Y AUDIO
// ==========================================
function cleanTextForSpeech(text) {
    if (!text) return '';
    return text.replace(/\$/g, ' ').replace(/\bCLP\b/gi, ' ').replace(/\bchilenos?\b/gi, ' ').replace(/\bpesos\s+pesos\b/gi, 'pesos').replace(/\s+/g, ' ').trim();
}

function speakText(text) {
    if (APP_STATE && APP_STATE.telemetry) {
        APP_STATE.telemetry.voiceHelpCount++;
    }
    if (!('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const cleanText = cleanTextForSpeech(text);
        if (!cleanText) return;
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'es-CL';
            utterance.rate = 0.88;
            const voices = window.speechSynthesis.getVoices();
            const spanishVoice = voices.find(v => v.lang === 'es-CL') || voices.find(v => v.lang.startsWith('es'));
            if (spanishVoice) utterance.voice = spanishVoice;
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
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
}

function getInitialPinFromRut(rutString) {
    if (!rutString) return '1234';
    const cleanDigits = rutString.replace(/[^0-9]/g, '');
    return cleanDigits.length >= 4 ? cleanDigits.substring(0, 4) : '1234';
}

// ==========================================
// RENDERIZADO Y RUTEO PRINCIPAL DE LA APP
// ==========================================
function renderApp() {
    const container = document.getElementById('appContainer');
    const headerBasketBtn = document.getElementById('headerBasketBtn');
    const userInfoHeader = document.getElementById('userInfoHeader');

    if (!container) return;

    if (APP_STATE.currentUser) {
        const roleTag = APP_STATE.currentUser.role === 'admin' ? '🔑 Admin' :
                       (APP_STATE.currentUser.role === 'teacher' ? '👨‍🏫 Educador' : '🎒 Alumno');
        
        const userPhoto = APP_STATE.currentUser.photoUrl 
            ? `<img src="${APP_STATE.currentUser.photoUrl}" class="w-8 h-8 rounded-full border-2 border-indigo-500 object-cover">`
            : `<span class="text-xl">👤</span>`;

        userInfoHeader.innerHTML = `
            <div class="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-xs flex items-center gap-2 shadow-sm">
                ${userPhoto}
                <span class="font-bold text-indigo-900">${APP_STATE.currentUser.name}</span>
                <span class="bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md text-[10px]">${roleTag}</span>
            </div>
            <button onclick="logout()" class="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-300">
                Salir
            </button>
        `;
    } else {
        userInfoHeader.innerHTML = '';
    }

    if (!APP_STATE.currentUser) {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderLoginView(container);
        return;
    }

    if (APP_STATE.currentUser.mustChangePassword) {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderForcePasswordChangeView(container);
        return;
    }

    if (APP_STATE.currentUser.role === 'admin') {
        if (headerBasketBtn) headerBasketBtn.classList.add('hidden');
        renderAdminDashboard(container);
    } else if (APP_STATE.currentUser.role === 'teacher') {
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
    let html = `
        <div class="max-w-md mx-auto bg-white border-4 border-slate-300 rounded-3xl p-6 shadow-xl space-y-6">
            <div class="text-center space-y-2">
                <div class="text-5xl">🔐</div>
                <h2 class="text-2xl font-black text-slate-800">Iniciar Sesión</h2>
                <p class="text-xs font-semibold text-slate-500">Ingresa tu RUT (o Usuario) y tu PIN / Clave</p>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">RUT o Usuario:</label>
                    <input type="text" id="loginUser" placeholder="Ej: 12345678-9 o admin" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:outline-none font-bold">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Clave / PIN:</label>
                    <input type="password" id="loginPin" placeholder="••••" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:outline-none text-center text-xl tracking-widest font-black">
                </div>
                <p id="loginError" class="text-xs font-bold text-rose-600 hidden text-center">RUT o clave incorrecta.</p>
                <button onclick="handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow active:scale-95 text-lg">
                    Ingresar
                </button>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function handleLogin() {
    const userVal = document.getElementById('loginUser').value.trim().toLowerCase();
    const pinVal = document.getElementById('loginPin').value.trim();

    const user = APP_STATE.users.find(u => 
        (u.rut && u.rut.toLowerCase() === userVal) || 
        (u.username && u.username.toLowerCase() === userVal)
    );

    if (user && user.pin === pinVal) {
        APP_STATE.currentUser = user;
        localStorage.setItem('nee_active_user', JSON.stringify(user));
        speakText(`Bienvenido ${user.name}`);
        renderApp();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
}

function renderForcePasswordChangeView(container) {
    let html = `
        <div class="max-w-md mx-auto bg-amber-50 border-4 border-amber-400 rounded-3xl p-6 shadow-xl space-y-5">
            <div class="text-center space-y-2">
                <div class="text-5xl">🔑</div>
                <h2 class="text-2xl font-black text-amber-950">Cambio Obligatorio de Clave</h2>
                <p class="text-xs font-bold text-amber-800">
                    Hola <strong>${APP_STATE.currentUser.name}</strong>. Por seguridad, debes ingresar una nueva clave personal.
                </p>
            </div>

            <div class="space-y-4 bg-white p-4 rounded-2xl border-2 border-amber-200">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nueva Clave Personal / PIN:</label>
                    <input type="password" id="newPinInput" placeholder="Mínimo 4 caracteres" class="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl font-bold focus:border-amber-500 focus:outline-none text-center text-lg">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmar Nueva Clave:</label>
                    <input type="password" id="confirmPinInput" placeholder="Repite la clave" class="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl font-bold focus:border-amber-500 focus:outline-none text-center text-lg">
                </div>
                <p id="changePinError" class="text-xs font-bold text-rose-600 hidden text-center"></p>
            </div>

            <button onclick="saveNewPersonalPassword()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl border-b-4 border-emerald-800 shadow active:scale-95 text-base">
                Guardar Nueva Clave e Ingresar
            </button>
        </div>
    `;
    container.innerHTML = html;
}

function saveNewPersonalPassword() {
    const p1 = document.getElementById('newPinInput').value.trim();
    const p2 = document.getElementById('confirmPinInput').value.trim();
    const errEl = document.getElementById('changePinError');

    if (p1.length < 4) {
        errEl.textContent = "La clave debe tener al menos 4 caracteres.";
        errEl.classList.remove('hidden');
        return;
    }
    if (p1 !== p2) {
        errEl.textContent = "Las claves no coinciden.";
        errEl.classList.remove('hidden');
        return;
    }

    db.collection('users').doc(APP_STATE.currentUser.id).update({
        pin: p1,
        mustChangePassword: false
    }).then(() => {
        APP_STATE.currentUser.pin = p1;
        APP_STATE.currentUser.mustChangePassword = false;
        localStorage.setItem('nee_active_user', JSON.stringify(APP_STATE.currentUser));
        alert("¡Clave actualizada con éxito en la nube!");
        renderApp();
    });
}

function logout() {
    APP_STATE.currentUser = null;
    APP_STATE.selectedSupermarketId = null;
    localStorage.removeItem('nee_active_user');
    renderApp();
}

// ==========================================
// PANEL DE ADMINISTRACIÓN
// ==========================================
function renderAdminDashboard(container) {
    let html = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 class="text-2xl font-black">👑 Panel de Administración (Nube ☁️)</h2>
                    <p class="text-xs text-indigo-200 mt-1">Gestión completa en tiempo real de Cursos, Educadores, Alumnos, Fotos, Claves y Plantillas PDF.</p>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="bg-indigo-800 px-3 py-1.5 rounded-xl border border-indigo-700 flex items-center gap-2">
                        <label class="text-xs font-bold uppercase text-indigo-200">Filtrar por Curso:</label>
                        <select id="adminCourseFilter" onchange="filterAdminByCourse(this.value)" class="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-lg focus:outline-none">
                            <option value="all" ${APP_STATE.adminCourseFilter === 'all' ? 'selected' : ''}>Todos los Cursos</option>
                            ${APP_STATE.courses.map(c => `<option value="${c.id}" ${APP_STATE.adminCourseFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-school text-indigo-600"></i> Cursos</h3>
                        <button onclick="addNewCoursePrompt()" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Curso</button>
                    </div>
                    <div class="space-y-2">
    `;

    APP_STATE.courses.forEach(c => {
        const countStudents = APP_STATE.users.filter(u => u.role === 'student' && u.courseId === c.id).length;
        html += `
            <div class="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-sm">
                <div>
                    <span class="font-black text-slate-800 block">${c.name}</span>
                    <span class="text-[10px] text-slate-500 font-bold">${countStudents} alumnos</span>
                </div>
                <button onclick="deleteCourse('${c.id}')" class="text-rose-600 font-bold text-xs">Eliminar</button>
            </div>
        `;
    });

    html += `
                    </div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-chalkboard-user text-indigo-600"></i> Educadores</h3>
                        <button onclick="openCreateUserModal('teacher')" class="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Educador</button>
                    </div>
                    <div class="space-y-2">
    `;

    let teachers = APP_STATE.users.filter(u => u.role === 'teacher');
    if (APP_STATE.adminCourseFilter !== 'all') {
        teachers = teachers.filter(t => getUserCourseIds(t).includes(APP_STATE.adminCourseFilter));
    }

    teachers.forEach(t => {
        const teacherCourseIds = getUserCourseIds(t);
        const assignedCourses = teacherCourseIds.map(id => APP_STATE.courses.find(c => c.id === id)?.name || '').filter(Boolean).join(', ');
        const photoImg = t.photoUrl ? `<img src="${t.photoUrl}" class="w-9 h-9 rounded-full object-cover border-2 border-indigo-500">` : `<div class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">👨‍🏫</div>`;
        html += `
            <div class="p-3 bg-slate-50 border rounded-xl space-y-2 text-sm">
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                        ${photoImg}
                        <div>
                            <span class="font-black text-slate-800 block">${t.name}</span>
                            <span class="text-[11px] text-slate-500 font-bold">RUT: ${t.rut || 'Sin RUT'}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="openEditUserModal('${t.id}')" title="Editar" class="text-amber-600 hover:bg-amber-100 p-1 rounded font-bold text-xs">✏️</button>
                        <button onclick="deleteUser('${t.id}')" title="Eliminar" class="text-rose-600 hover:bg-rose-100 p-1 rounded font-bold text-xs">✕</button>
                    </div>
                </div>
                <div class="text-[11px] bg-white p-2 rounded-lg border space-y-1">
                    <div>📧 Correo: <span class="font-bold text-indigo-900">${t.email || 'No asignado'}</span></div>
                    <div>🔑 Clave actual: <code class="bg-slate-100 px-1 font-bold">${t.pin}</code></div>
                    <div class="text-[10px] text-indigo-700 font-bold">Cursos: ${assignedCourses || 'Ninguno'}</div>
                </div>
                <div class="flex gap-2 pt-1">
                    <button onclick="resetUserPassword('${t.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-1 rounded text-xs flex-1">🔄 Clave</button>
                    <button onclick="sendAutomaticCredentialsEmail(APP_STATE.users.find(u=>u.id==='${t.id}'))" class="bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold px-2 py-1 rounded text-xs flex-1">✉️ Correo</button>
                </div>
            </div>
        `;
    });

    html += `
                    </div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-children text-indigo-600"></i> Alumnos</h3>
                        <button onclick="openCreateUserModal('student')" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Alumno</button>
                    </div>
                    <div class="space-y-2">
    `;

    let students = APP_STATE.users.filter(u => u.role === 'student');
    if (APP_STATE.adminCourseFilter !== 'all') {
        students = students.filter(s => s.courseId === APP_STATE.adminCourseFilter);
    }

    students.forEach(s => {
        const courseName = APP_STATE.courses.find(c => c.id === s.courseId)?.name || 'Sin curso';
        const studentPhoto = s.photoUrl ? `<img src="${s.photoUrl}" class="w-9 h-9 rounded-full object-cover border-2 border-emerald-500">` : `<div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">🎒</div>`;
        html += `
            <div class="p-3 bg-slate-50 border rounded-xl space-y-2 text-sm">
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                        ${studentPhoto}
                        <div>
                            <span class="font-black text-slate-800 block">${s.name}</span>
                            <span class="text-[11px] text-slate-500 font-bold">RUT: ${s.rut || 'Sin RUT'}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="openEditUserModal('${s.id}')" title="Editar" class="text-amber-600 hover:bg-amber-100 p-1 rounded font-bold text-xs">✏️</button>
                        <button onclick="deleteUser('${s.id}')" title="Eliminar" class="text-rose-600 hover:bg-rose-100 p-1 rounded font-bold text-xs">✕</button>
                    </div>
                </div>
                <div class="text-[11px] bg-white p-2 rounded-lg border space-y-1">
                    <div>📧 Correo Apoderado: <span class="font-bold text-emerald-900">${s.email || 'No asignado'}</span></div>
                    <div>🔑 Clave actual: <code class="bg-slate-100 px-1 font-bold">${s.pin}</code></div>
                    <div class="text-[10px] text-emerald-700 font-bold">Curso: ${courseName}</div>
                </div>
                <div class="flex gap-2 pt-1">
                    <button onclick="resetUserPassword('${s.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-1 rounded text-xs flex-1">🔄 Clave</button>
                    <button onclick="sendAutomaticCredentialsEmail(APP_STATE.users.find(u=>u.id==='${s.id}'))" class="bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold px-2 py-1 rounded text-xs flex-1">✉️ Correo</button>
                </div>
            </div>
        `;
    });

    html += `
                    </div>
                </div>
            </div>
    `;

    const pdfTpl = APP_STATE.pdfTemplate || {
        institutionName: "Escuela Especial NEE",
        headerTitle: "INFORME DE EVALUACIÓN PEDAGÓGICA Y COGNITIVA",
        footerText: "Documento oficial del Equipo Multidisciplinario PIE",
        primaryColor: "#3730a3",
        logoUrl: ""
    };

    html += `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow space-y-4 mt-6">
            <div class="flex justify-between items-center border-b pb-2">
                <h3 class="font-black text-lg text-indigo-950 flex items-center gap-2">
                    <i class="fa-solid fa-file-pdf text-rose-600"></i>
                    <span>Configuración de Plantilla de Informes PDF</span>
                </h3>
                <span class="text-xs bg-indigo-100 text-indigo-900 font-bold px-3 py-1 rounded-full">Formato Oficial</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                    <label class="block uppercase text-slate-600 mb-1">Nombre de la Escuela / Institución:</label>
                    <input type="text" id="pdfInstName" value="${pdfTpl.institutionName || ''}" class="w-full px-3 py-2 border-2 border-slate-300 rounded-xl">
                </div>
                <div>
                    <label class="block uppercase text-slate-600 mb-1">Título Encabezado del Documento:</label>
                    <input type="text" id="pdfHeaderTitle" value="${pdfTpl.headerTitle || ''}" class="w-full px-3 py-2 border-2 border-slate-300 rounded-xl">
                </div>
                <div>
                    <label class="block uppercase text-slate-600 mb-1">Texto al Pie de Página:</label>
                    <input type="text" id="pdfFooterText" value="${pdfTpl.footerText || ''}" class="w-full px-3 py-2 border-2 border-slate-300 rounded-xl">
                </div>
                <div>
                    <label class="block uppercase text-slate-600 mb-1">Color Principal Encabezado:</label>
                    <input type="color" id="pdfPrimaryColor" value="${pdfTpl.primaryColor || '#3730a3'}" class="w-full h-10 p-1 border-2 border-slate-300 rounded-xl cursor-pointer">
                </div>
            </div>

            <div class="border-t pt-3 space-y-2 text-xs font-bold">
                <label class="block uppercase text-slate-600">Logo Institucional para el PDF:</label>
                <div class="flex items-center gap-4">
                    <div id="pdfLogoPreviewContainer" class="${pdfTpl.logoUrl ? '' : 'hidden'} w-20 h-20 bg-slate-50 border-2 border-indigo-300 rounded-2xl flex items-center justify-center p-1">
                        <img id="pdfLogoPreview" src="${pdfTpl.logoUrl || ''}" class="max-h-full max-w-full object-contain">
                    </div>
                    <div class="space-y-2">
                        <input type="file" id="pdfLogoInput" accept="image/*" onchange="handlePdfLogoUpload(event)" class="hidden">
                        <button type="button" onclick="document.getElementById('pdfLogoInput').click()" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black px-4 py-2 rounded-xl border border-indigo-300 shadow-sm">
                            📷 Subir Logo Institucional
                        </button>
                        <input type="hidden" id="pdfLogoUrl" value="${pdfTpl.logoUrl || ''}">
                    </div>
                </div>
            </div>

            <button onclick="savePdfTemplateSettings()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-xl border-b-4 border-emerald-900 shadow active:scale-95 text-xs">
                💾 Guardar Formato de PDF en la Nube
            </button>
        </div>
    `;

    html += `</div>`;
    container.innerHTML = html;
}

function filterAdminByCourse(courseId) {
    APP_STATE.adminCourseFilter = courseId;
    renderAdminDashboard(document.getElementById('appContainer'));
}

// ==========================================
// PANEL DEL EDUCADOR Y EVALUACIÓN
// ==========================================
function renderTeacherDashboard(container) {
    const myCourseIds = getUserCourseIds(APP_STATE.currentUser);
    const myCourses = APP_STATE.courses.filter(c => myCourseIds.includes(c.id));
    const totalEvals = APP_STATE.evaluations.length;

    const avgTime = totalEvals > 0 
        ? Math.round(APP_STATE.evaluations.reduce((acc, e) => acc + (e.timeSeconds || 0), 0) / totalEvals) 
        : 0;

    let html = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4 border-b-4 border-indigo-700">
                <div>
                    <h2 class="text-2xl font-black flex items-center gap-2">
                        <i class="fa-solid fa-chart-line text-amber-400"></i>
                        <span>Centro de Evaluación y Métrica NEE</span>
                    </h2>
                    <p class="text-xs text-indigo-200 mt-1">Monitoreo de funciones cognitivas, autonomía funcional e informes generativos con IA.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="openTeacherCourseModal()" class="bg-indigo-700 hover:bg-indigo-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 border border-indigo-500">
                        <i class="fa-solid fa-list-check"></i>
                        <span>Mis Cursos</span>
                    </button>
                    <button onclick="openCreateUserModal('student')" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-3.5 py-2 rounded-xl shadow">+ Crear Alumno</button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-2xl border-2 border-indigo-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-slate-500 uppercase block">Compras Registradas</span>
                        <span class="text-2xl font-black text-indigo-950">${totalEvals}</span>
                    </div>
                    <div class="bg-indigo-100 text-indigo-600 p-3 rounded-xl text-xl">🛍️</div>
                </div>
                <div class="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-slate-500 uppercase block">Promedio de Búsqueda</span>
                        <span class="text-2xl font-black text-emerald-700">${Math.floor(avgTime / 60)}m ${avgTime % 60}s</span>
                    </div>
                    <div class="bg-emerald-100 text-emerald-600 p-3 rounded-xl text-xl">⏱️</div>
                </div>
                <div class="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-xs font-extrabold text-slate-500 uppercase block">Alumnos Activos</span>
                        <span class="text-2xl font-black text-amber-900">${APP_STATE.users.filter(u => u.role === 'student').length}</span>
                    </div>
                    <div class="bg-amber-100 text-amber-600 p-3 rounded-xl text-xl">🎒</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-lg text-indigo-950 flex items-center gap-2">
                        <i class="fa-solid fa-clipboard-user text-indigo-600"></i>
                        <span>Historial de Compras y Telemetría Automatizada</span>
                    </h3>
                </div>

                <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
    `;

    if (totalEvals === 0) {
        html += `<p class="text-xs font-bold text-slate-400 italic text-center py-6">No hay registros de compras acumuladas.</p>`;
    } else {
        APP_STATE.evaluations.slice().reverse().forEach(ev => {
            const student = APP_STATE.users.find(u => u.id === ev.studentId);
            const course = APP_STATE.courses.find(c => c.id === ev.courseId);
            const itemsText = (ev.items || []).map(i => `${i.quantity}x ${i.productName}`).join(', ');
            const timeStr = ev.timeSeconds ? `${Math.floor(ev.timeSeconds / 60)}m ${ev.timeSeconds % 60}s` : 'N/A';
            const voiceCount = ev.telemetry ? (ev.telemetry.voiceHelpCount || 0) : 0;
            const resetCount = ev.telemetry ? (ev.telemetry.paymentResetsCount || 0) : 0;

            html += `
                <div class="p-4 bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 rounded-2xl flex flex-wrap justify-between items-center text-xs gap-3 transition-all">
                    <div class="space-y-1.5 flex-1 min-w-[240px]">
                        <div class="font-black text-indigo-950 text-sm flex items-center gap-2">
                            <span>🎒 ${ev.studentName || (student ? student.name : 'Estudiante')}</span>
                            <span class="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md text-[10px] font-bold">${course ? course.name : 'Curso'}</span>
                        </div>
                        <div class="text-slate-600 font-medium">📦 Compró: <span class="font-bold text-slate-800">${itemsText || 'Sin detalle'}</span></div>
                        
                        <div class="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-bold">
                            <span class="bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md">🔊 Usos de Voz: ${voiceCount}</span>
                            <span class="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md">🔄 Correcciones de Pago: ${resetCount}</span>
                            <span class="bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md">⏱️ Tiempo: ${timeStr}</span>
                        </div>
                    </div>

                    <div class="flex flex-col items-end gap-2 shrink-0">
                        <span class="font-black text-emerald-700 text-base">$${(ev.totalAmount || 0).toLocaleString('es-CL')}</span>
                        <button onclick="openAdvancedEvaluationModal('${ev.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow active:scale-95">
                            <i class="fa-solid fa-brain"></i>
                            <span>Evaluar y Generar Informe IA</span>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    html += `
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-5 rounded-3xl border-4 border-emerald-200 shadow space-y-3">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🏪 Supermercados Creados</h3>
                        <button onclick="openSupermarketModal()" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Crear</button>
                    </div>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${APP_STATE.supermarkets.map(s => `
                            <div class="p-2 bg-slate-50 border rounded-xl flex justify-between items-center text-xs font-bold">
                                <span>${s.icon || '🏪'} ${s.name}</span>
                                <button onclick="openSupermarketModal('${s.id}')" class="text-amber-600">✏️ Editar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-amber-200 shadow space-y-3">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🍎 Catálogo de Productos y Categorías</h3>
                        <div class="flex gap-2">
                            <button onclick="openCategoryModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Categoría</button>
                            <button onclick="openProductModal()" class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Producto</button>
                        </div>
                    </div>
                    
                    <div class="space-y-1 border-b pb-2 mb-2 max-h-32 overflow-y-auto">
                        <span class="text-[10px] font-black uppercase text-slate-400 block mb-1">Categorías Existentes:</span>
                        ${(APP_STATE.categories || []).map(cat => `
                            <div class="flex justify-between items-center p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold">
                                <span class="flex items-center gap-1.5 text-indigo-950">
                                    <span class="text-base">${cat.icon || '🏷️'}</span>
                                    <span>${cat.name}</span>
                                </span>
                                <div class="flex items-center gap-2">
                                    <button onclick="openCategoryModal('${cat.id}')" class="text-amber-600 hover:underline text-[10px]">✏️ Editar</button>
                                    <button onclick="deleteCategory('${cat.id}')" class="text-rose-600 hover:underline text-[10px]">✕</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${APP_STATE.products.map(p => `
                            <div class="p-2 bg-slate-50 border rounded-xl flex justify-between items-center text-xs font-bold">
                                <span>${p.iconEmoji || '📦'} ${p.name} ($${p.price}) <span class="text-[10px] text-slate-400">(${p.category || 'General'})</span></span>
                                <button onclick="openProductModal('${p.id}')" class="text-amber-600">✏️ Editar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

// ==========================================
// CONFIGURACIÓN DE PDF Y EXPORTACIÓN
// ==========================================
function handlePdfLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX = 250;
            let w = img.width, h = img.height;
            if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
            else { if (h > MAX) { w *= MAX / h; h = MAX; } }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/png');

            document.getElementById('pdfLogoUrl').value = compressed;
            document.getElementById('pdfLogoPreview').src = compressed;
            document.getElementById('pdfLogoPreviewContainer').classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function savePdfTemplateSettings() {
    const data = {
        institutionName: document.getElementById('pdfInstName').value.trim(),
        headerTitle: document.getElementById('pdfHeaderTitle').value.trim(),
        footerText: document.getElementById('pdfFooterText').value.trim(),
        primaryColor: document.getElementById('pdfPrimaryColor').value,
        logoUrl: document.getElementById('pdfLogoUrl').value
    };

    db.collection('settings').doc('pdfReport').set(data)
    .then(() => alert("✅ Formato de plantilla PDF guardado exitosamente en la nube."))
    .catch(err => alert("Error al guardar formato: " + err.message));
}

function generatePDFReport(evalId, scores) {
    const evaluation = APP_STATE.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;

    const pdfTpl = APP_STATE.pdfTemplate || {
        institutionName: "Escuela Especial NEE",
        headerTitle: "INFORME DE EVALUACIÓN PEDAGÓGICA Y COGNITIVA",
        footerText: "Documento confidencial PIE",
        primaryColor: "#3730a3",
        logoUrl: ""
    };

    const totalPts = scores.reduce((a, b) => a + b, 0);
    const percentage = Math.round((totalPts / 20) * 100);

    let level = 'Inicial';
    if (percentage >= 85) level = 'Destacado / Autónomo';
    else if (percentage >= 60) level = 'Adecuado / En Desarrollo';
    else if (percentage >= 40) level = 'Inicial / Requiere Apoyo';

    const voiceCount = evaluation.telemetry ? (evaluation.telemetry.voiceHelpCount || 0) : 0;
    const resetCount = evaluation.telemetry ? (evaluation.telemetry.paymentResetsCount || 0) : 0;
    const timeSec = evaluation.timeSeconds || 0;
    const timeFormatted = `${Math.floor(timeSec / 60)} min ${timeSec % 60} seg`;

    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '750px';
    pdfContainer.style.padding = '30px';
    pdfContainer.style.fontFamily = 'Helvetica, Arial, sans-serif';
    pdfContainer.style.color = '#1e293b';

    const logoHtml = pdfTpl.logoUrl 
        ? `<img src="${pdfTpl.logoUrl}" style="max-height: 60px; max-width: 140px; object-fit: contain;">` 
        : `<span style="font-size: 32px;">🏛️</span>`;

    pdfContainer.innerHTML = `
        <div style="border: 2px solid ${pdfTpl.primaryColor}; padding: 20px; border-radius: 16px; background-color: #ffffff;">
            <div style="display: flex; justify-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    ${logoHtml}
                    <div>
                        <h2 style="font-size: 16px; font-weight: 900; color: ${pdfTpl.primaryColor}; margin: 0;">${pdfTpl.institutionName}</h2>
                        <h4 style="font-size: 11px; font-weight: 700; color: #64748b; margin: 2px 0 0 0;">${pdfTpl.headerTitle}</h4>
                    </div>
                </div>
                <div style="text-align: right; font-size: 10px; color: #64748b;">
                    <b>Fecha:</b> ${new Date().toLocaleDateString('es-CL')}
                </div>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; margin-bottom: 15px; font-size: 11px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 3px 0;"><b>Estudiante:</b> ${evaluation.studentName}</td>
                        <td style="padding: 3px 0; text-align: right;"><b>Logro Global:</b> <span style="font-size: 13px; font-weight: 900; color: ${pdfTpl.primaryColor};">${percentage}% (${level})</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0;"><b>Monto Comprado:</b> $${(evaluation.totalAmount || 0).toLocaleString('es-CL')}</td>
                        <td style="padding: 3px 0; text-align: right;"><b>Tiempo Búsqueda:</b> ${timeFormatted}</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0;"><b>Solicitudes de Voz:</b> ${voiceCount} veces</td>
                        <td style="padding: 3px 0; text-align: right;"><b>Devoluciones Caja:</b> ${resetCount} veces</td>
                    </tr>
                </table>
            </div>

            <h3 style="font-size: 12px; font-weight: 800; color: ${pdfTpl.primaryColor}; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">1. EVALUACIÓN POR DIMENSIONES</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 15px;">
                <thead>
                    <tr style="background-color: ${pdfTpl.primaryColor}; color: white; text-align: left;">
                        <th style="padding: 6px;">Dimensión Evaluada</th>
                        <th style="padding: 6px; text-align: center;">Puntaje (1-5)</th>
                        <th style="padding: 6px;">Desempeño Observado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 6px;"><b>Atención y Búsqueda Visual</b></td>
                        <td style="padding: 6px; text-align: center; font-weight: bold;">${scores[0]} / 5</td>
                        <td style="padding: 6px;">${scores[0] >= 4 ? 'Discriminación eficaz de pictogramas e ítems por categoría.' : 'Requiere mediación visual o auditiva focalizada.'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 6px;"><b>Funciones Ejecutivas</b></td>
                        <td style="padding: 6px; text-align: center; font-weight: bold;">${scores[1]} / 5</td>
                        <td style="padding: 6px;">${scores[1] >= 4 ? 'Estructura la secuencia de compra de manera fluida y autorregulada.' : 'Muestra flexibilidad frente al error pero requiere apoyo en la planificación.'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 6px;"><b>Razonamiento Lógico-Matemático</b></td>
                        <td style="padding: 6px; text-align: center; font-weight: bold;">${scores[2]} / 5</td>
                        <td style="padding: 6px;">${scores[2] >= 4 ? 'Reconoce y combina denominaciones monetarias CLP de forma precisa.' : 'Requiere reforzar el valor relativo de billetes y monedas chilenas.'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 6px;"><b>Autonomía e Integración AIVD</b></td>
                        <td style="padding: 6px; text-align: center; font-weight: bold;">${scores[3]} / 5</td>
                        <td style="padding: 6px;">${scores[3] >= 4 ? 'Desempeño autónomo y transferible al entorno comunitario real.' : 'Progresa adecuadamente con soportes tecnológicos.'}</td>
                    </tr>
                </tbody>
            </table>

            <h3 style="font-size: 12px; font-weight: 800; color: ${pdfTpl.primaryColor}; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">2. RECOMENDACIONES PEDAGÓGICAS Y PIE</h3>
            <div style="font-size: 10px; line-height: 1.5; background-color: #f8fafc; border-left: 3px solid ${pdfTpl.primaryColor}; padding: 8px; margin-bottom: 30px;">
                <p style="margin: 0 0 4px 0;">• <b>Sugerencia en Aula:</b> Trabajar conteo de 1.000 en 1.000 y descomposición de vuelto mediante los pictogramas de la app.</p>
                <p style="margin: 0;">• <b>Sugerencia para el Hogar:</b> Involucrar al estudiante en compras cotidianas guiadas en el comercio local para reforzar la transferencia.</p>
            </div>

            <div style="display: flex; justify-space-around; margin-top: 40px; text-align: center; font-size: 10px;">
                <div style="border-top: 1px solid #94a3b8; width: 200px; padding-top: 4px;">
                    <b>Educador(a) / Docente PIE</b>
                </div>
                <div style="border-top: 1px solid #94a3b8; width: 200px; padding-top: 4px;">
                    <b>Equipo Multidisciplinario</b>
                </div>
            </div>

            <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-size: 8px; color: #94a3b8;">
                ${pdfTpl.footerText}
            </div>
        </div>
    `;

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `Informe_NEE_${evaluation.studentName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(pdfContainer).save();
    } else {
        alert("La librería html2pdf.js no está cargada.");
    }
}

function downloadPdfFromModal(evalId, scores) {
    generatePDFReport(evalId, scores);
}

// ==========================================
// MODAL DE PAUTA DE EVALUACIÓN MULTIDIMENSIONAL
// ==========================================
function openAdvancedEvaluationModal(evalId) {
    const evaluation = APP_STATE.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;

    let modal = document.getElementById('advancedEvalModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'advancedEvalModal';
        modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(modal);
    }

    const voiceCount = evaluation.telemetry ? (evaluation.telemetry.voiceHelpCount || 0) : 0;
    const resetCount = evaluation.telemetry ? (evaluation.telemetry.paymentResetsCount || 0) : 0;
    const timeStr = evaluation.timeSeconds ? `${Math.floor(evaluation.timeSeconds / 60)}m ${evaluation.timeSeconds % 60}s` : 'N/A';

    modal.innerHTML = `
        <div class="bg-white w-full max-w-2xl rounded-3xl border-4 border-indigo-600 shadow-2xl p-6 space-y-5 my-6">
            <div class="flex justify-between items-center border-b pb-3">
                <div>
                    <h3 class="text-xl font-black text-indigo-950 flex items-center gap-2">
                        <i class="fa-solid fa-clipboard-check text-indigo-600"></i>
                        <span>Pauta de Evaluación Integral NEE</span>
                    </h3>
                    <p class="text-xs font-bold text-slate-500 mt-0.5">Evaluación multidimensional de funciones cognitivas y del desarrollo.</p>
                </div>
                <button onclick="closeAdvancedEvalModal()" class="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>

            <div class="bg-indigo-50 border-2 border-indigo-200 p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div>
                    <span class="text-[10px] font-extrabold uppercase text-slate-500 block">Estudiante</span>
                    <span class="font-black text-indigo-950 truncate block">${evaluation.studentName}</span>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold uppercase text-slate-500 block">Tiempo Búsqueda</span>
                    <span class="font-black text-amber-900 block">${timeStr}</span>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold uppercase text-slate-500 block">Solicitudes Voz</span>
                    <span class="font-black text-sky-900 block">${voiceCount} veces</span>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold uppercase text-slate-500 block">Devoluciones Caja</span>
                    <span class="font-black text-rose-900 block">${resetCount} veces</span>
                </div>
            </div>

            <form id="advancedRubricForm" class="space-y-4 text-xs">
                <div class="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-indigo-950 text-sm">1. Atención y Discriminación Visual</span>
                        <select id="dim1" class="font-black text-indigo-900 bg-white border-2 border-indigo-300 p-1.5 rounded-xl focus:outline-none">
                            <option value="5">5 - Destacado (Totalmente Autónomo)</option>
                            <option value="4">4 - Logrado (Apoyos mínimos)</option>
                            <option value="3" selected>3 - En Desarrollo (Requiere guía verbal)</option>
                            <option value="2">2 - Inicial (Requiere modelado constante)</option>
                            <option value="1">1 - En Diagnóstico / No observado</option>
                        </select>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">Capacidad para localizar productos en góndolas y clasificar ítems por categoría pictográfica.</p>
                </div>

                <div class="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-indigo-950 text-sm">2. Funciones Ejecutivas y Planificación</span>
                        <select id="dim2" class="font-black text-indigo-900 bg-white border-2 border-indigo-300 p-1.5 rounded-xl focus:outline-none">
                            <option value="5">5 - Destacado (Totalmente Autónomo)</option>
                            <option value="4">4 - Logrado (Apoyos mínimos)</option>
                            <option value="3" selected>3 - En Desarrollo (Requiere guía verbal)</option>
                            <option value="2">2 - Inicial (Requiere modelado constante)</option>
                            <option value="1">1 - En Diagnóstico / No observado</option>
                        </select>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">Estructuración del flujo de compra, monitoreo de errores y persistencia frente a fallas en el pago.</p>
                </div>

                <div class="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-indigo-950 text-sm">3. Razonamiento Matemático Funcional (CLP)</span>
                        <select id="dim3" class="font-black text-indigo-900 bg-white border-2 border-indigo-300 p-1.5 rounded-xl focus:outline-none">
                            <option value="5">5 - Destacado (Totalmente Autónomo)</option>
                            <option value="4">4 - Logrado (Apoyos mínimos)</option>
                            <option value="3" selected>3 - En Desarrollo (Requiere guía verbal)</option>
                            <option value="2">2 - Inicial (Requiere modelado constante)</option>
                            <option value="1">1 - En Diagnóstico / No observado</option>
                        </select>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">Reconocimiento de billetes/monedas chilenas, cálculo de la combinación de pago y noción de vuelto.</p>
                </div>

                <div class="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-black text-indigo-950 text-sm">4. Autonomía e Integración (AIVD)</span>
                        <select id="dim4" class="font-black text-indigo-900 bg-white border-2 border-indigo-300 p-1.5 rounded-xl focus:outline-none">
                            <option value="5">5 - Destacado (Totalmente Autónomo)</option>
                            <option value="4">4 - Logrado (Apoyos mínimos)</option>
                            <option value="3" selected>3 - En Desarrollo (Requiere guía verbal)</option>
                            <option value="2">2 - Inicial (Requiere modelado constante)</option>
                            <option value="1">1 - En Diagnóstico / No observado</option>
                        </select>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">Uso adecuado de la tecnología táctil/voz, ritmo de trabajo y transferencia de la conducta al entorno real.</p>
                </div>
            </form>

            <div class="grid grid-cols-2 gap-3 pt-2">
                <button onclick="closeAdvancedEvalModal()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl">Cancelar</button>
                <button onclick="processAdvancedReport('${evalId}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow flex items-center justify-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Generar Informe IA con Porcentaje</span>
                </button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeAdvancedEvalModal() {
    const modal = document.getElementById('advancedEvalModal');
    if (modal) modal.classList.add('hidden');
}

async function processAdvancedReport(evalId) {
    const evaluation = APP_STATE.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;

    const scores = [
        parseInt(document.getElementById('dim1').value),
        parseInt(document.getElementById('dim2').value),
        parseInt(document.getElementById('dim3').value),
        parseInt(document.getElementById('dim4').value)
    ];

    const totalPts = scores.reduce((a, b) => a + b, 0);
    const percentage = Math.round((totalPts / 20) * 100);

    let level = 'Inicial';
    if (percentage >= 85) level = 'Destacado / Autónomo';
    else if (percentage >= 60) level = 'Adecuado / En Desarrollo';
    else if (percentage >= 40) level = 'Inicial / Requiere Apoyo';

    closeAdvancedEvalModal();

    let resultModal = document.getElementById('aiReportResultModal');
    if (!resultModal) {
        resultModal = document.createElement('div');
        resultModal.id = 'aiReportResultModal';
        resultModal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(resultModal);
    }

    resultModal.innerHTML = `
        <div class="bg-white w-full max-w-xl rounded-3xl border-4 border-indigo-500 shadow-2xl p-6 text-center space-y-3">
            <div class="text-4xl animate-spin">⚙️</div>
            <h3 class="text-xl font-black text-indigo-950">Generando Informe Profesional...</h3>
            <p class="text-xs font-bold text-slate-500">Sintetizando datos cuantitativos y cualitativos para apoderados y equipo PIE.</p>
        </div>
    `;
    resultModal.classList.remove('hidden');

    const voiceCount = evaluation.telemetry ? (evaluation.telemetry.voiceHelpCount || 0) : 0;
    const resetCount = evaluation.telemetry ? (evaluation.telemetry.paymentResetsCount || 0) : 0;
    const timeSec = evaluation.timeSeconds || 0;

    const reportMarkdown = `
📄 **INFORME PEDAGÓGICO DE DESEMPEÑO COGNITIVO Y FUNCIONAL**

**Estudiante:** ${evaluation.studentName}
**Porcentaje Global de Logro:** ${percentage}% (${level})
**Tiempo de Búsqueda:** ${Math.floor(timeSec / 60)} min ${timeSec % 60} seg.
**Soportes Solicitados:** ${voiceCount} apoyos de voz | ${resetCount} correcciones de caja.

---

### 1. RESUMEN GENERAL DE DESEMPEÑO
El/La estudiante realizó la actividad de simulación de compra alcanzando un **${percentage}% de logro global**, situándose en un nivel **${level}**. Durante la experiencia demostró capacidad de adaptación al entorno digital interactivo y manejo funcional de recursos.

### 2. EVALUACIÓN POR DIMENSIONES COGNITIVAS
* **Atención y Búsqueda Visual (${scores[0]}/5):** ${scores[0] >= 4 ? 'Discriminación eficaz de pictogramas e ítems por categoría.' : 'Requiere mediación visual o auditiva focalizada.'}
* **Funciones Ejecutivas (${scores[1]}/5):** ${scores[1] >= 4 ? 'Estructura la secuencia de compra de manera fluida y autorregulada.' : 'Muestra flexibilidad frente al error pero requiere apoyo en la planificación.'}
* **Razonamiento Lógico-Matemático (${scores[2]}/5):** ${scores[2] >= 4 ? 'Reconoce y combina denominaciones monetarias CLP de forma precisa.' : 'Requiere reforzar el valor relativo de billetes y monedas chilenas.'}
* **Autonomía e Integración AIVD (${scores[3]}/5):** ${scores[3] >= 4 ? 'Desempeño autónomo y transferible al entorno comunitario real.' : 'Progresa adecuadamente con soportes tecnológicos.'}

---

### 3. RECOMENDACIONES PEDAGÓGICAS
* **Sugerencia en Aula:** Trabajar conteo de 1.000 en 1.000 y descomposición de vuelto mediante los pictogramas de la app.
* **Sugerencia para el Hogar:** Involucrar al estudiante en compras cotidianas guiadas en el comercio local para reforzar la transferencia.
    `;

    resultModal.innerHTML = `
        <div class="bg-white w-full max-w-2xl rounded-3xl border-4 border-indigo-600 shadow-2xl p-6 space-y-4 my-6 text-left">
            <div class="flex justify-between items-center border-b pb-2">
                <h3 class="text-xl font-black text-indigo-950 flex items-center gap-2">
                    <span>🤖 Reporte Pedagógico Consolidado</span>
                </h3>
                <button onclick="closeAiReportResultModal()" class="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
${reportMarkdown}
            </div>

            <div class="flex flex-wrap gap-2 pt-2">
                <button onclick="downloadPdfFromModal('${evalId}', [${scores.join(',')}])" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl border-b-4 border-emerald-900 shadow text-xs flex items-center justify-center gap-2">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>Descargar PDF Oficial</span>
                </button>
                <button onclick="navigator.clipboard.writeText(\`${reportMarkdown.replace(/`/g, "'")}\`); alert('¡Informe copiado al portapapeles!');" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-4 py-3 rounded-xl border-b-4 border-amber-600 shadow text-xs flex items-center justify-center gap-2">
                    <i class="fa-solid fa-copy"></i>
                    <span>Copiar Texto</span>
                </button>
                <button onclick="closeAiReportResultModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-3 rounded-xl border-b-4 border-indigo-900 shadow text-xs">
                    Cerrar
                </button>
            </div>
        </div>
    `;
}

function closeAiReportResultModal() {
    const modal = document.getElementById('aiReportResultModal');
    if (modal) modal.classList.add('hidden');
}

// ==========================================
// CONTROLADORES DE IMÁGENES Y CÁMARA
// ==========================================
function compressCurrencyPhoto(dataUrl, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        callback(compressed);
    };
    img.src = dataUrl;
}

function openCurrencyEditModal(currencyId, currencyName) {
    document.getElementById('modalCurrencyId').value = currencyId;
    document.getElementById('currencyModalTitle').textContent = `Foto de ${currencyName}`;
    document.getElementById('modalCurrencyPhotoUrl').value = '';
    document.getElementById('currencyPhotoPreviewContainer').classList.add('hidden');
    stopCurrencyCamera();
    document.getElementById('currencyEditModal').classList.remove('hidden');
}

function closeCurrencyEditModal() {
    stopCurrencyCamera();
    document.getElementById('currencyEditModal').classList.add('hidden');
}

function handleCurrencyFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        compressCurrencyPhoto(e.target.result, function(compressedUrl) {
            document.getElementById('modalCurrencyPhotoUrl').value = compressedUrl;
            document.getElementById('currencyPhotoPreview').src = compressedUrl;
            document.getElementById('currencyPhotoPreviewContainer').classList.remove('hidden');
        });
    };
    reader.readAsDataURL(file);
}

function startCurrencyCamera() {
    const video = document.getElementById('currencyCameraVideo');
    const container = document.getElementById('currencyCameraContainer');
    container.classList.remove('hidden');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        currencyCameraStream = stream;
        video.srcObject = stream;
        video.play();
    });
}

function takeCurrencySnapshot() {
    const video = document.getElementById('currencyCameraVideo');
    if (!video || !currencyCameraStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 400, 240);

    const base64Img = canvas.toDataURL('image/jpeg', 0.75);
    document.getElementById('modalCurrencyPhotoUrl').value = base64Img;
    document.getElementById('currencyPhotoPreview').src = base64Img;
    document.getElementById('currencyPhotoPreviewContainer').classList.remove('hidden');
    stopCurrencyCamera();
}

function stopCurrencyCamera() {
    if (currencyCameraStream) {
        currencyCameraStream.getTracks().forEach(track => track.stop());
        currencyCameraStream = null;
    }
    const container = document.getElementById('currencyCameraContainer');
    if (container) container.classList.add('hidden');
}

function saveCurrencyPhotoFromModal() {
    const currencyId = document.getElementById('modalCurrencyId').value;
    const photoUrl = document.getElementById('modalCurrencyPhotoUrl').value;

    if (!photoUrl) return alert("Sube un archivo o toma una foto.");

    db.collection('currencies').doc(currencyId).set({ photoUrl })
    .then(() => {
        closeCurrencyEditModal();
        alert("✅ Fotografía guardada en la Nube.");
    })
    .catch((error) => {
        alert("❌ Error al guardar en la nube: " + error.message);
    });
}

function openTeacherCourseModal() {
    const container = document.getElementById('teacherCourseCheckboxes');
    const myCourseIds = getUserCourseIds(APP_STATE.currentUser);

    container.innerHTML = APP_STATE.courses.map(c => {
        const isChecked = myCourseIds.includes(c.id) ? 'checked' : '';
        return `
            <label class="flex items-center space-x-3 text-sm font-bold text-slate-800 cursor-pointer p-2 hover:bg-white rounded-xl border border-transparent hover:border-indigo-200">
                <input type="checkbox" value="${c.id}" ${isChecked} class="teacher-self-course-cb w-5 h-5 text-indigo-600 rounded">
                <span>${c.name}</span>
            </label>
        `;
    }).join('');

    document.getElementById('teacherCourseModal').classList.remove('hidden');
}

function selectAllTeacherSelfCourses(select) {
    document.querySelectorAll('.teacher-self-course-cb').forEach(cb => cb.checked = select);
}

function closeTeacherCourseModal() {
    document.getElementById('teacherCourseModal').classList.add('hidden');
}

function saveTeacherSelfCourses() {
    const checkedBoxes = document.querySelectorAll('.teacher-self-course-cb:checked');
    const selectedCourseIds = Array.from(checkedBoxes).map(cb => cb.value);

    db.collection('users').doc(APP_STATE.currentUser.id).update({
        courseIds: selectedCourseIds
    }).then(() => {
        APP_STATE.currentUser.courseIds = selectedCourseIds;
        localStorage.setItem('nee_active_user', JSON.stringify(APP_STATE.currentUser));
        closeTeacherCourseModal();
        alert("✅ Mis cursos asignados actualizados.");
        renderApp();
    });
}

function handleImageFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) { compressAndSetPhoto(e.target.result); };
    reader.readAsDataURL(file);
}

function startCameraStream() {
    const video = document.getElementById('cameraVideo');
    const container = document.getElementById('cameraContainer');
    container.classList.remove('hidden');

    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 300 }, height: { ideal: 300 }, facingMode: "user" } })
    .then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        video.play();
    });
}

function takeCameraSnapshot() {
    const video = document.getElementById('cameraVideo');
    if (!video || !cameraStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = 250; canvas.height = 250;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 250, 250);

    const base64Img = canvas.toDataURL('image/jpeg', 0.8);
    compressAndSetPhoto(base64Img);
    stopCameraStream();
}

function stopCameraStream() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    const container = document.getElementById('cameraContainer');
    if (container) container.classList.add('hidden');
}

function compressAndSetPhoto(dataUrl) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);

        document.getElementById('modalPhotoUrl').value = compressed;
        document.getElementById('photoPreview').src = compressed;
        document.getElementById('photoPreviewContainer').classList.remove('hidden');
    };
    img.src = dataUrl;
}

function removeUserPhoto() {
    document.getElementById('modalPhotoUrl').value = '';
    document.getElementById('photoPreview').src = '';
    document.getElementById('photoPreviewContainer').classList.add('hidden');
}

function renderMultiCourseCheckboxes(selectedIds = []) {
    const container = document.getElementById('modalMultiCourseCheckboxes');
    if (!container) return;
    container.innerHTML = APP_STATE.courses.map(c => {
        const isChecked = selectedIds.includes(c.id) ? 'checked' : '';
        return `
            <label class="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer p-1.5 hover:bg-white rounded-lg">
                <input type="checkbox" value="${c.id}" ${isChecked} class="user-modal-course-cb w-4 h-4 text-indigo-600 rounded">
                <span>${c.name}</span>
            </label>
        `;
    }).join('');
}

function selectAllModalCourses(select) {
    document.querySelectorAll('.user-modal-course-cb').forEach(cb => cb.checked = select);
}

function openCreateUserModal(role) {
    if (APP_STATE.courses.length === 0) return alert("Crea al menos un curso antes de registrar usuarios.");
    
    stopCameraStream();
    document.getElementById('modalUserId').value = '';
    document.getElementById('modalUserRole').value = role;
    document.getElementById('userModalTitle').textContent = role === 'teacher' ? 'Crear Nuevo Educador' : 'Crear Nuevo Alumno';
    document.getElementById('modalName').value = '';
    document.getElementById('modalRut').value = '';
    document.getElementById('modalEmail').value = '';
    removeUserPhoto();

    const singleCont = document.getElementById('modalSingleCourseContainer');
    const multiCont = document.getElementById('modalMultiCourseContainer');

    if (role === 'teacher') {
        singleCont.classList.add('hidden');
        multiCont.classList.remove('hidden');
        renderMultiCourseCheckboxes([]);
    } else {
        multiCont.classList.add('hidden');
        singleCont.classList.remove('hidden');
        const courseSelect = document.getElementById('modalCourse');
        courseSelect.innerHTML = APP_STATE.courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    document.getElementById('userModal').classList.remove('hidden');
}

function openEditUserModal(userId) {
    const user = APP_STATE.users.find(u => u.id === userId);
    if (!user) return;

    stopCameraStream();
    document.getElementById('modalUserId').value = user.id;
    document.getElementById('modalUserRole').value = user.role;
    document.getElementById('userModalTitle').textContent = user.role === 'teacher' ? 'Editar Educador' : 'Editar Alumno';
    document.getElementById('modalName').value = user.name || '';
    document.getElementById('modalRut').value = user.rut || '';
    document.getElementById('modalEmail').value = user.email || '';

    if (user.photoUrl) {
        document.getElementById('modalPhotoUrl').value = user.photoUrl;
        document.getElementById('photoPreview').src = user.photoUrl;
        document.getElementById('photoPreviewContainer').classList.remove('hidden');
    } else {
        removeUserPhoto();
    }

    const singleCont = document.getElementById('modalSingleCourseContainer');
    const multiCont = document.getElementById('modalMultiCourseContainer');

    if (user.role === 'teacher') {
        singleCont.classList.add('hidden');
        multiCont.classList.remove('hidden');
        renderMultiCourseCheckboxes(getUserCourseIds(user));
    } else {
        multiCont.classList.add('hidden');
        singleCont.classList.remove('hidden');
        const courseSelect = document.getElementById('modalCourse');
        courseSelect.innerHTML = APP_STATE.courses.map(c => `<option value="${c.id}" ${user.courseId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
    }

    document.getElementById('userModal').classList.remove('hidden');
}

function closeUserModal() {
    stopCameraStream();
    document.getElementById('userModal').classList.add('hidden');
}

function saveUserFromModal() {
    const userId = document.getElementById('modalUserId').value;
    const role = document.getElementById('modalUserRole').value;
    const name = document.getElementById('modalName').value.trim();
    const rut = document.getElementById('modalRut').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const photoUrl = document.getElementById('modalPhotoUrl').value.trim();

    if (!name || !rut || !email) return alert("Por favor completa Nombre, RUT y Correo.");

    let courseData = {};
    if (role === 'teacher') {
        const checkedBoxes = document.querySelectorAll('.user-modal-course-cb:checked');
        const courseIds = Array.from(checkedBoxes).map(cb => cb.value);
        courseData = { courseIds };
    } else {
        const courseId = document.getElementById('modalCourse').value;
        courseData = { courseId };
    }

    if (userId) {
        const updateData = { name, rut, username: rut, email, photoUrl, ...courseData };

        db.collection('users').doc(userId).update(updateData).then(() => {
            closeUserModal();
            alert("✅ Usuario actualizado correctamente.");
        });
    } else {
        const initialPin = getInitialPinFromRut(rut);
        const newUserId = 'u-' + Date.now();
        const newUser = {
            id: newUserId, name, rut, username: rut, email, photoUrl,
            pin: initialPin, role, mustChangePassword: true, ...courseData
        };

        db.collection('users').doc(newUserId).set(newUser).then(() => {
            closeUserModal();
            sendAutomaticCredentialsEmail(newUser);
            alert(`✅ Usuario registrado exitosamente.\nClave temporal: ${initialPin}\nCorreo enviado a ${email}`);
        });
    }
}

// ==========================================
// GESTIÓN DE CATEGORÍAS CON ÍCONO/EMOJI
// ==========================================
function selectCategoryIconEmoji(emoji) {
    document.getElementById('modalCatIcon').value = emoji;
}

function openCategoryModal(catId = null) {
    if (catId) {
        const cat = (APP_STATE.categories || []).find(c => c.id === catId);
        if (cat) {
            document.getElementById('modalCatId').value = cat.id;
            document.getElementById('catModalTitle').textContent = 'Editar Categoría';
            document.getElementById('modalCatName').value = cat.name || '';
            document.getElementById('modalCatIcon').value = cat.icon || '🏷️';
        }
    } else {
        document.getElementById('modalCatId').value = '';
        document.getElementById('catModalTitle').textContent = 'Crear Categoría';
        document.getElementById('modalCatName').value = '';
        document.getElementById('modalCatIcon').value = '🏷️';
    }
    document.getElementById('categoryModal').classList.remove('hidden');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.add('hidden');
}

function saveCategoryFromModal() {
    const catId = document.getElementById('modalCatId').value;
    const name = document.getElementById('modalCatName').value.trim();
    const icon = document.getElementById('modalCatIcon').value.trim() || '🏷️';

    if (!name) return alert("Ingresa un nombre para la categoría.");

    const id = catId || ('cat-' + Date.now());
    const data = { id, name, icon };

    db.collection('categories').doc(id).set(data).then(() => {
        closeCategoryModal();
        alert(`✅ Categoría "${name}" guardada con su ícono en la nube.`);
        if (!document.getElementById('productModal').classList.contains('hidden')) {
            const prodId = document.getElementById('modalProdId').value || null;
            openProductModal(prodId);
            document.getElementById('modalProdCategory').value = name;
        }
    }).catch(err => alert("Error al guardar categoría: " + err.message));
}

function deleteCategory(id) {
    if (confirm("¿Eliminar esta categoría de la nube?")) {
        db.collection('categories').doc(id).delete();
    }
}

// ==========================================
// GESTIÓN DE SUPERMERCADOS
// ==========================================
function handleSupermarketPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX = 400;
            let w = img.width, h = img.height;
            if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
            else { if (h > MAX) { w *= MAX / h; h = MAX; } }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.8);

            document.getElementById('modalSupPhoto').value = compressed;
            document.getElementById('supPhotoPreview').src = compressed;
            document.getElementById('supPhotoPreviewContainer').classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeSupermarketPhoto() {
    document.getElementById('modalSupPhoto').value = '';
    document.getElementById('supPhotoPreview').src = '';
    document.getElementById('supPhotoPreviewContainer').classList.add('hidden');
}

function openSupermarketModal(supId = null) {
    if (supId) {
        const sup = APP_STATE.supermarkets.find(s => s.id === supId);
        if (!sup) return;
        document.getElementById('modalSupId').value = sup.id;
        document.getElementById('supModalTitle').textContent = 'Editar Supermercado';
        document.getElementById('modalSupName').value = sup.name || '';
        document.getElementById('modalSupIcon').value = sup.icon || '🏪';
        document.getElementById('modalSupPhoto').value = sup.photoUrl || '';
        document.getElementById('modalSupDesc').value = sup.description || '';

        if (sup.photoUrl) {
            document.getElementById('supPhotoPreview').src = sup.photoUrl;
            document.getElementById('supPhotoPreviewContainer').classList.remove('hidden');
        } else {
            removeSupermarketPhoto();
        }
    } else {
        document.getElementById('modalSupId').value = '';
        document.getElementById('supModalTitle').textContent = 'Crear Supermercado';
        document.getElementById('modalSupName').value = '';
        document.getElementById('modalSupIcon').value = '🏪';
        document.getElementById('modalSupPhoto').value = '';
        document.getElementById('modalSupDesc').value = '';
        removeSupermarketPhoto();
    }
    document.getElementById('supermarketModal').classList.remove('hidden');
}

function closeSupermarketModal() { 
    document.getElementById('supermarketModal').classList.add('hidden'); 
}

function saveSupermarketFromModal() {
    const supId = document.getElementById('modalSupId').value;
    const name = document.getElementById('modalSupName').value.trim();
    const icon = document.getElementById('modalSupIcon').value.trim();
    const photoUrl = document.getElementById('modalSupPhoto').value.trim();
    const description = document.getElementById('modalSupDesc').value.trim();

    if (!name) return alert("Ingresa un nombre para el supermercado.");

    const id = supId || ('sup-' + Date.now());
    const data = {
        id, 
        name, 
        icon: icon || '🏪', 
        photoUrl: photoUrl || '', 
        description,
        themeColor: 'bg-emerald-600', 
        textColor: 'text-emerald-600', 
        borderColor: 'border-emerald-500'
    };

    db.collection('supermarkets').doc(id).set(data).then(() => {
        closeSupermarketModal();
        alert("✅ Supermercado guardado con su fotografía en la nube.");
    }).catch(err => {
        alert("❌ Error al guardar en la nube: " + err.message);
    });
}

function deleteSupermarket(id) {
    if (confirm("¿Eliminar este supermercado?")) db.collection('supermarkets').doc(id).delete();
}

// ==========================================
// GESTIÓN DE PRODUCTOS Y REPLICACIÓN EN SUPERMERCADOS
// ==========================================
function handleProductPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX = 400;
            let w = img.width, h = img.height;
            if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
            else { if (h > MAX) { w *= MAX / h; h = MAX; } }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.8);

            document.getElementById('modalProdPhoto').value = compressed;
            document.getElementById('modalProdPhotoUrl').value = '';
            document.getElementById('prodPhotoPreview').src = compressed;
            document.getElementById('prodPhotoPreviewContainer').classList.remove('hidden');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleProductUrlInput(url) {
    if (url && url.trim() !== '') {
        document.getElementById('modalProdPhoto').value = url.trim();
        document.getElementById('prodPhotoPreview').src = url.trim();
        document.getElementById('prodPhotoPreviewContainer').classList.remove('hidden');
    } else {
        removeProductPhoto();
    }
}

function removeProductPhoto() {
    document.getElementById('modalProdPhoto').value = '';
    document.getElementById('modalProdPhotoUrl').value = '';
    document.getElementById('prodPhotoPreview').src = '';
    document.getElementById('prodPhotoPreviewContainer').classList.add('hidden');
}

function openProductModal(prodId = null) {
    if (APP_STATE.supermarkets.length === 0) return alert("Crea un supermercado primero.");

    const supSelect = document.getElementById('modalProdSupermarket');
    supSelect.innerHTML = APP_STATE.supermarkets.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    const catSelect = document.getElementById('modalProdCategory');
    const categoriesList = APP_STATE.categories || [];

    if (categoriesList.length === 0) {
        catSelect.innerHTML = `<option value="General">🏷️ General</option>`;
    } else {
        catSelect.innerHTML = categoriesList.map(c => `<option value="${c.name}">${c.icon || '🏷️'} ${c.name}</option>`).join('');
    }

    const replicateCheckbox = document.getElementById('modalProdReplicateAll');
    if (replicateCheckbox) replicateCheckbox.checked = false;

    if (prodId) {
        const prod = APP_STATE.products.find(p => p.id === prodId);
        if (!prod) return;
        document.getElementById('modalProdId').value = prod.id;
        document.getElementById('prodModalTitle').textContent = 'Editar Producto';
        document.getElementById('modalProdSupermarket').value = prod.supermarketId;
        document.getElementById('modalProdName').value = prod.name || '';
        document.getElementById('modalProdCategory').value = prod.category || (categoriesList[0] ? categoriesList[0].name : 'General');
        document.getElementById('modalProdPrice').value = prod.price || '';
        document.getElementById('modalProdEmoji').value = prod.iconEmoji || '📦';
        document.getElementById('modalProdPhoto').value = prod.photoUrl || '';
        
        if (prod.photoUrl) {
            document.getElementById('prodPhotoPreview').src = prod.photoUrl;
            document.getElementById('prodPhotoPreviewContainer').classList.remove('hidden');
            if (prod.photoUrl.startsWith('http')) {
                document.getElementById('modalProdPhotoUrl').value = prod.photoUrl;
            } else {
                document.getElementById('modalProdPhotoUrl').value = '';
            }
        } else {
            removeProductPhoto();
        }
    } else {
        document.getElementById('modalProdId').value = '';
        document.getElementById('prodModalTitle').textContent = 'Crear Producto';
        document.getElementById('modalProdName').value = '';
        if (categoriesList[0]) document.getElementById('modalProdCategory').value = categoriesList[0].name;
        document.getElementById('modalProdPrice').value = '';
        document.getElementById('modalProdEmoji').value = '📦';
        removeProductPhoto();
    }
    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() { document.getElementById('productModal').classList.add('hidden'); }

function saveProductFromModal() {
    const prodId = document.getElementById('modalProdId').value;
    const supermarketId = document.getElementById('modalProdSupermarket').value;
    const name = document.getElementById('modalProdName').value.trim();
    const category = document.getElementById('modalProdCategory').value;
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const iconEmoji = document.getElementById('modalProdEmoji').value.trim();
    const photoUrl = document.getElementById('modalProdPhoto').value.trim();
    const replicateCheckbox = document.getElementById('modalProdReplicateAll');
    const replicateAll = replicateCheckbox ? replicateCheckbox.checked : false;

    if (!name || isNaN(price)) return alert("Completa el nombre y precio del producto.");

    if (replicateAll) {
        if (APP_STATE.supermarkets.length === 0) return alert("No hay supermercados creados.");

        const batch = db.batch();
        const now = Date.now();

        APP_STATE.supermarkets.forEach((sup, idx) => {
            const newId = 'prod-' + now + '-' + idx;
            const docRef = db.collection('products').doc(newId);
            const data = {
                id: newId,
                supermarketId: sup.id,
                name,
                category,
                price,
                iconEmoji: iconEmoji || '📦',
                photoUrl
            };
            batch.set(docRef, data);
        });

        batch.commit().then(() => {
            closeProductModal();
            alert(`✅ Producto replicado y guardado en los ${APP_STATE.supermarkets.length} supermercados.`);
        }).catch(err => alert("❌ Error al replicar productos: " + err.message));

    } else {
        const id = prodId || ('prod-' + Date.now());
        const data = { id, supermarketId, name, category, price, iconEmoji: iconEmoji || '📦', photoUrl };

        db.collection('products').doc(id).set(data).then(() => {
            closeProductModal();
            alert("✅ Producto guardado en la nube con su imagen.");
        }).catch(err => alert("❌ Error al guardar producto: " + err.message));
    }
}

function deleteProduct(id) {
    if (confirm("¿Eliminar este producto?")) db.collection('products').doc(id).delete();
}

function resetUserPassword(userId) {
    const user = APP_STATE.users.find(u => u.id === userId);
    if (!user) return;

    const initialPin = getInitialPinFromRut(user.rut);
    db.collection('users').doc(userId).update({ pin: initialPin, mustChangePassword: true }).then(() => {
        user.pin = initialPin;
        sendAutomaticCredentialsEmail(user);
        alert(`🔒 Clave de ${user.name} reiniciada a ${initialPin}.\nNotificación enviada por correo a ${user.email}.`);
    });
}

function addNewCoursePrompt() {
    const name = prompt("Nombre del nuevo curso (ej: 2° Básico NEE):");
    if (!name) return;
    const newId = 'c-' + Date.now();
    db.collection('courses').doc(newId).set({ id: newId, name });
}

function deleteCourse(id) {
    if (confirm("¿Eliminar este curso de la Nube?")) db.collection('courses').doc(id).delete();
}

function deleteUser(id) {
    if (confirm("¿Eliminar este usuario del sistema?")) db.collection('users').doc(id).delete();
}

function goHome() {
    APP_STATE.selectedSupermarketId = null;
    renderApp();
}

// ==========================================
// VISTA DEL ESTUDIANTE Y TIENDA
// ==========================================
function renderHomeView(container) {
    let html = `
        <div class="space-y-6">
            <div class="text-center max-w-2xl mx-auto space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-800">¡Bienvenido a Comprar! 🛍️</h2>
                <p class="text-slate-600 font-medium">Elige un supermercado para comenzar tu compra con billetes y monedas.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    `;

    APP_STATE.supermarkets.forEach(sup => {
        const count = APP_STATE.products.filter(p => p.supermarketId === sup.id).length;
        const iconEmoji = sup.icon || '🛒';
        
        const iconDisplay = (sup.photoUrl && sup.photoUrl.trim() !== '') 
            ? `<img src="${sup.photoUrl}" class="w-20 h-20 rounded-2xl object-cover shadow border-2 border-white" onerror="handleImageError(this, '${iconEmoji}')">`
            : `<span class="text-5xl">${iconEmoji}</span>`;

        html += `
            <div onclick="selectSupermarket('${sup.id}')"
                 class="bg-white rounded-3xl border-4 ${sup.borderColor || 'border-slate-300'} p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col items-center text-center space-y-4 touch-focus active:scale-95 group">
                <div class="${sup.themeColor || 'bg-amber-400'} p-4 rounded-3xl shadow-inner group-hover:scale-110 transition-transform flex items-center justify-center">
                    ${iconDisplay}
                </div>
                <div>
                    <h3 class="text-2xl font-black ${sup.textColor || 'text-slate-800'}">${sup.name}</h3>
                    <p class="text-xs font-semibold text-slate-500 mt-1">${sup.description || 'Supermercado'}</p>
                </div>
                <span class="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-300">
                    ${count} productos
                </span>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function selectSupermarket(id) {
    APP_STATE.selectedSupermarketId = id;
    APP_STATE.selectedCategoryFilter = 'all';
    const sup = APP_STATE.supermarkets.find(s => s.id === id);
    renderApp();
    if (sup) speakText(`Entrando a ${sup.name}`);
}

function filterCategory(cat) {
    APP_STATE.selectedCategoryFilter = cat;
    renderSupermarketView(document.getElementById('appContainer'), APP_STATE.selectedSupermarketId);
}

function renderSupermarketView(container, supId) {
    const sup = APP_STATE.supermarkets.find(s => s.id === supId);
    let products = APP_STATE.products.filter(p => p.supermarketId === supId);

    if (!sup) { goHome(); return; }

    const categories = Array.from(new Set(products.map(p => p.category || 'General')));

    let filteredProducts = products;
    if (APP_STATE.selectedCategoryFilter !== 'all') {
        filteredProducts = products.filter(p => (p.category || 'General') === APP_STATE.selectedCategoryFilter);
    }

    let html = `
        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm">
                <button onclick="goHome()" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl flex items-center space-x-2 border-b-4 border-slate-400 active:scale-95 touch-focus">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Volver</span>
                </button>
                <div class="flex items-center space-x-3">
                    <span class="text-3xl">${sup.icon || '🛒'}</span>
                    <h2 class="text-2xl font-black text-slate-800">${sup.name}</h2>
                </div>
            </div>

            <div class="bg-white p-3 rounded-2xl border-2 border-slate-200 flex items-center gap-2 overflow-x-auto">
                <button onclick="filterCategory('all')" class="px-4 py-2 rounded-xl font-extrabold text-xs shrink-0 transition-all ${APP_STATE.selectedCategoryFilter === 'all' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                    ✨ Ver Todas las Categorías
                </button>
                ${categories.map(cat => `
                    <button onclick="filterCategory('${cat}')" class="px-4 py-2 rounded-xl font-extrabold text-xs shrink-0 transition-all ${APP_STATE.selectedCategoryFilter === cat ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} flex items-center gap-1.5">
                        <span>${getCategoryIcon(cat)}</span>
                        <span>${cat}</span>
                    </button>
                `).join('')}
            </div>
    `;

    if (filteredProducts.length === 0) {
        html += `
            <div class="bg-white p-12 rounded-3xl text-center space-y-4 border-4 border-dashed border-slate-300">
                <span class="text-5xl">📦</span>
                <h3 class="text-xl font-bold text-slate-600">No hay productos en esta categoría.</h3>
            </div>
        `;
    } else {
        const displayCategories = APP_STATE.selectedCategoryFilter === 'all'
            ? categories
            : [APP_STATE.selectedCategoryFilter];

        displayCategories.forEach(cat => {
            const catProducts = filteredProducts.filter(p => (p.category || 'General') === cat);
            if (catProducts.length === 0) return;

            const catEmoji = getCategoryIcon(cat);

            html += `
                <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow space-y-4">
                    <div class="flex items-center space-x-3 border-b-2 border-indigo-100 pb-3">
                        <span class="text-3xl">${catEmoji}</span>
                        <h3 class="text-xl font-black text-indigo-950">${cat}</h3>
                        <span class="bg-indigo-100 text-indigo-900 font-bold text-xs px-2.5 py-1 rounded-full">${catProducts.length} productos</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            `;

            catProducts.forEach(prod => {
                const breakdown = calculateCLPBreakdown(prod.price);
                const prodVisual = (prod.photoUrl && prod.photoUrl.trim() !== '') 
                    ? `<img src="${prod.photoUrl}" class="w-16 h-16 object-cover rounded-2xl border-2 border-amber-300 shrink-0" onerror="handleProductImageError(this, '${prod.iconEmoji || '📦'}')">`
                    : `<div class="bg-amber-100 p-4 rounded-2xl text-4xl border-2 border-amber-300 flex items-center justify-center shrink-0">${prod.iconEmoji || '📦'}</div>`;

                html += `
                    <div class="bg-slate-50 rounded-3xl border-4 border-slate-200 p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
                        <div class="flex items-center space-x-4">
                            ${prodVisual}
                            <div class="flex-1 min-w-0">
                                <span class="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md tracking-wider">${prod.category || 'General'}</span>
                                <h3 class="text-lg font-black text-slate-800 truncate mt-1">${prod.name}</h3>
                                <div class="text-2xl font-black text-emerald-700 mt-0.5">$${prod.price.toLocaleString('es-CL')}</div>
                            </div>
                        </div>

                        <div class="bg-white p-3 rounded-xl border border-slate-200">
                            <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pagas con:</span>
                            ${renderBreakdownHTML(breakdown, 'sm')}
                        </div>

                        <div class="flex space-x-2">
                            <button onclick="speakText('${prod.name}, vale ${prod.price} pesos')" class="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold p-3 rounded-xl border border-sky-300 active:scale-95">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                            <button onclick="addToBasket('${prod.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl border-b-4 border-emerald-800 flex items-center justify-center space-x-2 active:scale-95 shadow touch-focus">
                                <i class="fa-solid fa-cart-plus"></i>
                                <span>Añadir al Canasto</span>
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });
    }

    html += `</div>`;
    container.innerHTML = html;
}

// ==========================================
// CÁLCULOS MONETARIOS Y DIBUJO DE MONEDAS
// ==========================================
function calculateCLPBreakdown(amount) {
    if (!amount || amount <= 0) return [];
    let remaining = Math.round(amount / 10) * 10;
    const breakdown = [];
    const denominations = [
        { val: 20000, id: 'b20k' }, { val: 10000, id: 'b10k' }, { val: 5000, id: 'b5k' },
        { val: 2000, id: 'b2k' },   { val: 1000, id: 'b1k' },   { val: 500, id: 'c500' },
        { val: 100, id: 'c100' },   { val: 50, id: 'c50' },     { val: 10, id: 'c10' }
    ];

    for (const item of denominations) {
        if (remaining >= item.val) {
            const count = Math.floor(remaining / item.val);
            remaining %= item.val;
            const meta = CLP_CURRENCY_ITEMS.find(c => c.id === item.id);
            breakdown.push({ ...meta, count });
        }
    }
    return breakdown;
}

function renderCurrencySVG(item, size = 'md') {
    const isBill = item.type === 'bill';
    let height = size === 'sm' ? 'h-8' : 'h-12';
    let width = size === 'sm' ? 'w-16' : 'w-24';

    if (!isBill) {
        height = size === 'sm' ? 'h-8' : 'h-10';
        width = size === 'sm' ? 'w-8' : 'w-10';
    }

    const customPhoto = APP_STATE.customCurrencies[item.id] || item.img;

    if (customPhoto) {
        return `
            <div class="currency-item inline-flex items-center justify-center ${width} ${height} rounded-lg overflow-hidden border border-slate-700 shadow-md bg-white select-none shrink-0" title="${item.name}">
                <img src="${customPhoto}" class="w-full h-full object-contain" alt="${item.name}">
            </div>
        `;
    }

    return `
        <div class="currency-item inline-flex items-center justify-center ${width} ${height} rounded-lg bg-amber-400 font-black text-slate-900 border shadow shrink-0">
            $${item.value}
        </div>
    `;
}

function renderBreakdownHTML(breakdownArray, size = 'md') {
    if (!breakdownArray || breakdownArray.length === 0) return '<span class="text-xs text-slate-400 italic">Pago exacto (sin vuelto)</span>';
    let html = '<div class="flex flex-wrap gap-2 items-center">';
    breakdownArray.forEach(item => {
        for (let i = 0; i < (item.count || 1); i++) {
            html += renderCurrencySVG(item, size);
        }
    });
    html += '</div>';
    return html;
}

// ==========================================
// GESTIÓN DEL CANASTO Y CAJA DE PAGO
// ==========================================
function addToBasket(prodId) {
    const prod = APP_STATE.products.find(p => p.id === prodId);
    if (!prod) return;
    const existing = APP_STATE.basket.find(item => item.productId === prodId);
    if (existing) { existing.quantity++; } else { APP_STATE.basket.push({ productId: prodId, quantity: 1 }); }
    playChimeSound();
    updateBasketBadge();
    speakText(`Añadido ${prod.name} al canasto`);
}

function updateBasketBadge() {
    const badge = document.getElementById('basketBadge');
    const totalCount = APP_STATE.basket.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = totalCount;
}

function openBasketModal() {
    renderBasketModal();
    document.getElementById('basketModal').classList.remove('hidden');
}

function closeBasketModal() { document.getElementById('basketModal').classList.add('hidden'); }

function clearBasket() {
    APP_STATE.basket = [];
    APP_STATE.userPaidAmount = 0;
    APP_STATE.foundProductIds = [];
    updateBasketBadge();
    renderBasketModal();
    speakText("El canasto ha sido vaciado");
}

function startSupermarketMission() {
    if (APP_STATE.basket.length === 0) return alert("Agrega productos al canasto antes de comenzar la misión.");

    APP_STATE.missionActive = true;
    APP_STATE.missionStartTime = Date.now();
    APP_STATE.missionElapsedSeconds = 0;
    APP_STATE.foundProductIds = [];

    document.getElementById('missionTimerBadge').classList.remove('hidden');
    
    if (APP_STATE.missionTimerInterval) clearInterval(APP_STATE.missionTimerInterval);
    APP_STATE.missionTimerInterval = setInterval(() => {
        APP_STATE.missionElapsedSeconds = Math.floor((Date.now() - APP_STATE.missionStartTime) / 1000);
        const m = Math.floor(APP_STATE.missionElapsedSeconds / 60).toString().padStart(2, '0');
        const s = (APP_STATE.missionElapsedSeconds % 60).toString().padStart(2, '0');
        document.getElementById('missionTimerText').textContent = `${m}:${s}`;
    }, 1000);

    speakText("Misión iniciada. Busca tus productos con la cámara en las góndolas.");
    renderBasketModal();
}

function openAiScannerForProduct(productId) {
    APP_STATE.currentScanningProductId = productId;
    const prod = APP_STATE.products.find(p => p.id === productId);

    document.getElementById('targetProductBanner').innerHTML = `
        <span>${prod ? prod.name : 'Producto'}</span>
    `;

    document.getElementById('aiScannerModal').classList.remove('hidden');

    const video = document.getElementById('aiScannerVideo');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        aiScannerStream = stream;
        video.srcObject = stream;
        video.play();
    });
}

function closeAiScannerModal() {
    if (aiScannerStream) {
        aiScannerStream.getTracks().forEach(track => track.stop());
        aiScannerStream = null;
    }
    document.getElementById('aiScannerModal').classList.add('hidden');
}

function manualConfirmAiProduct() {
    if (!APP_STATE.currentScanningProductId) return;

    const prodId = APP_STATE.currentScanningProductId;
    if (!APP_STATE.foundProductIds.includes(prodId)) {
        APP_STATE.foundProductIds.push(prodId);
    }

    playChimeSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    
    const prod = APP_STATE.products.find(p => p.id === prodId);
    speakText(`¡Producto encontrado! ${prod ? prod.name : ''}`);

    closeAiScannerModal();
    renderBasketModal();

    const allProductIds = APP_STATE.basket.map(i => i.productId);
    const allFound = allProductIds.every(id => APP_STATE.foundProductIds.includes(id));

    if (allFound) {
        if (APP_STATE.missionTimerInterval) clearInterval(APP_STATE.missionTimerInterval);
        speakText(`¡Felicidades! Encontraste todos los productos en ${APP_STATE.missionElapsedSeconds} segundos.`);
        alert(`🎉 ¡MISIÓN CUMPLIDA! 🎉\n\nEncontraste todos tus productos en ${APP_STATE.missionElapsedSeconds} segundos.`);
    }
}

function renderBasketModal() {
    const listContainer = document.getElementById('basketItemsList');
    const totalEl = document.getElementById('basketTotalCLP');
    const breakdownEl = document.getElementById('basketCurrencyBreakdown');

    let totalAmount = 0;

    if (APP_STATE.basket.length === 0) {
        listContainer.innerHTML = `<div class="text-center py-8 text-slate-400 font-bold">Tu canasto está vacío.</div>`;
    } else {
        let html = '';
        APP_STATE.basket.forEach(item => {
            const prod = APP_STATE.products.find(p => p.id === item.productId);
            if (!prod) return;
            const subtotal = prod.price * item.quantity;
            totalAmount += subtotal;

            const isFound = APP_STATE.foundProductIds.includes(prod.id);
            const itemIcon = (prod.photoUrl && prod.photoUrl.trim() !== '') 
                ? `<img src="${prod.photoUrl}" class="w-10 h-10 rounded-lg object-cover border" onerror="handleBasketItemImageError(this, '${prod.iconEmoji || '📦'}')">`
                : `<span class="text-2xl">${prod.iconEmoji || '📦'}</span>`;

            html += `
                <div class="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 border-2 ${isFound ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'} rounded-2xl gap-2">
                    <div class="flex items-center space-x-3">
                        ${itemIcon}
                        <div>
                            <h4 class="font-black text-slate-800 text-sm">${prod.name}</h4>
                            <span class="text-xs font-bold text-emerald-700">$${prod.price.toLocaleString('es-CL')} c/u</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${APP_STATE.missionActive ? `
                            <button onclick="openAiScannerForProduct('${prod.id}')" class="px-3 py-1.5 rounded-xl font-black text-xs ${isFound ? 'bg-emerald-600 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white shadow'} active:scale-95">
                                ${isFound ? '✓ Encontrado' : '📷 Escanear en Góndola'}
                            </button>
                        ` : ''}
                        <span class="font-black px-2 text-sm">${item.quantity} u.</span>
                        <span class="font-black text-slate-800 text-sm">$${subtotal.toLocaleString('es-CL')}</span>
                        <button onclick="removeFromBasket('${prod.id}')" class="text-rose-500 p-1">✕</button>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    }

    totalEl.textContent = `$${totalAmount.toLocaleString('es-CL')}`;
    breakdownEl.innerHTML = renderBreakdownHTML(calculateCLPBreakdown(totalAmount), 'md');
    renderPaymentMoneyTray();
    updateUserPaidDisplay();
}

function removeFromBasket(prodId) {
    APP_STATE.basket = APP_STATE.basket.filter(i => i.productId !== prodId);
    APP_STATE.foundProductIds = APP_STATE.foundProductIds.filter(id => id !== prodId);
    updateBasketBadge();
    renderBasketModal();
}

function calculateBasketTotal() {
    return APP_STATE.basket.reduce((sum, item) => {
        const prod = APP_STATE.products.find(p => p.id === item.productId);
        return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
}

function renderPaymentMoneyTray() {
    const tray = document.getElementById('paymentMoneyTray');
    if (!tray) return;
    let html = '';
    CLP_CURRENCY_ITEMS.forEach(item => {
        html += `
            <button onclick="addPaidMoney(${item.value})" class="bg-white hover:bg-indigo-100 p-2 rounded-xl border-2 border-indigo-300 flex flex-col items-center justify-center space-y-1 shadow-sm active:scale-95 touch-focus">
                ${renderCurrencySVG(item, 'sm')}
                <span class="text-[10px] font-black text-indigo-900">+ $${item.value.toLocaleString('es-CL')}</span>
            </button>
        `;
    });
    tray.innerHTML = html;
}

function addPaidMoney(amount) {
    APP_STATE.userPaidAmount += amount;
    playChimeSound();
    updateUserPaidDisplay();
    speakText(`Sumaste ${amount} pesos`);
}

function resetUserPayment() {
    if (APP_STATE && APP_STATE.telemetry) {
        APP_STATE.telemetry.paymentResetsCount++;
    }
    APP_STATE.userPaidAmount = 0;
    updateUserPaidDisplay();
    speakText("Dinero devuelto");
}

function updateUserPaidDisplay() {
    const paidEl = document.getElementById('userPaidTotal');
    if (paidEl) paidEl.textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;
}

function verifyAndCheckout() {
    const totalNeeded = calculateBasketTotal();
    if (totalNeeded === 0) { speakText("El canasto está vacío"); return; }

    if (APP_STATE.userPaidAmount >= totalNeeded) {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
        const vuelto = APP_STATE.userPaidAmount - totalNeeded;

        const evalId = 'eval-' + Date.now();
        const evalData = {
            id: evalId,
            studentId: APP_STATE.currentUser.id,
            studentName: APP_STATE.currentUser.name,
            courseId: APP_STATE.currentUser.courseId || (APP_STATE.currentUser.courseIds ? APP_STATE.currentUser.courseIds[0] : ''),
            items: APP_STATE.basket.map(i => {
                const p = APP_STATE.products.find(prod => prod.id === i.productId);
                return { productId: i.productId, productName: p ? p.name : 'Producto', quantity: i.quantity, price: p ? p.price : 0 };
            }),
            totalAmount: totalNeeded,
            paidAmount: APP_STATE.userPaidAmount,
            timeSeconds: APP_STATE.missionElapsedSeconds || 0,
            telemetry: { ...APP_STATE.telemetry },
            timestamp: new Date().toISOString()
        };

        db.collection('evaluations').doc(evalId).set(evalData);

        document.getElementById('successModalTotal').textContent = `$${totalNeeded.toLocaleString('es-CL')}`;
        document.getElementById('successModalPaid').textContent = `$${APP_STATE.userPaidAmount.toLocaleString('es-CL')}`;
        document.getElementById('successModalVueltoAmount').textContent = `$${vuelto.toLocaleString('es-CL')}`;

        const vueltoBreakdown = calculateCLPBreakdown(vuelto);
        document.getElementById('successModalVueltoBreakdown').innerHTML = renderBreakdownHTML(vueltoBreakdown, 'md');

        speakText(`¡Excelente trabajo! Has pagado correctamente.${vuelto > 0 ? ` Tu vuelto es ${vuelto} pesos.` : ' Pagaste con el monto exacto.'}`);

        document.getElementById('checkoutSuccessModal').classList.remove('hidden');

    } else {
        const falta = totalNeeded - APP_STATE.userPaidAmount;
        speakText(`Te faltan ${falta} pesos`);
        alert(`⚠️ Te faltan $${falta.toLocaleString('es-CL')} pesos para pagar.`);
    }
}

function closeSuccessModalAndFinish() {
    if (APP_STATE.missionTimerInterval) clearInterval(APP_STATE.missionTimerInterval);
    document.getElementById('missionTimerBadge').classList.add('hidden');

    document.getElementById('checkoutSuccessModal').classList.add('hidden');
    
    APP_STATE.basket = [];
    APP_STATE.userPaidAmount = 0;
    APP_STATE.missionActive = false;
    APP_STATE.foundProductIds = [];
    APP_STATE.telemetry = { voiceHelpCount: 0, paymentResetsCount: 0 };
    updateBasketBadge();
    closeBasketModal();
    renderApp();
}

// ==========================================
// INICIALIZACIÓN AUTOMÁTICA
// ==========================================
initFirebaseListeners();
renderApp();

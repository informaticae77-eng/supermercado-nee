/* ========================================================================
   MINIJUEGOS NEE
   Compatible con APP_STATE de app.js y con el catálogo de Firestore.
   ======================================================================== */

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1]
};

function loadMinigamesProgress() {
    const key = minigamesProgressStorageKey();
    if (!key) {
        alert('Inicia sesión para guardar el progreso de los minijuegos.');
        return false;
    }
    try {
        const saved = localStorage.getItem(key);
        studentMinigamesProgress = { currentLevel: 1, completedGames: {}, unlockedLevels: [1] };
        if (!saved) return true;
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
            studentMinigamesProgress = {
                currentLevel: Number(parsed.currentLevel) || 1,
                completedGames: parsed.completedGames || {},
                unlockedLevels: Array.isArray(parsed.unlockedLevels) ? parsed.unlockedLevels : [1]
            };
        }
        return true;
    } catch (error) {
        console.error('No se pudo cargar el progreso de minijuegos:', error);
        alert('No se pudo cargar el progreso de minijuegos en este dispositivo.');
        return false;
    }
}

function minigamesProgressStorageKey() {
    const user = typeof APP_STATE !== 'undefined' ? APP_STATE.currentUser : null;
    if (!user || !user.id) return null;
    const mode = APP_STATE.teacherPreviewMode ? 'preview' : 'student';
    return `nee_arcade_progress_v37_${mode}_${encodeURIComponent(String(user.id))}`;
}

function saveMinigamesProgress() {
    const key = minigamesProgressStorageKey();
    if (!key) {
        alert('Inicia sesión para guardar el progreso de los minijuegos.');
        return;
    }
    try {
        localStorage.setItem(key, JSON.stringify(studentMinigamesProgress));
    } catch (error) {
        console.error('No se pudo guardar el progreso de minijuegos:', error);
        alert('No se pudo guardar el progreso de minijuegos en este dispositivo.');
    }
}

function exitArcadeToDashboard() {
    if (typeof APP_STATE !== 'undefined') APP_STATE.arcadeActive = false;
    bossState = null;
    closeGameOverlay();
    if (typeof renderApp === 'function') renderApp();
    else window.location.reload();
}

const CATEGORY_ICONS = {
    'lácteos': '🥛', 'frutas': '🍎', 'verduras': '🥕', 'panadería': '🍞',
    'aseo': '🧼', 'limpieza': '🧼', 'bebidas': '🧃', 'carnes': '🥩',
    'fiambre': '🧀', 'despensa': '🌾', 'congelados': '🧊', 'mascotas': '🐶'
};

function getCategoryIcon(category) {
    const value = String(category || '').toLocaleLowerCase('es');
    const match = Object.keys(CATEGORY_ICONS).find(key => value.includes(key));
    return match ? CATEGORY_ICONS[match] : '🏷️';
}

function getDatabaseProducts() {
    if (bossState) return bossState.products;
    let source = [];

    // APP_STATE es una variable global léxica de app.js, no necesariamente window.APP_STATE.
    if (typeof APP_STATE !== 'undefined' && APP_STATE && Array.isArray(APP_STATE.products)) {
        source = APP_STATE.products;
    } else if (window.APP_STATE && Array.isArray(window.APP_STATE.products)) {
        source = window.APP_STATE.products;
    } else if (window.PRODUCT_STORE && typeof window.PRODUCT_STORE.getProducts === 'function') {
        source = window.PRODUCT_STORE.getProducts();
    } else if (Array.isArray(window.products)) {
        source = window.products;
    }

    if (!Array.isArray(source)) return [];

    return source.filter(Boolean).map((item, index) => {
        const rawPrice = item.price ?? item.precio ?? 1000;
        const price = Number(String(rawPrice).replace(/[^0-9.-]/g, '')) || 1000;
        let photo = item.photoUrl || item.photo || item.image || item.imagen || item.img ||
            item.foto || item.fotoUrl || item.imageUrl || item.image_url ||
            item.urlImagen || item.url_imagen || '';
        photo = String(photo || '').trim();

        // Acepta base64 desnudo y rutas relativas. No convierte URLs ni data URLs.
        if (photo && !/^(data:|https?:|\/|blob:|file:)/i.test(photo) && /^[A-Za-z0-9+/=]+$/.test(photo)) {
            photo = `data:image/jpeg;base64,${photo}`;
        }

        return {
            id: String(item.id ?? `prod-${index}`),
            name: String(item.name || item.nombre || item.productName || `Producto ${index + 1}`),
            category: String(item.category || item.categoria || 'General'),
            price,
            photoUrl: photo,
            iconEmoji: item.iconEmoji || item.emoji || '🛍️'
        };
    });
}

function getDatabaseCategories() {
    if (bossState) return bossState.categories;
    const storedCategories = typeof APP_STATE !== 'undefined' && Array.isArray(APP_STATE.categories)
        ? APP_STATE.categories.map(category => category.name || category.category)
        : [];
    return [...new Set([...storedCategories, ...getDatabaseProducts().map(product => product.category)]
        .map(category => String(category || '').trim())
        .filter(Boolean))];
}

function renderProductVisual(product, size = 'text-7xl') {
    const emoji = product && product.iconEmoji ? product.iconEmoji : '🛍️';
    if (!product || !product.photoUrl) return `<span class="${size} font-black">${emoji}</span>`;
    const src = String(product.photoUrl).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const alt = String(product.name || 'Producto').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<img src="${src}" alt="${alt}" class="max-h-full max-w-full object-contain mx-auto" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="${size} font-black" hidden>${emoji}</span>`;
}

function getDatabaseCurrencies() {
    if (bossState) return bossState.currencies;
    const currencies = typeof CLP_CURRENCY_ITEMS !== 'undefined' && Array.isArray(CLP_CURRENCY_ITEMS)
        ? CLP_CURRENCY_ITEMS
        : Array.isArray(window.CLP_CURRENCY_ITEMS) ? window.CLP_CURRENCY_ITEMS : [];
    const customImages = typeof APP_STATE !== 'undefined' && APP_STATE.customCurrencies
        ? APP_STATE.customCurrencies
        : {};

    return currencies.map(currency => ({
        ...currency,
        value: Number(currency.value),
        img: customImages[currency.id] || currency.img,
        label: `$${Number(currency.value).toLocaleString('es-CL')} pesos`
    }));
}

function renderGameOverlay(content) {
    let overlay = document.getElementById('nee-game-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nee-game-modal-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;background:rgba(2,6,23,.96);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = content;
    overlay.style.display = 'flex';
}

function closeGameOverlay() {
    if (petRefreshTimer !== null) {
        window.clearInterval(petRefreshTimer);
        petRefreshTimer = null;
    }
    const overlay = document.getElementById('nee-game-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function openMinigamesArcade() {
    if (typeof APP_STATE !== 'undefined') APP_STATE.arcadeActive = true;
    renderMinigamesArcadeView();
    if (typeof speakText === 'function') {
        speakText('Bienvenido al centro de minijuegos. Aquí practicarás con productos y compras. En El Estante Correcto clasifica productos; en Reconoce Billetes y Monedas aprende sus valores; en Palabras en Góndola reconoce nombres; en Calculadora del Canasto suma precios; y en La Lista de Compras encuentra productos por su imagen. Escucha la ayuda de cada pregunta y puedes repetirla con el botón de audio. Cada minijuego completado entrega 15 puntos.');
    }
}

function renderMinigamesArcadeView() {
    if (!loadMinigamesProgress()) return;
    const container = document.getElementById('appContainer') || document.querySelector('main') || document.body;
    if (!container) return;

    const level = Math.min(5, Math.max(1, Number(studentMinigamesProgress.currentLevel) || 1));
    studentMinigamesProgress.currentLevel = level;
    const completed = studentMinigamesProgress.completedGames[`level${level}`] || [];
    const levels = ['Comprador Principiante', 'Explorador de Góndolas', 'As del Vuelto y Cajas', 'Planificador Experto', 'Maestro del Supermercado'];

    container.innerHTML = `
      <section class="min-h-[70vh] bg-slate-950 text-slate-100 p-4 sm:p-7 rounded-3xl">
        <header class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-indigo-500/50">
          <div class="flex items-center gap-3"><button onclick="exitArcadeToDashboard()" class="bg-indigo-600 text-white px-4 py-3 rounded-xl font-black">⬅ Volver</button><div><span class="text-indigo-300 text-xs font-black">ARCADE DE APRENDIZAJE</span><h1 class="text-xl font-black">CENTRO DE DESAFÍOS</h1></div></div>
          <div class="flex flex-wrap gap-2">${levels.map((name, i) => { const n = i + 1; const unlocked = studentMinigamesProgress.unlockedLevels.includes(n); return `<button ${unlocked ? `onclick="switchLevel(${n})"` : 'disabled'} class="px-3 py-2 rounded-xl font-bold ${n === level ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">Nivel ${n}${unlocked ? '' : ' 🔒'}</button>`; }).join('')}</div>
        </header>
        <div class="max-w-7xl mx-auto mt-5 bg-slate-900 p-5 rounded-3xl border border-indigo-500/40 flex justify-between items-center gap-3"><div><p class="text-amber-400 font-black">Nivel ${level} de 5</p><h2 class="text-2xl font-black">${levels[level - 1]}</h2></div><p class="font-black text-amber-300">${completed.length} / 5</p></div>
        <p class="max-w-7xl mx-auto mt-4 bg-indigo-950 border border-indigo-500/50 rounded-2xl p-4 text-sm text-indigo-100"><b class="text-white">¿De qué se trata?</b> Practica reconocer productos, categorías y dinero chileno. Escucha las instrucciones al comenzar cada desafío y toca <b class="text-white">🔊 Repetir ayuda</b> si necesitas volver a oírlas.</p>
        <main class="max-w-7xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${renderGameCard(1, '🍎 El Estante Correcto', 'Clasifica productos por categoría.', 'startMinigame1', 'mj1', completed)}
          ${renderGameCard(2, '💵 Reconoce Billetes y Monedas', 'Reconoce el valor de billetes y monedas chilenas.', 'startMinigame2', 'mj2', completed)}
          ${renderGameCard(3, '🔤 Palabras en Góndola', 'Lee el nombre del producto.', 'startMinigame3', 'mj3', completed)}
          ${renderGameCard(4, '🧮 Calculadora del Canasto', 'Suma los precios de dos productos.', 'startMinigame4', 'mj4', completed)}
          ${renderGameCard(5, '📋 La Lista de Compras', 'Encuentra el producto usando su imagen.', 'startMinigame5', 'mj5', completed)}
          <div class="bg-slate-900 p-5 rounded-3xl border border-amber-500"><h3 class="font-black text-amber-300">👑 Desafío final: el jefe del supermercado</h3><p class="my-3 text-sm">Completa los cinco minijuegos y enfrenta cinco etapas para desbloquear el siguiente nivel.</p><button ${completed.length >= 5 ? `onclick="startBossExam(${level})"` : 'disabled'} class="w-full bg-amber-500 text-slate-950 p-3 rounded-xl font-black">${completed.length >= 5 ? 'Enfrentar desafío' : '🔒 Completa los 5 minijuegos'}</button></div>
          ${level === 1 ? `<article class="bg-slate-900 p-5 rounded-3xl border border-pink-500"><h3 class="font-black text-pink-300">🎁 Premio: cuida a tu mascota</h3><p class="my-3 text-sm">Alimenta, da agua y juega con tu mascota. Se guarda en este dispositivo.</p><button onclick="openPetGame()" class="w-full bg-pink-600 p-3 rounded-xl font-black">🐾 Abrir premio del nivel 1</button><p class="mt-2 text-xs text-slate-300">Se desbloquea al completar el desafío final del nivel 1.</p></article>` : ''}
        </main>
      </section>`;
}

function renderGameCard(number, title, description, functionName, key, completed) {
    const done = completed.includes(key);
    const unlocked = number === 1 || completed.includes(`mj${number - 1}`);
    return `<article class="bg-slate-900 p-5 rounded-3xl border ${done ? 'border-emerald-500' : 'border-slate-700'} flex flex-col justify-between gap-4"><div><span class="text-xs font-black text-indigo-300">${done ? '✓ COMPLETADO' : `DESAFÍO ${number}`}</span><h3 class="font-black text-lg mt-2">${title}</h3><p class="text-slate-400 text-sm mt-1">${description}</p></div><button ${unlocked ? `onclick="${functionName}()"` : 'disabled'} class="w-full ${unlocked ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 text-slate-500'} text-white py-3 rounded-xl font-black">${unlocked ? (done ? 'Rejugar' : '▶ Iniciar') : '🔒 Bloqueado'}</button></article>`;
}

let gameState = { startTime: null, errors: 0, currentQuestion: 0, questions: [], key: '' };
let bossState = null;
let petRefreshTimer = null;
const BOSS_SKILLS = [
    { key: 'mj1', label: 'Categorías' },
    { key: 'mj2', label: 'Billetes y monedas' },
    { key: 'mj3', label: 'Nombres de productos' },
    { key: 'mj4', label: 'Suma de precios' },
    { key: 'mj5', label: 'Lista de compras' }
];

function beginGame(key, maxQuestions, questionPool = getDatabaseProducts()) {
    if (!questionPool.length) {
        alert('No hay productos disponibles para los minijuegos. Espera a que cargue el catálogo e inténtalo nuevamente.');
        return false;
    }
    const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
    gameState = { key, startTime: Date.now(), errors: 0, currentQuestion: 0, questions: shuffled.slice(0, Math.min(maxQuestions, shuffled.length)) };
    return true;
}

function startMinigame1() { if (beginGame('mj1', 5)) renderQuestion1(); }
function startMinigame2() {
    const currencies = getDatabaseCurrencies();
    if (!currencies.length) {
        alert('No hay billetes o monedas disponibles para el minijuego.');
        return;
    }
    if (beginGame('mj2', 5, currencies)) renderQuestion2();
}
function startMinigame3() { if (beginGame('mj3', 5)) renderQuestion3(); }
function startMinigame4() { if (beginGame('mj4', 4)) renderQuestion4(); }
function startMinigame5() { if (beginGame('mj5', 5)) renderQuestion5(); }

function questionFrame(color, label, content, choices, exitLabel = 'Salir') {
    const bossBanner = bossState ? `<div class="bg-amber-950 border border-amber-400 rounded-2xl p-3"><p class="text-2xl">👑 🛒</p><p class="font-black text-amber-300">Jefe del supermercado · ${bossState.stage} de 5 estrellas</p><p class="text-sm">Completa las cinco etapas para vencer al jefe.</p></div>` : '';
    const progress = bossState ? `Etapa ${bossState.stage + 1} de 5` : `Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}`;
    return `<div class="max-w-2xl w-full bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border-2 ${color} shadow-2xl space-y-5 text-center my-auto">${bossBanner}<div class="flex justify-between items-center border-b border-slate-700 pb-3"><b class="text-xs">${label}</b><b class="text-amber-300 text-xs">${progress}</b></div>${content}<button onclick="repeatGameHelp()" class="bg-sky-700 hover:bg-sky-600 px-4 py-2 rounded-xl font-black text-sm" aria-label="Repetir instrucciones de voz">🔊 Repetir ayuda</button>${choices}<p id="bossFeedback" role="status" class="text-amber-200 font-bold"></p><button onclick="exitGameQuestion()" class="text-slate-400 underline text-xs">✕ ${exitLabel}</button></div>`;
}

function exitGameQuestion() {
    bossState = null;
    closeGameOverlay();
    renderMinigamesArcadeView();
}

function repeatGameHelp() {
    if (bossState) bossState.current.repeatedHelp++;
    if (gameState.helpText && typeof speakText === 'function') speakText(gameState.helpText);
}

function presentGameQuestion(helpText) {
    gameState.helpText = bossState ? `Jefe del supermercado. Etapa ${bossState.stage + 1} de 5. ${helpText}` : helpText;
    if (typeof speakText === 'function') speakText(gameState.helpText);
}

function encodedArg(value) {
    return JSON.stringify(String(value)).replace(/</g, '\\u003c').replace(/&/g, '\\u0026').replace(/"/g, '&quot;');
}

function renderQuestion1() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj1', 'El Estante Correcto');
    const product = gameState.questions[gameState.currentQuestion];
    const categories = [...new Set([...getDatabaseCategories(), product.category])].filter(Boolean).sort(() => Math.random() - .5).slice(0, 4);
    if (!categories.includes(product.category)) categories[0] = product.category;
    const visual = `<div class="w-48 h-48 mx-auto bg-white rounded-3xl p-3 flex items-center justify-center">${renderProductVisual(product)}</div><h2 class="font-black text-xl mt-3">${product.name}</h2>`;
    const buttons = `<div class="grid sm:grid-cols-2 gap-3">${categories.map(c => `<button onclick="answerCategory(${encodedArg(c)})" class="bg-indigo-600 p-4 rounded-xl font-black">${getCategoryIcon(c)} ${c}</button>`).join('')}</div>`;
    presentGameQuestion(`Busca el producto ${product.name}. ¿En qué categoría está? Escucha las opciones: ${categories.join(', ')}.`);
    renderGameOverlay(questionFrame('border-indigo-500', 'OA04 · Clasifica el producto', visual, buttons, 'Salir al arcade'));
}
function answerCategory(category) {
    const q = gameState.questions[gameState.currentQuestion];
    if (bossState) return answerBossStage(String(category).toLowerCase() === String(q.category).toLowerCase());
    if (String(category).toLowerCase() === String(q.category).toLowerCase()) { gameState.currentQuestion++; renderQuestion1(); }
    else { gameState.errors++; alert(`❌ ${q.name} no va en ${category}. Inténtalo otra vez.`); }
}

function renderQuestion2() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj2', 'Reconoce billetes y monedas');
    const currency = gameState.questions[gameState.currentQuestion];
    const currencyKind = currency.type === 'coin' ? 'moneda' : 'billete';
    const choices = [...new Map([currency, ...getDatabaseCurrencies().filter(item => item.id !== currency.id)
        .sort(() => Math.random() - 0.5).slice(0, 3)].map(item => [item.id, item])).values()]
        .sort(() => Math.random() - 0.5);
    const visual = `<div class="w-64 h-36 mx-auto bg-white rounded-3xl p-3 flex items-center justify-center">${currency.img ? `<img src="${currency.img}" alt="${currencyKind === 'moneda' ? 'Moneda chilena' : 'Billete chileno'}" class="max-h-full max-w-full object-contain">` : `<span class="text-4xl">${currency.type === 'coin' ? '🪙' : '💵'}</span>`}</div><p class="font-bold text-slate-300 mt-3">¿Cuánto vale ${currencyKind === 'moneda' ? 'esta' : 'este'} ${currencyKind}?</p>`;
    const choiceLabels = choices.map(item => `${item.type === 'coin' ? 'moneda' : 'billete'} de ${item.value} pesos`);
    const buttons = `<div class="grid grid-cols-2 gap-3">${choices.map(m => `<button onclick="answerGeneric(${Number(m.value)},${Number(currency.value)},'mj2')" class="bg-slate-800 border border-emerald-400 p-3 rounded-xl font-black">${m.img ? `<img src="${m.img}" alt="" class="h-14 mx-auto object-contain">` : `<span class="text-2xl">${m.type === 'coin' ? '🪙' : '💵'}</span>`}<span class="block text-amber-300">${m.label}</span></button>`).join('')}</div>`;
    presentGameQuestion(`Observa ${currencyKind === 'moneda' ? 'esta moneda' : 'este billete'}. Escucha las opciones: ${choiceLabels.join(', ')}. ¿Cuánto vale?`);
    renderGameOverlay(questionFrame('border-emerald-500', 'OA07 · Reconoce billetes y monedas', visual, buttons));
}

function renderQuestion3() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj3', 'Palabras en Góndola');
    const p = gameState.questions[gameState.currentQuestion];
    const names = [...new Set([p.name, ...getDatabaseProducts().filter(item => item.id !== p.id).map(item => item.name)])].slice(0, 4).sort(() => Math.random() - .5);
    const visual = `<div class="w-44 h-44 mx-auto bg-white rounded-3xl p-3 flex items-center justify-center">${renderProductVisual(p)}</div><p class="text-slate-300 font-bold mt-3">¿Cómo se llama este producto?</p>`;
    const choices = `<div class="grid sm:grid-cols-2 gap-3">${names.map(name => `<button onclick="answerGeneric(${encodedArg(name)},${encodedArg(p.name)},'mj3')" class="bg-amber-600 p-3 rounded-xl font-black">${name}</button>`).join('')}</div>`;
    presentGameQuestion(`Observa la imagen del producto. Escucha los nombres posibles: ${names.join(', ')}. ¿Cómo se llama?`);
    renderGameOverlay(questionFrame('border-amber-500', 'OA02 · Lee el producto', visual, choices));
}

function renderQuestion4() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj4', 'Calculadora del Canasto');
    const p1 = gameState.questions[gameState.currentQuestion];
    const p2 = gameState.questions[(gameState.currentQuestion + 1) % gameState.questions.length];
    const total = p1.price + p2.price;
    const values = [...new Set([total, total + 500, Math.max(100, total - 300), total + 1000])].sort(() => Math.random() - .5);
    const visual = `<div class="flex items-center justify-center gap-4"><div>${renderProductVisual(p1, 'text-5xl')}<p>$${p1.price.toLocaleString('es-CL')}</p></div><b class="text-3xl">+</b><div>${renderProductVisual(p2, 'text-5xl')}<p>$${p2.price.toLocaleString('es-CL')}</p></div></div><p class="font-black text-lg mt-3">¿Cuánto cuestan juntos?</p>`;
    const choices = `<div class="grid grid-cols-2 gap-3">${values.map(value => `<button onclick="answerGeneric(${value},${total},'mj4')" class="bg-purple-600 p-4 rounded-xl font-black">$${value.toLocaleString('es-CL')}</button>`).join('')}</div>`;
    presentGameQuestion(`El producto ${p1.name} cuesta ${p1.price} pesos y ${p2.name} cuesta ${p2.price} pesos. ¿Cuánto cuestan juntos?`);
    renderGameOverlay(questionFrame('border-purple-500', 'OA09 · Suma el canasto', visual, choices));
}

function renderQuestion5() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj5', 'La Lista de Compras');
    const target = gameState.questions[gameState.currentQuestion];
    const options = [target, ...getDatabaseProducts().filter(p => p.id !== target.id)].slice(0, 4).sort(() => Math.random() - .5);
    const visual = `<p class="text-slate-300 font-bold">Encuentra este producto:</p><h2 class="text-2xl text-amber-300 font-black">${target.name}</h2>`;
    const choices = `<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">${options.map(item => `<button onclick="answerGeneric(${encodedArg(item.id)},${encodedArg(target.id)},'mj5')" class="bg-white h-28 rounded-xl p-2 flex items-center justify-center">${renderProductVisual(item, 'text-5xl')}</button>`).join('')}</div>`;
    presentGameQuestion(`Encuentra el producto ${target.name}. Escucha su nombre y busca su imagen entre las opciones.`);
    renderGameOverlay(questionFrame('border-rose-500', 'OA12 · Encuentra el producto', visual, choices));
}

function answerGeneric(selected, correct, key) {
    if (bossState) return answerBossStage(String(selected) === String(correct));
    if (String(selected) === String(correct)) {
        gameState.currentQuestion++;
        ({ mj2: renderQuestion2, mj3: renderQuestion3, mj4: renderQuestion4, mj5: renderQuestion5 })[key]();
    } else {
        gameState.errors++;
        alert('❌ Respuesta incorrecta. ¡Inténtalo de nuevo!');
    }
}

function finishMinigame(key, title) {
    closeGameOverlay();
    const level = studentMinigamesProgress.currentLevel || 1;
    const listKey = `level${level}`;
    if (!Array.isArray(studentMinigamesProgress.completedGames[listKey])) studentMinigamesProgress.completedGames[listKey] = [];
    if (!studentMinigamesProgress.completedGames[listKey].includes(key)) studentMinigamesProgress.completedGames[listKey].push(key);
    saveMinigamesProgress();
    const elapsed = Math.round((Date.now() - gameState.startTime) / 1000);
    if (typeof awardPointsAndXp === 'function') awardPointsAndXp(15, `Minijuego: ${title}`);
    alert(`🎉 ¡Completaste ${title}!\nTiempo: ${elapsed}s · Errores: ${gameState.errors}\nGanaste 15 puntos.`);
    renderMinigamesArcadeView();
}

function switchLevel(level) {
    if (!studentMinigamesProgress.unlockedLevels.includes(level)) return;
    studentMinigamesProgress.currentLevel = level;
    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

function petStorageKey() {
    const user = typeof APP_STATE !== 'undefined' ? APP_STATE.currentUser : null;
    if (!user || !user.id) return null;
    const mode = APP_STATE.teacherPreviewMode ? 'preview' : 'student';
    return `nee_pet_level1_v1_${mode}_${encodeURIComponent(String(user.id))}`;
}

function loadPet() {
    const key = petStorageKey();
    if (!key) return null;
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return null;
        const pet = JSON.parse(saved);
        if (!pet || pet.unlocked !== true || !['food', 'water', 'fun', 'updatedAt'].every(name => Number.isFinite(pet[name]))
            || typeof pet.sick !== 'boolean'
            || ['hygiene', 'energy'].some(name => name in pet && !Number.isFinite(pet[name]))
            || ('sleeping' in pet && typeof pet.sleeping !== 'boolean')) throw new Error('Datos de mascota inválidos');
        return pet;
    } catch (error) {
        console.error('No se pudo cargar la mascota:', error);
        alert('No se pudo cargar el premio de la mascota en este dispositivo.');
        return undefined;
    }
}

function savePet(pet) {
    const key = petStorageKey();
    if (!key) {
        alert('Inicia sesión para guardar el premio de la mascota.');
        return false;
    }
    try {
        localStorage.setItem(key, JSON.stringify(pet));
        return true;
    } catch (error) {
        console.error('No se pudo guardar la mascota:', error);
        alert('No se pudo guardar la mascota en este dispositivo.');
        return false;
    }
}

function unlockPet() {
    const existing = loadPet();
    if (existing === undefined) return false;
    return existing ? true : savePet({
        unlocked: true, food: 100, water: 100, fun: 100, hygiene: 100, energy: 100,
        sick: false, sleeping: false, updatedAt: Date.now()
    });
}

function updatePetNeeds(pet) {
    const now = Date.now();
    const hours = Math.max(0, now - pet.updatedAt) / 3600000;
    for (const name of ['food', 'water', 'fun']) pet[name] = Math.max(0, Math.min(100, pet[name] - hours * 5));
    if (pet.hygiene === undefined) pet.hygiene = 100;
    else pet.hygiene = Math.max(0, Math.min(100, pet.hygiene - hours * 3));
    if (pet.energy === undefined) pet.energy = 100;
    else pet.energy = Math.max(0, Math.min(100, pet.energy + hours * (pet.sleeping ? 20 : -4)));
    if (pet.sleeping === undefined) pet.sleeping = false;
    pet.updatedAt = Math.max(now, pet.updatedAt);
    if (pet.food <= 25 || pet.water <= 25) pet.sick = true;
}

function openPetGame() {
    const pet = loadPet();
    if (!pet) {
        if (pet === null) alert('Para abrir este premio, completa el desafío final del nivel 1 con tu cuenta en este dispositivo.');
        return;
    }
    updatePetNeeds(pet);
    if (!savePet(pet)) return;
    renderPetGame(pet);
    if (petRefreshTimer === null) {
        petRefreshTimer = window.setInterval(() => {
            const current = loadPet();
            if (!current) {
                closeGameOverlay();
                return;
            }
            updatePetNeeds(current);
            if (!savePet(current)) {
                closeGameOverlay();
                return;
            }
            renderPetGame(current);
        }, 60000);
    }
    if (typeof speakText === 'function') speakText('Este es tu premio. Cuida a tu mascota: dale comida y agua, límpiala, déjala descansar y juega con ella.');
}

function renderPetGame(pet, message = '', reaction = '') {
    const spriteState = pet.sleeping ? 'sleeping' : reaction || (pet.sick || pet.fun < 25 || pet.energy < 25 ? 'sad' : '');
    const status = pet.sleeping ? '💤 Está descansando. Puedes despertarla cuando quieras.'
        : pet.sick ? '🤒 Está enferma. Dale comida y agua, y luego cuídala.'
        : pet.energy < 25 ? '😴 Tiene sueño y necesita descansar.'
        : pet.hygiene < 25 ? '🧼 Necesita una limpieza.'
        : pet.fun < 25 ? '😢 Quiere jugar contigo.' : '😊 ¡Está contenta de verte!';
    const meter = (label, value) => `<div><div class="flex justify-between font-bold"><span>${label}</span><span>${Math.round(value)}%</span></div><div class="h-3 bg-slate-700 rounded-full overflow-hidden"><div class="h-full bg-pink-400" style="width:${Math.max(0, Math.min(100, value))}%"></div></div></div>`;
    const disabled = pet.sleeping ? 'disabled' : '';
    renderGameOverlay(`<section class="max-w-xl w-full bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border-2 border-pink-400 space-y-4 text-center my-auto">
      <h2 class="text-2xl font-black">🎁 Mi mascota</h2><p class="text-sm text-slate-300">Premio del desafío final del nivel 1. Sus necesidades bajan con el tiempo, incluso al cerrar el juego.</p>
      <div role="img" aria-label="${pet.sleeping ? 'Tu mascota descansando' : 'Tu mascota'}" class="pet-sprite ${spriteState ? `pet-sprite--${spriteState}` : ''} mx-auto"></div>
      <p class="font-bold" role="status">${message || status}</p>
      <div class="space-y-2 text-left">${meter('🍎 Comida', pet.food)}${meter('💧 Agua', pet.water)}${meter('🎈 Diversión', pet.fun)}${meter('🧼 Limpieza', pet.hygiene)}${meter('⚡ Energía', pet.energy)}</div>
      <div class="grid grid-cols-2 gap-3">
        <button ${disabled} onclick="careForPet('food')" class="bg-orange-600 rounded-xl p-3 font-black disabled:opacity-50">🍎 Alimentar</button>
        <button ${disabled} onclick="careForPet('water')" class="bg-sky-600 rounded-xl p-3 font-black disabled:opacity-50">💧 Dar agua</button>
        <button ${disabled} onclick="careForPet('clean')" class="bg-cyan-700 rounded-xl p-3 font-black disabled:opacity-50">🧼 Limpiar</button>
        <button onclick="careForPet('sleep')" class="bg-indigo-600 rounded-xl p-3 font-black">${pet.sleeping ? '☀️ Despertar' : '💤 Descansar'}</button>
        <button ${disabled} onclick="careForPet('fun')" class="bg-purple-600 rounded-xl p-3 font-black disabled:opacity-50">🎈 Jugar</button>
        <button ${disabled} onclick="careForPet('heal')" class="bg-emerald-700 rounded-xl p-3 font-black disabled:opacity-50">🩹 Cuidar</button>
      </div>
      <button onclick="closeGameOverlay()" class="underline text-slate-300 p-2">Volver a los desafíos</button>
    </section>`);
}

function careForPet(action) {
    const pet = loadPet();
    if (!pet) return;
    updatePetNeeds(pet);
    let message;
    let reaction = '';
    if (action === 'sleep') {
        pet.sleeping = !pet.sleeping;
        message = pet.sleeping ? '💤 Que descanses. Su energía se recupera con el tiempo.' : '☀️ ¡Buenos días!';
    } else if (pet.sleeping) {
        message = 'Primero despierta a tu mascota.';
    } else if (action === 'clean') {
        pet.hygiene = Math.min(100, pet.hygiene + 30);
        message = '¡Qué limpia está tu mascota!';
        reaction = 'happy';
    } else if (['food', 'water', 'fun'].includes(action)) {
        pet[action] = Math.min(100, pet[action] + 30);
        message = { food: '¡Qué rica comida!', water: '¡Gracias por el agua!', fun: '¡Qué divertido jugar contigo!' }[action];
        reaction = { food: 'eat', water: 'happy', fun: 'play' }[action];
    } else if (action === 'heal') {
        if (!pet.sick) message = 'Tu mascota está sana. ¡Sigue cuidándola!';
        else if (pet.food < 40 || pet.water < 40) message = 'Primero dale comida y agua para ayudarla a recuperarse.';
        else {
            pet.sick = false;
            message = '¡Tu mascota se ha recuperado!';
        }
    } else return;
    if (!savePet(pet)) return;
    renderPetGame(pet, message, reaction);
    if (typeof speakText === 'function') speakText(message);
}

function startBossExam(level) {
    if (!loadMinigamesProgress()) return;
    if (level !== studentMinigamesProgress.currentLevel || !studentMinigamesProgress.unlockedLevels.includes(level)) return;
    const completed = studentMinigamesProgress.completedGames[`level${level}`] || [];
    if (completed.length < 5) return alert('Completa los cinco minijuegos antes del desafío final.');
    const products = getDatabaseProducts();
    const currencies = getDatabaseCurrencies();
    const categories = getDatabaseCategories();
    if (products.length < 2 || new Set(products.map(product => product.name.toLocaleLowerCase('es'))).size < 2
        || categories.length < 2 || currencies.length < 2) {
        return alert('Para comenzar el desafío se necesitan al menos dos productos con nombres distintos, dos categorías y dos billetes o monedas.');
    }

    bossState = { level, stage: 0, startTime: Date.now(), results: [], current: null, products, currencies, categories };
    startBossStage();
}

function startBossStage() {
    const skill = BOSS_SKILLS[bossState.stage];
    const pool = skill.key === 'mj2' ? getDatabaseCurrencies() : getDatabaseProducts();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    gameState = { key: skill.key, startTime: Date.now(), errors: 0, currentQuestion: 0, questions: shuffled.slice(0, 2) };
    bossState.current = { key: skill.key, label: skill.label, errors: 0, repeatedHelp: 0, startTime: Date.now() };
    ({ mj1: renderQuestion1, mj2: renderQuestion2, mj3: renderQuestion3, mj4: renderQuestion4, mj5: renderQuestion5 })[skill.key]();
}

function answerBossStage(correct) {
    const current = bossState.current;
    if (!correct) {
        current.errors++;
        const feedback = document.getElementById('bossFeedback');
        if (feedback) feedback.textContent = 'Todavía no. ¡Inténtalo de nuevo!';
        if (typeof speakText === 'function') speakText('Todavía no. ¡Inténtalo de nuevo!');
        return;
    }

    bossState.results.push({
        key: current.key,
        label: current.label,
        errors: current.errors,
        firstAttemptCorrect: current.errors === 0,
        repeatedHelp: current.repeatedHelp,
        timeSeconds: Math.round((Date.now() - current.startTime) / 1000)
    });
    bossState.stage++;
    if (bossState.stage < BOSS_SKILLS.length) {
        startBossStage();
    } else {
        finishBossExam();
    }
}

function finishBossExam() {
    const result = bossState;
    bossState = null;
    closeGameOverlay();
    const next = result.level + 1;
    if (next <= 5 && !studentMinigamesProgress.unlockedLevels.includes(next)) studentMinigamesProgress.unlockedLevels.push(next);
    if (next <= 5) studentMinigamesProgress.currentLevel = next;
    saveMinigamesProgress();
    const firstAttemptCorrect = result.results.filter(stage => stage.firstAttemptCorrect).length;
    const errors = result.results.reduce((total, stage) => total + stage.errors, 0);
    const repeatedHelp = result.results.reduce((total, stage) => total + stage.repeatedHelp, 0);
    const student = typeof APP_STATE !== 'undefined' ? APP_STATE.currentUser : null;
    if (student && student.role === 'student' && !APP_STATE.teacherPreviewMode) {
        const evaluation = {
            type: 'boss',
            studentId: String(student.id || ''),
            studentName: String(student.name || 'Estudiante'),
            level: result.level,
            date: new Date().toISOString(),
            timeSeconds: Math.round((Date.now() - result.startTime) / 1000),
            errors,
            repeatedHelp,
            firstAttemptCorrect,
            stages: result.results
        };
        if (typeof db !== 'undefined' && db) {
            db.collection('evaluations').add(evaluation).catch(error => {
                console.error('No se pudo guardar la evaluación del desafío final:', error);
                alert('No se pudo guardar la evaluación para el educador. Revisa la conexión y vuelve a completar el desafío.');
            });
        } else {
            console.warn('No se pudo guardar la evaluación del desafío final: base de datos no disponible.');
            alert('La evaluación no se guardó para el educador porque la base de datos no está disponible.');
        }
    }
    alert(`🏆 ¡Venciste al jefe!\nAciertos al primer intento: ${firstAttemptCorrect} de 5.\nErrores: ${errors}.\n${result.level < 5 ? `¡Nivel ${next} desbloqueado!` : '¡Completaste todos los niveles!'}`);
    renderMinigamesArcadeView();
    if (result.level === 1 && unlockPet()) openPetGame();
}

window.renderMinigamesArcadeView = renderMinigamesArcadeView;
window.openMinigamesArcade = openMinigamesArcade;
window.startMinigame1 = startMinigame1;
window.startMinigame2 = startMinigame2;
window.startMinigame3 = startMinigame3;
window.startMinigame4 = startMinigame4;
window.startMinigame5 = startMinigame5;
window.closeGameOverlay = closeGameOverlay;
window.openMemoriseModal = renderMinigamesArcadeView;
window.openMinigamesModal = openMinigamesArcade;
window.openMemorisModal = renderMinigamesArcadeView;
window.openArcadeModal = openMinigamesArcade;

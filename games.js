/* ========================================================================
   MINIJUEGOS NEE
   Compatible con APP_STATE de app.js y con el catálogo de Firestore.
   Inclusivo: incluye lectura por voz de instrucciones para apoyo auditivo.
   ======================================================================== */

const ARCADE_LEVELS = [
    'Comprador Principiante',
    'Explorador de Góndolas',
    'As del Vuelto y Cajas',
    'Planificador Experto',
    'Maestro del Supermercado'
];

let studentMinigamesProgress = {
    currentLevel: 1,
    completedGames: {},
    unlockedLevels: [1]
};

let gameState = {
    startTime: null,
    errors: 0,
    currentQuestion: 0,
    questions: [],
    key: ''
};

function loadMinigamesProgress() {
    try {
        const saved = localStorage.getItem('nee_arcade_progress_v36');
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
            studentMinigamesProgress = {
                currentLevel: Number(parsed.currentLevel) || 1,
                completedGames: parsed.completedGames || {},
                unlockedLevels: Array.isArray(parsed.unlockedLevels) ? parsed.unlockedLevels : [1]
            };
        }
    } catch (error) {
        console.warn('No se pudo cargar el progreso de minijuegos:', error);
    }
}

function saveMinigamesProgress() {
    try {
        localStorage.setItem('nee_arcade_progress_v36', JSON.stringify(studentMinigamesProgress));
    } catch (error) {
        console.warn('No se pudo guardar el progreso de minijuegos:', error);
    }
}

function speakGameInstruction(text) {
    if (!text || !String(text).trim()) return;
    if (!('speechSynthesis' in window)) return;

    try {
        window.speechSynthesis.cancel();
        const clean = String(text)
            .replace(/\$/g, ' pesos ')
            .replace(/\bCLP\b/gi, ' pesos chilenos')
            .replace(/\s+/g, ' ')
            .trim();

        if (!clean) return;

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'es-CL';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.warn('No se pudo reproducir la instrucción por voz:', error);
    }
}

function exitArcadeToDashboard() {
    closeGameOverlay();
    closeMinigamesModal();
    if (typeof renderApp === 'function') renderApp();
    else window.location.reload();
}

const CATEGORY_ICONS = {
    'lácteos': '🥛',
    'frutas': '🍎',
    'verduras': '🥕',
    'panadería': '🍞',
    'aseo': '🧼',
    'limpieza': '🧼',
    'bebidas': '🧃',
    'carnes': '🥩',
    'fiambre': '🧀',
    'despensa': '🌾',
    'congelados': '🧊',
    'mascotas': '🐶'
};

function getCategoryIcon(category) {
    const value = String(category || '').toLocaleLowerCase('es');
    const match = Object.keys(CATEGORY_ICONS).find(key => value.includes(key));
    return match ? CATEGORY_ICONS[match] : '🏷️';
}

function getDatabaseProducts() {
    let source = [];

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

function renderProductVisual(product, size = 'text-7xl') {
    const emoji = product && product.iconEmoji ? product.iconEmoji : '🛍️';
    if (!product || !product.photoUrl) return `<span class="${size} font-black">${emoji}</span>`;

    const src = String(product.photoUrl)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
    const alt = String(product.name || 'Producto')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');

    return `<img src="${src}" alt="${alt}" class="max-h-full max-w-full object-contain mx-auto" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="${size} font-black" hidden>${emoji}</span>`;
}

function getDatabaseMoney(targetPrice) {
    let currencies = [];
    if (typeof CLP_CURRENCY_ITEMS !== 'undefined' && Array.isArray(CLP_CURRENCY_ITEMS)) {
        currencies = CLP_CURRENCY_ITEMS;
    } else if (Array.isArray(window.CLP_CURRENCY_ITEMS)) {
        currencies = window.CLP_CURRENCY_ITEMS;
    }

    if (currencies.length) {
        const exact = currencies.find(item => Number(item.value) === Number(targetPrice));
        const choices = currencies
            .filter(item => Number(item.value) !== Number(targetPrice))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        return [
            ...(exact ? [exact] : [{ value: targetPrice, label: `$${Number(targetPrice).toLocaleString('es-CL')} CLP`, icon: '💵' }]),
            ...choices
        ]
            .map(item => ({
                value: Number(item.value),
                label: item.label || `$${Number(item.value).toLocaleString('es-CL')} CLP`,
                img: item.img,
                icon: item.type === 'coin' ? '🪙' : '💵'
            }))
            .sort(() => Math.random() - 0.5);
    }

    const price = Number(targetPrice) || 1000;
    return [price, price + 500, Math.max(100, price - 300), price + 1000]
        .map((value, index) => ({
            value,
            label: `$${value.toLocaleString('es-CL')} CLP`,
            icon: index === 2 ? '🪙' : '💵'
        }))
        .sort(() => Math.random() - 0.5);
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
    const overlay = document.getElementById('nee-game-modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
    }
}

function renderGameCard(number, title, description, functionName, key, completed) {
    const done = completed.includes(key);
    const unlocked = number === 1 || completed.includes(`mj${number - 1}`);

    return `
        <article class="bg-slate-900 p-5 rounded-3xl border ${done ? 'border-emerald-500' : 'border-slate-700'} flex flex-col justify-between gap-4">
            <div>
                <span class="text-xs font-black text-indigo-300">${done ? '✓ COMPLETADO' : `DESAFÍO ${number}`}</span>
                <h3 class="font-black text-lg mt-2">${title}</h3>
                <p class="text-slate-400 text-sm mt-1">${description}</p>
            </div>
            <button ${unlocked ? `onclick="${functionName}()"` : 'disabled'}
                class="w-full ${unlocked ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 text-slate-500'} text-white py-3 rounded-xl font-black">
                ${unlocked ? (done ? 'Rejugar' : '▶ Iniciar') : '🔒 Bloqueado'}
            </button>
        </article>
    `;
}

function renderMinigamesArcadeViewContent() {
    loadMinigamesProgress();
    const level = Math.min(5, Math.max(1, Number(studentMinigamesProgress.currentLevel) || 1));
    studentMinigamesProgress.currentLevel = level;
    const completed = studentMinigamesProgress.completedGames[`level${level}`] || [];

    return `
      <section class="min-h-[70vh] bg-slate-950 text-slate-100 p-4 sm:p-7 rounded-3xl">
        <header class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-indigo-500/50">
          <div class="flex items-center gap-3">
            <button onclick="closeMinigamesModal()" class="bg-indigo-600 text-white px-4 py-3 rounded-xl font-black">⬅ Volver</button>
            <div>
              <span class="text-indigo-300 text-xs font-black">ARCADE DE APRENDIZAJE</span>
              <h1 class="text-xl font-black">CENTRO DE DESAFÍOS</h1>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            ${ARCADE_LEVELS.map((name, i) => {
                const n = i + 1;
                const unlocked = studentMinigamesProgress.unlockedLevels.includes(n);
                return `<button ${unlocked ? `onclick="switchLevel(${n})"` : 'disabled'} class="px-3 py-2 rounded-xl font-bold ${n === level ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">Nivel ${n}${unlocked ? '' : ' 🔒'}</button>`;
            }).join('')}
          </div>
        </header>

        <div class="max-w-7xl mx-auto mt-5 bg-slate-900 p-5 rounded-3xl border border-indigo-500/40 flex justify-between items-center gap-3">
          <div>
            <p class="text-amber-400 font-black">Nivel ${level} de 5</p>
            <h2 class="text-2xl font-black">${ARCADE_LEVELS[level - 1]}</h2>
          </div>
          <p class="font-black text-amber-300">${completed.length} / 5</p>
        </div>

        <main class="max-w-7xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${renderGameCard(1, '🍎 El Estante Correcto', 'Clasifica productos por categoría.', 'startMinigame1', 'mj1', completed)}
          ${renderGameCard(2, '💵 Corta el Billete', 'Reconoce el valor del producto.', 'startMinigame2', 'mj2', completed)}
          ${renderGameCard(3, '🔤 Palabras en Góndola', 'Lee el nombre del producto.', 'startMinigame3', 'mj3', completed)}
          ${renderGameCard(4, '🧮 Calculadora del Canasto', 'Suma los precios de dos productos.', 'startMinigame4', 'mj4', completed)}
          ${renderGameCard(5, '📋 La Lista de Compras', 'Encuentra el producto usando su imagen.', 'startMinigame5', 'mj5', completed)}
          <div class="bg-slate-900 p-5 rounded-3xl border border-amber-500">
            <h3 class="font-black text-amber-300">👑 Desafío final</h3>
            <p class="my-3 text-sm">Completa los cinco minijuegos para desbloquear el siguiente nivel.</p>
            <button ${completed.length >= 5 ? `onclick="startBossExam(${level})"` : 'disabled'} class="w-full bg-amber-500 text-slate-950 p-3 rounded-xl font-black">
              ${completed.length >= 5 ? 'Enfrentar desafío' : '🔒 Completa los 5 minijuegos'}
            </button>
          </div>
        </main>
      </section>
    `;
}

function renderMinigamesArcadeView() {
    const modal = document.getElementById('minigamesArcadeModal');
    const body = document.getElementById('arcadeModalBody');

    if (modal && body) {
        body.innerHTML = renderMinigamesArcadeViewContent();
        modal.classList.remove('hidden');
        return;
    }

    const container = document.getElementById('appContainer') || document.querySelector('main') || document.body;
    if (!container) return;

    loadMinigamesProgress();
    const level = Math.min(5, Math.max(1, Number(studentMinigamesProgress.currentLevel) || 1));
    studentMinigamesProgress.currentLevel = level;
    const completed = studentMinigamesProgress.completedGames[`level${level}`] || [];

    container.innerHTML = `
      <section class="min-h-[70vh] bg-slate-950 text-slate-100 p-4 sm:p-7 rounded-3xl">
        <header class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-indigo-500/50">
          <div class="flex items-center gap-3">
            <button onclick="exitArcadeToDashboard()" class="bg-indigo-600 text-white px-4 py-3 rounded-xl font-black">⬅ Volver</button>
            <div>
              <span class="text-indigo-300 text-xs font-black">ARCADE DE APRENDIZAJE</span>
              <h1 class="text-xl font-black">CENTRO DE DESAFÍOS</h1>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            ${ARCADE_LEVELS.map((name, i) => {
                const n = i + 1;
                const unlocked = studentMinigamesProgress.unlockedLevels.includes(n);
                return `<button ${unlocked ? `onclick="switchLevel(${n})"` : 'disabled'} class="px-3 py-2 rounded-xl font-bold ${n === level ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">Nivel ${n}${unlocked ? '' : ' 🔒'}</button>`;
            }).join('')}
          </div>
        </header>
        <div class="max-w-7xl mx-auto mt-5 bg-slate-900 p-5 rounded-3xl border border-indigo-500/40 flex justify-between items-center gap-3">
          <div>
            <p class="text-amber-400 font-black">Nivel ${level} de 5</p>
            <h2 class="text-2xl font-black">${ARCADE_LEVELS[level - 1]}</h2>
          </div>
          <p class="font-black text-amber-300">${completed.length} / 5</p>
        </div>
        <main class="max-w-7xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${renderGameCard(1, '🍎 El Estante Correcto', 'Clasifica productos por categoría.', 'startMinigame1', 'mj1', completed)}
          ${renderGameCard(2, '💵 Corta el Billete', 'Reconoce el valor del producto.', 'startMinigame2', 'mj2', completed)}
          ${renderGameCard(3, '🔤 Palabras en Góndola', 'Lee el nombre del producto.', 'startMinigame3', 'mj3', completed)}
          ${renderGameCard(4, '🧮 Calculadora del Canasto', 'Suma los precios de dos productos.', 'startMinigame4', 'mj4', completed)}
          ${renderGameCard(5, '📋 La Lista de Compras', 'Encuentra el producto usando su imagen.', 'startMinigame5', 'mj5', completed)}
          <div class="bg-slate-900 p-5 rounded-3xl border border-amber-500">
            <h3 class="font-black text-amber-300">👑 Desafío final</h3>
            <p class="my-3 text-sm">Completa los cinco minijuegos para desbloquear el siguiente nivel.</p>
            <button ${completed.length >= 5 ? `onclick="startBossExam(${level})"` : 'disabled'} class="w-full bg-amber-500 text-slate-950 p-3 rounded-xl font-black">
              ${completed.length >= 5 ? 'Enfrentar desafío' : '🔒 Completa los 5 minijuegos'}
            </button>
          </div>
        </main>
      </section>
    `;
}

function openMinigamesModal() {
    const modal = document.getElementById('minigamesArcadeModal');
    const body = document.getElementById('arcadeModalBody');
    if (!modal || !body) return;
    body.innerHTML = renderMinigamesArcadeViewContent();
    modal.classList.remove('hidden');
}

function closeMinigamesModal() {
    const modal = document.getElementById('minigamesArcadeModal');
    if (modal) modal.classList.add('hidden');
}

function beginGame(key, maxQuestions) {
    const products = getDatabaseProducts();
    if (!products.length) {
        alert('No hay productos disponibles para los minijuegos. Espera a que cargue el catálogo e inténtalo nuevamente.');
        return false;
    }

    const shuffled = [...products].sort(() => Math.random() - 0.5);
    gameState = {
        key,
        startTime: Date.now(),
        errors: 0,
        currentQuestion: 0,
        questions: shuffled.slice(0, Math.min(maxQuestions, shuffled.length))
    };

    return true;
}

function startMinigame1() { if (beginGame('mj1', 5)) renderQuestion1(); }
function startMinigame2() { if (beginGame('mj2', 5)) renderQuestion2(); }
function startMinigame3() { if (beginGame('mj3', 5)) renderQuestion3(); }
function startMinigame4() { if (beginGame('mj4', 4)) renderQuestion4(); }
function startMinigame5() { if (beginGame('mj5', 5)) renderQuestion5(); }

function questionFrame(color, label, content, choices, instructionText = '', exitLabel = 'Salir') {
    return `
      <div class="max-w-2xl w-full bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border-2 ${color} shadow-2xl space-y-5 text-center my-auto">
        <div class="flex justify-between items-center border-b border-slate-700 pb-3">
          <b class="text-xs">${label}</b>
          <b class="text-amber-300 text-xs">Pregunta ${gameState.currentQuestion + 1} de ${gameState.questions.length}</b>
        </div>
        ${content}
        ${choices}
        ${instructionText ? `<button onclick="speakGameInstruction(${JSON.stringify(instructionText)})" class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl font-black text-xs">🔊 Escuchar instrucciones</button>` : ''}
        <button onclick="closeGameOverlay()" class="text-slate-400 underline text-xs">✕ ${exitLabel}</button>
      </div>
    `;
}

function encodedArg(value) {
    return JSON.stringify(String(value)).replace(/</g, '\\u003c').replace(/&/g, '\\u0026').replace(/"/g, '&quot;');
}

function renderQuestion1() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj1', 'El Estante Correcto');

    const product = gameState.questions[gameState.currentQuestion];
    const allCategories = [
        product.category,
        ...getDatabaseProducts().map(p => p.category),
        'Frutas y Verduras',
        'Lácteos, Yogures y Huevos',
        'Panadería y Pastelería',
        'Limpieza del Hogar'
    ].filter(Boolean);
    const categories = [...new Set(allCategories)].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!categories.includes(product.category)) categories[0] = product.category;

    const visual = `
      <div class="w-48 h-48 mx-auto bg-white rounded-3xl p-3 flex items-center justify-center">${renderProductVisual(product)}</div>
      <h2 class="font-black text-xl mt-3">${product.name}</h2>
    `;

    const instructionText = `Clasifica el producto ${product.name}. Elige la categoría correcta.`;
    const buttons = `
      <div class="grid sm:grid-cols-2 gap-3">
        ${categories.map(c => `<button onclick="answerCategory(${encodedArg(c)})" class="bg-indigo-600 p-4 rounded-xl font-black">${getCategoryIcon(c)} ${c}</button>`).join('')}
      </div>
    `;

    renderGameOverlay(questionFrame('border-indigo-500', 'OA04 · Clasifica el producto', visual, buttons, instructionText, 'Salir al arcade'));
    speakGameInstruction(instructionText);
}

function answerCategory(category) {
    const q = gameState.questions[gameState.currentQuestion];
    if (String(category).toLowerCase() === String(q.category).toLowerCase()) {
        gameState.currentQuestion++;
        renderQuestion1();
    } else {
        gameState.errors++;
        speakGameInstruction(`Respuesta incorrecta. ${q.name} no va en ${category}. Intenta otra vez.`);
        alert(`❌ ${q.name} no va en ${category}. Inténtalo otra vez.`);
    }
}

function renderQuestion2() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj2', 'Corta el Billete');

    const product = gameState.questions[gameState.currentQuestion];
    const visual = `
      <div class="w-44 h-44 mx-auto bg-white rounded-3xl p-3 flex items-center justify-center">${renderProductVisual(product)}</div>
      <h2 class="font-black text-xl mt-3">${product.name}</h2>
      <p class="text-amber-300 font-black text-2xl">Precio: $${product.price.toLocaleString('es-CL')}</p>
    `;
    const instructionText = `Selecciona el valor correcto del producto ${product.name}.`;
    const choices = `
      <div class="grid grid-cols-2 gap-3">
        ${getDatabaseMoney(product.price).map(m => `
            <button onclick="answerGeneric(${Number(m.value)},${Number(product.price)},'mj2')" class="bg-slate-800 border border-emerald-400 p-3 rounded-xl font-black">
              ${m.img ? `<img src="${m.img}" class="h-14 mx-auto object-contain">` : `<span class="text-2xl">${m.icon || '💵'}</span>`}
              <span class="block text-amber-300">${m.label}</span>
            </button>
        `).join('')}
      </div>
    `;

    renderGameOverlay(questionFrame('border-emerald-500', 'OA07 · Selecciona el valor correcto', visual, choices, instructionText));
    speakGameInstruction(instructionText);
}

function renderQuestion3() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj3', 'Palabras en Góndola');

    const product = gameState.questions[gameState.currentQuestion];
    const names = [product.name, ...getDatabaseProducts().filter(item => item.id !== product.id).map(item => item.name)].slice(0, 4).sort(() => Math.random() - 0.5);
    const visual = `
      <div class="w-44 h-44 mx-auto bg-white rounded-3xl p-3 flex items-center justify-center">${renderProductVisual(product)}</div>
      <p class="text-slate-300 font-bold mt-3">¿Cómo se llama este producto?</p>
    `;
    const instructionText = `Escucha y elige el nombre del producto ${product.name}.`;
    const choices = `
      <div class="grid sm:grid-cols-2 gap-3">
        ${names.map(name => `<button onclick="answerGeneric(${encodedArg(name)},${encodedArg(product.name)},'mj3')" class="bg-amber-600 p-3 rounded-xl font-black">${name}</button>`).join('')}
      </div>
    `;

    renderGameOverlay(questionFrame('border-amber-500', 'OA02 · Lee el producto', visual, choices, instructionText));
    speakGameInstruction(instructionText);
}

function renderQuestion4() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj4', 'Calculadora del Canasto');

    const p1 = gameState.questions[gameState.currentQuestion];
    const p2 = gameState.questions[(gameState.currentQuestion + 1) % gameState.questions.length];
    const total = p1.price + p2.price;
    const values = [...new Set([total, total + 500, Math.max(100, total - 300), total + 1000])].sort(() => Math.random() - 0.5);
    const visual = `
      <div class="flex items-center justify-center gap-4">
        <div>${renderProductVisual(p1, 'text-5xl')}<p>$${p1.price.toLocaleString('es-CL')}</p></div>
        <b class="text-3xl">+</b>
        <div>${renderProductVisual(p2, 'text-5xl')}<p>$${p2.price.toLocaleString('es-CL')}</p></div>
      </div>
      <p class="font-black text-lg mt-3">¿Cuánto cuestan juntos?</p>
    `;
    const instructionText = `Suma los precios de los dos productos. Elige el total correcto.`;
    const choices = `
      <div class="grid grid-cols-2 gap-3">
        ${values.map(value => `<button onclick="answerGeneric(${value},${total},'mj4')" class="bg-purple-600 p-4 rounded-xl font-black">$${value.toLocaleString('es-CL')}</button>`).join('')}
      </div>
    `;

    renderGameOverlay(questionFrame('border-purple-500', 'OA09 · Suma el canasto', visual, choices, instructionText));
    speakGameInstruction(instructionText);
}

function renderQuestion5() {
    if (gameState.currentQuestion >= gameState.questions.length) return finishMinigame('mj5', 'La Lista de Compras');

    const target = gameState.questions[gameState.currentQuestion];
    const options = [target, ...getDatabaseProducts().filter(p => p.id !== target.id)].slice(0, 4).sort(() => Math.random() - 0.5);
    const visual = `
      <p class="text-slate-300 font-bold">Encuentra este producto:</p>
      <h2 class="text-2xl text-amber-300 font-black">${target.name}</h2>
    `;
    const instructionText = `Busca el producto ${target.name} entre las opciones que aparecen.`;
    const choices = `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        ${options.map(item => `<button onclick="answerGeneric(${encodedArg(item.id)},${encodedArg(target.id)},'mj5')" class="bg-white h-28 rounded-xl p-2 flex items-center justify-center">${renderProductVisual(item, 'text-5xl')}</button>`).join('')}
      </div>
    `;

    renderGameOverlay(questionFrame('border-rose-500', 'OA12 · Encuentra el producto', visual, choices, instructionText));
    speakGameInstruction(instructionText);
}

function answerGeneric(selected, correct, key) {
    if (String(selected) === String(correct)) {
        gameState.currentQuestion++;
        const nextQuestionMap = {
            mj2: renderQuestion2,
            mj3: renderQuestion3,
            mj4: renderQuestion4,
            mj5: renderQuestion5
        };
        if (nextQuestionMap[key]) nextQuestionMap[key]();
    } else {
        gameState.errors++;
        speakGameInstruction('Respuesta incorrecta. Intenta otra vez.');
        alert('❌ Respuesta incorrecta. ¡Inténtalo de nuevo!');
    }
}

function finishMinigame(key, title) {
    closeGameOverlay();

    const level = studentMinigamesProgress.currentLevel || 1;
    const listKey = `level${level}`;
    if (!Array.isArray(studentMinigamesProgress.completedGames[listKey])) {
        studentMinigamesProgress.completedGames[listKey] = [];
    }
    if (!studentMinigamesProgress.completedGames[listKey].includes(key)) {
        studentMinigamesProgress.completedGames[listKey].push(key);
    }
    saveMinigamesProgress();

    const elapsed = Math.round((Date.now() - gameState.startTime) / 1000);
    if (typeof awardPointsAndXp === 'function') {
        awardPointsAndXp(15, `Minijuego: ${title}`);
    }

    const message = `¡Completaste ${title}!\nTiempo: ${elapsed} segundos.\nErrores: ${gameState.errors}.\nGanaste 15 puntos.`;
    speakGameInstruction(message);
    alert(message);
    renderMinigamesArcadeView();
}

function switchLevel(level) {
    if (!studentMinigamesProgress.unlockedLevels.includes(level)) return;
    studentMinigamesProgress.currentLevel = level;
    saveMinigamesProgress();
    renderMinigamesArcadeView();
}

function startBossExam(level) {
    const completed = studentMinigamesProgress.completedGames[`level${level}`] || [];
    if (completed.length < 5) {
        speakGameInstruction('Completa los cinco minijuegos antes del desafío final.');
        return alert('Completa los cinco minijuegos antes del desafío final.');
    }

    const next = level + 1;
    if (next <= 5 && !studentMinigamesProgress.unlockedLevels.includes(next)) {
        studentMinigamesProgress.unlockedLevels.push(next);
    }
    if (next <= 5) {
        studentMinigamesProgress.currentLevel = next;
    }
    saveMinigamesProgress();

    const unlockedMessage = level < 5 ? `¡Nivel ${next} desbloqueado!` : '¡Felicitaciones! Completaste todos los niveles.';
    speakGameInstruction(unlockedMessage);
    alert(unlockedMessage);
    renderMinigamesArcadeView();
}

window.renderMinigamesArcadeView = renderMinigamesArcadeView;
window.openMinigamesModal = openMinigamesModal;
window.closeMinigamesModal = closeMinigamesModal;
window.startMinigame1 = startMinigame1;
window.startMinigame2 = startMinigame2;
window.startMinigame3 = startMinigame3;
window.startMinigame4 = startMinigame4;
window.startMinigame5 = startMinigame5;
window.closeGameOverlay = closeGameOverlay;
window.speakGameInstruction = speakGameInstruction;
window.openMemoriseModal = renderMinigamesArcadeView;
window.openMinigamesModal = openMinigamesModal;
window.openMemorisModal = renderMinigamesArcadeView;
window.openArcadeModal = openMinigamesModal;

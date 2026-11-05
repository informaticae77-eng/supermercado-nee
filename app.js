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
                    <input type="text" id="loginUser" value="" placeholder="Ej: 12345678-9" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold">
               </div>
               <div>
                   <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Clave / PIN:</label>
                    <input type="password" id="loginPin" value="1234" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-center text-xl tracking-widest font-black">
                    <input type="password" id="loginPin" value="" placeholder="••••" class="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-center text-xl tracking-widest font-black">
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
@@ -1509,1824 +1504,3 @@
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
                const imgUrl = p.photoUrl || p.photo || p.image || '';
                const imgHtml = imgUrl 
                    ? `<img src="${imgUrl}" class="w-14 h-14 object-cover rounded-xl border">`
                    : `<span class="text-3xl">📦</span>`;
                return `
                    <div class="flex items-center justify-between p-3 bg-slate-50 border-2 rounded-2xl">
                        <div class="flex items-center gap-3">
                            ${imgHtml}
                            <div>
                                <span class="text-sm font-black text-slate-800 block">${p.name}</span>
                                <span class="text-xs font-black text-emerald-700">Precio Ref: $${(p.price || 0).toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                        <div>${getPricePictogramsHtml(p.price || 0)}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeViewMissionModal() {
    const modal = document.getElementById('viewMissionModal');
    if (modal) modal.classList.add('hidden');
}

function printCurrentMissionSheetFromViewer() {
    if (!APP_STATE.activeMission || !APP_STATE.activeMission.itemIds) return;
    const selectedProds = (APP_STATE.products || []).filter(p => APP_STATE.activeMission.itemIds.includes(String(p.id)));
    const title = APP_STATE.activeMission.title || 'Misión de Compra';
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const teamLabel = st.teamName || 'Equipo Multidisciplinario';

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Ficha de Misión Adaptativa</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white p-8 font-sans text-slate-800">
                <div class="max-w-2xl mx-auto border-4 border-indigo-600 p-6 rounded-3xl space-y-6">
                    <div class="flex justify-between items-center border-b-2 pb-4">
                        <div>
                            <h1 class="text-2xl font-black text-indigo-950">${st.schoolName}</h1>
                            <p class="text-xs font-bold text-indigo-600">Ficha de Apoyo Pedagógico (${teamLabel})</p>
                        </div>
                        <span class="text-4xl">📋</span>
                    </div>

                    <div class="bg-indigo-50 p-4 rounded-2xl border text-center space-y-1">
                        <h2 class="text-xl font-black text-indigo-900">${title}</h2>
                        <p class="text-xs font-bold text-slate-600">Instrucción: Busca y añade estos productos en la aplicación. Luego comprueba si tu lista está correcta.</p>
                    </div>

                    <div class="space-y-4">
                        ${selectedProds.map(p => {
                            const imgUrl = p.photoUrl || p.photo || p.image || '';
                            const imgHtml = imgUrl 
                                ? `<img src="${imgUrl}" class="w-16 h-16 object-cover rounded-xl border">`
                                : `<span class="text-4xl">📦</span>`;
                            return `
                                <div class="flex items-center justify-between p-4 bg-slate-50 border-2 rounded-2xl">
                                    <div class="flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-lg border-2 border-slate-400 bg-white"></div>
                                        ${imgHtml}
                                        <div>
                                            <span class="text-base font-black text-slate-800 block">${p.name}</span>
                                            <span class="text-xs font-black text-emerald-700">Precio estimado: $${(p.price || 0).toLocaleString('es-CL')}</span>
                                        </div>
                                    </div>
                                    <div>${getPricePictogramsHtml(p.price || 0)}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="pt-6 border-t text-center text-xs font-bold text-slate-400">
                        Programa de Autonomía Funcional • ${teamLabel}
                    </div>
                </div>
                <script>setTimeout(() => { window.print(); window.close(); }, 750);</script>
            </body>
        </html>
    `);
    win.document.close();
}

// ==========================================
// PANEL DOCENTE Y CARGA DE PERSONAJES
// ==========================================
function setTeacherTab(tabName) {
    APP_STATE.teacherActiveTab = tabName;
    if (tabName !== 'ai_config') stopAdminTestCameraStream();
    renderTeacherDashboard(document.getElementById('appContainer'));
}

function openMissionModal() {
    const listEl = document.getElementById('missionProductsSelectList');
    if (!listEl) return;

    listEl.innerHTML = (APP_STATE.products || []).map(p => `
        <label class="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50">
            <input type="checkbox" value="${p.id}" class="missionProdCheckbox w-4 h-4 text-indigo-600 rounded">
            <div>
                <span class="font-black text-slate-800 block text-xs">${p.name}</span>
                <span class="text-emerald-700 font-bold text-[11px]">$${(p.price || 0).toLocaleString('es-CL')}</span>
            </div>
        </label>
    `).join('');

    document.getElementById('missionModal').classList.remove('hidden');
}

function closeMissionModal() {
    document.getElementById('missionModal').classList.add('hidden');
}

function activateMissionForStudents() {
    const checked = Array.from(document.querySelectorAll('.missionProdCheckbox:checked')).map(cb => cb.value);
    if (checked.length === 0) return alert("Selecciona al menos un producto para la misión.");

    const title = document.getElementById('missionTitleInput').value.trim() || 'Misión de Compra';
    const missionObj = {
        id: 'mission-' + Date.now(),
        title: title,
        itemIds: checked,
        active: true
    };

    APP_STATE.activeMission = missionObj;
    APP_STATE.classroomErrorsCount = 0;
    APP_STATE.listValidated = false;
    APP_STATE.invalidBasketItems = [];

    if (db) {
        db.collection('settings').doc('activeMission').set(missionObj);
    }

    closeMissionModal();
    alert(`✅ Misión "${title}" ACTIVADA por el docente.`);
    renderApp();
}

function cancelActiveMission() {
    if (confirm("¿Deseas DESACTIVAR la misión activa en sala para todos los alumnos?")) {
        APP_STATE.activeMission = null;
        APP_STATE.classroomMode = 'PREP';
        APP_STATE.listValidated = false;
        APP_STATE.classroomErrorsCount = 0;
        APP_STATE.invalidBasketItems = [];
        if (db) {
            db.collection('settings').doc('activeMission').delete();
        }
        alert("⏹️ Misión desactivada por el educador.");
        renderApp();
    }
}

function renderTeacherDashboard(container) {
    const activeTab = APP_STATE.teacherActiveTab || 'home';
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

    let activeMissionAlertBanner = '';
    if (APP_STATE.activeMission && APP_STATE.activeMission.active && APP_STATE.activeMission.itemIds) {
        activeMissionAlertBanner = `
            <div class="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg border-4 border-emerald-800 flex justify-between items-center flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🔴</span>
                    <div>
                        <h4 class="font-black text-sm uppercase">MISIÓN EN CURSO ACTIVADA POR EL EDUCADOR: "${APP_STATE.activeMission.title}"</h4>
                        <p class="text-[11px] font-bold text-emerald-100">${APP_STATE.activeMission.itemIds.length} productos asignados a las tablets de los alumnos.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="openViewMissionModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow border border-indigo-300 active:scale-95 flex items-center gap-1.5">
                        <span>👁️</span> <span>Ver Lista de Misión</span>
                    </button>
                    <button onclick="cancelActiveMission()" class="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow border border-rose-300 active:scale-95 flex items-center gap-1.5">
                        <span>⏹️</span> <span>Desactivar Misión</span>
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="space-y-6">
            ${activeMissionAlertBanner}

            <div class="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4 border-b-4 border-indigo-600">
                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                            <span>🏫</span>
                            <span>${isAdmin ? `Panel General & ${teamLabel}` : `Panel Docente (${teamLabel})`}</span>
                        </h2>
                        <p class="text-xs text-indigo-300 font-bold mt-0.5">Gestión pedagógica, catálogo de tiendas, niveles e informes con IA.</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="openMissionModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow border-b-2 border-indigo-900 flex items-center gap-2 active:scale-95">
                            <span>📋</span><span>Crear / Activar Misión</span>
                        </button>
                        <button onclick="toggleStudentPreview(true)" class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs px-4 py-2 rounded-xl shadow border-b-2 border-amber-600 flex items-center gap-2 active:scale-95">
                            <span>🕹️</span><span>Probar Juego</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
                    <button onclick="setTeacherTab('home')" class="py-3 px-2 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>📊</span><span>1. Evaluaciones IA</span>
                    </button>
                    <button onclick="setTeacherTab('catalog')" class="py-3 px-2 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>🏪</span><span>2. Catálogo Tiendas</span>
                    </button>
                    <button onclick="setTeacherTab('ai_config')" class="py-3 px-2 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'ai_config' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border-2 border-purple-400 scale-105' : 'bg-slate-800 text-purple-300 hover:bg-slate-700'}">
                        <span>🤖</span><span>3. Config. IA & Cámara</span>
                    </button>
                    <button onclick="setTeacherTab('currency')" class="py-3 px-2 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'currency' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>💵</span><span>4. Monedas & Fotos</span>
                    </button>
                    <button onclick="setTeacherTab('users')" class="py-3 px-2 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>🔑</span><span>5. Gestión Usuarios</span>
                    </button>
                    <button onclick="setTeacherTab('settings')" class="py-3 px-2 rounded-2xl font-black text-[11px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 scale-105' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                        <span>⚙️</span><span>6. Personajes & Premios</span>
                    </button>
                </div>
            </div>

            <div id="teacherTabContent">
                ${activeTab === 'home' ? renderTeacherHomeTab() : ''}
                ${activeTab === 'catalog' ? renderTeacherCatalogTab() : ''}
                ${activeTab === 'ai_config' ? renderTeacherAiConfigTab() : ''}
                ${activeTab === 'currency' ? renderTeacherCurrencyTab() : ''}
                ${activeTab === 'users' ? renderTeacherUsersTab() : ''}
                ${activeTab === 'settings' ? renderTeacherSettingsTab() : ''}
            </div>
        </div>
    `;
}

function renderTeacherSettingsTab() {
    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const currentTeamName = st.teamName || 'Equipo Multidisciplinario';

    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-200 shadow-md space-y-6 max-w-4xl mx-auto">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>⚙️</span> <span>Configuración de Personajes, Temáticas y Premios</span>
                </h3>
            </div>

            <div class="p-5 bg-purple-50 border-4 border-purple-300 rounded-3xl space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">🎭</span>
                    <div>
                        <h4 class="font-black text-purple-950 text-sm uppercase">Carga de Personajes Institucionales (Mascota y Corpóreo)</h4>
                        <p class="text-xs text-slate-600 font-bold">Estos personajes hablarán con los estudiantes dentro de las actividades y minijuegos:</p>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-2xl border-2 border-purple-200 text-xs text-slate-700 space-y-2">
                    <div class="font-black text-purple-900 flex items-center gap-1">
                        <span>💡</span> <span>Instrucciones recomendadas para la imagen de los personajes:</span>
                    </div>
                    <ul class="list-disc list-inside space-y-1 font-semibold text-[11px] text-slate-600">
                        <li>Subir la imagen en formato <b>PNG con fondo transparente</b>.</li>
                        <li>Resolución recomendada: <b>400x400 píxeles</b> o superior.</li>
                    </ul>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-4 bg-white border-2 border-purple-200 rounded-2xl space-y-3">
                        <label class="block text-xs font-black text-purple-950 uppercase">1. Mascota del Establecimiento:</label>
                        <input type="file" accept="image/*" onchange="handleMascotPhotoUpload(event)" class="w-full text-xs font-bold text-slate-600 border p-2 rounded-xl">
                        <input type="hidden" id="settingMascotUrl" value="${st.mascotUrl || ''}">
                        <div class="flex items-center gap-3 pt-2">
                            ${getAvatarHtml('mascot')}
                            <span class="text-[11px] font-bold text-slate-500">${st.mascotUrl ? '✓ Foto personalizada activa' : '🤖 Usando Mascota Default'}</span>
                        </div>
                    </div>

                    <div class="p-4 bg-white border-2 border-purple-200 rounded-2xl space-y-3">
                        <label class="block text-xs font-black text-purple-950 uppercase">2. Corpóreo Institucional:</label>
                        <input type="file" accept="image/*" onchange="handleCorporeoPhotoUpload(event)" class="w-full text-xs font-bold text-slate-600 border p-2 rounded-xl">
                        <input type="hidden" id="settingCorporeoUrl" value="${st.corporeoUrl || ''}">
                        <div class="flex items-center gap-3 pt-2">
                            ${getAvatarHtml('corporeo')}
                            <span class="text-[11px] font-bold text-slate-500">${st.corporeoUrl ? '✓ Foto personalizada activa' : '🐻 Usando Corpóreo Default'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-5 bg-indigo-50 border-4 border-indigo-300 rounded-3xl space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">🎨</span>
                    <div>
                        <h4 class="font-black text-indigo-950 text-sm uppercase">Selección de Temática Estacional / Festividades</h4>
                        <p class="text-xs text-slate-600 font-bold">Cambia el estilo visual y decoraciones animadas según la fecha del año:</p>
                    </div>
                </div>

                <select id="settingActiveTheme" class="w-full px-4 py-3 rounded-2xl border-2 border-indigo-300 font-black text-sm bg-white text-indigo-950">
                    ${Object.keys(SEASONAL_THEMES).map(key => `
                        <option value="${key}" ${(st.activeTheme || 'halloween') === key ? 'selected' : ''}>${SEASONAL_THEMES[key].name}</option>
                    `).join('')}
                </select>
            </div>

            <div class="p-5 bg-amber-50 border-4 border-amber-300 rounded-3xl space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">🎁</span>
                    <div>
                        <h4 class="font-black text-amber-950 text-sm uppercase">Configuración de Premios Físicos (Meta de Puntos)</h4>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tope de Puntos para el Premio:</label>
                        <input type="number" id="settingRewardThreshold" value="${st.rewardPointsThreshold || 250}" class="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 font-black text-sm text-center">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mensaje en Pantalla al Ganar:</label>
                        <input type="text" id="settingRewardMessage" value="${st.rewardMessage || '¡Muestra esta pantalla a tu profesor para recibir tu premio físico!'}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                </div>
            </div>

            <div class="p-5 bg-slate-50 border-4 border-slate-300 rounded-3xl space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">👥</span>
                    <div>
                        <h4 class="font-black text-slate-800 text-sm uppercase">Nombre del Equipo Profesional</h4>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <select onchange="selectPresetTeamName(this.value)" class="w-full px-3 py-2.5 rounded-xl border-2 border-indigo-300 font-black text-xs bg-white text-indigo-950">
                            <option value="">-- Seleccionar Opciones --</option>
                            ${TEAM_NAME_PRESETS.map(preset => `
                                <option value="${preset}" ${currentTeamName === preset ? 'selected' : ''}>${preset}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <input type="text" id="settingTeamName" value="${currentTeamName}" placeholder="Ej: Equipo Multidisciplinario" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Nombre Colegio / Escuela:</label>
                        <input type="text" id="settingSchoolName" value="${st.schoolName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Subtítulo / Unidad:</label>
                        <input type="text" id="settingSubHeader" value="${st.schoolSubHeader || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Firma / Encargado:</label>
                        <input type="text" id="settingDirectorName" value="${st.directorName || ''}" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Logo Institucional:</label>
                        <input type="file" accept="image/*" onchange="handleSchoolLogoUpload(event)" class="w-full text-xs font-bold text-slate-600 border p-2 rounded-xl">
                        <input type="hidden" id="settingSchoolLogo" value="${st.schoolLogo || ''}">
                    </div>
                </div>
            </div>

            <button onclick="saveInstitutionalSettings()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-sm uppercase shadow-xl border-b-4 border-emerald-950 active:scale-95">
                💾 Guardar Configuración de Personajes y Temática
            </button>
        </div>
    `;
}

function handleMascotPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 400, 400, 0.7).then(compressed => {
            document.getElementById('settingMascotUrl').value = compressed;
            alert("✓ Foto de Mascota preparada. Recuerda presionar 'Guardar Configuración'.");
        });
    };
    reader.readAsDataURL(file);
}

function handleCorporeoPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 400, 400, 0.7).then(compressed => {
            document.getElementById('settingCorporeoUrl').value = compressed;
            alert("✓ Foto de Corpóreo preparada. Recuerda presionar 'Guardar Configuración'.");
        });
    };
    reader.readAsDataURL(file);
}

function selectPresetTeamName(val) {
    if (val) {
        const input = document.getElementById('settingTeamName');
        if (input) input.value = val;
    }
}

function handleSchoolLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 250, 250, 0.6).then(compressed => {
            document.getElementById('settingSchoolLogo').value = compressed;
        });
    };
    reader.readAsDataURL(file);
}

function saveInstitutionalSettings() {
    const teamNameVal = document.getElementById('settingTeamName').value.trim() || 'Equipo Multidisciplinario';
    const rewardThresholdVal = parseInt(document.getElementById('settingRewardThreshold').value) || 250;
    const rewardMsgVal = document.getElementById('settingRewardMessage').value.trim();

    const settingsData = {
        schoolName: document.getElementById('settingSchoolName').value.trim(),
        schoolSubHeader: document.getElementById('settingSubHeader').value.trim(),
        teamName: teamNameVal,
        directorName: document.getElementById('settingDirectorName').value.trim(),
        activeTheme: document.getElementById('settingActiveTheme').value,
        schoolLogo: document.getElementById('settingSchoolLogo').value,
        mascotUrl: document.getElementById('settingMascotUrl').value,
        corporeoUrl: document.getElementById('settingCorporeoUrl').value,
        rewardPointsThreshold: rewardThresholdVal,
        rewardMessage: rewardMsgVal
    };

    APP_STATE.settings = { ...APP_STATE.settings, ...settingsData };

    if (db) {
        db.collection('settings').doc('institutional').set(settingsData, { merge: true }).then(() => {
            renderApp();
            alert(`✅ Configuración guardada exitosamente.`);
        }).catch(() => {
            renderApp();
            alert(`✅ Configuración guardada localmente.`);
        });
    } else {
        renderApp();
        alert(`✅ Configuración guardada localmente.`);
    }
}

// ==========================================
// MÓDULOS DE PROBADOR IA, CATÁLOGO Y USUARIOS
// ==========================================
function renderTeacherAiConfigTab() {
    const cfg = APP_STATE.aiConfig || DEFAULT_AI_CONFIG;
    const isSecure = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const prods = APP_STATE.products || [];

    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-indigo-300 shadow-md space-y-6 max-w-4xl mx-auto">
            <div class="border-b pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                        <span>🤖</span> <span>Módulo de Configuración y Probador de Escáner e IA</span>
                    </h3>
                    <p class="text-xs font-bold text-slate-500">Prueba en vivo si la IA discrimina el nombre del producto y su precio mediante lectura OCR.</p>
                </div>
                <div class="px-3 py-1.5 rounded-xl border-2 text-xs font-black ${isSecure ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}">
                    ${isSecure ? '🔒 Servidor Seguro (HTTPS Activo)' : '🔴 Servidor HTTP (Requiere HTTPS para Cámara)'}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 space-y-4">
                    <h4 class="font-black text-indigo-950 text-sm flex items-center gap-2">
                        <span>🔍🧪</span> <span>Probador de Lectura de Nombre y Precio</span>
                    </h4>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">1. Selecciona el Producto Objetivo a Buscar:</label>
                        <select id="adminTestProductSelect" class="w-full px-3 py-2.5 rounded-xl border-2 border-indigo-300 font-black text-xs bg-white text-indigo-950">
                            ${prods.length === 0 ? `<option value="">No hay productos registrados</option>` : prods.map(p => `
                                <option value="${p.id}">${p.name} ($${(p.price || 0).toLocaleString('es-CL')})</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="relative bg-black rounded-2xl h-48 overflow-hidden border-2 border-slate-700 flex items-center justify-center shadow-inner">
                        <video id="adminTestVideo" playsinline webkit-playsinline muted autoplay class="w-full h-full object-cover"></video>
                        <canvas id="adminTestCanvas" class="hidden"></canvas>
                        <span id="adminTestCameraPlaceholder" class="text-xs text-slate-400 font-bold px-4 text-center">Toca "Encender Cámara" para iniciar la simulación.</span>
                    </div>

                    <div id="adminTestCameraStatus" class="p-2.5 bg-white border rounded-xl text-xs font-bold text-slate-600 text-center">
                        Sensor inactivo.
                    </div>

                    <div class="space-y-2">
                        <div class="flex gap-2">
                            <button onclick="startAdminCameraTest()" class="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-xl text-xs shadow active:scale-95">
                                ▶️ Encender Cámara
                            </button>
                            <button onclick="stopAdminTestCameraStream()" class="w-1/2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black py-2.5 rounded-xl text-xs active:scale-95">
                                ⏹️ Apagar
                            </button>
                        </div>

                        <button onclick="testAdminAiRecognition()" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3 rounded-xl text-xs shadow-md active:scale-95 border-b-2 border-emerald-950 flex items-center justify-center gap-2">
                            <span>📸</span> <span>PROBAR LECTURA DE NOMBRE Y PRECIO</span>
                        </button>
                    </div>
                </div>

                <div class="space-y-4">
                    <h4 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>⚙️</span> <span>Parámetros del Sensor e IA</span>
                    </h4>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Modo de Operación de la IA:</label>
                        <select id="aiSettingMode" class="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-300 font-black text-xs bg-indigo-50 text-indigo-900">
                            <option value="strict" ${cfg.mode === 'strict' ? 'selected' : ''}>Lectura OCR Estricta (Nombre + Precio Real)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Sensibilidad de Escaneo:</label>
                        <select id="aiSettingSensitivity" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white">
                            <option value="high" ${cfg.sensitivity === 'high' ? 'selected' : ''}>Alta (Exige 2 o más coincidencias de letras)</option>
                            <option value="medium" ${cfg.sensitivity === 'medium' ? 'selected' : ''}>Media (Coincidencia básica - Recomendado)</option>
                            <option value="low" ${cfg.sensitivity === 'low' ? 'selected' : ''}>Baja (Laxa)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Lente Preferido en Dispositivos Móviles:</label>
                        <select id="aiSettingFacing" class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white">
                            <option value="environment" ${cfg.cameraFacing === 'environment' ? 'selected' : ''}>Cámara Trasera (Recomendado para góndolas)</option>
                            <option value="user" ${cfg.cameraFacing === 'user' ? 'selected' : ''}>Cámara Frontal (Selfie)</option>
                        </select>
                    </div>

                    <button onclick="saveAiGameConfiguration()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-xs uppercase shadow-lg border-b-4 border-emerald-950 active:scale-95">
                        💾 Guardar Configuración de IA
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function startAdminCameraTest() {
    stopAdminTestCameraStream();
    const videoEl = document.getElementById('adminTestVideo');
    const placeholder = document.getElementById('adminTestCameraPlaceholder');
    const statusBox = document.getElementById('adminTestCameraStatus');

    if (!videoEl || !statusBox) return;

    statusBox.textContent = "⌛ Accediendo al sensor de video...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: document.getElementById('aiSettingFacing')?.value || 'environment' },
            audio: false
        });

        APP_STATE.adminTestStream = stream;
        videoEl.srcObject = stream;
        await videoEl.play();

        if (placeholder) placeholder.classList.add('hidden');
        statusBox.textContent = "✅ Cámara encendida correctamente.";
        statusBox.className = "p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-800 text-center";
    } catch (err) {
        console.error("Error en prueba de cámara:", err);
        statusBox.textContent = `❌ Fallo de cámara: ${err.message || 'Permiso denegado o HTTP inseguro'}`;
        statusBox.className = "p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-black text-rose-800 text-center";
    }
}

function stopAdminTestCameraStream() {
    if (APP_STATE.adminTestStream) {
        APP_STATE.adminTestStream.getTracks().forEach(t => t.stop());
        APP_STATE.adminTestStream = null;
    }
    const placeholder = document.getElementById('adminTestCameraPlaceholder');
    const statusBox = document.getElementById('adminTestCameraStatus');
    if (placeholder) placeholder.classList.remove('hidden');
    if (statusBox) {
        statusBox.textContent = "Sensor inactivo.";
        statusBox.className = "p-2.5 bg-white border rounded-xl text-xs font-bold text-slate-600 text-center";
    }
}

async function testAdminAiRecognition() {
    const statusBox = document.getElementById('adminTestCameraStatus');
    const videoEl = document.getElementById('adminTestVideo');
    const canvasEl = document.getElementById('adminTestCanvas');
    const prodId = document.getElementById('adminTestProductSelect')?.value;

    const prod = (APP_STATE.products || []).find(p => String(p.id) === String(prodId));
    if (!prod) return alert("Selecciona un producto para la prueba.");

    if (!videoEl || videoEl.readyState < 2) {
        return alert("Primero enciende la cámara presionando '▶️ Encender Cámara'.");
    }

    if (statusBox) {
        statusBox.innerHTML = `
            <div class="flex items-center justify-center gap-2 text-indigo-700 font-black animate-pulse">
                <span class="text-xl animate-spin">🔍</span>
                <span>Analizando nombre y precio mediante OCR...</span>
            </div>
        `;
    }

    const ctx = canvasEl.getContext('2d');
    canvasEl.width = videoEl.videoWidth || 640;
    canvasEl.height = videoEl.videoHeight || 480;
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

    try {
        if (typeof Tesseract === 'undefined') return alert("Falta Tesseract.js en index.html");

        const result = await Tesseract.recognize(canvasEl, 'spa');
        const detectedText = (result.data.text || '').toLowerCase();

        const expectedName = prod.name.toLowerCase().trim();
        const keywords = expectedName.split(' ').filter(w => w.length > 2);
        const matchesName = keywords.filter(kw => detectedText.includes(kw));

        if (matchesName.length > 0) {
            const priceRegex = /\$?\s*([0-9]{1,3}(?:\.[0-9]{3})+|[0-9]{3,6})/g;
            const priceMatches = [...detectedText.matchAll(priceRegex)];
            let scannedPrice = prod.price;

            if (priceMatches.length > 0) {
                const rawPriceStr = priceMatches[0][1].replace(/\./g, '');
                const parsedPrice = parseInt(rawPriceStr, 10);
                if (!isNaN(parsedPrice) && parsedPrice >= 100) scannedPrice = parsedPrice;
            }

            playChimeSound(false);
            if (statusBox) {
                statusBox.innerHTML = `
                    <div class="p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-black text-xs text-center space-y-1">
                        <div>✅ ¡NOMBRE VALIDADO! ("${prod.name}")</div>
                        <div>🏷️ Precio Detectado: <b>$${scannedPrice.toLocaleString('es-CL')}</b></div>
                    </div>
                `;
            }
        } else {
            playChimeSound(true);
            const readSnippet = detectedText.length > 0 ? detectedText.substring(0, 30).replace(/\n/g, ' ') : 'Texto no legible';
            if (statusBox) {
                statusBox.innerHTML = `
                    <div class="p-2 bg-rose-100 border border-rose-300 rounded-xl text-rose-900 font-bold text-xs text-center">
                        ❌ NO COINCIDE: Texto visto "${readSnippet}". Se esperaba "${prod.name}".
                    </div>
                `;
            }
        }
    } catch (err) {
        console.error("Error en test OCR:", err);
    }
}

function saveAiGameConfiguration() {
    const newCfg = {
        mode: document.getElementById('aiSettingMode').value,
        sensitivity: document.getElementById('aiSettingSensitivity').value,
        cameraFacing: document.getElementById('aiSettingFacing').value
    };

    APP_STATE.aiConfig = newCfg;

    if (db) {
        db.collection('settings').doc('ai_config').set(newCfg, { merge: true }).then(() => {
            alert("✅ Configuración de IA guardada correctamente.");
            renderApp();
        });
    } else {
        alert("✅ Configuración aplicada localmente.");
        renderApp();
    }
}

function renderTeacherHomeTab() {
    const totalEvals = (APP_STATE.evaluations || []).length;
    const avgTime = totalEvals > 0 ? Math.round(APP_STATE.evaluations.reduce((a, e) => a + (e.timeSeconds || 0), 0) / totalEvals) : 0;
    const totalVoiceHelp = APP_STATE.telemetry ? APP_STATE.telemetry.voiceHelpCount || 0 : 0;

    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-3xl border-4 border-indigo-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Evaluaciones Totales</span>
                        <span class="text-2xl font-black text-indigo-950">${totalEvals}</span>
                    </div>
                    <div class="bg-indigo-100 text-indigo-600 p-3 rounded-2xl text-xl">🛍️</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Tiempo Promedio</span>
                        <span class="text-2xl font-black text-emerald-700">${Math.floor(avgTime / 60)}m ${avgTime % 60}s</span>
                    </div>
                    <div class="bg-emerald-100 text-emerald-600 p-3 rounded-2xl text-xl">⏱️</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-amber-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Alumnos Registrados</span>
                        <span class="text-2xl font-black text-amber-900">${(APP_STATE.users || []).filter(u => u.role === 'student').length}</span>
                    </div>
                    <div class="bg-amber-100 text-amber-600 p-3 rounded-2xl text-xl">🎒</div>
                </div>
                <div class="bg-white p-4 rounded-3xl border-4 border-sky-200 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-extrabold text-slate-500 uppercase block">Lecturas por Voz</span>
                        <span class="text-2xl font-black text-sky-800">${totalVoiceHelp}</span>
                    </div>
                    <div class="bg-sky-100 text-sky-600 p-3 rounded-2xl text-xl">🔊</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-md space-y-4">
                <div class="border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <span>✨</span> <span>Histórico de Evaluaciones e Informes Psicopedagógicos</span>
                    </h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b-2 border-slate-200 text-slate-500 uppercase font-black">
                                <th class="py-2.5 px-3">Fecha</th>
                                <th class="py-2.5 px-3">Estudiante</th>
                                <th class="py-2.5 px-3">Tienda</th>
                                <th class="py-2.5 px-3">Total / Pago</th>
                                <th class="py-2.5 px-3 text-center">Intentos / Errores</th>
                                <th class="py-2.5 px-3 text-center">Logro</th>
                                <th class="py-2.5 px-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-bold">
                            ${totalEvals === 0 ? `
                                <tr>
                                    <td colspan="7" class="py-8 text-center text-slate-400 italic">No hay evaluaciones registradas. Realiza una compra para generar informes.</td>
                                </tr>
                            ` : (APP_STATE.evaluations || []).map(e => `
                                <tr class="hover:bg-slate-50">
                                    <td class="py-3 px-3 text-slate-500">${e.date || 'Reciente'}</td>
                                    <td class="py-3 px-3 font-black text-indigo-950">${e.studentName || 'Estudiante'}</td>
                                    <td class="py-3 px-3">${e.supermarketName || 'Supermercado'}</td>
                                    <td class="py-3 px-3">
                                        <div class="font-black text-emerald-700">$${(e.totalCLP || 0).toLocaleString('es-CL')}</div>
                                    </td>
                                    <td class="py-3 px-3 text-center text-rose-600 font-black">${e.classroomErrorsCount || 0} error(es)</td>
                                    <td class="py-3 px-3 text-center font-black text-amber-600">⭐ ${e.pointsEarned || 100}%</td>
                                    <td class="py-3 px-3 text-center">
                                        <button onclick="generateAIPedagogicalReport('${e.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow-sm">
                                            ✨ Generar Informe IA
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function generateAIPedagogicalReport(evalId) {
    const ev = (APP_STATE.evaluations || []).find(x => String(x.id) === String(evalId));
    if (!ev) return alert("Evaluación no encontrada.");

    const st = APP_STATE.settings || DEFAULT_SETTINGS;
    const teamLabel = st.teamName || 'Equipo Multidisciplinario';
    const paid = ev.paidCLP || 0;
    const total = ev.totalCLP || 0;
    const change = ev.changeCLP || 0;
    const classroomErrors = ev.classroomErrorsCount || 0;
    const priceAdjustments = ev.priceAdjustmentsCount || 0;

    let nivelAutonomia = "Alto / Independiente (100% de logro)";
    if (classroomErrors === 1) nivelAutonomia = "Adecuado / Con 1 Apoyo Puntual (85% de logro)";
    if (classroomErrors === 2) nivelAutonomia = "En Proceso de Autonomía (70% de logro)";
    if (classroomErrors >= 3) nivelAutonomia = "Requiere Acompañamiento Intensivo (Menos de 50% de logro)";

    const reportHtml = `
        <div id="printableReport" class="bg-white p-8 max-w-4xl mx-auto border border-slate-300 shadow-2xl rounded-2xl font-sans text-slate-800 space-y-6">
            <div class="flex justify-between items-center border-b-4 border-indigo-600 pb-4">
                <div>
                    <h1 class="text-xl font-black text-indigo-950 uppercase">${st.schoolName}</h1>
                    <p class="text-xs font-bold text-indigo-700">${st.schoolSubHeader} • ${teamLabel}</p>
                </div>
                ${st.schoolLogo ? `<img src="${st.schoolLogo}" class="h-16 object-contain">` : `<span class="text-3xl">🏫</span>`}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border text-xs font-bold">
                <div><span class="text-slate-400 block text-[10px] uppercase">Estudiante:</span> ${ev.studentName}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">RUT:</span> ${ev.rut || 'N/A'}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">Fecha:</span> ${ev.date || 'Reciente'}</div>
                <div><span class="text-slate-400 block text-[10px] uppercase">Tienda:</span> ${ev.supermarketName}</div>
            </div>

            <div class="grid grid-cols-4 gap-3 text-center">
                <div class="p-3 bg-emerald-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-emerald-800">Total Compra</span><div class="text-base font-black text-emerald-700">$${total.toLocaleString('es-CL')}</div></div>
                <div class="p-3 bg-indigo-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-indigo-800">Pagó</span><div class="text-base font-black text-indigo-900">$${paid.toLocaleString('es-CL')}</div></div>
                <div class="p-3 bg-amber-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-amber-900">Vuelto</span><div class="text-base font-black text-amber-800">$${change.toLocaleString('es-CL')}</div></div>
                <div class="p-3 bg-sky-50 rounded-xl border"><span class="text-[10px] uppercase font-black text-sky-900">Porcentaje Logro</span><div class="text-base font-black text-amber-600">⭐ ${ev.pointsEarned || 100}%</div></div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs font-bold">
                <div class="p-3 bg-slate-50 rounded-xl border">
                    <span class="text-slate-500 block text-[10px] uppercase">Intentos Fallidos / Errores Cometidos:</span>
                    <span class="text-base font-black ${classroomErrors > 0 ? 'text-rose-600' : 'text-emerald-600'}">${classroomErrors} desacierto(s) detectado(s)</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border">
                    <span class="text-slate-500 block text-[10px] uppercase">Diferencia de Precios en Góndola:</span>
                    <span class="text-base font-black text-indigo-900">${priceAdjustments} cambio(s) de precio corregidos</span>
                </div>
            </div>

            <div class="p-4 bg-indigo-50 border rounded-2xl text-xs space-y-2">
                <div class="font-black text-indigo-950">Diagnóstico de Autonomía Funcional: ${nivelAutonomia}</div>
                <p class="text-slate-700">El estudiante seleccionó su supermercado de preferencia, organizó su canasto según la lista impresa, realizó el reconocimiento visual por cámara con IA y completó el pago en moneda nacional.</p>
            </div>
        </div>
    `;

    const reportModal = document.getElementById('aiReportModal');
    const container = document.getElementById('aiReportContainer');
    if (container && reportModal) {
        container.innerHTML = reportHtml;
        window.currentReportEvalId = evalId;
        reportModal.classList.remove('hidden');
    }
}

function closeAIReportModal() {
    const reportModal = document.getElementById('aiReportModal');
    if (reportModal) reportModal.classList.add('hidden');
}

function sendReportByEmail() {
    const email = prompt("Ingresa el correo electrónico para enviar este informe:");
    if (!email || !email.includes('@')) return alert("Por favor ingresa un correo electrónico válido.");
    alert(`📧 Informe psicopedagógico enviado exitosamente a ${email}`);
}

function printCurrentReport() {
    const reportContent = document.getElementById('printableReport')?.outerHTML;
    if (!reportContent) return;

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Informe Pedagógico PDF</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white p-6">
                ${reportContent}
                <script>setTimeout(() => { window.print(); window.close(); }, 750);</script>
            </body>
        </html>
    `);
    win.document.close();
}

function renderTeacherCatalogTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-5 rounded-3xl border-4 border-emerald-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>🏪</span> <span>Supermercados (${(APP_STATE.supermarkets || []).length})</span>
                    </h3>
                    <button onclick="openSupermarketModal()" class="bg-emerald-600 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Tienda</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.supermarkets || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay supermercados creados.</p>
                    ` : (APP_STATE.supermarkets || []).map(s => {
                        const logo = s.photoUrl || s.photo || s.logoUrl || '';
                        const imgHtml = logo 
                            ? `<img src="${logo}" class="w-8 h-8 object-contain rounded-lg border bg-white p-0.5">`
                            : `<span class="text-base">${s.icon || '🏪'}</span>`;
                        return `
                            <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold">
                                <div class="flex items-center gap-2">
                                    ${imgHtml}
                                    <span class="font-black text-slate-800">${s.name}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <button onclick="openSupermarketModal('${s.id}')" class="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-[10px]">✏️ Editar</button>
                                    <button onclick="deleteSupermarket('${s.id}')" class="bg-rose-100 text-rose-900 px-2 py-1 rounded-xl text-[10px]">✕</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-indigo-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>🏷️</span> <span>Categorías (${(APP_STATE.categories || []).length})</span>
                    </h3>
                    <button onclick="openCategoryModal()" class="bg-indigo-600 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Categoría</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.categories || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay categorías creadas.</p>
                    ` : (APP_STATE.categories || []).map(c => `
                        <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold">
                            <span class="font-black text-slate-800">${c.icon || '🏷️'} ${c.name}</span>
                            <button onclick="deleteCategory('${c.id}')" class="text-rose-600 font-bold px-2 py-1 rounded-lg bg-rose-50 text-[10px]">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white p-5 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
                <div class="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">
                        <span>📦</span> <span>Productos (${(APP_STATE.products || []).length})</span>
                    </h3>
                    <button onclick="openProductModal()" class="bg-amber-500 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow">+ Producto</button>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${(APP_STATE.products || []).length === 0 ? `
                        <p class="text-xs text-slate-400 italic py-4 text-center">No hay productos en el catálogo.</p>
                    ` : (APP_STATE.products || []).map(p => {
                        const isAll = p.isAll === true || p.supermarketId === 'ALL' || p.supermarketName === 'TODOS';
                        let supBadge = isAll 
                            ? `<span class="inline-block bg-sky-100 text-sky-900 text-[10px] font-black px-2 py-0.5 rounded-md my-0.5">🌐 Todos los supermercados</span>`
                            : `<span class="inline-block bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md my-0.5">🏪 Solo en: ${(APP_STATE.supermarkets || []).find(s => String(s.id) === String(p.supermarketId))?.name || 'Supermercado'}</span>`;

                        const imgUrl = p.photoUrl || p.photo || p.image || '';
                        const photoThumb = imgUrl 
                            ? `<img src="${imgUrl}" class="w-10 h-10 object-cover rounded-xl border border-slate-300">`
                            : `<div class="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-lg">📦</div>`;

                        return `
                            <div class="p-2.5 bg-slate-50 border-2 rounded-2xl flex justify-between items-center text-xs font-bold gap-2">
                                <div class="flex items-center gap-2">
                                    ${photoThumb}
                                    <div>
                                        <span class="font-black text-slate-800 block">${p.name}</span>
                                        <span class="text-emerald-700 font-black inline-block ml-1">$${(p.price || 0).toLocaleString('es-CL')}</span>
                                        <div>${supBadge}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <button onclick="openProductModal('${p.id}')" class="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-[10px]">✏️ Editar</button>
                                    <button onclick="deleteProduct('${p.id}')" class="bg-rose-100 text-rose-900 px-2 py-1 rounded-xl text-[10px]">✕</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function handleSupermarketLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 250, 250, 0.6).then(compressed => {
            document.getElementById('modalSupLogo').value = compressed;
        });
    };
    reader.readAsDataURL(file);
}

function handleProductPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const previewContainer = document.getElementById('modalProdPhotoPreviewContainer');
    const previewImg = document.getElementById('modalProdPhotoPreview');
    const statusTxt = document.getElementById('modalProdPhotoStatus');

    if (previewContainer && statusTxt) {
        previewContainer.classList.remove('hidden');
        statusTxt.textContent = "⏳ Optimizando imagen...";
        statusTxt.className = "text-[11px] font-bold text-amber-600 animate-pulse";
    }

    isPhotoProcessing = true;

    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 250, 250, 0.6).then(compressed => {
            document.getElementById('modalProdPhoto').value = compressed;
            if (previewImg) previewImg.src = compressed;
            if (statusTxt) {
                statusTxt.textContent = "✓ Imagen lista para guardar";
                statusTxt.className = "text-[11px] font-bold text-emerald-600";
            }
            isPhotoProcessing = false;
        }).catch(err => {
            console.error("Error al comprimir imagen:", err);
            isPhotoProcessing = false;
            if (statusTxt) {
                statusTxt.textContent = "❌ Error al procesar imagen";
                statusTxt.className = "text-[11px] font-bold text-rose-600";
            }
        });
    };
    reader.readAsDataURL(file);
}

function renderTeacherCurrencyTab() {
    return `
        <div class="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md space-y-4">
            <div class="border-b pb-3">
                <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span>💵</span> <span>Billetes y Monedas Chilenas (CLP)</span>
                </h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                ${CLP_CURRENCY_ITEMS.map(item => {
                    const currentImg = APP_STATE.customCurrencies[item.id] || item.img;
                    const isCustom = !!APP_STATE.customCurrencies[item.id];
                    return `
                        <div class="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl flex flex-col items-center text-center space-y-3 shadow-sm">
                            <span class="text-xs font-black text-slate-800">${item.name}</span>
                            <div class="h-24 w-full flex items-center justify-center p-1 bg-white rounded-2xl border">
                                <img src="${currentImg}" class="max-h-full max-w-full object-contain">
                            </div>
                            <div class="w-full space-y-1">
                                <label class="block bg-indigo-600 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer shadow text-center">
                                    📁 Cambiar Imagen
                                    <input type="file" accept="image/*" class="hidden" onchange="uploadCustomCurrencyImage(event, '${item.id}')">
                                </label>
                                ${isCustom ? `
                                    <button onclick="resetCustomCurrencyImage('${item.id}')" class="w-full bg-slate-200 text-slate-700 font-bold py-1 rounded-xl text-[9px]">
                                        🔄 Restablecer
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function uploadCustomCurrencyImage(event, itemId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImageBase64(e.target.result, 300, 300, 0.6).then(compressed => {
            APP_STATE.customCurrencies[itemId] = compressed;
            if (db) {
                db.collection('settings').doc('currencies').set({ [itemId]: compressed }, { merge: true });
            }
            try { localStorage.setItem('nee_custom_currencies', JSON.stringify(APP_STATE.customCurrencies)); } catch(err) {}
            renderApp();
            alert("✅ Imagen cargada exitosamente.");
        });
    };
    reader.readAsDataURL(file);
}

function resetCustomCurrencyImage(itemId) {
    delete APP_STATE.customCurrencies[itemId];
    if (db) {
        const update = {};
        update[itemId] = firebase.firestore.FieldValue.delete();
        db.collection('settings').doc('currencies').update(update);
    }
    try { localStorage.setItem('nee_custom_currencies', JSON.stringify(APP_STATE.customCurrencies)); } catch(e) {}
    renderApp();
}

function renderTeacherUsersTab() {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const teamLabel = (APP_STATE.settings && APP_STATE.settings.teamName) ? APP_STATE.settings.teamName : 'Equipo Multidisciplinario';

    return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                    <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                        <span>🏫</span> <span>Cursos Registrados</span>
                    </h3>
                    <button onclick="addNewCoursePrompt()" class="bg-emerald-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow">+ Crear Curso</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    ${(APP_STATE.courses || []).length === 0 ? `
                        <p class="col-span-full text-xs text-slate-400 italic text-center py-2">No hay cursos creados.</p>
                    ` : (APP_STATE.courses || []).map(c => `
                        <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex justify-between items-center font-bold text-xs">
                            <span class="text-slate-800 font-black">${c.name}</span>
                            <button onclick="deleteCourse('${c.id}')" class="text-rose-600 font-black px-2 py-1 rounded-lg bg-rose-50">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white p-5 rounded-3xl border-4 border-purple-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🔑 Admin General</h3>
                        ${isAdmin ? `<button onclick="openCreateUserModal('admin')" class="bg-purple-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Admin</button>` : ''}
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">${renderUserRoleList('admin')}</div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-indigo-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">👨‍🏫 Educadores (${teamLabel})</h3>
                        ${isAdmin ? `<button onclick="openCreateUserModal('teacher')" class="bg-indigo-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Educador</button>` : ''}
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">${renderUserRoleList('teacher')}</div>
                </div>

                <div class="bg-white p-5 rounded-3xl border-4 border-emerald-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🎒 Estudiantes</h3>
                        <button onclick="openCreateUserModal('student')" class="bg-emerald-600 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">+ Alumno</button>
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">${renderUserRoleList('student')}</div>
                </div>
            </div>
        </div>
    `;
}

function renderUserRoleList(role) {
    const isAdmin = APP_STATE.currentUser && APP_STATE.currentUser.role === 'admin';
    const users = (APP_STATE.users || []).filter(u => u.role === role);
    if (users.length === 0) return `<p class="text-xs text-slate-400 italic py-4 text-center">No hay usuarios registrados.</p>`;

    return users.map(u => {
        const uLevel = u.level || 0;
        return `
            <div class="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-xs font-bold">
                <div class="flex justify-between items-center">
                    <span class="text-indigo-950 font-black">${u.name}</span>
                    <div class="space-x-1">
                        ${(isAdmin || role === 'student') ? `
                            <button onclick="openEditUserModal('${u.id}')" class="text-amber-600 font-extrabold">✏️</button>
                            <button onclick="deleteUser('${u.id}')" class="text-rose-600 font-extrabold">✕</button>
                        ` : ''}
                    </div>
                </div>
                <div class="text-[11px] text-slate-600">
                    <div>RUT: <b>${u.rut || 'N/A'}</b> | Clave: <code class="bg-slate-200 px-1 py-0.5 rounded text-indigo-900 font-black">${u.pin}</code></div>
                    <div>📧 ${u.email || 'Sin correo'}</div>
                    ${role === 'student' ? `<div class="text-amber-700 font-black mt-1 flex justify-between"><span>⭐ Puntos: ${u.points || 0} pts</span> <span>🏆 Nivel ${uLevel}</span></div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// MODALES Y OPERACIONES SECUNDARIAS
// ==========================================
function openSupermarketModal(supId = null) {
    const el = document.getElementById('supermarketModal');
    if (!el) return;

    if (supId) {
        const sup = (APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId));
        if (sup) {
            document.getElementById('modalSupId').value = sup.id;
            document.getElementById('modalSupName').value = sup.name || '';
            document.getElementById('modalSupLogo').value = sup.photoUrl || sup.photo || sup.logoUrl || '';
        }
    } else {
        document.getElementById('modalSupId').value = '';
        document.getElementById('modalSupName').value = '';
        document.getElementById('modalSupLogo').value = '';
    }

    el.classList.remove('hidden');
}

function closeSupermarketModal() {
    document.getElementById('supermarketModal').classList.add('hidden');
}

function saveSupermarketFromModal() {
    const idInput = document.getElementById('modalSupId')?.value;
    const name = document.getElementById('modalSupName').value.trim();
    const photoUrl = document.getElementById('modalSupLogo').value;

    if (!name) return alert("Ingresa el nombre del supermercado.");

    const id = idInput ? idInput : ('sup-' + Date.now());
    const newSup = { id, name, photoUrl: photoUrl || '', icon: '🏪', description: 'Supermercado' };

    const idx = APP_STATE.supermarkets.findIndex(s => String(s.id) === String(id));
    if (idx !== -1) APP_STATE.supermarkets[idx] = newSup;
    else APP_STATE.supermarkets.push(newSup);

    if (db) db.collection('supermarkets').doc(id).set(newSup, { merge: true });

    closeSupermarketModal();
    renderApp();
    alert(`✅ Supermercado "${name}" guardado.`);
}

function deleteSupermarket(supId) {
    if (confirm("¿Eliminar este supermercado?")) {
        APP_STATE.supermarkets = APP_STATE.supermarkets.filter(s => String(s.id) !== String(supId));
        if (db) db.collection('supermarkets').doc(supId).delete();
        renderApp();
    }
}

function updateCategoryDropdowns(selectedName = null) {
    const catSelect = document.getElementById('modalProdCategory');
    if (!catSelect) return;
    const list = APP_STATE.categories || [];
    catSelect.innerHTML = list.map(c => `<option value="${c.name}" ${selectedName === c.name ? 'selected' : ''}>${c.icon || '🏷️'} ${c.name}</option>`).join('');
}

function openProductModal(prodId = null) {
    const supSelect = document.getElementById('modalProdSupermarket');
    if (supSelect) {
        supSelect.innerHTML = (APP_STATE.supermarkets || []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }

    const previewContainer = document.getElementById('modalProdPhotoPreviewContainer');
    const previewImg = document.getElementById('modalProdPhotoPreview');
    const statusTxt = document.getElementById('modalProdPhotoStatus');

    if (prodId) {
        const p = (APP_STATE.products || []).find(x => String(x.id) === String(prodId));
        if (p) {
            document.getElementById('modalProdId').value = p.id;
            document.getElementById('modalProdName').value = p.name || '';
            document.getElementById('modalProdPrice').value = p.price || 0;
            const photoVal = p.photoUrl || p.photo || p.image || '';
            document.getElementById('modalProdPhoto').value = photoVal;
            document.getElementById('modalProdReplicateAll').checked = !!p.isAll;
            if (supSelect && p.supermarketId) supSelect.value = p.supermarketId;
            updateCategoryDropdowns(p.category);

            if (photoVal && previewContainer && previewImg) {
                previewImg.src = photoVal;
                previewContainer.classList.remove('hidden');
                if (statusTxt) {
                    statusTxt.textContent = "✓ Imagen actual cargada";
                    statusTxt.className = "text-[11px] font-bold text-emerald-600";
                }
            } else if (previewContainer) {
                previewContainer.classList.add('hidden');
            }
        }
    } else {
        document.getElementById('modalProdId').value = '';
        document.getElementById('modalProdName').value = '';
        document.getElementById('modalProdPrice').value = '';
        document.getElementById('modalProdPhoto').value = '';
        document.getElementById('modalProdReplicateAll').checked = false;
        if (previewContainer) previewContainer.classList.add('hidden');
        updateCategoryDropdowns();
    }

    document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

function saveProductFromModal() {
    if (isPhotoProcessing) {
        return alert("⏳ La imagen aún se está procesando. Espera un segundo antes de guardar.");
    }

    const prodId = document.getElementById('modalProdId')?.value;
    const supSelect = document.getElementById('modalProdSupermarket');
    const supId = supSelect ? supSelect.value : null;

    const name = document.getElementById('modalProdName').value.trim();
    const categorySelect = document.getElementById('modalProdCategory');
    const category = categorySelect ? categorySelect.value : 'General';
    const price = parseInt(document.getElementById('modalProdPrice').value);
    const replicateAll = document.getElementById('modalProdReplicateAll')?.checked || false;
    const photoUrl = document.getElementById('modalProdPhoto')?.value || '';

    if (!name || isNaN(price)) return alert("Por favor ingresa un nombre y precio válidos.");

    const id = prodId ? prodId : ('prod-' + Date.now());

    const productPayload = {
        id: id,
        name: name,
        category: category,
        price: price,
        photoUrl: photoUrl,
        photo: photoUrl,
        image: photoUrl,
        isAll: replicateAll,
        supermarketId: replicateAll ? 'ALL' : supId,
        supermarketName: replicateAll ? 'TODOS' : ((APP_STATE.supermarkets || []).find(s => String(s.id) === String(supId))?.name || 'Supermercado')
    };

    const idx = APP_STATE.products.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) APP_STATE.products[idx] = productPayload;
    else APP_STATE.products.push(productPayload);

    if (db) db.collection('products').doc(id).set(productPayload, { merge: true });

    closeProductModal();
    renderApp();
    alert(`✅ Producto "${name}" guardado exitosamente.`);
}

function deleteProduct(prodId) {
    if (confirm("¿Eliminar este producto?")) {
        APP_STATE.products = APP_STATE.products.filter(p => String(p.id) !== String(prodId));
        if (db) db.collection('products').doc(prodId).delete();
        renderApp();
    }
}

function openCategoryModal() {
    const el = document.getElementById('categoryModal');
    const iconSelect = document.getElementById('modalCatIcon');
    if (iconSelect) {
        iconSelect.innerHTML = PRESET_CATEGORIES.map(c => 
            `<option value="${c.icon}">${c.icon} ${c.name}</option>`
        ).join('');
    }
    if (el) el.classList.remove('hidden');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.add('hidden');
}

function saveCategoryFromModal() {
    const name = document.getElementById('modalCatName').value.trim();
    const icon = document.getElementById('modalCatIcon').value;
    if (!name) return alert("Ingresa el nombre de la categoría.");
    const id = 'cat-' + Date.now();
    const newCat = { id, name, icon: icon || '🏷️' };
    
    APP_STATE.categories.push(newCat);
    if (db) db.collection('categories').doc(id).set(newCat);

    closeCategoryModal();
    updateCategoryDropdowns(name);
    renderApp();
}

function deleteCategory(catId) {
    if (confirm("¿Eliminar esta categoría?")) {
        APP_STATE.categories = APP_STATE.categories.filter(c => String(c.id) !== String(catId));
        if (db) db.collection('categories').doc(catId).delete();
        renderApp();
    }
}

function openCreateUserModal(role) {
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = '';
        document.getElementById('modalUserRole').value = role;
        document.getElementById('modalName').value = '';
        document.getElementById('modalRut').value = '';
        document.getElementById('modalEmail').value = '';
        el.classList.remove('hidden');
    }
}

function openEditUserModal(userId) {
    const user = (APP_STATE.users || []).find(u => String(u.id) === String(userId));
    if (!user) return;
    const el = document.getElementById('userModal');
    if (el) {
        document.getElementById('modalUserId').value = user.id;
        document.getElementById('modalUserRole').value = user.role;
        document.getElementById('modalName').value = user.name || '';
        document.getElementById('modalRut').value = user.rut || '';
        document.getElementById('modalEmail').value = user.email || '';
        el.classList.remove('hidden');
    }
}

function closeUserModal() {
    document.getElementById('userModal').classList.add('hidden');
}

function saveUserFromModal() {
    const userId = document.getElementById('modalUserId').value;
    const role = document.getElementById('modalUserRole').value;
    const name = document.getElementById('modalName').value.trim();
    const rut = document.getElementById('modalRut').value.trim();
    const email = document.getElementById('modalEmail').value.trim();

    if (!name || !rut) return alert("Completa nombre y RUT.");

    const id = userId || ('u-' + Date.now());
    const pin = rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';
    const userPayload = { id, role, name, rut, username: rut, email, pin, points: 0, level: 0, xp: 0 };

    const idx = APP_STATE.users.findIndex(u => String(u.id) === String(id));
    if (idx !== -1) APP_STATE.users[idx] = { ...APP_STATE.users[idx], ...userPayload };
    else APP_STATE.users.push(userPayload);

    if (db) db.collection('users').doc(id).set(userPayload, { merge: true });

    closeUserModal();
    renderApp();
    alert("✅ Usuario guardado.");
}

function deleteUser(id) {
    if (confirm("¿Eliminar este usuario?")) {
        APP_STATE.users = APP_STATE.users.filter(u => String(u.id) !== String(id));
        if (db) db.collection('users').doc(id).delete();
        renderApp();
    }
}

function addNewCoursePrompt() {
    const courseName = prompt("Nombre del nuevo curso:");
    if (!courseName || !courseName.trim()) return;
    const id = 'course-' + Date.now();
    const newCourse = { id, name: courseName.trim() };
    APP_STATE.courses.push(newCourse);
    if (db) db.collection('courses').doc(id).set(newCourse);
    renderApp();
}

function deleteCourse(courseId) {
    if (confirm("¿Eliminar este curso?")) {
        APP_STATE.courses = APP_STATE.courses.filter(c => String(c.id) !== String(courseId));
        if (db) db.collection('courses').doc(courseId).delete();
        renderApp();
    }
}

// ==========================================
// ESCUCHADORES DE FIRESTORE EN TIEMPO REAL
// ==========================================
function initFirebaseListeners() {
    try {
        const storedUser = localStorage.getItem('nee_active_user');
        if (storedUser) APP_STATE.currentUser = JSON.parse(storedUser);
        const storedCurrencies = localStorage.getItem('nee_custom_currencies');
        if (storedCurrencies) APP_STATE.customCurrencies = JSON.parse(storedCurrencies);
    } catch(e) {}

    if (!db) {
        renderApp();
        return;
    }

    const listenCol = (name, callback) => {
        try {
            db.collection(name).onSnapshot(
                s => {
                    const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
                    if (data && data.length > 0) callback(data);
                    renderApp();
                },
                err => { console.warn("Firebase collection fallback:", name); renderApp(); }
            );
        } catch(e) { renderApp(); }
    };

    listenCol('users', data => { APP_STATE.users = data; });
    listenCol('courses', data => { APP_STATE.courses = data; });
    listenCol('categories', data => {
        APP_STATE.categories = data;
        updateCategoryDropdowns();
    });
    listenCol('supermarkets', data => { APP_STATE.supermarkets = data; });
    listenCol('products', data => { APP_STATE.products = data; });
    listenCol('evaluations', data => { APP_STATE.evaluations = data; });

    try {
        db.collection('settings').doc('activeMission').onSnapshot(
            doc => {
                if (doc.exists && doc.data() && doc.data().active) {
                    APP_STATE.activeMission = doc.data();
                } else {
                    APP_STATE.activeMission = null;
                }
                renderApp();
            },
            () => renderApp()
        );

        db.collection('settings').doc('institutional').onSnapshot(
            doc => {
                if (doc.exists) APP_STATE.settings = { ...DEFAULT_SETTINGS, ...doc.data() };
                renderApp();
            },
            () => renderApp()
        );

        db.collection('settings').doc('ai_config').onSnapshot(
            doc => {
                if (doc.exists) APP_STATE.aiConfig = { ...DEFAULT_AI_CONFIG, ...doc.data() };
                renderApp();
            },
            () => renderApp()
        );

        db.collection('settings').doc('currencies').onSnapshot(
            doc => {
                if (doc.exists) APP_STATE.customCurrencies = { ...APP_STATE.customCurrencies, ...doc.data() };
                renderApp();
            },
            () => renderApp()
        );
    } catch(e) { renderApp(); }
}

function mainInit() {
    renderApp();
    initFirebaseListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainInit);
} else {
    mainInit();
}

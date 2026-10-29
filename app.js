// ==========================================
// ESTADO GLOBAL CON TELEMETRÍA AUTOMÁTICA
// ==========================================
if (typeof APP_STATE !== 'undefined') {
    APP_STATE.telemetry = {
        voiceHelpCount: 0,
        paymentResetsCount: 0
    };
}

// Interceptar funciones de voz y reseteo para contar telemetría
const originalSpeakText = typeof speakText === 'function' ? speakText : null;
function speakText(text) {
    if (APP_STATE && APP_STATE.telemetry) {
        APP_STATE.telemetry.voiceHelpCount++;
    }
    if (originalSpeakText) originalSpeakText(text);
}

const originalResetUserPayment = typeof resetUserPayment === 'function' ? resetUserPayment : null;
function resetUserPayment() {
    if (APP_STATE && APP_STATE.telemetry) {
        APP_STATE.telemetry.paymentResetsCount++;
    }
    if (originalResetUserPayment) originalResetUserPayment();
}

// Resetear telemetría al abrir canasto o iniciar compra
function resetSessionTelemetry() {
    if (APP_STATE) {
        APP_STATE.telemetry = { voiceHelpCount: 0, paymentResetsCount: 0 };
    }
}

// ==========================================
// PANEL DEL EDUCADOR PROFESIONAL
// ==========================================
function renderTeacherDashboard(container) {
    const myCourseIds = getUserCourseIds(APP_STATE.currentUser);
    const myCourses = APP_STATE.courses.filter(c => myCourseIds.includes(c.id));
    const totalEvals = APP_STATE.evaluations.length;

    // Métricas globales del curso
    const avgTime = totalEvals > 0 
        ? Math.round(APP_STATE.evaluations.reduce((acc, e) => acc + (e.timeSeconds || 0), 0) / totalEvals) 
        : 0;

    let html = `
        <div class="space-y-6">
            <!-- CABECERA PRINCIPAL -->
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

            <!-- TARJETAS DE MÉTRICAS RÁPIDAS -->
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

            <!-- REGISTRO DE EVALUACIONES CON TELEMETRÍA -->
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
                        
                        <!-- TELEMETRÍA BARS -->
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

            <!-- GESTIÓN DE CONFIGURACIÓN (CURSOS Y DIVERSIFICACIÓN) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- SUPERMERCADOS Y DIVERSIFICACIÓN -->
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

                <!-- CATEGORÍAS Y PRODUCTOS -->
                <div class="bg-white p-5 rounded-3xl border-4 border-amber-200 shadow space-y-3">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🍎 Catálogo de Productos</h3>
                        <button onclick="openProductModal()" class="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Producto</button>
                    </div>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${APP_STATE.products.map(p => `
                            <div class="p-2 bg-slate-50 border rounded-xl flex justify-between items-center text-xs font-bold">
                                <span>${p.iconEmoji || '📦'} ${p.name} ($${p.price})</span>
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
// MODAL DE PAUTA MULTIDIMENSIONAL PROFESIONAL
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

            <!-- REGISTRO AUTOMÁTICO DE TELEMETRÍA -->
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

            <!-- FORMULARIO DE 4 DIMENSIONES (ESCALA 1 A 5) -->
            <form id="advancedRubricForm" class="space-y-4 text-xs">
                
                <!-- DIMENSIÓN 1 -->
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

                <!-- DIMENSIÓN 2 -->
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

                <!-- DIMENSIÓN 3 -->
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

                <!-- DIMENSIÓN 4 -->
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

// ==========================================
// GENERADOR IA Y CÁLCULO DE PORCENTAJES
// ==========================================
async function processAdvancedReport(evalId) {
    const evaluation = APP_STATE.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;

    const scores = [
        parseInt(document.getElementById('dim1').value),
        parseInt(document.getElementById('dim2').value),
        parseInt(document.getElementById('dim3').value),
        parseInt(document.getElementById('dim4').value)
    ];

    const totalPts = scores.reduce((a, b) => a + b, 0); // Máximo 20 pts
    const percentage = Math.round((totalPts / 20) * 100);

    let level = 'Inicial';
    if (percentage >= 85) level = 'Destacado / Autónomo';
    else if (percentage >= 60) level = 'Adecuado / En Desarrollo';
    else if (percentage >= 40) level = 'Inicial / Requiere Apoyo';

    closeAdvancedEvalModal();

    // Ventana de carga
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

            <div class="flex gap-3 pt-2">
                <button onclick="navigator.clipboard.writeText(\`${reportMarkdown.replace(/`/g, "'")}\`); alert('¡Informe copiado al portapapeles!');" class="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 rounded-xl border-b-4 border-amber-600 shadow text-xs flex items-center justify-center gap-2">
                    <i class="fa-solid fa-copy"></i>
                    <span>Copiar Texto</span>
                </button>
                <button onclick="closeAiReportResultModal()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-b-4 border-indigo-900 shadow text-xs">
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

// Sobrescribir verifyAndCheckout para que guarde telemetría en Firestore
const originalVerifyAndCheckout = typeof verifyAndCheckout === 'function' ? verifyAndCheckout : null;
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

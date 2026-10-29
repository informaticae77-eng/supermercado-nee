// =======================================================
// CONTROLADORES DE INTERFAZ Y MODAL DE EVALUACIÓN CON IA
// =======================================================

function openEvaluationRubricModal(evalId) {
    const evaluation = APP_STATE.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;

    let modal = document.getElementById('evalRubricModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'evalRubricModal';
        modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white w-full max-w-lg rounded-3xl border-4 border-indigo-500 shadow-2xl p-6 space-y-4 my-6">
            <div class="flex justify-between items-center border-b pb-2">
                <h3 class="text-xl font-black text-indigo-950 flex items-center gap-2">
                    <span>📋 Pauta de Evaluación NEE</span>
                </h3>
                <button onclick="closeEvalRubricModal()" class="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>

            <div class="bg-indigo-50 p-3 rounded-xl text-xs font-bold text-indigo-900 space-y-1">
                <div>Estudiante: <span class="text-indigo-950 font-black">${evaluation.studentName}</span></div>
                <div>Monto Comprado: <span class="text-emerald-700 font-black">$${(evaluation.totalAmount || 0).toLocaleString('es-CL')}</span></div>
            </div>

            <p class="text-xs font-bold text-slate-600">Marca el desempeño del estudiante en cada indicador (2 = Logrado, 1 = Por Lograr, 0 = No Logrado):</p>

            <form id="rubricForm" class="space-y-3 text-xs">
                <div class="bg-slate-50 p-2.5 rounded-xl border flex justify-between items-center">
                    <span class="font-bold text-slate-800">1. Búsqueda y Discriminación Visual de Productos</span>
                    <select class="rubric-score font-black text-indigo-900 bg-white border p-1 rounded-lg">
                        <option value="2" selected>L (2 pts)</option>
                        <option value="1">PL (1 pt)</option>
                        <option value="0">NL (0 pts)</option>
                    </select>
                </div>

                <div class="bg-slate-50 p-2.5 rounded-xl border flex justify-between items-center">
                    <span class="font-bold text-slate-800">2. Reconocimiento de Billetes y Monedas CLP</span>
                    <select class="rubric-score font-black text-indigo-900 bg-white border p-1 rounded-lg">
                        <option value="2" selected>L (2 pts)</option>
                        <option value="1">PL (1 pt)</option>
                        <option value="0">NL (0 pts)</option>
                    </select>
                </div>

                <div class="bg-slate-50 p-2.5 rounded-xl border flex justify-between items-center">
                    <span class="font-bold text-slate-800">3. Conteo y Selección del Pago en Caja</span>
                    <select class="rubric-score font-black text-indigo-900 bg-white border p-1 rounded-lg">
                        <option value="2" selected>L (2 pts)</option>
                        <option value="1">PL (1 pt)</option>
                        <option value="0">NL (0 pts)</option>
                    </select>
                </div>

                <div class="bg-slate-50 p-2.5 rounded-xl border flex justify-between items-center">
                    <span class="font-bold text-slate-800">4. Identificación Pictográfica del Vuelto</span>
                    <select class="rubric-score font-black text-indigo-900 bg-white border p-1 rounded-lg">
                        <option value="2" selected>L (2 pts)</option>
                        <option value="1">PL (1 pt)</option>
                        <option value="0">NL (0 pts)</option>
                    </select>
                </div>

                <div class="bg-slate-50 p-2.5 rounded-xl border flex justify-between items-center">
                    <span class="font-bold text-slate-800">5. Autonomía y Uso de Apoyos de Voz</span>
                    <select class="rubric-score font-black text-indigo-900 bg-white border p-1 rounded-lg">
                        <option value="2" selected>L (2 pts)</option>
                        <option value="1">PL (1 pt)</option>
                        <option value="0">NL (0 pts)</option>
                    </select>
                </div>
            </form>

            <div class="grid grid-cols-2 gap-3 pt-2">
                <button onclick="closeEvalRubricModal()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl">Cancelar</button>
                <button onclick="submitRubricAndGenerateReport('${evalId}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl shadow flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Generar Informe IA</span>
                </button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeEvalRubricModal() {
    const modal = document.getElementById('evalRubricModal');
    if (modal) modal.classList.add('hidden');
}

async function submitRubricAndGenerateReport(evalId) {
    const evaluation = APP_STATE.evaluations.find(e => e.id === evalId);
    if (!evaluation) return;

    const selectElements = document.querySelectorAll('.rubric-score');
    const rubricScores = Array.from(selectElements).map(sel => parseInt(sel.value));

    closeEvalRubricModal();

    // MOSTRAR PANTALLA DE CARGA
    let resultModal = document.getElementById('aiReportResultModal');
    if (!resultModal) {
        resultModal = document.createElement('div');
        resultModal.id = 'aiReportResultModal';
        resultModal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(resultModal);
    }

    resultModal.innerHTML = `
        <div class="bg-white w-full max-w-2xl rounded-3xl border-4 border-indigo-500 shadow-2xl p-6 space-y-4 my-6 text-center">
            <div class="text-4xl animate-spin">⚙️</div>
            <h3 class="text-xl font-black text-indigo-950">Generando Informe Pedagógico con IA...</h3>
            <p class="text-xs font-bold text-slate-500">Analizando el porcentaje de logro y redactando sugerencias para el estudiante.</p>
        </div>
    `;
    resultModal.classList.remove('hidden');

    const reportText = await generateAiPedagogicalReport(evaluation, rubricScores);

    resultModal.innerHTML = `
        <div class="bg-white w-full max-w-2xl rounded-3xl border-4 border-indigo-500 shadow-2xl p-6 space-y-4 my-6 text-left">
            <div class="flex justify-between items-center border-b pb-2">
                <h3 class="text-2xl font-black text-indigo-950 flex items-center gap-2">
                    🤖 Informe Pedagógico Generado
                </h3>
                <button onclick="closeAiReportResultModal()" class="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
${reportText}
            </div>

            <div class="flex gap-3 pt-2">
                <button onclick="navigator.clipboard.writeText(\`${reportText.replace(/`/g, "'")}\`); alert('¡Informe copiado al portapapeles!');" class="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 rounded-xl border-b-4 border-amber-600 shadow text-xs flex items-center justify-center gap-2">
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

<!-- MODAL DEL CANASTO DE COMPRAS Y PAGOS -->
<div id="basketModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-black text-slate-800 text-xl flex items-center gap-2">
                <span>🛒</span> <span>Canasto de Compras</span>
            </h3>
            <button onclick="closeBasketModal()" class="text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-xl">✕ Cerrar</button>
        </div>

        <!-- Lista de Productos Agregados -->
        <div id="basketItemsList" class="space-y-2 max-h-48 overflow-y-auto pr-1"></div>

        <!-- Resumen de Totales y Pago -->
        <div class="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 flex justify-between items-center font-black">
            <div>
                <span class="text-xs text-indigo-900 uppercase block">Total a Pagar:</span>
                <span id="basketTotalCLP" class="text-2xl text-emerald-700">$0</span>
            </div>
            <div>
                <span class="text-xs text-indigo-900 uppercase block">Dinero Entregado:</span>
                <span id="userPaidTotal" class="text-2xl text-indigo-900">$0</span>
            </div>
        </div>

        <!-- Guía Sugerida de Billetes -->
        <div>
            <label class="block text-xs font-black text-slate-600 uppercase mb-1">Billetes/Monedas Sugeridos para esta suma:</label>
            <div id="basketCurrencyBreakdown" class="flex flex-wrap gap-1"></div>
        </div>

        <!-- BANDEJA INTERACTIVA DE BILLETES Y MONEDAS -->
        <div>
            <label class="block text-xs font-black text-slate-800 uppercase mb-2">Haz clic en los billetes y monedas para pagar:</label>
            <div id="paymentMoneyTray" class="grid grid-cols-3 sm:grid-cols-5 gap-2"></div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex gap-2 pt-2 border-t">
            <button onclick="resetUserPayment()" class="w-1/3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black py-3 rounded-xl">🔄 Reiniciar Pago</button>
            <button onclick="verifyAndCheckout()" class="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl border-b-4 border-emerald-900 shadow text-lg">Pagar y Finalizar Compra</button>
        </div>
    </div>
</div>

<!-- MODAL DE COMPRA EXITOSA Y VUELTO -->
<div id="checkoutSuccessModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-center shadow-2xl">
        <div class="text-6xl">🎉</div>
        <h3 class="text-2xl font-black text-slate-800">¡Compra Completada!</h3>
        
        <div class="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2 text-xs font-bold">
            <div class="flex justify-between"><span>Total Compra:</span> <span id="successModalTotal" class="text-emerald-700 font-black">$0</span></div>
            <div class="flex justify-between"><span>Pagaste con:</span> <span id="successModalPaid" class="text-indigo-900 font-black">$0</span></div>
            <div class="flex justify-between text-sm border-t pt-2 font-black"><span>Tu Vuelto es:</span> <span id="successModalVueltoAmount" class="text-emerald-700 text-lg">$0</span></div>
        </div>

        <div>
            <label class="block text-xs font-black text-slate-600 uppercase mb-1">Desglose de tu Vuelto:</label>
            <div id="successModalVueltoBreakdown" class="flex flex-wrap justify-center gap-1"></div>
        </div>

        <button onclick="closeSuccessModalAndFinish()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl text-base shadow">Continuar Comprando</button>
    </div>
</div>

<!-- ACTUALIZA LA VERSIÓN DEL SCRIPT SCRIPT -->
<script src="app.js?v=90000"></script>

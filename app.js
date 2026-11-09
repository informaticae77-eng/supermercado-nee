/*
 * Bootstrap de compatibilidad para GitHub Pages.
 * La versión modular actual del repositorio no incluye todavía todos los
 * módulos de la aplicación (renderizado, docentes, catálogo y evaluación).
 * Cargamos la última implementación monolítica completa desde un commit
 * inmutable del mismo repositorio para evitar que la app quede en blanco.
 */
(function loadCompleteApplication() {
    'use strict';

    var APP_SCRIPT_URL = 'https://raw.githubusercontent.com/informaticae77-eng/supermercado-nee/d3bc3a9f8960babeff7f8520a0a457e4f9c11111/app.js';
    var script = document.createElement('script');
    script.src = APP_SCRIPT_URL;
    script.async = false;

    script.onload = function () {
        if (window.PRODUCT_STORE && typeof window.PRODUCT_STORE.getProducts === 'function') {
            var originalGetProducts = window.PRODUCT_STORE.getProducts;
            window.PRODUCT_STORE.getProducts = function () {
                try {
                    if (typeof APP_STATE !== 'undefined' && Array.isArray(APP_STATE.products)) {
                        return APP_STATE.products;
                    }
                } catch (error) {
                    // Fall through to the compatibility implementation.
                }
                return originalGetProducts();
            };
        }
    };

    script.onerror = function () {
        var container = document.getElementById('appContainer');
        if (!container) return;
        container.innerHTML = '<section role="alert" class="max-w-2xl mx-auto bg-white border-4 border-rose-400 rounded-3xl p-6 shadow-xl text-center"><h2 class="text-xl font-black text-rose-800">No se pudo cargar la aplicación</h2><p class="mt-3 text-sm font-bold text-slate-700">Revisa tu conexión a Internet y vuelve a cargar la página. Si el problema continúa, informa al administrador.</p><button type="button" onclick="window.location.reload()" class="mt-4 bg-indigo-600 text-white font-black px-5 py-3 rounded-xl">Volver a intentar</button></section>';
        console.error('No se pudo cargar la aplicación completa:', APP_SCRIPT_URL);
    };

    document.head.appendChild(script);
})();

// ==========================================
// RENDERIZADO DE CAPAS Y ANIMACIONES ESTACIONALES
// ==========================================
function renderThemeOverlay() {
    const container = document.getElementById('themeOverlayContainer');
    if (!container) return;

    const activeKey = (APP_STATE.settings && APP_STATE.settings.activeTheme) || 'standard';

    if (activeKey === 'halloween') {
        container.innerHTML = `
            <!-- Bruja Voladora cruzando el cielo de la app -->
            <div class="absolute top-8 left-0 animate-witch z-50 text-5xl sm:text-6xl drop-shadow-xl pointer-events-none">
                🧙‍♀️🧹
            </div>

            <!-- Arañas Caminando bajando por hilos de seda en varias posiciones -->
            <div class="absolute top-0 left-8 animate-spider-crawl text-3xl sm:text-4xl">
                <div class="w-0.5 h-32 bg-slate-600/40 mx-auto"></div>
                <div class="-mt-1">🕷️</div>
            </div>
            <div class="absolute top-0 right-16 animate-spider-crawl-fast text-4xl sm:text-5xl">
                <div class="w-0.5 h-44 bg-slate-600/40 mx-auto"></div>
                <div class="-mt-1">🕷️</div>
            </div>
            <div class="absolute top-0 left-1/3 animate-spider-crawl text-3xl">
                <div class="w-0.5 h-24 bg-slate-600/40 mx-auto"></div>
                <div class="-mt-1">🕷️</div>
            </div>

            <!-- Zombie Caminante en la esquina inferior izquierda -->
            <div class="absolute bottom-3 left-4 animate-zombie z-40 flex items-center gap-2">
                <div class="text-6xl sm:text-7xl">🧟‍♂️</div>
                <div class="bg-purple-900 text-amber-300 border-2 border-purple-400 text-[10px] font-black px-2 py-1 rounded-xl shadow-lg">
                    ¡Cuidado en la góndola! 🎃
                </div>
            </div>

            <!-- Olla y Caldero de Pociones de Bruja Hirviendo (Esquina Inferior Derecha) -->
            <div class="absolute bottom-2 right-4 z-40 flex flex-col items-center">
                <!-- Burbujas de poción hirviendo subiendo -->
                <div class="flex gap-2 mb-[-12px] relative z-10">
                    <span class="text-base font-bold bubble-1">🟢</span>
                    <span class="text-xs font-bold bubble-2">🟣</span>
                    <span class="text-sm font-bold bubble-3">✨</span>
                </div>

                <!-- Caldero Mágico Brillante -->
                <div class="text-6xl sm:text-7xl animate-cauldron">
                    🫕
                </div>
            </div>

            <!-- Murciélagos y Fantasmas Flotantes -->
            <div class="absolute top-1/4 right-8 text-3xl animate-bounce">🦇</div>
            <div class="absolute top-1/2 left-6 text-3xl animate-pulse">👻</div>
        `;
    } else if (activeKey === 'navidad' || activeKey === 'invierno') {
        // Lluvia Continua de Nieve Cayendo por Toda laPantalla
        const snowCount = 18;
        let snowHtml = '';
        for (let i = 0; i < snowCount; i++) {
            const leftPos = Math.floor(Math.random() * 95);
            const duration = (3.5 + Math.random() * 4).toFixed(1);
            const delay = (Math.random() * 5).toFixed(1);
            const size = (14 + Math.random() * 18).toFixed(0);
            snowHtml += `<span class="animate-snowflake" style="left: ${leftPos}vw; animation-duration: ${duration}s; animation-delay: ${delay}s; font-size: ${size}px;">❄️</span>`;
        }

        const iconCorner = activeKey === 'navidad' ? '🎅' : '☕';
        const iconOther = activeKey === 'navidad' ? '🎄' : '❄️';

        container.innerHTML = `
            ${snowHtml}
            <div class="absolute top-2 left-2 text-4xl sm:text-5xl animate-bounce">${iconOther}</div>
            <div class="absolute bottom-3 right-3 text-5xl sm:text-6xl">${iconCorner}</div>
        `;
    } else if (activeKey === 'semana_santa') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-4xl animate-bounce">🐰</div>
            <div class="absolute bottom-2 right-2 text-4xl sm:text-5xl flex gap-1">
                <span>🥚</span><span>🍫</span>
            </div>
        `;
    } else if (activeKey === 'fiestas_patrias') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-5xl animate-spider-crawl">🪁</div>
            <div class="absolute bottom-2 right-2 text-5xl">🇨🇱</div>
        `;
    } else if (activeKey === 'mes_nino') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-5xl animate-bounce">🎈</div>
            <div class="absolute bottom-2 right-2 text-5xl">🧸</div>
        `;
    } else if (activeKey === 'verano') {
        container.innerHTML = `
            <div class="absolute top-2 left-2 text-6xl animate-spin" style="animation-duration: 15s;">☀️</div>
            <div class="absolute bottom-2 right-2 text-5xl">🍦</div>
        `;
    } else {
        container.innerHTML = '';
    }
}

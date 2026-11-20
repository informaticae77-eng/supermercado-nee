const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createMascot(audioSupported = true) {
    const notes = [];
    const timers = new Map();
    let nextTimerId = 1;
    const window = {};

    if (audioSupported) {
        window.AudioContext = class {
            constructor() {
                this.state = 'suspended';
                this.currentTime = 0;
                this.destination = {};
            }

            resume() {
                this.state = 'running';
                return Promise.resolve();
            }

            suspend() {
                this.state = 'suspended';
                return Promise.resolve();
            }

            createOscillator() {
                return {
                    frequency: { setValueAtTime() {} },
                    connect() {},
                    start() { notes.push('played'); },
                    stop() {}
                };
            }

            createGain() {
                return {
                    gain: {
                        setValueAtTime() {},
                        exponentialRampToValueAtTime() {}
                    },
                    connect() {}
                };
            }
        };
    }

    const context = vm.createContext({
        window,
        document: {
            readyState: 'loading',
            addEventListener() {},
            querySelectorAll() { return []; }
        },
        localStorage: { getItem() { return null; } },
        console,
        setInterval(callback, delay) {
            const id = nextTimerId++;
            timers.set(id, { callback, delay });
            return id;
        },
        clearInterval(id) { timers.delete(id); }
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8'), context);
    return { context, notes, timers };
}

test('mascot offers animated faces and updates its selected expression', () => {
    const { context } = createMascot();
    const markup = context.renderMascotCompanion();

    for (const mood of ['Feliz', 'Con hambre', 'Enfermo', 'Triste', 'Enojado']) {
        assert.match(markup, new RegExp(mood));
    }
    assert.match(markup, /Activar música/);
    assert.equal(vm.runInContext('APP_STATE.settings.activeTheme', context), 'standard');

    const home = { innerHTML: '' };
    const store = { innerHTML: '' };
    context.renderHomeView(home);
    context.renderSupermarketView(store, 'sup-1');
    assert.match(home.innerHTML, /data-mascot-companion/);
    assert.match(store.innerHTML, /data-mascot-companion/);

    context.setMascotMood('angry');
    assert.equal(vm.runInContext('APP_STATE.mascotMood', context), 'angry');
    assert.match(context.renderMascotCompanion(), /¡Oye, estoy molesto!/);
});

test('background music starts only on request and can be paused', async () => {
    const { context, notes, timers } = createMascot();
    assert.equal(vm.runInContext('backgroundMusicEnabled', context), false);
    assert.equal(notes.length, 0);

    await context.toggleBackgroundMusic();
    assert.equal(vm.runInContext('backgroundMusicEnabled', context), true);
    assert.equal(notes.length, 1);
    assert.equal(timers.size, 1);

    context.stopBackgroundMusic();
    assert.equal(vm.runInContext('backgroundMusicEnabled', context), false);
    assert.equal(timers.size, 0);
});

test('music control is disabled when browser audio is unavailable', () => {
    const { context } = createMascot(false);
    assert.match(context.renderMascotCompanion(), /disabled/);
    assert.match(context.renderMascotCompanion(), /Música no disponible/);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createArcade() {
    const stored = new Map([['nee_arcade_progress_v36', JSON.stringify({
        currentLevel: 1, unlockedLevels: [1], completedGames: { level1: ['mj1', 'mj2', 'mj3', 'mj4', 'mj5'] }
    })]]);
    const elements = new Map([['appContainer', { innerHTML: '' }], ['bossFeedback', { textContent: '' }]]);
    const writes = [];
    const alerts = [];
    const app = {
        currentUser: { id: 'student-1', name: 'Alumno', role: 'student' },
        teacherPreviewMode: false,
        products: [
            { id: 'p1', name: 'Leche', category: 'Lácteos', price: 1000 },
            { id: 'p2', name: 'Pan', category: 'Panadería', price: 500 }
        ],
        categories: [{ name: 'Lácteos' }, { name: 'Panadería' }],
        customCurrencies: { b1: 'data:image/png;base64,ORIGINAL' }
    };
    const document = {
        getElementById: id => elements.get(id) || null,
        createElement: () => ({ style: {}, innerHTML: '' }),
        body: { appendChild: element => elements.set(element.id, element) },
        querySelector: () => null
    };
    const context = vm.createContext({
        window: { speechSynthesis: { cancel() {} }, setInterval() { return 1; }, clearInterval() {} },
        document, APP_STATE: app, console,
        localStorage: { getItem: key => stored.get(key) || null, setItem: (key, value) => stored.set(key, value) },
        CLP_CURRENCY_ITEMS: [
            { id: 'b1', value: 1000, type: 'bill', img: 'default' },
            { id: 'c1', value: 500, type: 'coin', img: 'coin' }
        ],
        db: { collection: name => ({ add: data => { writes.push({ name, data }); return Promise.resolve(); } }) },
        alert: message => alerts.push(message),
        speakText() {},
        awardPointsAndXp() {},
        renderApp() {}
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../games.js'), 'utf8'), context);
    return { context, elements, stored, writes, alerts, app };
}

test('completing a minigame returns to the challenge center', () => {
    const { context, elements, app } = createArcade();
    context.openMinigamesArcade();
    context.startMinigame1();
    for (let i = 0; i < 2; i++) {
        context.answerCategory(vm.runInContext('gameState.questions[gameState.currentQuestion].category', context));
    }
    assert.equal(app.arcadeActive, true);
    assert.match(elements.get('appContainer').innerHTML, /CENTRO DE DESAFÍOS/);
    assert.equal(elements.get('nee-game-modal-overlay').style.display, 'none');
});

test('boss measures five skills, allows retries and saves results', () => {
    const { context, elements, writes, stored } = createArcade();
    context.openMinigamesArcade();
    context.startBossExam(1);
    assert.match(elements.get('nee-game-modal-overlay').innerHTML, /Etapa 1 de 5/);
    context.answerCategory('Categoría incorrecta');
    context.repeatGameHelp();
    context.answerCategory(vm.runInContext('gameState.questions[0].category', context));
    context.answerGeneric(vm.runInContext('gameState.questions[0].value', context), vm.runInContext('gameState.questions[0].value', context), 'mj2');
    context.answerGeneric(vm.runInContext('gameState.questions[0].name', context), vm.runInContext('gameState.questions[0].name', context), 'mj3');
    const total = vm.runInContext('gameState.questions[0].price + gameState.questions[1].price', context);
    context.answerGeneric(total, total, 'mj4');
    context.answerGeneric(vm.runInContext('gameState.questions[0].id', context), vm.runInContext('gameState.questions[0].id', context), 'mj5');
    assert.equal(writes.length, 1);
    assert.equal(writes[0].name, 'evaluations');
    const result = writes[0].data;
    assert.equal(result.type, 'boss');
    assert.equal(result.studentId, 'student-1');
    assert.equal(result.level, 1);
    assert.equal(result.firstAttemptCorrect, 4);
    assert.equal(result.errors, 1);
    assert.equal(result.repeatedHelp, 1);
    assert.equal(result.stages.length, 5);
    assert.equal(result.stages[0].errors, 1);
    assert.equal(result.stages[0].firstAttemptCorrect, false);
    assert.equal(result.stages[0].repeatedHelp, 1);
    assert.ok(JSON.parse(stored.get('nee_arcade_progress_v36')).unlockedLevels.includes(2));
    assert.match(elements.get('appContainer').innerHTML, /CENTRO DE DESAFÍOS/);
});

test('abandoning a boss and teacher preview do not create student evaluations', () => {
    const { context, writes, stored, app } = createArcade();
    context.openMinigamesArcade();
    context.startBossExam(1);
    context.answerBossStage(true);
    context.exitGameQuestion();
    assert.equal(writes.length, 0);
    assert.deepEqual(JSON.parse(stored.get('nee_arcade_progress_v36')).unlockedLevels, [1]);
    app.teacherPreviewMode = true;
    context.startBossExam(1);
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    assert.equal(writes.length, 0);
});

test('a failed evaluation write is reported to the student', async () => {
    const { context, alerts } = createArcade();
    context.db.collection = () => ({ add: () => Promise.reject(new Error('sin conexión')) });
    context.openMinigamesArcade();
    context.startBossExam(1);
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    await new Promise(resolve => setImmediate(resolve));
    assert.ok(alerts.some(message => message.includes('No se pudo guardar la evaluación')));
});

test('boss uses its starting catalog even if the live catalog changes', () => {
    const { context, app, writes } = createArcade();
    context.openMinigamesArcade();
    context.startBossExam(1);
    app.products = [];
    app.categories = [];
    app.customCurrencies = {};
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].data.stages.length, 5);
});

test('level 1 reward unlocks only after the boss and remains available to that student', () => {
    const { context, elements, stored, app, alerts } = createArcade();
    context.openMinigamesArcade();
    context.openPetGame();
    assert.ok(alerts.some(message => message.includes('completa el desafío final')));
    assert.equal(stored.has('nee_pet_level1_v1_student_student-1'), false);

    context.startBossExam(1);
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    assert.match(elements.get('nee-game-modal-overlay').innerHTML, /Mi mascota/);
    assert.ok(stored.has('nee_pet_level1_v1_student_student-1'));
    context.closeGameOverlay();
    context.switchLevel(1);
    assert.match(elements.get('appContainer').innerHTML, /Abrir premio del nivel 1/);
    context.openPetGame();
    assert.match(elements.get('nee-game-modal-overlay').innerHTML, /Mi mascota/);

    context.closeGameOverlay();
    app.currentUser.id = 'student-2';
    context.openPetGame();
    assert.equal(elements.get('nee-game-modal-overlay').style.display, 'none');
});

test('pet needs decay while away, sickness requires care, and actions persist', () => {
    const { context, elements, stored } = createArcade();
    context.openMinigamesArcade();
    context.startBossExam(1);
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    context.closeGameOverlay();
    const key = 'nee_pet_level1_v1_student_student-1';
    const pet = JSON.parse(stored.get(key));
    pet.updatedAt -= 20 * 3600000;
    stored.set(key, JSON.stringify(pet));

    context.openPetGame();
    assert.equal(JSON.parse(stored.get(key)).sick, true);
    context.careForPet('heal');
    assert.match(elements.get('nee-game-modal-overlay').innerHTML, /Primero dale comida y agua/);
    context.careForPet('food');
    context.careForPet('food');
    context.careForPet('water');
    context.careForPet('water');
    context.careForPet('fun');
    context.careForPet('heal');
    const recovered = JSON.parse(stored.get(key));
    assert.equal(recovered.sick, false);
    assert.ok(recovered.food >= 40 && recovered.water >= 40 && recovered.fun > 0);
    assert.match(elements.get('nee-game-modal-overlay').innerHTML, /se ha recuperado/);
});

test('other levels and teacher preview do not unlock a student pet', () => {
    const { context, stored, app } = createArcade();
    stored.set('nee_arcade_progress_v36', JSON.stringify({
        currentLevel: 2, unlockedLevels: [1, 2], completedGames: { level2: ['mj1', 'mj2', 'mj3', 'mj4', 'mj5'] }
    }));
    context.openMinigamesArcade();
    context.startBossExam(2);
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    assert.equal(stored.has('nee_pet_level1_v1_student_student-1'), false);
    stored.set('nee_arcade_progress_v36', JSON.stringify({
        currentLevel: 1, unlockedLevels: [1, 2], completedGames: { level1: ['mj1', 'mj2', 'mj3', 'mj4', 'mj5'] }
    }));
    app.teacherPreviewMode = true;
    context.startBossExam(1);
    for (let i = 0; i < 5; i++) context.answerBossStage(true);
    assert.equal(stored.has('nee_pet_level1_v1_student_student-1'), false);
    assert.ok(stored.has('nee_pet_level1_v1_preview_student-1'));
});

test('app rerenders preserve the arcade and the teacher can inspect metrics', () => {
    const container = { innerHTML: '' };
    const context = vm.createContext({
        window: {},
        document: { readyState: 'loading', addEventListener() {}, getElementById: id => id === 'appContainer' ? container : null },
        localStorage: { getItem() { return null; } },
        console,
        renderMinigamesArcadeView() { container.innerHTML = 'CENTRO DE DESAFÍOS'; }
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8'), context);
    vm.runInContext(`
        APP_STATE.currentUser = { id: 'student', role: 'student', name: 'Alumno' };
        APP_STATE.arcadeActive = true;
        renderThemeOverlay = () => {};
        updateBasketBadge = () => {};
        renderApp();
    `, context);
    assert.match(container.innerHTML, /CENTRO DE DESAFÍOS/);
    const report = vm.runInContext(`
        APP_STATE.bossEvaluations = [{
            studentName: 'Alumno', level: 1, date: '2026-01-01T00:00:00.000Z',
            firstAttemptCorrect: 4, errors: 1, timeSeconds: 30, repeatedHelp: 2,
            stages: [{ label: 'Categorías', firstAttemptCorrect: false, errors: 1, timeSeconds: 10, repeatedHelp: 2 }]
        }];
        renderTeacherHomeTab();
    `, context);
    assert.match(report, /Alumno/);
    assert.match(report, /Primer intento: 4 de 5/);
    assert.match(report, /Categorías/);
    assert.match(report, /Solicitudes de ayuda: 2/);
});

test('Firestore evaluation snapshots separate boss results from purchase reports', () => {
    const listeners = {};
    const database = {
        collection(name) {
            return {
                onSnapshot: (success, failure) => { listeners[name] = { success, failure }; },
                doc: () => ({ onSnapshot() {} })
            };
        }
    };
    const firestore = () => database;
    const context = vm.createContext({
        window: {},
        document: { readyState: 'loading', addEventListener() {} },
        localStorage: { getItem() { return null; } },
        firebase: { apps: [{}], firestore },
        console
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8'), context);
    vm.runInContext('renderApp = () => {}; initFirebaseListeners();', context);
    listeners.evaluations.success({ docs: [
        { id: 'purchase', data: () => ({ studentName: 'Alumno' }) },
        { id: 'boss', data: () => ({ type: 'boss', studentName: 'Alumno' }) }
    ] });
    assert.equal(vm.runInContext('APP_STATE.evaluations.length', context), 1);
    assert.equal(vm.runInContext('APP_STATE.bossEvaluations.length', context), 1);
    listeners.evaluations.success({ docs: [] });
    assert.equal(vm.runInContext('APP_STATE.bossEvaluations.length', context), 0);
});

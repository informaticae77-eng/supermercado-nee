const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createUserManagement() {
    const elements = new Map();
    const makeClassList = () => ({
        toggle() {},
        add() {},
        remove() {}
    });
    const courseSelect = {
        options: [],
        value: '',
        classList: makeClassList(),
        set innerHTML(value) {
            this.options = [];
        },
        appendChild(option) {
            this.options.push(option);
        }
    };
    for (const id of ['modalUserId', 'modalUserRole', 'modalName', 'modalRut', 'modalEmail']) {
        elements.set(id, { value: '' });
    }
    elements.set('modalUserCourse', courseSelect);
    elements.set('modalUserCourseField', { classList: makeClassList() });
    elements.set('modalUserCourseEmpty', { classList: makeClassList() });
    elements.set('userModal', { classList: makeClassList() });

    const context = vm.createContext({
        window: {},
        document: {
            readyState: 'loading',
            addEventListener() {},
            getElementById: id => elements.get(id) || null,
            createElement: () => ({})
        },
        localStorage: { getItem() { return null; } },
        console,
        alert() {}
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8'), context);
    context.renderApp = () => {};
    return { context, elements, courseSelect };
}

test('student form offers courses and saves the selected course', () => {
    const { context, elements, courseSelect } = createUserManagement();
    context.courses = [
        { id: 'course-a', name: 'Primero A' },
        { id: 'course-b', name: 'Primero B' }
    ];
    vm.runInContext('APP_STATE.courses = courses', context);

    context.openCreateUserModal('student');
    assert.deepEqual(courseSelect.options.map(option => [option.value, option.textContent]), [
        ['course-a', 'Primero A'],
        ['course-b', 'Primero B']
    ]);

    elements.get('modalName').value = 'Ana';
    elements.get('modalRut').value = '12345678-9';
    courseSelect.value = 'course-b';
    context.saveUserFromModal();

    assert.equal(vm.runInContext('APP_STATE.users.at(-1).courseId', context), 'course-b');
});

test('student list can be filtered by course and shows unassigned students', () => {
    const { context } = createUserManagement();
    context.courses = [{ id: 'course-a', name: 'Primero A' }];
    context.users = [
        { id: 'student-a', role: 'student', name: 'Ana', courseId: 'course-a' },
        { id: 'student-b', role: 'student', name: 'Beto' },
        { id: 'teacher-a', role: 'teacher', name: 'Docente' }
    ];
    vm.runInContext('APP_STATE.courses = courses; APP_STATE.users = users', context);

    const courseList = context.renderUserRoleList('student', 'course-a');
    assert.match(courseList, /Ana/);
    assert.match(courseList, /Curso: Primero A/);
    assert.doesNotMatch(courseList, /Beto|Docente/);

    const unassignedList = context.renderUserRoleList('student', 'none');
    assert.match(unassignedList, /Beto/);
    assert.match(unassignedList, /Sin curso asignado/);
    assert.doesNotMatch(unassignedList, /Ana|Docente/);
});

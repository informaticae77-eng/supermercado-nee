import { db, EMAILJS_CONFIG } from '../config.js';
import { APP_STATE } from '../state.js';

export function sendAutomaticCredentialsEmail(user) {
    if (!user || !user.email) return;
    if (typeof emailjs !== 'undefined') {
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                to_email: user.email,
                to_name: user.name,
                user_rut: user.rut,
                user_pin: user.pin,
                app_url: window.location.href
            },
            EMAILJS_CONFIG.publicKey
        ).catch(err => console.error("Error EmailJS:", err));
    }
}

export function renderAdminDashboard(container) {
    let html = `
        <div class="space-y-6">
            <div class="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 class="text-2xl font-black">👑 Panel de Administración de Usuarios</h2>
                    <p class="text-xs text-indigo-200 mt-1">Gestión integral de Cursos, Educadores, Alumnos y Claves de Acceso.</p>
                </div>
                <div class="bg-indigo-800 px-3 py-1.5 rounded-xl border border-indigo-700 flex items-center gap-2">
                    <label class="text-xs font-bold uppercase text-indigo-200">Filtrar:</label>
                    <select id="adminCourseFilter" onchange="window.filterAdminByCourse(this.value)" class="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-lg">
                        <option value="all" ${APP_STATE.adminCourseFilter === 'all' ? 'selected' : ''}>Todos los Cursos</option>
                        ${APP_STATE.courses.map(c => `<option value="${c.id}" ${APP_STATE.adminCourseFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Cursos -->
                <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-school text-indigo-600"></i> Cursos</h3>
                        <button onclick="window.addNewCoursePrompt()" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Curso</button>
                    </div>
                    <div class="space-y-2">
                        ${APP_STATE.courses.map(c => `
                            <div class="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-sm font-bold">
                                <span>${c.name}</span>
                                <button onclick="window.deleteCourse('${c.id}')" class="text-rose-600 text-xs">Eliminar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Educadores -->
                <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-chalkboard-user text-indigo-600"></i> Educadores</h3>
                        <button onclick="window.openCreateUserModal('teacher')" class="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Educador</button>
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                        ${renderUserList('teacher')}
                    </div>
                </div>

                <!-- Alumnos -->
                <div class="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow space-y-4">
                    <div class="flex justify-between items-center border-b pb-2">
                        <h3 class="font-black text-slate-800 flex items-center gap-2"><i class="fa-solid fa-children text-indigo-600"></i> Alumnos</h3>
                        <button onclick="window.openCreateUserModal('student')" class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">+ Alumno</button>
                    </div>
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                        ${renderUserList('student')}
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderUserList(role) {
    let users = APP_STATE.users.filter(u => u.role === role);
    if (APP_STATE.adminCourseFilter !== 'all') {
        users = users.filter(u => u.courseId === APP_STATE.adminCourseFilter || (u.courseIds && u.courseIds.includes(APP_STATE.adminCourseFilter)));
    }
    if (users.length === 0) return `<p class="text-xs text-slate-400 italic">No hay registros.</p>`;

    return users.map(u => `
        <div class="p-3 bg-slate-50 border rounded-xl space-y-2 text-xs">
            <div class="flex justify-between items-center font-black">
                <span class="text-indigo-950">${u.name}</span>
                <div class="space-x-1">
                    <button onclick="window.openEditUserModal('${u.id}')" class="text-amber-600">✏️</button>
                    <button onclick="window.deleteUser('${u.id}')" class="text-rose-600">✕</button>
                </div>
            </div>
            <div class="text-[11px] text-slate-600">
                <div>RUT: <b>${u.rut}</b> | Clave: <code class="bg-slate-200 px-1 font-bold">${u.pin}</code></div>
                <div>📧 ${u.email || 'Sin correo'}</div>
            </div>
            <div class="flex gap-1 pt-1">
                <button onclick="window.resetUserPassword('${u.id}')" class="bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded w-full">🔄 Reset Clave</button>
                <button onclick="window.sendAutomaticCredentialsEmail(APP_STATE.users.find(x=>x.id==='${u.id}'))" class="bg-sky-100 text-sky-900 font-bold px-2 py-1 rounded w-full">✉️ Enviar Correo</button>
            </div>
        </div>
    `).join('');
}

window.filterAdminByCourse = (cId) => { APP_STATE.adminCourseFilter = cId; renderAdminDashboard(document.getElementById('appContainer')); };
window.resetUserPassword = (uId) => {
    const user = APP_STATE.users.find(u => u.id === uId);
    if (!user) return;
    const initialPin = user.rut.replace(/[^0-9]/g, '').substring(0, 4) || '1234';
    db.collection('users').doc(uId).update({ pin: initialPin, mustChangePassword: true }).then(() => {
        user.pin = initialPin;
        sendAutomaticCredentialsEmail(user);
        alert(`🔒 Clave de ${user.name} reiniciada a: ${initialPin}`);
    });
};
window.deleteUser = (uId) => { if (confirm("¿Eliminar usuario del sistema?")) db.collection('users').doc(uId).delete(); };
window.sendAutomaticCredentialsEmail = sendAutomaticCredentialsEmail;
window.addNewCoursePrompt = () => {
    const name = prompt("Nombre del nuevo curso:");
    if (!name) return;
    const newId = 'c-' + Date.now();
    db.collection('courses').doc(newId).set({ id: newId, name });
};
window.deleteCourse = (id) => { if (confirm("¿Eliminar este curso?")) db.collection('courses').doc(id).delete(); };

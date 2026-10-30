import { db } from '../config.js';
import { APP_STATE } from '../state.js';

export function updateCategoryDropdowns(selectedCategoryName = null) {
    const catSelect = document.getElementById('modalProdCategory');
    if (!catSelect) return;
    const categoriesList = APP_STATE.categories || [];
    if (categoriesList.length === 0) {
        catSelect.innerHTML = `<option value="General">🏷️ General</option>`;
    } else {
        catSelect.innerHTML = categoriesList.map(c => 
            `<option value="${c.name}" ${selectedCategoryName === c.name ? 'selected' : ''}>${c.icon || '🏷️'} ${c.name}</option>`
        ).join('');
    }
}

export function openCategoryModal(catId = null) {
    if (catId) {
        const cat = (APP_STATE.categories || []).find(c => c.id === catId);
        if (cat) {
            document.getElementById('modalCatId').value = cat.id;
            document.getElementById('modalCatName').value = cat.name || '';
            document.getElementById('modalCatIcon').value = cat.icon || '🏷️';
        }
    } else {
        document.getElementById('modalCatId').value = '';
        document.getElementById('modalCatName').value = '';
        document.getElementById('modalCatIcon').value = '🏷️';
    }
    document.getElementById('categoryModal').classList.remove('hidden');
}

export function saveCategoryFromModal() {
    const catId = document.getElementById('modalCatId').value;
    const name = document.getElementById('modalCatName').value.trim();
    const icon = document.getElementById('modalCatIcon').value.trim() || '🏷️';

    if (!name) return alert("Ingresa un nombre para la categoría.");
    const id = catId || ('cat-' + Date.now());
    const data = { id, name, icon };

    db.collection('categories').doc(id).set(data).then(() => {
        window.closeCategoryModal();
        updateCategoryDropdowns(name);
        alert(`✅ Categoría "${name}" guardada con éxito.`);
    }).catch(err => alert("Error al guardar categoría: " + err.message));
}

window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = () => document.getElementById('categoryModal').classList.add('hidden');
window.saveCategoryFromModal = saveCategoryFromModal;
window.selectCategoryIconEmoji = (emoji) => { document.getElementById('modalCatIcon').value = emoji; };

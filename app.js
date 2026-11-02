async function deleteAllProducts(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!confirm("⚠️ ¿Deseas eliminar TODOS los productos del catálogo de Firebase?")) return;

    if (!db) {
        APP_STATE.products = [];
        renderApp();
        return;
    }

    try {
        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            APP_STATE.products = [];
            renderApp();
            return;
        }

        // Elimina cada documento individualmente para evitar fallos por límites de lote
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        APP_STATE.products = [];
        renderApp();
        alert("🗑️ Catálogo vaciado correctamente.");
    } catch (err) {
        alert("Error al eliminar productos: " + err.message);
    }
}

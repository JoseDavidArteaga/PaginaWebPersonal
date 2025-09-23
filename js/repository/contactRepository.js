// Este objeto interactúa directamente con localStorage
class ContactRepository {
    constructor() {
        this.storageKey = 'contactos';
    }

    _loadData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    _saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getAll() {
        return this._loadData();
    }

    getById(id) {
        const contactos = this.getAll();
        return contactos.find(c => c.id === id);
    }

    add(contacto) {
        const contactos = this.getAll();
        contacto.id = Date.now(); // Genera un ID único
        contacto.fechaCreacion = new Date().toISOString();
        contacto.fechaActualizacion = contacto.fechaCreacion;
        contactos.push(contacto);
        this._saveData(contactos);
        return contacto;
    }

    update(contacto) {
        const contactos = this.getAll();
        const index = contactos.findIndex(c => c.id === contacto.id);
        if (index !== -1) {
            contacto.fechaActualizacion = new Date().toISOString();
            contactos[index] = contacto;
            this._saveData(contactos);
            return true;
        }
        return false;
    }

    remove(id) {
        const contactos = this.getAll();
        const filteredContactos = contactos.filter(c => c.id !== id);
        this._saveData(filteredContactos);
    }

    clear() {
        localStorage.removeItem(this.storageKey);
    }
}
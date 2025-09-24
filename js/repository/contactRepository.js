// --- Repositorio de Contactos ---
// Esta clase maneja directamente el acceso a los datos en localStorage.
// Su función es encapsular todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar),
// de manera que la lógica de almacenamiento quede separada del resto de la aplicación.

class ContactRepository {
    constructor() {
        // Clave usada en localStorage para guardar todos los contactos
        this.storageKey = 'contactos';
    }

    // --- Carga de datos ---
    // Recupera los contactos almacenados en localStorage.
    // Si no existen datos, devuelve un arreglo vacío.
    _loadData() {
        const data = localStorage.getItem(this.storageKey); // Obtiene la cadena JSON almacenada
        return data ? JSON.parse(data) : []; // Convierte la cadena en objeto JS o devuelve []
    }

    // --- Guardar datos ---
    // Persiste la lista de contactos en localStorage.
    // Convierte el arreglo de objetos a formato JSON antes de guardarlo.
    _saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // --- Obtener todos los contactos ---
    // Devuelve un arreglo con todos los contactos.
    getAll() {
        return this._loadData();
    }

    // --- Obtener contacto por ID ---
    // Busca y devuelve un contacto específico según su ID.
    getById(id) {
        const contactos = this.getAll();
        return contactos.find(c => c.id === id);
    }

    // --- Agregar contacto ---
    // Crea un nuevo contacto asignándole un ID único (usando timestamp).
    // También guarda fecha de creación y última actualización.
    add(contacto) {
        const contactos = this.getAll();
        contacto.id = Date.now(); // ID único basado en el tiempo
        contacto.fechaCreacion = new Date().toISOString();
        contacto.fechaActualizacion = contacto.fechaCreacion;
        contactos.push(contacto);
        this._saveData(contactos);
        return contacto;
    }

    // --- Actualizar contacto ---
    // Busca un contacto por su ID y reemplaza sus datos.
    // También actualiza la fecha de última modificación.
    update(contacto) {
        const contactos = this.getAll();
        const index = contactos.findIndex(c => c.id === contacto.id);
        if (index !== -1) {
            contacto.fechaActualizacion = new Date().toISOString();
            contactos[index] = contacto;
            this._saveData(contactos);
            return true;
        }
        return false; // Devuelve false si no se encontró el contacto
    }

    // --- Eliminar contacto ---
    // Filtra el arreglo de contactos y elimina el que coincida con el ID.
    remove(id) {
        const contactos = this.getAll();
        const filteredContactos = contactos.filter(c => c.id !== id);
        this._saveData(filteredContactos);
    }

    // --- Borrar todos los contactos ---
    // Elimina completamente la clave del almacenamiento local.
    clear() {
        localStorage.removeItem(this.storageKey);
    }
}

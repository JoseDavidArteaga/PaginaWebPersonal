// --- Fachada de Contactos ---
// Esta clase actúa como una "fachada" que simplifica el acceso a la lógica de negocio
// Sirve de intermediario entre la interfaz de usuario (UI) y el repositorio de datos.
// En lugar de interactuar directamente con el repositorio, la UI llama a métodos de esta fachada.

class ContactFacade {
    constructor(repository) {
        // Recibe un repositorio de contactos (inyección de dependencia).
        // Así desacoplamos la lógica de negocio de la interfaz.
        this.repository = repository;
    }

    // --- Guardar contacto ---
    // Si el contacto incluye un ID, significa que se está editando uno existente.
    // Si no tiene ID, se crea uno nuevo en el repositorio.
    guardarContacto(datosFormulario) {
        const contacto = new Contacto(datosFormulario);

        if (contacto.id) {
            // Caso: actualización de un contacto existente
            const existingContact = this.repository.getById(contacto.id);
            if (existingContact) {
                // Combina datos nuevos con los existentes y actualiza en el repositorio
                Object.assign(existingContact, contacto);
                this.repository.update(existingContact);
            }
        } else {
            // Caso: creación de un nuevo contacto
            this.repository.add(contacto);
        }
    }

    // --- Listar contactos ---
    // Devuelve todos los contactos guardados en el repositorio.
    listarContactos() {
        return this.repository.getAll();
    }

    // --- Eliminar contacto ---
    // Borra un contacto específico usando su ID.
    eliminarContacto(id) {
        this.repository.remove(id);
    }

    // --- Borrar todos los contactos ---
    // Vacía por completo el repositorio.
    borrarTodo() {
        this.repository.clear();
    }
}

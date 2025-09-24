// Este objeto simplifica el acceso a la lógica de negocio
class ContactFacade {
    constructor(repository) {
        this.repository = repository;
    }

    guardarContacto(datosFormulario) {
        const contacto = new Contacto(datosFormulario);

        if (contacto.id) {
            // Actualizar contacto existente
            const existingContact = this.repository.getById(contacto.id);
            if (existingContact) {
                Object.assign(existingContact, contacto);
                this.repository.update(existingContact);
            }
        } else {
            // Agregar nuevo contacto
            this.repository.add(contacto);
        }
    }

    listarContactos() {
        return this.repository.getAll();
    }

    eliminarContacto(id) {
        this.repository.remove(id);
    }

    borrarTodo() {
        this.repository.clear();
    }
}
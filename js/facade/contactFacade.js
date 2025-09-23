// Este objeto simplifica el acceso a la lógica de negocio
class ContactFacade {
    constructor(repository) {
        this.repository = repository;
    }

    guardarContacto(datosFormulario) {
        const contacto = {
            id: datosFormulario.id || null, // Para actualizar o agregar
            nombre: datosFormulario.nombre,
            email: datosFormulario.email,
            telefono: datosFormulario.telefono,
            motivo: datosFormulario.motivo,
            mensaje: datosFormulario.mensaje,
            aceptaTerminos: datosFormulario.aceptaTerminos,
            preferenciaContacto: datosFormulario.preferenciaContacto,
        };

        if (contacto.id) {
            // Lógica para actualizar (opcional, si decides añadir la funcionalidad)
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
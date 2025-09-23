document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Repositorio y Fachada ---
    const contactRepository = new ContactRepository();
    const contactFacade = new ContactFacade(contactRepository);

    // --- Referencias del DOM ---
    const formulario = document.getElementById('formulario-contacto');
    const contactosLista = document.getElementById('contactos-lista');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // --- Funciones de la Interfaz ---
    function renderContactos() {
        const contactos = contactFacade.listarContactos();
        contactosLista.innerHTML = ''; // Limpia la lista antes de renderizar

        if (contactos.length === 0) {
            contactosLista.innerHTML = '<p class="no-contactos">No hay contactos guardados.</p>';
        } else {
            contactos.forEach(contacto => {
                const li = document.createElement('li');
                li.className = 'contact-item';
                li.innerHTML = `
                    <div>
                        <strong>${contacto.nombre}</strong><br>
                        <small>Email: ${contacto.email}</small>
                    </div>
                    <button class="delete-btn" data-id="${contacto.id}">Eliminar</button>
                `;
                contactosLista.appendChild(li);
            });
        }
    }

    function mostrarMensaje(tipo, mensaje) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `alert alert-${tipo}`;
        mensajeDiv.textContent = mensaje;
        formulario.prepend(mensajeDiv);
        setTimeout(() => mensajeDiv.remove(), 3000);
    }

    // --- Manejadores de Eventos ---
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        const datosFormulario = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            motivo: document.getElementById('motivo').value,
            mensaje: document.getElementById('mensaje').value,
            aceptaTerminos: document.getElementById('acepta-terminos').checked,
            preferenciaContacto: document.querySelector('input[name="preferencia"]:checked').value,
        };

        contactFacade.guardarContacto(datosFormulario);
        mostrarMensaje('success', '¡Mensaje enviado y guardado con éxito!');
        formulario.reset();
        renderContactos(); // Actualiza la lista
    });

    contactosLista.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.dataset.id);
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                contactFacade.eliminarContacto(id);
                renderContactos();
            }
        }
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar TODOS los contactos?')) {
            contactFacade.borrarTodo();
            renderContactos();
            mostrarMensaje('info', 'Todos los contactos han sido eliminados.');
        }
    });

    // --- Inicialización ---
    renderContactos();
});
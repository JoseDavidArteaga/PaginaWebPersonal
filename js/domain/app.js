// js/domain/app.js


document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Repositorio y Fachada ---
    const contactRepository = new ContactRepository();
    const contactFacade = new ContactFacade(contactRepository);

    // --- Referencias del DOM ---
    const formulario = document.getElementById('formulario-contacto');
    const contactosTablaBody = document.getElementById('contactos-tbody');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // --- Funciones de la Interfaz ---
    function renderContactos() {
        const contactos = contactFacade.listarContactos();
        contactosTablaBody.innerHTML = ''; // Limpia la lista antes de renderizar

        if (contactos.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" class="no-contactos">No hay contactos guardados.</td>';
            contactosTablaBody.appendChild(tr);
        }
        
        contactos.forEach(contacto => {
            const li = document.createElement('tr');
            li.className = 'contact-item';
            li.innerHTML = `
                <td>${contacto.nombre}</td>
                <td>${contacto.email}</td>
                <td>${contacto.telefono || 'N/A'}</td>
                <td>${contacto.motivo}</td>
                <td>
                    <button class="edit-btn" data-id="${contacto.id}">Editar</button>
                    <button class="delete-btn" data-id="${contacto.id}">Eliminar</button>
                </td>
            `;
            contactosTablaBody.appendChild(li);
        });
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

        // Obtener el ID del contacto si está en modo edición
        const contactoId = document.getElementById('contacto-id').value;

        const datosFormulario = {
            id: contactoId ? parseInt(contactoId, 10) : null,// Convierte a entero si existe
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
        document.getElementById('contacto-id').value = ""; // Limpia el campo oculto del ID
        renderContactos(); // Actualiza la lista
    });

    // Delegación de eventos para botones de editar y eliminar
    contactosTablaBody.addEventListener('click', (event) => {

        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.dataset.id);
            const contacto = contactFacade.repository.getById(id);

            if (contacto) {
                document.getElementById('contacto-id').value = contacto.id;
                document.getElementById('nombre').value = contacto.nombre;
                document.getElementById('email').value = contacto.email;
                document.getElementById('telefono').value = contacto.telefono;
                document.getElementById('motivo').value = contacto.motivo;
                document.getElementById('mensaje').value = contacto.mensaje;
                document.getElementById('acepta-terminos').checked = contacto.aceptaTerminos;
                document.querySelector(`input[name="preferencia"][value="${contacto.preferenciaContacto}"]`).checked = true;
                
                // 👉 Aquí hacemos el scroll suave al inicio de la sección
                document.querySelector("#contacto").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }

        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.dataset.id);
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                contactFacade.eliminarContacto(id);
                renderContactos();
            }
        }
    });

    // Manejador para el botón de borrar todo
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
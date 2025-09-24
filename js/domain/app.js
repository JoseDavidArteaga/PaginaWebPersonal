// js/domain/app.js

// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    // --- Inicialización de la lógica de negocio ---
    // Se crean el repositorio y la fachada, que gestionan los contactos en memoria.
    const contactRepository = new ContactRepository();
    const contactFacade = new ContactFacade(contactRepository);

    // --- Referencias a elementos del DOM ---
    // Se capturan los elementos necesarios para manejar formulario, tabla y botones.
    const formulario = document.getElementById('formulario-contacto');
    const contactosTablaBody = document.getElementById('contactos-tbody');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // --- Función para renderizar contactos en la tabla ---
    function renderContactos() {
        const contactos = contactFacade.listarContactos();
        contactosTablaBody.innerHTML = ''; // Limpia la tabla antes de renderizar

        if (contactos.length === 0) {
            // Si no hay contactos, se muestra un mensaje en la tabla
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" class="no-contactos">No hay contactos guardados.</td>';
            contactosTablaBody.appendChild(tr);
        }
        
        // Recorre los contactos y los pinta en filas con botones de editar y eliminar
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

    // --- Función para mostrar mensajes temporales en el formulario ---
    // Tipo puede ser "success", "info", "error", etc.
    function mostrarMensaje(tipo, mensaje) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `alert alert-${tipo}`;
        mensajeDiv.textContent = mensaje;
        formulario.prepend(mensajeDiv); // Lo muestra encima del formulario
        setTimeout(() => mensajeDiv.remove(), 3000); // Desaparece tras 3 segundos
    }

    // --- Manejador del envío del formulario ---
    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita recarga de página

        // Si hay un ID en el campo oculto, significa que estamos editando
        const contactoId = document.getElementById('contacto-id').value;

        // Se recolectan los datos del formulario
        const datosFormulario = {
            id: contactoId ? parseInt(contactoId, 10) : null, // Convierte a entero si existe
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            motivo: document.getElementById('motivo').value,
            mensaje: document.getElementById('mensaje').value,
            aceptaTerminos: document.getElementById('acepta-terminos').checked,
            preferenciaContacto: document.querySelector('input[name="preferencia"]:checked').value,
        };

        // Guarda o actualiza el contacto mediante la fachada
        contactFacade.guardarContacto(datosFormulario);

        // Feedback al usuario
        mostrarMensaje('success', '¡Mensaje enviado y guardado con éxito!');
        
        // Limpia formulario y campo oculto
        formulario.reset();
        document.getElementById('contacto-id').value = ""; 
        renderContactos(); // Refresca la tabla
    });

    // --- Delegación de eventos para botones de Editar y Eliminar ---
    contactosTablaBody.addEventListener('click', (event) => {
        // Acción de Editar contacto
        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.dataset.id);
            const contacto = contactFacade.repository.getById(id);

            if (contacto) {
                // Rellena el formulario con los datos del contacto
                document.getElementById('contacto-id').value = contacto.id;
                document.getElementById('nombre').value = contacto.nombre;
                document.getElementById('email').value = contacto.email;
                document.getElementById('telefono').value = contacto.telefono;
                document.getElementById('motivo').value = contacto.motivo;
                document.getElementById('mensaje').value = contacto.mensaje;
                document.getElementById('acepta-terminos').checked = contacto.aceptaTerminos;
                document.querySelector(`input[name="preferencia"][value="${contacto.preferenciaContacto}"]`).checked = true;
                
                // Scroll suave hacia el formulario (sección de contacto)
                document.querySelector("#contacto").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }

        // Acción de Eliminar contacto
        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.dataset.id);
            if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
                contactFacade.eliminarContacto(id);
                renderContactos();
            }
        }
    });

    // --- Manejador para el botón "Borrar todo" ---
    clearAllBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar TODOS los contactos?')) {
            contactFacade.borrarTodo();
            renderContactos();
            mostrarMensaje('info', 'Todos los contactos han sido eliminados.');
        }
    });

    // --- Inicialización ---
    // Al cargar la página, renderiza los contactos guardados (si existen).
    renderContactos();
});

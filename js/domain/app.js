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
    const submitBtn = document.getElementById('submit-btn');

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
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${contacto.nombre}</td>
                <td>${contacto.email}</td>
                <td>${contacto.telefono || 'N/A'}</td>
                <td>${contacto.motivo}</td>
                <td>
                    <button class="edit-btn" data-id="${contacto.id}">Editar</button>
                    <button class="delete-btn" data-id="${contacto.id}">Eliminar</button>
                </td>
            `;
            contactosTablaBody.appendChild(tr);
        });
    }

    // --- Función para mostrar mensajes temporales en el formulario ---
    // Tipo puede ser "success", "info", "error", etc.
    function mostrarMensaje(tipo, mensaje) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `alert alert-${tipo}`;
        mensajeDiv.textContent = mensaje;
        formulario.prepend(mensajeDiv);
        setTimeout(() => mensajeDiv.remove(), 10000);
    }
    
    // Función para limpiar todos los mensajes de error
    function limpiarErrores() {
        const errorMessages = document.querySelectorAll('.mensaje-error');
        errorMessages.forEach(p => {
            p.textContent = "";
            p.style.display = "none";
        });
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    // --- Validación del formulario ---
    function validarFormulario() {
        let isValid = true;
        limpiarErrores(); // Limpia errores anteriores antes de validar de nuevo

        // Validar Nombre
        const nombreInput = document.getElementById('nombre');
        if (nombreInput.value.trim() === "") {
            nombreInput.classList.add('error');
            nombreInput.nextElementSibling.textContent = "El nombre es obligatorio.";
            nombreInput.nextElementSibling.style.display = "block";
            isValid = false;
        }

        // Validar Email
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('error');
            emailInput.nextElementSibling.textContent = "Debes ingresar un correo válido.";
            emailInput.nextElementSibling.style.display = "block";
            isValid = false;
        }

        // Validar Teléfono (opcional)
        const telefonoInput = document.getElementById('telefono');
        const phoneRegex = /^[0-9]{7,10}$/;
        if (telefonoInput.value.trim() !== "" && !phoneRegex.test(telefonoInput.value.trim())) {
            telefonoInput.classList.add('error');
            telefonoInput.nextElementSibling.textContent = "Ingresa un teléfono válido (7-10 dígitos).";
            telefonoInput.nextElementSibling.style.display = "block";
            isValid = false;
        }

        // Validar Motivo
        const motivoInput = document.getElementById('motivo');
        if (motivoInput.value === "") {
            motivoInput.classList.add('error');
            motivoInput.nextElementSibling.textContent = "Selecciona un motivo.";
            motivoInput.nextElementSibling.style.display = "block";
            isValid = false;
        }

        // Validar Mensaje
        const mensajeInput = document.getElementById('mensaje');
        if (mensajeInput.value.trim().length < 10) {
            mensajeInput.classList.add('error');
            mensajeInput.nextElementSibling.textContent = "El mensaje debe tener al menos 10 caracteres.";
            mensajeInput.nextElementSibling.style.display = "block";
            isValid = false;
        }

        // Validar Preferencia de contacto
        const preferenciaSeleccionada = document.querySelector('input[name="preferencia"]:checked');
        const preferenciaError = document.querySelector('.radio-group + .mensaje-error');
        if (!preferenciaSeleccionada) {
            preferenciaError.textContent = "Selecciona una preferencia de contacto.";
            preferenciaError.style.display = "block";
            isValid = false;
        }

        // Validar Aceptación de términos
        const terminosCheckbox = document.getElementById('acepta-terminos');
        const terminosError = document.querySelector('.checkbox-group + .mensaje-error');
        if (!terminosCheckbox.checked) {
            terminosCheckbox.classList.add('error');
            terminosError.textContent = "Debes aceptar los términos.";
            terminosError.style.display = "block";
            isValid = false;
        }

        return isValid;
    }

    // --- Manejador del envío del formulario ---
    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita recarga de página
        
        if (!validarFormulario()) {
            return; // Detiene la ejecución si la validación falla
        }

        const contactoId = document.getElementById('contacto-id').value;

        // Se recolectan los datos del formulario
        const datosFormulario = {
            id: contactoId ? parseInt(contactoId, 10) : null,
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
        renderContactos(); 
    });

    // --- Delegación de eventos para botones de Editar y Eliminar ---
    contactosTablaBody.addEventListener('click', (event) => {
        // Acción de Editar contacto
        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.dataset.id);
            const contacto = contactFacade.repository.getById(id);

            if (contacto) {
                // Rellena el formulario
                document.getElementById('contacto-id').value = contacto.id;
                document.getElementById('nombre').value = contacto.nombre;
                document.getElementById('email').value = contacto.email;
                document.getElementById('telefono').value = contacto.telefono;
                document.getElementById('motivo').value = contacto.motivo;
                document.getElementById('mensaje').value = contacto.mensaje;
                document.getElementById('acepta-terminos').checked = contacto.aceptaTerminos;
                document.querySelector(`input[name="preferencia"][value="${contacto.preferenciaContacto}"]`).checked = true;
                
                // Limpia errores y se desplaza
                limpiarErrores();
                document.querySelector("#contacto").scrollIntoView({ behavior: "smooth", block: "start" });
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
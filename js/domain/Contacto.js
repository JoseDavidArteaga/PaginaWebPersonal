/**
 * Clase que representa un contacto dentro del sistema.
 * 
 * Contiene los datos principales enviados desde el formulario,
 * así como las marcas de tiempo de creación y actualización.
 */

class Contacto {
    constructor(datosFormulario) {
        this.id = datosFormulario.id || null;
        this.nombre = datosFormulario.nombre;
        this.email = datosFormulario.email;
        this.telefono = datosFormulario.telefono;
        this.motivo = datosFormulario.motivo;
        this.mensaje = datosFormulario.mensaje;
        this.aceptaTerminos = datosFormulario.aceptaTerminos;
        this.preferenciaContacto = datosFormulario.preferenciaContacto;
        this.fechaCreacion = datosFormulario.fechaCreacion || new Date().toISOString();
        this.fechaActualizacion = new Date().toISOString();
    }
}

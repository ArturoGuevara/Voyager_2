// Variable que guarda la id de análisis a cargar
var id_analisis;

/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se cierra el modal de ver análisis por dar click afuera, esconder bloque de inputs y mostrar el de info
    $('#ver_analisis').on('hidden.bs.modal', function () {
        $('#ver_info').removeClass('d-none').addClass('d-block');
        $('#editar_info').removeClass('d-block').addClass('d-none');
        $('#btn-editar-analisis').removeClass('d-none').addClass('d-block');
        $('#btn-guardar-cambios').removeClass('d-block').addClass('d-none');
    });
    // Si se cancela el querer borrar un análisis se reinicia el valor de la variable global
    $('#borrar_analisis').on('hidden.bs.modal', function () {
       id_analisis = 0;
    });
});

/* Funciones para reemplazar valores en la tabla e inputs */
function cargar_info_modal_ver(codigo, nombre, precio, tiempo, descripcion){
    $('#codigo_analisis').html(codigo);
    $('#nombre_analisis').html(nombre);
    $('#precio_analisis').html(precio);
    $('#fecha_analisis').html(tiempo);
    $('#descripcion_analisis').html(descripcion);
}

function cargar_info_modal_editar(codigo, nombre, precio, tiempo, descripcion){
    $('#editar_codigo_analisis').val(codigo);
    $('#editar_nombre_analisis').val(nombre);
    $('#editar_precio_analisis').val(precio);
    $('#editar-duracion').val(tiempo);
    $('#editar_desc_analisis').val(descripcion);
}
function cambiar_valores_analisis_tabla(clase,value,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
           $(e).html(value);
       }
    });
}
function borrar_analisis_tabla(clase,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
           $(e).remove();
       }
    });
}
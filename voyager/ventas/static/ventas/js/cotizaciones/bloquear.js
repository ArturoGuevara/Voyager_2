//######### USV04-04 ########

/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se cierra el modal para confirmar el borrado de la cotizacion, reajusta la variable global a 0
    $('#bloquear_cotizacion').on('hidden.bs.modal', function () {
       id_cotizacion = 0;
    });
});


function bloquear_cotizacion(id){
    if (id > 0){
        id_cotizacion = id;     // Carga el id de la cotización que se quiere bloquear en la variable global
    }
}

function confirmar_bloquear_cotizacion(){
    if (id_cotizacion > 0){
        // Guardar variables globales en locales
        var id =  id_cotizacion;
        var token = csrftoken;
        $.ajax({
            url: "bloquear_cotizacion/"+id,
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                bloquear_cotizacion_tabla('.cot-row',id);
                id_cotizacion = 0;
                $('#bloquear_cotizacion').modal('toggle');                                        // Cerrar el modal de bloquear cotizacion
                showNotificationSuccess('top','right','Se ha bloqueado la cotización exitosamente.');
            },
        });

    }
 // Mostrar alerta de cotizacion borrada
}

function bloquear_cotizacion_tabla(clase,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
           $(e).find('#cotizacion_child_estado').html('Bloqueado');
           $(e).find('#cotizacion_child_bloquear').prop('hidden', true);
           $(e).find('#cotizacion_child_aceptar').prop('hidden', true);
       }
    });
}

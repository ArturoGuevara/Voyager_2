//######### USV04-04 ########

/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se cierra el modal para confirmar el borrado de la cotizacion, reajusta la variable global a 0
    $('#guardar_perfil').on('hidden.bs.modal', function () {
       id_perfil = 0;
    });
});


function guardar_perfil(id){
    if (id > 0){
        id_perfil = id;     // Carga el id de la cotización que se quiere borrar en la variable global
    }
}

function confirmar_guardar_perfil(){
    if (id_perfil > 0){
        // Guardar variables globales en locales
        var id =  id_perfil;
        var token = csrftoken;
        $.ajax({
            url: "editar_perfil/"+id,
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                id_perfil = 0;
                $('#guardar_perfil').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
                showNotification('top','right','Se han modificado los datos exitosamente.');
            },
        });

    }
 // Mostrar alerta de cotizacion borrada
}

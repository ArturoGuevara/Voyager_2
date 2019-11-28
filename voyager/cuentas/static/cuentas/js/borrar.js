//######### USA03-39 ########

/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se cierra el modal para confirmar el borrado de la usuario, reajusta la variable global a 0
    $('#modal_borrar_usuario').on('hidden.bs.modal', function () {
       id_usuario = 0;
    });
    $('#modal_restaurar_usuario').on('hidden.bs.modal', function () {
       id_usuario = 0;
    });
});


function borrar_usuario(id){
    if (id > 0){
        id_usuario = id;     // Carga el id de la cotización que se quiere borrar en la variable global
    }
}

function restaurar_usuario(id){
    if (id > 0){
        id_usuario = id;     // Carga el id de la cotización que se quiere borrar en la variable global
    }
}

function confirmar_borrar_usuario(){
    if (id_usuario > 0){
        // Guardar variables globales en locales
        var id =  id_usuario;
        var token = csrftoken;
        $.ajax({
            url: "/cuentas/borrar_usuario/"+id,
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                update_usuario_tabla('.user-row',id);
                borrar_usuario_tabla('.act-row',id);
                id_usuario = 0;
                $('#modal_borrar_usuario').modal('toggle');                                        // Cerrar el modal de borrar usuario
                showNotificationSuccess('top','right','Se ha borrado el usuario exitosamente.');
            },
        });

    }
 // Mostrar alerta de usuario borrada
}

function confirmar_restaurar_usuario(){
    if (id_usuario > 0){
        // Guardar variables globales en locales
        var id =  id_usuario;
        var token = csrftoken;
        $.ajax({
            url: "/cuentas/borrar_usuario/"+id,
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                update_usuario_tabla('.user-row',id);
                restaurar_usuario_tabla('.ina-row',id);
                id_usuario = 0;
                $('#modal_restaurar_usuario').modal('toggle');                                        // Cerrar el modal de borrar usuario
                showNotificationSuccess('top','right','Se ha restaurado el usuario exitosamente.');
            },
        });

    }
 // Mostrar alerta de usuario borrada
}

function update_usuario_tabla(clase,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
           if($(e).find('#btn-trash').hasClass('d-inline')){
             $(e).find('#btn-trash').remove();
             $(e).find('#td-acciones').append('<button id="btn-restore" type="button" class="btn btn-success d-inline" onclick="restaurar_usuario('+id+')" data-toggle="modal" data-target="#modal_restaurar_usuario"><i class="fas fa-trash-restore-alt"></i></button>');
           }
           else if($(e).find('#btn-restore').hasClass('d-inline')){
             $(e).find('#btn-restore').remove();
             $(e).find('#td-acciones').append('<button id="btn-trash" type="button" class="btn btn-danger d-inline" onclick="borrar_usuario('+id+')" data-toggle="modal" data-target="#modal_borrar_usuario"><i class="fas fa-trash"></i></button>');
           }
       }
    });
}

function borrar_usuario_tabla(clase,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
         $(e).find('#btn-act-trash').remove();
         $(e).removeClass('act-row').addClass('ina-row');
         $(e).find('#td-act-acciones').append('<button id="btn-ina-restore" type="button" class="btn btn-success d-inline" onclick="restaurar_usuario('+id+')" data-toggle="modal" data-target="#modal_restaurar_usuario"><i class="fas fa-trash-restore-alt"></i></button>');
         $(e).find('#td-act-acciones').attr('id','td-ina-acciones');
         $(e).remove();
         $(e).prependTo('#ina-body');
       }
    });
}

function restaurar_usuario_tabla(clase,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
         $(e).find('#btn-ina-restore').remove();
         $(e).removeClass('ina-row').addClass('act-row');
         $(e).find('#td-ina-acciones').append('<button id="btn-act-trash" type="button" class="btn btn-danger d-inline" onclick="borrar_usuario('+id+')" data-toggle="modal" data-target="#modal_borrar_usuario"><i class="fas fa-trash"></i></button>');
         $(e).find('#td-ina-acciones').attr('id','td-act-acciones');
         $(e).remove();
         $(e).prependTo('#act-body');
       }
    });
}

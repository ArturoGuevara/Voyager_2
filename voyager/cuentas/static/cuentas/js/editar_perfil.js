//######### USA09-45 ########

/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se cierra el modal para confirmar el borrado de la cotizacion, reajusta la variable global a 0
    $('#guardar_perfil').on('hidden.bs.modal', function () {
       id_perfil = 0;
    });
});

$('#pass2').change(function(){
    if($('#pass1').val() != $(this).val()) {
        $(this).addClass('is-invalid');
    }
    else{
        $(this).removeClass('is-invalid');
    }
});

function guardar_perfil(id){
    if (id > 0){
        id_perfil = id;     // Carga el id de la cotización que se quiere borrar en la variable global
    }
}

function confirmar_guardar_perfil(){
    // Obtenemos el token de django para el ajax
    var token = csrftoken;

    // Obtener valor de los inputs
    var nombre = $('#edit_nombre').val();
    var a_p = $('#edit_apellido_p').val();
    var a_m = $('#edit_apellido_m').val();
    var correo = $('#edit_correo').val();
    var telefono = $('#edit_telefono').val();
    var pass1 = $('#pass1').val();
    var pass2 = $('#pass2').val();
    var ver = $('#ver').val();

    // Validamos que no estén vacíos los inputs
    var dict = {
      1 : check_is_not_empty(nombre, '#edit_nombre'),
      2 : check_is_not_empty(a_p, '#edit_apellido_p'),
      3 : check_is_not_empty(a_m, '#edit_apellido_m'),
      4 : check_is_not_empty(correo, '#edit_correo'),
      5 : check_is_not_empty(telefono, '#edit_telefono')
    }

    var flag = true;
    for(var key in dict) {
      var value = dict[key];
      if(value == false){
          flag = false;
          break;
      }
    }

    var confirmar = check_is_not_empty(ver, '#ver');

    if(confirmar == false){
        flag = false;
        $('#ver').addClass('is-invalid');
    }
    else{
        $('#ver').removeClass('is-invalid');
    }

    if (id_perfil > 0 && flag){
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
            },
        });

    }
    else {
      $('#guardar_perfil').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
    }
 // Mostrar alerta de cotizacion borrada
}

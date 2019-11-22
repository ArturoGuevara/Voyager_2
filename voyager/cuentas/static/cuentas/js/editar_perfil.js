//######### USA09-45 ########

$('#pass1').change(function(){
    if($('#pass2').val() != $(this).val()) {
        $('#pass2').addClass('is-invalid');
    }
    else{
        $('#pass2').removeClass('is-invalid');
    }
    if($(this).val().length < 8){
        $(this).addClass('is-invalid');
    }
    else{
        $(this).removeClass('is-invalid');
    }
});

$('#pass2').change(function(){
    if($('#pass1').val() != $(this).val()) {
        $(this).addClass('is-invalid');
    }
    else{
        $(this).removeClass('is-invalid');
    }
});
function guardar_perfil(){
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

    if(pass1 != ""){
      if(pass1.length >= 8){
        $('#pass1').removeClass('is-invalid');
        if(pass1 != pass2){
          $('#pass2').addClass('is-invalid');
          flag = false;
        }
        else{
          $('#pass2').removeClass('is-invalid');
        }
      }
      else{
        $('#pass1').addClass('is-invalid');
        flag = false;
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

    if (flag){
        $('#guardar_perfil').modal('toggle'); 
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

    if(pass1 != ""){
      if(pass1.length >= 8){
        $('#pass1').removeClass('is-invalid');
        if(pass1 != pass2){
          $('#pass2').addClass('is-invalid');
          flag = false;
        }
        else{
          $('#pass2').removeClass('is-invalid');
        }
      }
      else{
        $('#pass1').addClass('is-invalid');
        flag = false;
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

    if (flag){
        // Guardar variables globales en locales
        var token = csrftoken;
        $.ajax({
            url: "/cuentas/guardar_perfil/",
            // Seleccionar información que se mandara al controlador
            data: {
                nombre: nombre,
                a_p: a_p,
                a_m: a_m,
                correo: correo,
                telefono: telefono,
                pass1: pass1,
                pass2: pass2,
                ver: ver,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                $('#guardar_perfil').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
                setTimeout(function () {
                    location.reload();
                }, 100);
            },
        });

    }
    else {
      $('#guardar_perfil').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
    }
 // Mostrar alerta de cotizacion borrada
}

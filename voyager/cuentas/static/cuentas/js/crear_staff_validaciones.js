

$('#submit-staff-button').click(function(){
    var nombre_n = $('#nombre').val();
    var apellido_paterno_n = $('#apellido_paterno').val();
    var apellido_materno_n = $('#apellido_materno').val();
    var correo_n = $('#correo').val();
    var telefono_n = $('#telefono').val();
    var contrasena_n = $('#contraseña').val();
    var contrasena2_n = $('#contraseña2').val();
    var id_rol_n = $('#id_rol').val();

    // Validar que ningun campo esta vacio
    var dict = {
        1 : check_is_not_empty(nombre_n, '#nombre'),
        2 : check_is_not_empty(apellido_paterno_n, '#apellido_paterno'),
        3 : check_is_not_empty(apellido_materno_n, '#apellido_materno'),
        4 : check_is_not_empty(correo_n, '#correo'),
        5 : check_is_not_empty(telefono_n, '#telefono'),
        6 : check_is_not_empty(contrasena_n, '#contraseña'),
        7 : check_is_not_empty(contrasena2_n, '#contraseña2'),
        8 : check_is_not_empty(contrasena2_n, '#contraseña2'),
        9 : check_is_not_empty(id_rol_n, '#id_rol')
    }

    var flag = true;
    for(var key in dict) {
      var value = dict[key];
      if(value == false){
          flag = false
          break;
      }
    }
    $("#correo").on("keyup",val_mail);
    // Enviar un mensaje de retroalimentacion de html si un campo no cumple con los requisitos
    contrasena_flag = $('#contraseña')[0].reportValidity();
    contrasena_flag2 = $('#contraseña2')[0].reportValidity();
    correo_flag = $('#correo')[0].reportValidity();

    last_flag = flag && correo_verificar && contrasena_flag && contrasena_flag2 && correo_flag;


    if(last_flag == true){
        document.getElementById("submit-staff-form").submit();
    }
});

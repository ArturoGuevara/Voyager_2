// Función para checar que un campo sólo pueda aceptar números y no strings
const regexNumber = /^([0-9]+\.?[0-9]{0,2})$/; 
function justNumbers(e){
   return regexNumber.test(e.originalEvent.key);
}
// Al cargar el documento se le dice que a esos inputs con X id ejecuten la función de sólo números
$(document).ready(function(){
    $("#editar_precio_analisis").on("keypress", justNumbers);

    // Validar que los campos de registro de analisis no se quedan validaciones
    $("#submit-analisis-button").click(function(){
        var nombre_r = $('#nombre').val();
        var codigo_r = $('#codigo').val();
        var descripcion_r = $('#precio').val();
        var precio_r = $('#descripcion').val();
        var tiempo_r =  $('#duracion').val();

        var dict = {
            1 : check_is_not_empty(nombre_r, '#nombre'),
            3 : check_is_not_empty(codigo_r, '#codigo'),
            4 : check_is_not_empty(descripcion_r, '#precio'),
            5 : check_is_not_empty(precio_r, '#descripcion'),
            6 : check_is_not_empty(tiempo_r, '#duracion')
        }

        for(var key in dict) {
          var value = dict[key];
          var flag = true;
          if(value == false){
              flag = false
              break;
          }
        }

        if(flag == true){
            document.getElementById("submit-analisis-form").submit();
        }else{
            console.log("valores vacios");
        }
    });
});

// Función para checar que no estén vacíos los campos
var check_is_not_empty = function(auxiliar, id){
    if(auxiliar == '' || auxiliar == null){
        $(id).addClass('is-invalid');
        return false;
    }else{
        $(id).removeClass('is-invalid');
        return true;
    }
}
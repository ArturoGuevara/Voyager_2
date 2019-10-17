// Función para checar que un campo sólo pueda aceptar números y no strings
const regexNumber = /[0-9]{1}/;
function justNumbers(e){
   return regexNumber.test(e.originalEvent.key);
}
// Al cargar el documento se le dice que a esos inputs con X id ejecuten la función de sólo números
$(document).ready(function(){
    $("#editar_precio_analisis").on("keypress", justNumbers);
//    $("#editar_fecha_analisis").on("keypress", justNumbers);
});
// Función para checar que no estén vacíos los campos
var check_is_not_empty = function(auxiliar, name, id){
    if(auxiliar == '' || auxiliar == null){
        $(id).addClass('is-invalid');
    }else{
        $(id).removeClass('is-invalid');
    }
}
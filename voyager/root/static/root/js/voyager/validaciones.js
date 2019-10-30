// Función para checar que no estén vacíos los campos y si sí, agregar clase para mostrar retroaliementación
var check_is_not_empty = function(auxiliar, id){
    if(auxiliar == '' || auxiliar == null){
        $(id).addClass('is-invalid');
        return false;
    }else{
        $(id).removeClass('is-invalid');
        return true;
    }
}
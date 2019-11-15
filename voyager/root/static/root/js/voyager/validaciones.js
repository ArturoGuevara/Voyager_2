// Función para checar que no estén vacíos los campos y si sí, agregar clase para mostrar retroaliementación
var check_is_not_empty = function(value, id){
    if(value == '' || value == null){
        $(id).addClass('is-invalid');
        return false;
    }else{
        $(id).removeClass('is-invalid');
        return true;
    }
}
// Función para validar que el campo sólo tenga chars y espacios en blanco
var check_just_letters = function(value, id){
    if (/^[a-zA-Z\s]+$/.test(value)){
        $(id).removeClass('is-invalid');
        return true;
    }else{
        $(id).addClass('is-invalid');
        return false;
    }
}
// Función para validar que el campo sólo tenga números
var check_just_numbers = function(value, id){
    if (/^-?\d+\.?\d*$/.test(value)){
        $(id).removeClass('is-invalid');
        return true;
    }else{
        $(id).addClass('is-invalid');
        return false;
    }
}
// Función para validar que el campo tiene el formato de fecha
var check_is_date = function(value,id){
    if(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(value)){
        $(id).removeClass('is-invalid');
        return true;
    }else{
        $(id).addClass('is-invalid');
        return false;
    }
}
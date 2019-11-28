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

// Función para validar que el campo tiene el formato de fecha
var check_is_date_js = function(value,id){
    if(/^\d{4}[./-]\d{2}[./-]\d{2}$/.test(value)){
        $(id).removeClass('is-invalid');
        return true;
    }else{
        $(id).addClass('is-invalid');
        return false;
    }
}

var check_is_negative = function(value,id){
    var val = value;
    if(val < 1){
        val = val*-1;
        $('#'+id).val(val);
    }
}
//Función que revisa que la fecha ingresada cumpla el formato mm/dd/yyyy
function date_is_valid(dateString, id){
    // Revisa que el formato de fecha sea correcto
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)){
        $(id).addClass('is-invalid');
        return false;
    }
    // Parsea el string en números enteros para día, mes y año
    var parts   = dateString.split("/");
    var day     = parseInt(parts[1], 10);
    var month   = parseInt(parts[0], 10);
    var year    = parseInt(parts[2], 10);
    // Revisa los rangos de años y meses
    if(year < 1000 || year > 3000 || month <= 0 || month > 12){
        $(id).addClass('is-invalid');
        return false;
    }
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Ajusta el rango de días de febrero para años bisciestos
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){
        monthLength[1] = 29;
    }
    // Revisa el rango del día
    if(day <= 0 || day > monthLength[month - 1]){
        $(id).addClass('is-invalid');
        return false;
    }
    $(id).removeClass('is-invalid');
    return true;
}
// Función que revisa que los campos no estén vacíos ni tengan comas, de lo contrario muestran retroalmientación
var check_not_commas_empty = function(value, id){
    if(value == '' || value == null){
        $(id).addClass('is-invalid');
        return false;
    }else if(value.includes(",")){
        $(id).addClass('is-invalid');
        return false;
    }else{
        $(id).removeClass('is-invalid');
        return true;
    }
}
function estado() {
    var pais = document.getElementById("pais").value;
    var label = document.getElementById("label-estado");
    label.hidden = false;
    var estado;
    if (pais == 'México') {
        estado = document.getElementById("estado1");
        estado.hidden = false;
        estado.required = true;
        estado = document.getElementById("estado2");
        estado.hidden = true;
        estado.required = false;
        estado.value = "";
    } else {
        estado = document.getElementById("estado2");
        estado.hidden = false;
        estado.required = true;
        estado = document.getElementById("estado1");
        estado.hidden = true;
        estado.required = false;
        estado.value = "";
    }
}

function guardar_muestra() {
    var enviar = document.getElementById("enviar").value;
    document.getElementById("enviar").value = 0;
}

function enviar_muestra() {
    var enviar = document.getElementById("enviar").value;
    document.getElementById("enviar").value = 1;
}

function validar_info_solicitante() {
    var dict = {
        1: check_is_not_empty($('#nombre').val(), '#nombre'),
        2: check_is_not_empty($('#direccion').val(), '#direccion'),
        3: check_is_not_empty($('#pais').val(), '#pais'),
        4: check_is_not_empty($('#idioma').val(), '#idioma'),
    }

    for (var key in dict) {
        var value = dict[key];
        var flag = true;
        if (value == false) {
            flag = false
            break;
        }
    }

    if (flag == true) {
        $('#ingreso-cliente-form').submit();
    }
}
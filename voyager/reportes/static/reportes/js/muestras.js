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
        continuar_parte_muestras();
    }
}

function regresar_parte_solicitante(){
    // Alternar headers
    $('#title-2').removeClass('d-block').addClass('d-none');
    $('#title-1').removeClass('d-none').addClass('d-block');
    
    // Alternar botones
    $('#btn-muestra-continuar').addClass('d-inline').removeClass('d-none');
    $('#btn-muestra-regresar').removeClass('d-inline').addClass('d-none');
    $('#btn-muestra-guardar').removeClass('d-inline').addClass('d-none');
    $('#btn-muestra-enviar').removeClass('d-inline').addClass('d-none');
    
    // Alternar contenedores
    $('#info-solicitante').addClass('d-block').removeClass('d-none');
    $('#info-muestras').removeClass('d-block').addClass('d-none');
}

function continuar_parte_muestras(){
    // Alternar headers
    $('#title-1').removeClass('d-block').addClass('d-none');
    $('#title-2').removeClass('d-none').addClass('d-block');
    
    // Alternar botones
    $('#btn-muestra-continuar').removeClass('d-inline').addClass('d-none');
    $('#btn-muestra-regresar').addClass('d-inline').removeClass('d-none');
    $('#btn-muestra-guardar').addClass('d-inline').removeClass('d-none');
    $('#btn-muestra-enviar').addClass('d-inline').removeClass('d-none');
    
    // Alternar contenedores
    $('#info-solicitante').removeClass('d-block').addClass('d-none');
    $('#info-muestras').addClass('d-block').removeClass('d-none');
}
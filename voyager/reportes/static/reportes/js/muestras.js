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

var cnt_ingreso_agricola = 1;
var cnt_ingreso_procesado = 1;
var cnt_ingreso_microbiologia = 1;

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

$('.btn-plantilla').click(function(){
    // Obtenemos el target del contenedor que se tiene que desplegar
    var target = $(this).data('target');
    // Si ha sido clickeado antes, escondemos todos los contenedores
    if($(this).hasClass('clicked')){
        $(this).removeClass('clicked');
        $('#containerProductoAgricola').collapse('hide');
        $('#containerProductoProcesado').collapse('hide');
        $('#containerProductoMicrobiologia').collapse('hide');
    }else{ // Si es la primera vez que se clickea, le agregamos la clase nada más
        $(this).addClass('clicked');    
    }

    if(target === 'agricola'){
        $('#containerProductoAgricola').collapse('show');
        $('#containerProductoProcesado').collapse('hide');
        $('#containerProductoMicrobiologia').collapse('hide');
    }else if(target === 'procesado'){
        $('#containerProductoProcesado').collapse('show');
        $('#containerProductoAgricola').collapse('hide');
        $('#containerProductoMicrobiologia').collapse('hide');
    }else if(target === 'microbiologia'){
        $('#containerProductoMicrobiologia').collapse('show');
        $('#containerProductoAgricola').collapse('hide');
        $('#containerProductoProcesado').collapse('hide');
    }
});

function validar_producto_procesado(){
    // Validamos los arreglos de inputs
    $("input[name='tipoMuestra[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#tipo-muestra-'+id);
    });
    $("input[name='descripcionMuestra[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#descripcion-muestra-'+id);
    });
    $("input[name='fechaMuestreo[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#fecha-muestreo-'+id);
        check_is_date($(this).val(),'#fecha-muestreo-'+id);
    });
    $("input[name='analisis1[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#primer-analisis-'+id);
    });
}

function agregar_fila_procesado(){
    $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado" data-id="'+cnt_ingreso_procesado+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tipo-muestra-'+cnt_ingreso_procesado+'" name="tipoMuestra[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="descripcion-muestra-'+cnt_ingreso_procesado+'" name="descripcionMuestra[]"><div class="invalid-feedback">Este campo no puede estar vacía</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha-muestreo-'+cnt_ingreso_procesado+'" name="fechaMuestreo[]"><div class="invalid-feedback">Ingrese fecha con el formato DD/MM/YYYY</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="primer-analisis-'+cnt_ingreso_procesado+'" name="analisis1[]"><div class="invalid-feedback">Seleccione un análisis</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="segundo-analisis-'+cnt_ingreso_procesado+'" name="analisis2[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tercer-analisis-'+cnt_ingreso_procesado+'" name="analisis3[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="cuarto-analisis-'+cnt_ingreso_procesado+'" name="analisis4[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="quinto-analisis-'+cnt_ingreso_procesado+'" name="analisis5[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="sexto-analisis-'+cnt_ingreso_procesado+'" name="analisis6[]"></td><td><button type="button" class="btn btn-danger" onclick="quitar_filar_procesado('+cnt_ingreso_procesado+')"><i class="fa fa-trash"></i></button></td></tr>');
    cnt_ingreso_procesado+=1;
    // El datepicker que se agrega activarlo
    $(".datepicker" ).datepicker();
}

function quitar_filar_procesado(id){
    $('.fila-tabla-procesado').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}
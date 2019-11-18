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

function validar_producto_micro(){
    // Validamos los arreglos de inputs
    $("input[name='tipo_muestra[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#tipo_muestra_'+id);
    });
    $("input[name='nombre_cliente[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#nombre_cliente_'+id);
    });
    $("input[name='lote_codigo[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#lote_codigo_'+id);
    });
    $("input[name='muestreador[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#muestreador_'+id);
    });
    $("input[name='fecha_muestreo[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#fecha_muestreo_'+id);
        check_is_date($(this).val(),'#fecha_muestreo_'+id);
    });
    $("input[name='analisis_1[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#analisis_1_'+id);
    });
    $("input[name='metodo_referencia[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#metodo_referencia_'+id);
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

function agregar_fila_micro(analisis){
    console.log(analisis)
    $('#tabla-micro-body').append('<tr class="fila-tabla-micro" data-id="'+cnt_ingreso_microbiologia+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="tipo_muestra_'+cnt_ingreso_microbiologia+'" name="tipo_muestra[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="nombre_cliente_'+cnt_ingreso_microbiologia+'" name="nombre_cliente[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="lote_codigo_'+cnt_ingreso_microbiologia+'" name="lote_codigo[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="muestreador_'+cnt_ingreso_microbiologia+'" name="muestreador[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha_muestreo_'+cnt_ingreso_procesado+'" name="fecha_muestreo[]"><div class="invalid-feedback">Ingrese fecha con el formato DD/MM/YYYY</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="analisis_1_'+cnt_ingreso_microbiologia+'" name="analisis_1[]"><div class="invalid-feedback">Seleccione un análisis</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="analisis_2_'+cnt_ingreso_microbiologia+'" name="analisis_2[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="analisis_3_'+cnt_ingreso_microbiologia+'" name="analisis_3[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="analisis_4_'+cnt_ingreso_microbiologia+'" name="analisis_4[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="analisis_5_'+cnt_ingreso_microbiologia+'" name="analisis_5[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="analisis_6_'+cnt_ingreso_microbiologia+'" name="analisis_6[]"></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="metodo_referencia_'+cnt_ingreso_microbiologia+'" name="metodo_referencia[]"></td><td><button type="button" class="btn btn-danger" onclick="quitar_fila_micro('+cnt_ingreso_microbiologia+')"><i class="fa fa-trash"></i></button></td></tr>');

    cnt_ingreso_microbiologia+=1;
    // El datepicker que se agrega activarlo
    //$(".datepicker" ).datepicker();
}

function quitar_fila_micro(id){
    $('.fila-tabla-micro').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}


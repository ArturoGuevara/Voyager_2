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
    $("select[name='analisis1[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#primer-analisis-'+id);
    });
}
function agregar_fila_procesado(){
    var opcionesAnalisis = '';
    for(var i = 0; i < analisis.length ;i++){
        opcionesAnalisis+='<option value="'+analisis[i][0]+'">'+analisis[i][1]+'</option>';
    }
    var retro = '</select><div class="invalid-feedback">Seleccione un análisis</div></td>';
    var retro2 = '</select></td>';
    
    
    $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado" data-id="'+cnt_ingreso_procesado+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tipo-muestra-'+cnt_ingreso_procesado+'" name="tipoMuestra[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="descripcion-muestra-'+cnt_ingreso_procesado+'" name="descripcionMuestra[]"><div class="invalid-feedback">Este campo no puede estar vacía</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha-muestreo-'+cnt_ingreso_procesado+'" name="fechaMuestreo[]"><div class="invalid-feedback">Ingrese fecha con el formato DD/MM/YYYY</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="primer-analisis-'+cnt_ingreso_procesado+'" name="analisis1[]">'+opcionesAnalisis+retro+'<td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="segundo-analisis-'+cnt_ingreso_procesado+'" name="analisis2[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+retro2+'<td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="tercer-analisis-'+cnt_ingreso_procesado+'" name="analisis3[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+retro2+'<td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="cuarto-analisis-'+cnt_ingreso_procesado+'" name="analisis4[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+retro2+'<td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="quinto-analisis-'+cnt_ingreso_procesado+'" name="analisis5[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+retro2+'<td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="sexto-analisis-'+cnt_ingreso_procesado+'" name="analisis6[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+retro2+'<td><button type="button" class="btn btn-danger" onclick="quitar_filar_procesado('+cnt_ingreso_procesado+')"><i class="fa fa-trash"></i></button></td></tr>');
    
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
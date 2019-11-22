var cnt_ingreso_agricola = 1;
var cnt_ingreso_procesado = 1;
var cnt_ingreso_microbiologia = 1;

var opcionesAnalisis = '';
for(var i = 0; i < analisis.length ;i++){
    opcionesAnalisis+='<option value="'+analisis[i][0]+'">'+analisis[i][1]+'</option>';
}
var retro = '</select><div class="invalid-feedback">Seleccione un análisis</div></td>';
var retro2 = '</select></td>';

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

/* FUNCIONES PARA AGREGAR Y QUITAR FILAS A CADA FORMATO */
function agregar_fila_agricola(){}
function quitar_fila_agricola(){}

function agregar_fila_procesado(){
    $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado" data-id="'+cnt_ingreso_procesado+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tipo-muestraPR-'+cnt_ingreso_procesado+'" name="tipoMuestraPR[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="descripcion-muestraPR-'+cnt_ingreso_procesado+'" name="descripcionMuestraPR[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha-muestreoPR-'+cnt_ingreso_procesado+'" name="fechaMuestreoPR[]"><div class="invalid-feedback">Ingrese fecha con el formato DD/MM/YYYY</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="primer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis1PR[]">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="segundo-analisisPR-'+cnt_ingreso_procesado+'" name="analisis2PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="tercer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis3PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="cuarto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis4PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="quinto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis5PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="sexto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis6PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" onclick="quitar_fila_procesado('+cnt_ingreso_procesado+')"><i class="fa fa-trash"></i></button></td></tr>');
    
    cnt_ingreso_procesado+=1;
    // El datepicker que se agrega activarlo
    $(".datepicker" ).datepicker();
}
function quitar_fila_procesado(id){
    $('.fila-tabla-procesado').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}

function agregar_fila_micro(){    
    $('#tabla-microbiologia-body').append('<tr class="fila-tabla-micro" data-id="'+cnt_ingreso_microbiologia+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="tipo-muestraMB-'+cnt_ingreso_microbiologia+'" name="tipoMuestraMB[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="lote-codigoMB-'+cnt_ingreso_microbiologia+'" name="loteCodigoMB[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="muestreadorMB-'+cnt_ingreso_microbiologia+'" name="muestreadorMB[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_microbiologia+'" id="fecha-muestreoMB-'+cnt_ingreso_microbiologia+'" name="fechaMuestreoMB[]"><div class="invalid-feedback">Ingrese fecha con el formato DD/MM/YYYY</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="metodo-referenciaMB-'+cnt_ingreso_microbiologia+'" name="metodoReferenciaMB[]"><div class="invalid-feedback">Este campo no puede estar vacío</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="primer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis1MB[]">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="segundo-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis2MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="tercer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis3MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="cuarto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis4MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="quinto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis5MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="sexto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis6MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" onclick="quitar_fila_micro('+cnt_ingreso_microbiologia+')"><i class="fa fa-trash"></i></button></td></tr>');
    
    cnt_ingreso_microbiologia+=1;
    // El datepicker que se agrega activarlo
    $(".datepicker" ).datepicker();
}
function quitar_fila_micro(id){
    $('.fila-tabla-micro').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}

/* FUNCIONES PARA VALIDAR LOS CAMPOS DE CADA FORMATO */
function validar_ingreso_muestra(){
    validar_producto_procesado();
    validar_producto_microbiologia();
    // validar_producto_agricola();
}
function validar_producto_agricola(){}
function validar_producto_procesado(){
    // Validamos los arreglos de inputs
    $("input[name='tipoMuestraPR[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#tipo-muestraPR-'+id);
    });
    $("input[name='descripcionMuestraPR[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#descripcion-muestraPR-'+id);
    });
    $("input[name='fechaMuestreoPR[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#fecha-muestreoPR-'+id);
        //check_is_date($(this).val(),'#fecha-muestreoPR-'+id);
    });
    $("select[name='analisis1PR[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#primer-analisisPR-'+id);
    });
}
function validar_producto_microbiologia(){
    // Validamos los arreglos de inputs
    $("input[name='tipoMuestraMB[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#tipo-muestraMB-'+id);
    });
    $("input[name='loteCodigoMB[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#lote-codigoMB-'+id);
    });
    $("input[name='fechaMuestreoMB[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#fecha-muestreoMB-'+id);
        //check_is_date($(this).val(),'#fecha-muestreoMB-'+id);
    });
    $("input[name='muestreadorMB[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#muestreadorMB-'+id);
    });
    $("select[name='analisis1MB[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#primer-analisisMB-'+id);
    });
    $("input[name='metodoReferenciaMB[]']").each(function(){
        var id = $(this).data('id');
        check_is_not_empty($(this).val(),'#metodo-referenciaMB-'+id);
    });
}
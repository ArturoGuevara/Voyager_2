var cnt_ingreso_agricola = 0, cnt_ingreso_procesado = 0, cnt_ingreso_microbiologia = 0;
var cnt_quitar_agricola = 0, cnt_quitar_procesado = 0, cnt_quitar_microbiologia = 0;

var hidden_flag_agr = 0, hidden_flag_pro = 0, hidden_flag_mic = 0;

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

$(document).ready(function(){
    
});

$('.btn-plantilla').click(function(){
    // Obtenemos el target del contenedor que se tiene que desplegar
    var target = $(this).data('target');
    if(target === 'agricola'){
        // Si es el que actualmente está clickeado
        if($(this).hasClass('clicked')){
            $('#containerProductoAgricola').collapse('hide');
            $(this).removeClass('clicked text-white bg-warning');
        }else{ // Si es la primera vez que se clickea
            $('.btn-plantilla').removeClass('clicked text-white bg-warning bg-success bg-secondary');
            $('.formato-container-collapse').collapse('hide');
            $('#containerProductoAgricola').collapse('show');
            $(this).addClass('clicked text-white bg-warning');
        }
    }else if(target === 'procesado'){
        // Si es el que actualmente está clickeado
        if($(this).hasClass('clicked')){
            $('#containerProductoProcesado').collapse('hide');
            $(this).removeClass('clicked text-white bg-success');
        }else{ // Si es la primera vez que se clickea
            $('.btn-plantilla').removeClass('clicked text-white bg-warning bg-success bg-secondary');
            $('.formato-container-collapse').collapse('hide');
            $('#containerProductoProcesado').collapse('show');
            $(this).addClass('clicked text-white bg-success');
        }
    }else if(target === 'microbiologia'){
        // Si es el que actualmente está clickeado
        if($(this).hasClass('clicked')){
            $('#containerProductoMicrobiologia').collapse('hide');
            $(this).removeClass('clicked text-white bg-secondary');
        }else{ // Si es la primera vez que se clickea
            $('.btn-plantilla').removeClass('clicked text-white bg-warning bg-success bg-secondary');
            $('.formato-container-collapse').collapse('hide');
            $('#containerProductoMicrobiologia').collapse('show');
            $(this).addClass('clicked text-white bg-secondary');
        }
    }
});

/* FUNCIONES PARA AGREGAR Y QUITAR FILAS A CADA FORMATO */
function agregar_fila_agricola(){
    if(cnt_ingreso_agricola === 0){
        $('#tabla-agricola-body').append('<tr class="fila-tabla-agricola d-none"><td><input type="text" class="form-control" id="productoAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="variedadAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="pais-origenAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="codigo-muestraAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="proveedorAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div><input type="hidden" value="0" class="form-control" id="codigo-trazabilidadAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="agricultorAG-init" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="direccionAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" id="parcelaAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" id="ubicacion-muestreoAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" id="fecha-muestreoAG-init"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" id="urgenteAG-init"><option value="Sí">Sí</option><option value="No">No</option></select>'+retro+'</td><td><input type="text"  class="form-control" id="muestreadorAG-init" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" id="pais-destinoAG-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><select class="custom-select" id="primer-analisisAG-init">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" id="segundo-analisisAG-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="tercer-analisisAG-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="cuarto-analisisAG-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="quinto-analisisAG-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="sexto-analisisAG-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button disabled type="button" class="btn btn-danger"><i class="fa fa-trash"></i></button></td></tr>');
        
        $('#tabla-agricola-body').append('<tr class="fila-tabla-agricola" data-id="'+cnt_ingreso_agricola+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="productoAG-'+cnt_ingreso_agricola+'" name="productoAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="variedadAG-'+cnt_ingreso_agricola+'" name="variedadAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="pais-origenAG-'+cnt_ingreso_agricola+'" name="paisOrigenAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="codigo-muestraAG-'+cnt_ingreso_agricola+'" name="codigoMuestraAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="proveedorAG-'+cnt_ingreso_agricola+'" name="proveedorAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div><input type="hidden" value="0" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="codigo-trazabilidadAG-'+cnt_ingreso_agricola+'" name="codigoTrazabilidadAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="agricultorAG-'+cnt_ingreso_agricola+'" name="agricultorAG[]" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="direccionAG-'+cnt_ingreso_agricola+'" name="direccionAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="parcelaAG-'+cnt_ingreso_agricola+'" name="parcelaAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="ubicacion-muestreoAG-'+cnt_ingreso_agricola+'" name="ubicacionMuestreoAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" data-id="'+cnt_ingreso_agricola+'" id="fecha-muestreoAG-'+cnt_ingreso_agricola+'" name="fechaMuestreoAG[]"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="urgenteAG-'+cnt_ingreso_agricola+'" name="urgenteAG[]"><option value="Sí">Sí</option><option value="No">No</option></select>'+retro+'</td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="muestreadorAG-'+cnt_ingreso_agricola+'" name="muestreadorAG[]" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_agricola+'" id="pais-destinoAG-'+cnt_ingreso_agricola+'" name="paisDestinoAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="primer-analisisAG-'+cnt_ingreso_agricola+'" name="analisis1AG[]"><option selected></option>'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="segundo-analisisAG-'+cnt_ingreso_agricola+'" name="analisis2AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="tercer-analisisAG-'+cnt_ingreso_agricola+'" name="analisis3AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="cuarto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis4AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="quinto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis5AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="sexto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis6AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" data-id="'+cnt_ingreso_agricola+'" onclick="quitar_fila_agricola('+cnt_ingreso_agricola+')"><i class="fa fa-trash"></i></button></td></tr>');

        cnt_ingreso_agricola+=1;
        // El datepicker que se agrega activarlo
        $(".datepicker" ).datepicker();
    }else{
        if(hidden_flag_agr === 0){
            var producto = $('#productoAG-0').val(), 
                variedad = $('#variedadAG-0').val(),
                pais_origen = $('#pais-origenAG-0').val(),
                codigo_muestra = $('#codigo-muestraAG-0').val(),
                proveedor = $('#proveedorAG-0').val(),
                codigo_trazabilidad = $('#codigo-trazabilidadAG-0').val(),
                ubicacion_muestreo = $('#ubicacion-muestreoAG-0').val(),
                direccion = $('#direccionAG-0').val(),
                parcela = $('#parcelaAG-0').val(),
                fecha_muestreo = $('#fecha-muestreoAG-0').val(),
                pais_destino = $('#pais-destinoAG-0').val()
            ;
            if(producto !== '' && variedad !== '' && pais_origen !== '' && codigo_muestra !== '' && proveedor !== '' && codigo_trazabilidad !== '' && ubicacion_muestreo !== '' && direccion !== '' && parcela !== '' && fecha_muestreo !== '' && pais_destino !== ''){
                $('#productoAG-init').val(producto); 
                $('#variedadAG-init').val(variedad);
                $('#pais-origenAG-init').val(pais_origen);
                $('#codigo-muestraAG-init').val(codigo_muestra);
                $('#proveedorAG-init').val(proveedor);
                $('#codigo-trazabilidadAG-init').val(codigo_trazabilidad);
                $('#ubicacion-muestreoAG-init').val(ubicacion_muestreo);
                $('#direccionAG-init').val(direccion);
                $('#parcelaAG-init').val(parcela);
                $('#fecha-muestreoAG-init').val(fecha_muestreo);
                $('#pais-destinoAG-init').val(pais_destino);
                hidden_flag_agr = 1;   
            }
        }else{
           var producto = $('#productoAG-init').val(), 
                variedad = $('#variedadAG-init').val(),
                pais_origen = $('#pais-origenAG-init').val(),
                codigo_muestra = $('#codigo-muestraAG-init').val(),
                proveedor = $('#proveedorAG-init').val(),
                codigo_trazabilidad = $('#codigo-trazabilidadAG-init').val(),
                ubicacion_muestreo = $('#ubicacion-muestreoAG-init').val(),
                direccion = $('#direccionAG-init').val(),
                parcela = $('#parcelaAG-init').val(),
                fecha_muestreo = $('#fecha-muestreoAG-init').val(),
                pais_destino = $('#pais-destinoAG-init').val()
            ;
        }
        if(producto !== '' && variedad !== '' && pais_origen !== '' && codigo_muestra !== '' && proveedor !== '' && codigo_trazabilidad !== '' && ubicacion_muestreo !== '' && direccion !== '' && parcela !== '' && fecha_muestreo !== '' && pais_destino !== ''){
            if(cnt_ingreso_agricola-cnt_quitar_agricola !== 30){
                $('#tabla-agricola-body').append('<tr class="fila-tabla-agricola" data-id="'+cnt_ingreso_agricola+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="productoAG-'+cnt_ingreso_agricola+'" name="productoAG[]" value="'+producto+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="variedadAG-'+cnt_ingreso_agricola+'" name="variedadAG[]" value="'+variedad+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="pais-origenAG-'+cnt_ingreso_agricola+'" name="paisOrigenAG[]" value="'+pais_origen+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="codigo-muestraAG-'+cnt_ingreso_agricola+'" name="codigoMuestraAG[]"  value="'+codigo_muestra+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="proveedorAG-'+cnt_ingreso_agricola+'" name="proveedorAG[]" value="'+proveedor+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="codigo-trazabilidadAG-'+cnt_ingreso_agricola+'" name="codigoTrazabilidadAG[]" value="'+codigo_trazabilidad+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="agricultorAG-'+cnt_ingreso_agricola+'" name="agricultorAG[]" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="direccionAG-'+cnt_ingreso_agricola+'" name="direccionAG[]"  value="'+direccion+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="parcelaAG-'+cnt_ingreso_agricola+'" name="parcelaAG[]" value="'+parcela+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="ubicacion-muestreoAG-'+cnt_ingreso_agricola+'" name="ubicacionMuestreoAG[]" value="'+ubicacion_muestreo+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_agricola+'" id="fecha-muestreoAG-'+cnt_ingreso_agricola+'" name="fechaMuestreoAG[]" value="'+fecha_muestreo+'"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="urgenteAG-'+cnt_ingreso_agricola+'" name="urgenteAG[]"><option value="Sí">Sí</option><option value="No">No</option></select>'+retro+'</td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="muestreadorAG-'+cnt_ingreso_agricola+'" name="muestreadorAG[]" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="pais-destinoAG-'+cnt_ingreso_agricola+'" name="paisDestinoAG[]" value="'+pais_destino+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="primer-analisisAG-'+cnt_ingreso_agricola+'" name="analisis1AG[]"><option selected></option>'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="segundo-analisisAG-'+cnt_ingreso_agricola+'" name="analisis2AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="tercer-analisisAG-'+cnt_ingreso_agricola+'" name="analisis3AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="cuarto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis4AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="quinto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis5AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="sexto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis6AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" data-id="'+cnt_ingreso_agricola+'" onclick="quitar_fila_agricola('+cnt_ingreso_agricola+')"><i class="fa fa-trash"></i></button></td></tr>');

                cnt_ingreso_agricola+=1;
                // El datepicker que se agrega activarlo
                $(".datepicker" ).datepicker();
            }
            else{
                showNotificationWarning('top','right','No puede añadir más muestras en este formato, ya llegó al límite de 30.');
            }
        }else{
            showNotificationDanger('top', 'right', 'Por favor llené la primera fila de datos');
        }
    }
}
function quitar_fila_agricola(id){
    $('.fila-tabla-agricola').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
    cnt_quitar_agricola+=1;
}

function agregar_fila_procesado(){
    if(cnt_ingreso_procesado === 0){
        $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado d-none"><td><input type="text" class="form-control" id="tipo-muestraPR-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control"id="descripcion-muestraPR-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control datepicker" id="fecha-muestreoPR-init"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" id="primer-analisisPR-'+cnt_ingreso_procesado+'">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" id="segundo-analisisPR-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="tercer-analisisPR-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="cuarto-analisisPR-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="quinto-analisisPR-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="sexto-analisisPR-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger"><i class="fa fa-trash"></i></button></td></tr>');
        
        $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado" data-id="'+cnt_ingreso_procesado+'"><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tipo-muestraPR-'+cnt_ingreso_procesado+'" name="tipoMuestraPR[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_procesado+'" id="descripcion-muestraPR-'+cnt_ingreso_procesado+'" name="descripcionMuestraPR[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha-muestreoPR-'+cnt_ingreso_procesado+'" name="fechaMuestreoPR[]"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="primer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis1PR[]"><option selected></option>'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="segundo-analisisPR-'+cnt_ingreso_procesado+'" name="analisis2PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="tercer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis3PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="cuarto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis4PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="quinto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis5PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="sexto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis6PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" data-id="'+cnt_ingreso_procesado+'" onclick="quitar_fila_procesado('+cnt_ingreso_procesado+')"><i class="fa fa-trash"></i></button></td></tr>');

        cnt_ingreso_procesado+=1;
        // El datepicker que se agrega activarlo
        $(".datepicker" ).datepicker();
    }else{
        if(hidden_flag_pro === 0){
            var tipo_muestra = $('#tipo-muestraPR-0').val(),
                descripcion_muestra = $('#descripcion-muestraPR-0').val(),
                fecha_muestreo = $('#fecha-muestreoPR-0').val()
            ;
            if(tipo_muestra !== '' && descripcion_muestra !== '' && fecha_muestreo !== ''){
                $('#tipo-muestraPR-init').val(tipo_muestra),
                $('#descripcion-muestraPR-init').val(descripcion_muestra),
                $('#fecha-muestreoPR-init').val(fecha_muestreo);
                hidden_flag_pro = 1;   
            }
        }else{
            var tipo_muestra = $('#tipo-muestraPR-init').val(),
                descripcion_muestra = $('#descripcion-muestraPR-init').val(),
                fecha_muestreo = $('#fecha-muestreoPR-init').val()
            ;
        }
        if(tipo_muestra !== '' && descripcion_muestra !== '' && fecha_muestreo !== ''){
            if(cnt_ingreso_procesado-cnt_quitar_procesado !== 30){
                $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado" data-id="'+cnt_ingreso_procesado+'"><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tipo-muestraPR-'+cnt_ingreso_procesado+'" name="tipoMuestraPR[]" value="'+tipo_muestra+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_procesado+'" id="descripcion-muestraPR-'+cnt_ingreso_procesado+'" name="descripcionMuestraPR[]" value="'+descripcion_muestra+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha-muestreoPR-'+cnt_ingreso_procesado+'" name="fechaMuestreoPR[]" value="'+fecha_muestreo+'"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="primer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis1PR[]"><option selected></option>'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="segundo-analisisPR-'+cnt_ingreso_procesado+'" name="analisis2PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="tercer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis3PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="cuarto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis4PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="quinto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis5PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="sexto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis6PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" data-id="'+cnt_ingreso_procesado+'" onclick="quitar_fila_procesado('+cnt_ingreso_procesado+')"><i class="fa fa-trash"></i></button></td></tr>');

                cnt_ingreso_procesado+=1;
                // El datepicker que se agrega activarlo
                $(".datepicker" ).datepicker();
            }else{
                showNotificationWarning('top','right','No puede añadir más muestras en este formato, ya llegó al límite de 30.');
            }
        }else{
            showNotificationDanger('top', 'right', 'Por favor llené la primera fila de datos');
        }
    }
}
function quitar_fila_procesado(id){
    $('.fila-tabla-procesado').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
    cnt_quitar_procesado+=1;
}

function agregar_fila_micro(){
    if(cnt_ingreso_microbiologia === 0){
        $('#tabla-microbiologia-body').append('<tr class="fila-tabla-micro d-none"><td><input type="text"  class="form-control" id="tipo-muestraMB-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" id="lote-codigoMB-init"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" id="muestreadorMB-init" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" id="fecha-muestreoMB-init"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><input type="text"  class="form-control" id="metodo-referenciaMB-init"><div class="invalid-feedback">Si seleccionó n muestras, ingrese n métodos de referencia separados por comas</div></td><td><select class="custom-select" id="primer-analisisMB-init">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" id="segundo-analisisMB-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="tercer-analisisMB-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="cuarto-analisisMB-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="quinto-analisisMB-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" id="sexto-analisisMB-init"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger"><i class="fa fa-trash"></i></button></td></tr>');
        
        $('#tabla-microbiologia-body').append('<tr class="fila-tabla-micro" data-id="'+cnt_ingreso_microbiologia+'"><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="tipo-muestraMB-'+cnt_ingreso_microbiologia+'" name="tipoMuestraMB[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="lote-codigoMB-'+cnt_ingreso_microbiologia+'" name="loteCodigoMB[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="muestreadorMB-'+cnt_ingreso_microbiologia+'" name="muestreadorMB[]" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" data-id="'+cnt_ingreso_microbiologia+'" id="fecha-muestreoMB-'+cnt_ingreso_microbiologia+'" name="fechaMuestreoMB[]"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="metodo-referenciaMB-'+cnt_ingreso_microbiologia+'" name="metodoReferenciaMB[]"><div class="invalid-feedback">Si seleccionó n muestras, ingrese n métodos de referencia separados por comas</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="primer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis1MB[]"><option selected></option>'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="segundo-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis2MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="tercer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis3MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="cuarto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis4MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="quinto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis5MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="sexto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis6MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" data-id="'+cnt_ingreso_microbiologia+'" onclick="quitar_fila_micro('+cnt_ingreso_microbiologia+')"><i class="fa fa-trash"></i></button></td></tr>');

        cnt_ingreso_microbiologia+=1;
        // El datepicker que se agrega activarlo
        $(".datepicker" ).datepicker();
    }else{
        if(hidden_flag_mic === 0){
            var tipo_muestra = $('#tipo-muestraMB-0').val(),
                lote_codigo = $('#lote-codigoMB-0').val(),
                fecha = $('#fecha-muestreoMB-0').val(),
                metodo_referencia = $('#metodo-referenciaMB-0').val()
            ;
            if(tipo_muestra !== '' && lote_codigo !== '' && fecha !== '' && metodo_referencia !== ''){
                $('#tipo-muestraMB-init').val(tipo_muestra),
                $('#lote-codigoMB-init').val(lote_codigo),
                $('#fecha-muestreoMB-init').val(fecha),
                $('#metodo-referenciaMB-init').val(metodo_referencia)
                hidden_flag_mic = 1;
            }
        }else{
            var tipo_muestra = $('#tipo-muestraMB-init').val(),
                lote_codigo = $('#lote-codigoMB-init').val(),
                fecha = $('#fecha-muestreoMB-init').val(),
                metodo_referencia = $('#metodo-referenciaMB-init').val()
            ;
        }
        if(tipo_muestra !== '' && lote_codigo !== '' && fecha !== '' && metodo_referencia !== ''){
            if(cnt_ingreso_microbiologia-cnt_quitar_microbiologia !== 30){
                $('#tabla-microbiologia-body').append('<tr class="fila-tabla-micro" data-id="'+cnt_ingreso_microbiologia+'"><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="tipo-muestraMB-'+cnt_ingreso_microbiologia+'" name="tipoMuestraMB[]" value="'+tipo_muestra+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="lote-codigoMB-'+cnt_ingreso_microbiologia+'" name="loteCodigoMB[]" value="'+lote_codigo+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="muestreadorMB-'+cnt_ingreso_microbiologia+'" name="muestreadorMB[]" value="'+nombre_usuario+'"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text"  class="form-control datepicker" data-id="'+cnt_ingreso_microbiologia+'" id="fecha-muestreoMB-'+cnt_ingreso_microbiologia+'" name="fechaMuestreoMB[]" value="'+fecha+'"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><input type="text"  class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="metodo-referenciaMB-'+cnt_ingreso_microbiologia+'" name="metodoReferenciaMB[]" value="'+metodo_referencia+'"><div class="invalid-feedback">Ingrese texto separado por comas</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="primer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis1MB[]"><option selected></option>'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="segundo-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis2MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="tercer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis3MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="cuarto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis4MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="quinto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis5MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="sexto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis6MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" data-id="'+cnt_ingreso_microbiologia+'" onclick="quitar_fila_micro('+cnt_ingreso_microbiologia+')"><i class="fa fa-trash"></i></button></td></tr>');

                cnt_ingreso_microbiologia+=1;
                // El datepicker que se agrega activarlo
                $(".datepicker" ).datepicker();
            }else{
                showNotificationWarning('top','right','No puede añadir más muestras en este formato, ya llegó al límite de 30.');
            }
        }else{
            showNotificationDanger('top', 'right', 'Por favor llené la primera fila de datos');
        }
    }
}
function quitar_fila_micro(id){
    $('.fila-tabla-micro').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
    cnt_quitar_microbiologia+=1;
}

/* FUNCIONES PARA VALIDAR LOS CAMPOS DE CADA FORMATO */
function validar_ingreso_muestra(){
    var v1 = validar_producto_procesado();
    var v2 = validar_producto_microbiologia();
    var v3 = validar_producto_agricola();
    if (v1 == "vacío" && v2 == "vacío" && v3 == "vacío"){ //Si las tres funciones regresaron "vacío" significa que no se agregó ninguna muestra
        showNotificationWarning('top','right','Por favor, ingrese una muestra');
    }else if(v1 == false || v2 == false || v3 == false){//Si una sola es false, significa que un input está vacío o incorrecto
        showNotificationWarning('top','right','Por favor, revise sus datos');
    }else{
        // Agregamos el valor de las muestras por formato a la alerta
        $('#qnt-muestras-micro').html(cnt_ingreso_microbiologia-cnt_quitar_microbiologia);
        $('#qnt-muestras-pro').html(cnt_ingreso_procesado-cnt_quitar_procesado);
        $('#qnt-muestras-agr').html(cnt_ingreso_agricola-cnt_quitar_agricola);
        $('#envio_orden').modal('show');
    }
}
function validar_producto_agricola(){// Validamos los arreglos de inputs
    var flag = "vacío"; //Esta bandera se hará false con un solo campo que no cumpla el formato, si no encuentra ningún campo, permanecerá como "vacío"
    var v;
    $("input[name='productoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#productoAG-'+id);
        flag = v;
    });
    $("input[name='variedadAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#variedadAG-'+id);
        flag = flag && v;
    });
    $("input[name='paisOrigenAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#pais-origenAG-'+id);
        flag = flag && v;
    });
    $("input[name='codigoMuestraAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#codigo-muestraAG-'+id);
        flag = flag && v;
    });
    $("input[name='proveedorAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#proveedorAG-'+id);
        flag = flag && v;
    });
    $("input[name='codigoTrazabilidadAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#codigo-trazabilidadAG-'+id);
        flag = flag && v;
    });
    $("input[name='agricultorAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#agricultorAG-'+id);
        flag = flag && v;
    });
    $("input[name='direccionAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#direccionAG-'+id);
        flag = flag && v;
    });
    $("input[name='parcelaAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#parcelaAG-'+id);
        flag = flag && v;
    });
    $("input[name='ubicacionMuestreoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#ubicacion-muestreoAG-'+id);
        flag = flag && v;
    });
    $("input[name='urgenteAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#urgenteAG-'+id);
        flag = flag && v;
    });
    $("input[name='fechaMuestreoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#fecha-muestreoAG-'+id);
        flag = flag && v;
        v = date_is_valid($(this).val(),'#fecha-muestreoAG-'+id);
        flag = flag && v;
    });
    $("input[name='muestreadorAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#muestreadorAG-'+id);
        flag = flag && v;
    });
    $("input[name='paisDestinoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#pais-destinoAG-'+id);
        flag = flag && v;
    });
    $("select[name='analisis1AG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#primer-analisisAG-'+id);
        flag = flag && v;
    });
    return flag;
}
function validar_producto_procesado(){// Validamos los arreglos de inputs
    var flag = "vacío"; //Esta bandera se hará false con un solo campo que no cumpla el formato, si no encuentra ningún campo, permanecerá como "vacío"
    var v;
    $("input[name='tipoMuestraPR[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#tipo-muestraPR-'+id);
        flag = v;
    });
    $("input[name='descripcionMuestraPR[]']").each(function(){
        var id = $(this).data('id');
        v =check_not_commas_empty($(this).val(),'#descripcion-muestraPR-'+id);
        flag = flag && v;
    });
    $("input[name='fechaMuestreoPR[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#fecha-muestreoPR-'+id);
        flag = flag && v;
        v = date_is_valid($(this).val(),'#fecha-muestreoPR-'+id);
        flag = flag && v;
    });
    $("select[name='analisis1PR[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#primer-analisisPR-'+id);
        flag = flag && v;
    });
    return flag;
}
function validar_producto_microbiologia(){// Validamos los arreglos de inputs
    var flag = "vacío"; //Esta bandera se hará false con un solo campo que no cumpla el formato, si no encuentra ningún campo, permanecerá como "vacio"
    var v;
    $("input[name='tipoMuestraMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#tipo-muestraMB-'+id);
        flag = v;
    });
    $("input[name='loteCodigoMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#lote-codigoMB-'+id);
        flag = flag && v;
    });
    $("input[name='fechaMuestreoMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#fecha-muestreoMB-'+id);
        flag = flag && v;
        v = date_is_valid($(this).val(),'#fecha-muestreoMB-'+id);
        flag = flag && v;
    });
    $("input[name='muestreadorMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#muestreadorMB-'+id);
        flag = flag && v;
    });
    $("input[name='metodoReferenciaMB[]']").each(function(){
        var id = $(this).data('id');
        var number = 0;
        if($("#segundo-analisisMB-"+id).val() != null && $("#segundo-analisisMB-"+id).val() != '' && $("#segundo-analisisMB-"+id).val() != '-1'){
            number += 1;
        }
        if($("#tercer-analisisMB-"+id).val() != null && $("#tercer-analisisMB-"+id).val() != '' && $("#tercer-analisisMB-"+id).val() != '-1'){
            number += 1;
        }
        if($("#cuarto-analisisMB-"+id).val() != null && $("#cuarto-analisisMB-"+id).val() != '' && $("#cuarto-analisisMB-"+id).val() != '-1'){
            number += 1;
        }
        if($("#quinto-analisisMB-"+id).val() != null && $("#quinto-analisisMB-"+id).val() != '' && $("#quinto-analisisMB-"+id).val() != '-1'){
            number += 1;
        }
        if($("#sexto-analisisMB-"+id).val() != null && $("#sexto-analisisMB-"+id).val() != '' && $("#sexto-analisisMB-"+id).val() != '-1'){
            number += 1;
        }
        v = check_commas_number($(this).val(),'#metodo-referenciaMB-'+id, number);
        flag = flag && v;
    });
    $("select[name='analisis1MB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#primer-analisisMB-'+id);
        flag = flag && v;
    });
    return flag;
}

function enviar_ingreso_muestra(){
    // Obtener valor de los inputs
    var nombre = $('#nombre').val();
    var direccion = $('#direccion').val();
    var pais = $('#pais').val();
    var estado = $('#estado').val();
    var idioma = $('#idioma').val();

    // Información de formato agrícola (19 arreglos)
    var matrixAG = []
    var productoAG = iterar_input("productoAG","input");
    var variedadAG = iterar_input("variedadAG","input");
    var paisOrigenAG = iterar_input("paisOrigenAG","input");
    var codigoMuestraAG = iterar_input("codigoMuestraAG","input");
    var proveedorAG = iterar_input("proveedorAG","input");
    var codigoTrazabilidadAG = iterar_input("codigoTrazabilidadAG","input");
    var agricultorAG = iterar_input("agricultorAG","input");
    var direccionAG = iterar_input("direccionAG","input");
    var parcelaAG = iterar_input("parcelaAG","input");
    var ubicacionMuestreoAG = iterar_input("ubicacionMuestreoAG","input");
    var fechaMuestreoAG = iterar_input("fechaMuestreoAG","input");
    var urgenteAG = iterar_input("urgenteAG","select");
    var muestreadorAG = iterar_input("muestreadorAG","input");
    var paisDestinoAG = iterar_input("paisDestinoAG","input");
    var analisis1AG = iterar_input("analisis1AG","select");
    var analisis2AG = iterar_input("analisis2AG","select");
    var analisis3AG = iterar_input("analisis3AG","select");
    var analisis4AG = iterar_input("analisis4AG","select");
    var analisis5AG = iterar_input("analisis5AG","select");
    var analisis6AG = iterar_input("analisis6AG","select");
    // Guardamos los arreglos en otro arreglo
    matrixAG.push(productoAG);matrixAG.push(variedadAG);
    matrixAG.push(paisOrigenAG);matrixAG.push(codigoMuestraAG);
    matrixAG.push(proveedorAG);matrixAG.push(codigoTrazabilidadAG);
    matrixAG.push(agricultorAG);matrixAG.push(direccionAG);
    matrixAG.push(parcelaAG);matrixAG.push(ubicacionMuestreoAG);
    matrixAG.push(fechaMuestreoAG);matrixAG.push(urgenteAG);
    matrixAG.push(muestreadorAG);matrixAG.push(paisDestinoAG);
    matrixAG.push(analisis1AG);matrixAG.push(analisis2AG);matrixAG.push(analisis3AG);
    matrixAG.push(analisis4AG);matrixAG.push(analisis5AG);matrixAG.push(analisis6AG);

    // Información de formato de producto procesado (8 arreglos)
    var matrixPR = [];
    var tipoMuestraPR = iterar_input("tipoMuestraPR","input");
    var descripcionMuestraPR = iterar_input("descripcionMuestraPR","input");
    var fechaMuestreoPR = iterar_input("fechaMuestreoPR","input");
    var analisis1PR = iterar_input("analisis1PR","select");
    var analisis2PR = iterar_input("analisis2PR","select");
    var analisis3PR = iterar_input("analisis3PR","select");
    var analisis4PR = iterar_input("analisis4PR","select");
    var analisis5PR = iterar_input("analisis5PR","select");
    var analisis6PR = iterar_input("analisis6PR","select");
    // Guardamos los arreglos en otro arreglo
    matrixPR.push(tipoMuestraPR);
    matrixPR.push(descripcionMuestraPR);
    matrixPR.push(fechaMuestreoPR);
    matrixPR.push(analisis1PR);matrixPR.push(analisis2PR);matrixPR.push(analisis3PR);
    matrixPR.push(analisis4PR);matrixPR.push(analisis5PR);matrixPR.push(analisis6PR);

    // Información de formato de microbiología (10 arreglos)
    var matrixMB = [];
    var tipoMuestraMB = iterar_input("tipoMuestraMB","input");
    var loteCodigoMB = iterar_input("loteCodigoMB","input");
    var muestreadorMB = iterar_input("muestreadorMB","input");
    var fechaMuestreoMB = iterar_input("fechaMuestreoMB","input");
    var metodoReferenciaMB = iterar_input_coma("metodoReferenciaMB","input");
    var analisis1MB = iterar_input("analisis1MB","select");
    var analisis2MB = iterar_input("analisis2MB","select");
    var analisis3MB = iterar_input("analisis3MB","select");
    var analisis4MB = iterar_input("analisis4MB","select");
    var analisis5MB = iterar_input("analisis5MB","select");
    var analisis6MB = iterar_input("analisis6MB","select");
    // Guardamos los arreglos en otro arreglo
    matrixMB.push(tipoMuestraMB);matrixMB.push(loteCodigoMB);matrixMB.push(muestreadorMB);
    matrixMB.push(fechaMuestreoMB);matrixMB.push(metodoReferenciaMB);
    matrixMB.push(analisis1MB);matrixMB.push(analisis2MB);matrixMB.push(analisis3MB);
    matrixMB.push(analisis4MB);matrixMB.push(analisis5MB);matrixMB.push(analisis6MB);

    // Obtenemos el token de django para el ajax
    var token = csrftoken;

    $.ajax({
        url: "registrar_ingreso_muestra",
        dataType: 'json',
        // Seleccionar información que se mandara al controlador
        data: {
            'csrfmiddlewaretoken': token,
            nombre: nombre,
            direccion: direccion,
            pais: pais,
            estado: estado,
            idioma: idioma,
            'matrixAG[]': matrixAG,
            'matrixPR[]': matrixPR,
            'matrixMB[]': matrixMB
        },
        type: "POST",
        success: function (response) {
            $('#envio_orden').modal('hide'); //Cierra el modal que pide confirmación
            showNotificationSuccess('top','right','Se han registrado sus muestras exitosamente.');//Mostrar notificación de envío exitoso
            showNotificationWarning('top', 'right', 'La página se refrescará en un momento');
            $('#ingreso-cliente-form').remove();
            $('#opciones_guardado').remove();
            window.setTimeout( function(){
                window.location='ingreso_cliente'
            }, 3000 ); //Tras unos segundos, recargar la página
        },
        error: function (data) {
            $('#envio_orden').modal('hide'); //Cierra el modal que pide confirmación
            showNotificationDanger('top','right','Ha ocurrido un error. Inténtelo de nuevo más tarde.');//Mostrar notificación de envío exitoso
        }
    });
}

function iterar_input(name, type){
    var aux = [];
    $(type+"[name='"+name+"[]']").each(function () {
        aux.push($(this).val());
    });
    return aux;
}

function iterar_input_coma(name, type){
    var aux = [];
    $(type+"[name='"+name+"[]']").each(function () {
        aux.push($(this).val().replace(/,/g, '|°|')); //|°| sirve como un separador para cada uno de los métodos de referencia
    });
    return aux;
}